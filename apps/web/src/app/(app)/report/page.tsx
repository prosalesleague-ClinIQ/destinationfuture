"use client";

import { useState, useCallback } from "react";
import PresetCard from "@/components/report/preset-card";
import SectionToggle from "@/components/report/section-toggle";

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
    try {
      // In a real app: await api.report.generate({ selectedSections: [...enabledSections], presetKey: selectedPreset || undefined, outputDepth })
      console.log("Generating report:", { sections: [...enabledSections], preset: selectedPreset, outputDepth });
    } catch (error) {
      console.error("Report generation failed:", error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-surface-900">Build Your Report</h1>
        <p className="mt-2 text-surface-700">Choose a preset or customize individual sections for your personalized insight report.</p>
      </div>

      {/* Presets */}
      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-surface-900">Report Presets</h2>
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
        <h2 className="mb-4 text-lg font-semibold text-surface-900">
          Individual Sections
          <span className="ml-2 text-sm font-normal text-surface-700">
            ({enabledSections.size} selected)
          </span>
        </h2>

        <div className="space-y-8">
          {CATEGORIES.map((category) => {
            const categorySections = SECTIONS.filter((s) => s.category === category);
            return (
              <div key={category}>
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-surface-700">
                    <SectionIcon category={category} />
                  </span>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-surface-700">{category}</h3>
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
        <h2 className="mb-4 text-lg font-semibold text-surface-900">Output Depth</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {OUTPUT_DEPTHS.map((depth) => (
            <button
              key={depth.key}
              type="button"
              onClick={() => setOutputDepth(depth.key)}
              className={`rounded-xl border-2 px-5 py-4 text-left transition-all duration-200 ${
                outputDepth === depth.key
                  ? "border-brand-500 bg-brand-50 shadow-sm"
                  : "border-surface-200 bg-white hover:border-surface-300"
              }`}
            >
              <p className={`font-semibold ${outputDepth === depth.key ? "text-brand-700" : "text-surface-900"}`}>
                {depth.label}
              </p>
              <p className="mt-0.5 text-sm text-surface-700">{depth.description}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Generate Button */}
      <div className="sticky bottom-0 -mx-4 border-t border-surface-200 bg-white/90 px-4 py-4 backdrop-blur-lg sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex items-center justify-between">
          <p className="text-sm text-surface-700">
            <span className="font-semibold text-surface-900">{enabledSections.size}</span> sections selected
            {selectedPreset && (
              <span className="ml-2 rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-700">
                {PRESETS.find((p) => p.key === selectedPreset)?.title}
              </span>
            )}
          </p>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={enabledSections.size === 0 || generating}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-cosmic-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 transition-all hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg"
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
    </div>
  );
}
