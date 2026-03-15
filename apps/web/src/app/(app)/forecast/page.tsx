"use client";

import { useState } from "react";

type ForecastYear = 2026 | 2027 | 2028;

const FORECAST_DATA: Record<ForecastYear, { theme: string; months: { month: string; focus: string; love: string; career: string; }[] }> = {
  2026: {
    theme: "Foundation & Clarity \u2014 Personal Year 7 brings introspection, research, and inner alignment",
    months: [
      { month: "January", focus: "Set intentions quietly", love: "Reflect on patterns", career: "Research new directions" },
      { month: "February", focus: "Deepen self-awareness", love: "Quality over quantity", career: "Skill building" },
      { month: "March", focus: "Release old patterns", love: "Heal attachment wounds", career: "Strategic planning" },
      { month: "April", focus: "Inner work peak", love: "Attract through authenticity", career: "Build in private" },
      { month: "May", focus: "Integrate insights", love: "Open to new connections", career: "Test ideas" },
      { month: "June", focus: "Balance solitude and connection", love: "Communication clarity", career: "Expand network" },
      { month: "July", focus: "Birthday reset energy", love: "Emotional honesty", career: "Mid-year review" },
      { month: "August", focus: "Creative expression", love: "Express needs directly", career: "Visibility moment" },
      { month: "September", focus: "Organization phase", love: "Practical relationship steps", career: "Optimize systems" },
      { month: "October", focus: "Partnership focus", love: "Deepen commitment or release", career: "Collaboration opportunity" },
      { month: "November", focus: "Transformation energy", love: "Vulnerability as strength", career: "Power moves" },
      { month: "December", focus: "Consolidation and rest", love: "Gratitude practice", career: "Set up 2027" },
    ],
  },
  2027: {
    theme: "Power & Manifestation \u2014 Personal Year 8 brings career acceleration, financial growth, and authority",
    months: [
      { month: "January", focus: "Launch with authority", love: "Attract from confidence", career: "Major career move" },
      { month: "February", focus: "Financial strategy", love: "Invest in relationship", career: "Negotiate hard" },
      { month: "March", focus: "Build momentum", love: "Deepening bond", career: "Expansion phase" },
      { month: "April", focus: "Leadership energy", love: "Balance power in relationship", career: "Step into authority" },
      { month: "May", focus: "Material gains", love: "Shared goals", career: "Revenue growth" },
      { month: "June", focus: "Delegate and scale", love: "Support partner's growth", career: "Team building" },
      { month: "July", focus: "Reassess priorities", love: "Emotional check-in", career: "Course correct if needed" },
      { month: "August", focus: "Harvest results", love: "Celebrate together", career: "Recognition peak" },
      { month: "September", focus: "Systematize wins", love: "Routine and stability", career: "Automate and optimize" },
      { month: "October", focus: "Invest wisely", love: "Long-term planning", career: "Financial decisions" },
      { month: "November", focus: "Power consolidation", love: "Gratitude and depth", career: "Close deals" },
      { month: "December", focus: "Prepare for transition", love: "Reflect on growth", career: "Strategic rest" },
    ],
  },
  2028: {
    theme: "Completion & Release \u2014 Personal Year 9 brings endings, humanitarian focus, and transformation",
    months: [
      { month: "January", focus: "Release what's complete", love: "Let go or commit fully", career: "Wrap up old projects" },
      { month: "February", focus: "Forgiveness work", love: "Heal old wounds", career: "Transition planning" },
      { month: "March", focus: "Spiritual deepening", love: "Compassion practice", career: "Mentor others" },
      { month: "April", focus: "Generosity phase", love: "Give without agenda", career: "Share knowledge" },
      { month: "May", focus: "Creative culmination", love: "Express love freely", career: "Complete creative projects" },
      { month: "June", focus: "Service focus", love: "Community involvement together", career: "Humanitarian angle" },
      { month: "July", focus: "Identity evolution", love: "Who are you now?", career: "Rebrand or reposition" },
      { month: "August", focus: "Clear the path", love: "Honest assessment", career: "Declutter commitments" },
      { month: "September", focus: "Emotional cleansing", love: "Deep conversations", career: "Final pushes" },
      { month: "October", focus: "Gratitude harvest", love: "Appreciation ritual", career: "Legacy thinking" },
      { month: "November", focus: "Preparation for new", love: "Dream together about future", career: "Set vision for Year 1" },
      { month: "December", focus: "Rest and rebirth", love: "Celebrate the journey", career: "Strategic pause" },
    ],
  },
};

export default function ForecastPage() {
  const [year, setYear] = useState<ForecastYear>(2026);
  const data = FORECAST_DATA[year];

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold text-surface-900 mb-2">Forecast</h1>
      <p className="text-surface-300 mb-8">Your personalized multi-year forecast based on numerology cycles and astrological patterns.</p>

      <div className="flex gap-2 mb-6">
        {([2026, 2027, 2028] as ForecastYear[]).map((y) => (
          <button
            key={y}
            onClick={() => setYear(y)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
              year === y
                ? "bg-brand-600 text-white"
                : "bg-surface-100 text-surface-700 hover:bg-surface-200"
            }`}
          >
            {y}
          </button>
        ))}
      </div>

      <div className="rounded-xl bg-gradient-to-r from-brand-600 to-cosmic-600 p-6 text-white mb-8">
        <div className="text-sm font-medium opacity-80 mb-1">Year Theme</div>
        <p className="text-lg font-semibold">{data.theme}</p>
      </div>

      <div className="space-y-3">
        {data.months.map((month) => (
          <div key={month.month} className="rounded-xl bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="font-semibold text-surface-900 mb-2">{month.month}</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <div className="text-xs font-medium text-brand-600 mb-1">Focus</div>
                <p className="text-sm text-surface-700">{month.focus}</p>
              </div>
              <div>
                <div className="text-xs font-medium text-pink-600 mb-1">Love</div>
                <p className="text-sm text-surface-700">{month.love}</p>
              </div>
              <div>
                <div className="text-xs font-medium text-emerald-600 mb-1">Career</div>
                <p className="text-sm text-surface-700">{month.career}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
