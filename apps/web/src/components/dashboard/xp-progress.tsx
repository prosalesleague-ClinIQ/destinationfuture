"use client";

interface XpProgressProps {
  currentXp: number;
  currentLevel: { level: number; name: string };
  nextLevel: { level: number; name: string; xpRequired: number } | null;
  progressPercent: number;
}

export default function XpProgress({ currentXp, currentLevel, nextLevel, progressPercent }: XpProgressProps) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-6 shadow-lg shadow-black/20">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-xl font-bold text-white shadow-lg shadow-indigo-500/20">
            {currentLevel.level}
          </div>
          <div>
            <p className="text-lg font-bold text-white/90">{currentLevel.name}</p>
            <p className="text-sm text-white/50">Level {currentLevel.level}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{currentXp.toLocaleString()}</p>
          <p className="text-xs text-white/50">Total XP</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-2">
        <div className="h-3 w-full overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000 ease-out"
            style={{ width: `${Math.min(progressPercent, 100)}%` }}
          />
        </div>
      </div>

      {/* XP info */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-white/50">
          {progressPercent.toFixed(0)}% to next level
        </span>
        {nextLevel && (
          <span className="text-white/50">
            {nextLevel.xpRequired - currentXp} XP needed
          </span>
        )}
      </div>

      {/* Next level unlock */}
      {nextLevel && (
        <div className="mt-4 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 px-4 py-3">
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-indigo-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
            <span className="text-sm font-medium text-indigo-300">
              Level {nextLevel.level}: {nextLevel.name}
            </span>
          </div>
          <p className="mt-1 text-xs text-indigo-400">
            Unlocks at {nextLevel.xpRequired.toLocaleString()} XP
          </p>
        </div>
      )}
    </div>
  );
}
