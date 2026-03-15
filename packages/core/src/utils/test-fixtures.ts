import type { ProfileInput, OnboardingData, GoalKey } from "../types/user";
import type { SectionKey } from "../types/sections";

export const TEST_PROFILE_FULL: ProfileInput = {
  dob: "1992-07-15",
  birthTime: "14:30",
  birthCity: "Los Angeles",
  birthState: "California",
  birthCountry: "United States",
  currentCity: "Austin",
  currentState: "Texas",
  currentCountry: "United States",
  relationshipStatus: "single",
  careerField: "Technology",
  budgetRange: "moderate",
  stylePreferences: ["minimalist", "classic"],
  musicPreferences: ["indie", "jazz", "ambient"],
  goals: ["love", "career", "self_improvement", "relocation"] as GoalKey[],
};

export const TEST_PROFILE_MINIMAL: ProfileInput = {
  dob: "1995-03-22",
  birthTime: null,
  birthCity: "Chicago",
  birthState: "Illinois",
  birthCountry: "United States",
  currentCity: null,
  currentState: null,
  currentCountry: null,
  relationshipStatus: null,
  careerField: null,
  budgetRange: null,
  stylePreferences: [],
  musicPreferences: [],
  goals: ["career"] as GoalKey[],
};

export const TEST_ONBOARDING_FULL: OnboardingData = {
  firstName: "Alex",
  middleName: "Jordan",
  lastName: "Rivera",
  profile: TEST_PROFILE_FULL,
};

export const TEST_ONBOARDING_MINIMAL: OnboardingData = {
  firstName: "Sam",
  profile: TEST_PROFILE_MINIMAL,
};

export const TEST_QUICK_READ_SECTIONS: SectionKey[] = [
  "identity_snapshot",
  "numerology_core",
  "astrology_cosmology",
  "seven_day_plan",
];

export const TEST_LOVE_FOCUS_SECTIONS: SectionKey[] = [
  "identity_snapshot",
  "numerology_core",
  "soulmate_timing",
  "love_languages",
  "red_flags_patterns",
  "thirty_day_plan",
];

export const TEST_FULL_REPORT_SECTIONS: SectionKey[] = [
  "identity_snapshot",
  "numerology_core",
  "astrology_cosmology",
  "location_analysis",
  "current_city_analysis",
  "soulmate_timing",
  "red_flags_patterns",
  "shadow_work",
  "self_improvement",
  "love_languages",
  "career_money",
  "hobbies_lifestyle",
  "fitness_psychology",
  "fashion_system",
  "shopping_links",
  "music_frequency",
  "spotify_pack",
  "film_tv_profile",
  "seven_day_plan",
  "thirty_day_plan",
  "three_year_arc",
  "holistic_blueprint",
];

export const TEST_SECOND_PROFILE = {
  label: "Partner",
  firstName: "Morgan",
  dob: "1994-11-08",
  birthTime: null,
  birthCity: "New York",
  birthState: "New York",
  birthCountry: "United States",
  relationshipType: "romantic" as const,
};
