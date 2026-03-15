"use client";

import { useState, useMemo } from "react";
import QuestCard from "@/components/dashboard/quest-card";

/* ─── Placeholder Data ─── */
const MOCK_QUESTS = [
  {
    id: "q1",
    title: "Morning Reflection",
    description: "Write a 3-sentence reflection about your current emotional state and what you're grateful for.",
    xpReward: 15,
    status: "active" as const,
    questType: "daily" as const,
  },
  {
    id: "q2",
    title: "Shadow Journal",
    description: "Identify one pattern that frustrated you this week and explore where it originated.",
    xpReward: 30,
    status: "active" as const,
    questType: "weekly" as const,
  },
  {
    id: "q3",
    title: "City Explorer",
    description: "Generate a location analysis and compare your top 3 cities side by side.",
    xpReward: 25,
    status: "available" as const,
    questType: "discovery" as const,
  },
  {
    id: "q4",
    title: "Numerology Deep Dive",
    description: "Read your full numerology section and journal about one insight that resonated.",
    xpReward: 20,
    status: "available" as const,
    questType: "discovery" as const,
  },
  {
    id: "q5",
    title: "Evening Wind-Down",
    description: "Reflect on three things you accomplished today, no matter how small.",
    xpReward: 15,
    status: "available" as const,
    questType: "daily" as const,
  },
  {
    id: "q6",
    title: "7-Day Champion",
    description: "Complete all 7 days of your personalized starter plan without missing a day.",
    xpReward: 100,
    status: "active" as const,
    questType: "milestone" as const,
  },
  {
    id: "q7",
    title: "Love Language Explorer",
    description: "Generate and read your Love Languages section. Reflect on whether it matches your experience.",
    xpReward: 25,
    status: "completed" as const,
    questType: "discovery" as const,
  },
  {
    id: "q8",
    title: "First Report",
    description: "Generate your very first Destination Future report.",
    xpReward: 50,
    status: "completed" as const,
    questType: "milestone" as const,
  },
  {
    id: "q9",
    title: "Style Discovery",
    description: "Generate your Fashion System section and save your color palette.",
    xpReward: 20,
    status: "completed" as const,
    questType: "discovery" as const,
  },
  {
    id: "q10",
    title: "Gratitude Streak",
    description: "Complete 3 consecutive daily reflections focused on gratitude.",
    xpReward: 45,
    status: "completed" as const,
    questType: "weekly" as const,
  },
  {
    id: "q11",
    title: "Career Clarity",
    description: "Read your Career & Money section and list 3 actionable next steps.",
    xpReward: 30,
    status: "available" as const,
    questType: "weekly" as const,
  },
  {
    id: "q12",
    title: "Mindful Morning",
    description: "Start your day with 5 minutes of intentional breathing before checking your phone.",
    xpReward: 10,
    status: "available" as const,
    questType: "daily" as const,
  },
];

type Tab = "all" | "active" | "completed";
type QuestType = "all" | "daily" | "weekly" | "milestone" | "discovery";

const QUEST_TYPE_FILTERS: { key: QuestType; label: string }[] = [
  { key: "all", label: "All Types" },
  { key: "daily", label: "Daily" },
  { key: "weekly", label: "Weekly" },
  { key: "milestone", label: "Milestone" },
  { key: "discovery", label: "Discovery" },
];

export default function QuestsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [questTypeFilter, setQuestTypeFilter] = useState<QuestType>("all");

  const filteredQuests = useMemo(() => {
    return MOCK_QUESTS.filter((q) => {
      if (activeTab === "active" && q.status !== "active") return false;
      if (activeTab === "completed" && q.status !== "completed") return false;
      if (questTypeFilter !== "all" && q.questType !== questTypeFilter) return false;
      return true;
    });
  }, [activeTab, questTypeFilter]);

  const totalXpEarned = MOCK_QUESTS.filter((q) => q.status === "completed").reduce((sum, q) => sum + q.xpReward, 0);
  const activeCount = MOCK_QUESTS.filter((q) => q.status === "active").length;
  const completedCount = MOCK_QUESTS.filter((q) => q.status === "completed").length;

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-surface-900">Quests</h1>
        <p className="mt-1 text-surface-700">Complete quests to earn XP, level up, and unlock new features.</p>
      </div>

      {/* XP Summary */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-surface-200 bg-white p-5 text-center">
          <p className="text-3xl font-bold text-gradient">{totalXpEarned}</p>
          <p className="mt-1 text-sm text-surface-700">Total XP Earned</p>
        </div>
        <div className="rounded-2xl border border-surface-200 bg-white p-5 text-center">
          <p className="text-3xl font-bold text-brand-600">{activeCount}</p>
          <p className="mt-1 text-sm text-surface-700">Active Quests</p>
        </div>
        <div className="rounded-2xl border border-surface-200 bg-white p-5 text-center">
          <p className="text-3xl font-bold text-emerald-600">{completedCount}</p>
          <p className="mt-1 text-sm text-surface-700">Completed</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex items-center gap-6 border-b border-surface-200">
        {(["all", "active", "completed"] as Tab[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`relative pb-3 text-sm font-medium capitalize transition-colors ${
              activeTab === tab
                ? "text-brand-600"
                : "text-surface-700 hover:text-surface-900"
            }`}
          >
            {tab}
            {tab === "active" && <span className="ml-1.5 text-xs text-surface-300">({activeCount})</span>}
            {tab === "completed" && <span className="ml-1.5 text-xs text-surface-300">({completedCount})</span>}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-gradient-to-r from-brand-500 to-cosmic-500" />
            )}
          </button>
        ))}
      </div>

      {/* Type Filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        {QUEST_TYPE_FILTERS.map((filter) => (
          <button
            key={filter.key}
            type="button"
            onClick={() => setQuestTypeFilter(filter.key)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              questTypeFilter === filter.key
                ? "bg-brand-100 text-brand-700 shadow-sm"
                : "bg-white text-surface-700 border border-surface-200 hover:border-surface-300"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Quest Grid */}
      {filteredQuests.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredQuests.map((quest) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              onStart={(id) => console.log("Start quest:", id)}
              onComplete={(id) => console.log("Complete quest:", id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-surface-200 py-16">
          <svg className="mb-3 h-10 w-10 text-surface-300" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
          </svg>
          <p className="text-lg font-medium text-surface-700">No quests found</p>
          <p className="mt-1 text-sm text-surface-300">Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
}
