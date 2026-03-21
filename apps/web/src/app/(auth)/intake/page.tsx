"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { db } from "@/lib/db";

const US_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut",
  "Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa",
  "Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan",
  "Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire",
  "New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio",
  "Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota",
  "Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia",
  "Wisconsin","Wyoming",
];

export default function IntakePage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nickname, setNickname] = useState("");
  const [birthday, setBirthday] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthCity, setBirthCity] = useState("");
  const [birthState, setBirthState] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const inputClass =
    "w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-indigo-500/40 focus:bg-white/[0.06] transition-all";

  useEffect(() => {
    (async () => {
      const user = await db.getCurrentUser();
      if (!user) {
        router.replace("/login");
        return;
      }
      const intakeDone = await db.isIntakeComplete();
      if (intakeDone) {
        router.replace("/dashboard");
        return;
      }
      setUserId(user.id);
    })();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!firstName.trim()) { setError("First name is required"); return; }
    if (!lastName.trim()) { setError("Last name is required"); return; }
    if (!birthday) { setError("Birthday is required"); return; }
    if (!birthCity.trim()) { setError("Birth city is required"); return; }
    if (!birthState) { setError("Birth state is required"); return; }
    if (!userId) { setError("Session expired. Please sign in again."); return; }

    setLoading(true);
    const result = await db.completeIntake(userId, {
      firstName: firstName.trim(),
      middleName: middleName.trim() || undefined,
      lastName: lastName.trim(),
      nickname: nickname.trim() || undefined,
      birthday,
      birthTime: birthTime || undefined,
      birthCity: birthCity.trim(),
      birthState,
    });
    setLoading(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    router.push("/dashboard");
  };

  if (!userId) return null;

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#0a0e27] px-4 py-12">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-purple-500/10 blur-[120px]" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-indigo-500/10 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {/* Header */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
              </svg>
            </div>
            <span
              className="text-xl font-bold bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, #818cf8, #a78bfa, #c084fc)" }}
            >
              Destination Future
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Tell us about yourself</h1>
          <p className="mt-1 text-white/50">We need a few details to build your personalized portal.</p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl p-8">
          {error && (
            <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="pb-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3">Your Name</h3>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-white/70 mb-1.5">
                    First <span className="text-red-400">*</span>
                  </label>
                  <input id="firstName" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)}
                    className={inputClass} placeholder="First" autoComplete="given-name" />
                </div>
                <div>
                  <label htmlFor="middleName" className="block text-sm font-medium text-white/70 mb-1.5">Middle</label>
                  <input id="middleName" type="text" value={middleName} onChange={(e) => setMiddleName(e.target.value)}
                    className={inputClass} placeholder="Middle" autoComplete="additional-name" />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-white/70 mb-1.5">
                    Last <span className="text-red-400">*</span>
                  </label>
                  <input id="lastName" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}
                    className={inputClass} placeholder="Last" autoComplete="family-name" />
                </div>
              </div>
              <div className="mt-3">
                <label htmlFor="nickname" className="block text-sm font-medium text-white/70 mb-1.5">Nickname / Display Name</label>
                <input id="nickname" type="text" value={nickname} onChange={(e) => setNickname(e.target.value)}
                  className={inputClass} placeholder="What should we call you?" autoComplete="nickname" />
              </div>
            </div>

            <div className="border-t border-white/[0.06]" />

            {/* Birth Details */}
            <div className="pb-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-1">Birth Details</h3>
              <p className="text-xs text-white/30 mb-3">Used for numerology, astrology, and personalized insights.</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="birthday" className="block text-sm font-medium text-white/70 mb-1.5">
                    Birthday <span className="text-red-400">*</span>
                  </label>
                  <input id="birthday" type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)}
                    className={`${inputClass} [color-scheme:dark]`} />
                </div>
                <div>
                  <label htmlFor="birthTime" className="block text-sm font-medium text-white/70 mb-1.5">Birth Time</label>
                  <input id="birthTime" type="time" value={birthTime} onChange={(e) => setBirthTime(e.target.value)}
                    className={`${inputClass} [color-scheme:dark]`} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div>
                  <label htmlFor="birthCity" className="block text-sm font-medium text-white/70 mb-1.5">
                    City Born <span className="text-red-400">*</span>
                  </label>
                  <input id="birthCity" type="text" value={birthCity} onChange={(e) => setBirthCity(e.target.value)}
                    className={inputClass} placeholder="e.g. Los Angeles" />
                </div>
                <div>
                  <label htmlFor="birthState" className="block text-sm font-medium text-white/70 mb-1.5">
                    State Born <span className="text-red-400">*</span>
                  </label>
                  <select id="birthState" value={birthState} onChange={(e) => setBirthState(e.target.value)}
                    className={`${inputClass} ${!birthState ? "text-white/30" : ""}`}>
                    <option value="" className="bg-[#0d1230]">Select state</option>
                    {US_STATES.map((s) => (
                      <option key={s} value={s} className="bg-[#0d1230] text-white">{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:shadow-indigo-500/30 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Building your portal..." : "Launch My Portal"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
