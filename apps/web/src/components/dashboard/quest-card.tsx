"use client";

interface Quest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  status: "available" | "active" | "completed";
  questType: "daily" | "weekly" | "milestone" | "discovery";
}

interface QuestCardProps {
  quest: Quest;
  onStart?: (questId: string) => void;
  onComplete?: (questId: string) => void;
}

const QUEST_TYPE_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  daily: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Daily" },
  weekly: { bg: "bg-blue-100", text: "text-blue-700", label: "Weekly" },
  milestone: { bg: "bg-amber-100", text: "text-amber-700", label: "Milestone" },
  discovery: { bg: "bg-purple-100", text: "text-purple-700", label: "Discovery" },
};

const STATUS_STYLES: Record<string, { dot: string; label: string }> = {
  available: { dot: "bg-surface-300", label: "Available" },
  active: { dot: "bg-emerald-400 animate-pulse", label: "In Progress" },
  completed: { dot: "bg-brand-500", label: "Completed" },
};

export default function QuestCard({ quest, onStart, onComplete }: QuestCardProps) {
  const typeStyle = QUEST_TYPE_STYLES[quest.questType] || QUEST_TYPE_STYLES.daily;
  const statusStyle = STATUS_STYLES[quest.status] || STATUS_STYLES.available;

  return (
    <div
      className={`rounded-2xl border bg-white p-5 transition-all duration-200 ${
        quest.status === "completed"
          ? "border-surface-200 opacity-75"
          : "border-surface-200 hover:border-brand-200 hover:shadow-sm"
      }`}
    >
      {/* Top row */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${typeStyle.bg} ${typeStyle.text}`}>
            {typeStyle.label}
          </span>
          <div className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${statusStyle.dot}`} />
            <span className="text-xs text-surface-700">{statusStyle.label}</span>
          </div>
        </div>

        {/* XP Badge */}
        <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-brand-50 to-cosmic-50 px-2.5 py-1">
          <svg className="h-3.5 w-3.5 text-brand-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
          </svg>
          <span className="text-xs font-bold text-brand-700">+{quest.xpReward} XP</span>
        </div>
      </div>

      {/* Content */}
      <h3 className={`mb-1 font-semibold ${quest.status === "completed" ? "text-surface-700 line-through" : "text-surface-900"}`}>
        {quest.title}
      </h3>
      <p className="mb-4 text-sm text-surface-700 leading-relaxed">{quest.description}</p>

      {/* Action Button */}
      {quest.status === "available" && onStart && (
        <button
          type="button"
          onClick={() => onStart(quest.id)}
          className="w-full rounded-xl border border-brand-200 bg-brand-50 px-4 py-2.5 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-100"
        >
          Start Quest
        </button>
      )}
      {quest.status === "active" && onComplete && (
        <button
          type="button"
          onClick={() => onComplete(quest.id)}
          className="w-full rounded-xl bg-gradient-to-r from-brand-600 to-cosmic-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md"
        >
          Complete Quest
        </button>
      )}
      {quest.status === "completed" && (
        <div className="flex items-center gap-2 rounded-xl bg-surface-50 px-4 py-2.5 text-sm font-medium text-surface-700">
          <svg className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
          Quest Completed
        </div>
      )}
    </div>
  );
}
