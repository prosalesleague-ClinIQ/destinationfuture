import type { SectionKey } from "./sections";

export interface SectionOutput {
  section_key: SectionKey;
  enabled: boolean;
  title: string;
  assumptions: string[];
  limits: string[];
  summary: string;
  details: Record<string, unknown>;
  actions: string[];
  scores: Record<string, number>;
  ui_blocks: UIBlock[];
}

export interface UIBlock {
  type: "heading" | "paragraph" | "list" | "numbered_list" | "table" | "score_bar" | "color_swatch" | "checklist" | "math" | "quote" | "card" | "divider" | "chart";
  content: unknown;
  label?: string;
}

export interface GeneratedReportOutput {
  reportId: string;
  userId: string;
  modeSessionId: string;
  version: number;
  generatedAt: string;
  selectedSections: SectionKey[];
  sections: SectionOutput[];
  meta: {
    totalTokensUsed: number;
    generationTimeMs: number;
    promptVersion: string;
    inputHash: string;
  };
}

export interface ReportGenerationRequest {
  userId: string;
  modeSessionId: string;
  selectedSections: SectionKey[];
  presetKey?: string;
  outputDepth: "concise" | "standard" | "deep";
}

export interface ReportRegenerateSectionRequest {
  reportId: string;
  sectionKey: SectionKey;
  outputDepth: "concise" | "standard" | "deep";
}
