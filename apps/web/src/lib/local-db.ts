/**
 * Client-side user database using localStorage.
 * Stores accounts, auth sessions, and per-user progress.
 */

export interface LocalUser {
  id: string;
  email: string;
  firstName: string;
  middleName?: string;
  lastName?: string;
  nickname?: string;
  birthday?: string; // YYYY-MM-DD
  birthTime?: string; // HH:MM (24h)
  birthCity?: string;
  birthState?: string;
  provider: "email" | "google";
  passwordHash?: string; // simple hash for demo — NOT production-grade
  intakeComplete: boolean;
  createdAt: number;
}

export interface UserProgress {
  userId: string;
  xp: number;
  level: number;
  levelName: string;
  streak: number;
  lastActiveDate: string; // YYYY-MM-DD
  questsCompleted: string[];
  questsActive: string[];
  reportsGenerated: number;
  badges: string[];
  reflections: { date: string; content: string }[];
}

const USERS_KEY = "df_users";
const PROGRESS_KEY = "df_progress";

// Simple hash for demo purposes
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return hash.toString(36);
}

function getUsers(): LocalUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: LocalUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getAllProgress(): Record<string, UserProgress> {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveAllProgress(progress: Record<string, UserProgress>): void {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

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

function createDefaultProgress(userId: string): UserProgress {
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
  };
}

function setSession(user: LocalUser): void {
  const sessionUser = {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    nickname: user.nickname || null,
    subscriptionTier: "FREE",
  };
  localStorage.setItem("df_token", `local-${user.id}`);
  localStorage.setItem("df_user", JSON.stringify(sessionUser));
}

// ─── Public API ───

export const localDb = {
  /** Step 1: Create account with just email + password. Intake still required. */
  createAccount(data: {
    email: string;
    password: string;
  }): { success: true; user: LocalUser } | { success: false; error: string } {
    const users = getUsers();

    if (users.find((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
      return { success: false, error: "An account with this email already exists. Try signing in." };
    }

    const user: LocalUser = {
      id: crypto.randomUUID(),
      email: data.email.toLowerCase(),
      firstName: "",
      provider: "email",
      passwordHash: simpleHash(data.password),
      intakeComplete: false,
      createdAt: Date.now(),
    };

    users.push(user);
    saveUsers(users);

    // Create default progress
    const allProgress = getAllProgress();
    allProgress[user.id] = createDefaultProgress(user.id);
    saveAllProgress(allProgress);

    // Set session
    setSession(user);

    return { success: true, user };
  },

  /** Step 2: Complete intake with personal details. */
  completeIntake(userId: string, data: {
    firstName: string;
    middleName?: string;
    lastName?: string;
    nickname?: string;
    birthday: string;
    birthTime?: string;
    birthCity: string;
    birthState: string;
  }): { success: true; user: LocalUser } | { success: false; error: string } {
    const users = getUsers();
    const user = users.find((u) => u.id === userId);
    if (!user) return { success: false, error: "User not found." };

    user.firstName = data.firstName;
    user.middleName = data.middleName;
    user.lastName = data.lastName;
    user.nickname = data.nickname;
    user.birthday = data.birthday;
    user.birthTime = data.birthTime;
    user.birthCity = data.birthCity;
    user.birthState = data.birthState;
    user.intakeComplete = true;

    saveUsers(users);
    // Re-set session so firstName is available
    setSession(user);

    return { success: true, user };
  },

  /** Check whether the current user has completed intake. */
  isIntakeComplete(): boolean {
    try {
      const userStr = localStorage.getItem("df_user");
      if (!userStr) return false;
      const sessionUser = JSON.parse(userStr);
      if (!sessionUser?.id) return false;
      const users = getUsers();
      const user = users.find((u) => u.id === sessionUser.id);
      return user?.intakeComplete ?? false;
    } catch {
      return false;
    }
  },

  login(email: string, password: string): { success: true; user: LocalUser } | { success: false; error: string } {
    const users = getUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return { success: false, error: "No account found with this email. Create one first." };
    }

    if (user.provider === "google") {
      return { success: false, error: "This account uses Google sign-in. Please sign in with Gmail." };
    }

    if (user.passwordHash !== simpleHash(password)) {
      return { success: false, error: "Incorrect password. Please try again." };
    }

    setSession(user);
    return { success: true, user };
  },

  /**
   * Unified Google auth: auto-signs in if account exists, auto-creates if not.
   */
  googleAuth(data: {
    email: string;
    firstName: string;
    lastName?: string;
    avatar?: string;
  }): { success: true; user: LocalUser; isNew: boolean } {
    const users = getUsers();
    const existing = users.find((u) => u.email.toLowerCase() === data.email.toLowerCase());

    if (existing) {
      setSession(existing);
      return { success: true, user: existing, isNew: false };
    }

    // Auto-create account
    const user: LocalUser = {
      id: crypto.randomUUID(),
      email: data.email.toLowerCase(),
      firstName: data.firstName,
      lastName: data.lastName,
      provider: "google",
      intakeComplete: false,
      createdAt: Date.now(),
    };

    users.push(user);
    saveUsers(users);

    const allProgress = getAllProgress();
    allProgress[user.id] = createDefaultProgress(user.id);
    saveAllProgress(allProgress);

    setSession(user);
    return { success: true, user, isNew: true };
  },

  getProgress(userId: string): UserProgress {
    const all = getAllProgress();
    if (!all[userId]) {
      all[userId] = createDefaultProgress(userId);
      saveAllProgress(all);
    }

    // Update streak
    const progress = all[userId];
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
      saveAllProgress(all);
    }

    return progress;
  },

  addXp(userId: string, amount: number): UserProgress {
    const all = getAllProgress();
    const progress = all[userId] || createDefaultProgress(userId);
    progress.xp += amount;

    const lvl = getLevelForXp(progress.xp);
    progress.level = lvl.level;
    progress.levelName = lvl.name;

    all[userId] = progress;
    saveAllProgress(all);
    return progress;
  },

  completeQuest(userId: string, questId: string, xpReward: number): UserProgress {
    const all = getAllProgress();
    const progress = all[userId] || createDefaultProgress(userId);

    if (!progress.questsCompleted.includes(questId)) {
      progress.questsCompleted.push(questId);
      progress.questsActive = progress.questsActive.filter((q) => q !== questId);
      progress.xp += xpReward;

      const lvl = getLevelForXp(progress.xp);
      progress.level = lvl.level;
      progress.levelName = lvl.name;

      // Auto-award badges
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
    }

    all[userId] = progress;
    saveAllProgress(all);
    return progress;
  },

  startQuest(userId: string, questId: string): UserProgress {
    const all = getAllProgress();
    const progress = all[userId] || createDefaultProgress(userId);

    if (!progress.questsActive.includes(questId) && !progress.questsCompleted.includes(questId)) {
      progress.questsActive.push(questId);
    }

    all[userId] = progress;
    saveAllProgress(all);
    return progress;
  },

  addReflection(userId: string, content: string): UserProgress {
    const all = getAllProgress();
    const progress = all[userId] || createDefaultProgress(userId);
    const today = new Date().toISOString().split("T")[0];

    progress.reflections.push({ date: today, content });
    progress.xp += 10;

    const lvl = getLevelForXp(progress.xp);
    progress.level = lvl.level;
    progress.levelName = lvl.name;

    if (progress.reflections.length === 1 && !progress.badges.includes("first-reflection")) {
      progress.badges.push("first-reflection");
    }

    all[userId] = progress;
    saveAllProgress(all);
    return progress;
  },

  incrementReports(userId: string): UserProgress {
    const all = getAllProgress();
    const progress = all[userId] || createDefaultProgress(userId);
    progress.reportsGenerated += 1;
    progress.xp += 25;

    const lvl = getLevelForXp(progress.xp);
    progress.level = lvl.level;
    progress.levelName = lvl.name;

    if (progress.reportsGenerated === 1 && !progress.badges.includes("first-report")) {
      progress.badges.push("first-report");
    }

    all[userId] = progress;
    saveAllProgress(all);
    return progress;
  },

  getLevelInfo(xp: number) {
    const current = getLevelForXp(xp);
    const next = getNextLevel(current.level);
    const progressPercent = next.level === current.level
      ? 100
      : Math.round(((xp - current.xpRequired) / (next.xpRequired - current.xpRequired)) * 100);
    return { current, next, progressPercent };
  },

  getCurrentUser(): { id: string; firstName: string; email: string } | null {
    try {
      const userStr = localStorage.getItem("df_user");
      if (!userStr) return null;
      const user = JSON.parse(userStr);
      return user?.id ? user : null;
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem("df_token") && !!localStorage.getItem("df_user");
  },

  /** Wipe all accounts, sessions, and progress. */
  clearAll(): void {
    localStorage.removeItem(USERS_KEY);
    localStorage.removeItem(PROGRESS_KEY);
    localStorage.removeItem("df_token");
    localStorage.removeItem("df_user");
  },
};
