"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const GOALS = [
  { key: "love", label: "Love & Relationships", icon: "\u2764\uFE0F" },
  { key: "career", label: "Career & Purpose", icon: "\uD83D\uDCBC" },
  { key: "money", label: "Money & Abundance", icon: "\uD83D\uDCB0" },
  { key: "creativity", label: "Creativity & Expression", icon: "\uD83C\uDFA8" },
  { key: "healing", label: "Healing & Recovery", icon: "\uD83D\uDC9A" },
  { key: "spirituality", label: "Spirituality & Meaning", icon: "\u2728" },
  { key: "relocation", label: "Relocation & Travel", icon: "\uD83D\uDCCD" },
  { key: "self_improvement", label: "Self-Improvement", icon: "\uD83D\uDCC8" },
];

const BUDGET_RANGES = [
  { key: "budget", label: "Budget-Conscious" },
  { key: "moderate", label: "Moderate" },
  { key: "premium", label: "Premium" },
  { key: "luxury", label: "Luxury" },
];

const STYLE_PREFERENCES = [
  { key: "minimalist", label: "Minimalist" },
  { key: "streetwear", label: "Streetwear" },
  { key: "classic", label: "Classic" },
  { key: "bohemian", label: "Bohemian" },
  { key: "athletic", label: "Athletic / Athleisure" },
  { key: "avant_garde", label: "Avant-Garde" },
  { key: "preppy", label: "Preppy" },
  { key: "edgy", label: "Edgy / Alternative" },
];

const MUSIC_PREFERENCES = [
  { key: "hip_hop", label: "Hip-Hop / R&B" },
  { key: "pop", label: "Pop" },
  { key: "rock", label: "Rock / Alternative" },
  { key: "electronic", label: "Electronic / EDM" },
  { key: "jazz", label: "Jazz / Soul" },
  { key: "classical", label: "Classical" },
  { key: "country", label: "Country" },
  { key: "latin", label: "Latin" },
  { key: "ambient", label: "Ambient / New Age" },
  { key: "indie", label: "Indie" },
];

const RELATIONSHIP_STATUSES = [
  { key: "single", label: "Single" },
  { key: "dating", label: "Dating" },
  { key: "in_relationship", label: "In a Relationship" },
  { key: "married", label: "Married" },
  { key: "divorced", label: "Divorced" },
  { key: "its_complicated", label: "It's Complicated" },
  { key: "prefer_not_to_say", label: "Prefer Not to Say" },
];

const STEP_LABELS = ["Name", "Birth Info", "Location", "About You", "Goals", "Review"];

interface FormData {
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  birthTime: string;
  birthCity: string;
  birthState: string;
  birthCountry: string;
  currentCity: string;
  currentState: string;
  currentCountry: string;
  relationshipStatus: string;
  careerField: string;
  budgetRange: string;
  stylePreferences: string[];
  musicPreferences: string[];
  selectedGoals: string[];
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<FormData>({
    firstName: "",
    middleName: "",
    lastName: "",
    dateOfBirth: "",
    birthTime: "",
    birthCity: "",
    birthState: "",
    birthCountry: "",
    currentCity: "",
    currentState: "",
    currentCountry: "",
    relationshipStatus: "",
    careerField: "",
    budgetRange: "",
    stylePreferences: [],
    musicPreferences: [],
    selectedGoals: [],
  });

  const totalSteps = STEP_LABELS.length;
  const progressPercent = ((step + 1) / totalSteps) * 100;

  const updateField = (field: keyof FormData, value: string | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArrayField = (field: "stylePreferences" | "musicPreferences" | "selectedGoals", key: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(key)
        ? prev[field].filter((k: string) => k !== key)
        : [...prev[field], key],
    }));
  };

  const canProceed = (): boolean => {
    switch (step) {
      case 0:
        return form.firstName.trim().length > 0;
      case 1:
        return form.dateOfBirth.length > 0;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // In a real app, this would call api.user.submitOnboarding(form)
      console.log("Submitting onboarding data:", form);
      router.push("/dashboard");
    } catch (error) {
      console.error("Onboarding submission failed:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-surface-50">
      {/* Header */}
      <header className="border-b border-surface-200 bg-white px-4 py-4">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <h1 className="text-xl font-bold text-gradient">Destination Future</h1>
          <span className="text-sm text-surface-700">
            Step {step + 1} of {totalSteps}
          </span>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="w-full bg-surface-200">
        <div
          className="h-1 bg-gradient-to-r from-brand-500 to-cosmic-500 transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Step Labels */}
      <div className="mx-auto w-full max-w-2xl px-4 pt-6">
        <div className="hidden sm:flex items-center justify-between">
          {STEP_LABELS.map((label, i) => (
            <div key={label} className="flex flex-col items-center gap-1.5">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                  i <= step
                    ? "bg-gradient-to-br from-brand-500 to-cosmic-500 text-white"
                    : "bg-surface-200 text-surface-700"
                }`}
              >
                {i < step ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span className={`text-xs ${i <= step ? "font-medium text-brand-600" : "text-surface-700"}`}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
        <div className="rounded-2xl border border-surface-200 bg-white p-6 shadow-sm sm:p-8">
          {/* Step 0: Name */}
          {step === 0 && (
            <div className="animate-fade-in space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-surface-900">What&apos;s your name?</h2>
                <p className="mt-1 text-surface-700">Your name is used for numerological calculations and personalization.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="firstName" className="mb-1.5 block text-sm font-medium text-surface-900">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={form.firstName}
                    onChange={(e) => updateField("firstName", e.target.value)}
                    placeholder="Your first name"
                    className="w-full rounded-xl border border-surface-300 bg-surface-50 px-4 py-3 text-surface-900 placeholder:text-surface-300 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors"
                    autoFocus
                  />
                </div>

                <div>
                  <label htmlFor="middleName" className="mb-1.5 block text-sm font-medium text-surface-900">
                    Middle Name <span className="text-surface-300 text-xs font-normal">(optional)</span>
                  </label>
                  <input
                    id="middleName"
                    type="text"
                    value={form.middleName}
                    onChange={(e) => updateField("middleName", e.target.value)}
                    placeholder="Your middle name"
                    className="w-full rounded-xl border border-surface-300 bg-surface-50 px-4 py-3 text-surface-900 placeholder:text-surface-300 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="mb-1.5 block text-sm font-medium text-surface-900">
                    Last Name <span className="text-surface-300 text-xs font-normal">(optional)</span>
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={form.lastName}
                    onChange={(e) => updateField("lastName", e.target.value)}
                    placeholder="Your last name"
                    className="w-full rounded-xl border border-surface-300 bg-surface-50 px-4 py-3 text-surface-900 placeholder:text-surface-300 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Birth Info */}
          {step === 1 && (
            <div className="animate-fade-in space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-surface-900">When and where were you born?</h2>
                <p className="mt-1 text-surface-700">This powers your numerology, astrology, and cosmic profile.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="dateOfBirth" className="mb-1.5 block text-sm font-medium text-surface-900">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="dateOfBirth"
                    type="date"
                    value={form.dateOfBirth}
                    onChange={(e) => updateField("dateOfBirth", e.target.value)}
                    className="w-full rounded-xl border border-surface-300 bg-surface-50 px-4 py-3 text-surface-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="birthTime" className="mb-1.5 block text-sm font-medium text-surface-900">
                    Exact Birth Time <span className="text-surface-300 text-xs font-normal">(optional)</span>
                  </label>
                  <input
                    id="birthTime"
                    type="time"
                    value={form.birthTime}
                    onChange={(e) => updateField("birthTime", e.target.value)}
                    className="w-full rounded-xl border border-surface-300 bg-surface-50 px-4 py-3 text-surface-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors"
                  />
                  <p className="mt-2 rounded-lg bg-brand-50 px-3 py-2 text-sm text-brand-700">
                    <strong>Without exact birth time:</strong> We can still generate your numerology, life path, and most insights. Rising sign, house placements, and astrocartography accuracy will be limited. You can always add it later.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label htmlFor="birthCity" className="mb-1.5 block text-sm font-medium text-surface-900">
                      Birth City
                    </label>
                    <input
                      id="birthCity"
                      type="text"
                      value={form.birthCity}
                      onChange={(e) => updateField("birthCity", e.target.value)}
                      placeholder="City"
                      className="w-full rounded-xl border border-surface-300 bg-surface-50 px-4 py-3 text-surface-900 placeholder:text-surface-300 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="birthState" className="mb-1.5 block text-sm font-medium text-surface-900">
                      State / Province
                    </label>
                    <input
                      id="birthState"
                      type="text"
                      value={form.birthState}
                      onChange={(e) => updateField("birthState", e.target.value)}
                      placeholder="State"
                      className="w-full rounded-xl border border-surface-300 bg-surface-50 px-4 py-3 text-surface-900 placeholder:text-surface-300 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="birthCountry" className="mb-1.5 block text-sm font-medium text-surface-900">
                      Country
                    </label>
                    <input
                      id="birthCountry"
                      type="text"
                      value={form.birthCountry}
                      onChange={(e) => updateField("birthCountry", e.target.value)}
                      placeholder="Country"
                      className="w-full rounded-xl border border-surface-300 bg-surface-50 px-4 py-3 text-surface-900 placeholder:text-surface-300 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Current Location */}
          {step === 2 && (
            <div className="animate-fade-in space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-surface-900">Where do you live now?</h2>
                <p className="mt-1 text-surface-700">This helps us analyze your current city and suggest ideal locations. All fields are optional.</p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="currentCity" className="mb-1.5 block text-sm font-medium text-surface-900">
                    City
                  </label>
                  <input
                    id="currentCity"
                    type="text"
                    value={form.currentCity}
                    onChange={(e) => updateField("currentCity", e.target.value)}
                    placeholder="City"
                    className="w-full rounded-xl border border-surface-300 bg-surface-50 px-4 py-3 text-surface-900 placeholder:text-surface-300 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="currentState" className="mb-1.5 block text-sm font-medium text-surface-900">
                    State / Province
                  </label>
                  <input
                    id="currentState"
                    type="text"
                    value={form.currentState}
                    onChange={(e) => updateField("currentState", e.target.value)}
                    placeholder="State"
                    className="w-full rounded-xl border border-surface-300 bg-surface-50 px-4 py-3 text-surface-900 placeholder:text-surface-300 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="currentCountry" className="mb-1.5 block text-sm font-medium text-surface-900">
                    Country
                  </label>
                  <input
                    id="currentCountry"
                    type="text"
                    value={form.currentCountry}
                    onChange={(e) => updateField("currentCountry", e.target.value)}
                    placeholder="Country"
                    className="w-full rounded-xl border border-surface-300 bg-surface-50 px-4 py-3 text-surface-900 placeholder:text-surface-300 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: About You */}
          {step === 3 && (
            <div className="animate-fade-in space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-surface-900">Tell us about yourself</h2>
                <p className="mt-1 text-surface-700">These help personalize your recommendations. All fields are optional.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="relationshipStatus" className="mb-1.5 block text-sm font-medium text-surface-900">
                    Relationship Status
                  </label>
                  <select
                    id="relationshipStatus"
                    value={form.relationshipStatus}
                    onChange={(e) => updateField("relationshipStatus", e.target.value)}
                    className="w-full rounded-xl border border-surface-300 bg-surface-50 px-4 py-3 text-surface-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors"
                  >
                    <option value="">Select...</option>
                    {RELATIONSHIP_STATUSES.map((s) => (
                      <option key={s.key} value={s.key}>{s.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="careerField" className="mb-1.5 block text-sm font-medium text-surface-900">
                    Career Field
                  </label>
                  <input
                    id="careerField"
                    type="text"
                    value={form.careerField}
                    onChange={(e) => updateField("careerField", e.target.value)}
                    placeholder="e.g. Technology, Healthcare, Creative Arts"
                    className="w-full rounded-xl border border-surface-300 bg-surface-50 px-4 py-3 text-surface-900 placeholder:text-surface-300 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="budgetRange" className="mb-1.5 block text-sm font-medium text-surface-900">
                    Budget Range
                  </label>
                  <select
                    id="budgetRange"
                    value={form.budgetRange}
                    onChange={(e) => updateField("budgetRange", e.target.value)}
                    className="w-full rounded-xl border border-surface-300 bg-surface-50 px-4 py-3 text-surface-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors"
                  >
                    <option value="">Select...</option>
                    {BUDGET_RANGES.map((b) => (
                      <option key={b.key} value={b.key}>{b.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-surface-900">
                    Style Preferences <span className="text-surface-300 text-xs font-normal">(select all that fit)</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {STYLE_PREFERENCES.map((s) => {
                      const selected = form.stylePreferences.includes(s.key);
                      return (
                        <button
                          key={s.key}
                          type="button"
                          onClick={() => toggleArrayField("stylePreferences", s.key)}
                          className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                            selected
                              ? "bg-brand-600 text-white shadow-sm"
                              : "bg-surface-100 text-surface-700 hover:bg-surface-200"
                          }`}
                        >
                          {s.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-surface-900">
                    Music Preferences <span className="text-surface-300 text-xs font-normal">(select all that fit)</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {MUSIC_PREFERENCES.map((m) => {
                      const selected = form.musicPreferences.includes(m.key);
                      return (
                        <button
                          key={m.key}
                          type="button"
                          onClick={() => toggleArrayField("musicPreferences", m.key)}
                          className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                            selected
                              ? "bg-cosmic-600 text-white shadow-sm"
                              : "bg-surface-100 text-surface-700 hover:bg-surface-200"
                          }`}
                        >
                          {m.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Goals */}
          {step === 4 && (
            <div className="animate-fade-in space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-surface-900">What are you focused on?</h2>
                <p className="mt-1 text-surface-700">Select all that apply. This helps us prioritize your report sections.</p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {GOALS.map((goal) => {
                  const isSelected = form.selectedGoals.includes(goal.key);
                  return (
                    <button
                      key={goal.key}
                      type="button"
                      onClick={() => toggleArrayField("selectedGoals", goal.key)}
                      className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all duration-200 ${
                        isSelected
                          ? "border-brand-500 bg-brand-50 shadow-sm"
                          : "border-surface-200 bg-white hover:border-surface-300 hover:bg-surface-50"
                      }`}
                    >
                      <span className="text-2xl">{goal.icon}</span>
                      <span className={`font-medium ${isSelected ? "text-brand-700" : "text-surface-900"}`}>
                        {goal.label}
                      </span>
                      {isSelected && (
                        <svg className="ml-auto h-5 w-5 text-brand-500" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {step === 5 && (
            <div className="animate-fade-in space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-surface-900">Review your info</h2>
                <p className="mt-1 text-surface-700">Make sure everything looks good before we build your profile.</p>
              </div>

              <div className="space-y-4">
                <ReviewBlock
                  label="Name"
                  value={[form.firstName, form.middleName, form.lastName].filter(Boolean).join(" ")}
                  onEdit={() => setStep(0)}
                />
                <ReviewBlock
                  label="Date of Birth"
                  value={form.dateOfBirth || "Not provided"}
                  onEdit={() => setStep(1)}
                />
                <ReviewBlock
                  label="Birth Time"
                  value={form.birthTime || "Not provided (limited astrology features)"}
                  onEdit={() => setStep(1)}
                />
                <ReviewBlock
                  label="Birth Location"
                  value={[form.birthCity, form.birthState, form.birthCountry].filter(Boolean).join(", ") || "Not provided"}
                  onEdit={() => setStep(1)}
                />
                <ReviewBlock
                  label="Current Location"
                  value={[form.currentCity, form.currentState, form.currentCountry].filter(Boolean).join(", ") || "Not provided"}
                  onEdit={() => setStep(2)}
                />
                <ReviewBlock
                  label="Relationship Status"
                  value={RELATIONSHIP_STATUSES.find((s) => s.key === form.relationshipStatus)?.label || "Not provided"}
                  onEdit={() => setStep(3)}
                />
                <ReviewBlock
                  label="Career Field"
                  value={form.careerField || "Not provided"}
                  onEdit={() => setStep(3)}
                />
                <ReviewBlock
                  label="Budget Range"
                  value={BUDGET_RANGES.find((b) => b.key === form.budgetRange)?.label || "Not provided"}
                  onEdit={() => setStep(3)}
                />
                <ReviewBlock
                  label="Style"
                  value={
                    form.stylePreferences.length > 0
                      ? form.stylePreferences.map((k) => STYLE_PREFERENCES.find((s) => s.key === k)?.label).join(", ")
                      : "Not provided"
                  }
                  onEdit={() => setStep(3)}
                />
                <ReviewBlock
                  label="Music"
                  value={
                    form.musicPreferences.length > 0
                      ? form.musicPreferences.map((k) => MUSIC_PREFERENCES.find((m) => m.key === k)?.label).join(", ")
                      : "Not provided"
                  }
                  onEdit={() => setStep(3)}
                />
                <ReviewBlock
                  label="Goals"
                  value={
                    form.selectedGoals.length > 0
                      ? form.selectedGoals.map((g) => GOALS.find((goal) => goal.key === g)?.label).join(", ")
                      : "None selected"
                  }
                  onEdit={() => setStep(4)}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="border-t border-surface-200 bg-white px-4 py-4">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
            className="inline-flex items-center gap-2 rounded-xl border border-surface-300 px-6 py-3 text-sm font-medium text-surface-700 transition-colors hover:bg-surface-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Back
          </button>

          {step < totalSteps - 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              disabled={!canProceed()}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-cosmic-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-md"
            >
              Next
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-cosmic-600 px-8 py-3 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  Complete Setup
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ReviewBlock({ label, value, onEdit }: { label: string; value: string; onEdit: () => void }) {
  return (
    <div className="flex items-start justify-between rounded-xl border border-surface-200 bg-surface-50 px-4 py-3">
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-surface-700">{label}</p>
        <p className="mt-0.5 text-sm text-surface-900">{value}</p>
      </div>
      <button
        type="button"
        onClick={onEdit}
        className="shrink-0 text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
      >
        Edit
      </button>
    </div>
  );
}
