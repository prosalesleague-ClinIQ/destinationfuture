export interface XpConfig {
  source: XpSource;
  amount: number;
  description: string;
}

export type XpSource =
  | "onboarding_complete"
  | "birth_info_added"
  | "current_city_added"
  | "goals_selected"
  | "daily_reflection"
  | "shadow_work_prompt"
  | "city_exploration"
  | "relationship_exercise"
  | "profile_update"
  | "preferences_saved"
  | "module_read"
  | "quest_complete"
  | "report_generated"
  | "section_regenerated";

export const XP_VALUES: Record<XpSource, number> = {
  onboarding_complete: 100,
  birth_info_added: 50,
  current_city_added: 25,
  goals_selected: 25,
  daily_reflection: 15,
  shadow_work_prompt: 30,
  city_exploration: 20,
  relationship_exercise: 25,
  profile_update: 10,
  preferences_saved: 10,
  module_read: 20,
  quest_complete: 50,
  report_generated: 75,
  section_regenerated: 15,
};

export interface LevelDefinition {
  level: number;
  xpRequired: number;
  title: string;
  unlocksDescription: string;
}

export const LEVELS: LevelDefinition[] = [
  {
    level: 1,
    xpRequired: 0,
    title: "Seeker",
    unlocksDescription: "Intro identity, basic numerology, starter traits, one recommendation",
  },
  {
    level: 2,
    xpRequired: 200,
    title: "Explorer",
    unlocksDescription: "Expanded numerology, sun-sign insights, location starter, first quest chain",
  },
  {
    level: 3,
    xpRequired: 500,
    title: "Navigator",
    unlocksDescription: "Shadow work starter, career starter, hobbies, city suggestions",
  },
  {
    level: 4,
    xpRequired: 1000,
    title: "Architect",
    unlocksDescription: "Compatibility, deeper maps, current city analysis, style and music",
  },
  {
    level: 5,
    xpRequired: 2000,
    title: "Visionary",
    unlocksDescription: "Full reports, yearly forecast, monthly guidance, premium quests, export",
  },
];

export function getLevelForXp(totalXp: number): LevelDefinition {
  let current = LEVELS[0];
  for (const level of LEVELS) {
    if (totalXp >= level.xpRequired) {
      current = level;
    } else {
      break;
    }
  }
  return current;
}

export function getXpProgress(totalXp: number): {
  currentLevel: LevelDefinition;
  nextLevel: LevelDefinition | null;
  xpInCurrentLevel: number;
  xpToNextLevel: number;
  progressPercent: number;
} {
  const currentLevel = getLevelForXp(totalXp);
  const currentIndex = LEVELS.findIndex((l) => l.level === currentLevel.level);
  const nextLevel = currentIndex < LEVELS.length - 1 ? LEVELS[currentIndex + 1] : null;

  const xpInCurrentLevel = totalXp - currentLevel.xpRequired;
  const xpToNextLevel = nextLevel
    ? nextLevel.xpRequired - currentLevel.xpRequired
    : 0;
  const progressPercent = nextLevel
    ? Math.min(100, Math.round((xpInCurrentLevel / xpToNextLevel) * 100))
    : 100;

  return { currentLevel, nextLevel, xpInCurrentLevel, xpToNextLevel, progressPercent };
}

export interface BadgeDefinition {
  code: string;
  title: string;
  description: string;
  icon: string;
  unlockRule: BadgeUnlockRule;
}

export interface BadgeUnlockRule {
  type: "quest_count" | "xp_threshold" | "streak" | "section_count" | "specific_action";
  value: number;
  filter?: string;
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  { code: "pattern_breaker", title: "Pattern Breaker", description: "Complete 3 shadow work quests", icon: "Unlink", unlockRule: { type: "quest_count", value: 3, filter: "shadow_work" } },
  { code: "city_explorer", title: "City Explorer", description: "Research 5 cities", icon: "Map", unlockRule: { type: "quest_count", value: 5, filter: "city_research" } },
  { code: "shadow_worker", title: "Shadow Worker", description: "Complete the full shadow work module", icon: "Moon", unlockRule: { type: "specific_action", value: 1, filter: "shadow_work_complete" } },
  { code: "aligned_builder", title: "Aligned Builder", description: "Reach 500 XP", icon: "Target", unlockRule: { type: "xp_threshold", value: 500 } },
  { code: "love_decoder", title: "Love Decoder", description: "Complete all love-related sections", icon: "Heart", unlockRule: { type: "section_count", value: 3, filter: "love" } },
  { code: "future_architect", title: "Future Architect", description: "Generate a full report", icon: "Compass", unlockRule: { type: "specific_action", value: 1, filter: "full_report" } },
  { code: "quiet_power", title: "Quiet Power", description: "Maintain a 7-day reflection streak", icon: "Flame", unlockRule: { type: "streak", value: 7 } },
  { code: "reinvention_mode", title: "Reinvention Mode", description: "Complete the reinvention preset", icon: "RefreshCw", unlockRule: { type: "specific_action", value: 1, filter: "reinvention_complete" } },
  { code: "rhythm_keeper", title: "Rhythm Keeper", description: "Complete 10 daily reflections", icon: "Activity", unlockRule: { type: "quest_count", value: 10, filter: "daily_reflection" } },
  { code: "consistency_builder", title: "Consistency Builder", description: "Maintain a 30-day streak", icon: "Award", unlockRule: { type: "streak", value: 30 } },
];
