"use client";

import { useState } from "react";

type MusicTab = "frequencies" | "playlist" | "expansion";

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

export default function MusicPage() {
  const [activeTab, setActiveTab] = useState<MusicTab>("frequencies");

  const tabs: { key: MusicTab; label: string; emoji: string }[] = [
    { key: "frequencies", label: "Frequencies", emoji: "📡" },
    { key: "playlist", label: "Spotify Pack", emoji: "🎵" },
    { key: "expansion", label: "Music Expansion", emoji: "🌍" },
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
            {tab.label}
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
    </div>
  );
}
