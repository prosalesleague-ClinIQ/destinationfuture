"use client";

const LOVE_LANGUAGES = [
  {
    rank: 1,
    name: "Quality Time",
    emoji: "⏰",
    pct: 35,
    gradient: "from-blue-500 to-indigo-600",
    lightBg: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-700",
    why: "You value presence over presents. Being fully seen and heard in a shared moment is how you feel most loved. Undivided attention makes your heart sing.",
    askFor: "Schedule device-free time together. Ask for dedicated one-on-one evenings where the focus is simply being together — walks, cooking, stargazing.",
    give: "Put your phone away when they're talking. Plan surprises that center around shared experiences: concerts, hikes, a weekend road trip with no agenda.",
    avoid: "Canceling plans repeatedly, being distracted during conversations, or prioritizing screen time over face time. These feel like rejection.",
  },
  {
    rank: 2,
    name: "Words of Affirmation",
    emoji: "💬",
    pct: 25,
    gradient: "from-rose-400 to-pink-600",
    lightBg: "bg-rose-50",
    borderColor: "border-rose-200",
    textColor: "text-rose-700",
    why: "Hearing 'I believe in you' or 'I'm proud of you' hits differently for you. Words aren't just sounds — they're emotional anchors that stay with you long after they're spoken.",
    askFor: "Tell your partner you need verbal encouragement. Ask them to leave notes, send thoughtful texts, or simply say what they appreciate about you out loud.",
    give: "Be specific with compliments. Instead of 'you look nice,' try 'the way you handled that situation showed real strength.' Name what you admire.",
    avoid: "Harsh criticism, sarcasm that cuts, or the silent treatment. Careless words can wound deeply and take much longer to heal.",
  },
  {
    rank: 3,
    name: "Physical Touch",
    emoji: "💜",
    pct: 20,
    gradient: "from-purple-500 to-violet-600",
    lightBg: "bg-purple-50",
    borderColor: "border-purple-200",
    textColor: "text-purple-700",
    why: "A hand on your shoulder, a long hug, sitting close together — these small physical connections make you feel grounded and safe in a relationship.",
    askFor: "Let your partner know that physical closeness matters. Hold hands more often, sit closer on the couch, initiate hugs — especially during stress.",
    give: "Be intentional about non-sexual touch: a hand on their back as you pass, playing with their hair, or a long embrace when they come home.",
    avoid: "Physical neglect or going long periods without affection. For you, a lack of touch can feel like emotional distance even when words are flowing.",
  },
  {
    rank: 4,
    name: "Acts of Service",
    emoji: "🤝",
    pct: 12,
    gradient: "from-emerald-400 to-teal-600",
    lightBg: "bg-emerald-50",
    borderColor: "border-emerald-200",
    textColor: "text-emerald-700",
    why: "When someone takes a task off your plate or handles something without being asked, you feel cared for. Actions speak louder than words in your world.",
    askFor: "Be specific about what help looks like. Instead of 'help more,' try 'it would mean a lot if you handled dinner tonight so I can decompress.'",
    give: "Notice what burdens them and step in. Fill up their gas tank, organize their desk, make their coffee the way they like it. Small acts, big love.",
    avoid: "Making promises and not following through, or being lazy about shared responsibilities. Broken commitments feel like broken trust.",
  },
  {
    rank: 5,
    name: "Receiving Gifts",
    emoji: "🎁",
    pct: 8,
    gradient: "from-amber-400 to-yellow-500",
    lightBg: "bg-amber-50",
    borderColor: "border-amber-200",
    textColor: "text-amber-700",
    why: "It's not about materialism — it's about the thought behind the gesture. A small token that shows someone was thinking about you can light up your entire week.",
    askFor: "Let them know that even small, thoughtful gifts matter. A wildflower picked on a walk or a book that made them think of you is more than enough.",
    give: "Keep a running note of things they mention wanting. The magic is in the 'you remembered' moment. Surprise them with something that shows you listen.",
    avoid: "Forgetting important occasions or giving generic, last-minute gifts. It's not about the price — it's about the thoughtfulness.",
  },
];

const COMPATIBILITY_TIPS = [
  { tip: "If your partner's top language differs from yours, learn to 'speak' theirs even if it doesn't come naturally. Love is a skill, not just a feeling.", emoji: "🔄" },
  { tip: "When conflict arises, default to your partner's primary language to de-escalate. It signals safety faster than anything else.", emoji: "🛡️" },
  { tip: "Your top two languages (Quality Time + Words of Affirmation) suggest you crave emotional presence. Seek partners who are emotionally available and communicative.", emoji: "💡" },
];

export default function LoveLanguagesPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-900 via-pink-900 to-purple-900 p-8 md:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(244,114,182,0.3),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(168,85,247,0.2),transparent_60%)]" />
        {/* Floating hearts */}
        <div className="absolute top-8 right-12 text-4xl opacity-20 animate-pulse">💕</div>
        <div className="absolute top-20 right-32 text-2xl opacity-15 animate-pulse" style={{ animationDelay: "0.5s" }}>💗</div>
        <div className="absolute bottom-12 right-20 text-3xl opacity-20 animate-pulse" style={{ animationDelay: "1s" }}>💝</div>
        <div className="relative z-10">
          <p className="text-sm font-medium uppercase tracking-widest text-pink-300 mb-2">💖 How You Love</p>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3">Your Love Languages</h1>
          <p className="text-lg text-white/60 max-w-xl">
            Understanding how you give and receive love is the foundation of every meaningful relationship.
          </p>
        </div>
      </div>

      {/* Overview Bars */}
      <div className="rounded-3xl bg-white/80 backdrop-blur-xl border border-white/50 shadow-xl p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Your Love Language Breakdown</h2>
        <div className="space-y-4">
          {LOVE_LANGUAGES.map((lang) => (
            <div key={lang.name} className="group">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{lang.emoji}</span>
                  <span className="text-sm font-bold text-gray-900">{lang.name}</span>
                </div>
                <span className="text-sm font-extrabold text-gray-700">{lang.pct}%</span>
              </div>
              <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${lang.gradient} rounded-full transition-all duration-1000 group-hover:shadow-lg`}
                  style={{ width: `${lang.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Language Cards */}
      <div className="space-y-6">
        {LOVE_LANGUAGES.map((lang) => (
          <div
            key={lang.name}
            className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
          >
            {/* Gradient accent */}
            <div className={`absolute top-0 left-0 right-0 h-48 bg-gradient-to-br ${lang.gradient} opacity-[0.06] group-hover:opacity-[0.1] transition-opacity`} />

            <div className="relative p-6 md:p-8">
              <div className="flex items-start gap-6">
                {/* Rank Circle */}
                <div className="flex flex-col items-center gap-2 flex-shrink-0">
                  <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${lang.gradient} text-white shadow-lg`}>
                    <span className="text-3xl">{lang.emoji}</span>
                  </div>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${lang.gradient} text-white text-lg font-extrabold shadow-md`}>
                    {lang.rank}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-2xl font-extrabold text-gray-900">{lang.name}</h3>
                    <span className={`rounded-full bg-gradient-to-r ${lang.gradient} px-3 py-1 text-xs font-bold text-white shadow-sm`}>
                      #{lang.rank}
                    </span>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600">
                      {lang.pct}%
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-6 leading-relaxed">{lang.why}</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className={`rounded-2xl ${lang.lightBg} border ${lang.borderColor} p-4`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span>🙏</span>
                        <h4 className={`text-sm font-bold ${lang.textColor}`}>What to Ask For</h4>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">{lang.askFor}</p>
                    </div>

                    <div className={`rounded-2xl ${lang.lightBg} border ${lang.borderColor} p-4`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span>🎯</span>
                        <h4 className={`text-sm font-bold ${lang.textColor}`}>What to Give</h4>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">{lang.give}</p>
                    </div>

                    <div className="rounded-2xl bg-red-50 border border-red-200 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span>🚫</span>
                        <h4 className="text-sm font-bold text-red-700">What to Avoid</h4>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">{lang.avoid}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom gradient line */}
            <div className={`h-1 bg-gradient-to-r ${lang.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
          </div>
        ))}
      </div>

      {/* Compatibility Tips */}
      <div className="rounded-3xl bg-gradient-to-br from-rose-900 via-pink-900 to-purple-900 p-8 md:p-10">
        <h2 className="text-2xl font-extrabold text-white mb-2">💡 Compatibility Tips</h2>
        <p className="text-white/50 text-sm mb-6">Practical wisdom for deeper connection.</p>
        <div className="space-y-4">
          {COMPATIBILITY_TIPS.map((ct, i) => (
            <div key={i} className="flex items-start gap-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 p-5">
              <span className="text-2xl flex-shrink-0">{ct.emoji}</span>
              <p className="text-sm text-white/80 leading-relaxed">{ct.tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
