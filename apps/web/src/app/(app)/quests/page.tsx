"use client";

import { useState, useMemo } from "react";

/* ─── Types ─── */
interface Quest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  status: "available" | "active" | "completed";
  questType: "daily" | "weekly" | "milestone" | "discovery";
  icon: string;
  color: string;
}

const INITIAL_QUESTS: Quest[] = [
  { id: "q1", title: "Morning Reflection", description: "Write a 3-sentence reflection about your current emotional state and what you're grateful for.", xpReward: 15, status: "active", questType: "daily", icon: "🌅", color: "from-amber-400 to-orange-500" },
  { id: "q2", title: "Shadow Journal", description: "Identify one pattern that frustrated you this week and explore where it originated.", xpReward: 30, status: "active", questType: "weekly", icon: "🌑", color: "from-violet-500 to-purple-600" },
  { id: "q3", title: "City Explorer", description: "Generate a location analysis and compare your top 3 cities side by side.", xpReward: 25, status: "available", questType: "discovery", icon: "🗺️", color: "from-cyan-400 to-blue-500" },
  { id: "q4", title: "Numerology Deep Dive", description: "Read your full numerology section and journal about one insight that resonated.", xpReward: 20, status: "available", questType: "discovery", icon: "🔢", color: "from-indigo-400 to-blue-600" },
  { id: "q5", title: "Evening Wind-Down", description: "Reflect on three things you accomplished today, no matter how small.", xpReward: 15, status: "available", questType: "daily", icon: "🌙", color: "from-blue-400 to-indigo-500" },
  { id: "q6", title: "7-Day Champion", description: "Complete all 7 days of your personalized starter plan without missing a day.", xpReward: 100, status: "active", questType: "milestone", icon: "🏆", color: "from-amber-400 to-yellow-500" },
  { id: "q7", title: "Love Language Explorer", description: "Generate and read your Love Languages section. Reflect on whether it matches.", xpReward: 25, status: "completed", questType: "discovery", icon: "💜", color: "from-pink-400 to-rose-500" },
  { id: "q8", title: "First Report", description: "Generate your very first Destination Future report.", xpReward: 50, status: "completed", questType: "milestone", icon: "📜", color: "from-emerald-400 to-green-500" },
  { id: "q9", title: "Style Discovery", description: "Generate your Fashion System section and save your color palette.", xpReward: 20, status: "completed", questType: "discovery", icon: "👔", color: "from-fuchsia-400 to-pink-500" },
  { id: "q10", title: "Gratitude Streak", description: "Complete 3 consecutive daily reflections focused on gratitude.", xpReward: 45, status: "completed", questType: "weekly", icon: "🙏", color: "from-teal-400 to-emerald-500" },
  { id: "q11", title: "Career Clarity", description: "Read your Career & Money section and list 3 actionable next steps.", xpReward: 30, status: "available", questType: "weekly", icon: "💼", color: "from-blue-500 to-indigo-600" },
  { id: "q12", title: "Playlist Builder", description: "Listen to your entire Spotify Pack and rate each track.", xpReward: 20, status: "available", questType: "discovery", icon: "🎵", color: "from-green-400 to-emerald-500" },
];

type Tab = "all" | "active" | "completed";
type QuestType = "all" | "daily" | "weekly" | "milestone" | "discovery";

const TYPE_FILTERS: { key: QuestType; label: string; emoji: string }[] = [
  { key: "all", label: "All", emoji: "✨" },
  { key: "daily", label: "Daily", emoji: "☀️" },
  { key: "weekly", label: "Weekly", emoji: "📅" },
  { key: "milestone", label: "Milestone", emoji: "🏆" },
  { key: "discovery", label: "Discovery", emoji: "🔍" },
];

export default function QuestsPage() {
  const [quests, setQuests] = useState<Quest[]>(INITIAL_QUESTS);
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [typeFilter, setTypeFilter] = useState<QuestType>("all");
  const [xpPopup, setXpPopup] = useState<{ id: string; amount: number } | null>(null);
  const [totalXpEarned, setTotalXpEarned] = useState(
    INITIAL_QUESTS.filter((q) => q.status === "completed").reduce((s, q) => s + q.xpReward, 0)
  );

  const handleStart = (questId: string) => {
    setQuests((prev) =>
      prev.map((q) => (q.id === questId ? { ...q, status: "active" as const } : q))
    );
  };

  const handleComplete = (questId: string) => {
    const quest = quests.find((q) => q.id === questId);
    if (!quest) return;

    setQuests((prev) =>
      prev.map((q) => (q.id === questId ? { ...q, status: "completed" as const } : q))
    );
    setTotalXpEarned((prev) => prev + quest.xpReward);
    setXpPopup({ id: questId, amount: quest.xpReward });
    setTimeout(() => setXpPopup(null), 2000);
  };

  const filtered = useMemo(() => {
    return quests.filter((q) => {
      if (activeTab === "active" && q.status !== "active") return false;
      if (activeTab === "completed" && q.status !== "completed") return false;
      if (typeFilter !== "all" && q.questType !== typeFilter) return false;
      return true;
    });
  }, [quests, activeTab, typeFilter]);

  const activeCount = quests.filter((q) => q.status === "active").length;
  const completedCount = quests.filter((q) => q.status === "completed").length;

  return (
    <div className="mx-auto max-w-5xl">
      {/* XP Popup Toast */}
      {xpPopup && (
        <div className="fixed top-6 right-6 z-50 animate-slide-up">
          <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-brand-600 to-cosmic-600 px-6 py-4 text-white shadow-2xl">
            <span className="text-2xl">⚡</span>
            <div>
              <p className="font-bold text-lg">+{xpPopup.amount} XP</p>
              <p className="text-sm opacity-90">Quest completed!</p>
            </div>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <div className="mb-8 rounded-3xl bg-gradient-to-br from-brand-600 via-cosmic-600 to-purple-700 p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Quests</h1>
            <p className="mt-1 opacity-90">Complete quests to earn XP, level up, and unlock new features.</p>
          </div>
          <div className="hidden sm:block text-6xl">⚔️</div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="rounded-2xl bg-white/15 backdrop-blur-sm p-4 text-center">
            <p className="text-3xl font-bold">{totalXpEarned}</p>
            <p className="text-sm opacity-80">XP Earned</p>
          </div>
          <div className="rounded-2xl bg-white/15 backdrop-blur-sm p-4 text-center">
            <p className="text-3xl font-bold">{activeCount}</p>
            <p className="text-sm opacity-80">Active</p>
          </div>
          <div className="rounded-2xl bg-white/15 backdrop-blur-sm p-4 text-center">
            <p className="text-3xl font-bold">{completedCount}</p>
            <p className="text-sm opacity-80">Completed</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex items-center gap-1 rounded-xl bg-surface-100 p-1">
        {(["all", "active", "completed"] as Tab[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium capitalize transition-all ${
              activeTab === tab
                ? "bg-white text-surface-900 shadow-sm"
                : "text-surface-700 hover:text-surface-900"
            }`}
          >
            {tab}
            {tab === "active" && activeCount > 0 && (
              <span className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-100 text-[10px] font-bold text-brand-700">{activeCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* Type Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        {TYPE_FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setTypeFilter(f.key)}
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${
              typeFilter === f.key
                ? "bg-brand-600 text-white shadow-md"
                : "bg-white text-surface-700 border border-surface-200 hover:border-brand-300 hover:shadow-sm"
            }`}
          >
            <span>{f.emoji}</span>
            {f.label}
          </button>
        ))}
      </div>

      {/* Quest Grid */}
      {filtered.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((quest) => (
            <div
              key={quest.id}
              className={`group relative overflow-hidden rounded-2xl border bg-white transition-all duration-300 ${
                quest.status === "completed"
                  ? "border-surface-200 opacity-80"
                  : "border-surface-200 hover:border-transparent hover:shadow-xl hover:-translate-y-1"
              }`}
            >
              {/* Gradient top bar */}
              <div className={`h-2 bg-gradient-to-r ${quest.color}`} />

              <div className="p-5">
                {/* Top row */}
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{quest.icon}</span>
                  <div className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-brand-50 to-cosmic-50 px-3 py-1">
                    <span className="text-xs">⚡</span>
                    <span className="text-xs font-bold text-brand-700">+{quest.xpReward} XP</span>
                  </div>
                </div>

                {/* Content */}
                <h3 className={`text-lg font-bold mb-1 ${quest.status === "completed" ? "text-surface-300 line-through" : "text-surface-900"}`}>
                  {quest.title}
                </h3>
                <p className="text-sm text-surface-700 leading-relaxed mb-4">{quest.description}</p>

                {/* Type + Status */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="rounded-full bg-surface-100 px-2.5 py-0.5 text-xs font-medium text-surface-700 capitalize">
                    {quest.questType}
                  </span>
                  {quest.status === "active" && (
                    <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      In Progress
                    </span>
                  )}
                  {quest.status === "completed" && (
                    <span className="flex items-center gap-1 text-xs text-brand-600 font-medium">
                      ✓ Done
                    </span>
                  )}
                </div>

                {/* Action Button */}
                {quest.status === "available" && (
                  <button
                    type="button"
                    onClick={() => handleStart(quest.id)}
                    className="w-full rounded-xl border-2 border-brand-200 bg-brand-50 px-4 py-3 text-sm font-bold text-brand-700 transition-all hover:bg-brand-100 hover:border-brand-300 hover:shadow-sm active:scale-[0.98]"
                  >
                    🚀 Start Quest
                  </button>
                )}
                {quest.status === "active" && (
                  <button
                    type="button"
                    onClick={() => handleComplete(quest.id)}
                    className={`w-full rounded-xl bg-gradient-to-r ${quest.color} px-4 py-3 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]`}
                  >
                    ✅ Complete Quest
                  </button>
                )}
                {quest.status === "completed" && (
                  <div className="flex items-center justify-center gap-2 rounded-xl bg-surface-50 px-4 py-3 text-sm font-medium text-surface-300">
                    <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    Quest Completed
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-surface-200 py-20">
          <span className="text-5xl mb-4">🔍</span>
          <p className="text-xl font-bold text-surface-700">No quests found</p>
          <p className="mt-1 text-sm text-surface-300">Try changing your filters.</p>
        </div>
      )}
    </div>
  );
}
