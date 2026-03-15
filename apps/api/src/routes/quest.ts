import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/auth";
import { AppError } from "../middleware/error-handler";
import { XP_VALUES, getXpProgress } from "@destination-future/core";

export const questRouter = Router();

// ─── Schemas ─────────────────────────────────────────────────

const completeQuestSchema = z.object({
  reflectionText: z.string().max(2000).optional(),
});

// ─── GET / ───────────────────────────────────────────────────
// List available quests for user's current level

questRouter.get("/", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user!.userId;

    // Calculate user's current level from XP
    const xpEntries = await prisma.xpLedger.findMany({
      where: { userId },
      select: { amount: true },
    });
    const totalXp = xpEntries.reduce((sum, e) => sum + e.amount, 0);
    const progress = getXpProgress(totalXp);
    const userLevel = progress.currentLevel.level;

    // Get all quests unlocked at or below user's level
    const quests = await prisma.quest.findMany({
      where: { unlockLevel: { lte: userLevel } },
      orderBy: [{ unlockLevel: "asc" }, { xpReward: "asc" }],
    });

    // Get user's quest statuses
    const userQuests = await prisma.userQuest.findMany({
      where: { userId },
      select: { questId: true, status: true, completedAt: true },
    });
    const questStatusMap = new Map(userQuests.map((uq) => [uq.questId, uq]));

    const questsWithStatus = quests.map((quest) => {
      const userQuest = questStatusMap.get(quest.id);
      return {
        id: quest.id,
        code: quest.code,
        title: quest.title,
        description: quest.description,
        questType: quest.questType,
        xpReward: quest.xpReward,
        unlockLevel: quest.unlockLevel,
        modeScope: quest.modeScope,
        status: userQuest?.status ?? "available",
        completedAt: userQuest?.completedAt ?? null,
      };
    });

    res.json({
      quests: questsWithStatus,
      userLevel,
      totalXp,
    });
  } catch (err) {
    next(err);
  }
});

// ─── POST /:questId/start ───────────────────────────────────

questRouter.post("/:questId/start", requireAuth, async (req, res, next) => {
  try {
    const { questId } = req.params;
    const userId = req.user!.userId;

    // Verify quest exists
    const quest = await prisma.quest.findUnique({ where: { id: questId } });
    if (!quest) {
      throw new AppError(404, "Quest not found", "QUEST_NOT_FOUND");
    }

    // Check user level
    const xpEntries = await prisma.xpLedger.findMany({
      where: { userId },
      select: { amount: true },
    });
    const totalXp = xpEntries.reduce((sum, e) => sum + e.amount, 0);
    const progress = getXpProgress(totalXp);

    if (progress.currentLevel.level < quest.unlockLevel) {
      throw new AppError(
        403,
        `Quest requires level ${quest.unlockLevel}. You are level ${progress.currentLevel.level}.`,
        "LEVEL_REQUIRED"
      );
    }

    // Check if already started or completed
    const existing = await prisma.userQuest.findUnique({
      where: { userId_questId: { userId, questId } },
    });

    if (existing?.status === "active") {
      throw new AppError(400, "Quest already in progress", "QUEST_ALREADY_ACTIVE");
    }

    if (existing?.status === "completed") {
      throw new AppError(400, "Quest already completed", "QUEST_ALREADY_COMPLETED");
    }

    const userQuest = await prisma.userQuest.upsert({
      where: { userId_questId: { userId, questId } },
      create: { userId, questId, status: "active" },
      update: { status: "active" },
    });

    res.json({
      userQuest: {
        id: userQuest.id,
        questId: userQuest.questId,
        status: userQuest.status,
      },
      quest: {
        title: quest.title,
        description: quest.description,
        xpReward: quest.xpReward,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ─── POST /:questId/complete ─────────────────────────────────

questRouter.post("/:questId/complete", requireAuth, async (req, res, next) => {
  try {
    const { questId } = req.params;
    const userId = req.user!.userId;
    const data = completeQuestSchema.parse(req.body);

    // Verify quest exists
    const quest = await prisma.quest.findUnique({ where: { id: questId } });
    if (!quest) {
      throw new AppError(404, "Quest not found", "QUEST_NOT_FOUND");
    }

    // Check quest is active for this user
    const userQuest = await prisma.userQuest.findUnique({
      where: { userId_questId: { userId, questId } },
    });

    if (!userQuest || userQuest.status !== "active") {
      throw new AppError(400, "Quest must be started before completing", "QUEST_NOT_ACTIVE");
    }

    if (userQuest.status === "completed") {
      throw new AppError(400, "Quest already completed", "QUEST_ALREADY_COMPLETED");
    }

    // Complete the quest and award XP in a transaction
    const xpAmount = quest.xpReward || XP_VALUES.quest_complete;

    const [updatedQuest] = await prisma.$transaction([
      prisma.userQuest.update({
        where: { userId_questId: { userId, questId } },
        data: {
          status: "completed",
          completedAt: new Date(),
          reflectionText: data.reflectionText,
        },
      }),
      prisma.xpLedger.create({
        data: { userId, source: "quest_complete", amount: xpAmount },
      }),
    ]);

    // Calculate new XP total
    const xpEntries = await prisma.xpLedger.findMany({
      where: { userId },
      select: { amount: true },
    });
    const totalXp = xpEntries.reduce((sum, e) => sum + e.amount, 0);
    const progress = getXpProgress(totalXp);

    res.json({
      userQuest: {
        id: updatedQuest.id,
        questId: updatedQuest.questId,
        status: updatedQuest.status,
        completedAt: updatedQuest.completedAt,
      },
      xpAwarded: xpAmount,
      totalXp,
      level: progress.currentLevel,
      progress: progress.progressPercent,
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

// ─── GET /active ─────────────────────────────────────────────

questRouter.get("/active", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user!.userId;

    const activeQuests = await prisma.userQuest.findMany({
      where: { userId, status: "active" },
      include: {
        quest: true,
      },
      orderBy: { quest: { xpReward: "desc" } },
    });

    res.json({
      quests: activeQuests.map((uq) => ({
        userQuestId: uq.id,
        questId: uq.quest.id,
        code: uq.quest.code,
        title: uq.quest.title,
        description: uq.quest.description,
        questType: uq.quest.questType,
        xpReward: uq.quest.xpReward,
        modeScope: uq.quest.modeScope,
        status: uq.status,
      })),
    });
  } catch (err) {
    next(err);
  }
});
