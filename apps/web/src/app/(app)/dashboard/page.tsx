"use client";

import Link from "next/link";
import XpProgress from "@/components/dashboard/xp-progress";
import QuestCard from "@/components/dashboard/quest-card";

/* ─── Placeholder Data ─── */
const MOCK_USER = {
  firstName: "Alex",
  level: { level: 3, name: "Seeker" },
  nextLevel: { level: 4, name: "Pathfinder", xpRequired: 500 },
  currentXp: 345,
  progressPercent: 69,
};

const MOCK_STATS = {
  reportsGenerated: 7,
  questsCompleted: 12,
  currentStreak: 5,
};

const MOCK_BADGES = [
  { id: "1", name: "First Report", icon: "scroll", earnedAt: "2 days ago" },
  { id: "2", name: "Self-Aware", icon: "eye", earnedAt: "5 days ago" },
  { id: "3", name: "Explorer", icon: "compass", earnedAt: "1 week ago" },
];

const MOCK_QUESTS = [
  {
    id: "q1",
    title: "Morning Reflection",
    description: "Write a 3-sentence reflection about your current emotional state.",
    xpReward: 15,
    status: "active" as const,
    questType: "daily" as const,
  },
  {
    id: "q2",
    title: "Shadow Journal",
    description: "Identify one pattern that frustrated you this week and explore its origin.",
    xpReward: 30,
    status: "active" as const,
    questType: "weekly" as const,
  },
  {
    id: "q3",
    title: "City Explorer",
    description: "Generate a location analysis and compare your top 3 cities.",
    xpReward: 25,
    status: "available" as const,
    questType: "discovery" as const,
  },
];

const MOCK_REPORTS = [
  { id: "r1", title: "Full Report", createdAt: "Today, 2:34 PM", sectionCount: 22, preset: "Full Report" },
  { id: "r2", title: "Love Focus", createdAt: "Yesterday, 10:15 AM", sectionCount: 5, preset: "Love Focus" },
  { id: "r3", title: "Career Focus", createdAt: "Mar 12, 9:00 AM", sectionCount: 5, preset: "Career Focus" },
];

export default function DashboardPage() {
  return (
    <>
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white/90">
          Welcome back, <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{MOCK_USER.firstName}</span>
        </h1>
        <p className="mt-1 text-white/50">Here&apos;s your growth snapshot for today.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* XP Progress */}
          <XpProgress
            currentXp={MOCK_USER.currentXp}
            currentLevel={MOCK_USER.level}
            nextLevel={MOCK_USER.nextLevel}
            progressPercent={MOCK_USER.progressPercent}
          />

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5 text-center">
              <p className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{MOCK_STATS.reportsGenerated}</p>
              <p className="mt-1 text-sm text-white/50">Reports Generated</p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5 text-center">
              <p className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{MOCK_STATS.questsCompleted}</p>
              <p className="mt-1 text-sm text-white/50">Quests Completed</p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5 text-center">
              <div className="flex items-center justify-center gap-1">
                <p className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{MOCK_STATS.currentStreak}</p>
                <svg className="h-6 w-6 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.75 2.25c.966 3.767.41 6.65-1.015 8.604C10.49 12.713 8.59 13.63 7.5 14.25c-.08.046-.116.098-.116.16 0 .054.03.099.082.138 1.27.955 3.083 1.42 4.854 1.11 1.17-.205 2.274-.727 3.15-1.508a7.46 7.46 0 0 0 2.39-4.287c.22-1.324.04-2.705-.486-3.942a7.474 7.474 0 0 0-2.636-3.172c-.616-.45-1.298-.795-1.988-1.549ZM8.25 17.25c-.622 0-1.228.076-1.813.222C4.863 17.872 3.75 19.04 3.75 20.25c0 .966.784 1.75 1.75 1.75h13c.966 0 1.75-.784 1.75-1.75 0-1.21-1.113-2.378-2.687-2.778A6.716 6.716 0 0 0 15.75 17.25h-7.5Z" />
                </svg>
              </div>
              <p className="mt-1 text-sm text-white/50">Day Streak</p>
            </div>
          </div>

          {/* Active Quests */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white/90">Active Quests</h2>
              <Link href="/quests" className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                View All
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {MOCK_QUESTS.filter((q) => q.status === "active").map((quest) => (
                <QuestCard
                  key={quest.id}
                  quest={quest}
                  onComplete={(id) => console.log("Complete quest:", id)}
                />
              ))}
            </div>
          </div>

          {/* Recent Reports */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white/90">Recent Reports</h2>
              <Link href="/report" className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                Build New
              </Link>
            </div>
            <div className="space-y-3">
              {MOCK_REPORTS.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.04] px-5 py-4 transition-all hover:border-indigo-400/30 hover:bg-white/[0.06]"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-400">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-white/90">{report.title}</p>
                      <p className="text-sm text-white/50">{report.createdAt}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="hidden rounded-full bg-white/[0.06] px-2.5 py-1 text-xs font-medium text-white/50 sm:inline-flex">
                      {report.sectionCount} sections
                    </span>
                    <svg className="h-5 w-5 text-white/30" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-6 shadow-lg shadow-black/20">
            <h2 className="mb-4 text-lg font-semibold text-white/90">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                href="/report"
                className="flex items-center gap-3 rounded-xl border border-indigo-400/20 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 px-4 py-3 text-sm font-medium text-indigo-300 transition-all hover:bg-indigo-500/15"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                </svg>
                Generate Report
              </Link>
              <Link
                href="/quests"
                className="flex items-center gap-3 rounded-xl border border-white/[0.06] px-4 py-3 text-sm font-medium text-white/90 transition-all hover:bg-white/[0.06]"
              >
                <svg className="h-5 w-5 text-white/50" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
                </svg>
                Start Quest
              </Link>
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-xl border border-white/[0.06] px-4 py-3 text-left text-sm font-medium text-white/90 transition-all hover:bg-white/[0.06]"
              >
                <svg className="h-5 w-5 text-white/50" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                </svg>
                Daily Reflection
              </button>
            </div>
          </div>

          {/* Recent Badges */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-6 shadow-lg shadow-black/20">
            <h2 className="mb-4 text-lg font-semibold text-white/90">Recent Badges</h2>
            <div className="space-y-3">
              {MOCK_BADGES.map((badge) => (
                <div key={badge.id} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20">
                    {badge.icon === "scroll" && (
                      <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                      </svg>
                    )}
                    {badge.icon === "eye" && (
                      <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                    )}
                    {badge.icon === "compass" && (
                      <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white/90">{badge.name}</p>
                    <p className="text-xs text-white/50">{badge.earnedAt}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Available Quest */}
          <div>
            <h2 className="mb-3 text-lg font-semibold text-white/90">Discover</h2>
            {MOCK_QUESTS.filter((q) => q.status === "available").map((quest) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                onStart={(id) => console.log("Start quest:", id)}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
