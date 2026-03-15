import {
  XP_VALUES,
  getLevelForXp,
  getXpProgress,
  type XpSource,
} from "../types/gamification";

// ─── XP Calculation Engine ──────────────────────────────────────────────────

export interface XpAwardResult {
  source: XpSource;
  amount: number;
  newTotal: number;
  leveledUp: boolean;
  previousLevel: number;
  currentLevel: number;
}

export function awardXp(
  currentTotal: number,
  source: XpSource
): XpAwardResult {
  const amount = XP_VALUES[source];
  const previousLevel = getLevelForXp(currentTotal).level;
  const newTotal = currentTotal + amount;
  const currentLevel = getLevelForXp(newTotal).level;

  return {
    source,
    amount,
    newTotal,
    leveledUp: currentLevel > previousLevel,
    previousLevel,
    currentLevel,
  };
}

export function calculateTotalXp(
  ledger: { source: string; amount: number }[]
): number {
  return ledger.reduce((total, entry) => total + entry.amount, 0);
}

export function getStreakCount(dates: Date[]): number {
  if (dates.length === 0) return 0;

  const sorted = [...dates].sort((a, b) => b.getTime() - a.getTime());
  let streak = 1;

  for (let i = 1; i < sorted.length; i++) {
    const diff = Math.floor(
      (sorted[i - 1].getTime() - sorted[i].getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }

  // Check if the streak includes today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const lastDate = new Date(sorted[0]);
  lastDate.setHours(0, 0, 0, 0);
  const daysSinceLast = Math.floor(
    (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysSinceLast > 1) return 0; // Streak broken
  return streak;
}

export { getXpProgress, getLevelForXp };
