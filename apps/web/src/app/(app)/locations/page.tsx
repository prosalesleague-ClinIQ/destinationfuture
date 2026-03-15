"use client";

import { useState } from "react";

type RegionScope = "california" | "usa" | "world";
type Category = "love" | "money" | "creativity" | "spirituality" | "community" | "reinvention" | "family" | "short_trips";

const SAMPLE_CITIES = [
  { name: "San Diego, CA", score: 92, reason: "Coastal calm meets creative energy — ideal for your emotional recharge needs", risk: "High cost of living may pressure finances initially", neighborhood: "North Park or Hillcrest", useCase: "reinvention", vibe: "from-sky-400 via-cyan-400 to-teal-500", emoji: "🏖️" },
  { name: "Austin, TX", score: 88, reason: "Tech + creativity fusion with strong community energy", risk: "Rapid growth changing the culture you'd move for", neighborhood: "East Austin or South Congress", useCase: "career", vibe: "from-orange-400 via-amber-400 to-yellow-500", emoji: "🎸" },
  { name: "Denver, CO", score: 85, reason: "Outdoor lifestyle and altitude shift for fresh perspective", risk: "Winter isolation if you're not prepared", neighborhood: "RiNo or Capitol Hill", useCase: "reinvention", vibe: "from-emerald-400 via-teal-400 to-cyan-500", emoji: "🏔️" },
  { name: "Portland, OR", score: 82, reason: "Creative scene with strong community and indie culture", risk: "Gray winters may affect mood patterns", neighborhood: "Alberta Arts District", useCase: "creativity", vibe: "from-green-500 via-emerald-400 to-lime-400", emoji: "🌲" },
  { name: "Lisbon, Portugal", score: 90, reason: "Affordable European life with deep creative and spiritual community", risk: "Language barrier and bureaucratic adjustment period", neighborhood: "Alfama or Principe Real", useCase: "transformation", vibe: "from-rose-400 via-pink-400 to-fuchsia-500", emoji: "🇵🇹" },
];

const REGION_CONFIG: { key: RegionScope; label: string; emoji: string }[] = [
  { key: "california", label: "California", emoji: "🌴" },
  { key: "usa", label: "United States", emoji: "🇺🇸" },
  { key: "world", label: "Worldwide", emoji: "🌍" },
];

const CATEGORY_CONFIG: { key: Category; label: string; emoji: string; color: string }[] = [
  { key: "reinvention", label: "Reinvention", emoji: "🦋", color: "from-purple-500 to-violet-500" },
  { key: "love", label: "Love", emoji: "💕", color: "from-rose-400 to-pink-500" },
  { key: "money", label: "Money", emoji: "💰", color: "from-emerald-400 to-green-500" },
  { key: "creativity", label: "Creativity", emoji: "🎨", color: "from-orange-400 to-amber-500" },
  { key: "spirituality", label: "Spirituality", emoji: "🔮", color: "from-indigo-400 to-purple-500" },
  { key: "community", label: "Community", emoji: "🤝", color: "from-sky-400 to-blue-500" },
  { key: "family", label: "Family", emoji: "👨‍👩‍👧‍👦", color: "from-teal-400 to-cyan-500" },
  { key: "short_trips", label: "Short Trips", emoji: "✈️", color: "from-fuchsia-400 to-pink-500" },
];

function ScoreRing({ score, size = 80 }: { score: number; size?: number }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 90 ? "stroke-emerald-400" : score >= 85 ? "stroke-cyan-400" : score >= 80 ? "stroke-amber-400" : "stroke-gray-400";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth="5" className="text-gray-100" />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          strokeWidth="5" strokeLinecap="round"
          className={color}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-extrabold text-gray-900">{score}</span>
        <span className="text-[10px] text-gray-400 font-medium">/ 100</span>
      </div>
    </div>
  );
}

function RiskPill({ risk }: { risk: string }) {
  const isHigh = risk.toLowerCase().includes("high") || risk.toLowerCase().includes("pressure");
  const isMedium = risk.toLowerCase().includes("rapid") || risk.toLowerCase().includes("winter") || risk.toLowerCase().includes("gray");
  const color = isHigh ? "bg-red-50 text-red-700 border-red-200" : isMedium ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-blue-50 text-blue-700 border-blue-200";

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${color}`}>
      {isHigh ? "⚠️" : isMedium ? "⚡" : "ℹ️"} {risk}
    </span>
  );
}

export default function LocationsPage() {
  const [region, setRegion] = useState<RegionScope>("usa");
  const [category, setCategory] = useState<Category>("reinvention");

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 p-8 md:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(6,182,212,0.3),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(16,185,129,0.15),transparent_60%)]" />
        <div className="relative z-10">
          <p className="text-sm font-medium uppercase tracking-widest text-cyan-400 mb-2">📍 GPS for Your Soul</p>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3">Location Analysis</h1>
          <p className="text-lg text-white/60 max-w-xl">
            Discover cities that align with your energy, goals, and growth trajectory.
          </p>
        </div>
      </div>

      {/* Region Selector */}
      <div className="flex gap-3">
        {REGION_CONFIG.map((r) => (
          <button
            key={r.key}
            onClick={() => setRegion(r.key)}
            className={`flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold transition-all duration-300 ${
              region === r.key
                ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 scale-105"
                : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:shadow-md"
            }`}
          >
            <span className="text-lg">{r.emoji}</span>
            {r.label}
          </button>
        ))}
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {CATEGORY_CONFIG.map((c) => (
          <button
            key={c.key}
            onClick={() => setCategory(c.key)}
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
              category === c.key
                ? `bg-gradient-to-r ${c.color} text-white shadow-lg scale-105`
                : "bg-white border border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700"
            }`}
          >
            <span>{c.emoji}</span>
            {c.label}
          </button>
        ))}
      </div>

      {/* Map Placeholder */}
      <div className="relative overflow-hidden rounded-3xl h-72 bg-gradient-to-br from-teal-100 via-cyan-50 to-sky-100 border border-teal-200/50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,_rgba(6,182,212,0.15),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,_rgba(16,185,129,0.1),transparent_40%)]" />
        {/* Pin markers */}
        <div className="absolute top-[20%] left-[25%] flex flex-col items-center animate-bounce" style={{ animationDelay: "0s", animationDuration: "2s" }}>
          <span className="text-3xl drop-shadow-lg">📍</span>
          <span className="mt-1 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-gray-700 shadow-sm">San Diego</span>
        </div>
        <div className="absolute top-[35%] left-[45%] flex flex-col items-center animate-bounce" style={{ animationDelay: "0.3s", animationDuration: "2.5s" }}>
          <span className="text-3xl drop-shadow-lg">📍</span>
          <span className="mt-1 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-gray-700 shadow-sm">Austin</span>
        </div>
        <div className="absolute top-[15%] left-[40%] flex flex-col items-center animate-bounce" style={{ animationDelay: "0.6s", animationDuration: "2.2s" }}>
          <span className="text-3xl drop-shadow-lg">📍</span>
          <span className="mt-1 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-gray-700 shadow-sm">Denver</span>
        </div>
        <div className="absolute top-[10%] left-[20%] flex flex-col items-center animate-bounce" style={{ animationDelay: "0.9s", animationDuration: "2.8s" }}>
          <span className="text-3xl drop-shadow-lg">📍</span>
          <span className="mt-1 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-gray-700 shadow-sm">Portland</span>
        </div>
        <div className="absolute top-[25%] left-[75%] flex flex-col items-center animate-bounce" style={{ animationDelay: "1.2s", animationDuration: "2.3s" }}>
          <span className="text-3xl drop-shadow-lg">📍</span>
          <span className="mt-1 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-gray-700 shadow-sm">Lisbon</span>
        </div>
        <div className="absolute inset-0 flex items-end justify-center pb-4">
          <span className="rounded-full bg-white/80 backdrop-blur-sm px-4 py-2 text-xs font-medium text-gray-500 shadow-sm">
            🗺️ Interactive map coming soon
          </span>
        </div>
      </div>

      {/* City Cards */}
      <div className="space-y-6">
        {SAMPLE_CITIES.map((city, i) => (
          <div
            key={city.name}
            className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
          >
            {/* Gradient accent */}
            <div className={`absolute top-0 left-0 right-0 h-40 bg-gradient-to-br ${city.vibe} opacity-[0.07] group-hover:opacity-[0.12] transition-opacity`} />

            <div className="relative p-6 md:p-8">
              <div className="flex items-start gap-6">
                {/* Rank + Score */}
                <div className="flex flex-col items-center gap-3 flex-shrink-0">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${city.vibe} text-white text-sm font-extrabold shadow-lg`}>
                    #{i + 1}
                  </div>
                  <ScoreRing score={city.score} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{city.emoji}</span>
                    <h3 className="text-2xl font-extrabold text-gray-900">{city.name}</h3>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">{city.reason}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 border border-indigo-200 px-3 py-1 text-xs font-semibold text-indigo-700">
                      📍 {city.neighborhood}
                    </span>
                    <span className={`inline-flex items-center gap-1 rounded-full bg-gradient-to-r ${city.vibe} px-3 py-1 text-xs font-semibold text-white shadow-sm`}>
                      {city.useCase.charAt(0).toUpperCase() + city.useCase.slice(1)}
                    </span>
                  </div>

                  <RiskPill risk={city.risk} />
                </div>
              </div>
            </div>

            {/* Bottom gradient line */}
            <div className={`h-1 bg-gradient-to-r ${city.vibe} opacity-0 group-hover:opacity-100 transition-opacity`} />
          </div>
        ))}
      </div>
    </div>
  );
}
