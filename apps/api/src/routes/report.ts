import { Router } from "express";
import { z } from "zod";
import { SECTION_KEYS, SECTION_REGISTRY } from "@destination-future/core";
import type { SectionKey } from "@destination-future/core";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/auth";
import { AppError } from "../middleware/error-handler";
import { generateReport } from "../services/report-generator";

export const reportRouter = Router();

// ─── Free-tier allowed sections ──────────────────────────────

const FREE_SECTIONS: SectionKey[] = SECTION_KEYS.filter(
  (key) => !SECTION_REGISTRY[key].premiumOnly
);

// ─── Schemas ─────────────────────────────────────────────────

const generateSchema = z.object({
  selectedSections: z
    .array(z.enum(SECTION_KEYS as unknown as [string, ...string[]]))
    .min(1, "At least one section is required"),
  presetKey: z.string().max(100).optional(),
  outputDepth: z.enum(["concise", "standard", "deep"]).default("standard"),
});

const regenerateSectionSchema = z.object({
  sectionKey: z.enum(SECTION_KEYS as unknown as [string, ...string[]]),
  outputDepth: z.enum(["concise", "standard", "deep"]).default("standard"),
});

// ─── POST /generate ──────────────────────────────────────────

reportRouter.post("/generate", requireAuth, async (req, res, next) => {
  try {
    const data = generateSchema.parse(req.body);
    const userId = req.user!.userId;
    const tier = req.user!.tier;

    // Validate section access for free users
    if (tier === "FREE") {
      const disallowed = data.selectedSections.filter(
        (s) => !FREE_SECTIONS.includes(s as SectionKey)
      );
      if (disallowed.length > 0) {
        throw new AppError(
          403,
          `Premium sections not available on free tier: ${disallowed.join(", ")}`,
          "PREMIUM_REQUIRED"
        );
      }
    }

    // Load user profile
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user?.profile) {
      throw new AppError(400, "Profile required before generating a report. Complete onboarding first.", "PROFILE_REQUIRED");
    }

    const profile = user.profile;

    // Create mode session
    const modeSession = await prisma.modeSession.create({
      data: {
        userId,
        modeType: "SINGLE",
        selectedSectionsJson: data.selectedSections,
        presetName: data.presetKey,
        reportStatus: "GENERATING",
      },
    });

    // Generate report
    const startTime = Date.now();
    const result = await generateReport({
      userId,
      profile: {
        firstName: user.firstName,
        middleName: user.middleName ?? undefined,
        lastName: user.lastName ?? undefined,
        dob: profile.dob.toISOString().split("T")[0],
        birthTime: profile.birthTime,
        birthCity: profile.birthCity,
        birthState: profile.birthState ?? undefined,
        birthCountry: profile.birthCountry,
        currentCity: profile.currentCity ?? undefined,
        currentState: profile.currentState ?? undefined,
        currentCountry: profile.currentCountry ?? undefined,
        relationshipStatus: profile.relationshipStatus ?? undefined,
        careerField: profile.careerField ?? undefined,
        budgetRange: profile.budgetRange ?? undefined,
        stylePreferences: (profile.stylePreferencesJson as string[]) ?? [],
        musicPreferences: (profile.musicPreferencesJson as string[]) ?? [],
        goals: (profile.goalsJson as string[]) ?? [],
      },
      selectedSections: data.selectedSections as SectionKey[],
      outputDepth: data.outputDepth,
    });
    const generationTimeMs = Date.now() - startTime;

    // Save generated report
    const generatedReport = await prisma.generatedReport.create({
      data: {
        userId,
        modeSessionId: modeSession.id,
        selectedSectionsJson: data.selectedSections,
        inputSnapshotJson: {
          firstName: user.firstName,
          dob: profile.dob.toISOString(),
          birthCity: profile.birthCity,
          birthCountry: profile.birthCountry,
        },
        outputJson: result.sections as unknown as Record<string, unknown>[],
        summaryText: `Report with ${data.selectedSections.length} sections`,
      },
    });

    // Update session status
    await prisma.modeSession.update({
      where: { id: modeSession.id },
      data: { reportStatus: "COMPLETED" },
    });

    // Award XP for report generation
    await prisma.xpLedger.create({
      data: { userId, source: "report_generated", amount: 75 },
    });

    res.status(201).json({
      sessionId: modeSession.id,
      reportId: generatedReport.id,
      sections: result.sections,
      meta: {
        ...result.meta,
        generationTimeMs,
      },
      xpAwarded: 75,
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

// ─── GET /:sessionId ────────────────────────────────────────

reportRouter.get("/:sessionId", requireAuth, async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user!.userId;

    const session = await prisma.modeSession.findUnique({
      where: { id: sessionId },
      include: {
        generatedReports: {
          orderBy: { version: "desc" },
          take: 1,
        },
      },
    });

    if (!session) {
      throw new AppError(404, "Session not found", "SESSION_NOT_FOUND");
    }

    if (session.userId !== userId) {
      throw new AppError(403, "Access denied", "ACCESS_DENIED");
    }

    const latestReport = session.generatedReports[0] ?? null;

    res.json({
      session: {
        id: session.id,
        modeType: session.modeType,
        selectedSections: session.selectedSectionsJson,
        presetName: session.presetName,
        reportStatus: session.reportStatus,
        createdAt: session.createdAt,
      },
      report: latestReport
        ? {
            id: latestReport.id,
            version: latestReport.version,
            sections: latestReport.outputJson,
            summaryText: latestReport.summaryText,
            createdAt: latestReport.createdAt,
          }
        : null,
    });
  } catch (err) {
    next(err);
  }
});

// ─── POST /:reportId/regenerate-section ─────────────────────

reportRouter.post("/:reportId/regenerate-section", requireAuth, async (req, res, next) => {
  try {
    const data = regenerateSectionSchema.parse(req.body);
    const { reportId } = req.params;
    const userId = req.user!.userId;
    const tier = req.user!.tier;

    // Validate premium access for premium sections
    if (tier === "FREE" && !FREE_SECTIONS.includes(data.sectionKey as SectionKey)) {
      throw new AppError(403, "Premium section not available on free tier", "PREMIUM_REQUIRED");
    }

    const existingReport = await prisma.generatedReport.findUnique({
      where: { id: reportId },
      include: { modeSession: true },
    });

    if (!existingReport) {
      throw new AppError(404, "Report not found", "REPORT_NOT_FOUND");
    }

    if (existingReport.userId !== userId) {
      throw new AppError(403, "Access denied", "ACCESS_DENIED");
    }

    // Load user profile for regeneration
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user?.profile) {
      throw new AppError(400, "Profile required", "PROFILE_REQUIRED");
    }

    const profile = user.profile;

    // Regenerate single section
    const result = await generateReport({
      userId,
      profile: {
        firstName: user.firstName,
        middleName: user.middleName ?? undefined,
        lastName: user.lastName ?? undefined,
        dob: profile.dob.toISOString().split("T")[0],
        birthTime: profile.birthTime,
        birthCity: profile.birthCity,
        birthState: profile.birthState ?? undefined,
        birthCountry: profile.birthCountry,
        currentCity: profile.currentCity ?? undefined,
        currentState: profile.currentState ?? undefined,
        currentCountry: profile.currentCountry ?? undefined,
        relationshipStatus: profile.relationshipStatus ?? undefined,
        careerField: profile.careerField ?? undefined,
        budgetRange: profile.budgetRange ?? undefined,
        stylePreferences: (profile.stylePreferencesJson as string[]) ?? [],
        musicPreferences: (profile.musicPreferencesJson as string[]) ?? [],
        goals: (profile.goalsJson as string[]) ?? [],
      },
      selectedSections: [data.sectionKey as SectionKey],
      outputDepth: data.outputDepth,
    });

    // Merge regenerated section into existing output
    const existingOutput = existingReport.outputJson as unknown as Array<{
      section_key: string;
      [key: string]: unknown;
    }>;
    const regeneratedSection = result.sections[0];

    const updatedOutput = existingOutput.map((section) =>
      section.section_key === data.sectionKey ? regeneratedSection : section
    );

    // Create new version of the report
    const newReport = await prisma.generatedReport.create({
      data: {
        userId,
        modeSessionId: existingReport.modeSessionId,
        version: existingReport.version + 1,
        selectedSectionsJson: existingReport.selectedSectionsJson,
        inputSnapshotJson: existingReport.inputSnapshotJson,
        outputJson: updatedOutput as unknown as Record<string, unknown>[],
        summaryText: existingReport.summaryText,
      },
    });

    // Award XP for section regeneration
    await prisma.xpLedger.create({
      data: { userId, source: "section_regenerated", amount: 15 },
    });

    res.json({
      reportId: newReport.id,
      version: newReport.version,
      regeneratedSection,
      xpAwarded: 15,
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

// ─── GET /history ────────────────────────────────────────────

reportRouter.get("/history", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10));
    const offset = (page - 1) * limit;

    const [reports, total] = await prisma.$transaction([
      prisma.generatedReport.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        skip: offset,
        take: limit,
        select: {
          id: true,
          version: true,
          selectedSectionsJson: true,
          summaryText: true,
          createdAt: true,
          modeSession: {
            select: {
              id: true,
              modeType: true,
              presetName: true,
              reportStatus: true,
            },
          },
        },
      }),
      prisma.generatedReport.count({ where: { userId } }),
    ]);

    res.json({
      reports,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
});
