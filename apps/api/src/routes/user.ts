import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/auth";
import { AppError } from "../middleware/error-handler";

export const userRouter = Router();

// ─── Schemas ─────────────────────────────────────────────────

const profileSchema = z.object({
  dob: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date format"),
  birthTime: z.string().regex(/^\d{2}:\d{2}$/, "Birth time must be HH:mm format").nullable().optional(),
  birthCity: z.string().min(1, "Birth city is required").max(200),
  birthState: z.string().max(200).optional(),
  birthCountry: z.string().min(1, "Birth country is required").max(200),
  currentCity: z.string().max(200).optional(),
  currentState: z.string().max(200).optional(),
  currentCountry: z.string().max(200).optional(),
  relationshipStatus: z.string().max(100).optional(),
  careerField: z.string().max(200).optional(),
  budgetRange: z.string().max(100).optional(),
  stylePreferences: z.array(z.string().max(100)).max(10).optional(),
  musicPreferences: z.array(z.string().max(100)).max(10).optional(),
  goals: z.array(z.string().max(500)).max(20).optional(),
});

const onboardingSchema = z.object({
  firstName: z.string().min(1).max(100),
  middleName: z.string().max(100).optional(),
  lastName: z.string().max(100).optional(),
  nickname: z.string().max(50).optional(),
  dob: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date format"),
  birthTime: z.string().regex(/^\d{2}:\d{2}$/, "Birth time must be HH:mm format").nullable().optional(),
  birthCity: z.string().min(1).max(200),
  birthState: z.string().max(200).optional(),
  birthCountry: z.string().min(1).max(200),
  currentCity: z.string().max(200).optional(),
  currentState: z.string().max(200).optional(),
  currentCountry: z.string().max(200).optional(),
  relationshipStatus: z.string().max(100).optional(),
  careerField: z.string().max(200).optional(),
  budgetRange: z.string().max(100).optional(),
  stylePreferences: z.array(z.string().max(100)).max(10).optional(),
  musicPreferences: z.array(z.string().max(100)).max(10).optional(),
  goals: z.array(z.string().max(500)).max(20).optional(),
});

const secondProfileSchema = z.object({
  label: z.string().max(100).optional(),
  firstName: z.string().min(1).max(100),
  dob: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date format"),
  birthTime: z.string().regex(/^\d{2}:\d{2}$/, "Birth time must be HH:mm format").nullable().optional(),
  birthCity: z.string().min(1).max(200),
  birthState: z.string().max(200).optional(),
  birthCountry: z.string().min(1).max(200),
  relationshipType: z.enum(["romantic", "friendship", "family", "collaboration"]),
});

// ─── PUT /profile ────────────────────────────────────────────

userRouter.put("/profile", requireAuth, async (req, res, next) => {
  try {
    const data = profileSchema.parse(req.body);
    const userId = req.user!.userId;

    const profile = await prisma.profile.upsert({
      where: { userId },
      create: {
        userId,
        dob: new Date(data.dob),
        birthTime: data.birthTime ?? null,
        birthCity: data.birthCity,
        birthState: data.birthState,
        birthCountry: data.birthCountry,
        currentCity: data.currentCity,
        currentState: data.currentState,
        currentCountry: data.currentCountry,
        relationshipStatus: data.relationshipStatus,
        careerField: data.careerField,
        budgetRange: data.budgetRange,
        stylePreferencesJson: data.stylePreferences ?? [],
        musicPreferencesJson: data.musicPreferences ?? [],
        goalsJson: data.goals ?? [],
      },
      update: {
        dob: new Date(data.dob),
        birthTime: data.birthTime ?? null,
        birthCity: data.birthCity,
        birthState: data.birthState,
        birthCountry: data.birthCountry,
        currentCity: data.currentCity,
        currentState: data.currentState,
        currentCountry: data.currentCountry,
        relationshipStatus: data.relationshipStatus,
        careerField: data.careerField,
        budgetRange: data.budgetRange,
        stylePreferencesJson: data.stylePreferences ?? [],
        musicPreferencesJson: data.musicPreferences ?? [],
        goalsJson: data.goals ?? [],
      },
    });

    res.json({
      profile: {
        id: profile.id,
        dob: profile.dob,
        birthTime: profile.birthTime,
        birthCity: profile.birthCity,
        birthState: profile.birthState,
        birthCountry: profile.birthCountry,
        currentCity: profile.currentCity,
        currentState: profile.currentState,
        currentCountry: profile.currentCountry,
        relationshipStatus: profile.relationshipStatus,
        careerField: profile.careerField,
        budgetRange: profile.budgetRange,
        stylePreferences: profile.stylePreferencesJson,
        musicPreferences: profile.musicPreferencesJson,
        goals: profile.goalsJson,
        updatedAt: profile.updatedAt,
      },
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({
        error: { message: "Validation failed", code: "VALIDATION_ERROR", details: err.errors },
      });
      return;
    }
    next(err);
  }
});

// ─── GET /profile ────────────────────────────────────────────

userRouter.get("/profile", requireAuth, async (req, res, next) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.user!.userId },
    });

    if (!profile) {
      throw new AppError(404, "Profile not found. Complete onboarding first.", "PROFILE_NOT_FOUND");
    }

    res.json({
      profile: {
        id: profile.id,
        dob: profile.dob,
        birthTime: profile.birthTime,
        birthCity: profile.birthCity,
        birthState: profile.birthState,
        birthCountry: profile.birthCountry,
        currentCity: profile.currentCity,
        currentState: profile.currentState,
        currentCountry: profile.currentCountry,
        relationshipStatus: profile.relationshipStatus,
        careerField: profile.careerField,
        budgetRange: profile.budgetRange,
        stylePreferences: profile.stylePreferencesJson,
        musicPreferences: profile.musicPreferencesJson,
        goals: profile.goalsJson,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ─── PUT /onboarding ─────────────────────────────────────────

userRouter.put("/onboarding", requireAuth, async (req, res, next) => {
  try {
    const data = onboardingSchema.parse(req.body);
    const userId = req.user!.userId;

    const [user, profile] = await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: {
          firstName: data.firstName,
          middleName: data.middleName,
          lastName: data.lastName,
          nickname: data.nickname,
        },
      }),
      prisma.profile.upsert({
        where: { userId },
        create: {
          userId,
          dob: new Date(data.dob),
          birthTime: data.birthTime ?? null,
          birthCity: data.birthCity,
          birthState: data.birthState,
          birthCountry: data.birthCountry,
          currentCity: data.currentCity,
          currentState: data.currentState,
          currentCountry: data.currentCountry,
          relationshipStatus: data.relationshipStatus,
          careerField: data.careerField,
          budgetRange: data.budgetRange,
          stylePreference: data.stylePreference,
          musicPreference: data.musicPreference,
          goalsJson: data.goals ?? [],
        },
        update: {
          dob: new Date(data.dob),
          birthTime: data.birthTime ?? null,
          birthCity: data.birthCity,
          birthState: data.birthState,
          birthCountry: data.birthCountry,
          currentCity: data.currentCity,
          currentState: data.currentState,
          currentCountry: data.currentCountry,
          relationshipStatus: data.relationshipStatus,
          careerField: data.careerField,
          budgetRange: data.budgetRange,
          stylePreference: data.stylePreference,
          musicPreference: data.musicPreference,
          goalsJson: data.goals ?? [],
        },
      }),
    ]);

    // Award onboarding XP
    await prisma.xpLedger.create({
      data: { userId, source: "onboarding", amount: 100 },
    });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        nickname: user.nickname,
        tier: user.subscriptionTier,
      },
      profile: {
        id: profile.id,
        dob: profile.dob,
        birthTime: profile.birthTime,
        birthCity: profile.birthCity,
        birthState: profile.birthState,
        birthCountry: profile.birthCountry,
        currentCity: profile.currentCity,
        currentState: profile.currentState,
        currentCountry: profile.currentCountry,
        relationshipStatus: profile.relationshipStatus,
        careerField: profile.careerField,
        budgetRange: profile.budgetRange,
        stylePreferences: profile.stylePreferencesJson,
        musicPreferences: profile.musicPreferencesJson,
        goals: profile.goalsJson,
      },
      xpAwarded: 100,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({
        error: { message: "Validation failed", code: "VALIDATION_ERROR", details: err.errors },
      });
      return;
    }
    next(err);
  }
});

// ─── POST /second-profile ────────────────────────────────────

userRouter.post("/second-profile", requireAuth, async (req, res, next) => {
  try {
    const data = secondProfileSchema.parse(req.body);
    const userId = req.user!.userId;

    // Limit second profiles to 5 per user
    const count = await prisma.secondProfile.count({ where: { userId } });
    if (count >= 5) {
      throw new AppError(400, "Maximum of 5 second profiles allowed", "MAX_PROFILES_REACHED");
    }

    const secondProfile = await prisma.secondProfile.create({
      data: {
        userId,
        label: data.label,
        firstName: data.firstName,
        dob: new Date(data.dob),
        birthTime: data.birthTime ?? null,
        birthCity: data.birthCity,
        birthState: data.birthState,
        birthCountry: data.birthCountry,
        relationshipType: data.relationshipType,
      },
    });

    res.status(201).json({ secondProfile });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({
        error: { message: "Validation failed", code: "VALIDATION_ERROR", details: err.errors },
      });
      return;
    }
    next(err);
  }
});

// ─── GET /second-profiles ────────────────────────────────────

userRouter.get("/second-profiles", requireAuth, async (req, res, next) => {
  try {
    const secondProfiles = await prisma.secondProfile.findMany({
      where: { userId: req.user!.userId },
      orderBy: { dob: "asc" },
    });

    res.json({ secondProfiles });
  } catch (err) {
    next(err);
  }
});
