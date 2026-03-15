"use client";

import { useState } from "react";

type CompatMode = "romantic" | "friendship" | "family" | "collaboration";

export default function CompatibilityPage() {
  const [mode, setMode] = useState<CompatMode>("romantic");
  const [step, setStep] = useState<"select" | "input" | "result">("select");

  const modes: { key: CompatMode; title: string; description: string; icon: string }[] = [
    { key: "romantic", title: "Romantic", description: "Deep dive into love, chemistry, and long-term potential", icon: "heart" },
    { key: "friendship", title: "Friendship", description: "Explore shared energy, loyalty, and growth alignment", icon: "users" },
    { key: "family", title: "Family", description: "Understand communication styles and bonding patterns", icon: "home" },
    { key: "collaboration", title: "Collaboration", description: "Assess work compatibility, strengths, and friction", icon: "briefcase" },
  ];

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold text-surface-900 mb-2">Compatibility</h1>
      <p className="text-surface-300 mb-8">Compare your profile with someone else to discover your compatibility across multiple dimensions.</p>

      {step === "select" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {modes.map((m) => (
            <button
              key={m.key}
              onClick={() => { setMode(m.key); setStep("input"); }}
              className={`rounded-xl bg-white p-6 text-left shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 border-2 ${
                mode === m.key ? "border-brand-500" : "border-transparent"
              }`}
            >
              <div className="text-lg font-semibold text-surface-900 mb-1">{m.title}</div>
              <p className="text-sm text-surface-300">{m.description}</p>
            </button>
          ))}
        </div>
      )}

      {step === "input" && (
        <div className="rounded-xl bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">
              {mode.charAt(0).toUpperCase() + mode.slice(1)} Compatibility
            </h2>
            <button onClick={() => setStep("select")} className="text-sm text-brand-600 hover:text-brand-700">
              Change mode
            </button>
          </div>

          <p className="text-sm text-surface-300 mb-6">Enter the other person's basic information to generate a compatibility report.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-surface-700">Your Profile</h3>
              <div className="rounded-lg bg-surface-50 p-4">
                <p className="text-sm font-medium">Alex Rivera</p>
                <p className="text-xs text-surface-300">Cancer Sun | Life Path 6</p>
                <p className="text-xs text-surface-300">Born: July 15, 1992</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-surface-700">Their Profile</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-surface-300 mb-1">First Name *</label>
                  <input className="w-full rounded-lg border border-surface-200 px-3 py-2 text-sm" placeholder="Their first name" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-surface-300 mb-1">Date of Birth *</label>
                  <input type="date" className="w-full rounded-lg border border-surface-200 px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-surface-300 mb-1">Birth Time (optional)</label>
                  <input type="time" className="w-full rounded-lg border border-surface-200 px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-surface-300 mb-1">Birth City *</label>
                  <input className="w-full rounded-lg border border-surface-200 px-3 py-2 text-sm" placeholder="City" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-surface-300 mb-1">Birth Country *</label>
                  <input className="w-full rounded-lg border border-surface-200 px-3 py-2 text-sm" placeholder="Country" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button onClick={() => setStep("select")} className="rounded-lg px-4 py-2 text-sm font-medium text-surface-700 hover:bg-surface-50 transition-colors">
              Back
            </button>
            <button className="rounded-lg bg-gradient-to-r from-brand-600 to-cosmic-600 px-6 py-2 text-sm font-medium text-white hover:from-brand-700 hover:to-cosmic-700 transition-all shadow-md">
              Generate Compatibility Report
            </button>
          </div>
        </div>
      )}

      {step === "result" && (
        <div className="text-center py-16">
          <p className="text-surface-300">Compatibility report will render here</p>
        </div>
      )}
    </div>
  );
}
