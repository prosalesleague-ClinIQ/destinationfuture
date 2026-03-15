import type { SectionKey } from "@destination-future/core";
import type { PromptContext, SectionPromptConfig } from "./types";
import { SECTION_PROMPTS } from "./sections";

export function buildSectionPrompt(
  sectionKey: SectionKey,
  ctx: PromptContext
): { systemPrompt: string; userPrompt: string } | null {
  const config = SECTION_PROMPTS[sectionKey];
  if (!config) return null;

  return {
    systemPrompt: config.systemInstructions,
    userPrompt: config.userPromptTemplate(ctx),
  };
}

export function buildBatchPrompt(
  sections: SectionKey[],
  ctx: PromptContext
): string {
  const sectionInstructions = sections
    .map((key) => {
      const config = SECTION_PROMPTS[key];
      if (!config) return null;
      return `--- SECTION: ${config.title} (key: ${key}) ---\n${config.userPromptTemplate(ctx)}`;
    })
    .filter(Boolean)
    .join("\n\n");

  return `Generate the following report sections. Return each as a separate JSON object in a JSON array.

${sectionInstructions}

Return a JSON array where each element matches the output format specified in the system prompt.`;
}
