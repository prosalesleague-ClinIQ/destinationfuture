import Anthropic from "@anthropic-ai/sdk";
import type { SectionKey } from "@destination-future/core";
import { calculateFullNumerology } from "@destination-future/core";
import { calculateSolarAstrology } from "@destination-future/core";
import { buildSystemPrompt, buildSectionPrompt } from "@destination-future/prompts";
import type { PromptContext } from "@destination-future/prompts";

const anthropic = new Anthropic();

export interface GenerateReportInput {
  userId: string;
  profile: {
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
    stylePreference?: string;
    musicPreference?: string;
    goals: string[];
  };
  selectedSections: SectionKey[];
  outputDepth: "concise" | "standard" | "deep";
}

interface SectionOutput {
  section_key: string;
  enabled: boolean;
  title: string;
  assumptions: string[];
  limits: string[];
  summary: string;
  details: Record<string, unknown>;
  actions: string[];
  scores: Record<string, number>;
  ui_blocks: unknown[];
}

async function generateSectionWithClaude(
  systemPrompt: string,
  sectionPrompt: { systemPrompt: string; userPrompt: string },
  sectionKey: SectionKey,
  retries = 2
): Promise<SectionOutput> {
  const combinedSystem = `${systemPrompt}\n\n--- SECTION-SPECIFIC INSTRUCTIONS ---\n${sectionPrompt.systemPrompt}`;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        system: combinedSystem,
        messages: [
          {
            role: "user",
            content: sectionPrompt.userPrompt,
          },
        ],
      });

      const text =
        response.content[0].type === "text" ? response.content[0].text : "";

      // Extract JSON from response — handle markdown code blocks
      const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) || [
        null,
        text,
      ];
      const jsonStr = (jsonMatch[1] || text).trim();

      const parsed = JSON.parse(jsonStr) as SectionOutput;

      // Ensure section_key matches
      parsed.section_key = sectionKey;
      parsed.enabled = true;

      // Fill in defaults for any missing fields
      parsed.assumptions = parsed.assumptions || [];
      parsed.limits = parsed.limits || [];
      parsed.summary = parsed.summary || "";
      parsed.details = parsed.details || {};
      parsed.actions = parsed.actions || [];
      parsed.scores = parsed.scores || {};
      parsed.ui_blocks = parsed.ui_blocks || [];

      return parsed;
    } catch (err) {
      if (attempt === retries) {
        console.error(
          `Failed to generate section ${sectionKey} after ${retries + 1} attempts:`,
          err
        );
        // Return a fallback section
        return {
          section_key: sectionKey,
          enabled: true,
          title: sectionKey
            .replace(/_/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase()),
          assumptions: [],
          limits: ["This section encountered a generation error and used fallback content"],
          summary: `Unable to generate ${sectionKey} at this time. Please try regenerating this section.`,
          details: {},
          actions: ["Try regenerating this section"],
          scores: {},
          ui_blocks: [
            {
              type: "paragraph",
              content: `This section could not be generated. Please try again or select fewer sections.`,
            },
          ],
        };
      }
      // Wait briefly before retry
      await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
    }
  }

  // Unreachable but TypeScript needs it
  throw new Error("Unreachable");
}

export async function generateReport(input: GenerateReportInput) {
  const startTime = Date.now();

  // Step 1: Run deterministic engines
  const dob = new Date(input.profile.dob);
  const fullName = [
    input.profile.firstName,
    input.profile.middleName,
    input.profile.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  const numerologyData = calculateFullNumerology(
    dob,
    fullName,
    new Date().getFullYear()
  );
  const astrologyData = calculateSolarAstrology(
    dob,
    !!input.profile.birthTime
  );

  // Step 2: Build prompt context
  const ctx: PromptContext = {
    ...input.profile,
    selectedSections: input.selectedSections,
    outputDepth: input.outputDepth,
    numerologyData: numerologyData as unknown as Record<string, unknown>,
    astrologyData: astrologyData as unknown as Record<string, unknown>,
  };

  // Step 3: Build system prompt
  const systemPrompt = buildSystemPrompt(ctx);

  // Step 4: Generate sections — batch in groups of 3 for parallelism
  const sections: SectionOutput[] = [];
  const batchSize = 3;

  for (let i = 0; i < input.selectedSections.length; i += batchSize) {
    const batch = input.selectedSections.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(async (sectionKey) => {
        const prompts = buildSectionPrompt(sectionKey, ctx);
        if (!prompts) {
          return {
            section_key: sectionKey,
            enabled: true,
            title: sectionKey
              .replace(/_/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase()),
            assumptions: [],
            limits: [],
            summary: "Section prompt not found",
            details: {},
            actions: [],
            scores: {},
            ui_blocks: [],
          } as SectionOutput;
        }
        return generateSectionWithClaude(
          systemPrompt,
          prompts,
          sectionKey
        );
      })
    );
    sections.push(...batchResults);
  }

  // Step 5: Inject deterministic data into numerology and astrology sections
  const numSection = sections.find((s) => s.section_key === "numerology_core");
  if (numSection) {
    numSection.details = {
      ...numSection.details,
      calculatedData: numerologyData,
    };
  }

  const astroSection = sections.find(
    (s) => s.section_key === "astrology_cosmology"
  );
  if (astroSection) {
    astroSection.details = {
      ...astroSection.details,
      calculatedData: astrologyData,
    };
  }

  const generationTimeMs = Date.now() - startTime;

  return {
    sections,
    meta: {
      totalTokensUsed: sections.length * 800, // Approximate
      generationTimeMs,
      promptVersion: "1.0.0",
      inputHash: Buffer.from(JSON.stringify(input.profile))
        .toString("base64")
        .slice(0, 16),
    },
  };
}

export async function generateSingleSection(
  input: GenerateReportInput,
  sectionKey: SectionKey
) {
  const dob = new Date(input.profile.dob);
  const fullName = [
    input.profile.firstName,
    input.profile.middleName,
    input.profile.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  const numerologyData = calculateFullNumerology(
    dob,
    fullName,
    new Date().getFullYear()
  );
  const astrologyData = calculateSolarAstrology(
    dob,
    !!input.profile.birthTime
  );

  const ctx: PromptContext = {
    ...input.profile,
    selectedSections: [sectionKey],
    outputDepth: input.outputDepth,
    numerologyData: numerologyData as unknown as Record<string, unknown>,
    astrologyData: astrologyData as unknown as Record<string, unknown>,
  };

  const systemPrompt = buildSystemPrompt(ctx);
  const prompts = buildSectionPrompt(sectionKey, ctx);

  if (!prompts) {
    throw new Error(`No prompt config for section: ${sectionKey}`);
  }

  return generateSectionWithClaude(systemPrompt, prompts, sectionKey);
}
