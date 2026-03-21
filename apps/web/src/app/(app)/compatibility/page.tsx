"use client";

import { useState, useEffect } from "react";
import { db, type UserProfile } from "@/lib/db";
import { calculateLifePath } from "@destination-future/core";
import { getSunSign } from "@destination-future/core";

type CompatMode = "romantic" | "friendship" | "family" | "collaboration";

export default function CompatibilityPage() {
  const [mode, setMode] = useState<CompatMode>("romantic");
  const [step, setStep] = useState<"select" | "input" | "result">("select");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.getProfile().then((p) => {
      setProfile(p);
      setLoading(false);
    });
  }, []);

  const sunSign = profile?.birthday
    ? getSunSign(new Date(profile.birthday + "T00:00:00")).name
    : null;

  const lifePath = profile?.birthday
    ? calculateLifePath(new Date(profile.birthday + "T00:00:00")).value
    : null;

  const displayName = profile
    ? [profile.firstName, profile.lastName].filter(Boolean).join(" ") || "You"
    : null;

  const formattedBirthday = profile?.birthday
    ? new Date(profile.birthday + "T00:00:00").toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const modes: { key: CompatMode; title: string; description: string; icon: string }[] = [
    { key: "romantic", title: "Romantic", description: "Deep dive into love, chemistry, and long-term potential", icon: "heart" },
    { key: "friendship", title: "Friendship", description: "Explore shared energy, loyalty, and growth alignment", icon: "users" },
    { key: "family", title: "Family", description: "Understand communication styles and bonding patterns", icon: "home" },
    { key: "collaboration", title: "Collaboration", description: "Assess work compatibility, strengths, and friction", icon: "briefcase" },
  ];

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl font-bold text-white/90 mb-2">Compatibility</h1>
        <p className="text-white/30 mb-8">Loading your profile...</p>
      </div>
    );
  }

  if (!profile || !profile.intakeComplete) {
    return (
      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl font-bold text-white/90 mb-2">Compatibility</h1>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.04] p-8 text-center">
          <p className="text-white/50 mb-4">
            Please complete your intake profile before using compatibility features.
          </p>
          <a
            href="/intake"
            className="inline-block rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-2 text-sm font-medium text-white hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-black/20"
          >
            Complete Your Profile
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold text-white/90 mb-2">Compatibility</h1>
      <p className="text-white/30 mb-8">Compare your profile with someone else to discover your compatibility across multiple dimensions.</p>

      {step === "select" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {modes.map((m) => (
            <button
              key={m.key}
              onClick={() => { setMode(m.key); setStep("input"); }}
              className={`rounded-xl bg-white/[0.04] p-6 text-left transition-all hover:bg-white/[0.06] hover:-translate-y-0.5 border-2 ${
                mode === m.key ? "border-indigo-500" : "border-white/[0.06]"
              }`}
            >
              <div className="text-lg font-semibold text-white/90 mb-1">{m.title}</div>
              <p className="text-sm text-white/30">{m.description}</p>
            </button>
          ))}
        </div>
      )}

      {step === "input" && (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.04] p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white/90">
              {mode.charAt(0).toUpperCase() + mode.slice(1)} Compatibility
            </h2>
            <button onClick={() => setStep("select")} className="text-sm text-indigo-400 hover:text-indigo-300">
              Change mode
            </button>
          </div>

          <p className="text-sm text-white/30 mb-6">Enter the other person's basic information to generate a compatibility report.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-white/50">Your Profile</h3>
              <div className="rounded-lg bg-white/[0.06] p-4">
                <p className="text-sm font-medium text-white/90">{displayName}</p>
                <p className="text-xs text-white/30">
                  {sunSign ? `${sunSign} Sun` : "Unknown Sun"} | Life Path {lifePath ?? "?"}
                </p>
                {formattedBirthday && (
                  <p className="text-xs text-white/30">Born: {formattedBirthday}</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-white/50">Their Profile</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-white/30 mb-1">First Name *</label>
                  <input className="w-full rounded-lg border border-white/[0.08] bg-white/[0.06] px-3 py-2 text-sm text-white placeholder:text-white/20" placeholder="Their first name" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/30 mb-1">Date of Birth *</label>
                  <input type="date" className="w-full rounded-lg border border-white/[0.08] bg-white/[0.06] px-3 py-2 text-sm text-white" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/30 mb-1">Birth Time (optional)</label>
                  <input type="time" className="w-full rounded-lg border border-white/[0.08] bg-white/[0.06] px-3 py-2 text-sm text-white" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/30 mb-1">Birth City *</label>
                  <input className="w-full rounded-lg border border-white/[0.08] bg-white/[0.06] px-3 py-2 text-sm text-white placeholder:text-white/20" placeholder="City" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/30 mb-1">Birth Country *</label>
                  <input className="w-full rounded-lg border border-white/[0.08] bg-white/[0.06] px-3 py-2 text-sm text-white placeholder:text-white/20" placeholder="Country" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button onClick={() => setStep("select")} className="rounded-lg px-4 py-2 text-sm font-medium text-white/50 hover:bg-white/[0.04] transition-colors">
              Back
            </button>
            <button className="rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-2 text-sm font-medium text-white hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-black/20">
              Generate Compatibility Report
            </button>
          </div>
        </div>
      )}

      {step === "result" && (
        <div className="text-center py-16">
          <p className="text-white/30">Compatibility report will render here</p>
        </div>
      )}
    </div>
  );
}
