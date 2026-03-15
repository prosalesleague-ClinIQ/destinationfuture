"use client";

import { useState, useCallback } from "react";

type MusicTab = "frequencies" | "playlist" | "expansion" | "recommendations";

const ALL_GENRES = [
  { name: "Hip-Hop", color: "from-red-500 to-orange-500" },
  { name: "R&B", color: "from-purple-500 to-pink-500" },
  { name: "Pop", color: "from-pink-400 to-rose-500" },
  { name: "Rock", color: "from-gray-600 to-gray-800" },
  { name: "Alternative", color: "from-teal-500 to-cyan-500" },
  { name: "Electronic", color: "from-blue-500 to-indigo-600" },
  { name: "Jazz", color: "from-amber-500 to-yellow-600" },
  { name: "Soul", color: "from-orange-400 to-red-500" },
  { name: "Classical", color: "from-slate-400 to-slate-600" },
  { name: "Country", color: "from-yellow-500 to-amber-600" },
  { name: "Latin", color: "from-rose-500 to-red-600" },
  { name: "Ambient", color: "from-indigo-400 to-purple-500" },
  { name: "Indie", color: "from-emerald-400 to-teal-500" },
  { name: "Metal", color: "from-zinc-600 to-zinc-900" },
  { name: "Folk", color: "from-green-500 to-emerald-600" },
  { name: "Reggae", color: "from-green-400 to-yellow-500" },
  { name: "Funk", color: "from-fuchsia-500 to-purple-600" },
  { name: "Blues", color: "from-blue-600 to-blue-800" },
];

const FREQUENCY_DATA = [
  { wave: "Delta", range: "0.5 – 4 Hz", state: "Deep sleep, healing, regeneration", use: "Sleep, physical recovery", color: "#6366f1", gradient: "from-indigo-600 to-violet-700", emoji: "🌊", barWidth: 20 },
  { wave: "Theta", range: "4 – 8 Hz", state: "Meditation, creativity, dream state", use: "Meditation, creative flow, light sleep", color: "#8b5cf6", gradient: "from-violet-500 to-purple-600", emoji: "🧘", barWidth: 35 },
  { wave: "Alpha", range: "8 – 13 Hz", state: "Relaxed awareness, calm focus", use: "Calm, stress reduction, learning", color: "#06b6d4", gradient: "from-cyan-400 to-teal-500", emoji: "😌", barWidth: 55 },
  { wave: "Beta", range: "13 – 30 Hz", state: "Active thinking, problem-solving", use: "Focus, productivity, mental tasks", color: "#22c55e", gradient: "from-green-400 to-emerald-500", emoji: "🧠", barWidth: 75 },
  { wave: "Gamma", range: "30 – 100 Hz", state: "Peak awareness, insight, flow", use: "Peak performance, insight, happiness", color: "#f59e0b", gradient: "from-amber-400 to-yellow-500", emoji: "⚡", barWidth: 95 },
];

const PLAYLIST_DATA = [
  { title: "Weightless", artist: "Marconi Union", purpose: "Calm", type: "calm", search: "Marconi Union Weightless" },
  { title: "Clair de Lune", artist: "Debussy", purpose: "Peace", type: "calm", search: "Debussy Clair de Lune" },
  { title: "Experience", artist: "Ludovico Einaudi", purpose: "Emotional depth", type: "calm", search: "Ludovico Einaudi Experience" },
  { title: "Intro", artist: "The xx", purpose: "Focus with mood", type: "focus", search: "The xx Intro" },
  { title: "Midnight City", artist: "M83", purpose: "Productive energy", type: "focus", search: "M83 Midnight City" },
  { title: "Tadow", artist: "Masego & FKJ", purpose: "Creative focus", type: "focus", search: "Masego FKJ Tadow" },
  { title: "Here Comes the Sun", artist: "The Beatles", purpose: "Mood lift", type: "mood_lift", search: "Beatles Here Comes the Sun" },
  { title: "Good Days", artist: "SZA", purpose: "Optimistic energy", type: "mood_lift", search: "SZA Good Days" },
  { title: "Saturn", artist: "Sleeping at Last", purpose: "Gentle sleep", type: "sleep", search: "Sleeping at Last Saturn" },
  { title: "Gymnopédie No.1", artist: "Erik Satie", purpose: "Deep sleep", type: "sleep", search: "Erik Satie Gymnopedie" },
];

const TYPE_CONFIG: Record<string, { label: string; gradient: string; icon: string; bg: string }> = {
  focus: { label: "Focus", gradient: "from-blue-500 to-cyan-500", icon: "🎯", bg: "bg-blue-500/10" },
  calm: { label: "Calm", gradient: "from-emerald-400 to-green-500", icon: "🍃", bg: "bg-emerald-500/10" },
  mood_lift: { label: "Mood Lift", gradient: "from-orange-400 to-amber-500", icon: "🌅", bg: "bg-orange-500/10" },
  sleep: { label: "Sleep", gradient: "from-indigo-500 to-violet-600", icon: "🌙", bg: "bg-indigo-500/10" },
};

const USE_CASE_PAIRINGS = [
  { label: "Peace", emoji: "☮️", wave: "Alpha + Theta", tempo: "60-80 BPM", gradient: "from-teal-400 to-cyan-500" },
  { label: "Calm", emoji: "🧊", wave: "Alpha", tempo: "60-90 BPM", gradient: "from-sky-400 to-blue-500" },
  { label: "Focus", emoji: "🔬", wave: "Beta + Low Gamma", tempo: "100-120 BPM", gradient: "from-emerald-400 to-green-500" },
  { label: "Love", emoji: "💗", wave: "Theta + Alpha", tempo: "70-100 BPM", gradient: "from-rose-400 to-pink-500" },
  { label: "Happiness", emoji: "🌞", wave: "Gamma + Beta", tempo: "110-130 BPM", gradient: "from-amber-400 to-yellow-500" },
  { label: "Sleep", emoji: "💤", wave: "Delta + Theta", tempo: "40-60 BPM", gradient: "from-indigo-500 to-purple-600" },
];

const GENRE_EXPANSION = [
  { genre: "Dream Pop", artists: ["Beach House", "Cocteau Twins", "Alvvays"], reason: "Ethereal textures that complement your introspective nature", gradient: "from-pink-400 via-purple-400 to-indigo-500", emoji: "💭" },
  { genre: "Neo-Soul", artists: ["Erykah Badu", "D'Angelo", "Anderson .Paak"], reason: "Emotional depth with groove — connects head and heart", gradient: "from-amber-500 via-orange-400 to-rose-500", emoji: "🎷" },
  { genre: "Ambient Electronic", artists: ["Tycho", "Bonobo", "Boards of Canada"], reason: "Focus-friendly atmospheres for creative work", gradient: "from-cyan-400 via-teal-400 to-emerald-500", emoji: "🔮" },
  { genre: "Jazz Fusion", artists: ["Kamasi Washington", "Snarky Puppy", "Robert Glasper"], reason: "Complex arrangements that engage your analytical mind", gradient: "from-violet-500 via-purple-500 to-fuchsia-500", emoji: "🎺" },
];

const RECOMMENDATION_CATEGORIES = [
  {
    id: "deep-focus",
    title: "Deep Focus",
    emoji: "🎯",
    gradient: "from-blue-600 to-cyan-500",
    tracks: [
      { title: "Strobe", artist: "Deadmau5", bpm: "128", detail: "Progressive build keeps your brain locked in without jarring shifts" },
      { title: "Resonance", artist: "HOME", bpm: "100", detail: "Retro synths create a steady mental current for deep work" },
      { title: "Dissolve", artist: "Absofacto", bpm: "95", detail: "Dreamy yet rhythmic — prevents mind-wandering while staying calm" },
    ],
  },
  {
    id: "calm-restore",
    title: "Calm & Restore",
    emoji: "🧘",
    gradient: "from-emerald-500 to-teal-400",
    tracks: [
      { title: "Weightless", artist: "Marconi Union", bpm: "Alpha/Theta", detail: "Scientifically shown to reduce anxiety by up to 65%" },
      { title: "An Ending (Ascent)", artist: "Brian Eno", bpm: "Theta", detail: "Ambient masterpiece that dissolves tension in under 4 minutes" },
      { title: "Nuvole Bianche", artist: "Ludovico Einaudi", bpm: "Alpha", detail: "Piano arpeggios sync with parasympathetic nervous system rhythms" },
    ],
  },
  {
    id: "energy-boost",
    title: "Energy Boost",
    emoji: "⚡",
    gradient: "from-orange-500 to-red-500",
    tracks: [
      { title: "Lose Yourself to Dance", artist: "Daft Punk ft. Pharrell", bpm: "100", detail: "High energy" },
      { title: "Electric Feel", artist: "MGMT", bpm: "116", detail: "Very high energy" },
      { title: "One More Time", artist: "Daft Punk", bpm: "122", detail: "Peak energy" },
    ],
  },
  {
    id: "emotional-depth",
    title: "Emotional Depth",
    emoji: "💜",
    gradient: "from-purple-600 to-pink-500",
    tracks: [
      { title: "Motion Picture Soundtrack", artist: "Radiohead", bpm: "Melancholy beauty", detail: "Haunting harmonies that feel like staring at a sunset alone" },
      { title: "re: Stacks", artist: "Bon Iver", bpm: "Quiet ache", detail: "Raw, hushed vocals that mirror your inner contemplative voice" },
      { title: "Street Lights", artist: "Kanye West", bpm: "Introspective longing", detail: "Auto-tuned vulnerability over ambient beats — emotionally disarming" },
    ],
  },
  {
    id: "sleep-recovery",
    title: "Sleep & Recovery",
    emoji: "🌙",
    gradient: "from-indigo-600 to-violet-700",
    tracks: [
      { title: "Ambient 1: Music for Airports 1/1", artist: "Brian Eno", bpm: "Delta range", detail: "Play on a 45-minute timer for full sleep-cycle entry" },
      { title: "Sleeping Beauty", artist: "Marconi Union", bpm: "Theta range", detail: "60-minute loop designed for sleep onset — use with blackout curtain" },
      { title: "Comptine d'un autre été", artist: "Yann Tiersen", bpm: "Low Alpha", detail: "Gentle piano that lowers heart rate in 10 minutes — 20 min play" },
    ],
  },
  {
    id: "mood-lift",
    title: "Mood Lift",
    emoji: "🎭",
    gradient: "from-amber-500 to-yellow-400",
    tracks: [
      { title: "September", artist: "Earth, Wind & Fire", bpm: "126", detail: "Pure serotonin — impossible not to move" },
      { title: "Lovely Day", artist: "Bill Withers", bpm: "98", detail: "Warm, sun-soaked optimism" },
      { title: "Golden Hour", artist: "JVKE", bpm: "106", detail: "Euphoric modern pop built for smiling" },
    ],
  },
];

const SPOTIFY_PLAYLISTS = [
  {
    name: "Focus Flow",
    gradient: "from-green-500 to-emerald-600",
    tracks: [
      "Deadmau5 — Strobe",
      "HOME — Resonance",
      "Tycho — Awake",
      "Bonobo — Kerala",
      "M83 — Midnight City",
      "Tame Impala — Let It Happen",
      "Four Tet — Lush",
      "Boards of Canada — Dayvan Cowboy",
      "Jon Hopkins — Open Eye Signal",
      "Kiasmos — Blurred",
    ],
  },
  {
    name: "Night Wind Down",
    gradient: "from-green-500 to-teal-600",
    tracks: [
      "Brian Eno — An Ending (Ascent)",
      "Marconi Union — Weightless",
      "Ludovico Einaudi — Nuvole Bianche",
      "Yann Tiersen — Comptine d'un autre été",
      "Sigur Rós — Hoppípolla",
      "Sleeping at Last — Saturn",
      "Erik Satie — Gymnopédie No. 1",
      "Max Richter — On the Nature of Daylight",
      "Ólafur Arnalds — Near Light",
      "Nils Frahm — Says",
    ],
  },
  {
    name: "Weekend Energy",
    gradient: "from-green-400 to-lime-500",
    tracks: [
      "Daft Punk — One More Time",
      "Earth, Wind & Fire — September",
      "MGMT — Electric Feel",
      "Doja Cat — Say So",
      "The Weeknd — Blinding Lights",
      "Dua Lipa — Levitating",
      "Pharrell Williams — Happy",
      "Lizzo — Juice",
      "Bruno Mars — 24K Magic",
      "Outkast — Hey Ya!",
    ],
  },
];

export default function MusicPage() {
  const [activeTab, setActiveTab] = useState<MusicTab>("frequencies");
  const [artist1, setArtist1] = useState("");
  const [artist2, setArtist2] = useState("");
  const [artist3, setArtist3] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [copiedPlaylist, setCopiedPlaylist] = useState<string | null>(null);

  const toggleGenre = useCallback((genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  }, []);

  const handleCurate = useCallback(() => {
    setIsAnalyzing(true);
    setShowRecommendations(false);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowRecommendations(true);
      setActiveTab("recommendations");
    }, 2200);
  }, []);

  const copyPlaylist = useCallback((name: string, tracks: string[]) => {
    const text = `${name}\n\n${tracks.map((t, i) => `${i + 1}. ${t}`).join("\n")}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedPlaylist(name);
      setTimeout(() => setCopiedPlaylist(null), 2000);
    });
  }, []);

  const hasInput = artist1.trim() || artist2.trim() || artist3.trim() || selectedGenres.length > 0;

  const tabs: { key: MusicTab; label: string; emoji: string }[] = [
    { key: "frequencies", label: "Frequencies", emoji: "📡" },
    { key: "playlist", label: "Spotify Pack", emoji: "🎵" },
    { key: "expansion", label: "Music Expansion", emoji: "🌍" },
    ...(showRecommendations
      ? [{ key: "recommendations" as MusicTab, label: "For You", emoji: "✨" }]
      : []),
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-950 p-8 md:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(139,92,246,0.3),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(6,182,212,0.15),transparent_60%)]" />
        {/* Animated wave bars in background */}
        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-1 px-8 opacity-20">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="w-2 rounded-t-full bg-gradient-to-t from-purple-400 to-cyan-400"
              style={{
                height: `${20 + Math.sin(i * 0.5) * 30 + Math.random() * 20}px`,
                animationDelay: `${i * 0.05}s`,
              }}
            />
          ))}
        </div>
        <div className="relative z-10">
          <p className="text-sm font-medium uppercase tracking-widest text-cyan-400 mb-2">🎧 Tuned to You</p>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3">Music & Frequency Guide</h1>
          <p className="text-lg text-white/60 max-w-xl">
            Educational guide to brainwave states and your personalized music recommendations.
          </p>
        </div>
      </div>

      {/* Preference Input Section */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-950 via-violet-950 to-indigo-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(236,72,153,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(99,102,241,0.15),transparent_50%)]" />

        <div className="relative z-10 p-8 md:p-10">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-3xl">🎤</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">Tell us your taste</h2>
          </div>
          <p className="text-white/50 text-sm mb-8 ml-12">
            Share your favorite artists and genres so we can craft your perfect soundtrack.
          </p>

          {/* Artist Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { value: artist1, setter: setArtist1, placeholder: "Favorite artist/band 1", num: 1 },
              { value: artist2, setter: setArtist2, placeholder: "Favorite artist/band 2", num: 2 },
              { value: artist3, setter: setArtist3, placeholder: "Favorite artist/band 3", num: 3 },
            ].map((input) => (
              <div key={input.num} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-2xl opacity-0 group-focus-within:opacity-50 blur transition-opacity duration-300" />
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white/60">
                    {input.num}
                  </div>
                  <input
                    type="text"
                    value={input.value}
                    onChange={(e) => input.setter(e.target.value)}
                    placeholder={input.placeholder}
                    className="w-full rounded-2xl bg-white/5 border border-white/10 pl-14 pr-4 py-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all duration-300"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Genre Pills */}
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">Select your genres</p>
            <div className="flex flex-wrap gap-2">
              {ALL_GENRES.map((genre) => {
                const isSelected = selectedGenres.includes(genre.name);
                return (
                  <button
                    key={genre.name}
                    onClick={() => toggleGenre(genre.name)}
                    className={`relative rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                      isSelected
                        ? "text-white shadow-lg scale-105"
                        : "bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 hover:text-white/70"
                    }`}
                  >
                    {isSelected && (
                      <div className={`absolute inset-0 bg-gradient-to-r ${genre.color} rounded-full`} />
                    )}
                    <span className="relative z-10">{genre.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Curate Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleCurate}
              disabled={!hasInput || isAnalyzing}
              className={`relative group overflow-hidden rounded-2xl px-8 py-4 text-sm font-bold transition-all duration-300 ${
                hasInput && !isAnalyzing
                  ? "bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95"
                  : "bg-white/5 text-white/20 cursor-not-allowed"
              }`}
            >
              {isAnalyzing ? (
                <span className="flex items-center gap-3">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Analyzing your taste...
                </span>
              ) : (
                "Curate My Music"
              )}
            </button>
            {hasInput && !isAnalyzing && (
              <p className="text-xs text-white/30">
                {selectedGenres.length > 0 && `${selectedGenres.length} genre${selectedGenres.length > 1 ? "s" : ""} selected`}
                {selectedGenres.length > 0 && (artist1 || artist2 || artist3) && " · "}
                {[artist1, artist2, artist3].filter(Boolean).length > 0 &&
                  `${[artist1, artist2, artist3].filter(Boolean).length} artist${[artist1, artist2, artist3].filter(Boolean).length > 1 ? "s" : ""} added`}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 p-4 flex items-start gap-3">
        <span className="text-xl">⚠️</span>
        <p className="text-sm text-amber-800">
          Frequency information is educational only. This is not medical advice. Consult healthcare professionals for clinical needs.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 rounded-2xl bg-gray-100 p-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-300 ${
              activeTab === tab.key
                ? "bg-white text-gray-900 shadow-lg scale-[1.02]"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <span>{tab.emoji}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* FREQUENCIES TAB */}
      {activeTab === "frequencies" && (
        <div className="space-y-6">
          {/* Wave Visualization */}
          <div className="rounded-3xl bg-gradient-to-br from-gray-900 to-slate-900 p-8">
            <h3 className="text-lg font-bold text-white mb-6">🌊 Brainwave Spectrum</h3>
            <div className="space-y-4">
              {FREQUENCY_DATA.map((freq) => (
                <div key={freq.wave} className="group">
                  <div className="flex items-center gap-4 mb-1">
                    <span className="text-2xl">{freq.emoji}</span>
                    <span className="text-white font-bold w-16">{freq.wave}</span>
                    <span className="text-white/40 text-sm w-28">{freq.range}</span>
                    <div className="flex-1 h-8 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${freq.gradient} rounded-full transition-all duration-700 group-hover:shadow-lg`}
                        style={{ width: `${freq.barWidth}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Frequency Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {FREQUENCY_DATA.map((freq) => (
              <div
                key={freq.wave}
                className="group relative overflow-hidden rounded-2xl border border-white/10 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${freq.gradient} opacity-10 group-hover:opacity-20 transition-opacity`} />
                <div className="relative p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="h-12 w-12 rounded-2xl flex items-center justify-center text-2xl"
                      style={{ backgroundColor: `${freq.color}20` }}
                    >
                      {freq.emoji}
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold text-gray-900">{freq.wave} Waves</h3>
                      <span className="text-sm font-medium" style={{ color: freq.color }}>{freq.range}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">{freq.state}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wide text-gray-400">Best for</span>
                    <span className="text-xs text-gray-600 bg-gray-100 rounded-full px-3 py-1">{freq.use}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Use Case Pairings */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">🎯 Use Case Pairings</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {USE_CASE_PAIRINGS.map((p) => (
                <div key={p.label} className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className={`h-2 bg-gradient-to-r ${p.gradient}`} />
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{p.emoji}</span>
                      <span className="text-lg font-extrabold text-gray-900">{p.label}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{p.wave}</p>
                    <p className="text-xs text-gray-400">{p.tempo}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PLAYLIST TAB */}
      {activeTab === "playlist" && (
        <div className="space-y-8">
          {(["focus", "calm", "mood_lift", "sleep"] as const).map((type) => {
            const config = TYPE_CONFIG[type];
            const tracks = PLAYLIST_DATA.filter((t) => t.type === type);
            return (
              <div key={type}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{config.icon}</span>
                  <h3 className="text-xl font-extrabold text-gray-900">{config.label}</h3>
                  <div className={`h-1 flex-1 bg-gradient-to-r ${config.gradient} rounded-full opacity-30`} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {tracks.map((track) => (
                    <div
                      key={track.title}
                      className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                    >
                      {/* Album art placeholder */}
                      <div className={`h-32 bg-gradient-to-br ${config.gradient} relative`}>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                            <div className="h-12 w-12 rounded-full bg-white/30 flex items-center justify-center">
                              <span className="text-white text-2xl ml-1">▶</span>
                            </div>
                          </div>
                        </div>
                        <div className="absolute top-3 right-3 rounded-full bg-black/30 backdrop-blur-sm px-3 py-1 text-xs text-white font-medium">
                          {track.purpose}
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="text-sm font-bold text-gray-900 truncate">{track.title}</h4>
                        <p className="text-xs text-gray-400">{track.artist}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* EXPANSION TAB */}
      {activeTab === "expansion" && (
        <div className="space-y-6">
          <div className="rounded-3xl bg-gradient-to-br from-gray-900 to-slate-900 p-8">
            <h3 className="text-2xl font-extrabold text-white mb-2">🌍 Expand Your Musical Palette</h3>
            <p className="text-white/50 text-sm">Based on your indie preference, here are genres and artists to explore.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {GENRE_EXPANSION.map((rec) => (
              <div key={rec.genre} className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className={`h-28 bg-gradient-to-br ${rec.gradient} relative`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-5xl opacity-50 group-hover:opacity-80 group-hover:scale-110 transition-all">{rec.emoji}</span>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <h4 className="text-xl font-extrabold text-white drop-shadow-lg">{rec.genre}</h4>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {rec.artists.map((artist) => (
                      <span key={artist} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                        {artist}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">{rec.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RECOMMENDATIONS TAB */}
      {activeTab === "recommendations" && showRecommendations && (
        <div className="space-y-8">
          {/* Recommendations Header */}
          <div className="rounded-3xl bg-gradient-to-br from-gray-900 to-slate-900 p-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">✨</span>
              <h3 className="text-2xl font-extrabold text-white">Your Personalized Recommendations</h3>
            </div>
            <p className="text-white/50 text-sm ml-12">
              Curated based on
              {[artist1, artist2, artist3].filter(Boolean).length > 0 && (
                <span>
                  {" your love of "}
                  <span className="text-white/80 font-semibold">
                    {[artist1, artist2, artist3].filter(Boolean).join(", ")}
                  </span>
                </span>
              )}
              {selectedGenres.length > 0 && (
                <span>
                  {[artist1, artist2, artist3].filter(Boolean).length > 0 ? " and " : " "}
                  <span className="text-white/80 font-semibold">
                    {selectedGenres.join(", ")}
                  </span>
                </span>
              )}
              .
            </p>
          </div>

          {/* Recommendation Categories */}
          {RECOMMENDATION_CATEGORIES.map((category) => (
            <div
              key={category.id}
              className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              {/* Category Header */}
              <div className={`bg-gradient-to-r ${category.gradient} p-5`}>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{category.emoji}</span>
                  <h3 className="text-xl font-extrabold text-white drop-shadow">{category.title}</h3>
                </div>
              </div>

              {/* Track Rows */}
              <div className="divide-y divide-gray-100">
                {category.tracks.map((track, idx) => (
                  <div
                    key={track.title}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors duration-200"
                  >
                    {/* Play Button */}
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors cursor-pointer hover:scale-110 active:scale-95">
                      <span className="text-gray-500 text-sm ml-0.5">▶</span>
                    </div>

                    {/* Track Number */}
                    <span className="text-xs font-bold text-gray-300 w-4">{idx + 1}</span>

                    {/* Track Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-gray-900 truncate">{track.title}</h4>
                      <p className="text-xs text-gray-400 truncate">{track.artist}</p>
                    </div>

                    {/* BPM / Wave Badge */}
                    <div className={`flex-shrink-0 rounded-full bg-gradient-to-r ${category.gradient} px-3 py-1`}>
                      <span className="text-xs font-bold text-white">{track.bpm}</span>
                    </div>

                    {/* Why It Works */}
                    <p className="hidden lg:block text-xs text-gray-400 max-w-[220px] truncate" title={track.detail}>
                      {track.detail}
                    </p>
                  </div>
                ))}
              </div>

              {/* Mobile detail view */}
              <div className="lg:hidden divide-y divide-gray-50 bg-gray-50/50">
                {category.tracks.map((track) => (
                  <div key={`detail-${track.title}`} className="px-4 py-2">
                    <p className="text-xs text-gray-500 italic">
                      <span className="font-semibold text-gray-600">{track.title}:</span> {track.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Spotify-Ready Playlists */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <svg className="h-8 w-8 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
              </svg>
              <h3 className="text-2xl font-extrabold text-gray-900">Spotify-Ready Playlists</h3>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              Copy these playlists and search for them on Spotify to build your perfect collection.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SPOTIFY_PLAYLISTS.map((playlist) => (
                <div
                  key={playlist.name}
                  className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Spotify-colored header */}
                  <div className={`bg-gradient-to-br ${playlist.gradient} p-5 relative`}>
                    <div className="absolute top-3 right-3 opacity-20">
                      <svg className="h-10 w-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-extrabold text-white">{playlist.name}</h4>
                    <p className="text-xs text-white/60 mt-1">{playlist.tracks.length} tracks</p>
                  </div>

                  {/* Track List */}
                  <div className="p-4">
                    <div className="space-y-2 mb-4">
                      {playlist.tracks.map((track, idx) => (
                        <div key={track} className="flex items-center gap-3 text-sm">
                          <span className="text-xs text-gray-300 font-mono w-5 text-right">{idx + 1}</span>
                          <span className="text-gray-700 truncate">{track}</span>
                        </div>
                      ))}
                    </div>

                    {/* Copy Button */}
                    <button
                      onClick={() => copyPlaylist(playlist.name, playlist.tracks)}
                      className={`w-full rounded-xl py-3 text-sm font-bold transition-all duration-300 ${
                        copiedPlaylist === playlist.name
                          ? "bg-green-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-green-500 hover:text-white active:scale-95"
                      }`}
                    >
                      {copiedPlaylist === playlist.name ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          Copied!
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Copy Playlist
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
