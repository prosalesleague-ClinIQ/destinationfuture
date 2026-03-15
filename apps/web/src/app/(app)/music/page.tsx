"use client";

import { useState } from "react";

type MusicTab = "frequencies" | "playlist" | "expansion";

const FREQUENCY_DATA = [
  { wave: "Delta", range: "0.5 \u2013 4 Hz", state: "Deep sleep, healing, regeneration", use: "Sleep, physical recovery", color: "#6366f1" },
  { wave: "Theta", range: "4 \u2013 8 Hz", state: "Meditation, creativity, dream state", use: "Meditation, creative flow, light sleep", color: "#8b5cf6" },
  { wave: "Alpha", range: "8 \u2013 13 Hz", state: "Relaxed awareness, calm focus", use: "Calm, stress reduction, learning", color: "#06b6d4" },
  { wave: "Beta", range: "13 \u2013 30 Hz", state: "Active thinking, problem-solving", use: "Focus, productivity, mental tasks", color: "#22c55e" },
  { wave: "Gamma", range: "30 \u2013 100 Hz", state: "Peak awareness, insight, flow", use: "Peak performance, insight, happiness", color: "#f59e0b" },
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
  { title: "Gymnop\u00e9die No.1", artist: "Erik Satie", purpose: "Deep sleep", type: "sleep", search: "Erik Satie Gymnopedie" },
];

export default function MusicPage() {
  const [activeTab, setActiveTab] = useState<MusicTab>("frequencies");

  const tabs: { key: MusicTab; label: string }[] = [
    { key: "frequencies", label: "Frequencies" },
    { key: "playlist", label: "Spotify Pack" },
    { key: "expansion", label: "Music Expansion" },
  ];

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold text-surface-900 mb-2">Music & Frequency Guide</h1>
      <p className="text-surface-300 mb-6">Educational guide to brainwave states and your personalized music recommendations.</p>

      <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 mb-6">
        <p className="text-xs text-amber-800">
          Frequency information is educational only. This is not medical advice. Consult healthcare professionals for clinical needs.
        </p>
      </div>

      <div className="flex gap-1 rounded-lg bg-surface-100 p-1 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-white text-surface-900 shadow-sm"
                : "text-surface-300 hover:text-surface-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "frequencies" && (
        <div className="space-y-4">
          {FREQUENCY_DATA.map((freq) => (
            <div key={freq.wave} className="rounded-xl bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: freq.color }} />
                <h3 className="text-lg font-semibold text-surface-900">{freq.wave} Waves</h3>
                <span className="text-sm text-surface-300">{freq.range}</span>
              </div>
              <p className="text-sm text-surface-700 mb-2">{freq.state}</p>
              <p className="text-xs text-surface-300">Best for: {freq.use}</p>
            </div>
          ))}

          <div className="rounded-xl bg-white p-6 shadow-sm mt-6">
            <h3 className="text-lg font-semibold mb-4">Use Case Pairings</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { label: "Peace", wave: "Alpha + Theta", tempo: "60-80 BPM" },
                { label: "Calm", wave: "Alpha", tempo: "60-90 BPM" },
                { label: "Focus", wave: "Beta + Low Gamma", tempo: "100-120 BPM" },
                { label: "Love", wave: "Theta + Alpha", tempo: "70-100 BPM" },
                { label: "Happiness", wave: "Gamma + Beta", tempo: "110-130 BPM" },
                { label: "Sleep", wave: "Delta + Theta", tempo: "40-60 BPM" },
              ].map((p) => (
                <div key={p.label} className="rounded-lg bg-surface-50 p-3">
                  <div className="text-sm font-semibold text-brand-600">{p.label}</div>
                  <div className="text-xs text-surface-700">{p.wave}</div>
                  <div className="text-xs text-surface-300">{p.tempo}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "playlist" && (
        <div className="space-y-3">
          {["focus", "calm", "mood_lift", "sleep"].map((type) => (
            <div key={type} className="mb-6">
              <h3 className="text-sm font-semibold text-surface-900 mb-3 uppercase tracking-wide">
                {type === "mood_lift" ? "Mood Lift" : type.charAt(0).toUpperCase() + type.slice(1)}
              </h3>
              <div className="space-y-2">
                {PLAYLIST_DATA.filter((t) => t.type === type).map((track) => (
                  <div key={track.title} className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100">
                      <span className="text-brand-600 text-lg">\u266A</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-surface-900">{track.title}</div>
                      <div className="text-xs text-surface-300">{track.artist}</div>
                    </div>
                    <span className="rounded-full bg-surface-100 px-2 py-1 text-xs text-surface-700">{track.purpose}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "expansion" && (
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Expand Your Musical Palette</h3>
          <p className="text-sm text-surface-300 mb-6">Based on your indie preference, here are genres and artists to explore.</p>
          <div className="space-y-4">
            {[
              { genre: "Dream Pop", artists: ["Beach House", "Cocteau Twins", "Alvvays"], reason: "Ethereal textures that complement your introspective nature" },
              { genre: "Neo-Soul", artists: ["Erykah Badu", "D'Angelo", "Anderson .Paak"], reason: "Emotional depth with groove \u2014 connects head and heart" },
              { genre: "Ambient Electronic", artists: ["Tycho", "Bonobo", "Boards of Canada"], reason: "Focus-friendly atmospheres for creative work" },
              { genre: "Jazz Fusion", artists: ["Kamasi Washington", "Snarky Puppy", "Robert Glasper"], reason: "Complex arrangements that engage your analytical mind" },
            ].map((rec) => (
              <div key={rec.genre} className="rounded-lg border border-surface-200 p-4">
                <div className="text-sm font-semibold text-surface-900 mb-1">{rec.genre}</div>
                <div className="text-xs text-brand-600 mb-2">{rec.artists.join(" \u2022 ")}</div>
                <p className="text-xs text-surface-300">{rec.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
