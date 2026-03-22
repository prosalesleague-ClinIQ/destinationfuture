/**
 * Supabase-backed database layer.
 * Uses Supabase Auth for authentication and Supabase DB for profiles + progress.
 * Replaces the old localStorage-only local-db.ts.
 */

import { supabase } from "./supabase";

// ─── Types ───

export interface UserProfile {
  id: string;
  userId: string;
  firstName: string;
  middleName?: string | null;
  lastName?: string | null;
  nickname?: string | null;
  birthday?: string | null;
  birthTime?: string | null;
  birthCity?: string | null;
  birthState?: string | null;
  intakeComplete: boolean;
  // Intake preferences
  relationshipStatus?: string | null;
  careerField?: string | null;
  careerGoals?: string[];
  budgetRange?: string | null;
  stylePreferences?: string[];
  styleBudget?: string | null;
  favoriteStores?: string[];
  musicGenres?: string[];
  filmGenres?: string[];
  tvGenres?: string[];
  bookGenres?: string[];
  goals?: string[];
  hobbies?: string[];
  valuesList?: string[];
  gender?: string | null;
  genderExpression?: string | null;
}

export interface UserProgress {
  userId: string;
  xp: number;
  level: number;
  levelName: string;
  streak: number;
  lastActiveDate: string;
  questsCompleted: string[];
  questsActive: string[];
  reportsGenerated: number;
  badges: string[];
  reflections: { date: string; content: string }[];
  questResponses: Record<string, Record<string, string>>;
}

// ─── Level system ───

const LEVELS = [
  { level: 1, name: "Awakened", xpRequired: 0 },
  { level: 2, name: "Curious", xpRequired: 100 },
  { level: 3, name: "Seeker", xpRequired: 250 },
  { level: 4, name: "Pathfinder", xpRequired: 500 },
  { level: 5, name: "Alchemist", xpRequired: 800 },
  { level: 6, name: "Visionary", xpRequired: 1200 },
  { level: 7, name: "Architect", xpRequired: 1800 },
  { level: 8, name: "Master", xpRequired: 2500 },
];

function getLevelForXp(xp: number) {
  let current = LEVELS[0];
  for (const lvl of LEVELS) {
    if (xp >= lvl.xpRequired) current = lvl;
    else break;
  }
  return current;
}

function getNextLevel(currentLevel: number) {
  return LEVELS.find((l) => l.level === currentLevel + 1) || LEVELS[LEVELS.length - 1];
}

// ─── Pending user helpers (for when signup has no active session) ───

const PENDING_USER_KEY = "df_pending_user";
const PENDING_INTAKE_KEY = "df_pending_intake";

function setPendingUser(userId: string, email: string): void {
  localStorage.setItem(PENDING_USER_KEY, JSON.stringify({ id: userId, email }));
}

function getPendingUser(): { id: string; email: string } | null {
  try {
    const raw = localStorage.getItem(PENDING_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function clearPendingUser(): void {
  localStorage.removeItem(PENDING_USER_KEY);
  localStorage.removeItem(PENDING_INTAKE_KEY);
}

// ─── Helpers ───

function defaultProgress(userId: string): UserProgress {
  return {
    userId,
    xp: 0,
    level: 1,
    levelName: "Awakened",
    streak: 0,
    lastActiveDate: "",
    questsCompleted: [],
    questsActive: [],
    reportsGenerated: 0,
    badges: [],
    reflections: [],
    questResponses: {},
  };
}

function rowToProgress(row: Record<string, unknown>): UserProgress {
  return {
    userId: row.user_id as string,
    xp: row.xp as number,
    level: row.level as number,
    levelName: row.level_name as string,
    streak: row.streak as number,
    lastActiveDate: row.last_active_date ? String(row.last_active_date) : "",
    questsCompleted: (row.quests_completed as string[]) || [],
    questsActive: (row.quests_active as string[]) || [],
    reportsGenerated: row.reports_generated as number,
    badges: (row.badges as string[]) || [],
    reflections: (row.reflections as { date: string; content: string }[]) || [],
    questResponses: (row.quest_responses as Record<string, Record<string, string>>) || {},
  };
}

// ─── Public API ───

export const db = {
  // ─── Auth ───

  /** Create a new account with email + password via Supabase Auth. */
  async createAccount(data: {
    email: string;
    password: string;
  }): Promise<{ success: true; userId: string } | { success: false; error: string }> {
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (error) {
      if (error.message.includes("already registered")) {
        return { success: false, error: "An account with this email already exists. Try signing in." };
      }
      return { success: false, error: error.message };
    }

    const userId = authData.user?.id;
    if (!userId) return { success: false, error: "Failed to create account." };

    // If Supabase requires email confirmation, signUp won't return a session.
    // Try auto-sign-in first; if that fails, store a pending user so the
    // intake flow can proceed without a real session.
    let hasSession = !!authData.session;

    if (!hasSession) {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      hasSession = !signInError;
    }

    if (!hasSession) {
      // No session available — store pending user so intake still works
      setPendingUser(userId, data.email);
    }

    // Create profile + progress rows (will succeed if session exists; RLS will
    // block if not, but we'll create them during sync after first real sign-in)
    if (hasSession) {
      await supabase.from("profiles").insert({
        user_id: userId,
        first_name: "",
        intake_complete: false,
      });
      await supabase.from("user_progress").insert({
        user_id: userId,
      });
    }

    return { success: true, userId };
  },

  /** Sign in with email + password. Syncs any pending intake data. */
  async login(
    email: string,
    password: string
  ): Promise<{ success: true; userId: string } | { success: false; error: string }> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes("Invalid login")) {
        return { success: false, error: "Incorrect email or password. Please try again." };
      }
      return { success: false, error: error.message };
    }

    // Sync any pending intake data from a previous signup without a session
    await db._syncPendingData(data.user.id);

    return { success: true, userId: data.user.id };
  },

  /** Sign out. */
  async logout(): Promise<void> {
    await supabase.auth.signOut();
  },

  /** Check if user is authenticated (real session or pending signup). */
  async isAuthenticated(): Promise<boolean> {
    const { data } = await supabase.auth.getSession();
    if (data.session) return true;
    // Pending user from signup counts as authenticated for intake flow
    return !!getPendingUser();
  },

  /** Get current user id + email. Falls back to pending user from signup. */
  async getCurrentUser(): Promise<{ id: string; firstName: string; email: string } | null> {
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("first_name")
        .eq("user_id", session.user.id)
        .single();

      return {
        id: session.user.id,
        email: session.user.email || "",
        firstName: profile?.first_name || "",
      };
    }

    // No active session — check for pending user from recent signup
    const pending = getPendingUser();
    if (pending) {
      return { id: pending.id, email: pending.email, firstName: "" };
    }

    return null;
  },

  // ─── Profile ───

  /** Get full profile for the current user. */
  async getProfile(): Promise<UserProfile | null> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", session.user.id)
      .single();

    if (!data) return null;

    return {
      id: data.id,
      userId: data.user_id,
      firstName: data.first_name || "",
      middleName: data.middle_name,
      lastName: data.last_name,
      nickname: data.nickname,
      birthday: data.birthday,
      birthTime: data.birth_time,
      birthCity: data.birth_city,
      birthState: data.birth_state,
      intakeComplete: data.intake_complete,
      relationshipStatus: data.relationship_status,
      careerField: data.career_field,
      careerGoals: data.career_goals || [],
      budgetRange: data.budget_range,
      stylePreferences: data.style_preferences || [],
      styleBudget: data.style_budget,
      favoriteStores: data.favorite_stores || [],
      musicGenres: data.music_genres || [],
      filmGenres: data.film_genres || [],
      tvGenres: data.tv_genres || [],
      bookGenres: data.book_genres || [],
      goals: data.goals || [],
      hobbies: data.hobbies || [],
      valuesList: data.values_list || [],
      gender: data.gender,
      genderExpression: data.gender_expression,
    };
  },

  /** Update profile fields. */
  async updateProfile(
    userId: string,
    data: Partial<{
      firstName: string;
      middleName: string | null;
      lastName: string | null;
      nickname: string | null;
      birthday: string | null;
      birthTime: string | null;
      birthCity: string | null;
      birthState: string | null;
      relationshipStatus: string | null;
      careerField: string | null;
      careerGoals: string[];
      budgetRange: string | null;
      stylePreferences: string[];
      styleBudget: string | null;
      favoriteStores: string[];
      musicGenres: string[];
      filmGenres: string[];
      tvGenres: string[];
      bookGenres: string[];
      goals: string[];
      hobbies: string[];
      valuesList: string[];
      gender: string | null;
      genderExpression: string | null;
    }>
  ): Promise<{ success: true } | { success: false; error: string }> {
    const updateData: Record<string, unknown> = {};
    if (data.firstName !== undefined) updateData.first_name = data.firstName;
    if (data.middleName !== undefined) updateData.middle_name = data.middleName;
    if (data.lastName !== undefined) updateData.last_name = data.lastName;
    if (data.nickname !== undefined) updateData.nickname = data.nickname;
    if (data.birthday !== undefined) updateData.birthday = data.birthday;
    if (data.birthTime !== undefined) updateData.birth_time = data.birthTime;
    if (data.birthCity !== undefined) updateData.birth_city = data.birthCity;
    if (data.birthState !== undefined) updateData.birth_state = data.birthState;
    if (data.relationshipStatus !== undefined) updateData.relationship_status = data.relationshipStatus;
    if (data.careerField !== undefined) updateData.career_field = data.careerField;
    if (data.careerGoals !== undefined) updateData.career_goals = data.careerGoals;
    if (data.budgetRange !== undefined) updateData.budget_range = data.budgetRange;
    if (data.stylePreferences !== undefined) updateData.style_preferences = data.stylePreferences;
    if (data.styleBudget !== undefined) updateData.style_budget = data.styleBudget;
    if (data.favoriteStores !== undefined) updateData.favorite_stores = data.favoriteStores;
    if (data.musicGenres !== undefined) updateData.music_genres = data.musicGenres;
    if (data.filmGenres !== undefined) updateData.film_genres = data.filmGenres;
    if (data.tvGenres !== undefined) updateData.tv_genres = data.tvGenres;
    if (data.bookGenres !== undefined) updateData.book_genres = data.bookGenres;
    if (data.goals !== undefined) updateData.goals = data.goals;
    if (data.hobbies !== undefined) updateData.hobbies = data.hobbies;
    if (data.valuesList !== undefined) updateData.values_list = data.valuesList;
    if (data.gender !== undefined) updateData.gender = data.gender;
    if (data.genderExpression !== undefined) updateData.gender_expression = data.genderExpression;

    const { error } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("user_id", userId);

    if (error) return { success: false, error: error.message };
    return { success: true };
  },

  // ─── Intake ───

  /** Complete intake with personal details + preferences. */
  async completeIntake(
    userId: string,
    data: {
      firstName: string;
      middleName?: string;
      lastName?: string;
      nickname?: string;
      birthday: string;
      birthTime?: string;
      birthCity: string;
      birthState: string;
      relationshipStatus?: string;
      careerField?: string;
      careerGoals?: string[];
      budgetRange?: string;
      stylePreferences?: string[];
      styleBudget?: string;
      favoriteStores?: string[];
      musicGenres?: string[];
      filmGenres?: string[];
      tvGenres?: string[];
      bookGenres?: string[];
      goals?: string[];
      hobbies?: string[];
      valuesList?: string[];
      gender?: string;
      genderExpression?: string;
    }
  ): Promise<{ success: true } | { success: false; error: string }> {
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.user) {
      // Real session — write directly to Supabase
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: data.firstName,
          middle_name: data.middleName || null,
          last_name: data.lastName || null,
          nickname: data.nickname || null,
          birthday: data.birthday,
          birth_time: data.birthTime || null,
          birth_city: data.birthCity,
          birth_state: data.birthState,
          intake_complete: true,
          relationship_status: data.relationshipStatus || null,
          career_field: data.careerField || null,
          career_goals: data.careerGoals || [],
          budget_range: data.budgetRange || null,
          style_preferences: data.stylePreferences || [],
          style_budget: data.styleBudget || null,
          favorite_stores: data.favoriteStores || [],
          music_genres: data.musicGenres || [],
          film_genres: data.filmGenres || [],
          tv_genres: data.tvGenres || [],
          book_genres: data.bookGenres || [],
          goals: data.goals || [],
          hobbies: data.hobbies || [],
          values_list: data.valuesList || [],
          gender: data.gender || null,
          gender_expression: data.genderExpression || null,
        })
        .eq("user_id", userId);

      if (error) return { success: false, error: error.message };
      return { success: true };
    }

    // No session (pending user) — store intake data locally for later sync
    localStorage.setItem(
      PENDING_INTAKE_KEY,
      JSON.stringify({ ...data, complete: true })
    );
    return { success: true };
  },

  /** Check whether the current user has completed intake. */
  async isIntakeComplete(): Promise<boolean> {
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.user) {
      const { data } = await supabase
        .from("profiles")
        .select("intake_complete")
        .eq("user_id", session.user.id)
        .single();

      return data?.intake_complete ?? false;
    }

    // No session — check local pending intake data
    try {
      const raw = localStorage.getItem(PENDING_INTAKE_KEY);
      return raw ? JSON.parse(raw).complete === true : false;
    } catch {
      return false;
    }
  },

  // ─── Progress ───

  /** Get progress for a user, updating streak as needed. */
  async getProgress(userId: string): Promise<UserProgress> {
    const { data: row } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!row) {
      // Create row if missing
      await supabase.from("user_progress").insert({ user_id: userId });
      return defaultProgress(userId);
    }

    const progress = rowToProgress(row);

    // Update streak
    const today = new Date().toISOString().split("T")[0];
    if (progress.lastActiveDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
      if (progress.lastActiveDate === yesterday) {
        progress.streak += 1;
      } else if (progress.lastActiveDate && progress.lastActiveDate !== today) {
        progress.streak = 1;
      } else if (!progress.lastActiveDate) {
        progress.streak = 1;
      }
      progress.lastActiveDate = today;
      await db._saveProgress(userId, progress);
    }

    return progress;
  },

  async completeQuest(userId: string, questId: string, xpReward: number): Promise<UserProgress> {
    const progress = await db.getProgress(userId);

    if (!progress.questsCompleted.includes(questId)) {
      progress.questsCompleted.push(questId);
      progress.questsActive = progress.questsActive.filter((q) => q !== questId);
      progress.xp += xpReward;

      const lvl = getLevelForXp(progress.xp);
      progress.level = lvl.level;
      progress.levelName = lvl.name;

      if (progress.questsCompleted.length === 1 && !progress.badges.includes("first-quest")) {
        progress.badges.push("first-quest");
      }
      if (progress.questsCompleted.length >= 5 && !progress.badges.includes("quest-master")) {
        progress.badges.push("quest-master");
      }
      if (progress.streak >= 3 && !progress.badges.includes("streak-3")) {
        progress.badges.push("streak-3");
      }
      if (progress.streak >= 7 && !progress.badges.includes("streak-7")) {
        progress.badges.push("streak-7");
      }

      await db._saveProgress(userId, progress);
    }

    return progress;
  },

  async startQuest(userId: string, questId: string): Promise<UserProgress> {
    const progress = await db.getProgress(userId);

    if (!progress.questsActive.includes(questId) && !progress.questsCompleted.includes(questId)) {
      progress.questsActive.push(questId);
      await db._saveProgress(userId, progress);
    }

    return progress;
  },

  async addXp(userId: string, amount: number): Promise<UserProgress> {
    const progress = await db.getProgress(userId);
    progress.xp += amount;
    const lvl = getLevelForXp(progress.xp);
    progress.level = lvl.level;
    progress.levelName = lvl.name;
    await db._saveProgress(userId, progress);
    return progress;
  },

  async addReflection(userId: string, content: string): Promise<UserProgress> {
    const progress = await db.getProgress(userId);
    const today = new Date().toISOString().split("T")[0];
    progress.reflections.push({ date: today, content });
    progress.xp += 10;
    const lvl = getLevelForXp(progress.xp);
    progress.level = lvl.level;
    progress.levelName = lvl.name;
    if (progress.reflections.length === 1 && !progress.badges.includes("first-reflection")) {
      progress.badges.push("first-reflection");
    }
    await db._saveProgress(userId, progress);
    return progress;
  },

  async incrementReports(userId: string): Promise<UserProgress> {
    const progress = await db.getProgress(userId);
    progress.reportsGenerated += 1;
    progress.xp += 25;
    const lvl = getLevelForXp(progress.xp);
    progress.level = lvl.level;
    progress.levelName = lvl.name;
    if (progress.reportsGenerated === 1 && !progress.badges.includes("first-report")) {
      progress.badges.push("first-report");
    }
    await db._saveProgress(userId, progress);
    return progress;
  },

  /** Save a quest step response to Supabase. */
  async saveQuestResponse(userId: string, questId: string, stepIndex: number, responseText: string): Promise<void> {
    await supabase
      .from("quest_responses")
      .upsert(
        {
          user_id: userId,
          quest_id: questId,
          step_index: stepIndex,
          response_text: responseText,
        },
        { onConflict: "user_id,quest_id,step_index" }
      );

    // Also save to progress JSON for quick access
    const progress = await db.getProgress(userId);
    if (!progress.questResponses[questId]) {
      progress.questResponses[questId] = {};
    }
    progress.questResponses[questId][String(stepIndex)] = responseText;
    await db._saveProgress(userId, progress);
  },

  /** Get all quest responses for a user. */
  async getQuestResponses(userId: string): Promise<Record<string, Record<string, string>>> {
    const { data } = await supabase
      .from("quest_responses")
      .select("quest_id, step_index, response_text")
      .eq("user_id", userId);

    const responses: Record<string, Record<string, string>> = {};
    if (data) {
      for (const row of data) {
        if (!responses[row.quest_id]) responses[row.quest_id] = {};
        responses[row.quest_id][String(row.step_index)] = row.response_text || "";
      }
    }
    return responses;
  },

  /** Save a section snapshot (personalized section data for the user). */
  async saveSectionSnapshot(userId: string, sectionName: string, snapshotData: unknown): Promise<void> {
    await supabase
      .from("section_snapshots")
      .upsert(
        {
          user_id: userId,
          section_name: sectionName,
          snapshot_data: snapshotData,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,section_name" }
      );
  },

  /** Get a section snapshot. */
  async getSectionSnapshot(userId: string, sectionName: string): Promise<unknown | null> {
    const { data } = await supabase
      .from("section_snapshots")
      .select("snapshot_data")
      .eq("user_id", userId)
      .eq("section_name", sectionName)
      .single();

    return data?.snapshot_data || null;
  },

  // ─── Pure helpers (synchronous) ───

  getLevelInfo(xp: number) {
    const current = getLevelForXp(xp);
    const next = getNextLevel(current.level);
    const progressPercent =
      next.level === current.level
        ? 100
        : Math.round(((xp - current.xpRequired) / (next.xpRequired - current.xpRequired)) * 100);
    return { current, next, progressPercent };
  },

  // ─── Internal ───

  /** Sync locally-stored intake data to Supabase after first real sign-in. */
  async _syncPendingData(userId: string): Promise<void> {
    try {
      const raw = localStorage.getItem(PENDING_INTAKE_KEY);
      if (!raw) {
        clearPendingUser();
        return;
      }

      const intake = JSON.parse(raw);

      // Ensure profile row exists (may not have been created during signup)
      await supabase.from("profiles").upsert(
        {
          user_id: userId,
          first_name: intake.firstName || "",
          middle_name: intake.middleName || null,
          last_name: intake.lastName || null,
          nickname: intake.nickname || null,
          birthday: intake.birthday || null,
          birth_time: intake.birthTime || null,
          birth_city: intake.birthCity || null,
          birth_state: intake.birthState || null,
          intake_complete: intake.complete ?? false,
          relationship_status: intake.relationshipStatus || null,
          career_field: intake.careerField || null,
          career_goals: intake.careerGoals || [],
          budget_range: intake.budgetRange || null,
          style_preferences: intake.stylePreferences || [],
          style_budget: intake.styleBudget || null,
          favorite_stores: intake.favoriteStores || [],
          music_genres: intake.musicGenres || [],
          film_genres: intake.filmGenres || [],
          tv_genres: intake.tvGenres || [],
          book_genres: intake.bookGenres || [],
          goals: intake.goals || [],
          hobbies: intake.hobbies || [],
          values_list: intake.valuesList || [],
          gender: intake.gender || null,
          gender_expression: intake.genderExpression || null,
        },
        { onConflict: "user_id" }
      );

      // Ensure progress row exists
      await supabase.from("user_progress").upsert(
        { user_id: userId },
        { onConflict: "user_id", ignoreDuplicates: true }
      );

      clearPendingUser();
    } catch {
      // Non-critical — data will sync on next sign-in
    }
  },

  async _saveProgress(userId: string, p: UserProgress): Promise<void> {
    await supabase
      .from("user_progress")
      .update({
        xp: p.xp,
        level: p.level,
        level_name: p.levelName,
        streak: p.streak,
        last_active_date: p.lastActiveDate || null,
        quests_completed: p.questsCompleted,
        quests_active: p.questsActive,
        reports_generated: p.reportsGenerated,
        badges: p.badges,
        reflections: p.reflections,
        quest_responses: p.questResponses,
      })
      .eq("user_id", userId);
  },
};
