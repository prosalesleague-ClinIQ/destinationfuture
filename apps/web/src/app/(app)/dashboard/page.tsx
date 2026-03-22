"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import XpProgress from "@/components/dashboard/xp-progress";
import QuestCard from "@/components/dashboard/quest-card";
import { db, type UserProgress, type UserProfile } from "@/lib/db";

/* ─── Quest Definitions ─── */
const ALL_QUESTS = [
  { id: "q1", title: "Morning Reflection", description: "Write a 3-sentence reflection about your current emotional state.", xpReward: 15, questType: "daily" as const },
  { id: "q2", title: "Shadow Journal", description: "Identify one pattern that frustrated you this week and explore its origin.", xpReward: 30, questType: "weekly" as const },
  { id: "q3", title: "City Explorer", description: "Generate a location analysis and compare your top 3 cities.", xpReward: 25, questType: "discovery" as const },
  { id: "q4", title: "Gratitude List", description: "Write down 5 things you are grateful for today.", xpReward: 10, questType: "daily" as const },
  { id: "q5", title: "Future Letter", description: "Write a letter to your future self about where you want to be in 1 year.", xpReward: 40, questType: "discovery" as const },
  { id: "q6", title: "Pattern Breaker", description: "Do one thing today that goes against your default behavior pattern.", xpReward: 20, questType: "weekly" as const },
];

const BADGE_DISPLAY: Record<string, { name: string; icon: string }> = {
  "first-quest": { name: "First Quest", icon: "bolt" },
  "first-report": { name: "First Report", icon: "scroll" },
  "first-reflection": { name: "Self-Aware", icon: "eye" },
  "quest-master": { name: "Quest Master", icon: "compass" },
  "streak-3": { name: "3-Day Streak", icon: "fire" },
  "streak-7": { name: "Week Warrior", icon: "fire" },
};

function BadgeIcon({ icon }: { icon: string }) {
  if (icon === "bolt") return (
    <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  );
  if (icon === "scroll") return (
    <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
  );
  if (icon === "eye") return (
    <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  );
  if (icon === "compass") return (
    <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
    </svg>
  );
  return (
    <svg className="h-5 w-5 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12.75 2.25c.966 3.767.41 6.65-1.015 8.604C10.49 12.713 8.59 13.63 7.5 14.25c-.08.046-.116.098-.116.16 0 .054.03.099.082.138 1.27.955 3.083 1.42 4.854 1.11 1.17-.205 2.274-.727 3.15-1.508a7.46 7.46 0 0 0 2.39-4.287c.22-1.324.04-2.705-.486-3.942a7.474 7.474 0 0 0-2.636-3.172c-.616-.45-1.298-.795-1.988-1.549ZM8.25 17.25c-.622 0-1.228.076-1.813.222C4.863 17.872 3.75 19.04 3.75 20.25c0 .966.784 1.75 1.75 1.75h13c.966 0 1.75-.784 1.75-1.75 0-1.21-1.113-2.378-2.687-2.778A6.716 6.716 0 0 0 15.75 17.25h-7.5Z" />
    </svg>
  );
}

export default function DashboardPage() {
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    (async () => {
      const user = await db.getCurrentUser();
      if (user) {
        setUserName(user.firstName);
        setUserId(user.id);
        setProgress(await db.getProgress(user.id));
      }
      const p = await db.getProfile();
      if (p) setProfile(p);
    })();
  }, []);

  const refreshProgress = useCallback(async () => {
    if (userId) setProgress(await db.getProgress(userId));
  }, [userId]);

  const handleCompleteQuest = async (questId: string) => {
    if (!userId) return;
    const quest = ALL_QUESTS.find((q) => q.id === questId);
    if (!quest) return;
    await db.completeQuest(userId, questId, quest.xpReward);
    refreshProgress();
  };

  const handleStartQuest = async (questId: string) => {
    if (!userId) return;
    await db.startQuest(userId, questId);
    refreshProgress();
  };

  const stats = progress
    ? { reportsGenerated: progress.reportsGenerated, questsCompleted: progress.questsCompleted.length, currentStreak: progress.streak }
    : { reportsGenerated: 0, questsCompleted: 0, currentStreak: 0 };

  const levelInfo = progress
    ? db.getLevelInfo(progress.xp)
    : { current: { level: 1, name: "Awakened", xpRequired: 0 }, next: { level: 2, name: "Curious", xpRequired: 100 }, progressPercent: 0 };

  const currentXp = progress ? progress.xp : 0;

  const activeQuests = ALL_QUESTS.filter((q) =>
    progress ? progress.questsActive.includes(q.id) : false
  );
  const availableQuests = ALL_QUESTS.filter((q) =>
    progress
      ? !progress.questsActive.includes(q.id) && !progress.questsCompleted.includes(q.id)
      : true
  );

  const earnedBadges = progress
    ? progress.badges.map((b) => BADGE_DISPLAY[b]).filter(Boolean)
    : [];

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white/90">
          Welcome back, <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{userName}</span>
        </h1>
        <p className="mt-1 text-white/50">
          {profile?.careerField
            ? `Focused on ${profile.careerField}. `
            : ""}
          {profile?.goals && profile.goals.length > 0
            ? `Your journey: ${profile.goals.slice(0, 2).join(", ")}.`
            : "Here\u2019s your growth snapshot for today."}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <XpProgress currentXp={currentXp} currentLevel={levelInfo.current} nextLevel={levelInfo.next} progressPercent={levelInfo.progressPercent} />

          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5 text-center">
              <p className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{stats.reportsGenerated}</p>
              <p className="mt-1 text-sm text-white/50">Reports Generated</p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5 text-center">
              <p className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{stats.questsCompleted}</p>
              <p className="mt-1 text-sm text-white/50">Quests Completed</p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5 text-center">
              <div className="flex items-center justify-center gap-1">
                <p className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{stats.currentStreak}</p>
                <svg className="h-6 w-6 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.75 2.25c.966 3.767.41 6.65-1.015 8.604C10.49 12.713 8.59 13.63 7.5 14.25c-.08.046-.116.098-.116.16 0 .054.03.099.082.138 1.27.955 3.083 1.42 4.854 1.11 1.17-.205 2.274-.727 3.15-1.508a7.46 7.46 0 0 0 2.39-4.287c.22-1.324.04-2.705-.486-3.942a7.474 7.474 0 0 0-2.636-3.172c-.616-.45-1.298-.795-1.988-1.549ZM8.25 17.25c-.622 0-1.228.076-1.813.222C4.863 17.872 3.75 19.04 3.75 20.25c0 .966.784 1.75 1.75 1.75h13c.966 0 1.75-.784 1.75-1.75 0-1.21-1.113-2.378-2.687-2.778A6.716 6.716 0 0 0 15.75 17.25h-7.5Z" />
                </svg>
              </div>
              <p className="mt-1 text-sm text-white/50">Day Streak</p>
            </div>
          </div>

          {activeQuests.length > 0 && (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white/90">Active Quests</h2>
                <Link href="/quests" className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors">View All</Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {activeQuests.map((quest) => (
                  <QuestCard key={quest.id} quest={{ ...quest, status: "active" }} onComplete={handleCompleteQuest} />
                ))}
              </div>
            </div>
          )}

          {progress && progress.questsCompleted.length > 0 && (
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-5 py-4">
              <p className="text-sm text-emerald-400 font-medium">
                {progress.questsCompleted.length} quest{progress.questsCompleted.length !== 1 ? "s" : ""} completed &mdash; {progress.xp} XP earned total
              </p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* Your Profile Summary */}
          {profile && (profile.relationshipStatus || profile.careerField || (profile.valuesList && profile.valuesList.length > 0) || (profile.stylePreferences && profile.stylePreferences.length > 0)) && (
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-6 shadow-lg shadow-black/20">
              <h2 className="mb-4 text-lg font-semibold text-white/90">Your Profile</h2>
              <div className="space-y-3">
                {profile.relationshipStatus && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-white/40 uppercase tracking-wide w-20 shrink-0">Status</span>
                    <span className="rounded-full bg-pink-500/15 border border-pink-500/20 px-3 py-0.5 text-xs font-medium text-pink-300">{profile.relationshipStatus}</span>
                  </div>
                )}
                {profile.careerField && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-white/40 uppercase tracking-wide w-20 shrink-0">Career</span>
                    <span className="rounded-full bg-cyan-500/15 border border-cyan-500/20 px-3 py-0.5 text-xs font-medium text-cyan-300">{profile.careerField}</span>
                  </div>
                )}
                {profile.valuesList && profile.valuesList.length > 0 && (
                  <div>
                    <span className="text-xs font-medium text-white/40 uppercase tracking-wide">Values</span>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {profile.valuesList.slice(0, 5).map((v) => (
                        <span key={v} className="rounded-full bg-emerald-500/15 border border-emerald-500/20 px-2.5 py-0.5 text-xs font-medium text-emerald-300">{v}</span>
                      ))}
                    </div>
                  </div>
                )}
                {profile.stylePreferences && profile.stylePreferences.length > 0 && (
                  <div>
                    <span className="text-xs font-medium text-white/40 uppercase tracking-wide">Style</span>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {profile.stylePreferences.slice(0, 3).map((s) => (
                        <span key={s} className="rounded-full bg-violet-500/15 border border-violet-500/20 px-2.5 py-0.5 text-xs font-medium text-violet-300">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-6 shadow-lg shadow-black/20">
            <h2 className="mb-4 text-lg font-semibold text-white/90">Quick Actions</h2>
            <div className="space-y-3">
              <Link href="/report" className="flex items-center gap-3 rounded-xl border border-indigo-400/20 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 px-4 py-3 text-sm font-medium text-indigo-300 transition-all hover:bg-indigo-500/15">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" /></svg>
                Generate Report
              </Link>
              <Link href="/quests" className="flex items-center gap-3 rounded-xl border border-white/[0.06] px-4 py-3 text-sm font-medium text-white/90 transition-all hover:bg-white/[0.06]">
                <svg className="h-5 w-5 text-white/50" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" /></svg>
                Start Quest
              </Link>
              <Link href="/future-you" className="flex items-center gap-3 rounded-xl border border-white/[0.06] px-4 py-3 text-sm font-medium text-white/90 transition-all hover:bg-white/[0.06]">
                <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" /></svg>
                Talk to Future You
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-6 shadow-lg shadow-black/20">
            <h2 className="mb-4 text-lg font-semibold text-white/90">{earnedBadges.length > 0 ? "Badges Earned" : "Badges"}</h2>
            {earnedBadges.length > 0 ? (
              <div className="space-y-3">
                {earnedBadges.map((badge, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20"><BadgeIcon icon={badge.icon} /></div>
                    <p className="text-sm font-semibold text-white/90">{badge.name}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-white/40">Complete quests and reflections to earn badges.</p>
            )}
          </div>

          {availableQuests.length > 0 && (
            <div>
              <h2 className="mb-3 text-lg font-semibold text-white/90">Discover</h2>
              <div className="space-y-3">
                {availableQuests.slice(0, 3).map((quest) => (
                  <QuestCard key={quest.id} quest={{ ...quest, status: "available" }} onStart={handleStartQuest} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
