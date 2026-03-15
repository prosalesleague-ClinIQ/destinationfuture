"use client";

import { useState } from "react";

const ARCHETYPES = [
  { name: "Minimalist", pct: 60, color: "from-slate-700 to-zinc-900", ring: "stroke-slate-600" },
  { name: "Classic", pct: 30, color: "from-amber-700 to-yellow-900", ring: "stroke-amber-500" },
  { name: "Streetwear", pct: 10, color: "from-rose-500 to-pink-700", ring: "stroke-rose-400" },
];

const SAMPLE_PALETTE = [
  { name: "Deep Navy", hex: "#1B2A4A", light: false },
  { name: "Warm Ivory", hex: "#F5F0E8", light: true },
  { name: "Sage Green", hex: "#8B9E7F", light: false },
  { name: "Terracotta", hex: "#C17A5A", light: false },
  { name: "Charcoal", hex: "#3D3D3D", light: false },
  { name: "Dusty Rose", hex: "#C9A0A0", light: false },
];

const SAMPLE_CAPSULE = [
  { category: "Tops", emoji: "👕", gradient: "from-blue-500 to-cyan-400", items: ["White crew-neck tee", "Navy linen button-down", "Heather gray crewneck sweater", "Olive bomber jacket"] },
  { category: "Bottoms", emoji: "👖", gradient: "from-indigo-500 to-purple-400", items: ["Slim dark wash jeans", "Navy chinos", "Black joggers", "Tan shorts"] },
  { category: "Outerwear", emoji: "🧥", gradient: "from-amber-500 to-orange-400", items: ["Camel overcoat", "Black leather jacket", "Navy rain jacket"] },
  { category: "Shoes", emoji: "👟", gradient: "from-emerald-500 to-teal-400", items: ["White leather sneakers", "Brown Chelsea boots", "Navy loafers"] },
  { category: "Accessories", emoji: "⌚", gradient: "from-rose-500 to-pink-400", items: ["Silver watch", "Brown leather belt", "Navy weekender bag"] },
];

const OUTFIT_PAIRINGS = [
  { occasion: "Casual", emoji: "☀️", gradient: "from-sky-400 to-blue-500", outfit: "White tee + dark wash jeans + white sneakers + silver watch" },
  { occasion: "Date Night", emoji: "🌙", gradient: "from-rose-500 to-purple-600", outfit: "Navy button-down + black joggers (tapered) + brown Chelsea boots + leather belt" },
  { occasion: "Work", emoji: "💼", gradient: "from-slate-500 to-zinc-700", outfit: "Gray sweater + navy chinos + navy loafers + silver watch" },
  { occasion: "Event", emoji: "✨", gradient: "from-amber-400 to-orange-500", outfit: "Black leather jacket + white tee + slim jeans + Chelsea boots" },
];

const SHOPPING = [
  { tier: "Value", color: "from-emerald-400 to-teal-500", brands: ["Uniqlo", "COS", "H&M Premium", "Zara"], note: "Best for basics and trend testing" },
  { tier: "Premium", color: "from-amber-400 to-yellow-500", brands: ["A.P.C.", "Norse Projects", "Reiss", "Theory"], note: "Investment pieces that define your look" },
];

function ArchetypeRing({ pct, color, size = 100 }: { pct: number; color: string; size?: number }) {
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;
  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth="6" className="text-white/10" />
      <circle
        cx={size / 2} cy={size / 2} r={radius} fill="none"
        strokeWidth="6" strokeLinecap="round"
        className={color}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
      />
    </svg>
  );
}

export default function StylePage() {
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-zinc-800 to-stone-900 p-8 md:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(251,191,36,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(168,85,247,0.1),transparent_60%)]" />
        <div className="relative z-10">
          <p className="text-sm font-medium uppercase tracking-widest text-amber-400 mb-2">Your Style DNA</p>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3">Fashion System</h1>
          <p className="text-lg text-white/60 max-w-xl mb-8">
            Your style leans heavily minimalist with clean lines and neutral tones, grounded by classic tailoring sensibilities. A touch of streetwear influence keeps things modern and approachable.
          </p>

          <div className="flex flex-wrap gap-8 items-end">
            {ARCHETYPES.map((a) => (
              <div key={a.name} className="flex flex-col items-center gap-2 group">
                <div className="relative">
                  <ArchetypeRing pct={a.pct} color={a.ring} size={110} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-extrabold text-white">{a.pct}%</span>
                  </div>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r ${a.color} shadow-lg group-hover:scale-105 transition-transform`}>
                  {a.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Color Palette */}
      <div className="rounded-3xl bg-white/80 backdrop-blur-xl border border-white/50 shadow-xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">🎨 Your Color Palette</h2>
            <p className="text-sm text-gray-400 mt-1">Curated tones that complement your skin tone and energy</p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2">
            <div className="h-4 w-4 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 ring-2 ring-white" />
            <span className="text-sm font-medium text-gray-600">Recommended metal: Silver</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {SAMPLE_PALETTE.map((color) => (
            <div
              key={color.hex}
              className="group cursor-pointer"
              onMouseEnter={() => setHoveredColor(color.hex)}
              onMouseLeave={() => setHoveredColor(null)}
            >
              <div
                className={`relative h-32 w-full rounded-2xl shadow-lg transition-all duration-300 ${
                  hoveredColor === color.hex ? "scale-110 shadow-2xl ring-4 ring-white/80" : "hover:scale-105"
                }`}
                style={{ backgroundColor: color.hex }}
              >
                <div className={`absolute inset-x-0 bottom-0 rounded-b-2xl p-3 bg-gradient-to-t from-black/50 to-transparent transition-opacity ${
                  hoveredColor === color.hex ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}>
                  <p className="text-xs font-bold text-white">{color.hex}</p>
                </div>
              </div>
              <p className="mt-2 text-center text-sm font-semibold text-gray-700">{color.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Capsule Wardrobe */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">👔 Capsule Wardrobe</h2>
        <p className="text-sm text-gray-400 mb-6">Your 18-piece foundation. Mix and match for 50+ outfits.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SAMPLE_CAPSULE.map((cat) => (
            <div key={cat.category} className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className={`h-2 bg-gradient-to-r ${cat.gradient}`} />
              <div className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{cat.emoji}</span>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{cat.category}</h3>
                    <p className="text-xs text-gray-400">{cat.items.length} essentials</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {cat.items.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-gray-700">
                      <div className={`h-2 w-2 rounded-full bg-gradient-to-r ${cat.gradient} flex-shrink-0`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Outfit Pairings */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">🔀 Outfit Pairings</h2>
        <p className="text-sm text-gray-400 mb-6">Ready-to-wear combinations for every moment.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {OUTFIT_PAIRINGS.map((o) => (
            <div key={o.occasion} className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300">
              <div className={`absolute top-4 right-4 flex items-center gap-2 rounded-full bg-gradient-to-r ${o.gradient} px-4 py-1.5 text-white text-sm font-bold shadow-lg`}>
                <span>{o.emoji}</span>
                {o.occasion}
              </div>
              <div className="p-6 pt-14">
                <div className="flex flex-wrap gap-2">
                  {o.outfit.split(" + ").map((piece) => (
                    <span key={piece} className="rounded-lg bg-gray-50 border border-gray-200 px-3 py-1.5 text-sm text-gray-700 font-medium">
                      {piece}
                    </span>
                  ))}
                </div>
              </div>
              <div className={`h-1 bg-gradient-to-r ${o.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
            </div>
          ))}
        </div>
      </div>

      {/* Shopping Suggestions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">🛍️ Shopping Guide</h2>
        <p className="text-sm text-gray-400 mb-6">Smart spending at every price point.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SHOPPING.map((tier) => (
            <div key={tier.tier} className="relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300">
              <div className={`absolute top-0 left-0 right-0 h-24 bg-gradient-to-br ${tier.color} opacity-10`} />
              <div className="relative p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`inline-flex items-center gap-1 rounded-full bg-gradient-to-r ${tier.color} px-4 py-1.5 text-white text-sm font-bold shadow-lg`}>
                    {tier.tier === "Value" ? "💎" : "👑"} {tier.tier}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-4">{tier.note}</p>
                <div className="flex flex-wrap gap-2">
                  {tier.brands.map((brand) => (
                    <span key={brand} className="rounded-xl bg-gray-50 border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-100 transition-colors cursor-pointer">
                      {brand}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
