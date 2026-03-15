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
  daily: { bg: "bg-emerald-500/20", text: "text-emerald-300", label: "Daily" },
  weekly: { bg: "bg-blue-500/20", text: "text-blue-300", label: "Weekly" },
  milestone: { bg: "bg-amber-500/20", text: "text-amber-300", label: "Milestone" },
  discovery: { bg: "bg-purple-500/20", text: "text-purple-300", label: "Discovery" },
};

const STATUS_STYLES: Record<string, { dot: string; label: string }> = {
  available: { dot: "bg-white/30", label: "Available" },
  active: { dot: "bg-emerald-400 animate-pulse", label: "In Progress" },
  completed: { dot: "bg-indigo-400", label: "Completed" },
};

export default function QuestCard({ quest, onStart, onComplete }: QuestCardProps) {
  const typeStyle = QUEST_TYPE_STYLES[quest.questType] || QUEST_TYPE_STYLES.daily;
  const statusStyle = STATUS_STYLES[quest.status] || STATUS_STYLES.available;

  return (
    <div
      className={`rounded-2xl border bg-white/[0.04] p-5 transition-all duration-200 ${
        quest.status === "completed"
          ? "border-white/[0.06] opacity-75"
          : "border-white/[0.06] hover:border-indigo-400/30 hover:bg-white/[0.06]"
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
            <span className="text-xs text-white/50">{statusStyle.label}</span>
          </div>
        </div>

        {/* XP Badge */}
        <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 px-2.5 py-1">
          <svg className="h-3.5 w-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
          </svg>
          <span className="text-xs font-bold text-indigo-300">+{quest.xpReward} XP</span>
        </div>
      </div>

      {/* Content */}
      <h3 className={`mb-1 font-semibold ${quest.status === "completed" ? "text-white/50 line-through" : "text-white/90"}`}>
        {quest.title}
      </h3>
      <p className="mb-4 text-sm text-white/50 leading-relaxed">{quest.description}</p>

      {/* Action Button */}
      {quest.status === "available" && onStart && (
        <button
          type="button"
          onClick={() => onStart(quest.id)}
          className="w-full rounded-xl border border-indigo-400/20 bg-indigo-500/10 px-4 py-2.5 text-sm font-semibold text-indigo-300 transition-colors hover:bg-indigo-500/15"
        >
          Start Quest
        </button>
      )}
      {quest.status === "active" && onComplete && (
        <button
          type="button"
          onClick={() => onComplete(quest.id)}
          className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:shadow-xl"
        >
          Complete Quest
        </button>
      )}
      {quest.status === "completed" && (
        <div className="flex items-center gap-2 rounded-xl bg-white/[0.06] px-4 py-2.5 text-sm font-medium text-white/50">
          <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
          Quest Completed
        </div>
      )}
    </div>
  );
}
