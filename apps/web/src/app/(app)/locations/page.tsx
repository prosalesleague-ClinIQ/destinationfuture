"use client";

import { useState } from "react";

type RegionScope = "california" | "usa" | "world";
type Category = "love" | "money" | "creativity" | "spirituality" | "community" | "reinvention" | "family" | "short_trips";

const SAMPLE_CITIES = [
  { name: "San Diego, CA", score: 92, reason: "Coastal calm meets creative energy — ideal for your emotional recharge needs", risk: "High cost of living may pressure finances initially", neighborhood: "North Park or Hillcrest", useCase: "reinvention" },
  { name: "Austin, TX", score: 88, reason: "Tech + creativity fusion with strong community energy", risk: "Rapid growth changing the culture you'd move for", neighborhood: "East Austin or South Congress", useCase: "career" },
  { name: "Denver, CO", score: 85, reason: "Outdoor lifestyle and altitude shift for fresh perspective", risk: "Winter isolation if you're not prepared", neighborhood: "RiNo or Capitol Hill", useCase: "reinvention" },
  { name: "Portland, OR", score: 82, reason: "Creative scene with strong community and indie culture", risk: "Gray winters may affect mood patterns", neighborhood: "Alberta Arts District", useCase: "creativity" },
  { name: "Lisbon, Portugal", score: 90, reason: "Affordable European life with deep creative and spiritual community", risk: "Language barrier and bureaucratic adjustment period", neighborhood: "Alfama or Principe Real", useCase: "transformation" },
];

export default function LocationsPage() {
  const [region, setRegion] = useState<RegionScope>("usa");
  const [category, setCategory] = useState<Category>("reinvention");

  const regions: { key: RegionScope; label: string }[] = [
    { key: "california", label: "California" },
    { key: "usa", label: "United States" },
    { key: "world", label: "Worldwide" },
  ];

  const categories: { key: Category; label: string }[] = [
    { key: "reinvention", label: "Reinvention" },
    { key: "love", label: "Love" },
    { key: "money", label: "Money" },
    { key: "creativity", label: "Creativity" },
    { key: "spirituality", label: "Spirituality" },
    { key: "community", label: "Community" },
    { key: "family", label: "Family" },
    { key: "short_trips", label: "Short Trips" },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-bold text-surface-900 mb-2">Location Analysis</h1>
      <p className="text-surface-300 mb-8">Discover cities that align with your energy, goals, and growth trajectory.</p>

      <div className="flex gap-2 mb-6">
        {regions.map((r) => (
          <button
            key={r.key}
            onClick={() => setRegion(r.key)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              region === r.key
                ? "bg-brand-600 text-white"
                : "bg-surface-100 text-surface-700 hover:bg-surface-200"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((c) => (
          <button
            key={c.key}
            onClick={() => setCategory(c.key)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              category === c.key
                ? "bg-cosmic-600 text-white"
                : "bg-surface-100 text-surface-300 hover:bg-surface-200 hover:text-surface-700"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="rounded-xl bg-surface-200 h-64 mb-8 flex items-center justify-center">
        <p className="text-surface-300 text-sm">Interactive Mapbox map will render here</p>
      </div>

      <div className="space-y-4">
        {SAMPLE_CITIES.map((city, i) => (
          <div key={city.name} className="rounded-xl bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-brand-700 text-sm font-bold">
                    {i + 1}
                  </span>
                  <h3 className="text-lg font-semibold text-surface-900">{city.name}</h3>
                </div>
                <p className="text-sm text-surface-700 mb-2">{city.reason}</p>
                <div className="flex flex-wrap gap-4 text-xs text-surface-300">
                  <span>Risk: {city.risk}</span>
                  <span>Best area: {city.neighborhood}</span>
                </div>
              </div>
              <div className="ml-4 flex flex-col items-center">
                <div className="text-2xl font-bold text-brand-600">{city.score}</div>
                <div className="text-xs text-surface-300">/ 100</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
