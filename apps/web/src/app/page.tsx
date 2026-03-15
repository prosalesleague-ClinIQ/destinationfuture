"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import CinematicDashboardShell from "@/components/cinematic/cinematic-dashboard-shell";

const FEATURES = [
  {
    title: "Identity Snapshot",
    description:
      "Uncover your core personality traits, values, and psychological patterns through multi-system analysis.",
    emoji: "\uD83E\uDDEC",
    gradient: "from-blue-500 to-indigo-600",
    glow: "shadow-blue-500/20",
  },
  {
    title: "Numerology",
    description:
      "Decode the hidden meaning in your birth date and name through life path, expression, and soul urge numbers.",
    emoji: "\uD83D\uDD22",
    gradient: "from-violet-500 to-purple-600",
    glow: "shadow-violet-500/20",
  },
  {
    title: "Location Intelligence",
    description:
      "Find your ideal cities based on your personality, lifestyle, and astrological profile.",
    emoji: "\uD83D\uDDFA\uFE0F",
    gradient: "from-cyan-500 to-blue-600",
    glow: "shadow-cyan-500/20",
  },
  {
    title: "Love & Compatibility",
    description:
      "Understand your relationship dynamics, soulmate timing, love languages, and potential red flags.",
    emoji: "\uD83D\uDC9C",
    gradient: "from-pink-500 to-rose-600",
    glow: "shadow-pink-500/20",
  },
  {
    title: "Growth & Shadow Work",
    description:
      "Dive deep into your unconscious patterns, triggers, and untapped potential for real transformation.",
    emoji: "\uD83C\uDF11",
    gradient: "from-amber-500 to-orange-600",
    glow: "shadow-amber-500/20",
  },
  {
    title: "Future Forecast",
    description:
      "Get personalized 7-day, 30-day, and 3-year plans aligned with your cosmic timing.",
    emoji: "\uD83D\uDD2E",
    gradient: "from-emerald-500 to-teal-600",
    glow: "shadow-emerald-500/20",
  },
  {
    title: "Style & Fashion",
    description:
      "Discover your style archetype, color palette, and capsule wardrobe tailored to your energy.",
    emoji: "\uD83D\uDC54",
    gradient: "from-fuchsia-500 to-pink-600",
    glow: "shadow-fuchsia-500/20",
  },
  {
    title: "Music & Frequency",
    description:
      "Curated playlists, brainwave frequency guide, and personalized music expansion.",
    emoji: "\uD83C\uDFB5",
    gradient: "from-green-500 to-emerald-600",
    glow: "shadow-green-500/20",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Share Your Info",
    description:
      "Enter your name, birth details, and preferences. Your data stays private and encrypted.",
  },
  {
    step: "02",
    title: "Choose Your Focus",
    description:
      "Select a preset or customize which sections matter most to you right now.",
  },
  {
    step: "03",
    title: "Generate Insights",
    description:
      "Our AI synthesizes numerology, astrology, psychology, and location data into your report.",
  },
  {
    step: "04",
    title: "Grow & Level Up",
    description:
      "Complete quests, earn XP, unlock badges, and watch your personal growth unfold.",
  },
];

// ---------------------------------------------------------------------------
// Intro Sequence Component
// ---------------------------------------------------------------------------

function IntroSequence({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<
    "globe" | "touch" | "city" | "zoom" | "whitewash" | "title" | "done"
  >("globe");

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    // Globe spinning — 2s
    timers.push(setTimeout(() => setPhase("touch"), 2000));
    // Touch pulse — 1.5s
    timers.push(setTimeout(() => setPhase("city"), 3500));
    // City reveal (Paris) — 2s
    timers.push(setTimeout(() => setPhase("zoom"), 5500));
    // Zoom into globe — 1.5s
    timers.push(setTimeout(() => setPhase("whitewash"), 7000));
    // White wash — 1s
    timers.push(setTimeout(() => setPhase("title"), 8000));
    // Title reveal — 2.5s then done
    timers.push(setTimeout(() => setPhase("done"), 10500));

    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (phase === "done") onComplete();
  }, [phase, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0e27] overflow-hidden">
      {/* Skip button */}
      <button
        onClick={onComplete}
        className="absolute top-6 right-6 z-[60] text-white/40 hover:text-white/80 text-sm font-medium tracking-wide transition-colors duration-300"
      >
        Skip Intro &rarr;
      </button>

      {/* Stars background */}
      <div className="absolute inset-0">
        {Array.from({ length: 60 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.4 + 0.1,
              animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Globe */}
      <div
        className="relative transition-all duration-[1500ms] ease-in-out"
        style={{
          transform:
            phase === "zoom"
              ? "scale(8)"
              : phase === "whitewash" || phase === "title" || phase === "done"
                ? "scale(12)"
                : "scale(1)",
          opacity:
            phase === "whitewash" || phase === "title" || phase === "done"
              ? 0
              : 1,
        }}
      >
        {/* Globe sphere */}
        <div
          className="relative w-64 h-64 rounded-full border border-indigo-400/30 overflow-hidden"
          style={{
            background:
              "radial-gradient(circle at 35% 35%, rgba(99,102,241,0.15), rgba(10,14,39,0.9) 70%)",
            boxShadow:
              "0 0 80px rgba(99,102,241,0.15), inset 0 0 60px rgba(99,102,241,0.08)",
          }}
        >
          {/* Grid lines */}
          <div className="absolute inset-0" style={{ opacity: 0.15 }}>
            {/* Horizontal lines */}
            {[20, 40, 60, 80].map((top) => (
              <div
                key={`h-${top}`}
                className="absolute w-full border-t border-indigo-300/50"
                style={{ top: `${top}%` }}
              />
            ))}
            {/* Vertical arcs (simplified) */}
            {[25, 50, 75].map((left) => (
              <div
                key={`v-${left}`}
                className="absolute h-full border-l border-indigo-300/40"
                style={{
                  left: `${left}%`,
                  borderRadius: "50%",
                }}
              />
            ))}
          </div>

          {/* Spinning highlight */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0%, rgba(99,102,241,0.08) 25%, transparent 50%)",
              animation: "spin 8s linear infinite",
            }}
          />

          {/* City dot — Paris */}
          <div
            className="absolute transition-all duration-700"
            style={{
              left: "52%",
              top: "28%",
              opacity: phase === "city" || phase === "zoom" ? 1 : 0,
              transform:
                phase === "city" || phase === "zoom"
                  ? "scale(1)"
                  : "scale(0)",
            }}
          >
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-ping absolute" />
              <div className="w-2 h-2 rounded-full bg-white" />
              <span
                className="absolute left-4 -top-1 text-xs text-white/80 font-light tracking-wider whitespace-nowrap"
                style={{
                  textShadow: "0 0 10px rgba(99,102,241,0.8)",
                }}
              >
                Paris
              </span>
            </div>
          </div>
        </div>

        {/* Touch ripple */}
        {(phase === "touch" || phase === "city") && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="w-16 h-16 rounded-full border border-indigo-400/40"
              style={{
                animation: "ripple 1.5s ease-out forwards",
              }}
            />
            <div
              className="absolute w-16 h-16 rounded-full border border-indigo-400/20"
              style={{
                animation: "ripple 1.5s ease-out 0.3s forwards",
              }}
            />
          </div>
        )}
      </div>

      {/* White wash overlay */}
      <div
        className="absolute inset-0 bg-white transition-opacity duration-700 pointer-events-none"
        style={{
          opacity:
            phase === "whitewash"
              ? 0.9
              : phase === "title"
                ? 0
                : 0,
        }}
      />

      {/* Title reveal */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-opacity duration-1000"
        style={{
          opacity: phase === "title" ? 1 : 0,
        }}
      >
        <h1
          className="text-6xl md:text-8xl font-bold tracking-tight"
          style={{
            background:
              "linear-gradient(135deg, #818cf8, #a78bfa, #c084fc)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation:
              phase === "title"
                ? "fadeSlideUp 1.2s ease-out forwards"
                : "none",
          }}
        >
          Destination
        </h1>
        <h1
          className="text-6xl md:text-8xl font-bold tracking-tight text-white/90"
          style={{
            animation:
              phase === "title"
                ? "fadeSlideUp 1.2s ease-out 0.3s both"
                : "none",
          }}
        >
          Future
        </h1>
        <p
          className="mt-6 text-lg text-white/40 font-light tracking-[0.25em] uppercase"
          style={{
            animation:
              phase === "title"
                ? "fadeSlideUp 1s ease-out 0.8s both"
                : "none",
          }}
        >
          Your journey begins
        </p>
      </div>

      {/* Inline keyframes */}
      <style jsx>{`
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.1;
          }
          50% {
            opacity: 0.6;
          }
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes ripple {
          0% {
            transform: scale(0.5);
            opacity: 1;
          }
          100% {
            transform: scale(4);
            opacity: 0;
          }
        }
        @keyframes fadeSlideUp {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Landing Page
// ---------------------------------------------------------------------------

export default function LandingPage() {
  const [showIntro, setShowIntro] = useState(false);
  const [introComplete, setIntroComplete] = useState(true); // default true to avoid flash
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const seen = localStorage.getItem("df-intro-seen");
    if (!seen) {
      setShowIntro(true);
      setIntroComplete(false);
    }
  }, []);

  const handleIntroComplete = () => {
    setIntroComplete(true);
    setShowIntro(false);
    localStorage.setItem("df-intro-seen", "1");
  };

  if (!mounted) return null;

  return (
    <>
      {/* Intro overlay */}
      {showIntro && !introComplete && (
        <IntroSequence onComplete={handleIntroComplete} />
      )}

      {/* Main landing page with cinematic shell */}
      <div
        className="transition-opacity duration-1000"
        style={{ opacity: introComplete ? 1 : 0 }}
      >
        <CinematicDashboardShell>
          <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
              {/* Nebula / Galaxy / Astro Background */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                {/* Deep nebula clouds */}
                <div className="absolute -left-[20%] -top-[10%] h-[600px] w-[800px] rounded-full opacity-30 blur-[120px]"
                  style={{ background: "radial-gradient(ellipse, rgba(88,28,135,0.6), rgba(49,46,129,0.3), transparent 70%)" }} />
                <div className="absolute -right-[15%] top-[20%] h-[500px] w-[700px] rounded-full opacity-25 blur-[100px]"
                  style={{ background: "radial-gradient(ellipse, rgba(79,70,229,0.5), rgba(139,92,246,0.2), transparent 70%)" }} />
                <div className="absolute left-[10%] bottom-[5%] h-[400px] w-[600px] rounded-full opacity-20 blur-[110px]"
                  style={{ background: "radial-gradient(ellipse, rgba(14,165,233,0.4), rgba(59,130,246,0.15), transparent 70%)" }} />
                <div className="absolute right-[5%] -bottom-[10%] h-[500px] w-[500px] rounded-full opacity-15 blur-[130px]"
                  style={{ background: "radial-gradient(ellipse, rgba(236,72,153,0.3), rgba(168,85,247,0.15), transparent 70%)" }} />
                {/* Central galaxy core glow */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full opacity-10 blur-[80px]"
                  style={{ background: "radial-gradient(circle, rgba(255,255,255,0.3), rgba(129,140,248,0.1), transparent 60%)" }} />

                {/* Zodiac constellation lines */}
                <svg className="absolute inset-0 w-full h-full opacity-[0.04]" viewBox="0 0 1200 800">
                  {/* Aries constellation */}
                  <line x1="100" y1="200" x2="130" y2="180" stroke="white" strokeWidth="1" />
                  <line x1="130" y1="180" x2="160" y2="190" stroke="white" strokeWidth="1" />
                  <line x1="160" y1="190" x2="180" y2="170" stroke="white" strokeWidth="1" />
                  <circle cx="100" cy="200" r="2" fill="white" />
                  <circle cx="130" cy="180" r="2.5" fill="white" />
                  <circle cx="160" cy="190" r="2" fill="white" />
                  <circle cx="180" cy="170" r="3" fill="white" />
                  {/* Leo constellation */}
                  <line x1="800" y1="150" x2="830" y2="130" stroke="white" strokeWidth="1" />
                  <line x1="830" y1="130" x2="870" y2="140" stroke="white" strokeWidth="1" />
                  <line x1="870" y1="140" x2="890" y2="120" stroke="white" strokeWidth="1" />
                  <line x1="890" y1="120" x2="920" y2="135" stroke="white" strokeWidth="1" />
                  <line x1="870" y1="140" x2="860" y2="170" stroke="white" strokeWidth="1" />
                  <circle cx="800" cy="150" r="2" fill="white" />
                  <circle cx="830" cy="130" r="2.5" fill="white" />
                  <circle cx="870" cy="140" r="3" fill="white" />
                  <circle cx="890" cy="120" r="2" fill="white" />
                  <circle cx="920" cy="135" r="2.5" fill="white" />
                  <circle cx="860" cy="170" r="2" fill="white" />
                  {/* Scorpio constellation */}
                  <line x1="400" y1="600" x2="430" y2="610" stroke="white" strokeWidth="1" />
                  <line x1="430" y1="610" x2="460" y2="590" stroke="white" strokeWidth="1" />
                  <line x1="460" y1="590" x2="490" y2="605" stroke="white" strokeWidth="1" />
                  <line x1="490" y1="605" x2="510" y2="620" stroke="white" strokeWidth="1" />
                  <line x1="510" y1="620" x2="530" y2="610" stroke="white" strokeWidth="1" />
                  <line x1="530" y1="610" x2="540" y2="590" stroke="white" strokeWidth="1" />
                  <circle cx="400" cy="600" r="2.5" fill="white" />
                  <circle cx="430" cy="610" r="2" fill="white" />
                  <circle cx="460" cy="590" r="3" fill="white" />
                  <circle cx="490" cy="605" r="2" fill="white" />
                  <circle cx="510" cy="620" r="2.5" fill="white" />
                  <circle cx="530" cy="610" r="2" fill="white" />
                  <circle cx="540" cy="590" r="2.5" fill="white" />
                  {/* Pisces constellation */}
                  <line x1="950" y1="500" x2="980" y2="490" stroke="white" strokeWidth="1" />
                  <line x1="980" y1="490" x2="1010" y2="510" stroke="white" strokeWidth="1" />
                  <line x1="1010" y1="510" x2="1040" y2="500" stroke="white" strokeWidth="1" />
                  <line x1="1040" y1="500" x2="1070" y2="520" stroke="white" strokeWidth="1" />
                  <circle cx="950" cy="500" r="2" fill="white" />
                  <circle cx="980" cy="490" r="2.5" fill="white" />
                  <circle cx="1010" cy="510" r="3" fill="white" />
                  <circle cx="1040" cy="500" r="2" fill="white" />
                  <circle cx="1070" cy="520" r="2.5" fill="white" />
                </svg>

                {/* Scattered stars — different sizes and brightnesses */}
                {Array.from({ length: 80 }).map((_, i) => (
                  <div
                    key={`star-${i}`}
                    className="absolute rounded-full bg-white"
                    style={{
                      width: `${Math.random() < 0.1 ? 3 : Math.random() < 0.3 ? 2 : 1}px`,
                      height: `${Math.random() < 0.1 ? 3 : Math.random() < 0.3 ? 2 : 1}px`,
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      opacity: Math.random() * 0.5 + 0.1,
                      animation: `twinkle ${Math.random() * 4 + 3}s ease-in-out infinite`,
                      animationDelay: `${Math.random() * 5}s`,
                      boxShadow: Math.random() < 0.15 ? '0 0 6px 1px rgba(255,255,255,0.4)' : 'none',
                    }}
                  />
                ))}

                {/* Floating zodiac glyphs */}
                {['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'].map((glyph, i) => (
                  <div
                    key={`glyph-${i}`}
                    className="absolute text-white/[0.04] select-none"
                    style={{
                      fontSize: `${Math.random() * 20 + 16}px`,
                      left: `${(i * 8.3) + Math.random() * 5}%`,
                      top: `${Math.random() * 90}%`,
                      animation: `float ${Math.random() * 20 + 30}s linear infinite`,
                      animationDelay: `${Math.random() * 10}s`,
                    }}
                  >
                    {glyph}
                  </div>
                ))}
              </div>

              {/* Inline keyframes for hero */}
              <style jsx>{`
                @keyframes twinkle {
                  0%, 100% { opacity: 0.1; }
                  50% { opacity: 0.7; }
                }
                @keyframes float {
                  0% { transform: translateY(0) rotate(0deg); opacity: 0.03; }
                  25% { opacity: 0.06; }
                  50% { transform: translateY(-30px) rotate(5deg); opacity: 0.04; }
                  75% { opacity: 0.05; }
                  100% { transform: translateY(0) rotate(0deg); opacity: 0.03; }
                }
              `}</style>

              <div className="relative z-10 mx-auto max-w-4xl text-center">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-300">
                  <span className="inline-block h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
                  Privacy-first insight platform
                </div>

                <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
                  <span
                    className="bg-clip-text text-transparent"
                    style={{
                      backgroundImage:
                        "linear-gradient(135deg, #818cf8, #a78bfa, #c084fc)",
                    }}
                  >
                    Destination
                  </span>{" "}
                  <span className="text-white/90">Future</span>
                </h1>

                <p className="mx-auto mb-10 max-w-2xl text-lg text-white/60 sm:text-xl md:text-2xl leading-relaxed">
                  Discover who you are. Find where you thrive.{" "}
                  <span className="font-semibold text-white/90">
                    Build what&apos;s next.
                  </span>
                </p>

                <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                  <Link
                    href="/onboarding"
                    className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5"
                  >
                    Begin Your Journey
                    <svg
                      className="h-5 w-5 transition-transform group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </Link>
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm px-8 py-4 text-lg font-semibold text-white/80 transition-all duration-200 hover:border-indigo-400/30 hover:bg-white/10"
                  >
                    View Dashboard
                  </Link>
                </div>
              </div>
            </section>

            {/* Features Grid */}
            <section className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
              <div className="mb-16 text-center">
                <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl text-white/90">
                  Everything you need to understand{" "}
                  <span
                    className="bg-clip-text text-transparent"
                    style={{
                      backgroundImage:
                        "linear-gradient(135deg, #818cf8, #a78bfa, #c084fc)",
                    }}
                  >
                    yourself
                  </span>
                </h2>
                <p className="mx-auto max-w-2xl text-lg text-white/50">
                  Multi-dimensional insights powered by numerology, astrology,
                  psychology, and AI — all in one place.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {FEATURES.map((feature) => (
                  <div
                    key={feature.title}
                    className={`group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm p-6 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.06] hover:shadow-lg ${feature.glow}`}
                  >
                    <div
                      className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} text-2xl shadow-lg`}
                    >
                      {feature.emoji}
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-white/90">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-white/50 leading-relaxed">
                      {feature.description}
                    </p>
                    <div
                      className={`absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-gradient-to-br ${feature.gradient} opacity-[0.04] transition-all duration-300 group-hover:opacity-[0.1] group-hover:scale-150`}
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* How It Works */}
            <section className="border-t border-white/[0.06] px-4 py-24">
              <div className="mx-auto max-w-5xl">
                <div className="mb-16 text-center">
                  <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl text-white/90">
                    How it works
                  </h2>
                  <p className="mx-auto max-w-2xl text-lg text-white/50">
                    From first visit to lasting transformation in four simple
                    steps.
                  </p>
                </div>

                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                  {STEPS.map((step, index) => (
                    <div key={step.step} className="relative">
                      {index < STEPS.length - 1 && (
                        <div className="absolute left-1/2 top-12 hidden h-px w-full bg-gradient-to-r from-indigo-500/30 to-purple-500/30 lg:block" />
                      )}
                      <div className="relative flex flex-col items-center text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-xl font-bold text-white shadow-lg shadow-indigo-500/20">
                          {step.step}
                        </div>
                        <h3 className="mb-2 text-lg font-semibold text-white/90">
                          {step.title}
                        </h3>
                        <p className="text-sm text-white/50 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* CTA */}
            <section className="px-4 py-24">
              <div
                className="mx-auto max-w-3xl rounded-3xl px-8 py-16 text-center text-white shadow-2xl shadow-indigo-500/10 border border-white/[0.06]"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.15))",
                }}
              >
                <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
                  Ready to discover your future?
                </h2>
                <p className="mx-auto mb-8 max-w-xl text-lg text-white/60">
                  Join thousands already using Destination Future to unlock
                  deeper self-understanding and build a life aligned with who
                  they truly are.
                </p>
                <Link
                  href="/onboarding"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5"
                >
                  Get Started Free
                </Link>
              </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/[0.06] px-4 py-8">
              <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
                <p className="text-sm text-white/40">
                  Destination Future. Privacy-first, always.
                </p>
                <div className="flex gap-6 text-sm text-white/40">
                  <a
                    href="#"
                    className="hover:text-indigo-400 transition-colors"
                  >
                    Privacy Policy
                  </a>
                  <a
                    href="#"
                    className="hover:text-indigo-400 transition-colors"
                  >
                    Terms of Service
                  </a>
                  <a
                    href="#"
                    className="hover:text-indigo-400 transition-colors"
                  >
                    Contact
                  </a>
                </div>
              </div>
            </footer>
          </div>
        </CinematicDashboardShell>
      </div>
    </>
  );
}
