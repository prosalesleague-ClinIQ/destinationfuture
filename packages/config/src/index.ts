export const APP_CONFIG = {
  name: "Destination Future",
  version: "0.1.0",
  description: "Privacy-first gamified insight platform for personal growth",
  maxSectionsPerFreeReport: 4,
  maxCityResultsFree: 5,
  maxCityResultsPremium: 25,
  maxForecastYearsFree: 1,
  maxForecastYearsPremium: 3,
  reportCacheTtlMinutes: 60,
  xp: {
    maxDailyFromReflections: 45, // 3 reflections * 15xp each
  },
  auth: {
    jwtExpiresIn: "7d",
    minPasswordLength: 8,
    maxNicknameLength: 30,
  },
  limits: {
    maxReportsPerDay: 10,
    maxSecondProfiles: 5,
    maxQuestsActive: 10,
  },
} as const;

export const FREE_SECTIONS = [
  "identity_snapshot",
  "numerology_core",
  "astrology_cosmology",
  "seven_day_plan",
] as const;

export const PREMIUM_SECTIONS = [
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
  "thirty_day_plan",
  "three_year_arc",
  "holistic_blueprint",
] as const;

export const RELATIONSHIP_TYPES = ["romantic", "friendship", "family", "collaboration"] as const;
export type RelationshipType = (typeof RELATIONSHIP_TYPES)[number];

export const GOALS = [
  { key: "love", label: "Love & Relationships", icon: "Heart" },
  { key: "career", label: "Career & Purpose", icon: "Briefcase" },
  { key: "money", label: "Money & Abundance", icon: "DollarSign" },
  { key: "creativity", label: "Creativity & Expression", icon: "Palette" },
  { key: "healing", label: "Healing & Recovery", icon: "Heart" },
  { key: "spirituality", label: "Spirituality & Meaning", icon: "Sparkles" },
  { key: "relocation", label: "Relocation & Travel", icon: "MapPin" },
  { key: "self_improvement", label: "Self-Improvement", icon: "TrendingUp" },
] as const;

export const BUDGET_RANGES = [
  { key: "budget", label: "Budget-Conscious" },
  { key: "moderate", label: "Moderate" },
  { key: "premium", label: "Premium" },
  { key: "luxury", label: "Luxury" },
] as const;

export const STYLE_PREFERENCES = [
  { key: "minimalist", label: "Minimalist" },
  { key: "streetwear", label: "Streetwear" },
  { key: "classic", label: "Classic" },
  { key: "bohemian", label: "Bohemian" },
  { key: "athletic", label: "Athletic / Athleisure" },
  { key: "avant_garde", label: "Avant-Garde" },
  { key: "preppy", label: "Preppy" },
  { key: "edgy", label: "Edgy / Alternative" },
] as const;

export const MUSIC_PREFERENCES = [
  { key: "hip_hop", label: "Hip-Hop / R&B" },
  { key: "pop", label: "Pop" },
  { key: "rock", label: "Rock / Alternative" },
  { key: "electronic", label: "Electronic / EDM" },
  { key: "jazz", label: "Jazz / Soul" },
  { key: "classical", label: "Classical" },
  { key: "country", label: "Country" },
  { key: "latin", label: "Latin" },
  { key: "ambient", label: "Ambient / New Age" },
  { key: "indie", label: "Indie" },
] as const;
