"use client";

import Link from "next/link";

const FEATURES = [
  { title: "Identity Snapshot", description: "Uncover your core personality traits, values, and psychological patterns through multi-system analysis.", emoji: "🧬", gradient: "from-blue-500 to-indigo-600" },
  { title: "Numerology", description: "Decode the hidden meaning in your birth date and name through life path, expression, and soul urge numbers.", emoji: "🔢", gradient: "from-violet-500 to-purple-600" },
  { title: "Location Intelligence", description: "Find your ideal cities based on your personality, lifestyle, and astrological profile.", emoji: "🗺️", gradient: "from-cyan-500 to-blue-600" },
  { title: "Love & Compatibility", description: "Understand your relationship dynamics, soulmate timing, love languages, and potential red flags.", emoji: "💜", gradient: "from-pink-500 to-rose-600" },
  { title: "Growth & Shadow Work", description: "Dive deep into your unconscious patterns, triggers, and untapped potential for real transformation.", emoji: "🌑", gradient: "from-amber-500 to-orange-600" },
  { title: "Future Forecast", description: "Get personalized 7-day, 30-day, and 3-year plans aligned with your cosmic timing.", emoji: "🔮", gradient: "from-emerald-500 to-teal-600" },
  { title: "Style & Fashion", description: "Discover your style archetype, color palette, and capsule wardrobe tailored to your energy.", emoji: "👔", gradient: "from-fuchsia-500 to-pink-600" },
  { title: "Music & Frequency", description: "Curated playlists, brainwave frequency guide, and personalized music expansion.", emoji: "🎵", gradient: "from-green-500 to-emerald-600" },
];

const STEPS = [
  {
    step: "01",
    title: "Share Your Info",
    description: "Enter your name, birth details, and preferences. Your data stays private and encrypted.",
  },
  {
    step: "02",
    title: "Choose Your Focus",
    description: "Select a preset or customize which sections matter most to you right now.",
  },
  {
    step: "03",
    title: "Generate Insights",
    description: "Our AI synthesizes numerology, astrology, psychology, and location data into your report.",
  },
  {
    step: "04",
    title: "Grow & Level Up",
    description: "Complete quests, earn XP, unlock badges, and watch your personal growth unfold.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
        {/* Background gradient orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-brand-500/20 blur-3xl" />
          <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-cosmic-500/20 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-400/10 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700">
            <span className="inline-block h-2 w-2 rounded-full bg-brand-500 animate-pulse-slow" />
            Privacy-first insight platform
          </div>

          <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
            <span className="text-gradient">Destination</span>{" "}
            <span className="text-surface-900">Future</span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-surface-700 sm:text-xl md:text-2xl leading-relaxed">
            Discover who you are. Find where you thrive.{" "}
            <span className="font-semibold text-surface-900">Build what&apos;s next.</span>
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/onboarding"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-cosmic-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-brand-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-brand-500/30 hover:-translate-y-0.5"
            >
              Begin Your Journey
              <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl border border-surface-300 bg-white px-8 py-4 text-lg font-semibold text-surface-700 transition-all duration-200 hover:border-brand-300 hover:bg-brand-50"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to understand{" "}
            <span className="text-gradient">yourself</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-surface-700">
            Multi-dimensional insights powered by numerology, astrology, psychology, and AI — all in one place.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="card-hover group relative overflow-hidden rounded-2xl border border-surface-200 bg-white p-6 shadow-sm"
            >
              <div className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} text-2xl shadow-lg`}>
                {feature.emoji}
              </div>
              <h3 className="mb-2 text-lg font-bold text-surface-900">{feature.title}</h3>
              <p className="text-sm text-surface-700 leading-relaxed">{feature.description}</p>
              <div className={`absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-gradient-to-br ${feature.gradient} opacity-[0.07] transition-all duration-300 group-hover:opacity-[0.15] group-hover:scale-150`} />
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-surface-200 bg-white px-4 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              How it works
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-surface-700">
              From first visit to lasting transformation in four simple steps.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, index) => (
              <div key={step.step} className="relative">
                {index < STEPS.length - 1 && (
                  <div className="absolute left-1/2 top-12 hidden h-0.5 w-full bg-gradient-to-r from-brand-300 to-cosmic-300 lg:block" />
                )}
                <div className="relative flex flex-col items-center text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-cosmic-500 text-xl font-bold text-white shadow-lg shadow-brand-500/20">
                    {step.step}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-surface-900">{step.title}</h3>
                  <p className="text-sm text-surface-700 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-24">
        <div className="mx-auto max-w-3xl rounded-3xl bg-gradient-to-br from-brand-600 to-cosmic-600 px-8 py-16 text-center text-white shadow-2xl shadow-brand-500/20">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Ready to discover your future?</h2>
          <p className="mx-auto mb-8 max-w-xl text-lg text-white/80">
            Join thousands already using Destination Future to unlock deeper self-understanding and build a life aligned with who they truly are.
          </p>
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-lg font-semibold text-brand-700 shadow-lg transition-all duration-200 hover:bg-brand-50 hover:-translate-y-0.5"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-200 bg-white px-4 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-surface-700">Destination Future. Privacy-first, always.</p>
          <div className="flex gap-6 text-sm text-surface-700">
            <a href="#" className="hover:text-brand-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-brand-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-brand-600 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
