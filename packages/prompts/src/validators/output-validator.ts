import type { SectionKey } from "@destination-future/core";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateSectionOutput(
  sectionKey: SectionKey,
  output: unknown
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!output || typeof output !== "object") {
    return { valid: false, errors: ["Output must be a non-null object"], warnings: [] };
  }

  const obj = output as Record<string, unknown>;

  // Required fields
  const requiredFields = ["section_key", "enabled", "title", "summary"];
  for (const field of requiredFields) {
    if (!(field in obj)) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // Validate section_key matches
  if (obj.section_key !== sectionKey) {
    errors.push(`section_key mismatch: expected "${sectionKey}", got "${obj.section_key}"`);
  }

  // Validate enabled is boolean
  if (typeof obj.enabled !== "boolean") {
    errors.push(`"enabled" must be a boolean`);
  }

  // Validate title is string
  if (typeof obj.title !== "string" || (obj.title as string).length === 0) {
    errors.push(`"title" must be a non-empty string`);
  }

  // Validate summary is string
  if (typeof obj.summary !== "string") {
    errors.push(`"summary" must be a string`);
  }

  // Optional arrays
  if ("assumptions" in obj && !Array.isArray(obj.assumptions)) {
    warnings.push(`"assumptions" should be an array`);
  }
  if ("limits" in obj && !Array.isArray(obj.limits)) {
    warnings.push(`"limits" should be an array`);
  }
  if ("actions" in obj && !Array.isArray(obj.actions)) {
    warnings.push(`"actions" should be an array`);
  }
  if ("ui_blocks" in obj && !Array.isArray(obj.ui_blocks)) {
    warnings.push(`"ui_blocks" should be an array`);
  }

  // Validate details is object
  if ("details" in obj && (typeof obj.details !== "object" || obj.details === null)) {
    warnings.push(`"details" should be an object`);
  }

  // Validate scores is object with numeric values
  if ("scores" in obj && typeof obj.scores === "object" && obj.scores !== null) {
    for (const [key, val] of Object.entries(obj.scores as Record<string, unknown>)) {
      if (typeof val !== "number" || val < 0 || val > 100) {
        warnings.push(`Score "${key}" should be a number between 0 and 100`);
      }
    }
  }

  // Validate ui_blocks structure
  if (Array.isArray(obj.ui_blocks)) {
    const validTypes = [
      "heading", "paragraph", "list", "numbered_list", "table",
      "score_bar", "color_swatch", "checklist", "math", "quote",
      "card", "divider", "chart",
    ];
    for (let i = 0; i < (obj.ui_blocks as unknown[]).length; i++) {
      const block = (obj.ui_blocks as Record<string, unknown>[])[i];
      if (!block || typeof block !== "object") {
        warnings.push(`ui_blocks[${i}] must be an object`);
        continue;
      }
      if (!validTypes.includes(block.type as string)) {
        warnings.push(`ui_blocks[${i}] has invalid type "${block.type}"`);
      }
      if (!("content" in block)) {
        warnings.push(`ui_blocks[${i}] missing "content" field`);
      }
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}

export function validateFullReport(
  sections: unknown[],
  expectedKeys: SectionKey[]
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!Array.isArray(sections)) {
    return { valid: false, errors: ["Report must be an array of sections"], warnings: [] };
  }

  const foundKeys = new Set<string>();
  for (const section of sections) {
    const result = validateSectionOutput(
      (section as Record<string, unknown>).section_key as SectionKey,
      section
    );
    errors.push(...result.errors);
    warnings.push(...result.warnings);
    foundKeys.add((section as Record<string, unknown>).section_key as string);
  }

  for (const key of expectedKeys) {
    if (!foundKeys.has(key)) {
      errors.push(`Missing expected section: ${key}`);
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}
