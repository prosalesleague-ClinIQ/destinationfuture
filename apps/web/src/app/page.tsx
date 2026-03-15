"use client";

import Link from "next/link";

const FEATURES = [
  {
    title: "Identity Snapshot",
    description: "Uncover your core personality traits, values, and psychological patterns through multi-system analysis.",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
    ),
  },
  {
    title: "Numerology",
    description: "Decode the hidden meaning in your birth date and name through life path, expression, and soul urge numbers.",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
      </svg>
    ),
  },
  {
    title: "Location Intelligence",
    description: "Find your ideal cities based on your personality, lifestyle, and astrological profile with astrocartography.",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
      </svg>
    ),
  },
  {
    title: "Compatibility",
    description: "Understand your relationship dynamics, soulmate timing, love languages, and potential red flags.",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
      </svg>
    ),
  },
  {
    title: "Growth & Shadow Work",
    description: "Dive deep into your unconscious patterns, triggers, and untapped potential for real transformation.",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
      </svg>
    ),
  },
  {
    title: "Future Forecast",
    description: "Get personalized 7-day, 30-day, and 3-year plans aligned with your cosmic timing and personal goals.",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
      </svg>
    ),
  },
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

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="card-hover group rounded-2xl border border-surface-200 bg-white p-8 shadow-sm"
            >
              <div className="mb-4 inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-cosmic-50 p-3 text-brand-600 transition-colors group-hover:from-brand-100 group-hover:to-cosmic-100">
                {feature.icon}
              </div>
              <h3 className="mb-2 text-xl font-semibold text-surface-900">{feature.title}</h3>
              <p className="text-surface-700 leading-relaxed">{feature.description}</p>
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
