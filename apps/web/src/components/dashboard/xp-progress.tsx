"use client";

interface XpProgressProps {
  currentXp: number;
  currentLevel: { level: number; name: string };
  nextLevel: { level: number; name: string; xpRequired: number } | null;
  progressPercent: number;
}

export default function XpProgress({ currentXp, currentLevel, nextLevel, progressPercent }: XpProgressProps) {
  return (
    <div className="rounded-2xl border border-surface-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-cosmic-500 text-xl font-bold text-white shadow-md shadow-brand-500/20">
            {currentLevel.level}
          </div>
          <div>
            <p className="text-lg font-bold text-surface-900">{currentLevel.name}</p>
            <p className="text-sm text-surface-700">Level {currentLevel.level}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gradient">{currentXp.toLocaleString()}</p>
          <p className="text-xs text-surface-700">Total XP</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-2">
        <div className="h-3 w-full overflow-hidden rounded-full bg-surface-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-500 to-cosmic-500 transition-all duration-1000 ease-out"
            style={{ width: `${Math.min(progressPercent, 100)}%` }}
          />
        </div>
      </div>

      {/* XP info */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-surface-700">
          {progressPercent.toFixed(0)}% to next level
        </span>
        {nextLevel && (
          <span className="text-surface-700">
            {nextLevel.xpRequired - currentXp} XP needed
          </span>
        )}
      </div>

      {/* Next level unlock */}
      {nextLevel && (
        <div className="mt-4 rounded-xl bg-gradient-to-r from-brand-50 to-cosmic-50 px-4 py-3">
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-brand-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
            <span className="text-sm font-medium text-brand-700">
              Level {nextLevel.level}: {nextLevel.name}
            </span>
          </div>
          <p className="mt-1 text-xs text-brand-600">
            Unlocks at {nextLevel.xpRequired.toLocaleString()} XP
          </p>
        </div>
      )}
    </div>
  );
}
