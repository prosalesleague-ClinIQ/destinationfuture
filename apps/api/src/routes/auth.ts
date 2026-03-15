import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/auth";
import { AppError } from "../middleware/error-handler";

export const authRouter = Router();

// ─── Schemas ─────────────────────────────────────────────────

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(1, "First name is required").max(100),
  middleName: z.string().max(100).optional(),
  lastName: z.string().max(100).optional(),
  nickname: z.string().max(50).optional(),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// ─── Helpers ─────────────────────────────────────────────────

function signToken(payload: { userId: string; email: string; tier: string }): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "7d" });
}

// ─── POST /register ──────────────────────────────────────────

authRouter.post("/register", async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      throw new AppError(409, "Email already registered", "EMAIL_EXISTS");
    }

    const passwordHash = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        nickname: data.nickname,
      },
    });

    const token = signToken({
      userId: user.id,
      email: user.email,
      tier: user.subscriptionTier,
    });

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        nickname: user.nickname,
        tier: user.subscriptionTier,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({
        error: {
          message: "Validation failed",
          code: "VALIDATION_ERROR",
          details: err.errors,
        },
      });
      return;
    }
    next(err);
  }
});

// ─── POST /login ─────────────────────────────────────────────

authRouter.post("/login", async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user || !user.passwordHash) {
      throw new AppError(401, "Invalid email or password", "INVALID_CREDENTIALS");
    }

    const valid = await bcrypt.compare(data.password, user.passwordHash);
    if (!valid) {
      throw new AppError(401, "Invalid email or password", "INVALID_CREDENTIALS");
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      tier: user.subscriptionTier,
    });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        nickname: user.nickname,
        tier: user.subscriptionTier,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({
        error: {
          message: "Validation failed",
          code: "VALIDATION_ERROR",
          details: err.errors,
        },
      });
      return;
    }
    next(err);
  }
});

// ─── POST /magic-link ────────────────────────────────────────

authRouter.post("/magic-link", (_req, res) => {
  res.status(501).json({
    error: { message: "Magic link authentication not yet implemented", code: "NOT_IMPLEMENTED" },
  });
});

// ─── GET /me ─────────────────────────────────────────────────

authRouter.get("/me", requireAuth, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      include: { profile: true },
    });

    if (!user) {
      throw new AppError(404, "User not found", "USER_NOT_FOUND");
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        nickname: user.nickname,
        tier: user.subscriptionTier,
        privacySettings: user.privacySettings,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        profile: user.profile
          ? {
              id: user.profile.id,
              dob: user.profile.dob,
              birthTime: user.profile.birthTime,
              birthCity: user.profile.birthCity,
              birthState: user.profile.birthState,
              birthCountry: user.profile.birthCountry,
              currentCity: user.profile.currentCity,
              currentState: user.profile.currentState,
              currentCountry: user.profile.currentCountry,
              relationshipStatus: user.profile.relationshipStatus,
              careerField: user.profile.careerField,
              budgetRange: user.profile.budgetRange,
              stylePreference: user.profile.stylePreference,
              musicPreference: user.profile.musicPreference,
              goals: user.profile.goalsJson,
            }
          : null,
      },
    });
  } catch (err) {
    next(err);
  }
});
