import type { Request, Response, NextFunction } from "express";
import { SECTION_REGISTRY, type SectionKey, SECTION_KEYS } from "@destination-future/core";
import { AppError } from "./error-handler";

/**
 * Middleware to validate section access based on user tier.
 * Checks the `selectedSections` field in the request body.
 */
export function validateSectionAccess(req: Request, _res: Response, next: NextFunction) {
  const tier = req.user?.tier;
  if (!tier) {
    throw new AppError(401, "Authentication required", "AUTH_REQUIRED");
  }

  const selectedSections = req.body?.selectedSections as string[] | undefined;
  if (!selectedSections || !Array.isArray(selectedSections)) {
    next();
    return;
  }

  if (tier === "PREMIUM") {
    next();
    return;
  }

  // Free tier — check each section
  const premiumSections = selectedSections.filter((key) => {
    const meta = SECTION_REGISTRY[key as SectionKey];
    return meta?.premiumOnly;
  });

  if (premiumSections.length > 0) {
    throw new AppError(
      403,
      `Upgrade to Premium to access: ${premiumSections.map((k) => SECTION_REGISTRY[k as SectionKey]?.title || k).join(", ")}`,
      "PREMIUM_REQUIRED"
    );
  }

  // Free tier section limit
  const maxFreeSections = 4;
  if (selectedSections.length > maxFreeSections) {
    throw new AppError(
      403,
      `Free tier is limited to ${maxFreeSections} sections per report. Upgrade to Premium for unlimited access.`,
      "SECTION_LIMIT"
    );
  }

  next();
}

/**
 * Middleware to check if user's level meets the section unlock requirements.
 * Requires user's current level to be passed (e.g., from XP lookup).
 */
export function validateLevelAccess(userLevel: number) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const selectedSections = req.body?.selectedSections as string[] | undefined;
    if (!selectedSections || !Array.isArray(selectedSections)) {
      next();
      return;
    }

    const lockedSections = selectedSections.filter((key) => {
      const meta = SECTION_REGISTRY[key as SectionKey];
      return meta && meta.unlockLevel > userLevel;
    });

    if (lockedSections.length > 0) {
      const details = lockedSections.map((key) => {
        const meta = SECTION_REGISTRY[key as SectionKey];
        return `${meta?.title || key} (requires level ${meta?.unlockLevel})`;
      });
      throw new AppError(
        403,
        `Some sections are locked at your current level: ${details.join(", ")}. Complete quests and earn XP to unlock them.`,
        "LEVEL_REQUIRED"
      );
    }

    next();
  };
}

/**
 * Returns which sections are available for a given tier and level.
 */
export function getAvailableSections(tier: "FREE" | "PREMIUM", level: number): SectionKey[] {
  return SECTION_KEYS.filter((key) => {
    const meta = SECTION_REGISTRY[key];
    if (tier === "FREE" && meta.premiumOnly) return false;
    if (meta.unlockLevel > level) return false;
    return true;
  }) as SectionKey[];
}
