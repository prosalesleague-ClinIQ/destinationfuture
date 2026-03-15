"use client";

import { useState } from "react";

type FilmsTab = "films" | "tv" | "taste";

const FILM_RECS = [
  {
    title: "Eternal Sunshine of the Spotless Mind",
    year: 2004,
    genres: ["Sci-Fi", "Romance", "Drama"],
    score: 95,
    reason: "Your introspective nature and emotional depth make this exploration of memory and love a mirror for your own journey of self-discovery.",
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    title: "Interstellar",
    year: 2014,
    genres: ["Sci-Fi", "Adventure", "Drama"],
    score: 92,
    reason: "The blend of hard science and raw human emotion speaks to your analytical mind that craves deeper meaning beneath the surface.",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    title: "Parasite",
    year: 2019,
    genres: ["Thriller", "Drama", "Dark Comedy"],
    score: 90,
    reason: "Your appreciation for layered storytelling and social awareness makes this genre-bending masterpiece a perfect match.",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    title: "The Grand Budapest Hotel",
    year: 2014,
    genres: ["Comedy", "Adventure", "Drama"],
    score: 88,
    reason: "Your minimalist aesthetic sensibility meets maximalist storytelling. The visual precision and dry wit align with your humor style.",
    gradient: "from-rose-400 to-pink-600",
  },
  {
    title: "Arrival",
    year: 2016,
    genres: ["Sci-Fi", "Drama", "Mystery"],
    score: 93,
    reason: "A film about communication, time, and acceptance — themes that resonate with your desire to understand the deeper patterns of life.",
    gradient: "from-violet-500 to-purple-600",
  },
];

const TV_RECS = [
  {
    title: "Severance",
    year: "2022–",
    genres: ["Sci-Fi", "Thriller", "Drama"],
    score: 96,
    reason: "The exploration of identity, work-life separation, and corporate dystopia speaks directly to your questioning of modern structures.",
    gradient: "from-slate-600 to-zinc-800",
    seasons: 2,
  },
  {
    title: "Fleabag",
    year: "2016–2019",
    genres: ["Comedy", "Drama"],
    score: 94,
    reason: "Raw honesty, fourth-wall breaks, and emotional vulnerability match your appreciation for authentic, unfiltered expression.",
    gradient: "from-rose-500 to-red-600",
    seasons: 2,
  },
  {
    title: "Dark",
    year: "2017–2020",
    genres: ["Sci-Fi", "Thriller", "Mystery"],
    score: 91,
    reason: "Complex time loops and philosophical depth feed your analytical side. The show rewards exactly the kind of deep thinking you naturally do.",
    gradient: "from-yellow-500 to-amber-600",
    seasons: 3,
  },
  {
    title: "The Bear",
    year: "2022–",
    genres: ["Drama", "Comedy"],
    score: 89,
    reason: "The intensity, craftsmanship, and pursuit of excellence mirrors your own drive for meaningful work and authentic connection.",
    gradient: "from-blue-500 to-indigo-600",
    seasons: 3,
  },
  {
    title: "Arcane",
    year: "2021–",
    genres: ["Animation", "Sci-Fi", "Action"],
    score: 93,
    reason: "Stunning visual artistry meets deeply emotional storytelling. The themes of division, identity, and family resonate with your values.",
    gradient: "from-purple-500 to-fuchsia-600",
    seasons: 2,
  },
];

const TASTE_DNA = [
  { genre: "Psychological Thriller", pct: 85, gradient: "from-red-500 to-rose-600", emoji: "🧠" },
  { genre: "Sci-Fi / Speculative", pct: 82, gradient: "from-cyan-400 to-blue-500", emoji: "🚀" },
  { genre: "Character-Driven Drama", pct: 78, gradient: "from-amber-400 to-orange-500", emoji: "🎭" },
  { genre: "Dark Comedy", pct: 72, gradient: "from-emerald-400 to-teal-500", emoji: "😈" },
  { genre: "Visual / Art House", pct: 65, gradient: "from-purple-400 to-violet-500", emoji: "🎨" },
  { genre: "Mystery / Puzzle Box", pct: 60, gradient: "from-indigo-400 to-blue-500", emoji: "🔍" },
  { genre: "Romantic Drama", pct: 45, gradient: "from-pink-400 to-rose-500", emoji: "💕" },
  { genre: "Action / Adventure", pct: 30, gradient: "from-slate-400 to-gray-500", emoji: "⚔️" },
];

function ScoreCircle({ score, size = 56 }: { score: number; size?: number }) {
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 93 ? "stroke-emerald-400" : score >= 90 ? "stroke-cyan-400" : score >= 85 ? "stroke-amber-400" : "stroke-gray-400";

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth="4" className="stroke-white/20" />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          strokeWidth="4" strokeLinecap="round"
          className={color}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-extrabold text-white">{score}</span>
      </div>
    </div>
  );
}

export default function FilmsPage() {
  const [activeTab, setActiveTab] = useState<FilmsTab>("films");

  const tabs: { key: FilmsTab; label: string; emoji: string }[] = [
    { key: "films", label: "Films", emoji: "🎬" },
    { key: "tv", label: "TV Shows", emoji: "📺" },
    { key: "taste", label: "Taste DNA", emoji: "🧬" },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-950 via-slate-900 to-zinc-900 p-8 md:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(139,92,246,0.2),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(244,114,182,0.15),transparent_60%)]" />
        {/* Film strip decoration */}
        <div className="absolute top-4 right-8 flex gap-2 opacity-15">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-8 h-10 rounded bg-white/30 border-2 border-white/20" />
          ))}
        </div>
        <div className="relative z-10">
          <p className="text-sm font-medium uppercase tracking-widest text-purple-400 mb-2">🎞️ Curated For You</p>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3">Film & TV Profile</h1>
          <p className="text-lg text-white/50 max-w-xl">
            Your taste is a fingerprint. Here is what your personality reveals about the stories that move you.
          </p>
        </div>
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

      {/* FILMS TAB */}
      {activeTab === "films" && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">🎬</span>
            <h2 className="text-2xl font-extrabold text-gray-900">Recommended Films</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FILM_RECS.map((film) => (
              <div
                key={film.title}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer"
              >
                {/* Poster background */}
                <div className={`h-72 bg-gradient-to-br ${film.gradient} relative`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  {/* Score circle */}
                  <div className="absolute top-4 right-4">
                    <ScoreCircle score={film.score} />
                  </div>
                  {/* Content overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {film.genres.map((g) => (
                        <span key={g} className="rounded-full bg-white/20 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wide">
                          {g}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-lg font-extrabold text-white leading-tight mb-1">{film.title}</h3>
                    <span className="text-sm text-white/50">{film.year}</span>
                  </div>
                </div>
                {/* Reason */}
                <div className="bg-white p-4">
                  <p className="text-xs text-gray-500 leading-relaxed">{film.reason}</p>
                </div>
                {/* Hover line */}
                <div className={`h-1 bg-gradient-to-r ${film.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TV TAB */}
      {activeTab === "tv" && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">📺</span>
            <h2 className="text-2xl font-extrabold text-gray-900">Recommended TV Shows</h2>
          </div>
          <div className="space-y-5">
            {TV_RECS.map((show) => (
              <div
                key={show.title}
                className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
              >
                <div className="flex">
                  {/* Side poster */}
                  <div className={`w-40 md:w-52 bg-gradient-to-br ${show.gradient} relative flex-shrink-0`}>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="mb-2">
                          <ScoreCircle score={show.score} size={64} />
                        </div>
                        <span className="text-xs text-white/70 font-medium">{show.seasons} Season{show.seasons > 1 ? "s" : ""}</span>
                      </div>
                    </div>
                  </div>
                  {/* Content */}
                  <div className="flex-1 p-6">
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {show.genres.map((g) => (
                        <span key={g} className={`rounded-full bg-gradient-to-r ${show.gradient} px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wide`}>
                          {g}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-xl font-extrabold text-gray-900 mb-1">{show.title}</h3>
                    <span className="text-sm text-gray-400 mb-3 block">{show.year}</span>
                    <p className="text-sm text-gray-500 leading-relaxed">{show.reason}</p>
                  </div>
                </div>
                <div className={`h-1 bg-gradient-to-r ${show.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TASTE DNA TAB */}
      {activeTab === "taste" && (
        <div className="space-y-6">
          {/* DNA Hero */}
          <div className="rounded-3xl bg-gradient-to-br from-gray-950 to-slate-900 p-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🧬</span>
              <h2 className="text-2xl font-extrabold text-white">Your Taste DNA</h2>
            </div>
            <p className="text-white/40 text-sm mb-8">What your personality says about the stories you gravitate toward.</p>

            <div className="space-y-5">
              {TASTE_DNA.map((genre) => (
                <div key={genre.genre} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{genre.emoji}</span>
                      <span className="text-sm font-bold text-white">{genre.genre}</span>
                    </div>
                    <span className="text-sm font-extrabold text-white/70">{genre.pct}%</span>
                  </div>
                  <div className="h-4 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${genre.gradient} rounded-full transition-all duration-1000 group-hover:shadow-lg`}
                      style={{ width: `${genre.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Taste Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="rounded-2xl bg-white border border-gray-100 shadow-md p-6 hover:shadow-xl transition-shadow">
              <span className="text-3xl mb-3 block">🎯</span>
              <h4 className="text-sm font-bold text-gray-900 mb-2">Your Sweet Spot</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                You thrive on films that blend intellectual complexity with emotional depth. Puzzle-box narratives with heart are your genre.
              </p>
            </div>
            <div className="rounded-2xl bg-white border border-gray-100 shadow-md p-6 hover:shadow-xl transition-shadow">
              <span className="text-3xl mb-3 block">⚡</span>
              <h4 className="text-sm font-bold text-gray-900 mb-2">Growth Edge</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Try leaning into romantic dramas and lighter fare. Not everything needs to be a mind-bender — sometimes a simple love story hits hardest.
              </p>
            </div>
            <div className="rounded-2xl bg-white border border-gray-100 shadow-md p-6 hover:shadow-xl transition-shadow">
              <span className="text-3xl mb-3 block">🌟</span>
              <h4 className="text-sm font-bold text-gray-900 mb-2">Director Matches</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Denis Villeneuve, Bong Joon-ho, Phoebe Waller-Bridge, and Christopher Nolan consistently create work that resonates with your taste profile.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
