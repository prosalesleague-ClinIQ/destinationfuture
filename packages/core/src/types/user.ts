export interface UserProfile {
  id: string;
  email: string;
  nickname: string | null;
  firstName: string;
  middleName: string | null;
  lastName: string | null;
  subscriptionTier: "FREE" | "PREMIUM";
}

export interface ProfileInput {
  dob: string; // ISO date
  birthTime: string | null; // HH:mm or null
  birthCity: string;
  birthState: string | null;
  birthCountry: string;
  currentCity: string | null;
  currentState: string | null;
  currentCountry: string | null;
  relationshipStatus: string | null;
  careerField: string | null;
  budgetRange: string | null;
  stylePreferences: string[];
  musicPreferences: string[];
  goals: GoalKey[];
}

export type GoalKey =
  | "love"
  | "career"
  | "money"
  | "creativity"
  | "healing"
  | "spirituality"
  | "relocation"
  | "self_improvement";

export interface OnboardingData {
  firstName: string;
  middleName?: string;
  lastName?: string;
  profile: ProfileInput;
}

export type ModeType = "SINGLE" | "ROMANTIC" | "FRIENDSHIP" | "FAMILY" | "COLLABORATION";

export interface SecondProfileInput {
  label?: string;
  firstName: string;
  dob: string;
  birthTime?: string | null;
  birthCity: string;
  birthState?: string | null;
  birthCountry: string;
  relationshipType: "romantic" | "friendship" | "family" | "collaboration";
}
