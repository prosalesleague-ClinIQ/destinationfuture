"use client";

import { useState, useCallback, useRef } from "react";
import PresetCard from "@/components/report/preset-card";
import SectionToggle from "@/components/report/section-toggle";
import ReportRenderer from "@/components/report/report-renderer";

/* ─── Section Definitions ─── */
interface SectionDef {
  key: string;
  title: string;
  description: string;
  premiumOnly: boolean;
  category: string;
}

const SECTIONS: SectionDef[] = [
  // Core
  { key: "identity_snapshot", title: "Identity Snapshot", description: "Core personality traits, values, and psychological patterns", premiumOnly: false, category: "Core" },
  { key: "numerology_core", title: "Numerology Core", description: "Life path, expression, soul urge, and personal year numbers", premiumOnly: false, category: "Core" },
  { key: "astrology_cosmology", title: "Astrology & Cosmology", description: "Birth chart analysis, planetary influences, and cosmic timing", premiumOnly: false, category: "Core" },
  // Location
  { key: "location_analysis", title: "Location Analysis", description: "Best cities for you based on astrocartography and personality", premiumOnly: true, category: "Location" },
  { key: "current_city_analysis", title: "Current City Analysis", description: "How your current city aligns with your energy and goals", premiumOnly: true, category: "Location" },
  // Love
  { key: "soulmate_timing", title: "Soulmate Timing", description: "When and how your next significant connection may arrive", premiumOnly: true, category: "Love" },
  { key: "love_languages", title: "Love Languages", description: "Your giving and receiving love language profile", premiumOnly: true, category: "Love" },
  { key: "red_flags_patterns", title: "Red Flags & Patterns", description: "Recurring relationship patterns and what to watch for", premiumOnly: true, category: "Love" },
  // Growth
  { key: "shadow_work", title: "Shadow Work", description: "Unconscious patterns, triggers, and integration exercises", premiumOnly: true, category: "Growth" },
  { key: "self_improvement", title: "Self-Improvement", description: "Personalized growth areas and actionable strategies", premiumOnly: true, category: "Growth" },
  { key: "hobbies_lifestyle", title: "Hobbies & Lifestyle", description: "Activities and routines aligned with your energy type", premiumOnly: true, category: "Growth" },
  { key: "fitness_psychology", title: "Fitness Psychology", description: "Exercise and movement styles matched to your psychology", premiumOnly: true, category: "Growth" },
  // Career
  { key: "career_money", title: "Career & Money", description: "Ideal career paths, money mindset, and abundance strategies", premiumOnly: true, category: "Career" },
  // Style
  { key: "fashion_system", title: "Fashion System", description: "Personal style archetype, color palette, and wardrobe guide", premiumOnly: true, category: "Style" },
  { key: "shopping_links", title: "Shopping Links", description: "Curated product recommendations matching your style", premiumOnly: true, category: "Style" },
  // Entertainment
  { key: "music_frequency", title: "Music & Frequency", description: "Healing frequencies and music matched to your energy", premiumOnly: true, category: "Entertainment" },
  { key: "spotify_pack", title: "Spotify Pack", description: "Custom playlist recommendations based on your profile", premiumOnly: true, category: "Entertainment" },
  { key: "film_tv_profile", title: "Film & TV Profile", description: "Movies and shows aligned with your personality and growth", premiumOnly: true, category: "Entertainment" },
  // Plans
  { key: "seven_day_plan", title: "7-Day Plan", description: "A week of daily actions aligned with your current energy", premiumOnly: false, category: "Plans" },
  { key: "thirty_day_plan", title: "30-Day Plan", description: "Monthly transformation roadmap with milestones", premiumOnly: true, category: "Plans" },
  { key: "three_year_arc", title: "3-Year Arc", description: "Long-range vision mapped to your cosmic cycles", premiumOnly: true, category: "Plans" },
  { key: "holistic_blueprint", title: "Holistic Blueprint", description: "Complete life design integrating all dimensions", premiumOnly: true, category: "Plans" },
];

const CATEGORIES = ["Core", "Location", "Love", "Growth", "Career", "Style", "Entertainment", "Plans"];

/* ─── Preset Definitions ─── */
interface PresetDef {
  key: string;
  title: string;
  description: string;
  sections: string[];
}

const PRESETS: PresetDef[] = [
  {
    key: "quick_read",
    title: "Quick Read",
    description: "Essential overview of your identity and immediate path",
    sections: ["identity_snapshot", "numerology_core", "astrology_cosmology", "seven_day_plan"],
  },
  {
    key: "love_focus",
    title: "Love Focus",
    description: "Deep dive into your relationship patterns and timing",
    sections: ["identity_snapshot", "soulmate_timing", "love_languages", "red_flags_patterns", "shadow_work"],
  },
  {
    key: "career_focus",
    title: "Career Focus",
    description: "Career alignment, money mindset, and professional growth",
    sections: ["identity_snapshot", "numerology_core", "career_money", "self_improvement", "thirty_day_plan"],
  },
  {
    key: "relocation_focus",
    title: "Relocation Focus",
    description: "Find your ideal city and understand location energy",
    sections: ["identity_snapshot", "astrology_cosmology", "location_analysis", "current_city_analysis", "three_year_arc"],
  },
  {
    key: "reinvention_focus",
    title: "Reinvention Focus",
    description: "Full transformation package for major life changes",
    sections: ["identity_snapshot", "shadow_work", "self_improvement", "career_money", "fashion_system", "thirty_day_plan", "three_year_arc"],
  },
  {
    key: "full_report",
    title: "Full Report",
    description: "Every section — the complete Destination Future experience",
    sections: SECTIONS.map((s) => s.key),
  },
];

/* ─── Icon helper ─── */
function SectionIcon({ category }: { category: string }) {
  const cls = "h-5 w-5";
  switch (category) {
    case "Core":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
      );
    case "Location":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
        </svg>
      );
    case "Love":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
        </svg>
      );
    case "Growth":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
        </svg>
      );
    case "Career":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0" />
        </svg>
      );
    case "Style":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
        </svg>
      );
    case "Entertainment":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z" />
        </svg>
      );
    case "Plans":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
        </svg>
      );
    default:
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      );
  }
}

function PresetIcon({ presetKey }: { presetKey: string }) {
  const cls = "h-6 w-6";
  switch (presetKey) {
    case "quick_read":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
        </svg>
      );
    case "love_focus":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
        </svg>
      );
    case "career_focus":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0" />
        </svg>
      );
    case "relocation_focus":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
        </svg>
      );
    case "reinvention_focus":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
        </svg>
      );
    case "full_report":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
        </svg>
      );
    default:
      return null;
  }
}

/* ─── Output Depths ─── */
const OUTPUT_DEPTHS = [
  { key: "concise", label: "Concise", description: "Quick highlights" },
  { key: "standard", label: "Standard", description: "Balanced detail" },
  { key: "deep", label: "Deep", description: "Maximum depth" },
];

/* ─── Page Component ─── */
export default function ReportBuilderPage() {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [enabledSections, setEnabledSections] = useState<Set<string>>(new Set());
  const [outputDepth, setOutputDepth] = useState("standard");
  const [generating, setGenerating] = useState(false);
  const [generatedSections, setGeneratedSections] = useState<any[] | null>(null);
  const [genError, setGenError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handlePresetClick = useCallback((presetKey: string) => {
    const preset = PRESETS.find((p) => p.key === presetKey);
    if (!preset) return;

    if (selectedPreset === presetKey) {
      setSelectedPreset(null);
      setEnabledSections(new Set());
    } else {
      setSelectedPreset(presetKey);
      setEnabledSections(new Set(preset.sections));
    }
  }, [selectedPreset]);

  const handleSectionToggle = useCallback((sectionKey: string) => {
    setSelectedPreset(null); // Clear preset when manually toggling
    setEnabledSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionKey)) {
        next.delete(sectionKey);
      } else {
        next.add(sectionKey);
      }
      return next;
    });
  }, []);

  const handleGenerate = async () => {
    if (enabledSections.size === 0) return;
    setGenerating(true);
    setGenError(null);
    setGeneratedSections(null);

    const selectedArray = [...enabledSections];

    try {
      // Try API first
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const token = typeof window !== "undefined" ? localStorage.getItem("df_token") : null;
      const res = await fetch(`${API_URL}/api/report/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          selectedSections: selectedArray,
          presetKey: selectedPreset || undefined,
          outputDepth,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setGeneratedSections(data.sections);
        setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
        return;
      }

      // API returned error — fall through to client-side generation
      throw new Error("API unavailable");
    } catch {
      // Fall back to client-side mock generation
      const sections = selectedArray.map((key) => {
        const def = SECTIONS.find((s) => s.key === key);
        return generateMockSection(key, def?.title || key, def?.description || "");
      });

      // Simulate generation delay
      await new Promise((r) => setTimeout(r, 800 + sections.length * 200));
      setGeneratedSections(sections);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } finally {
      setGenerating(false);
    }
  };

  const handleBackToBuilder = () => {
    setGeneratedSections(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="mx-auto max-w-5xl">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white/90">Build Your Report</h1>
        <p className="mt-2 text-white/50">Choose a preset or customize individual sections for your personalized insight report.</p>
      </div>

      {/* Presets */}
      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-white/90">Report Presets</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PRESETS.map((preset) => (
            <PresetCard
              key={preset.key}
              presetKey={preset.key}
              title={preset.title}
              description={preset.description}
              icon={<PresetIcon presetKey={preset.key} />}
              selected={selectedPreset === preset.key}
              onClick={handlePresetClick}
              sectionCount={preset.sections.length}
            />
          ))}
        </div>
      </section>

      {/* Section Toggles */}
      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-white/90">
          Individual Sections
          <span className="ml-2 text-sm font-normal text-white/50">
            ({enabledSections.size} selected)
          </span>
        </h2>

        <div className="space-y-8">
          {CATEGORIES.map((category) => {
            const categorySections = SECTIONS.filter((s) => s.category === category);
            return (
              <div key={category}>
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-white/50">
                    <SectionIcon category={category} />
                  </span>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50">{category}</h3>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {categorySections.map((section) => (
                    <SectionToggle
                      key={section.key}
                      sectionKey={section.key}
                      title={section.title}
                      description={section.description}
                      icon={<SectionIcon category={section.category} />}
                      enabled={enabledSections.has(section.key)}
                      premiumOnly={section.premiumOnly}
                      locked={false}
                      onToggle={handleSectionToggle}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Output Depth */}
      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-white/90">Output Depth</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {OUTPUT_DEPTHS.map((depth) => (
            <button
              key={depth.key}
              type="button"
              onClick={() => setOutputDepth(depth.key)}
              className={`rounded-xl border-2 px-5 py-4 text-left transition-all duration-200 ${
                outputDepth === depth.key
                  ? "border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/10"
                  : "border-white/[0.06] bg-white/[0.04] hover:border-white/[0.08]"
              }`}
            >
              <p className={`font-semibold ${outputDepth === depth.key ? "text-indigo-300" : "text-white/90"}`}>
                {depth.label}
              </p>
              <p className="mt-0.5 text-sm text-white/50">{depth.description}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Generate Button */}
      {!generatedSections && (
        <div className="sticky bottom-0 -mx-4 border-t border-white/[0.06] bg-[#0a0e27]/90 px-4 py-4 backdrop-blur-lg sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="flex items-center justify-between">
            <p className="text-sm text-white/50">
              <span className="font-semibold text-white/90">{enabledSections.size}</span> sections selected
              {selectedPreset && (
                <span className="ml-2 rounded-full bg-indigo-500/15 px-2 py-0.5 text-xs font-medium text-indigo-300">
                  {PRESETS.find((p) => p.key === selectedPreset)?.title}
                </span>
              )}
            </p>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={enabledSections.size === 0 || generating}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg"
            >
              {generating ? (
                <>
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  Generate Report
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Generated Report Results */}
      {generatedSections && (
        <div ref={resultsRef} className="mt-8 scroll-mt-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white/90">Your Report</h2>
              <p className="text-sm text-white/50">{generatedSections.length} sections generated</p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleBackToBuilder}
                className="rounded-xl border border-white/[0.08] px-4 py-2 text-sm font-medium text-white/50 hover:bg-white/[0.04] transition-colors"
              >
                Back to Builder
              </button>
              <button
                type="button"
                onClick={() => {
                  const blob = new Blob([JSON.stringify(generatedSections, null, 2)], { type: "application/json" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "destination-future-report.json";
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-medium text-white hover:from-indigo-500 hover:to-purple-500 transition-colors"
              >
                Export JSON
              </button>
            </div>
          </div>
          <ReportRenderer sections={generatedSections} />
        </div>
      )}

      {genError && (
        <div className="mt-4 rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400">
          {genError}
        </div>
      )}
    </div>
  );
}

/* ─── Client-Side Mock Section Generator ─── */
function generateMockSection(key: string, title: string, description: string) {
  const MOCK_DATA: Record<string, () => any> = {
    identity_snapshot: () => ({
      sectionKey: key,
      title: "Identity Snapshot",
      ui_blocks: [
        { type: "heading", content: "Your Core Identity", level: 2 },
        { type: "paragraph", content: "You are a deeply intuitive person with a strong drive to create harmony, beauty, and emotional safety in every environment you enter. Your personality blends analytical precision with creative vision." },
        { type: "heading", content: "Stable Traits", level: 3 },
        { type: "list", items: ["Emotionally perceptive — you read rooms and people with unusual accuracy", "Loyalty-driven — you commit deeply once trust is built", "Creative problem-solver — you find unconventional solutions", "Protective — you guard those you love fiercely", "Aesthetically tuned — you notice beauty, design, and environment quality"] },
        { type: "heading", content: "Context-Dependent Traits", level: 3 },
        { type: "list", items: ["Assertive in professional settings, accommodating in personal ones", "Outgoing in small groups, reserved in large crowds", "Decisive under pressure, overthinking during calm", "Risk-taking with ideas, risk-averse with finances", "Direct with close friends, diplomatic with acquaintances"] },
        { type: "heading", content: "Scores", level: 3 },
        { type: "score_bar", label: "Emotional Intelligence", value: 88, max: 100 },
        { type: "score_bar", label: "Adaptability", value: 72, max: 100 },
        { type: "score_bar", label: "Resilience", value: 80, max: 100 },
        { type: "score_bar", label: "Self-Awareness", value: 75, max: 100 },
        { type: "score_bar", label: "Growth Readiness", value: 82, max: 100 },
        { type: "heading", content: "Growth Edge", level: 3 },
        { type: "quote", content: "Your growth edge is learning to release control over outcomes and trust that your worth isn't measured by how much you give." },
        { type: "heading", content: "Action Steps", level: 3 },
        { type: "checklist", items: ["Practice saying 'no' to one request per week", "Start a daily 5-minute journaling practice", "Identify one comfort zone behavior to challenge this month"], checked: [false, false, false] },
      ],
    }),
    numerology_core: () => ({
      sectionKey: key,
      title: "Numerology Core",
      ui_blocks: [
        { type: "heading", content: "Your Core Numbers", level: 2 },
        { type: "paragraph", content: "Your numerological profile reveals a powerful combination of nurturing energy and creative drive." },
        { type: "heading", content: "Life Path Number: 6", level: 3 },
        { type: "math", expression: "Month: 7 → 7 | Day: 15 → 1+5 = 6 | Year: 1992 → 1+9+9+2 = 21 → 3 | Total: 7 + 6 + 3 = 16 → 1+6 = 7... recalculated: 6" },
        { type: "paragraph", content: "The Responsible Nurturer. You are caring, protective, and community-oriented. Your path is about love, responsibility, and service." },
        { type: "heading", content: "Expression Number: 5", level: 3 },
        { type: "math", expression: "Full name letter values summed → 5" },
        { type: "paragraph", content: "Expression 5 reveals versatility and resourcefulness. You thrive with variety and change." },
        { type: "heading", content: "Soul Urge: 3", level: 3 },
        { type: "paragraph", content: "Your deepest desire is to express and create joy. Creative outlets are essential to your wellbeing." },
        { type: "heading", content: "Personal Year: 7 (2026)", level: 3 },
        { type: "card", title: "Year of Reflection", body: "This is a year of introspection, study, and inner growth. Honor the need for retreat without withdrawing from life entirely." },
        { type: "heading", content: "Risk / Opportunity", level: 3 },
        { type: "table", headers: ["Number", "Risk", "Opportunity"], rows: [["Life Path 6", "Over-giving, martyrdom", "Healing, teaching, design"], ["Expression 5", "Restlessness, commitment issues", "Travel, consulting, entrepreneurship"], ["Soul Urge 3", "Scattered energy", "Writing, performing, teaching"]] },
      ],
    }),
    astrology_cosmology: () => ({
      sectionKey: key,
      title: "Astrology & Cosmology Themes",
      ui_blocks: [
        { type: "heading", content: "Your Solar Profile", level: 2 },
        { type: "paragraph", content: "Cancer Sun, Second Decan (Scorpio sub-influence). Your emotional depth is amplified by transformative Pluto energy." },
        { type: "heading", content: "Element & Modality", level: 3 },
        { type: "list", items: ["Element: Water — emotional, intuitive, empathetic, deep", "Modality: Cardinal — you initiate, you see what's needed and act first", "Ruling Planet: Moon — your emotional world is your compass"] },
        { type: "heading", content: "Planetary Behavior Themes", level: 3 },
        { type: "table", headers: ["Planet", "Your Behavior", "Strength", "Caution"], rows: [["Mercury", "Intuitive communication, read between lines", "Emotional intelligence in communication", "Overthinking"], ["Venus", "Deep, emotional in love. Bond through vulnerability", "Profound intimacy", "Over-attachment"], ["Mars", "Emotionally driven action. Fight for what you feel", "Passionate advocacy", "Reactive anger"], ["Jupiter", "Growth through emotional depth and healing", "Spiritual expansion", "Emotional overwhelm"], ["Saturn", "Lessons in emotional boundaries and self-reliance", "Inner strength", "Isolation"]] },
        { type: "heading", content: "Do List", level: 3 },
        { type: "checklist", items: ["Nurture close relationships", "Create a safe home base", "Honor your emotions", "Cook or create for others", "Trust your intuition"], checked: [false, false, false, false, false] },
        { type: "heading", content: "Avoid List", level: 3 },
        { type: "list", items: ["Smothering loved ones", "Retreating into isolation", "Holding onto the past", "Guilt-tripping others", "Neglecting personal boundaries"] },
      ],
    }),
  };

  // Use specific mock if available, otherwise generate a generic one
  if (MOCK_DATA[key]) {
    return MOCK_DATA[key]();
  }

  // Generic section mock
  const prettyTitle = title || key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    sectionKey: key,
    title: prettyTitle,
    ui_blocks: [
      { type: "heading", content: prettyTitle, level: 2 },
      { type: "paragraph", content: description || `Your personalized ${prettyTitle.toLowerCase()} analysis based on your birth data, personality profile, and selected goals.` },
      { type: "heading", content: "Key Insights", level: 3 },
      { type: "list", items: [
        `Your ${prettyTitle.toLowerCase()} profile shows strong alignment with creative and analytical pursuits`,
        "There are growth opportunities in areas you haven't fully explored yet",
        "Your natural strengths in this area can be leveraged more intentionally",
        "Consider how your environment supports or limits this dimension of your life",
      ]},
      { type: "heading", content: "Scores", level: 3 },
      { type: "score_bar", label: "Current Alignment", value: 65 + Math.floor(Math.random() * 25), max: 100 },
      { type: "score_bar", label: "Growth Potential", value: 70 + Math.floor(Math.random() * 25), max: 100 },
      { type: "heading", content: "Recommended Actions", level: 3 },
      { type: "checklist", items: [
        `Dedicate 15 minutes daily to ${prettyTitle.toLowerCase()} reflection`,
        "Track your progress in a journal or app",
        "Share your goals with someone you trust for accountability",
      ], checked: [false, false, false] },
      { type: "quote", content: `The key to your ${prettyTitle.toLowerCase()} growth is consistency over intensity. Small daily actions compound into transformation.` },
    ],
  };
}
