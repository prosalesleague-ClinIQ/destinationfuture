import type { SectionKey } from "@destination-future/core";

export interface PromptContext {
  firstName: string;
  middleName?: string;
  lastName?: string;
  dob: string;
  birthTime?: string | null;
  birthCity: string;
  birthState?: string;
  birthCountry: string;
  currentCity?: string;
  currentState?: string;
  currentCountry?: string;
  relationshipStatus?: string;
  careerField?: string;
  budgetRange?: string;
  stylePreferences?: string[];
  musicPreferences?: string[];
  goals: string[];
  selectedSections: SectionKey[];
  outputDepth: "concise" | "standard" | "deep";
  numerologyData?: Record<string, unknown>;
  astrologyData?: Record<string, unknown>;
}

export interface SectionPromptConfig {
  key: SectionKey;
  title: string;
  systemInstructions: string;
  userPromptTemplate: (ctx: PromptContext) => string;
  outputSchema: Record<string, unknown>;
  version: string;
}
