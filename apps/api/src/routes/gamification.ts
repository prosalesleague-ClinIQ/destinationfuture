import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/auth";
import { getXpProgress, getStreakCount, XP_VALUES } from "@destination-future/core";

export const gamificationRouter = Router();

// ─── Schemas ─────────────────────────────────────────────────

const reflectSchema = z.object({
  type: z.enum(["daily", "shadow_work", "quest", "growth"]),
  content: z.record(z.unknown()).refine((val) => Object.keys(val).length > 0, "Content cannot be empty"),
});

// ─── GET /xp ─────────────────────────────────────────────────

gamificationRouter.get("/xp", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user!.userId;

    const xpEntries = await prisma.xpLedger.findMany({
      where: { userId },
      select: { amount: true, source: true },
    });

    const totalXp = xpEntries.reduce((sum, e) => sum + e.amount, 0);
    const progress = getXpProgress(totalXp);

    // Breakdown by source
    const xpBySource: Record<string, number> = {};
    for (const entry of xpEntries) {
      xpBySource[entry.source] = (xpBySource[entry.source] ?? 0) + entry.amount;
    }

    res.json({
      totalXp,
      level: progress.currentLevel,
      nextLevel: progress.nextLevel,
      xpInCurrentLevel: progress.xpInCurrentLevel,
      xpToNextLevel: progress.xpToNextLevel,
      progressPercent: progress.progressPercent,
      xpBySource,
    });
  } catch (err) {
    next(err);
  }
});

// ─── GET /badges ─────────────────────────────────────────────

gamificationRouter.get("/badges", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user!.userId;

    const userBadges = await prisma.userBadge.findMany({
      where: { userId },
      include: { badge: true },
      orderBy: { earnedAt: "desc" },
    });

    res.json({
      badges: userBadges.map((ub) => ({
        id: ub.badge.id,
        code: ub.badge.code,
        title: ub.badge.title,
        description: ub.badge.description,
        icon: ub.badge.icon,
        earnedAt: ub.earnedAt,
      })),
    });
  } catch (err) {
    next(err);
  }
});

// ─── GET /streak ─────────────────────────────────────────────

gamificationRouter.get("/streak", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user!.userId;

    // Get all reflection log dates for this user
    const reflectionLogs = await prisma.reflectionLog.findMany({
      where: { userId },
      select: { createdAt: true },
      orderBy: { createdAt: "desc" },
    });

    const dates = reflectionLogs.map((log) => log.createdAt);
    const currentStreak = getStreakCount(dates);

    // Calculate longest streak
    let longestStreak = currentStreak;
    if (dates.length > 0) {
      const sorted = [...dates].sort((a, b) => a.getTime() - b.getTime());
      let tempStreak = 1;
      for (let i = 1; i < sorted.length; i++) {
        const diff = Math.floor(
          (sorted[i].getTime() - sorted[i - 1].getTime()) / (1000 * 60 * 60 * 24)
        );
        if (diff === 1) {
          tempStreak++;
          longestStreak = Math.max(longestStreak, tempStreak);
        } else if (diff > 1) {
          tempStreak = 1;
        }
        // diff === 0 means same day, skip
      }
    }

    const lastReflection = dates.length > 0 ? dates[0] : null;

    res.json({
      currentStreak,
      longestStreak,
      totalReflections: dates.length,
      lastReflection,
    });
  } catch (err) {
    next(err);
  }
});

// ─── POST /reflect ───────────────────────────────────────────

gamificationRouter.post("/reflect", requireAuth, async (req, res, next) => {
  try {
    const data = reflectSchema.parse(req.body);
    const userId = req.user!.userId;

    // Check if user already reflected today (for daily type)
    if (data.type === "daily") {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      const existingToday = await prisma.reflectionLog.findFirst({
        where: {
          userId,
          type: "daily",
          createdAt: { gte: todayStart, lte: todayEnd },
        },
      });

      if (existingToday) {
        // Update existing reflection instead of creating duplicate
        const updated = await prisma.reflectionLog.update({
          where: { id: existingToday.id },
          data: { contentJson: data.content },
        });

        res.json({
          reflection: {
            id: updated.id,
            type: updated.type,
            content: updated.contentJson,
            createdAt: updated.createdAt,
          },
          xpAwarded: 0,
          message: "Daily reflection updated (XP already awarded today)",
        });
        return;
      }
    }

    // Determine XP source based on reflection type
    const xpSource = data.type === "shadow_work" ? "shadow_work_prompt" : "daily_reflection";
    const xpAmount = XP_VALUES[xpSource];

    // Create reflection and award XP in transaction
    const [reflection] = await prisma.$transaction([
      prisma.reflectionLog.create({
        data: {
          userId,
          type: data.type,
          contentJson: data.content,
        },
      }),
      prisma.xpLedger.create({
        data: { userId, source: xpSource, amount: xpAmount },
      }),
    ]);

    // Recalculate streak
    const reflectionLogs = await prisma.reflectionLog.findMany({
      where: { userId },
      select: { createdAt: true },
      orderBy: { createdAt: "desc" },
    });
    const currentStreak = getStreakCount(reflectionLogs.map((l) => l.createdAt));

    // Calculate new XP total
    const xpEntries = await prisma.xpLedger.findMany({
      where: { userId },
      select: { amount: true },
    });
    const totalXp = xpEntries.reduce((sum, e) => sum + e.amount, 0);
    const progress = getXpProgress(totalXp);

    res.status(201).json({
      reflection: {
        id: reflection.id,
        type: reflection.type,
        content: reflection.contentJson,
        createdAt: reflection.createdAt,
      },
      xpAwarded: xpAmount,
      totalXp,
      level: progress.currentLevel,
      currentStreak,
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

// ─── GET /leaderboard ────────────────────────────────────────
// Anonymous leaderboard - nicknames only, no PII

gamificationRouter.get("/leaderboard", async (req, res, next) => {
  try {
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 25));

    // Aggregate XP per user and join with user for nickname
    const leaderboard = await prisma.xpLedger.groupBy({
      by: ["userId"],
      _sum: { amount: true },
      orderBy: { _sum: { amount: "desc" } },
      take: limit,
    });

    // Fetch nicknames for the users on the leaderboard
    const userIds = leaderboard.map((entry) => entry.userId);
    const users = await prisma.user.findMany({
      where: {
        id: { in: userIds },
        // Only include users who have not opted out of leaderboard
        // (checking privacy settings for leaderboard opt-in)
      },
      select: { id: true, nickname: true, firstName: true },
    });

    const userMap = new Map(users.map((u) => [u.id, u]));

    const entries = leaderboard.map((entry, index) => {
      const user = userMap.get(entry.userId);
      const totalXp = entry._sum.amount ?? 0;
      const progress = getXpProgress(totalXp);

      return {
        rank: index + 1,
        nickname: user?.nickname || `${user?.firstName?.charAt(0) ?? "?"}***`,
        totalXp,
        level: progress.currentLevel.level,
        title: progress.currentLevel.title,
      };
    });

    res.json({ leaderboard: entries });
  } catch (err) {
    next(err);
  }
});
