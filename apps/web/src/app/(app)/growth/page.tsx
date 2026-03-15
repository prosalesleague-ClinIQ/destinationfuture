"use client";

import { useState } from "react";

type GrowthTab = "overview" | "shadow" | "reflection" | "plans";

export default function GrowthPage() {
  const [activeTab, setActiveTab] = useState<GrowthTab>("overview");

  const tabs: { key: GrowthTab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "shadow", label: "Shadow Work" },
    { key: "reflection", label: "Reflections" },
    { key: "plans", label: "My Plans" },
  ];

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold text-surface-900 mb-2">Growth Center</h1>
      <p className="text-surface-300 mb-6">Track your personal development journey across all dimensions.</p>

      <div className="flex gap-1 rounded-lg bg-surface-100 p-1 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-white text-surface-900 shadow-sm"
                : "text-surface-300 hover:text-surface-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h3 className="text-sm font-medium text-surface-300 mb-3">Growth Score</h3>
            <div className="text-4xl font-bold text-gradient mb-2">72</div>
            <p className="text-xs text-surface-300">Based on completed actions and reflections</p>
            <div className="mt-4 h-2 rounded-full bg-surface-100">
              <div className="h-2 rounded-full bg-gradient-to-r from-brand-500 to-cosmic-500" style={{ width: "72%" }} />
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h3 className="text-sm font-medium text-surface-300 mb-3">Active Focus Areas</h3>
            <div className="space-y-3">
              {["Emotional Intelligence", "Career Positioning", "Shadow Integration"].map((area) => (
                <div key={area} className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-brand-500" />
                  <span className="text-sm text-surface-700">{area}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h3 className="text-sm font-medium text-surface-300 mb-3">Weekly Habits</h3>
            <div className="grid grid-cols-7 gap-1">
              {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                <div key={`${day}-${i}`} className="flex flex-col items-center gap-1">
                  <span className="text-xs text-surface-300">{day}</span>
                  <div className={`h-6 w-6 rounded-full ${i < 5 ? "bg-brand-500" : i === 5 ? "bg-brand-200" : "bg-surface-100"}`} />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h3 className="text-sm font-medium text-surface-300 mb-3">Streak</h3>
            <div className="text-4xl font-bold text-surface-900 mb-1">5 days</div>
            <p className="text-xs text-surface-300">Keep going! Your longest streak is 12 days.</p>
          </div>
        </div>
      )}

      {activeTab === "shadow" && (
        <div className="space-y-6">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Today's Shadow Work Prompt</h3>
            <div className="rounded-lg bg-surface-50 p-4 mb-4">
              <p className="text-sm text-surface-700 italic">
                "When I feel the urge to over-give, what am I really trying to control or prevent?"
              </p>
            </div>
            <textarea
              className="w-full rounded-lg border border-surface-200 px-4 py-3 text-sm min-h-[120px] focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
              placeholder="Write your reflection here..."
            />
            <button className="mt-3 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors">
              Save Reflection (+15 XP)
            </button>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Cognitive Distortion Check</h3>
            <p className="text-sm text-surface-300 mb-4">Identify the thinking pattern and reframe it.</p>
            <div className="space-y-3">
              {[
                { distortion: "All-or-Nothing Thinking", example: "If I can't do it perfectly, there's no point trying", reframe: "Imperfect action is still valuable action" },
                { distortion: "Mind Reading", example: "They didn't text back, so they must be upset with me", reframe: "I can't know what others think without asking" },
                { distortion: "Catastrophizing", example: "If I make this change, everything will fall apart", reframe: "Change is uncomfortable but rarely catastrophic" },
              ].map((item) => (
                <div key={item.distortion} className="rounded-lg border border-surface-200 p-4">
                  <div className="font-medium text-sm text-surface-900 mb-1">{item.distortion}</div>
                  <div className="text-xs text-red-500 mb-1">"{item.example}"</div>
                  <div className="text-xs text-emerald-600">Reframe: "{item.reframe}"</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "reflection" && (
        <div className="space-y-4">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">New Reflection</h3>
            <textarea
              className="w-full rounded-lg border border-surface-200 px-4 py-3 text-sm min-h-[100px] focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
              placeholder="What's on your mind today?"
            />
            <div className="flex items-center justify-between mt-3">
              <select className="rounded-lg border border-surface-200 px-3 py-2 text-sm">
                <option>Daily Reflection</option>
                <option>Shadow Work</option>
                <option>Quest Reflection</option>
                <option>Growth Note</option>
              </select>
              <button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors">
                Save (+15 XP)
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { date: "Mar 14, 2026", type: "Daily", content: "Noticed my pattern of checking my phone when I feel anxious. Tried sitting with the feeling instead." },
              { date: "Mar 13, 2026", type: "Shadow Work", content: "Realized my need to be 'helpful' sometimes comes from wanting to feel needed, not genuine generosity." },
              { date: "Mar 12, 2026", type: "Daily", content: "Good day. Set a boundary at work by saying no to an extra project. Felt uncomfortable but right." },
            ].map((entry, i) => (
              <div key={i} className="rounded-xl bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-surface-300">{entry.date}</span>
                  <span className="rounded-full bg-surface-100 px-2 py-0.5 text-xs text-surface-700">{entry.type}</span>
                </div>
                <p className="text-sm text-surface-700">{entry.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "plans" && (
        <div className="space-y-6">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">7-Day Starter Plan</h3>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">3/7 Complete</span>
            </div>
            <div className="space-y-2">
              {[
                { day: 1, task: "5-min morning journaling", done: true },
                { day: 2, task: "Identify one boundary to set this week", done: true },
                { day: 3, task: "Research one city from your location report", done: true },
                { day: 4, task: "Practice saying no to one small request", done: false },
                { day: 5, task: "Try one creative hobby from your list", done: false },
                { day: 6, task: "Listen to your Spotify Pack for 30 minutes", done: false },
                { day: 7, task: "Write a reflection on the week's experience", done: false },
              ].map((item) => (
                <div key={item.day} className="flex items-center gap-3 rounded-lg p-2 hover:bg-surface-50">
                  <div className={`flex h-6 w-6 items-center justify-center rounded-md text-xs ${
                    item.done ? "bg-emerald-500 text-white" : "border border-surface-200 text-surface-300"
                  }`}>
                    {item.done ? "\u2713" : item.day}
                  </div>
                  <span className={`text-sm ${item.done ? "text-surface-300 line-through" : "text-surface-700"}`}>
                    Day {item.day}: {item.task}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
