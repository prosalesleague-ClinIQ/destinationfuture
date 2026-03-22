"use client";

import { useState, useEffect } from "react";
import { db, type UserProfile } from "@/lib/db";

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

const inputClass =
  "w-full rounded-lg border border-white/[0.08] bg-white/[0.06] px-3 py-2 text-sm text-white placeholder:text-white/20";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "preferences" | "privacy" | "subscription" | "data">("profile");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [email, setEmail] = useState("");

  // Profile fields
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nickname, setNickname] = useState("");

  // Birth fields
  const [birthday, setBirthday] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthCity, setBirthCity] = useState("");
  const [birthState, setBirthState] = useState("");

  const [saving, setSaving] = useState(false);
  const [savingBirth, setSavingBirth] = useState(false);
  const [message, setMessage] = useState("");
  const [birthMessage, setBirthMessage] = useState("");

  useEffect(() => {
    (async () => {
      const user = await db.getCurrentUser();
      if (user) setEmail(user.email);

      const p = await db.getProfile();
      if (p) {
        setProfile(p);
        setFirstName(p.firstName || "");
        setMiddleName(p.middleName || "");
        setLastName(p.lastName || "");
        setNickname(p.nickname || "");
        setBirthday(p.birthday || "");
        setBirthTime(p.birthTime || "");
        setBirthCity(p.birthCity || "");
        setBirthState(p.birthState || "");
      }
    })();
  }, []);

  const handleSaveProfile = async () => {
    if (!profile) return;
    setSaving(true);
    setMessage("");
    const result = await db.updateProfile(profile.userId, {
      firstName: firstName.trim(),
      middleName: middleName.trim() || null,
      lastName: lastName.trim() || null,
      nickname: nickname.trim() || null,
    });
    setSaving(false);
    setMessage(result.success ? "Profile saved!" : result.error);
  };

  const handleSaveBirth = async () => {
    if (!profile) return;
    setSavingBirth(true);
    setBirthMessage("");
    const result = await db.updateProfile(profile.userId, {
      birthday: birthday || null,
      birthTime: birthTime || null,
      birthCity: birthCity.trim() || null,
      birthState: birthState || null,
    });
    setSavingBirth(false);
    setBirthMessage(result.success ? "Birth info saved!" : result.error);
  };

  // Preference fields
  const [gender, setGender] = useState("");
  const [genderExpression, setGenderExpression] = useState("");
  const [relationshipStatus, setRelationshipStatus] = useState("");
  const [careerField, setCareerField] = useState("");
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [prefsMessage, setPrefsMessage] = useState("");

  // Load preference fields from profile
  useEffect(() => {
    if (profile) {
      setGender(profile.gender || "");
      setGenderExpression(profile.genderExpression || "");
      setRelationshipStatus(profile.relationshipStatus || "");
      setCareerField(profile.careerField || "");
    }
  }, [profile]);

  const handleSavePreferences = async () => {
    if (!profile) return;
    setSavingPrefs(true);
    setPrefsMessage("");
    const result = await db.updateProfile(profile.userId, {
      gender: gender || null,
      genderExpression: genderExpression || null,
      relationshipStatus: relationshipStatus || null,
      careerField: careerField || null,
    });
    setSavingPrefs(false);
    setPrefsMessage(result.success ? "Preferences saved!" : result.error);
  };

  const tabs = [
    { key: "profile" as const, label: "Profile" },
    { key: "preferences" as const, label: "Preferences" },
    { key: "privacy" as const, label: "Privacy" },
    { key: "subscription" as const, label: "Subscription" },
    { key: "data" as const, label: "Data & Export" },
  ];

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold text-white/90 mb-6">Settings</h1>

      <div className="flex gap-1 rounded-lg bg-white/[0.06] p-1 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-white/[0.08] text-white shadow-lg shadow-black/20"
                : "text-white/30 hover:text-white/50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "profile" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.04] p-6 shadow-lg shadow-black/20">
            <h2 className="text-lg font-semibold text-white/90 mb-4">Personal Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/50 mb-1">First Name</label>
                <input className={inputClass} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/50 mb-1">Middle Name</label>
                <input className={inputClass} value={middleName} onChange={(e) => setMiddleName(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/50 mb-1">Last Name</label>
                <input className={inputClass} value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/50 mb-1">Nickname</label>
                <input className={inputClass} value={nickname} onChange={(e) => setNickname(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/50 mb-1">Email</label>
                <input className={`${inputClass} text-white/50`} value={email} disabled />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-medium text-white hover:from-indigo-500 hover:to-purple-500 transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              {message && (
                <span className={`text-sm ${message.includes("saved") ? "text-green-400" : "text-red-400"}`}>
                  {message}
                </span>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-white/[0.04] p-6 shadow-lg shadow-black/20">
            <h2 className="text-lg font-semibold text-white/90 mb-4">Birth Information</h2>
            <p className="text-sm text-white/30 mb-4">Update your birth details to improve report accuracy.</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/50 mb-1">Date of Birth</label>
                <input type="date" className={`${inputClass} [color-scheme:dark]`} value={birthday} onChange={(e) => setBirthday(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/50 mb-1">Exact Birth Time</label>
                <input type="time" className={`${inputClass} [color-scheme:dark]`} value={birthTime} onChange={(e) => setBirthTime(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/50 mb-1">City of Birth</label>
                <input type="text" className={inputClass} value={birthCity} onChange={(e) => setBirthCity(e.target.value)} placeholder="e.g. Los Angeles" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/50 mb-1">State of Birth</label>
                <select className={`${inputClass} [color-scheme:dark]`} value={birthState} onChange={(e) => setBirthState(e.target.value)}>
                  <option value="" className="bg-[#0d1230]">Select state</option>
                  {US_STATES.map((s) => (
                    <option key={s} value={s} className="bg-[#0d1230] text-white">{s}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={handleSaveBirth}
                disabled={savingBirth}
                className="rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-medium text-white hover:from-indigo-500 hover:to-purple-500 transition-colors disabled:opacity-50"
              >
                {savingBirth ? "Saving..." : "Update Birth Info"}
              </button>
              {birthMessage && (
                <span className={`text-sm ${birthMessage.includes("saved") ? "text-green-400" : "text-red-400"}`}>
                  {birthMessage}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "preferences" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.04] p-6 shadow-lg shadow-black/20">
            <h2 className="text-lg font-semibold text-white/90 mb-4">About You</h2>
            <p className="text-sm text-white/30 mb-4">These preferences personalize your style, career, soulmate, and all other sections.</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/50 mb-1">Sex</label>
                <select className={`${inputClass} [color-scheme:dark]`} value={gender} onChange={(e) => setGender(e.target.value)}>
                  <option value="" className="bg-[#0d1230]">Male or Female</option>
                  {["Male", "Female"].map((g) => (
                    <option key={g} value={g} className="bg-[#0d1230] text-white">{g}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/50 mb-1">Style Expression</label>
                <select className={`${inputClass} [color-scheme:dark]`} value={genderExpression} onChange={(e) => setGenderExpression(e.target.value)}>
                  <option value="" className="bg-[#0d1230]">Select</option>
                  {["Masculine", "Feminine", "Androgynous", "Fluid"].map((g) => (
                    <option key={g} value={g} className="bg-[#0d1230] text-white">{g}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/50 mb-1">Relationship Status</label>
                <select className={`${inputClass} [color-scheme:dark]`} value={relationshipStatus} onChange={(e) => setRelationshipStatus(e.target.value)}>
                  <option value="" className="bg-[#0d1230]">Select</option>
                  {["Single", "In a Relationship", "Married", "Engaged", "Divorced", "It's Complicated", "Prefer not to say"].map((s) => (
                    <option key={s} value={s} className="bg-[#0d1230] text-white">{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/50 mb-1">Career Field</label>
                <select className={`${inputClass} [color-scheme:dark]`} value={careerField} onChange={(e) => setCareerField(e.target.value)}>
                  <option value="" className="bg-[#0d1230]">Select</option>
                  {["Technology", "Healthcare", "Creative/Arts", "Business/Finance", "Education", "Engineering", "Marketing/Media", "Law", "Science/Research", "Trades/Skilled Labor", "Entertainment", "Social Work", "Real Estate", "Hospitality", "Government", "Entrepreneurship", "Freelance/Consulting", "Not Sure Yet"].map((f) => (
                    <option key={f} value={f} className="bg-[#0d1230] text-white">{f}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Display current style/music/film preferences (read-only summary) */}
            {profile && (
              <div className="mt-6 space-y-3">
                {profile.stylePreferences && profile.stylePreferences.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-white/50 mb-1.5">Style Preferences</label>
                    <div className="flex flex-wrap gap-2">
                      {profile.stylePreferences.map((s) => (
                        <span key={s} className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-300">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
                {profile.musicGenres && profile.musicGenres.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-white/50 mb-1.5">Music Genres</label>
                    <div className="flex flex-wrap gap-2">
                      {profile.musicGenres.map((g) => (
                        <span key={g} className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-300">{g}</span>
                      ))}
                    </div>
                  </div>
                )}
                {profile.filmGenres && profile.filmGenres.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-white/50 mb-1.5">Film Genres</label>
                    <div className="flex flex-wrap gap-2">
                      {profile.filmGenres.map((g) => (
                        <span key={g} className="rounded-lg border border-purple-500/20 bg-purple-500/10 px-2.5 py-1 text-xs font-medium text-purple-300">{g}</span>
                      ))}
                    </div>
                  </div>
                )}
                {profile.valuesList && profile.valuesList.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-white/50 mb-1.5">Core Values</label>
                    <div className="flex flex-wrap gap-2">
                      {profile.valuesList.map((v) => (
                        <span key={v} className="rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-1 text-xs font-medium text-cyan-300">{v}</span>
                      ))}
                    </div>
                  </div>
                )}
                {profile.goals && profile.goals.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-white/50 mb-1.5">Life Goals</label>
                    <div className="flex flex-wrap gap-2">
                      {profile.goals.map((g) => (
                        <span key={g} className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-2.5 py-1 text-xs font-medium text-rose-300">{g}</span>
                      ))}
                    </div>
                  </div>
                )}
                <p className="text-xs text-white/20 mt-2">To update style, music, film, values, or goals preferences, go through the intake flow again or contact support.</p>
              </div>
            )}

            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={handleSavePreferences}
                disabled={savingPrefs}
                className="rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-medium text-white hover:from-indigo-500 hover:to-purple-500 transition-colors disabled:opacity-50"
              >
                {savingPrefs ? "Saving..." : "Save Preferences"}
              </button>
              {prefsMessage && (
                <span className={`text-sm ${prefsMessage.includes("saved") ? "text-green-400" : "text-red-400"}`}>
                  {prefsMessage}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "privacy" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.04] p-6 shadow-lg shadow-black/20">
            <h2 className="text-lg font-semibold text-white/90 mb-4">Privacy Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/90">Anonymous Leaderboard</p>
                  <p className="text-xs text-white/30">Show your nickname instead of real name on leaderboards</p>
                </div>
                <button className="relative h-6 w-11 rounded-full bg-indigo-600 transition-colors">
                  <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform translate-x-5" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/90">Share Profile</p>
                  <p className="text-xs text-white/30">Allow others to view your public profile</p>
                </div>
                <button className="relative h-6 w-11 rounded-full bg-white/[0.08] transition-colors">
                  <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/90">Local Draft Mode</p>
                  <p className="text-xs text-white/30">Keep report drafts on your device only</p>
                </div>
                <button className="relative h-6 w-11 rounded-full bg-white/[0.08] transition-colors">
                  <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "subscription" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.04] p-6 shadow-lg shadow-black/20">
            <h2 className="text-lg font-semibold text-white/90 mb-2">Current Plan</h2>
            <div className="inline-flex items-center rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-3 py-1 text-xs font-medium text-white mb-4">
              Premium
            </div>
            <p className="text-sm text-white/30">You have full access to all modules, reports, and features.</p>
          </div>
          <div className="rounded-xl border-2 border-dashed border-white/[0.06] p-6 text-center">
            <p className="text-sm text-white/30">Billing management coming soon</p>
          </div>
        </div>
      )}

      {activeTab === "data" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.04] p-6 shadow-lg shadow-black/20">
            <h2 className="text-lg font-semibold text-white/90 mb-4">Export Your Data</h2>
            <p className="text-sm text-white/30 mb-4">Download all your reports and profile data.</p>
            <button className="rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-medium text-white hover:from-indigo-500 hover:to-purple-500 transition-colors">
              Export All Data (JSON)
            </button>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.04] p-6 shadow-lg shadow-black/20 border-red-500/30">
            <h2 className="text-lg font-semibold text-red-400 mb-4">Danger Zone</h2>
            <p className="text-sm text-white/30 mb-4">Permanently delete your account and all associated data. This cannot be undone.</p>
            <button className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors">
              Delete My Account
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
