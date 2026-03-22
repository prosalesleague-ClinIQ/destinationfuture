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

const STYLE_OPTIONS = [
  "Minimalist", "Streetwear", "Classic", "Bold/Statement", "High-Fashion",
  "Romantic", "Luxury", "Bohemian", "Athleisure", "Vintage", "Preppy", "Grunge",
];

const STYLE_BUDGET_OPTIONS = ["Budget ($)", "Mid-Range ($$)", "Premium ($$$)", "Luxury ($$$$)"];

const STORE_OPTIONS = [
  "Amazon", "Nordstrom", "H&M", "Zara", "Uniqlo", "ASOS", "Nike", "Adidas",
  "Gucci", "Target", "Shein", "Revolve", "Anthropologie", "Urban Outfitters",
  "Banana Republic", "J.Crew", "Lululemon", "Patagonia", "Thrift/Vintage Shops",
  "Supreme", "Off-White", "Balenciaga", "Prada", "Louis Vuitton",
];

const MUSIC_GENRE_OPTIONS = [
  "Hip-Hop", "R&B", "Pop", "Rock", "Alternative", "Electronic", "Jazz", "Soul",
  "Classical", "Country", "Latin", "Ambient", "Indie", "Metal", "Folk", "Reggae",
  "Funk", "Blues", "Gospel", "Afrobeats",
];

const FILM_GENRE_OPTIONS = [
  "Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Romance", "Thriller",
  "Documentary", "Animation", "Fantasy", "Mystery", "Indie",
];

const TV_GENRE_OPTIONS = [
  "Drama", "Comedy", "Reality TV", "True Crime", "Sci-Fi", "Anime",
  "Documentary", "Thriller", "Romance", "Competition", "Horror", "Fantasy",
];

const CAREER_FIELD_OPTIONS = [
  "Technology", "Healthcare", "Creative/Arts", "Business/Finance", "Education",
  "Engineering", "Marketing/Media", "Law", "Science/Research", "Trades/Skilled Labor",
  "Entertainment", "Social Work", "Real Estate", "Hospitality", "Government",
  "Entrepreneurship", "Freelance/Consulting", "Not Sure Yet",
];

const CAREER_GOAL_OPTIONS = [
  "High Income", "Work-Life Balance", "Creative Freedom", "Remote Work",
  "Leadership/Management", "Making an Impact", "Job Security", "Fast Growth",
  "Flexibility", "Travel Opportunities", "Building Something", "Helping Others",
];

const HOBBY_OPTIONS = [
  "Reading", "Gaming", "Fitness/Gym", "Cooking", "Travel", "Photography",
  "Music/Instruments", "Art/Drawing", "Writing", "Hiking/Outdoors", "Dancing",
  "Meditation/Yoga", "Sports", "Fashion", "Tech/Coding", "Film/TV Binging",
  "Volunteering", "Gardening", "Podcasts", "Collecting",
];

const VALUES_OPTIONS = [
  "Family", "Freedom", "Creativity", "Ambition", "Honesty", "Adventure",
  "Stability", "Compassion", "Independence", "Growth", "Community",
  "Spirituality", "Wealth", "Health", "Knowledge", "Authenticity",
];

const GOAL_OPTIONS = [
  "Find my dream career", "Build financial freedom", "Improve my relationships",
  "Move to a new city", "Start a business", "Find love/soulmate",
  "Improve my health/fitness", "Develop a personal style", "Grow spiritually",
  "Build confidence", "Travel more", "Create a personal brand",
  "Learn new skills", "Find my purpose", "Heal from the past",
];

const RELATIONSHIP_OPTIONS = [
  "Single", "In a Relationship", "Married", "Engaged", "Divorced",
  "It's Complicated", "Prefer not to say",
];

const SEX_OPTIONS = ["Male", "Female"];

const TOTAL_STEPS = 7;

export default function IntakePage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Step 1: Identity
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nickname, setNickname] = useState("");
  const [gender, setGender] = useState("");
  const [genderExpression, setGenderExpression] = useState("");

  // Step 2: Birth Details
  const [birthday, setBirthday] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthCity, setBirthCity] = useState("");
  const [birthState, setBirthState] = useState("");

  // Step 3: Life Situation
  const [relationshipStatus, setRelationshipStatus] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  // Step 4: Style & Fashion
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [styleBudget, setStyleBudget] = useState("");
  const [selectedStores, setSelectedStores] = useState<string[]>([]);

  // Step 5: Music
  const [selectedMusicGenres, setSelectedMusicGenres] = useState<string[]>([]);

  // Step 6: Film & TV
  const [selectedFilmGenres, setSelectedFilmGenres] = useState<string[]>([]);
  const [selectedTvGenres, setSelectedTvGenres] = useState<string[]>([]);

  // Step 7: Career & Hobbies
  const [careerField, setCareerField] = useState("");
  const [selectedCareerGoals, setSelectedCareerGoals] = useState<string[]>([]);
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);

  const inputClass =
    "w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-indigo-500/40 focus:bg-white/[0.06] transition-all";

  const toggleSelection = (item: string, list: string[], setter: (v: string[]) => void, max?: number) => {
    if (list.includes(item)) {
      setter(list.filter((i) => i !== item));
    } else if (!max || list.length < max) {
      setter([...list, item]);
    }
  };

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

  const validateStep = (): boolean => {
    setError("");
    if (step === 1) {
      if (!firstName.trim()) { setError("First name is required"); return false; }
      if (!lastName.trim()) { setError("Last name is required"); return false; }
      if (!gender) { setError("Please select Male or Female"); return false; }
    }
    if (step === 2) {
      if (!birthday) { setError("Birthday is required"); return false; }
      if (!birthCity.trim()) { setError("Birth city is required"); return false; }
      if (!birthState) { setError("Birth state is required"); return false; }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };

  const handleBack = () => {
    setError("");
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
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
      gender: gender || undefined,
      genderExpression: genderExpression || undefined,
      relationshipStatus: relationshipStatus || undefined,
      budgetRange: budgetRange || undefined,
      stylePreferences: selectedStyles,
      styleBudget: styleBudget || undefined,
      favoriteStores: selectedStores,
      musicGenres: selectedMusicGenres,
      filmGenres: selectedFilmGenres,
      tvGenres: selectedTvGenres,
      careerField: careerField || undefined,
      careerGoals: selectedCareerGoals,
      goals: selectedGoals,
      hobbies: selectedHobbies,
      valuesList: selectedValues,
    });
    setLoading(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    router.push("/dashboard");
  };

  if (!userId) return null;

  const ChipGrid = ({ options, selected, onToggle, max, columns = 3 }: {
    options: string[];
    selected: string[];
    onToggle: (item: string) => void;
    max?: number;
    columns?: number;
  }) => (
    <div className={`grid gap-2 ${columns === 4 ? "grid-cols-2 sm:grid-cols-4" : columns === 2 ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3"}`}>
      {options.map((opt) => {
        const isSelected = selected.includes(opt);
        const isDisabled = !isSelected && max !== undefined && selected.length >= max;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onToggle(opt)}
            disabled={isDisabled}
            className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-all ${
              isSelected
                ? "border-indigo-500/60 bg-indigo-500/20 text-indigo-300"
                : isDisabled
                ? "border-white/[0.04] bg-white/[0.02] text-white/20 cursor-not-allowed"
                : "border-white/[0.08] bg-white/[0.04] text-white/60 hover:border-white/20 hover:text-white/80"
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );

  const stepTitles = [
    "Who Are You?",
    "Birth Details",
    "Your Life Right Now",
    "Your Style",
    "Your Music",
    "Film & TV",
    "Career & Passions",
  ];

  const stepDescriptions = [
    "Let's start with the basics.",
    "Used for numerology, astrology, and personalized insights.",
    "Help us understand where you are in life.",
    "Tell us about your fashion and personal style.",
    "What sounds define your world?",
    "What do you love to watch?",
    "Where are you headed?",
  ];

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#0a0e27] px-4 py-12">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-purple-500/10 blur-[120px]" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-indigo-500/10 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {/* Header */}
        <div className="mb-6 text-center">
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
          <h1 className="text-2xl font-bold text-white">{stepTitles[step - 1]}</h1>
          <p className="mt-1 text-white/50">{stepDescriptions[step - 1]}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6 flex items-center gap-1.5">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                i < step ? "bg-gradient-to-r from-indigo-500 to-purple-500" : "bg-white/[0.08]"
              }`}
            />
          ))}
        </div>
        <p className="text-center text-xs text-white/30 mb-4">Step {step} of {TOTAL_STEPS}</p>

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl p-8">
          {error && (
            <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Step 1: Identity */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
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

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3">About You</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-white/70 mb-1.5">Sex <span className="text-red-400">*</span></label>
                    <select id="gender" value={gender} onChange={(e) => setGender(e.target.value)}
                      className={`${inputClass} ${!gender ? "text-white/30" : ""}`}>
                      <option value="" className="bg-[#0d1230]">Male or Female</option>
                      {SEX_OPTIONS.map((g) => (
                        <option key={g} value={g} className="bg-[#0d1230] text-white">{g}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="genderExpression" className="block text-sm font-medium text-white/70 mb-1.5">Style Expression</label>
                    <select id="genderExpression" value={genderExpression} onChange={(e) => setGenderExpression(e.target.value)}
                      className={`${inputClass} ${!genderExpression ? "text-white/30" : ""}`}>
                      <option value="" className="bg-[#0d1230]">Select</option>
                      <option value="Masculine" className="bg-[#0d1230] text-white">Masculine</option>
                      <option value="Feminine" className="bg-[#0d1230] text-white">Feminine</option>
                      <option value="Androgynous" className="bg-[#0d1230] text-white">Androgynous</option>
                      <option value="Fluid" className="bg-[#0d1230] text-white">Fluid</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Birth Details */}
          {step === 2 && (
            <div className="space-y-4">
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
              <div className="grid grid-cols-2 gap-3">
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
          )}

          {/* Step 3: Life Situation */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Relationship Status</label>
                <div className="grid grid-cols-2 gap-2">
                  {RELATIONSHIP_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setRelationshipStatus(opt)}
                      className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-all ${
                        relationshipStatus === opt
                          ? "border-indigo-500/60 bg-indigo-500/20 text-indigo-300"
                          : "border-white/[0.08] bg-white/[0.04] text-white/60 hover:border-white/20 hover:text-white/80"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">
                  Core Values <span className="text-white/30 text-xs">(pick up to 5)</span>
                </label>
                <ChipGrid
                  options={VALUES_OPTIONS}
                  selected={selectedValues}
                  onToggle={(v) => toggleSelection(v, selectedValues, setSelectedValues, 5)}
                  max={5}
                  columns={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">
                  Life Goals <span className="text-white/30 text-xs">(pick up to 5)</span>
                </label>
                <ChipGrid
                  options={GOAL_OPTIONS}
                  selected={selectedGoals}
                  onToggle={(g) => toggleSelection(g, selectedGoals, setSelectedGoals, 5)}
                  max={5}
                  columns={2}
                />
              </div>
            </div>
          )}

          {/* Step 4: Style & Fashion */}
          {step === 4 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">
                  Style Vibes <span className="text-white/30 text-xs">(pick up to 3)</span>
                </label>
                <ChipGrid
                  options={STYLE_OPTIONS}
                  selected={selectedStyles}
                  onToggle={(s) => toggleSelection(s, selectedStyles, setSelectedStyles, 3)}
                  max={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Fashion Budget</label>
                <div className="grid grid-cols-2 gap-2">
                  {STYLE_BUDGET_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setStyleBudget(opt)}
                      className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-all ${
                        styleBudget === opt
                          ? "border-indigo-500/60 bg-indigo-500/20 text-indigo-300"
                          : "border-white/[0.08] bg-white/[0.04] text-white/60 hover:border-white/20 hover:text-white/80"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">
                  Favorite Stores <span className="text-white/30 text-xs">(pick up to 5)</span>
                </label>
                <ChipGrid
                  options={STORE_OPTIONS}
                  selected={selectedStores}
                  onToggle={(s) => toggleSelection(s, selectedStores, setSelectedStores, 5)}
                  max={5}
                  columns={3}
                />
              </div>
            </div>
          )}

          {/* Step 5: Music */}
          {step === 5 && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-white/70 mb-1">
                Music Genres You Love <span className="text-white/30 text-xs">(pick up to 5)</span>
              </label>
              <ChipGrid
                options={MUSIC_GENRE_OPTIONS}
                selected={selectedMusicGenres}
                onToggle={(g) => toggleSelection(g, selectedMusicGenres, setSelectedMusicGenres, 5)}
                max={5}
                columns={3}
              />
            </div>
          )}

          {/* Step 6: Film & TV */}
          {step === 6 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">
                  Film Genres <span className="text-white/30 text-xs">(pick up to 4)</span>
                </label>
                <ChipGrid
                  options={FILM_GENRE_OPTIONS}
                  selected={selectedFilmGenres}
                  onToggle={(g) => toggleSelection(g, selectedFilmGenres, setSelectedFilmGenres, 4)}
                  max={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">
                  TV Genres <span className="text-white/30 text-xs">(pick up to 4)</span>
                </label>
                <ChipGrid
                  options={TV_GENRE_OPTIONS}
                  selected={selectedTvGenres}
                  onToggle={(g) => toggleSelection(g, selectedTvGenres, setSelectedTvGenres, 4)}
                  max={4}
                />
              </div>
            </div>
          )}

          {/* Step 7: Career & Hobbies */}
          {step === 7 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Career Field / Interest</label>
                <select
                  value={careerField}
                  onChange={(e) => setCareerField(e.target.value)}
                  className={`${inputClass} ${!careerField ? "text-white/30" : ""}`}
                >
                  <option value="" className="bg-[#0d1230]">Select field</option>
                  {CAREER_FIELD_OPTIONS.map((f) => (
                    <option key={f} value={f} className="bg-[#0d1230] text-white">{f}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">
                  Career Goals <span className="text-white/30 text-xs">(pick up to 4)</span>
                </label>
                <ChipGrid
                  options={CAREER_GOAL_OPTIONS}
                  selected={selectedCareerGoals}
                  onToggle={(g) => toggleSelection(g, selectedCareerGoals, setSelectedCareerGoals, 4)}
                  max={4}
                  columns={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">
                  Hobbies & Interests <span className="text-white/30 text-xs">(pick up to 5)</span>
                </label>
                <ChipGrid
                  options={HOBBY_OPTIONS}
                  selected={selectedHobbies}
                  onToggle={(h) => toggleSelection(h, selectedHobbies, setSelectedHobbies, 5)}
                  max={5}
                  columns={3}
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-6 flex gap-3">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white/70 transition-all hover:bg-white/[0.08]"
              >
                Back
              </button>
            )}
            {step < TOTAL_STEPS ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:shadow-indigo-500/30 hover:brightness-110"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:shadow-indigo-500/30 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Building your portal..." : "Launch My Portal"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
