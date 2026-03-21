"use client";

import { useState, useEffect } from "react";
import { db, type UserProfile } from "@/lib/db";
import { calculateLifePath } from "@destination-future/core";
import { getSunSign } from "@destination-future/core";

// ─── Element-based style archetype mappings ───

type ArchetypeEntry = { name: string; pct: number; color: string; ring: string };

const ARCHETYPE_STYLES: Record<string, ArchetypeEntry[]> = {
  Fire: [
    { name: "Bold/Statement", pct: 40, color: "from-red-600 to-orange-700", ring: "stroke-red-500" },
    { name: "Streetwear", pct: 30, color: "from-rose-500 to-pink-700", ring: "stroke-rose-400" },
    { name: "Minimalist", pct: 20, color: "from-slate-700 to-zinc-900", ring: "stroke-slate-600" },
    { name: "Classic", pct: 10, color: "from-amber-700 to-yellow-900", ring: "stroke-amber-500" },
  ],
  Earth: [
    { name: "Classic", pct: 40, color: "from-amber-700 to-yellow-900", ring: "stroke-amber-500" },
    { name: "Minimalist", pct: 30, color: "from-slate-700 to-zinc-900", ring: "stroke-slate-600" },
    { name: "Luxury", pct: 20, color: "from-yellow-500 to-amber-600", ring: "stroke-yellow-400" },
    { name: "Streetwear", pct: 10, color: "from-rose-500 to-pink-700", ring: "stroke-rose-400" },
  ],
  Air: [
    { name: "Minimalist", pct: 35, color: "from-slate-700 to-zinc-900", ring: "stroke-slate-600" },
    { name: "High-Fashion", pct: 30, color: "from-violet-500 to-purple-700", ring: "stroke-violet-400" },
    { name: "Classic", pct: 20, color: "from-amber-700 to-yellow-900", ring: "stroke-amber-500" },
    { name: "Streetwear", pct: 15, color: "from-rose-500 to-pink-700", ring: "stroke-rose-400" },
  ],
  Water: [
    { name: "Classic", pct: 35, color: "from-amber-700 to-yellow-900", ring: "stroke-amber-500" },
    { name: "Minimalist", pct: 30, color: "from-slate-700 to-zinc-900", ring: "stroke-slate-600" },
    { name: "Romantic", pct: 25, color: "from-pink-400 to-rose-600", ring: "stroke-pink-400" },
    { name: "Luxury", pct: 10, color: "from-yellow-500 to-amber-600", ring: "stroke-yellow-400" },
  ],
};

const DEFAULT_ARCHETYPES: ArchetypeEntry[] = [
  { name: "Minimalist", pct: 60, color: "from-slate-700 to-zinc-900", ring: "stroke-slate-600" },
  { name: "Classic", pct: 30, color: "from-amber-700 to-yellow-900", ring: "stroke-amber-500" },
  { name: "Streetwear", pct: 10, color: "from-rose-500 to-pink-700", ring: "stroke-rose-400" },
];

// ─── Element-based color palettes ───

type PaletteColor = { name: string; hex: string; light: boolean };

const ELEMENT_PALETTES: Record<string, PaletteColor[]> = {
  Fire: [
    { name: "Crimson", hex: "#DC143C", light: false },
    { name: "Burnt Orange", hex: "#CC5500", light: false },
    { name: "Gold", hex: "#D4A017", light: false },
    { name: "Warm Ivory", hex: "#F5F0E8", light: true },
    { name: "Charcoal", hex: "#3D3D3D", light: false },
    { name: "Sienna", hex: "#A0522D", light: false },
  ],
  Earth: [
    { name: "Olive", hex: "#708238", light: false },
    { name: "Terracotta", hex: "#C17A5A", light: false },
    { name: "Warm Beige", hex: "#D2B48C", light: true },
    { name: "Forest", hex: "#2C5F2D", light: false },
    { name: "Espresso", hex: "#3C2415", light: false },
    { name: "Sand", hex: "#E8D5B7", light: true },
  ],
  Air: [
    { name: "Lavender", hex: "#B4A7D6", light: true },
    { name: "Sky Blue", hex: "#87CEEB", light: true },
    { name: "Soft Pink", hex: "#F4C2C2", light: true },
    { name: "Pearl", hex: "#F0EAD6", light: true },
    { name: "Silver", hex: "#A8A9AD", light: false },
    { name: "Mint", hex: "#AAF0D1", light: true },
  ],
  Water: [
    { name: "Deep Navy", hex: "#1B2A4A", light: false },
    { name: "Teal", hex: "#008080", light: false },
    { name: "Emerald", hex: "#046307", light: false },
    { name: "Storm Gray", hex: "#4F5B66", light: false },
    { name: "Seafoam", hex: "#93E9BE", light: true },
    { name: "Midnight", hex: "#191970", light: false },
  ],
};

const DEFAULT_PALETTE: PaletteColor[] = [
  { name: "Deep Navy", hex: "#1B2A4A", light: false },
  { name: "Warm Ivory", hex: "#F5F0E8", light: true },
  { name: "Sage Green", hex: "#8B9E7F", light: false },
  { name: "Terracotta", hex: "#C17A5A", light: false },
  { name: "Charcoal", hex: "#3D3D3D", light: false },
  { name: "Dusty Rose", hex: "#C9A0A0", light: false },
];

// ─── Element description helpers ───

const ELEMENT_STYLE_DESCRIPTIONS: Record<string, string> = {
  Fire: "Your style burns bright — bold colors, statement silhouettes, and pieces that command attention. You dress to express, never to blend in.",
  Earth: "Your style is grounded in quality and timelessness — classic cuts, natural textures, and a wardrobe that gets better with age.",
  Air: "Your style floats between worlds — effortlessly modern, intellectually curated, and always one step ahead of the trend.",
  Water: "Your style flows with intuition — layered, mood-driven, and deeply expressive. You dress to feel, not just to be seen.",
};

const ELEMENT_METAL: Record<string, string> = {
  Fire: "Gold",
  Earth: "Bronze",
  Air: "Silver",
  Water: "Platinum",
};

const SAMPLE_CAPSULE = [
  { category: "Tops", emoji: "\u{1F455}", gradient: "from-blue-500 to-cyan-400", items: ["White crew-neck tee", "Navy linen button-down", "Heather gray crewneck sweater", "Olive bomber jacket"] },
  { category: "Bottoms", emoji: "\u{1F456}", gradient: "from-indigo-500 to-purple-400", items: ["Slim dark wash jeans", "Navy chinos", "Black joggers", "Tan shorts"] },
  { category: "Outerwear", emoji: "\u{1F9E5}", gradient: "from-amber-500 to-orange-400", items: ["Camel overcoat", "Black leather jacket", "Navy rain jacket"] },
  { category: "Shoes", emoji: "\u{1F45F}", gradient: "from-emerald-500 to-teal-400", items: ["White leather sneakers", "Brown Chelsea boots", "Navy loafers"] },
  { category: "Accessories", emoji: "\u231A", gradient: "from-rose-500 to-pink-400", items: ["Silver watch", "Brown leather belt", "Navy weekender bag"] },
];

const OUTFIT_INSPIRATIONS = [
  {
    occasion: "Casual",
    emoji: "\u2600\uFE0F",
    gradient: "from-sky-400 to-blue-500",
    bgGradient: "from-sky-200 via-blue-100 to-indigo-200",
    description: "Effortless weekend vibes with clean lines",
    pieces: ["White crew-neck tee", "Slim dark wash jeans", "White leather sneakers", "Silver watch"],
  },
  {
    occasion: "Date Night",
    emoji: "\u{1F319}",
    gradient: "from-rose-500 to-purple-600",
    bgGradient: "from-rose-300 via-purple-200 to-indigo-300",
    description: "Refined yet relaxed — confident without trying too hard",
    pieces: ["Navy linen button-down", "Black joggers (tapered)", "Brown Chelsea boots", "Brown leather belt"],
  },
  {
    occasion: "Work",
    emoji: "\u{1F4BC}",
    gradient: "from-slate-500 to-zinc-700",
    bgGradient: "from-slate-200 via-gray-100 to-zinc-200",
    description: "Sharp, polished, and boardroom-ready",
    pieces: ["Heather gray crewneck sweater", "Navy chinos", "Navy loafers", "Silver watch"],
  },
  {
    occasion: "Event",
    emoji: "\u2728",
    gradient: "from-amber-400 to-orange-500",
    bgGradient: "from-amber-200 via-orange-100 to-yellow-200",
    description: "Turn heads without overdoing it",
    pieces: ["Black leather jacket", "White crew-neck tee", "Slim dark wash jeans", "Brown Chelsea boots"],
  },
  {
    occasion: "Weekend",
    emoji: "\u2615",
    gradient: "from-emerald-400 to-teal-500",
    bgGradient: "from-emerald-200 via-teal-100 to-cyan-200",
    description: "Coffee runs and farmer's market energy",
    pieces: ["Olive bomber jacket", "White crew-neck tee", "Tan shorts", "White leather sneakers"],
  },
  {
    occasion: "Travel",
    emoji: "\u2708\uFE0F",
    gradient: "from-violet-400 to-indigo-500",
    bgGradient: "from-violet-200 via-indigo-100 to-blue-200",
    description: "Comfort meets style at 30,000 feet",
    pieces: ["Heather gray crewneck sweater", "Black joggers", "White leather sneakers", "Navy weekender bag"],
  },
];

const WARDROBE_STAPLES = [
  { name: "White Crew-Neck Tee", why: "The ultimate layering base — goes with literally everything in your closet", price: "$" },
  { name: "Slim Dark Wash Jeans", why: "Clean enough for dinner, casual enough for weekends. Your most versatile bottom", price: "$$" },
  { name: "Navy Chinos", why: "Bridge the gap between casual and formal — your secret weapon for dress codes", price: "$$" },
  { name: "Gray Crewneck Sweater", why: "Neutral, cozy, and pairs with every color in your palette", price: "$$" },
  { name: "White Leather Sneakers", why: "Clean silhouette that elevates any casual outfit instantly", price: "$$" },
  { name: "Brown Leather Belt", why: "Ties your shoes to your outfit. Simple hardware, maximum polish", price: "$" },
];

const STATEMENT_PIECES = [
  { name: "Black Leather Jacket", why: "Your minimalist edge piece — adds instant personality to basic outfits", price: "$$$" },
  { name: "Camel Overcoat", why: "The power move. Nothing says 'I have my life together' like a structured coat", price: "$$$" },
  { name: "Olive Bomber Jacket", why: "Streetwear influence meets your clean aesthetic — the perfect tension", price: "$$" },
  { name: "Navy Linen Button-Down", why: "Texture is your statement — linen says relaxed sophistication", price: "$$" },
  { name: "Chelsea Boots", why: "Sleek silhouette that says classic with a modern edge", price: "$$$" },
  { name: "Silver Chronograph Watch", why: "Your signature accessory — minimalist face, maximum impact", price: "$$$" },
];

const STORE_LINKS = [
  { name: "Amazon", url: "https://www.amazon.com/s?k=minimalist+men+capsule+wardrobe", what: "Budget basics, everyday essentials, accessories", tier: "Value", gradient: "from-orange-400 to-amber-500", icon: "\u{1F4E6}" },
  { name: "Nordstrom", url: "https://www.nordstrom.com/sr?keyword=classic+minimalist", what: "Premium staples, quality denim, outerwear", tier: "Premium", gradient: "from-slate-600 to-gray-800", icon: "\u{1F451}" },
  { name: "H&M", url: "https://www2.hm.com/en_us/search-results.html?q=minimalist+basics", what: "Trend testing, seasonal pieces, affordable layers", tier: "Value", gradient: "from-red-400 to-rose-500", icon: "\u{1F6CD}\uFE0F" },
  { name: "ASOS", url: "https://www.asos.com/us/search/?q=minimalist+capsule", what: "Wide selection, extended sizing, curated edits", tier: "Value", gradient: "from-blue-400 to-indigo-500", icon: "\u{1F30D}" },
  { name: "Uniqlo", url: "https://www.uniqlo.com/us/en/search?q=essentials", what: "Perfect basics, innovative fabrics, core wardrobe", tier: "Value", gradient: "from-red-500 to-red-700", icon: "\u2B50" },
  { name: "Zara", url: "https://www.zara.com/us/en/search?searchTerm=minimalist", what: "On-trend pieces, structured silhouettes, statement items", tier: "Premium", gradient: "from-gray-800 to-black", icon: "\u2666\uFE0F" },
];

const ACCESSORIES = [
  { type: "Watch", emoji: "\u231A", gradient: "from-slate-600 to-zinc-800", recommendation: "Silver-tone minimalist with a clean dial and leather or mesh strap. 40mm or under for your wrist.", price: "$$-$$$" },
  { type: "Sunglasses", emoji: "\u{1F576}\uFE0F", gradient: "from-amber-500 to-orange-600", recommendation: "Wayfarers or round frames in matte black or tortoiseshell. Timeless shapes that match your classic-minimalist blend.", price: "$$" },
  { type: "Bag", emoji: "\u{1F45C}", gradient: "from-emerald-500 to-teal-600", recommendation: "Navy canvas weekender with leather handles. Doubles as a gym bag. Clean hardware, no logos.", price: "$$" },
  { type: "Belt", emoji: "\u{1F9F3}", gradient: "from-rose-500 to-pink-600", recommendation: "Brown leather, brushed silver buckle. 1.25 inch width. Should match your Chelsea boots.", price: "$" },
  { type: "Jewelry", emoji: "\u{1F48E}", gradient: "from-violet-500 to-purple-600", recommendation: "Thin silver chain or a single signet ring. Understated metallics that complement your watch. Less is more.", price: "$-$$" },
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
  const [activeOutfit, setActiveOutfit] = useState(0);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.getProfile()
      .then((p) => setProfile(p))
      .finally(() => setLoading(false));
  }, []);

  // Derive astro data from profile
  const birthday = profile?.birthday ? new Date(profile.birthday + "T00:00:00") : null;
  const sunSign = birthday ? getSunSign(birthday) : null;
  const lifePath = birthday ? calculateLifePath(birthday) : null;
  const element = sunSign?.element || null;

  const archetypes = element ? (ARCHETYPE_STYLES[element] || DEFAULT_ARCHETYPES) : DEFAULT_ARCHETYPES;
  const palette = element ? (ELEMENT_PALETTES[element] || DEFAULT_PALETTE) : DEFAULT_PALETTE;
  const styleDescription = element
    ? ELEMENT_STYLE_DESCRIPTIONS[element]
    : "Your style leans heavily minimalist with clean lines and neutral tones, grounded by classic tailoring sensibilities. A touch of streetwear influence keeps things modern and approachable.";
  const metalRec = element ? ELEMENT_METAL[element] : "Silver";
  const firstName = profile?.firstName || "";

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="h-10 w-10 mx-auto animate-spin rounded-full border-4 border-gray-200 border-t-amber-500" />
          <p className="text-gray-500 font-medium">Loading your style profile...</p>
        </div>
      </div>
    );
  }

  if (!profile || !profile.birthday) {
    return (
      <div className="mx-auto max-w-5xl flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4 max-w-md">
          <div className="text-5xl mb-2">{"\u{1F455}"}</div>
          <h2 className="text-2xl font-bold text-gray-900">Complete Your Profile First</h2>
          <p className="text-gray-500">
            We need your birthday and personal details to build your personalized style system. Complete the intake to unlock your Fashion DNA.
          </p>
          <a
            href="/intake"
            className="inline-block mt-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-3 text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            Complete Intake
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-zinc-800 to-stone-900 p-8 md:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(251,191,36,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(168,85,247,0.1),transparent_60%)]" />
        <div className="relative z-10">
          <p className="text-sm font-medium uppercase tracking-widest text-amber-400 mb-2">Your Style DNA</p>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3">
            {firstName ? `${firstName}\u2019s Fashion System` : "Fashion System"}
          </h1>

          {/* Sun Sign + Life Path badges */}
          {(sunSign || lifePath) && (
            <div className="flex flex-wrap gap-3 mb-4">
              {sunSign && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-1.5 text-sm font-semibold text-white">
                  {sunSign.symbol} {sunSign.name} <span className="text-white/50">|</span> {sunSign.element}
                </span>
              )}
              {lifePath && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-1.5 text-sm font-semibold text-white">
                  {"\u{1F522}"} Life Path {lifePath.value}{lifePath.isMaster ? " (Master)" : ""}
                </span>
              )}
            </div>
          )}

          <p className="text-lg text-white/60 max-w-xl mb-8">
            {styleDescription}
          </p>

          <div className="flex flex-wrap gap-8 items-end">
            {archetypes.map((a) => (
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
            <h2 className="text-2xl font-bold text-gray-900">{"\u{1F3A8}"} Your Color Palette</h2>
            <p className="text-sm text-gray-400 mt-1">Curated tones that complement your skin tone and energy</p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2">
            <div className={`h-4 w-4 rounded-full ring-2 ring-white ${
              metalRec === "Gold" ? "bg-gradient-to-br from-yellow-400 to-amber-500" :
              metalRec === "Bronze" ? "bg-gradient-to-br from-amber-600 to-yellow-800" :
              metalRec === "Platinum" ? "bg-gradient-to-br from-slate-300 to-gray-200" :
              "bg-gradient-to-br from-gray-300 to-gray-400"
            }`} />
            <span className="text-sm font-medium text-gray-600">Recommended metal: {metalRec}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {palette.map((color) => (
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{"\u{1F454}"} Capsule Wardrobe</h2>
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

      {/* Outfit Inspiration with Images */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{"\u{1F525}"} Outfit Inspiration</h2>
        <p className="text-sm text-gray-400 mb-6">Complete looks styled for every occasion. Tap to explore.</p>

        {/* Occasion pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {OUTFIT_INSPIRATIONS.map((o, i) => (
            <button
              key={o.occasion}
              onClick={() => setActiveOutfit(i)}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-300 ${
                activeOutfit === i
                  ? `bg-gradient-to-r ${o.gradient} text-white shadow-lg scale-105`
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
              }`}
            >
              <span>{o.emoji}</span>
              {o.occasion}
            </button>
          ))}
        </div>

        {/* Active outfit card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Large visual placeholder */}
          <div className={`relative h-80 md:h-[420px] rounded-2xl bg-gradient-to-br ${OUTFIT_INSPIRATIONS[activeOutfit].bgGradient} overflow-hidden shadow-xl group transition-all duration-500`}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.1),transparent_70%)]" />
            {/* Decorative elements */}
            <div className="absolute top-6 left-6 w-20 h-28 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20" />
            <div className="absolute top-10 left-12 w-20 h-28 rounded-lg bg-white/15 backdrop-blur-sm border border-white/20" />
            <div className="absolute top-20 right-8 w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20" />

            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${OUTFIT_INSPIRATIONS[activeOutfit].gradient} px-4 py-1.5 text-white text-sm font-bold shadow-lg mb-3`}>
                <span>{OUTFIT_INSPIRATIONS[activeOutfit].emoji}</span>
                {OUTFIT_INSPIRATIONS[activeOutfit].occasion}
              </div>
              <p className="text-white text-lg font-bold mb-1">{OUTFIT_INSPIRATIONS[activeOutfit].description}</p>
              <p className="text-white/60 text-sm">Styled from your capsule wardrobe</p>
            </div>
          </div>

          {/* Outfit details */}
          <div className="flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">The Breakdown</h3>
              <ul className="space-y-3">
                {OUTFIT_INSPIRATIONS[activeOutfit].pieces.map((piece, i) => (
                  <li key={piece} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100 hover:border-gray-200 transition-all duration-200">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br ${OUTFIT_INSPIRATIONS[activeOutfit].gradient} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                      {i + 1}
                    </div>
                    <span className="text-sm font-semibold text-gray-800">{piece}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button className={`mt-6 w-full rounded-xl bg-gradient-to-r ${OUTFIT_INSPIRATIONS[activeOutfit].gradient} py-3.5 text-white font-bold text-sm shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200`}>
              {"\u{1F6D2}"} Shop This Look
            </button>
          </div>
        </div>

        {/* Outfit grid thumbnails */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mt-6">
          {OUTFIT_INSPIRATIONS.map((o, i) => (
            <button
              key={o.occasion}
              onClick={() => setActiveOutfit(i)}
              className={`relative h-24 rounded-xl bg-gradient-to-br ${o.bgGradient} overflow-hidden transition-all duration-300 ${
                activeOutfit === i ? "ring-3 ring-offset-2 ring-gray-900 shadow-xl scale-105" : "opacity-60 hover:opacity-100 hover:scale-105"
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-2 left-2 right-2">
                <span className="text-[10px] font-bold text-white">{o.occasion}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Fashion Staples vs Statement Pieces */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{"\u2696\uFE0F"} Staples vs. Statements</h2>
        <p className="text-sm text-gray-400 mb-6">Build your wardrobe with reliable basics, then inject personality with standout pieces.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Wardrobe Staples */}
          <div className="rounded-2xl border border-gray-200 bg-white shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-slate-700 to-zinc-800 p-5">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>{"\u{1F9F1}"}</span> Wardrobe Staples
              </h3>
              <p className="text-sm text-white/60 mt-1">Essential basics everyone needs</p>
            </div>
            <div className="p-4 space-y-3">
              {WARDROBE_STAPLES.map((item) => (
                <div key={item.name} className="group p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-bold text-gray-900">{item.name}</h4>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">{item.price}</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.why}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Statement Pieces */}
          <div className="rounded-2xl border border-gray-200 bg-white shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-5">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>{"\u26A1"}</span> Statement Pieces
              </h3>
              <p className="text-sm text-white/80 mt-1">Personality-driven items that express your archetype</p>
            </div>
            <div className="p-4 space-y-3">
              {STATEMENT_PIECES.map((item) => (
                <div key={item.name} className="group p-3 rounded-xl hover:bg-amber-50/50 transition-colors border border-transparent hover:border-amber-100">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-bold text-gray-900">{item.name}</h4>
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">{item.price}</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.why}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Accessories */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{"\u{1F48E}"} Accessories</h2>
        <p className="text-sm text-gray-400 mb-6">The finishing touches that complete every look.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {ACCESSORIES.map((acc) => (
            <div key={acc.type} className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              {/* Gradient header */}
              <div className={`h-20 bg-gradient-to-br ${acc.gradient} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.2),transparent_60%)]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl opacity-90 group-hover:scale-125 transition-transform duration-300">{acc.emoji}</span>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{acc.type}</h3>
                  <span className={`text-xs font-bold bg-gradient-to-r ${acc.gradient} bg-clip-text text-transparent`}>{acc.price}</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{acc.recommendation}</p>
              </div>
              <div className={`h-1 bg-gradient-to-r ${acc.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            </div>
          ))}
        </div>
      </div>

      {/* Store Links & Shopping */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{"\u{1F6CD}\uFE0F"} Shop Your Style</h2>
        <p className="text-sm text-gray-400 mb-6">Curated retailer links with search queries matched to your aesthetic.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {STORE_LINKS.map((store) => (
            <a
              key={store.name}
              href={store.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer block"
            >
              <div className={`h-2 bg-gradient-to-r ${store.gradient} group-hover:h-3 transition-all duration-300`} />
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{store.icon}</span>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:${store.gradient} transition-all">{store.name}</h3>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                    store.tier === "Value"
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}>
                    {store.tier === "Value" ? "\u{1F48E}" : "\u{1F451}"} {store.tier}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-4">{store.what}</p>
                <div className={`flex items-center gap-2 text-sm font-semibold bg-gradient-to-r ${store.gradient} bg-clip-text text-transparent group-hover:gap-3 transition-all duration-300`}>
                  Browse Collection
                  <span className="text-gray-400 group-hover:translate-x-1 transition-transform">{"\u2192"}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Shopping Suggestions (original) */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{"\u{1F6D2}"} Shopping Guide</h2>
        <p className="text-sm text-gray-400 mb-6">Smart spending at every price point.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SHOPPING.map((tier) => (
            <div key={tier.tier} className="relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300">
              <div className={`absolute top-0 left-0 right-0 h-24 bg-gradient-to-br ${tier.color} opacity-10`} />
              <div className="relative p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`inline-flex items-center gap-1 rounded-full bg-gradient-to-r ${tier.color} px-4 py-1.5 text-white text-sm font-bold shadow-lg`}>
                    {tier.tier === "Value" ? "\u{1F48E}" : "\u{1F451}"} {tier.tier}
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
