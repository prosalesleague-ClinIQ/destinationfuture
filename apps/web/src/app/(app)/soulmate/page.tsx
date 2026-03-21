"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { db, type UserProfile } from "@/lib/db";
import { calculateLifePath } from "@destination-future/core";
import { getSunSign } from "@destination-future/core";

/* ─── Types ─── */
type StyleOption = "Casual" | "Natural" | "Luxury" | "High-Fashion" | "Streetwear" | "Classic";
type HairLength = "Short" | "Medium" | "Long";
type HairColor = "Dark" | "Light" | "Red" | "Mixed";
type FacialHair = "None" | "Stubble" | "Beard";
type QuickAdjust = "More Soft" | "More Intense" | "Younger" | "Older" | "More Casual" | "More Luxury";

interface VisualPreferences {
  presentation: number;   // 0 = feminine, 50 = androgynous, 100 = masculine
  energy: number;         // 0 = soft, 100 = bold
  ageMin: number;
  ageMax: number;
  style: StyleOption;
  hairLength: HairLength | null;
  hairColor: HairColor | null;
  facialHair: FacialHair | null;
}

interface Archetype {
  name: string;
  emoji: string;
  match: number;
  description: string;
}

/* ─── Static Data ─── */
const archetypes: Archetype[] = [
  {
    name: "The Deep Connector",
    emoji: "\u{1F30A}",
    match: 87,
    description:
      "Intensely present and emotionally attuned. This archetype craves vulnerability-based intimacy and builds relationships through shared meaning, deep conversation, and mutual healing.",
  },
  {
    name: "The Creative Catalyst",
    emoji: "\u{1F3A8}",
    match: 74,
    description:
      "Restless, inspiring, and drawn to beauty. This archetype pushes you toward growth through artistic expression, novel experiences, and an unwillingness to settle for ordinary.",
  },
  {
    name: "The Grounded Partner",
    emoji: "\u{1F333}",
    match: 68,
    description:
      "Steady, reliable, and quietly powerful. This archetype offers safety and consistency, creating space for you to be your fullest self while maintaining a warm, structured home life.",
  },
];

/* ─── Element Compatibility Maps ─── */
const ELEMENT_SIGN_MAP: Record<string, string[]> = {
  Fire: ["Aries", "Leo", "Sagittarius"],
  Earth: ["Taurus", "Virgo", "Capricorn"],
  Air: ["Gemini", "Libra", "Aquarius"],
  Water: ["Cancer", "Scorpio", "Pisces"],
};

const ELEMENT_COMPAT: Record<string, string[]> = {
  Fire: ["Fire", "Air"],
  Earth: ["Earth", "Water"],
  Air: ["Air", "Fire"],
  Water: ["Water", "Earth"],
};

function getCompatibleSigns(element: string): string[] {
  const compatElements = ELEMENT_COMPAT[element] || [];
  return compatElements.flatMap((el) => ELEMENT_SIGN_MAP[el] || []);
}

function getTopSunMatches(element: string): string {
  const compat = getCompatibleSigns(element);
  // Pick top 3 that aren't the same element group lead
  return compat.slice(0, 3).join(", ");
}

function buildStyleRationale(sunSignName: string, lifePathValue: number): string[] {
  return [
    `Your ${sunSignName} Sun shapes the emotional and aesthetic tone, reflected in warm, approachable features`,
    `Life Path ${lifePathValue} compatibility indicates qualities of harmony, depth, and creative resonance`,
    "Your location affinity for creative cities influenced the artistic, slightly bohemian styling",
    "The romantic energy profile suggests someone with expressive eyes and genuine warmth",
  ];
}

const pipelineSteps = [
  "Report data",
  "Visual attributes",
  "Cinematic prompt",
  "ComfyUI generation",
  "Face detail upscaling",
  "Output",
];

/* ─── Helpers ─── */
function PillSelector<T extends string>({
  options,
  value,
  onChange,
  nullable = false,
}: {
  options: T[];
  value: T | null;
  onChange: (v: T | null) => void;
  nullable?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => {
            if (nullable && value === opt) {
              onChange(null);
            } else {
              onChange(opt);
            }
          }}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
            value === opt
              ? "bg-gradient-to-r from-rose-500/80 to-purple-500/80 text-white shadow-lg shadow-purple-500/20"
              : "bg-white/[0.06] text-white/50 hover:bg-white/[0.10] hover:text-white/70"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-white/[0.06] bg-white/[0.04] backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  );
}

function SectionHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-white/90">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-white/30">{subtitle}</p>}
    </div>
  );
}

/* ─── Main Component ─── */
export default function SoulmatePage() {
  const [profile, setProfile] = useState<UserProfile | null | undefined>(undefined); // undefined = loading

  useEffect(() => {
    db.getProfile().then((p) => setProfile(p ?? null));
  }, []);

  /* Derived astro data from real profile */
  const astroData = useMemo(() => {
    if (!profile?.birthday) return null;
    const dob = new Date(profile.birthday + "T12:00:00");
    const sunSign = getSunSign(dob);
    const lifePath = calculateLifePath(dob);
    const compatSigns = getTopSunMatches(sunSign.element);
    return { sunSign, lifePath, compatSigns };
  }, [profile]);

  const firstName = profile?.firstName || "Profile";
  const sunLabel = astroData ? `${astroData.sunSign.name} Sun` : "Sun";
  const lpLabel = astroData ? `LP ${astroData.lifePath.value}` : "LP";
  const profileTag = `${sunLabel} | ${lpLabel}`;
  const styleRationale = astroData
    ? buildStyleRationale(astroData.sunSign.name, astroData.lifePath.value)
    : [
        "Complete your intake to see personalised style rationale",
        "Sun sign compatibility will drive visual features",
        "Life path resonance will shape the archetype matching",
        "Location and personality data refine the final output",
      ];

  const [prefs, setPrefs] = useState<VisualPreferences>({
    presentation: 50,
    energy: 40,
    ageMin: 26,
    ageMax: 38,
    style: "Natural",
    hairLength: null,
    hairColor: null,
    facialHair: null,
  });

  const [generated, setGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<(string | null)[]>([null, null, null]);
  const [genError, setGenError] = useState<string | null>(null);
  const [showPipeline, setShowPipeline] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [activeQuickAdjust, setActiveQuickAdjust] = useState<QuickAdjust | null>(null);

  const updatePref = useCallback(
    <K extends keyof VisualPreferences>(key: K, value: VisualPreferences[K]) => {
      setPrefs((p) => ({ ...p, [key]: value }));
    },
    [],
  );

  const handleGenerate = useCallback(async () => {
    setGenerating(true);
    setGenerated(false);
    setGenError(null);
    setActiveQuickAdjust(null);
    setGeneratedImages([null, null, null]);

    try {
      // Generate 3 variations in parallel
      const results = await Promise.all(
        [0, 1, 2].map(async (variation) => {
          const res = await fetch("/api/soulmate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...prefs, variation }),
          });
          if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || "Generation failed");
          }
          const data = await res.json();
          return data.url as string;
        })
      );

      setGeneratedImages(results);
      setGenerated(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Generation failed";
      setGenError(message);
    } finally {
      setGenerating(false);
    }
  }, [prefs]);

  const handleRegenerate = useCallback(() => {
    handleGenerate();
  }, [handleGenerate]);

  const handleQuickAdjust = useCallback(
    (adj: QuickAdjust) => {
      setActiveQuickAdjust(adj);
      switch (adj) {
        case "More Soft":
          updatePref("energy", Math.max(0, prefs.energy - 20));
          break;
        case "More Intense":
          updatePref("energy", Math.min(100, prefs.energy + 20));
          break;
        case "Younger":
          updatePref("ageMin", Math.max(22, prefs.ageMin - 3));
          updatePref("ageMax", Math.max(25, prefs.ageMax - 3));
          break;
        case "Older":
          updatePref("ageMin", Math.min(50, prefs.ageMin + 3));
          updatePref("ageMax", Math.min(55, prefs.ageMax + 3));
          break;
        case "More Casual":
          updatePref("style", "Casual");
          break;
        case "More Luxury":
          updatePref("style", "Luxury");
          break;
      }
      setTimeout(() => handleGenerate(), 200);
    },
    [prefs, updatePref, handleGenerate],
  );

  /* Presentation label */
  const presentationLabel =
    prefs.presentation < 35
      ? "More Feminine"
      : prefs.presentation > 65
        ? "More Masculine"
        : "Androgynous";

  const energyLabel =
    prefs.energy < 35
      ? "Soft & Gentle"
      : prefs.energy > 65
        ? "Bold & Intense"
        : "Balanced";

  /* Portrait data */
  const portraits = [
    {
      label: "Variation 1",
      sublabel: "Primary Match",
      gradient: "from-rose-900/60 via-purple-900/50 to-rose-800/40",
      border: "border-rose-500/20",
      note: `${presentationLabel} presentation, ${energyLabel.toLowerCase()} energy, ${prefs.style.toLowerCase()} styling`,
    },
    {
      label: "Variation 2",
      sublabel: "Alternate A",
      gradient: "from-indigo-900/60 via-violet-900/50 to-indigo-800/40",
      border: "border-indigo-500/20",
      note: `Slightly adjusted features with emphasis on warmth and approachability`,
    },
    {
      label: "Variation 3",
      sublabel: "Alternate B",
      gradient: "from-amber-900/40 via-rose-900/50 to-amber-800/30",
      border: "border-amber-500/20",
      note: `Artistic interpretation with stronger creative energy and expressive styling`,
    },
  ];

  /* Loading state */
  if (profile === undefined) {
    return (
      <div className="mx-auto max-w-5xl pb-24 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-full border-2 border-white/20 border-t-white/70 animate-spin" />
          <p className="text-sm text-white/40">Loading your profile...</p>
        </div>
      </div>
    );
  }

  /* No profile — prompt to complete intake */
  if (profile === null || !profile.intakeComplete) {
    return (
      <div className="mx-auto max-w-5xl pb-24 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.06] border border-white/[0.08]">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-rose-400/70">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" fill="currentColor" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white/90 mb-2">Complete Your Intake First</h2>
            <p className="max-w-md text-sm text-white/40 leading-relaxed">
              We need your birth details to calculate your sun sign, life path number, and compatibility profile.
              Complete the intake questionnaire to unlock the Soulmate feature.
            </p>
          </div>
          <a
            href="/intake"
            className="rounded-xl bg-gradient-to-r from-rose-600 to-purple-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-purple-500/15 transition-all hover:shadow-purple-500/30 hover:-translate-y-0.5"
          >
            Start Intake
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl pb-24">
      {/* ══════════════════════════════════════════════════════
          SECTION 1: SOULMATE PROFILE SUMMARY
          ══════════════════════════════════════════════════════ */}
      <div className="relative mb-12 overflow-hidden rounded-2xl">
        {/* Gradient hero background */}
        <div className="absolute inset-0 bg-gradient-to-br from-rose-600/30 via-purple-700/30 to-indigo-800/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(236,72,153,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(124,58,237,0.12),transparent_60%)]" />
        <div className="absolute inset-0 border border-white/[0.08] rounded-2xl" />

        <div className="relative px-8 py-10">
          <div className="flex items-start justify-between mb-8">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-rose-400/80 mb-2">
                Soulmate Visual Generation
              </p>
              <h1 className="text-3xl font-bold text-white/95 mb-2">
                Your Soulmate Archetype
              </h1>
              <p className="max-w-xl text-sm leading-relaxed text-white/40">
                Based on your natal chart, numerology profile, and personality
                data, we have identified your ideal partner archetype and visual
                resonance pattern.
              </p>
            </div>
            <div className="hidden md:flex flex-col items-end gap-1">
              <span className="text-xs text-white/20">Compatibility Engine v2</span>
              <span className="text-xs text-white/20">{firstName}: {profileTag}</span>
            </div>
          </div>

          {/* Key Data Points */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Best Sun Sign Matches", value: astroData ? astroData.compatSigns : "Complete intake" },
              { label: "Best Life Path Matches", value: astroData ? `${[2, 3, 9].join(", ")}` : "Complete intake" },
              { label: "Relationship Energy", value: "Nurturing Creator" },
              { label: "Likely Meeting Environments", value: "Art events, cafes, retreats" },
            ].map((dp) => (
              <div
                key={dp.label}
                className="rounded-xl bg-white/[0.06] border border-white/[0.06] px-4 py-3"
              >
                <p className="text-[10px] font-medium uppercase tracking-wider text-white/30 mb-1">
                  {dp.label}
                </p>
                <p className="text-sm font-semibold text-white/80">{dp.value}</p>
              </div>
            ))}
          </div>

          {/* Emotional Tone */}
          <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] px-6 py-4 mb-8">
            <p className="text-xs font-medium uppercase tracking-wider text-purple-400/70 mb-2">
              Emotional Tone
            </p>
            <p className="text-sm leading-relaxed text-white/50">
              Your profile radiates a blend of deep emotional intelligence and
              creative sensitivity. You are drawn to partners who can hold space
              for vulnerability while also inspiring you toward growth. The
              emotional signature is one of warmth tempered by introspection — a
              quiet intensity that values authenticity over surface-level
              connection.
            </p>
          </div>

          {/* Archetype Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {archetypes.map((arch) => (
              <GlassCard key={arch.name} className="p-5 hover:bg-white/[0.06] transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{arch.emoji}</span>
                  <span className="text-xs font-bold text-rose-400/80">
                    {arch.match}% match
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white/90 mb-2">{arch.name}</h3>
                <p className="text-xs leading-relaxed text-white/35">
                  {arch.description}
                </p>
                {/* Match bar */}
                <div className="mt-4 h-1 w-full rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-rose-500/70 to-purple-500/70"
                    style={{ width: `${arch.match}%` }}
                  />
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          SECTION 2: VISUAL PREFERENCE CONTROLS
          ══════════════════════════════════════════════════════ */}
      <div className="mb-12">
        <SectionHeading
          title="Visual Preferences"
          subtitle="Adjust the controls below to shape the visual interpretation of your soulmate archetype."
        />

        <GlassCard className="p-8">
          <div className="space-y-8">
            {/* Presentation Slider */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-white/70">Presentation</label>
                <span className="rounded-full bg-white/[0.08] px-3 py-0.5 text-xs font-medium text-white/50">
                  {presentationLabel}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-white/30 w-24 text-right">More Feminine</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={prefs.presentation}
                  onChange={(e) => updatePref("presentation", Number(e.target.value))}
                  className="flex-1 h-2 rounded-full appearance-none bg-gradient-to-r from-rose-500/40 via-purple-500/40 to-indigo-500/40 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-purple-500/30 [&::-webkit-slider-thumb]:cursor-pointer"
                />
                <span className="text-xs text-white/30 w-24">More Masculine</span>
              </div>
            </div>

            {/* Energy Slider */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-white/70">Energy</label>
                <span className="rounded-full bg-white/[0.08] px-3 py-0.5 text-xs font-medium text-white/50">
                  {energyLabel}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-white/30 w-24 text-right">Soft & Gentle</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={prefs.energy}
                  onChange={(e) => updatePref("energy", Number(e.target.value))}
                  className="flex-1 h-2 rounded-full appearance-none bg-gradient-to-r from-purple-500/30 to-rose-500/40 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-rose-500/30 [&::-webkit-slider-thumb]:cursor-pointer"
                />
                <span className="text-xs text-white/30 w-24">Bold & Intense</span>
              </div>
            </div>

            {/* Age Range */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-white/70">Age Range</label>
                <span className="rounded-full bg-white/[0.08] px-3 py-0.5 text-xs font-medium text-white/50">
                  {prefs.ageMin} – {prefs.ageMax}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-white/30">22</span>
                <div className="relative flex-1">
                  <input
                    type="range"
                    min={22}
                    max={55}
                    value={prefs.ageMin}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      if (v <= prefs.ageMax - 2) updatePref("ageMin", v);
                    }}
                    className="absolute inset-0 w-full h-2 rounded-full appearance-none bg-white/[0.06] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-rose-400 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-10"
                  />
                  <input
                    type="range"
                    min={22}
                    max={55}
                    value={prefs.ageMax}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      if (v >= prefs.ageMin + 2) updatePref("ageMax", v);
                    }}
                    className="absolute inset-0 w-full h-2 rounded-full appearance-none bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-400 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-10"
                  />
                  {/* Visual track fill */}
                  <div className="h-2 rounded-full bg-white/[0.06] pointer-events-none">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-rose-500/50 to-purple-500/50"
                      style={{
                        marginLeft: `${((prefs.ageMin - 22) / 33) * 100}%`,
                        width: `${((prefs.ageMax - prefs.ageMin) / 33) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <span className="text-xs text-white/30">55</span>
              </div>
            </div>

            {/* Style Pill Selector */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-3">Style</label>
              <PillSelector<StyleOption>
                options={["Casual", "Natural", "Luxury", "High-Fashion", "Streetwear", "Classic"]}
                value={prefs.style}
                onChange={(v) => v && updatePref("style", v)}
              />
            </div>

            {/* Divider */}
            <div className="border-t border-white/[0.06] pt-6">
              <p className="text-xs font-medium uppercase tracking-wider text-white/25 mb-4">
                Optional Preferences
              </p>

              {/* Hair Length */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-white/50 mb-2">
                  Hair Length
                  <span className="ml-2 text-xs text-white/20">(optional)</span>
                </label>
                <PillSelector<HairLength>
                  options={["Short", "Medium", "Long"]}
                  value={prefs.hairLength}
                  onChange={(v) => updatePref("hairLength", v)}
                  nullable
                />
              </div>

              {/* Hair Color */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-white/50 mb-2">
                  Hair Color
                  <span className="ml-2 text-xs text-white/20">(optional)</span>
                </label>
                <PillSelector<HairColor>
                  options={["Dark", "Light", "Red", "Mixed"]}
                  value={prefs.hairColor}
                  onChange={(v) => updatePref("hairColor", v)}
                  nullable
                />
              </div>

              {/* Facial Hair */}
              <div>
                <label className="block text-sm font-medium text-white/50 mb-2">
                  Facial Hair
                  <span className="ml-2 text-xs text-white/20">(optional)</span>
                </label>
                <PillSelector<FacialHair>
                  options={["None", "Stubble", "Beard"]}
                  value={prefs.facialHair}
                  onChange={(v) => updatePref("facialHair", v)}
                  nullable
                />
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* ══════════════════════════════════════════════════════
          SECTION 3: GENERATED SOULMATE PORTRAITS
          ══════════════════════════════════════════════════════ */}
      <div className="mb-12">
        <SectionHeading
          title="Soulmate Portraits"
          subtitle="Your visual soulmate interpretation generated from your profile and preferences."
        />

        {/* Generate Button */}
        {!generated && !generating && (
          <div className="flex flex-col items-center gap-3 mb-8">
            <button
              onClick={handleGenerate}
              className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-rose-600 to-purple-600 px-10 py-4 text-sm font-bold text-white shadow-2xl shadow-purple-500/20 transition-all hover:shadow-purple-500/40 hover:-translate-y-0.5 active:translate-y-0"
            >
              <span className="relative z-10">Generate Soulmate Visual</span>
              <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-purple-500 opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
            {genError && (
              <p className="text-sm text-rose-400/80 text-center max-w-md">{genError}</p>
            )}
          </div>
        )}

        {/* Portrait Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {portraits.map((portrait, i) => (
            <div key={portrait.label} className="flex flex-col">
              <GlassCard
                className={`overflow-hidden transition-all ${
                  generating ? "animate-pulse" : ""
                } ${portrait.border} border`}
              >
                {/* Portrait Area */}
                <div
                  className={`relative flex h-[400px] items-center justify-center bg-gradient-to-br ${portrait.gradient}`}
                >
                  {/* Noise texture overlay */}
                  <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                  }} />

                  {generating ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative">
                        <div className="h-12 w-12 rounded-full border-2 border-white/20 border-t-white/70 animate-spin" />
                      </div>
                      <p className="text-xs text-white/40 animate-pulse">
                        Generating {portrait.sublabel.toLowerCase()}...
                      </p>
                      <p className="text-[10px] text-white/20">This may take 15-30 seconds</p>
                    </div>
                  ) : generatedImages[i] ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={generatedImages[i]!}
                      alt={`${portrait.label} - Soulmate portrait`}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <svg
                        width="64"
                        height="64"
                        viewBox="0 0 64 64"
                        fill="none"
                        className="text-white/10"
                      >
                        <circle cx="32" cy="22" r="13" fill="currentColor" />
                        <ellipse cx="32" cy="56" rx="22" ry="15" fill="currentColor" />
                      </svg>
                      <p className="text-xs text-white/20">Portrait will generate here</p>
                    </div>
                  )}
                </div>

                {/* Card footer */}
                <div className="px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white/80">{portrait.label}</p>
                      <p className="text-[10px] text-white/30">{portrait.sublabel}</p>
                    </div>
                    {generatedImages[i] && (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/20">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l3 3 5-5" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Style notes (shown after generation) */}
                  {generatedImages[i] && (
                    <div className="mt-2 rounded-lg bg-white/[0.04] px-3 py-2">
                      <p className="text-[10px] leading-relaxed text-white/30">
                        {portrait.note}
                      </p>
                    </div>
                  )}
                </div>
              </GlassCard>
            </div>
          ))}
        </div>

        {/* Error message */}
        {genError && generated === false && !generating && (
          <div className="mt-6 rounded-xl border border-rose-500/20 bg-rose-500/5 px-6 py-4 text-center">
            <p className="text-sm text-rose-400/80">{genError}</p>
            <button
              onClick={handleGenerate}
              className="mt-3 rounded-lg bg-rose-500/20 px-4 py-2 text-xs font-medium text-rose-300 hover:bg-rose-500/30 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════
          SECTION 4: STYLE RATIONALE (after generation)
          ══════════════════════════════════════════════════════ */}
      {generated && (
        <div className="mb-12 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <SectionHeading
            title="Style Rationale"
            subtitle="Understanding the reasoning behind your soulmate visual interpretation."
          />

          {/* Why This Look */}
          <GlassCard className="p-6">
            <h3 className="text-sm font-bold text-white/80 mb-4">
              Why This Look Was Chosen
            </h3>
            <ul className="space-y-3">
              {styleRationale.map((reason, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gradient-to-r from-rose-400 to-purple-400" />
                  <p className="text-sm leading-relaxed text-white/40">{reason}</p>
                </li>
              ))}
            </ul>
          </GlassCard>

          {/* Emotional Tone */}
          <GlassCard className="p-6">
            <h3 className="text-sm font-bold text-white/80 mb-3">
              Emotional Tone
            </h3>
            <p className="text-sm leading-relaxed text-white/40">
              This portrait conveys openness, intelligence, and creative
              sensitivity. The expression suggests someone comfortable with
              silence and depth — a person whose presence feels both calming and
              intellectually stimulating. There is a quiet confidence that does
              not demand attention but naturally receives it.
            </p>
          </GlassCard>

          {/* Relationship Energy */}
          <GlassCard className="p-6">
            <h3 className="text-sm font-bold text-white/80 mb-3">
              Relationship Energy
            </h3>
            <p className="text-sm leading-relaxed text-white/40">
              Calm strength with creative spark — someone who challenges you to
              grow while providing safety. This energy pattern suggests a partner
              who can match your emotional depth without being overwhelmed by it,
              creating a dynamic where both individuals feel seen and supported
              in their authentic expression.
            </p>
          </GlassCard>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          SECTION 5: REGENERATION CONTROLS (after generation)
          ══════════════════════════════════════════════════════ */}
      {generated && (
        <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <SectionHeading
            title="Refine Your Visual"
            subtitle="Fine-tune the results or regenerate with different parameters."
          />

          <GlassCard className="p-6">
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={handleRegenerate}
                className="rounded-xl bg-gradient-to-r from-rose-600 to-purple-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-purple-500/15 transition-all hover:shadow-purple-500/30 hover:-translate-y-0.5"
              >
                Regenerate
              </button>
              <button
                onClick={() => setShowMoreOptions((v) => !v)}
                className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-6 py-2.5 text-sm font-medium text-white/60 transition-all hover:bg-white/[0.08] hover:text-white/80"
              >
                {showMoreOptions ? "Hide Options" : "Show More Options"}
              </button>
            </div>

            {/* Quick Adjustments */}
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-white/25 mb-3">
                Quick Adjustments
              </p>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    "More Soft",
                    "More Intense",
                    "Younger",
                    "Older",
                    "More Casual",
                    "More Luxury",
                  ] as QuickAdjust[]
                ).map((adj) => (
                  <button
                    key={adj}
                    onClick={() => handleQuickAdjust(adj)}
                    className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                      activeQuickAdjust === adj
                        ? "bg-purple-500/30 text-purple-300 border border-purple-500/30"
                        : "bg-white/[0.06] text-white/40 hover:bg-white/[0.10] hover:text-white/60 border border-transparent"
                    }`}
                  >
                    {adj}
                  </button>
                ))}
              </div>
            </div>

            {/* Extended Options (toggled) */}
            {showMoreOptions && (
              <div className="mt-6 border-t border-white/[0.06] pt-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <p className="text-sm text-white/50 mb-2">
                  Additional parameters for finer control over generation output.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-4">
                    <label className="block text-xs font-medium text-white/40 mb-2">
                      Background Setting
                    </label>
                    <PillSelector
                      options={["Studio", "Nature", "Urban", "Abstract"] as const}
                      value={"Studio" as string}
                      onChange={() => {}}
                    />
                  </div>
                  <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-4">
                    <label className="block text-xs font-medium text-white/40 mb-2">
                      Lighting Mood
                    </label>
                    <PillSelector
                      options={["Golden Hour", "Cool Blue", "Warm Indoor", "Dramatic"] as const}
                      value={"Golden Hour" as string}
                      onChange={() => {}}
                    />
                  </div>
                  <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-4">
                    <label className="block text-xs font-medium text-white/40 mb-2">
                      Expression
                    </label>
                    <PillSelector
                      options={["Gentle Smile", "Thoughtful", "Confident", "Mysterious"] as const}
                      value={"Gentle Smile" as string}
                      onChange={() => {}}
                    />
                  </div>
                  <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-4">
                    <label className="block text-xs font-medium text-white/40 mb-2">
                      Camera Angle
                    </label>
                    <PillSelector
                      options={["Portrait", "Three-Quarter", "Profile", "Cinematic"] as const}
                      value={"Portrait" as string}
                      onChange={() => {}}
                    />
                  </div>
                </div>
              </div>
            )}
          </GlassCard>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          SECTION 6: COMFYUI PIPELINE INFO
          ══════════════════════════════════════════════════════ */}
      <div className="mb-8">
        <button
          onClick={() => setShowPipeline((v) => !v)}
          className="flex w-full items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.03] px-6 py-4 text-left transition-all hover:bg-white/[0.05]"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="1" width="5" height="5" rx="1" stroke="#818cf8" strokeWidth="1.2" />
                <rect x="10" y="1" width="5" height="5" rx="1" stroke="#818cf8" strokeWidth="1.2" />
                <rect x="5.5" y="10" width="5" height="5" rx="1" stroke="#818cf8" strokeWidth="1.2" />
                <path d="M3.5 6v2.5a1 1 0 001 1h3" stroke="#818cf8" strokeWidth="1.2" />
                <path d="M12.5 6v2.5a1 1 0 01-1 1h-3" stroke="#818cf8" strokeWidth="1.2" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-white/70">Technical Pipeline</p>
              <p className="text-xs text-white/30">Powered by FLUX / SDXL via ComfyUI</p>
            </div>
          </div>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className={`text-white/30 transition-transform ${showPipeline ? "rotate-180" : ""}`}
          >
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {showPipeline && (
          <div className="mt-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <GlassCard className="p-6">
              <h3 className="text-sm font-bold text-white/70 mb-4">
                Generation Pipeline
              </h3>

              {/* Pipeline Steps */}
              <div className="flex flex-wrap items-center gap-2 mb-6">
                {pipelineSteps.map((step, i) => (
                  <div key={step} className="flex items-center gap-2">
                    <div className="rounded-lg bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5">
                      <p className="text-xs font-medium text-indigo-300/80">{step}</p>
                    </div>
                    {i < pipelineSteps.length - 1 && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-white/20 flex-shrink-0">
                        <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                ))}
              </div>

              {/* Details */}
              <div className="space-y-3 text-xs text-white/35 leading-relaxed">
                <p>
                  The generation pipeline begins by extracting visual attributes from
                  your compatibility report — zodiac characteristics, numerological
                  tendencies, and personality dimensions. These are translated into a
                  structured prompt optimized for cinematic portrait generation.
                </p>
                <p>
                  The prompt is processed through ComfyUI using either FLUX or SDXL
                  checkpoints, with specialized LoRA models for photorealistic face
                  detail. A secondary upscaling pass refines facial features, skin
                  texture, and lighting for maximum quality.
                </p>
                <p>
                  Each generation produces three variations: a primary interpretation
                  and two alternate stylings that explore different aspects of your
                  compatibility profile.
                </p>
              </div>

              {/* Tech Note */}
              <div className="mt-4 rounded-lg bg-amber-500/5 border border-amber-500/10 px-4 py-3">
                <p className="text-xs text-amber-400/60">
                  This is a symbolic visual interpretation, not a prediction of a
                  specific person. The generation system uses artistic AI models to
                  create conceptual imagery inspired by your personality profile.
                </p>
              </div>
            </GlassCard>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════
          SECTION 7: SAFETY DISCLAIMER
          ══════════════════════════════════════════════════════ */}
      <div className="mb-8">
        <GlassCard className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.06]">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-white/40">
                <path
                  d="M10 2L2 18h16L10 2z"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinejoin="round"
                />
                <path d="M10 8v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                <circle cx="10" cy="14.5" r="0.75" fill="currentColor" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white/70 mb-3">
                Important Disclaimer
              </h3>
              <div className="space-y-2.5">
                <p className="text-sm leading-relaxed text-white/35">
                  This image is a symbolic visual concept inspired by your
                  personality and compatibility profile. It is created to help
                  you explore and reflect on the qualities you value in a
                  partner.
                </p>
                <p className="text-sm leading-relaxed text-white/35">
                  It does not represent a real person or predict the exact
                  appearance of a future partner. Any resemblance to an actual
                  individual is purely coincidental and unintended.
                </p>
                <p className="text-sm leading-relaxed text-white/35">
                  No sensitive attributes are assumed unless explicitly provided
                  by you. All visual parameters are derived from your
                  self-reported preferences and the archetypal patterns in your
                  personality profile.
                </p>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Footer spacer for page bottom breathing room */}
      <div className="h-8" />
    </div>
  );
}
