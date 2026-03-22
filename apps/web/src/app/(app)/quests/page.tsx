"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { db, type UserProfile } from "@/lib/db";
import { calculateLifePath } from "@destination-future/core";
import { getSunSign } from "@destination-future/core";

/* ─── Step Types ─── */
interface InstructionStep {
  type: "instruction";
  label: string;
}

interface TextareaStep {
  type: "textarea";
  label: string;
  placeholder?: string;
}

interface NumberStep {
  type: "number";
  label: string;
  placeholder?: string;
}

interface MultipleChoiceStep {
  type: "multiple-choice";
  label: string;
  options: string[];
}

type QuestStep = InstructionStep | TextareaStep | NumberStep | MultipleChoiceStep;

/* ─── Quest Types ─── */
interface Quest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  status: "available" | "active" | "completed";
  questType: "daily" | "weekly" | "milestone" | "discovery";
  icon: string;
  color: string;
  steps: QuestStep[];
}

/* ─── Quest Activity Definitions ─── */
const QUEST_ACTIVITIES: Record<string, QuestStep[]> = {
  q1: [
    { type: "instruction", label: "Close your eyes and take 3 deep breaths. Breathe in for 4 counts, hold for 4, exhale for 6. Repeat three times." },
    { type: "textarea", label: "How do you feel right now? Name the emotion.", placeholder: "e.g. Calm, anxious, excited, foggy..." },
    { type: "textarea", label: "What's one thing you're grateful for today?", placeholder: "It can be something big or something tiny..." },
    { type: "textarea", label: "What's one intention for today?", placeholder: "e.g. I will stay present during conversations..." },
  ],
  q2: [
    { type: "instruction", label: "Think about a moment this week that triggered frustration, anger, or discomfort. Sit with it for a moment before continuing." },
    { type: "textarea", label: "Describe the situation briefly.", placeholder: "What happened? Who was involved? Where were you?" },
    { type: "textarea", label: "What emotion came up? Be specific.", placeholder: "Go deeper than 'angry' — was it resentment, jealousy, feeling unseen?" },
    { type: "textarea", label: "Where might this pattern come from? (childhood, past relationship, fear)", placeholder: "Explore the root. Is this a recurring pattern?" },
    { type: "textarea", label: "What would a healthier response look like next time?", placeholder: "Describe how you'd like to handle this differently..." },
  ],
  q3: [
    { type: "instruction", label: "Go to your Location Analysis page and review your city matches. Take a few minutes to explore them." },
    { type: "instruction", label: "Pick your top 3 cities from the analysis. Consider climate, cost of living, culture, and how they feel." },
    { type: "textarea", label: "City 1: Name and what attracts you", placeholder: "e.g. Lisbon — warm climate, affordable, creative energy..." },
    { type: "textarea", label: "City 2: Name and what attracts you", placeholder: "e.g. Tokyo — structure, safety, incredible food scene..." },
    { type: "textarea", label: "City 3: Name and what attracts you", placeholder: "e.g. Denver — nature access, growing tech scene..." },
    { type: "textarea", label: "Which city feels most aligned with your next chapter? Why?", placeholder: "Trust your gut here. Which one excites you most?" },
  ],
  q6: [
    { type: "instruction", label: "Day 1: Spend 5 minutes journaling first thing in the morning. Write whatever comes to mind — no editing." },
    { type: "textarea", label: "Day 1 Reflection: What came up during your morning journaling?", placeholder: "What surprised you? What themes appeared?" },
    { type: "instruction", label: "Day 2: Set one boundary today. It can be small — saying no to an invitation, limiting screen time, or protecting your lunch break." },
    { type: "textarea", label: "Day 2 Reflection: How did setting a boundary feel?", placeholder: "Was it uncomfortable? Empowering? Did anyone push back?" },
    { type: "instruction", label: "Day 3: Research one city from your location report. Look at neighborhoods, cost of living, and lifestyle." },
    { type: "textarea", label: "Day 3 Reflection: What did you discover about the city?", placeholder: "Any surprises? Does it still appeal to you?" },
    { type: "instruction", label: "Day 4: Practice saying no to one small request today. Notice how it feels in your body." },
    { type: "textarea", label: "Day 4 Reflection: What did you say no to and how did it feel?", placeholder: "Describe the situation and your internal response..." },
    { type: "instruction", label: "Day 5: Try one creative hobby for at least 20 minutes. Drawing, cooking, music, writing — anything." },
    { type: "textarea", label: "Day 5 Reflection: What creative activity did you try? How was it?", placeholder: "Did you enjoy it? Would you do it again?" },
    { type: "instruction", label: "Day 6: Listen to your Spotify Pack for 30 minutes. Pay attention to how each track makes you feel." },
    { type: "textarea", label: "Day 6 Reflection: Which tracks resonated most and why?", placeholder: "Any songs that shifted your mood?" },
    { type: "instruction", label: "Day 7: Write a full week-in-review reflection. What changed? What patterns did you notice?" },
    { type: "textarea", label: "Day 7 Reflection: Summarize your week. What's the biggest takeaway?", placeholder: "What will you carry forward from this challenge?" },
  ],
  q11: [
    { type: "instruction", label: "Open your Career & Money section in your Destination Future report. Read through it carefully before continuing." },
    { type: "number", label: "What's your current career satisfaction (1-10)?", placeholder: "Rate from 1 (miserable) to 10 (thriving)" },
    { type: "textarea", label: "What are your top 3 strengths at work?", placeholder: "Think about what people come to you for, what feels easy..." },
    { type: "textarea", label: "What drains your energy at work?", placeholder: "Meetings? Micromanagement? Lack of creativity? Be honest." },
    { type: "textarea", label: "List 3 actionable next steps for your career.", placeholder: "e.g. Update resume, reach out to a mentor, research a new field..." },
  ],
};

/* ─── Default steps for quests without specific activities ─── */
function getDefaultSteps(quest: { title: string; description: string }): QuestStep[] {
  return [
    { type: "instruction", label: `Begin your "${quest.title}" quest. ${quest.description}` },
    { type: "textarea", label: "Reflection: What did you notice or learn from this activity?", placeholder: "Write freely about your experience..." },
    { type: "textarea", label: "Key Takeaway: What's one thing you'll remember or act on?", placeholder: "Summarize your main insight..." },
  ];
}

/* ─── Initial Quest Data ─── */
function buildQuest(
  id: string, title: string, description: string, xpReward: number,
  status: Quest["status"], questType: Quest["questType"], icon: string, color: string
): Quest {
  const steps = QUEST_ACTIVITIES[id] || getDefaultSteps({ title, description });
  return { id, title, description, xpReward, status, questType, icon, color, steps };
}

const INITIAL_QUESTS: Quest[] = [
  buildQuest("q1", "Morning Reflection", "Write a 3-sentence reflection about your current emotional state and what you're grateful for.", 15, "active", "daily", "\u{1F305}", "from-amber-400 to-orange-500"),
  buildQuest("q2", "Shadow Journal", "Identify one pattern that frustrated you this week and explore where it originated.", 30, "active", "weekly", "\u{1F311}", "from-violet-500 to-purple-600"),
  buildQuest("q3", "City Explorer", "Generate a location analysis and compare your top 3 cities side by side.", 25, "available", "discovery", "\u{1F5FA}\uFE0F", "from-cyan-400 to-blue-500"),
  buildQuest("q4", "Numerology Deep Dive", "Read your full numerology section and journal about one insight that resonated.", 20, "available", "discovery", "\u{1F522}", "from-indigo-400 to-blue-600"),
  buildQuest("q5", "Evening Wind-Down", "Reflect on three things you accomplished today, no matter how small.", 15, "available", "daily", "\u{1F319}", "from-blue-400 to-indigo-500"),
  buildQuest("q6", "7-Day Champion", "Complete all 7 days of your personalized starter plan without missing a day.", 100, "active", "milestone", "\u{1F3C6}", "from-amber-400 to-yellow-500"),
  buildQuest("q7", "Love Language Explorer", "Generate and read your Love Languages section. Reflect on whether it matches.", 25, "completed", "discovery", "\u{1F49C}", "from-pink-400 to-rose-500"),
  buildQuest("q8", "First Report", "Generate your very first Destination Future report.", 50, "completed", "milestone", "\u{1F4DC}", "from-emerald-400 to-green-500"),
  buildQuest("q9", "Style Discovery", "Generate your Fashion System section and save your color palette.", 20, "completed", "discovery", "\u{1F454}", "from-fuchsia-400 to-pink-500"),
  buildQuest("q10", "Gratitude Streak", "Complete 3 consecutive daily reflections focused on gratitude.", 45, "completed", "weekly", "\u{1F64F}", "from-teal-400 to-emerald-500"),
  buildQuest("q11", "Career Clarity", "Read your Career & Money section and list 3 actionable next steps.", 30, "available", "weekly", "\u{1F4BC}", "from-blue-500 to-indigo-600"),
  buildQuest("q12", "Playlist Builder", "Listen to your entire Spotify Pack and rate each track.", 20, "available", "discovery", "\u{1F3B5}", "from-green-400 to-emerald-500"),
];

type Tab = "all" | "active" | "completed";
type QuestTypeFilter = "all" | "daily" | "weekly" | "milestone" | "discovery";

const TYPE_FILTERS: { key: QuestTypeFilter; label: string; emoji: string }[] = [
  { key: "all", label: "All", emoji: "\u2728" },
  { key: "daily", label: "Daily", emoji: "\u2600\uFE0F" },
  { key: "weekly", label: "Weekly", emoji: "\u{1F4C5}" },
  { key: "milestone", label: "Milestone", emoji: "\u{1F3C6}" },
  { key: "discovery", label: "Discovery", emoji: "\u{1F50D}" },
];

/* ─── Step Responses Storage ─── */
type StepResponses = Record<string, Record<number, string>>;
type StepSaved = Record<string, Record<number, boolean>>;

/* ─── Main Component ─── */
export default function QuestsPage() {
  const [quests, setQuests] = useState<Quest[]>(INITIAL_QUESTS);
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [typeFilter, setTypeFilter] = useState<QuestTypeFilter>("all");
  const [xpPopup, setXpPopup] = useState<{ id: string; amount: number } | null>(null);
  const [totalXpEarned, setTotalXpEarned] = useState(
    INITIAL_QUESTS.filter((q) => q.status === "completed").reduce((s, q) => s + q.xpReward, 0)
  );

  // Profile-based personalization
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    db.getProfile().then(setProfile).catch(() => {});
  }, []);

  const sunSign = useMemo(() => {
    if (!profile?.birthday) return null;
    try {
      return getSunSign(new Date(profile.birthday));
    } catch {
      return null;
    }
  }, [profile?.birthday]);

  const lifePath = useMemo(() => {
    if (!profile?.birthday) return null;
    try {
      return calculateLifePath(new Date(profile.birthday));
    } catch {
      return null;
    }
  }, [profile?.birthday]);

  // Which quest is currently expanded
  const [expandedQuestId, setExpandedQuestId] = useState<string | null>(null);

  // Step responses: { questId: { stepIndex: "user input" } }
  const [responses, setResponses] = useState<StepResponses>({});

  // Track which steps have been "saved"
  const [savedSteps, setSavedSteps] = useState<StepSaved>({});

  // Track which instruction steps have been marked done
  const [instructionsDone, setInstructionsDone] = useState<Record<string, Record<number, boolean>>>({});

  // For completed quests, show summary view
  const [showSummary, setShowSummary] = useState<string | null>(null);

  const handleStart = useCallback((questId: string) => {
    setQuests((prev) =>
      prev.map((q) => (q.id === questId ? { ...q, status: "active" as const } : q))
    );
    setExpandedQuestId(questId);

    // Save quest start to Supabase
    if (profile?.userId) {
      db.startQuest(profile.userId, questId).catch(() => {});
    }
  }, [profile?.userId]);

  const isStepComplete = useCallback((quest: Quest, stepIndex: number): boolean => {
    const step = quest.steps[stepIndex];
    if (step.type === "instruction") {
      return !!instructionsDone[quest.id]?.[stepIndex];
    }
    // For textarea, number, multiple-choice: need a saved response
    return !!savedSteps[quest.id]?.[stepIndex] && !!(responses[quest.id]?.[stepIndex]?.trim());
  }, [instructionsDone, savedSteps, responses]);

  const allStepsComplete = useCallback((quest: Quest): boolean => {
    return quest.steps.every((_, i) => isStepComplete(quest, i));
  }, [isStepComplete]);

  const completedStepCount = useCallback((quest: Quest): number => {
    return quest.steps.filter((_, i) => isStepComplete(quest, i)).length;
  }, [isStepComplete]);

  // Load saved quest responses from Supabase on mount
  useEffect(() => {
    if (!profile?.userId) return;
    db.getQuestResponses(profile.userId).then((saved) => {
      if (!saved || Object.keys(saved).length === 0) return;
      const loadedResponses: StepResponses = {};
      const loadedSaved: StepSaved = {};
      for (const [questId, steps] of Object.entries(saved)) {
        loadedResponses[questId] = {};
        loadedSaved[questId] = {};
        for (const [stepIdx, text] of Object.entries(steps)) {
          const idx = Number(stepIdx);
          loadedResponses[questId][idx] = text;
          loadedSaved[questId][idx] = true;
        }
      }
      setResponses((prev) => ({ ...prev, ...loadedResponses }));
      setSavedSteps((prev) => ({ ...prev, ...loadedSaved }));
    }).catch(() => {});
  }, [profile?.userId]);

  const handleComplete = useCallback((questId: string) => {
    const quest = quests.find((q) => q.id === questId);
    if (!quest) return;

    setQuests((prev) =>
      prev.map((q) => (q.id === questId ? { ...q, status: "completed" as const } : q))
    );
    setTotalXpEarned((prev) => prev + quest.xpReward);
    setXpPopup({ id: questId, amount: quest.xpReward });
    setExpandedQuestId(null);
    setTimeout(() => setXpPopup(null), 2500);

    // Save quest completion to Supabase
    if (profile?.userId) {
      db.completeQuest(profile.userId, questId, quest.xpReward).catch(() => {});
    }
  }, [quests, profile?.userId]);

  const updateResponse = useCallback((questId: string, stepIndex: number, value: string) => {
    setResponses((prev) => ({
      ...prev,
      [questId]: { ...prev[questId], [stepIndex]: value },
    }));
  }, []);

  const saveStep = useCallback((questId: string, stepIndex: number) => {
    setSavedSteps((prev) => ({
      ...prev,
      [questId]: { ...prev[questId], [stepIndex]: true },
    }));

    // Save quest step response to Supabase
    const responseText = responses[questId]?.[stepIndex] || "";
    if (profile?.userId && responseText.trim()) {
      db.saveQuestResponse(profile.userId, questId, stepIndex, responseText).catch(() => {});
    }
  }, [profile?.userId, responses]);

  const markInstructionDone = useCallback((questId: string, stepIndex: number) => {
    setInstructionsDone((prev) => ({
      ...prev,
      [questId]: { ...prev[questId], [stepIndex]: true },
    }));
  }, []);

  const toggleExpand = useCallback((questId: string) => {
    setExpandedQuestId((prev) => (prev === questId ? null : questId));
    setShowSummary(null);
  }, []);

  const toggleSummary = useCallback((questId: string) => {
    setShowSummary((prev) => (prev === questId ? null : questId));
    setExpandedQuestId(null);
  }, []);

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

  /* ─── Render a single step ─── */
  const renderStep = (quest: Quest, step: QuestStep, index: number) => {
    const done = isStepComplete(quest, index);
    const response = responses[quest.id]?.[index] || "";
    const isSaved = savedSteps[quest.id]?.[index];

    return (
      <div
        key={index}
        className={`relative rounded-xl border p-4 transition-all ${
          done
            ? "border-emerald-200 bg-emerald-50/50"
            : "border-surface-200 bg-white"
        }`}
      >
        {/* Step header */}
        <div className="flex items-start gap-3 mb-2">
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors ${
              done
                ? "bg-emerald-500 text-white"
                : "bg-surface-100 text-surface-500 border border-surface-200"
            }`}
          >
            {done ? (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            ) : (
              index + 1
            )}
          </div>
          <p className={`text-sm font-medium leading-relaxed pt-1 ${done ? "text-emerald-800" : "text-surface-800"}`}>
            {step.label}
          </p>
        </div>

        {/* Step input area */}
        {step.type === "instruction" && !done && (
          <div className="ml-11 mt-2">
            <button
              type="button"
              onClick={() => markInstructionDone(quest.id, index)}
              className="rounded-lg border border-brand-200 bg-brand-50 px-4 py-2 text-xs font-semibold text-brand-700 transition-all hover:bg-brand-100 hover:border-brand-300 active:scale-95"
            >
              Mark as Done
            </button>
          </div>
        )}

        {step.type === "textarea" && (
          <div className="ml-11 mt-2 space-y-2">
            <textarea
              value={response}
              onChange={(e) => updateResponse(quest.id, index, e.target.value)}
              placeholder={(step as TextareaStep).placeholder || "Write your response..."}
              rows={3}
              disabled={done && isSaved}
              className={`w-full resize-none rounded-xl border px-4 py-3 text-sm leading-relaxed transition-all placeholder:text-surface-300 focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-400 ${
                done
                  ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                  : "border-surface-200 bg-surface-50 text-surface-800"
              }`}
            />
            {!done && (
              <button
                type="button"
                onClick={() => {
                  if (response.trim()) saveStep(quest.id, index);
                }}
                disabled={!response.trim()}
                className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all active:scale-95 ${
                  response.trim()
                    ? "bg-brand-600 text-white hover:bg-brand-700 shadow-sm"
                    : "bg-surface-100 text-surface-300 cursor-not-allowed"
                }`}
              >
                Save
              </button>
            )}
          </div>
        )}

        {step.type === "number" && (
          <div className="ml-11 mt-2 space-y-2">
            <input
              type="number"
              min={1}
              max={10}
              value={response}
              onChange={(e) => updateResponse(quest.id, index, e.target.value)}
              placeholder={(step as NumberStep).placeholder || "Enter a number..."}
              disabled={done && isSaved}
              className={`w-full rounded-xl border px-4 py-3 text-sm transition-all placeholder:text-surface-300 focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-400 ${
                done
                  ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                  : "border-surface-200 bg-surface-50 text-surface-800"
              }`}
            />
            {!done && (
              <button
                type="button"
                onClick={() => {
                  if (response.trim()) saveStep(quest.id, index);
                }}
                disabled={!response.trim()}
                className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all active:scale-95 ${
                  response.trim()
                    ? "bg-brand-600 text-white hover:bg-brand-700 shadow-sm"
                    : "bg-surface-100 text-surface-300 cursor-not-allowed"
                }`}
              >
                Save
              </button>
            )}
          </div>
        )}

        {step.type === "multiple-choice" && (
          <div className="ml-11 mt-2 space-y-2">
            {(step as MultipleChoiceStep).options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  updateResponse(quest.id, index, option);
                  saveStep(quest.id, index);
                }}
                disabled={done}
                className={`block w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all ${
                  response === option
                    ? "border-brand-400 bg-brand-50 text-brand-800 ring-2 ring-brand-200"
                    : "border-surface-200 bg-white text-surface-700 hover:border-brand-200 hover:bg-brand-50/50"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  /* ─── Render the expanded activity panel ─── */
  const renderActivityPanel = (quest: Quest) => {
    const done = completedStepCount(quest);
    const total = quest.steps.length;
    const allDone = allStepsComplete(quest);
    const progressPercent = total > 0 ? Math.round((done / total) * 100) : 0;

    return (
      <div className="border-t border-surface-200 bg-surface-50/80 px-5 pb-5 pt-4">
        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-surface-600">
              Step {Math.min(done + 1, total)} of {total}
            </span>
            <span className="text-xs font-bold text-brand-600">{progressPercent}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-surface-200">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${quest.color} transition-all duration-500`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {quest.steps.map((step, i) => renderStep(quest, step, i))}
        </div>

        {/* Complete Quest Button */}
        {allDone && (
          <div className="mt-5">
            <button
              type="button"
              onClick={() => handleComplete(quest.id)}
              className={`w-full rounded-xl bg-gradient-to-r ${quest.color} px-6 py-4 text-base font-bold text-white shadow-lg transition-all hover:shadow-xl hover:scale-[1.01] active:scale-[0.98]`}
            >
              Complete Quest (+{quest.xpReward} XP)
            </button>
          </div>
        )}
      </div>
    );
  };

  /* ─── Render completed quest summary ─── */
  const renderSummary = (quest: Quest) => {
    const questResponses = responses[quest.id];
    if (!questResponses || Object.keys(questResponses).length === 0) {
      return (
        <div className="border-t border-surface-200 bg-surface-50/80 px-5 pb-5 pt-4">
          <p className="text-sm text-surface-400 italic">No saved responses for this quest.</p>
        </div>
      );
    }

    return (
      <div className="border-t border-surface-200 bg-surface-50/80 px-5 pb-5 pt-4">
        <h4 className="mb-3 text-sm font-bold text-surface-700">Your Responses</h4>
        <div className="space-y-3">
          {quest.steps.map((step, i) => {
            const resp = questResponses[i];
            if (!resp || step.type === "instruction") return null;
            return (
              <div key={i} className="rounded-xl border border-surface-200 bg-white p-3">
                <p className="text-xs font-semibold text-surface-500 mb-1">{step.label}</p>
                <p className="text-sm text-surface-800 whitespace-pre-wrap">{resp}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-5xl">
      {/* XP Popup Toast */}
      {xpPopup && (
        <div className="fixed top-6 right-6 z-50 animate-slide-up">
          <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-brand-600 to-cosmic-600 px-6 py-4 text-white shadow-2xl">
            <span className="text-2xl">{"\u26A1"}</span>
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
            <h1 className="text-3xl font-bold">
              {profile?.firstName ? `${profile.firstName}'s Quests` : "Quests"}
            </h1>
            <p className="mt-1 opacity-90">Complete quests to earn XP, level up, and unlock new features.</p>
            {(sunSign || lifePath) && (
              <div className="mt-3 flex flex-wrap gap-2">
                {sunSign && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-xs font-medium">
                    {sunSign.symbol} {sunSign.name}
                  </span>
                )}
                {lifePath && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-xs font-medium">
                    Life Path {lifePath.value}{lifePath.isMaster ? " (Master)" : ""}
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="hidden sm:block text-6xl">{"\u2694\uFE0F"}</div>
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
              <span className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-100 text-[10px] font-bold text-brand-700">
                {activeCount}
              </span>
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
          {filtered.map((quest) => {
            const isExpanded = expandedQuestId === quest.id && quest.status === "active";
            const isSummaryOpen = showSummary === quest.id && quest.status === "completed";

            return (
              <div
                key={quest.id}
                className={`group relative overflow-hidden rounded-2xl border bg-white transition-all duration-300 ${
                  isExpanded || isSummaryOpen
                    ? "sm:col-span-2 lg:col-span-3 border-brand-200 shadow-xl"
                    : quest.status === "completed"
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
                    <div className="flex items-center gap-2">
                      {quest.status === "active" && (
                        <div className="flex items-center gap-1 text-xs text-surface-400">
                          <span className="font-medium">
                            {completedStepCount(quest)}/{quest.steps.length}
                          </span>
                          steps
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-brand-50 to-cosmic-50 px-3 py-1">
                        <span className="text-xs">{"\u26A1"}</span>
                        <span className="text-xs font-bold text-brand-700">+{quest.xpReward} XP</span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <h3
                    className={`text-lg font-bold mb-1 ${
                      quest.status === "completed" ? "text-surface-300 line-through" : "text-surface-900"
                    }`}
                  >
                    {quest.title}
                  </h3>
                  <p className="text-sm text-surface-700 leading-relaxed mb-4">
                    {quest.description}
                    {profile?.birthday && quest.id === "q1" && sunSign && (
                      <span className="block mt-1 text-xs text-surface-400 italic">
                        Your {sunSign.element} energy thrives with morning intention-setting.
                      </span>
                    )}
                    {profile?.birthday && quest.id === "q2" && lifePath && (
                      <span className="block mt-1 text-xs text-surface-400 italic">
                        As a Life Path {lifePath.value}, shadow work can unlock deep self-awareness.
                      </span>
                    )}
                    {profile?.birthday && quest.id === "q4" && lifePath && (
                      <span className="block mt-1 text-xs text-surface-400 italic">
                        Your Life Path {lifePath.value} holds unique gifts — explore what they mean.
                      </span>
                    )}
                    {profile?.birthday && quest.id === "q6" && sunSign && (
                      <span className="block mt-1 text-xs text-surface-400 italic">
                        Channel your {sunSign.name} determination to conquer all 7 days.
                      </span>
                    )}
                    {profile?.birthday && quest.id === "q11" && lifePath && (
                      <span className="block mt-1 text-xs text-surface-400 italic">
                        Life Path {lifePath.value}s often excel when they align career with purpose.
                      </span>
                    )}
                  </p>

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
                        {"\u2713"} Done
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {quest.status === "available" && (
                    <button
                      type="button"
                      onClick={() => handleStart(quest.id)}
                      className="w-full rounded-xl border-2 border-brand-200 bg-brand-50 px-4 py-3 text-sm font-bold text-brand-700 transition-all hover:bg-brand-100 hover:border-brand-300 hover:shadow-sm active:scale-[0.98]"
                    >
                      {"\u{1F680}"} Start Quest
                    </button>
                  )}

                  {quest.status === "active" && (
                    <button
                      type="button"
                      onClick={() => toggleExpand(quest.id)}
                      className={`w-full rounded-xl px-4 py-3 text-sm font-bold transition-all active:scale-[0.98] ${
                        isExpanded
                          ? "bg-surface-100 text-surface-600 border border-surface-200"
                          : `bg-gradient-to-r ${quest.color} text-white shadow-md hover:shadow-lg hover:scale-[1.02]`
                      }`}
                    >
                      {isExpanded ? "Collapse" : "Continue Quest"}
                    </button>
                  )}

                  {quest.status === "completed" && (
                    <button
                      type="button"
                      onClick={() => toggleSummary(quest.id)}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-surface-50 px-4 py-3 text-sm font-medium text-surface-500 transition-all hover:bg-surface-100 hover:text-surface-700"
                    >
                      <svg
                        className="h-5 w-5 text-emerald-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                      {isSummaryOpen ? "Hide Summary" : "View Summary"}
                    </button>
                  )}
                </div>

                {/* Expanded Activity Panel */}
                {isExpanded && renderActivityPanel(quest)}

                {/* Completed Summary Panel */}
                {isSummaryOpen && renderSummary(quest)}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-surface-200 py-20">
          <span className="text-5xl mb-4">{"\u{1F50D}"}</span>
          <p className="text-xl font-bold text-surface-700">No quests found</p>
          <p className="mt-1 text-sm text-surface-300">Try changing your filters.</p>
        </div>
      )}
    </div>
  );
}
