import type { SectionKey } from "./sections";

export interface Preset {
  key: string;
  title: string;
  description: string;
  sections: SectionKey[];
  icon: string;
}

export const PRESETS: Preset[] = [
  {
    key: "quick_read",
    title: "Quick Read",
    description: "A fast overview of your identity, numbers, and stars",
    sections: ["identity_snapshot", "numerology_core", "astrology_cosmology", "seven_day_plan"],
    icon: "Zap",
  },
  {
    key: "love_focus",
    title: "Love Focus",
    description: "Deep dive into love, compatibility, and relationship patterns",
    sections: [
      "identity_snapshot",
      "numerology_core",
      "soulmate_timing",
      "love_languages",
      "red_flags_patterns",
      "thirty_day_plan",
    ],
    icon: "Heart",
  },
  {
    key: "career_focus",
    title: "Career Focus",
    description: "Career alignment, money psychology, and strategic planning",
    sections: [
      "identity_snapshot",
      "numerology_core",
      "career_money",
      "current_city_analysis",
      "three_year_arc",
    ],
    icon: "Briefcase",
  },
  {
    key: "relocation_focus",
    title: "Relocation Focus",
    description: "Find your ideal city and plan your move",
    sections: [
      "identity_snapshot",
      "location_analysis",
      "current_city_analysis",
      "three_year_arc",
    ],
    icon: "MapPin",
  },
  {
    key: "reinvention_focus",
    title: "Reinvention Focus",
    description: "Shadow work, self-improvement, and lifestyle transformation",
    sections: [
      "identity_snapshot",
      "shadow_work",
      "self_improvement",
      "hobbies_lifestyle",
      "thirty_day_plan",
      "three_year_arc",
    ],
    icon: "RefreshCw",
  },
  {
    key: "full_report",
    title: "Full Report",
    description: "Every section, every insight — the complete picture",
    sections: [
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
    ],
    icon: "Globe",
  },
];
