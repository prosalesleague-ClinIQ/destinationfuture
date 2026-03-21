"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { db, type UserProfile } from "@/lib/db";
import { calculatePersonalYear } from "@destination-future/core";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/**
 * Generate monthly guidance based on personal year number.
 * Each personal year carries a distinct energy that colours every month differently.
 */
function generateMonthlyBreakdown(personalYearValue: number): { month: string; focus: string; love: string; career: string }[] {
  const themes: Record<number, { month: string; focus: string; love: string; career: string }[]> = {
    1: [
      { month: "January", focus: "Set bold new intentions", love: "Open to fresh connections", career: "Launch a new initiative" },
      { month: "February", focus: "Build early momentum", love: "Be direct about desires", career: "Pitch ideas confidently" },
      { month: "March", focus: "Take decisive action", love: "Attract through confidence", career: "Network aggressively" },
      { month: "April", focus: "Establish daily routines", love: "Define what you want", career: "Lay groundwork for growth" },
      { month: "May", focus: "Push past first obstacles", love: "Take initiative in love", career: "Solidify new partnerships" },
      { month: "June", focus: "Refine your direction", love: "Communicate vision to partner", career: "Adjust strategy as needed" },
      { month: "July", focus: "Assert personal boundaries", love: "Balance independence and togetherness", career: "Mid-year recalibration" },
      { month: "August", focus: "Double down on what works", love: "Lead with authenticity", career: "Accelerate winning projects" },
      { month: "September", focus: "Organize new systems", love: "Create shared routines", career: "Systematize early wins" },
      { month: "October", focus: "Expand your circle", love: "Deepen new relationships", career: "Seek mentors and allies" },
      { month: "November", focus: "Strengthen resolve", love: "Commit to growth together", career: "Push through resistance" },
      { month: "December", focus: "Reflect on first-year gains", love: "Celebrate new beginnings", career: "Plan next year's expansion" },
    ],
    2: [
      { month: "January", focus: "Set gentle intentions", love: "Nurture existing bonds", career: "Collaborate behind the scenes" },
      { month: "February", focus: "Practice patience", love: "Deepen emotional intimacy", career: "Build alliances quietly" },
      { month: "March", focus: "Listen before acting", love: "Resolve old tensions", career: "Support team dynamics" },
      { month: "April", focus: "Refine rather than start new", love: "Small gestures matter most", career: "Polish proposals" },
      { month: "May", focus: "Seek balance in all areas", love: "Compromise with grace", career: "Mediate conflicts" },
      { month: "June", focus: "Trust the slow process", love: "Quality time over quantity", career: "Strengthen partnerships" },
      { month: "July", focus: "Honour your sensitivity", love: "Express needs gently", career: "Receive feedback gracefully" },
      { month: "August", focus: "Find harmony in routine", love: "Create peaceful rituals", career: "Refine systems" },
      { month: "September", focus: "Cooperate and co-create", love: "Plan shared experiences", career: "Joint ventures favoured" },
      { month: "October", focus: "Diplomatic conversations", love: "Balance giving and receiving", career: "Negotiate with care" },
      { month: "November", focus: "Inner peace practice", love: "Gratitude deepens bonds", career: "Patience yields results" },
      { month: "December", focus: "Appreciate quiet growth", love: "Cozy connection", career: "Review partnership gains" },
    ],
    3: [
      { month: "January", focus: "Spark creative projects", love: "Socialise and mingle", career: "Brainstorm new ideas" },
      { month: "February", focus: "Express yourself boldly", love: "Flirtatious energy rises", career: "Present with charisma" },
      { month: "March", focus: "Channel joy productively", love: "Playful dates and adventures", career: "Creative collaboration" },
      { month: "April", focus: "Explore artistic outlets", love: "Share your passions", career: "Marketing and visibility" },
      { month: "May", focus: "Expand social circle", love: "Meet through friends", career: "Network events pay off" },
      { month: "June", focus: "Communicate with clarity", love: "Honest fun conversations", career: "Write, speak, publish" },
      { month: "July", focus: "Avoid scattered energy", love: "Focus on quality connections", career: "Prioritise top projects" },
      { month: "August", focus: "Celebrate milestones", love: "Joy as a love language", career: "Showcase your work" },
      { month: "September", focus: "Organise creative output", love: "Deepen one key connection", career: "Monetise creativity" },
      { month: "October", focus: "Collaborate on art", love: "Creative dates", career: "Partnership opportunities" },
      { month: "November", focus: "Refine your message", love: "Express love openly", career: "Polish your brand" },
      { month: "December", focus: "Celebrate the year's joy", love: "Festive connection", career: "Plan next year's creative goals" },
    ],
    4: [
      { month: "January", focus: "Build solid foundations", love: "Commit to consistency", career: "Set structured goals" },
      { month: "February", focus: "Organise your environment", love: "Practical acts of love", career: "Streamline workflows" },
      { month: "March", focus: "Disciplined daily practice", love: "Show up reliably", career: "Tackle hard problems" },
      { month: "April", focus: "Strengthen health routines", love: "Build trust through action", career: "System improvements" },
      { month: "May", focus: "Persist through resistance", love: "Patience with partner's pace", career: "Grind leads to results" },
      { month: "June", focus: "Review and adjust plans", love: "Practical relationship check-in", career: "Mid-year assessment" },
      { month: "July", focus: "Rest within the structure", love: "Stability as romance", career: "Delegate where possible" },
      { month: "August", focus: "Reinforce what's working", love: "Shared responsibilities", career: "Build your reputation" },
      { month: "September", focus: "Detail-oriented progress", love: "Fix what's been neglected", career: "Quality over speed" },
      { month: "October", focus: "Financial foundations", love: "Plan future together", career: "Budget and invest wisely" },
      { month: "November", focus: "Endurance and grit", love: "Loyalty matters most", career: "Final push on projects" },
      { month: "December", focus: "Appreciate the work done", love: "Celebrate consistency", career: "Foundations ready for Year 5" },
    ],
    5: [
      { month: "January", focus: "Embrace change energy", love: "Try something new together", career: "Explore new opportunities" },
      { month: "February", focus: "Break free from stale patterns", love: "Surprise and spontaneity", career: "Pivot if needed" },
      { month: "March", focus: "Travel or learn something new", love: "Adventure dates", career: "Expand your market" },
      { month: "April", focus: "Stay adaptable", love: "Freedom within commitment", career: "Take calculated risks" },
      { month: "May", focus: "Explore unfamiliar territory", love: "Meet diverse people", career: "Innovate boldly" },
      { month: "June", focus: "Balance freedom and stability", love: "Communicate changing needs", career: "Test new approaches" },
      { month: "July", focus: "Mid-year adventure", love: "Reignite passion", career: "Course-correct quickly" },
      { month: "August", focus: "Channel restless energy", love: "Physical connection matters", career: "Seize unexpected openings" },
      { month: "September", focus: "Organise amid change", love: "Ground the relationship", career: "Stabilise new ventures" },
      { month: "October", focus: "Integrate new experiences", love: "Depth after exploration", career: "Commit to best option" },
      { month: "November", focus: "Prepare for transition", love: "Honest reassessment", career: "Wrap up experiments" },
      { month: "December", focus: "Celebrate growth through change", love: "Gratitude for flexibility", career: "Carry forward what worked" },
    ],
    6: [
      { month: "January", focus: "Home and family intentions", love: "Deepen commitment", career: "Service-oriented goals" },
      { month: "February", focus: "Nurture your space", love: "Romantic gestures matter", career: "Mentor others" },
      { month: "March", focus: "Family responsibilities call", love: "Heal family-of-origin patterns", career: "Community involvement" },
      { month: "April", focus: "Beautify your environment", love: "Create shared sanctuary", career: "Harmonise team dynamics" },
      { month: "May", focus: "Balance duty and pleasure", love: "Give without resentment", career: "Step up in leadership" },
      { month: "June", focus: "Domestic harmony peak", love: "Strengthen partnership foundation", career: "Work-life balance focus" },
      { month: "July", focus: "Self-care amid service", love: "Set loving boundaries", career: "Delegate to avoid burnout" },
      { month: "August", focus: "Creative home projects", love: "Quality family time", career: "Serve your clients deeply" },
      { month: "September", focus: "Responsibility with grace", love: "Practical love language", career: "Reliability builds trust" },
      { month: "October", focus: "Strengthen community ties", love: "Partnership as teamwork", career: "Collaboration over competition" },
      { month: "November", focus: "Gratitude practice", love: "Express appreciation daily", career: "Give back generously" },
      { month: "December", focus: "Family celebration", love: "Deepen bonds through presence", career: "Reflect on service given" },
    ],
    7: [
      { month: "January", focus: "Set intentions quietly", love: "Reflect on patterns", career: "Research new directions" },
      { month: "February", focus: "Deepen self-awareness", love: "Quality over quantity", career: "Skill building" },
      { month: "March", focus: "Release old patterns", love: "Heal attachment wounds", career: "Strategic planning" },
      { month: "April", focus: "Inner work peak", love: "Attract through authenticity", career: "Build in private" },
      { month: "May", focus: "Integrate insights", love: "Open to new connections", career: "Test ideas quietly" },
      { month: "June", focus: "Balance solitude and connection", love: "Communication clarity", career: "Expand knowledge" },
      { month: "July", focus: "Spiritual deepening", love: "Emotional honesty", career: "Mid-year reflection" },
      { month: "August", focus: "Creative introspection", love: "Express needs directly", career: "Study and research" },
      { month: "September", focus: "Organisation phase", love: "Practical relationship steps", career: "Optimise systems" },
      { month: "October", focus: "Seek meaningful dialogue", love: "Deepen commitment or release", career: "Quiet collaboration" },
      { month: "November", focus: "Transformation energy", love: "Vulnerability as strength", career: "Wisdom from reflection" },
      { month: "December", focus: "Consolidation and rest", love: "Gratitude practice", career: "Prepare for Year 8 power" },
    ],
    8: [
      { month: "January", focus: "Launch with authority", love: "Attract from confidence", career: "Major career move" },
      { month: "February", focus: "Financial strategy", love: "Invest in relationship", career: "Negotiate assertively" },
      { month: "March", focus: "Build momentum", love: "Deepening bond", career: "Expansion phase" },
      { month: "April", focus: "Leadership energy", love: "Balance power in relationship", career: "Step into authority" },
      { month: "May", focus: "Material gains possible", love: "Shared financial goals", career: "Revenue growth" },
      { month: "June", focus: "Delegate and scale", love: "Support partner's growth", career: "Team building" },
      { month: "July", focus: "Reassess priorities", love: "Emotional check-in", career: "Course correct if needed" },
      { month: "August", focus: "Harvest results", love: "Celebrate together", career: "Recognition peak" },
      { month: "September", focus: "Systematise wins", love: "Routine and stability", career: "Automate and optimise" },
      { month: "October", focus: "Invest wisely", love: "Long-term planning", career: "Financial decisions" },
      { month: "November", focus: "Power consolidation", love: "Gratitude and depth", career: "Close deals" },
      { month: "December", focus: "Prepare for transition", love: "Reflect on growth", career: "Strategic rest" },
    ],
    9: [
      { month: "January", focus: "Release what's complete", love: "Let go or commit fully", career: "Wrap up old projects" },
      { month: "February", focus: "Forgiveness work", love: "Heal old wounds", career: "Transition planning" },
      { month: "March", focus: "Spiritual deepening", love: "Compassion practice", career: "Mentor others" },
      { month: "April", focus: "Generosity phase", love: "Give without agenda", career: "Share knowledge" },
      { month: "May", focus: "Creative culmination", love: "Express love freely", career: "Complete creative projects" },
      { month: "June", focus: "Service focus", love: "Community involvement together", career: "Humanitarian angle" },
      { month: "July", focus: "Identity evolution", love: "Who are you becoming?", career: "Rebrand or reposition" },
      { month: "August", focus: "Clear the path", love: "Honest assessment", career: "Declutter commitments" },
      { month: "September", focus: "Emotional cleansing", love: "Deep conversations", career: "Final pushes" },
      { month: "October", focus: "Gratitude harvest", love: "Appreciation ritual", career: "Legacy thinking" },
      { month: "November", focus: "Preparation for new cycle", love: "Dream together about future", career: "Set vision for Year 1" },
      { month: "December", focus: "Rest and rebirth", love: "Celebrate the journey", career: "Strategic pause" },
    ],
  };

  return themes[personalYearValue] || themes[1];
}

/** Map personal year value to a short label used in the year theme banner. */
function personalYearLabel(value: number): string {
  const labels: Record<number, string> = {
    1: "New Beginnings & Initiative",
    2: "Patience & Partnerships",
    3: "Creativity & Expression",
    4: "Foundation & Discipline",
    5: "Change & Freedom",
    6: "Home, Love & Responsibility",
    7: "Reflection & Inner Growth",
    8: "Power & Manifestation",
    9: "Completion & Release",
  };
  return labels[value] || labels[1];
}

type ForecastYearData = {
  year: number;
  personalYear: number;
  theme: string;
  interpretation: string;
  risk: string;
  opportunity: string;
  bestResponse: string;
  months: { month: string; focus: string; love: string; career: string }[];
};

export default function ForecastPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [forecastData, setForecastData] = useState<ForecastYearData[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const p = await db.getProfile();
        setProfile(p);

        if (p?.birthday) {
          const dob = new Date(p.birthday + "T00:00:00");
          const currentYear = new Date().getFullYear();
          const years: ForecastYearData[] = [];

          for (let i = 0; i < 3; i++) {
            const yr = currentYear + i;
            const pyResult = calculatePersonalYear(dob, yr);
            years.push({
              year: yr,
              personalYear: pyResult.value,
              theme: `${personalYearLabel(pyResult.value)} \u2014 Personal Year ${pyResult.value} ${pyResult.interpretation.charAt(0).toLowerCase()}${pyResult.interpretation.slice(1)}`,
              interpretation: pyResult.interpretation,
              risk: pyResult.risk,
              opportunity: pyResult.opportunity,
              bestResponse: pyResult.bestResponse,
              months: generateMonthlyBreakdown(pyResult.value),
            });
          }

          setForecastData(years);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl font-bold text-white/90 mb-2">Forecast</h1>
        <p className="text-white/30">Loading your forecast...</p>
      </div>
    );
  }

  if (!profile?.birthday) {
    return (
      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl font-bold text-white/90 mb-2">Forecast</h1>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.04] p-8 text-center">
          <p className="text-white/50 mb-4">
            We need your birthday to calculate your personal forecast. Please complete the intake process first.
          </p>
          <Link
            href="/intake"
            className="inline-block rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 transition-colors"
          >
            Complete Intake
          </Link>
        </div>
      </div>
    );
  }

  if (forecastData.length === 0) {
    return (
      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl font-bold text-white/90 mb-2">Forecast</h1>
        <p className="text-white/30">Unable to generate forecast data.</p>
      </div>
    );
  }

  const data = forecastData[selectedIdx];
  const displayName = profile.firstName || null;

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold text-white/90 mb-2">
        {displayName ? `${displayName}'s Forecast` : "Forecast"}
      </h1>
      <p className="text-white/30 mb-8">Your personalized multi-year forecast based on numerology cycles and astrological patterns.</p>

      <div className="flex gap-2 mb-6">
        {forecastData.map((fd, idx) => (
          <button
            key={fd.year}
            onClick={() => setSelectedIdx(idx)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
              selectedIdx === idx
                ? "bg-indigo-600 text-white"
                : "bg-white/[0.06] text-white/50 hover:bg-white/[0.08]"
            }`}
          >
            {fd.year}
          </button>
        ))}
      </div>

      <div className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white mb-4">
        <div className="text-sm font-medium opacity-80 mb-1">Year Theme</div>
        <p className="text-lg font-semibold">{data.theme}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.04] p-4">
          <div className="text-xs font-medium text-amber-400 mb-1">Risk to Watch</div>
          <p className="text-sm text-white/60">{data.risk}</p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.04] p-4">
          <div className="text-xs font-medium text-emerald-400 mb-1">Key Opportunity</div>
          <p className="text-sm text-white/60">{data.opportunity}</p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.04] p-4">
          <div className="text-xs font-medium text-sky-400 mb-1">Best Response</div>
          <p className="text-sm text-white/60">{data.bestResponse}</p>
        </div>
      </div>

      <div className="space-y-3">
        {data.months.map((month) => (
          <div key={month.month} className="rounded-xl border border-white/[0.06] bg-white/[0.04] p-5 transition-all hover:bg-white/[0.06]">
            <div className="font-semibold text-white/90 mb-2">{month.month}</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <div className="text-xs font-medium text-indigo-400 mb-1">Focus</div>
                <p className="text-sm text-white/50">{month.focus}</p>
              </div>
              <div>
                <div className="text-xs font-medium text-pink-400 mb-1">Love</div>
                <p className="text-sm text-white/50">{month.love}</p>
              </div>
              <div>
                <div className="text-xs font-medium text-emerald-400 mb-1">Career</div>
                <p className="text-sm text-white/50">{month.career}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
