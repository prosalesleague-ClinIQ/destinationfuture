import type { SectionOutput } from "../types/report";

export const SAMPLE_IDENTITY_SNAPSHOT: SectionOutput = {
  section_key: "identity_snapshot",
  enabled: true,
  title: "Identity Snapshot",
  assumptions: ["Based on birth data and name analysis"],
  limits: [],
  summary: "You are a Cancer Sun with a Life Path 6 — a deeply intuitive nurturer with a drive to create harmony, beauty, and emotional safety in every environment you enter.",
  details: {
    nameAndBirth: "Alex Jordan Rivera, born July 15, 1992, in Los Angeles, California",
    stableTraits: [
      "Emotionally perceptive — you read rooms and people with unusual accuracy",
      "Loyalty-driven — you commit deeply once trust is built",
      "Creative problem-solver — you find unconventional solutions",
      "Protective — you guard those you love fiercely",
      "Aesthetically tuned — you notice beauty, design, and environment quality",
    ],
    contextDependentTraits: [
      "Assertive in professional settings, accommodating in personal ones",
      "Outgoing in small groups, reserved in large crowds",
      "Decisive under pressure, overthinking during calm",
      "Risk-taking with ideas, risk-averse with finances",
      "Direct with close friends, diplomatic with acquaintances",
    ],
    topStrengths: [
      "Emotional intelligence that builds deep trust quickly",
      "Creative vision that connects ideas others miss",
      "Resilience that grows stronger through challenge",
    ],
    topFrictionPoints: [
      "Over-giving that leads to resentment when unreciprocated",
      "Difficulty letting go of people and situations past their expiration",
      "Comfort zone attachment that delays necessary growth moves",
    ],
    rankedNeeds: [
      "Emotional safety and trust",
      "Creative expression",
      "Financial stability",
      "Physical environment quality",
      "Meaningful relationships",
      "Personal growth",
      "Freedom to explore",
    ],
    identityStatement: "You are a guardian-creator — someone who builds beautiful, safe worlds for themselves and the people they love, while quietly carrying the vision for something bigger.",
    growthEdge: "Your growth edge is learning to release control over outcomes and trust that your worth isn't measured by how much you give. The next level of your life requires receiving as powerfully as you give.",
  },
  actions: [
    "Practice saying 'no' to one request per week without explaining why",
    "Start a daily 5-minute journaling practice focused on your own needs",
    "Identify one comfort zone behavior to challenge this month",
  ],
  scores: {
    emotionalIntelligence: 88,
    adaptability: 72,
    resilience: 80,
    selfAwareness: 75,
    growthReadiness: 82,
  },
  ui_blocks: [
    { type: "heading", content: "Identity Snapshot", label: "h2" },
    { type: "paragraph", content: "You are a Cancer Sun with a Life Path 6 — a deeply intuitive nurturer with a drive to create harmony, beauty, and emotional safety." },
    { type: "heading", content: "Stable Traits", label: "h3" },
    {
      type: "list",
      content: [
        "Emotionally perceptive — you read rooms and people with unusual accuracy",
        "Loyalty-driven — you commit deeply once trust is built",
        "Creative problem-solver — you find unconventional solutions",
        "Protective — you guard those you love fiercely",
        "Aesthetically tuned — you notice beauty, design, and environment quality",
      ],
    },
    { type: "heading", content: "Scores", label: "h3" },
    { type: "score_bar", content: { label: "Emotional Intelligence", value: 88 } },
    { type: "score_bar", content: { label: "Adaptability", value: 72 } },
    { type: "score_bar", content: { label: "Resilience", value: 80 } },
    { type: "score_bar", content: { label: "Self-Awareness", value: 75 } },
    { type: "score_bar", content: { label: "Growth Readiness", value: 82 } },
    { type: "heading", content: "Growth Edge", label: "h3" },
    { type: "quote", content: "Your growth edge is learning to release control over outcomes and trust that your worth isn't measured by how much you give." },
    { type: "heading", content: "Action Steps", label: "h3" },
    {
      type: "checklist",
      content: [
        { text: "Practice saying 'no' to one request per week without explaining why", checked: false },
        { text: "Start a daily 5-minute journaling practice focused on your own needs", checked: false },
        { text: "Identify one comfort zone behavior to challenge this month", checked: false },
      ],
    },
  ],
};

export const SAMPLE_REPORT_OUTPUT = {
  reportId: "sample-001",
  userId: "demo-user",
  modeSessionId: "session-001",
  version: 1,
  generatedAt: new Date().toISOString(),
  selectedSections: ["identity_snapshot"],
  sections: [SAMPLE_IDENTITY_SNAPSHOT],
  meta: {
    totalTokensUsed: 850,
    generationTimeMs: 3200,
    promptVersion: "1.0.0",
    inputHash: "abc123def456",
  },
};
