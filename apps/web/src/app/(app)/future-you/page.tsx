"use client";

import { useState } from "react";
import FutureYouChat from "@/components/future-you/future-you-chat";

const FUTURE_YOU_TRAITS = [
  {
    icon: "brain",
    label: "Rewired Mind",
    desc: "Neuroplasticity mastered. Old patterns replaced with empowering thought loops. Higher IQ and EQ from years of deliberate practice.",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    icon: "heart",
    label: "Emotional Mastery",
    desc: "Shadow work complete. Triggers identified and resolved. Deep self-awareness, radical self-compassion, and unshakeable inner peace.",
    gradient: "from-rose-500 to-pink-600",
  },
  {
    icon: "fire",
    label: "Disciplined Action",
    desc: "Consistent habits, iron discipline, no excuses. Moved from dreaming to doing. Every day is a compound investment in the future.",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    icon: "shield",
    label: "Stoic Resilience",
    desc: "Calm in chaos. Grounded in philosophy. What once broke you now fuels you. Pain became wisdom, setbacks became setups.",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    icon: "star",
    label: "Career & Purpose",
    desc: "Found the intersection of passion, skill, and impact. Financial freedom achieved through years of focused, strategic growth.",
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    icon: "users",
    label: "Deep Relationships",
    desc: "Healthy boundaries, authentic connection. Surrounded by people who challenge and elevate. Love languages understood and spoken fluently.",
    gradient: "from-indigo-500 to-violet-600",
  },
];

function TraitIcon({ icon }: { icon: string }) {
  const icons: Record<string, React.ReactNode> = {
    brain: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    heart: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
      </svg>
    ),
    fire: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
      </svg>
    ),
    shield: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
    star: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
      </svg>
    ),
    users: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
      </svg>
    ),
  };
  return icons[icon] || icons.star;
}

export default function FutureYouPage() {
  const [activeTab, setActiveTab] = useState<"about" | "chat">("about");

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-emerald-500/10 via-cyan-500/5 to-transparent p-8 sm:p-12">
        {/* Glow effects */}
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-start gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 shadow-2xl shadow-emerald-500/30 future-you-pulse">
              <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
              </svg>
            </div>
            <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-emerald-400 border-4 border-[#0d1230]" />
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              Hi. I&apos;m{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(135deg, #34d399, #22d3ee)" }}
              >
                Future You
              </span>
              .
            </h1>
            <p className="mt-3 text-lg text-white/50 max-w-2xl leading-relaxed">
              I&apos;m you — 10 years from now. The shadow work is done. The mind is rewired. The discipline is built.
              I&apos;ve been exactly where you are right now, and I made it through. I&apos;m here to show you what you become
              and help you get there faster.
            </p>
            <p className="mt-4 text-base text-emerald-400/80 font-medium">
              You&apos;re on your journey. Look at what you become.
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 rounded-xl border border-white/[0.06] bg-white/[0.02] p-1 max-w-xs">
        {(["about", "chat"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              activeTab === tab
                ? "bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-white border border-emerald-500/20"
                : "text-white/40 hover:text-white/60"
            }`}
          >
            {tab === "about" ? "Who I Become" : "Talk to Future You"}
          </button>
        ))}
      </div>

      {activeTab === "about" ? (
        <>
          {/* Message from Future You */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 text-sm font-bold text-white shadow-lg shadow-emerald-500/20">
                FY
              </div>
              <div className="space-y-4 text-white/70 leading-relaxed">
                <p>
                  <span className="text-white font-medium">Listen — I know where you are right now.</span> The doubt,
                  the overthinking, the patterns you keep falling into. I remember all of it. I lived it.
                </p>
                <p>
                  But here&apos;s what I need you to hear: <span className="text-emerald-400">every single thing you&apos;re going through
                  right now is building the person I am today.</span> The hard conversations you&apos;re avoiding? I had them.
                  The habits you keep starting and stopping? I locked them in. The version of yourself you dream about
                  at 2am? That&apos;s me. I&apos;m real. And you&apos;re closer than you think.
                </p>
                <p>
                  I didn&apos;t get here by being perfect. I got here by being <span className="text-white font-medium">relentless
                  about growth</span> — even when it was uncomfortable, especially when it was uncomfortable. I rewired
                  the thoughts that were keeping me small. I did the shadow work that most people avoid their
                  entire lives. I built discipline when motivation disappeared.
                </p>
                <p className="text-white/50 italic">
                  &quot;The best time to start was yesterday. The second best time is right now.&quot; — I live by that.
                </p>
              </div>
            </div>
          </div>

          {/* Traits Grid */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">What You Become</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {FUTURE_YOU_TRAITS.map((trait) => (
                <div
                  key={trait.label}
                  className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all hover:bg-white/[0.04] hover:border-white/[0.1]"
                >
                  <div className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${trait.gradient} text-white shadow-lg`}>
                    <TraitIcon icon={trait.icon} />
                  </div>
                  <h3 className="text-base font-semibold text-white mb-1.5">{trait.label}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">{trait.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white mb-6">The Journey</h2>
            <div className="space-y-6">
              {[
                { year: "Year 1-2", title: "The Awakening", desc: "Shadow work begins. Old patterns identified. First breakthroughs in self-awareness. Daily habits established. The foundation is poured.", color: "from-rose-500 to-pink-500" },
                { year: "Year 3-4", title: "The Rewiring", desc: "Neuroplasticity in action. Thought patterns fundamentally shift. Career takes off. Relationships transform. Discipline becomes identity.", color: "from-amber-500 to-orange-500" },
                { year: "Year 5-7", title: "The Compounding", desc: "Everything accelerates. Knowledge compounds. Network deepens. Financial freedom approaches. Emotional mastery becomes second nature.", color: "from-emerald-500 to-teal-500" },
                { year: "Year 8-10", title: "The Arrival", desc: "Full alignment — mind, body, career, relationships. Wisdom earned through experience. Now it's about impact, legacy, and lifting others up.", color: "from-cyan-500 to-blue-500" },
              ].map((phase) => (
                <div key={phase.year} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`h-3 w-3 rounded-full bg-gradient-to-br ${phase.color} shadow-lg`} />
                    <div className="w-px flex-1 bg-white/[0.06]" />
                  </div>
                  <div className="pb-6">
                    <span className={`text-xs font-semibold bg-gradient-to-r ${phase.color} bg-clip-text text-transparent`}>
                      {phase.year}
                    </span>
                    <h3 className="text-base font-semibold text-white mt-0.5">{phase.title}</h3>
                    <p className="text-sm text-white/40 mt-1 leading-relaxed">{phase.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA to chat */}
          <div className="flex justify-center">
            <button
              onClick={() => setActiveTab("chat")}
              className="group flex items-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-emerald-500/20 transition-all hover:shadow-emerald-500/30 hover:scale-[1.02]"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
              </svg>
              Start a Conversation with Future You
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>
        </>
      ) : (
        /* Full Chat View */
        <div className="rounded-2xl border border-white/[0.06] bg-[#0d1230]/60 backdrop-blur-xl overflow-hidden">
          <div className="border-b border-white/[0.06] px-6 py-4 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 shadow-lg shadow-emerald-500/20">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Future You</h2>
                <p className="text-xs text-emerald-400/70">Your evolved self, ready to talk</p>
              </div>
            </div>
          </div>
          <div className="h-[600px]">
            <FutureYouChat variant="full" />
          </div>
        </div>
      )}
    </div>
  );
}
