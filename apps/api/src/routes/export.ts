import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/auth";
import { AppError } from "../middleware/error-handler";
import { exportToMarkdown, exportToJson, exportToPlainText } from "../services/export";

export const exportRouter = Router();

// GET /api/export/:reportId?format=markdown|json|text
exportRouter.get("/:reportId", requireAuth, async (req, res, next) => {
  try {
    const { reportId } = req.params;
    const format = (req.query.format as string) || "json";
    const userId = req.user!.userId;

    const report = await prisma.generatedReport.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      throw new AppError(404, "Report not found", "REPORT_NOT_FOUND");
    }

    if (report.userId !== userId) {
      throw new AppError(403, "Access denied", "ACCESS_DENIED");
    }

    const sections = report.outputJson as unknown as Array<Record<string, unknown>>;

    switch (format) {
      case "markdown": {
        const md = exportToMarkdown(sections as any);
        res.setHeader("Content-Type", "text/markdown; charset=utf-8");
        res.setHeader("Content-Disposition", `attachment; filename="destination-future-report-${reportId}.md"`);
        res.send(md);
        break;
      }
      case "text": {
        const text = exportToPlainText(sections as any);
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.setHeader("Content-Disposition", `attachment; filename="destination-future-report-${reportId}.txt"`);
        res.send(text);
        break;
      }
      case "json":
      default: {
        const json = exportToJson(sections as any, {
          reportId,
          version: report.version,
          createdAt: report.createdAt,
          selectedSections: report.selectedSectionsJson,
        });
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.setHeader("Content-Disposition", `attachment; filename="destination-future-report-${reportId}.json"`);
        res.send(json);
        break;
      }
    }
  } catch (err) {
    next(err);
  }
});
