import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "./error-handler";

export interface AuthPayload {
  userId: string;
  email: string;
  tier: "FREE" | "PREMIUM";
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    throw new AppError(401, "Authentication required", "AUTH_REQUIRED");
  }

  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;
    req.user = payload;
    next();
  } catch {
    throw new AppError(401, "Invalid or expired token", "INVALID_TOKEN");
  }
}

export function requirePremium(req: Request, _res: Response, next: NextFunction) {
  if (!req.user) {
    throw new AppError(401, "Authentication required", "AUTH_REQUIRED");
  }
  if (req.user.tier !== "PREMIUM") {
    throw new AppError(403, "Premium subscription required", "PREMIUM_REQUIRED");
  }
  next();
}
