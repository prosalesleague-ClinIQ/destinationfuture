"use client";

import { useState, useEffect } from "react";
import { db, type UserProfile } from "@/lib/db";
import { calculateLifePath } from "@destination-future/core";
import { getSunSign } from "@destination-future/core";

type GrowthTab = "shadow" | "cbt" | "neuroplasticity" | "boundaries" | "plan";

/* ─── Life Path → Shadow Profile Mapping ─── */
interface ShadowProfile {
  primary: string;
  secondary: string;
  coreWound: string;
  growthEdge: string;
  affirmation: string;
  patterns: typeof shadowPatterns;
}

function getShadowProfileForLifePath(lp: number): Omit<ShadowProfile, "patterns"> & { patternOrder: number[] } {
  const profiles: Record<number, Omit<ShadowProfile, "patterns"> & { patternOrder: number[] }> = {
    1: {
      primary: "The Controller",
      secondary: "The Perfectionist",
      coreWound: "fear of being insignificant or dependent on others",
      growthEdge: "learning that vulnerability is strength, not weakness",
      affirmation: "I am enough without having to prove it. My worth is inherent.",
      patternOrder: [3, 1, 4, 0, 2], // Controller, Perfectionist, Self-Saboteur, People Pleaser, Avoider
    },
    2: {
      primary: "The People Pleaser",
      secondary: "The Avoider",
      coreWound: "fear of being alone or unloved",
      growthEdge: "learning that your needs matter as much as everyone else's",
      affirmation: "I can love others without losing myself. My needs are valid.",
      patternOrder: [0, 2, 3, 1, 4], // People Pleaser, Avoider, Controller, Perfectionist, Self-Saboteur
    },
    3: {
      primary: "The Perfectionist",
      secondary: "The Self-Saboteur",
      coreWound: "fear of being seen as worthless without achievement",
      growthEdge: "learning that you are not your accomplishments",
      affirmation: "I am valuable for who I am, not just what I produce.",
      patternOrder: [1, 4, 0, 3, 2], // Perfectionist, Self-Saboteur, People Pleaser, Controller, Avoider
    },
    4: {
      primary: "The Controller",
      secondary: "The Avoider",
      coreWound: "fear of chaos and instability",
      growthEdge: "learning to find security within rather than through rigid structures",
      affirmation: "I am safe even when things are uncertain. I can adapt and thrive.",
      patternOrder: [3, 2, 1, 0, 4], // Controller, Avoider, Perfectionist, People Pleaser, Self-Saboteur
    },
    5: {
      primary: "The Avoider",
      secondary: "The Self-Saboteur",
      coreWound: "fear of being trapped or constrained",
      growthEdge: "learning that commitment deepens freedom rather than restricting it",
      affirmation: "I can be free and connected. Commitment is not a cage.",
      patternOrder: [2, 4, 3, 1, 0], // Avoider, Self-Saboteur, Controller, Perfectionist, People Pleaser
    },
    6: {
      primary: "The People Pleaser",
      secondary: "The Controller",
      coreWound: "fear of being selfish or unneeded",
      growthEdge: "learning that over-giving is not love — it is control wearing a mask of kindness",
      affirmation: "I can care deeply without carrying everything. Letting others struggle is not abandonment.",
      patternOrder: [0, 3, 1, 2, 4], // People Pleaser, Controller, Perfectionist, Avoider, Self-Saboteur
    },
    7: {
      primary: "The Avoider",
      secondary: "The Perfectionist",
      coreWound: "fear of being exposed as flawed or intellectually inadequate",
      growthEdge: "learning to trust your heart as much as your mind",
      affirmation: "I do not need to understand everything to be at peace. I am safe in not-knowing.",
      patternOrder: [2, 1, 4, 3, 0], // Avoider, Perfectionist, Self-Saboteur, Controller, People Pleaser
    },
    8: {
      primary: "The Controller",
      secondary: "The Self-Saboteur",
      coreWound: "fear of being powerless or betrayed",
      growthEdge: "learning that true power is vulnerability, not dominance",
      affirmation: "I do not need to control everything to be safe. My strength includes softness.",
      patternOrder: [3, 4, 1, 0, 2], // Controller, Self-Saboteur, Perfectionist, People Pleaser, Avoider
    },
    9: {
      primary: "The People Pleaser",
      secondary: "The Avoider",
      coreWound: "fear of conflict, loss, and being seen as selfish",
      growthEdge: "learning that your own needs are not less important than the world's",
      affirmation: "I matter too. Serving others does not require erasing myself.",
      patternOrder: [0, 2, 4, 1, 3], // People Pleaser, Avoider, Self-Saboteur, Perfectionist, Controller
    },
    11: {
      primary: "The Perfectionist",
      secondary: "The People Pleaser",
      coreWound: "fear of not living up to your potential or spiritual calling",
      growthEdge: "learning that being human is the spiritual practice — not transcending it",
      affirmation: "I honor my sensitivity without being consumed by it. My light does not require perfection.",
      patternOrder: [1, 0, 4, 2, 3],
    },
    22: {
      primary: "The Controller",
      secondary: "The Perfectionist",
      coreWound: "fear of failing the massive vision you carry inside",
      growthEdge: "learning to build step by step instead of demanding the whole cathedral at once",
      affirmation: "I trust the process. My vision will manifest through patience, not force.",
      patternOrder: [3, 1, 4, 0, 2],
    },
    33: {
      primary: "The People Pleaser",
      secondary: "The Self-Saboteur",
      coreWound: "fear of not being enough for those who depend on you",
      growthEdge: "learning that the greatest service is modeling healthy boundaries",
      affirmation: "I heal others by healing myself first. My boundaries are an act of love.",
      patternOrder: [0, 4, 1, 3, 2],
    },
  };

  return profiles[lp] || profiles[9]; // default to 9 for safety
}

/* ─── Shadow Pattern Data ─── */
const shadowPatterns = [
  {
    name: "The People Pleaser",
    icon: "🎭",
    gradient: "from-rose-500 to-pink-600",
    trigger: "Someone expresses a need, makes a request, or shows disappointment",
    thought: "If I don't help, they'll think I'm selfish. I need them to like me.",
    emotion: "Anxiety, guilt, fear of rejection",
    behavior: "Say yes immediately, overcommit, abandon your own plans",
    outcome: "Resentment, burnout, loss of identity, others don't respect your boundaries",
    interrupt:
      "Pause. Say: 'Let me check my schedule and get back to you.' Buy yourself 24 hours. Notice the guilt — it's your old wiring, not truth.",
    newPattern:
      "Practice: 'I care about you AND I need to take care of myself.' Start with low-stakes 'no' situations and build up. Your worth isn't measured by what you give others.",
  },
  {
    name: "The Perfectionist",
    icon: "✨",
    gradient: "from-amber-500 to-orange-600",
    trigger: "Starting a new task, receiving feedback, comparing yourself to others",
    thought: "If it's not perfect, it's a failure. People will see I'm a fraud.",
    emotion: "Anxiety, shame, inadequacy, paralysis",
    behavior: "Procrastinate, over-prepare, refuse to ship, obsess over details",
    outcome: "Missed opportunities, exhaustion, never feeling 'good enough,' stalled progress",
    interrupt:
      "Ask: 'What would 80% look like?' Set a hard deadline and ship it. Remember: done is better than perfect, and perfect doesn't exist.",
    newPattern:
      "Practice: Submit work before it feels 'ready.' Track outcomes — you'll find that 80% effort gets 95% of the results. Celebrate progress over polish.",
  },
  {
    name: "The Avoider",
    icon: "🫥",
    gradient: "from-blue-500 to-indigo-600",
    trigger: "Conflict, difficult conversations, important decisions, uncomfortable emotions",
    thought: "If I ignore it, it will go away. I can deal with this later. It's not that bad.",
    emotion: "Numbness, low-level dread, discomfort, overwhelm",
    behavior: "Distract with phone/food/TV, change the subject, go silent, 'forget' about it",
    outcome: "Problems compound, relationships erode, opportunities expire, anxiety grows beneath the surface",
    interrupt:
      "Name what you're avoiding out loud: 'I am avoiding _____ because I'm afraid of _____.' Then do the smallest possible step toward it within 2 minutes.",
    newPattern:
      "Practice: Set a daily 'confront one thing' habit. Start with the easiest avoided task. Build tolerance for discomfort in small doses. Notice how relief comes AFTER action, not before.",
  },
  {
    name: "The Controller",
    icon: "🎯",
    gradient: "from-emerald-500 to-teal-600",
    trigger: "Uncertainty, other people making decisions, things not going to plan",
    thought: "If I don't manage this, everything will fall apart. Nobody can do it as well as me.",
    emotion: "Anxiety, frustration, mistrust, rigidity",
    behavior: "Micromanage, refuse to delegate, over-plan, get angry when plans change",
    outcome: "Strained relationships, isolation, burnout, others stop trying, you become a bottleneck",
    interrupt:
      "Ask: 'What am I actually afraid of losing control over?' Usually it's safety, not the task itself. Practice tolerating one uncontrolled variable per day.",
    newPattern:
      "Practice: Delegate one task completely without checking in. Let someone else choose the restaurant. Notice that the world doesn't end. Build evidence that you can handle uncertainty.",
  },
  {
    name: "The Self-Saboteur",
    icon: "💣",
    gradient: "from-purple-500 to-violet-600",
    trigger: "Getting close to success, receiving recognition, things going well",
    thought: "I don't deserve this. Something bad will happen. Better to fail on my terms than be exposed.",
    emotion: "Unworthiness, imposter syndrome, anxiety about success",
    behavior: "Pick fights, miss deadlines on purpose, make careless mistakes, push people away",
    outcome: "Confirm the belief 'I'm not good enough,' stay stuck, repeat the cycle",
    interrupt:
      "Notice the moment things start going well and you feel the urge to destroy it. Say: 'This is my self-sabotage pattern activating.' Sit with the discomfort of things going RIGHT.",
    newPattern:
      "Practice: When something good happens, resist the urge to qualify it. Write down: 'I received _____ and I deserve it because _____.' Build a success file you review weekly.",
  },
];

/* ─── Cognitive Distortions ─── */
const cognitiveDistortions = [
  {
    name: "All-or-Nothing Thinking",
    definition: "Seeing things in black-and-white categories. If a situation falls short of perfect, you see it as a total failure.",
    example: "I made a mistake in my presentation, so the whole thing was a disaster.",
    reframe: "The presentation had strong moments. One mistake doesn't erase the value I delivered.",
    color: "border-red-400",
  },
  {
    name: "Overgeneralization",
    definition: "Viewing a single negative event as a never-ending pattern of defeat. Using words like 'always' or 'never.'",
    example: "I got rejected from that job. I'll never find work I love.",
    reframe: "This particular role wasn't the right fit. Each application teaches me something for the next one.",
    color: "border-orange-400",
  },
  {
    name: "Mental Filter",
    definition: "Picking out a single negative detail and dwelling on it exclusively, so that your vision of all reality becomes darkened.",
    example: "I got 9 positive reviews and 1 negative one. That negative review is all I can think about.",
    reframe: "90% of feedback was positive. The one criticism is useful data, not a verdict on my worth.",
    color: "border-amber-400",
  },
  {
    name: "Disqualifying the Positive",
    definition: "Rejecting positive experiences by insisting they 'don't count.' Maintaining a negative belief despite contradictory evidence.",
    example: "They only complimented me because they felt sorry for me.",
    reframe: "I can accept compliments at face value. People generally mean what they say.",
    color: "border-yellow-400",
  },
  {
    name: "Jumping to Conclusions",
    definition: "Making negative interpretations without definite facts. Includes mind-reading and fortune-telling.",
    example: "She didn't reply to my text. She must be mad at me.",
    reframe: "There are many reasons someone might not reply. I'll ask directly instead of assuming.",
    color: "border-lime-400",
  },
  {
    name: "Magnification / Minimization",
    definition: "Exaggerating the importance of negative events or shrinking the importance of positive ones.",
    example: "Sure I got promoted, but anyone could have. Meanwhile, that typo in my email was unforgivable.",
    reframe: "My promotion reflects real achievement. The typo is minor and already forgotten by others.",
    color: "border-green-400",
  },
  {
    name: "Emotional Reasoning",
    definition: "Assuming that your negative emotions necessarily reflect the way things really are: 'I feel it, therefore it must be true.'",
    example: "I feel like a failure, so I must be one.",
    reframe: "Feelings are information, not facts. I can feel afraid and still be safe. I can feel inadequate and still be competent.",
    color: "border-teal-400",
  },
  {
    name: "Should Statements",
    definition: "Trying to motivate yourself with 'shoulds' and 'musts.' The emotional consequence is guilt and frustration.",
    example: "I should be further along by now. I shouldn't need help with this.",
    reframe: "I'm where I am, and that's my starting point. Asking for help is a sign of strength.",
    color: "border-cyan-400",
  },
  {
    name: "Labeling",
    definition: "Attaching a fixed, global label to yourself or others instead of describing the specific behavior.",
    example: "I'm such an idiot. He's a total jerk.",
    reframe: "I made a mistake in that situation. His behavior in that moment was hurtful, but people are complex.",
    color: "border-blue-400",
  },
  {
    name: "Personalization",
    definition: "Seeing yourself as the cause of some negative external event that you were not primarily responsible for.",
    example: "My team missed the deadline. It's all my fault.",
    reframe: "Many factors contributed to the missed deadline. I can take responsibility for my part without shouldering everything.",
    color: "border-violet-400",
  },
];

/* ─── Behavioral Experiments ─── */
const behavioralExperiments = [
  { task: "Say no to one request this week and observe what happens", prediction: "They'll be angry or stop liking me" },
  { task: "Share a vulnerability with someone you trust", prediction: "They'll think less of me or use it against me" },
  { task: "Leave a task at 80% done instead of perfecting it", prediction: "People will judge me or it will fail" },
  { task: "Ask for help with something you usually do alone", prediction: "They'll think I'm incompetent" },
  { task: "Express a need directly instead of hinting", prediction: "I'll seem needy or demanding" },
  { task: "Sit with an uncomfortable emotion for 5 minutes without distracting", prediction: "The feeling will overwhelm me" },
  { task: "Do something fun without justifying its productivity", prediction: "I'm wasting time and being lazy" },
  { task: "Set a boundary and hold it for 48 hours", prediction: "The relationship will be damaged" },
];

/* ─── Brain Optimization ─── */
const brainOptimizations = [
  {
    title: "Cold Exposure",
    icon: "🧊",
    mechanism: "Increases norepinephrine by 200-300%, enhancing focus, mood, and resilience. Triggers hormetic stress response.",
    howToStart: "End your shower with 30 seconds of cold water. Build up to 2 minutes over 2 weeks.",
    minimumDose: "2 minutes of cold water, 3-4 times per week",
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    title: "Exercise",
    icon: "🏃",
    mechanism: "Produces BDNF (brain-derived neurotrophic factor) which stimulates neurogenesis — literally growing new neurons.",
    howToStart: "20-minute brisk walk daily. Add resistance training 2x/week.",
    minimumDose: "150 minutes moderate or 75 minutes vigorous exercise per week",
    gradient: "from-green-500 to-emerald-600",
  },
  {
    title: "Sleep Optimization",
    icon: "🌙",
    mechanism: "During deep sleep, the glymphatic system clears toxic waste. REM sleep consolidates emotional memories and new learning.",
    howToStart: "Set a consistent bedtime. No screens 1 hour before. Cool room (65-68°F).",
    minimumDose: "7-9 hours with consistent sleep/wake times, even weekends",
    gradient: "from-indigo-500 to-purple-600",
  },
  {
    title: "Meditation",
    icon: "🧘",
    mechanism: "Increases prefrontal cortex gray matter (decision-making) and reduces amygdala reactivity (fight-or-flight). Measurable changes in 8 weeks.",
    howToStart: "5 minutes of breath-focused attention daily. Use a guided app if needed.",
    minimumDose: "10 minutes daily for measurable neurological changes",
    gradient: "from-violet-500 to-fuchsia-600",
  },
  {
    title: "Novel Experiences",
    icon: "🌍",
    mechanism: "New experiences create new neural pathways and increase dopamine, making the brain more plastic and adaptable.",
    howToStart: "Do one thing differently each day: new route, new food, new conversation topic.",
    minimumDose: "1 genuinely novel experience per week (something you've never done)",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    title: "Spaced Repetition",
    icon: "🔄",
    mechanism: "Reviewing new patterns at increasing intervals strengthens synaptic connections exponentially more than cramming.",
    howToStart: "After practicing a new behavior, review/journal about it at 1 day, 3 days, 7 days, 14 days.",
    minimumDose: "Review new patterns at expanding intervals: 1, 3, 7, 14, 30 days",
    gradient: "from-rose-500 to-red-600",
  },
];

/* ─── Pattern Interrupts ─── */
const patternInterrupts = [
  {
    title: "5-4-3-2-1 Grounding",
    icon: "🖐️",
    gradient: "from-teal-500 to-cyan-600",
    steps: ["Name 5 things you can SEE", "Name 4 things you can TOUCH", "Name 3 things you can HEAR", "Name 2 things you can SMELL", "Name 1 thing you can TASTE"],
    purpose: "Pulls you out of rumination and into the present moment by engaging all five senses.",
  },
  {
    title: "Box Breathing (4-4-4-4)",
    icon: "📦",
    gradient: "from-blue-500 to-indigo-600",
    steps: ["Inhale for 4 seconds", "Hold for 4 seconds", "Exhale for 4 seconds", "Hold for 4 seconds", "Repeat 4 cycles"],
    purpose: "Activates the parasympathetic nervous system, reducing cortisol and shifting from fight-or-flight to rest-and-digest.",
  },
  {
    title: "Physical State Change",
    icon: "⚡",
    gradient: "from-amber-500 to-yellow-600",
    steps: ["Splash cold water on your face", "Do 10 jumping jacks", "Hold a power pose for 2 minutes", "Squeeze ice cubes in your hands", "Go for a brisk 5-minute walk"],
    purpose: "Changes your physiological state to break the loop between body sensations and emotional spirals.",
  },
  {
    title: "Cognitive Defusion",
    icon: "💭",
    gradient: "from-purple-500 to-violet-600",
    steps: [
      'Prefix the thought: "I notice I\'m having the thought that..."',
      "Say the thought in a silly voice",
      "Visualize the thought as words on a screen scrolling by",
      "Thank your mind: 'Thanks, mind, for trying to protect me'",
      "Ask: 'Is this thought helpful right now?'",
    ],
    purpose: "Creates distance between you and your thoughts. You are not your thoughts — you are the awareness observing them.",
  },
  {
    title: "Opposite Action",
    icon: "🔀",
    gradient: "from-rose-500 to-pink-600",
    steps: [
      "Urge to isolate → Reach out to one person",
      "Urge to lash out → Speak slowly and softly",
      "Urge to avoid → Take the smallest step toward it",
      "Urge to numb → Feel the emotion fully for 90 seconds",
      "Urge to control → Let go of one thing",
    ],
    purpose: "From DBT therapy. Acting opposite to your emotional urge weakens the link between the trigger and the habitual response.",
  },
];

/* ─── Boundary Scripts ─── */
const boundaryScripts = [
  { category: "Declining Requests", script: "I appreciate you thinking of me, but I can't commit to that right now.", context: "When someone asks you to take on more than you can handle." },
  { category: "Buying Time", script: "I need some time to think about this before I give you an answer.", context: "When you feel pressured to respond immediately." },
  { category: "Partial Yes", script: "I understand this is important to you. Here's what I can do...", context: "When you want to help but can't do everything asked." },
  { category: "Counter-Offering", script: "That doesn't work for me. Here's what would...", context: "When a request conflicts with your needs but you want to collaborate." },
  { category: "Honest Communication", script: "I care about our relationship, and I need to be honest about how I'm feeling.", context: "When you need to address something uncomfortable in a relationship." },
  { category: "Protecting Your Time", script: "I've already committed my time this week. I could look at this next week — would that work?", context: "When someone wants your time and you're already stretched." },
  { category: "Emotional Boundaries", script: "I can see you're upset, and I care about that. I'm not able to be your sounding board on this topic right now.", context: "When someone's emotional needs exceed what you can give in the moment." },
  { category: "Repeating a Boundary", script: "I understand you'd like me to reconsider, but my answer is the same. I'm not available for that.", context: "When someone pushes back on a boundary you've already set." },
  { category: "Work Boundaries", script: "I want to do my best work, and to do that I need to focus on my current priorities. Can we revisit this next quarter?", context: "When a manager or colleague overloads you." },
  { category: "Family Boundaries", script: "I love you and I've decided that this topic isn't something I'm willing to discuss. Let's talk about something else.", context: "When family members bring up triggering or invasive topics." },
];

/* ─── 30-Day Plan ─── */
const thirtyDayPlan = {
  week1: {
    title: "Week 1: Awareness",
    subtitle: "Notice your patterns without trying to change them yet",
    color: "from-blue-500 to-cyan-500",
    days: [
      "Journal for 5 minutes: What emotions came up today and when?",
      "Track every 'should' statement you think or say today",
      "Notice your body: Where do you hold tension when stressed?",
      "Identify one situation where you people-pleased today",
      "Write down 3 beliefs you have about yourself — are they facts or stories?",
      "Observe one conversation where you held back what you really wanted to say",
      "Weekly reflection: What pattern showed up most this week?",
    ],
  },
  week2: {
    title: "Week 2: Replacement",
    subtitle: "Start introducing new responses to old triggers",
    color: "from-emerald-500 to-green-500",
    days: [
      "Practice the 5-4-3-2-1 grounding technique when you feel anxious",
      "Reframe one negative thought using the CBT thought record",
      "Say 'Let me think about it' instead of immediately saying yes",
      "Do box breathing for 4 minutes before a stressful situation",
      "Replace one 'should' statement with 'I choose to' or 'I want to'",
      "When you catch yourself mind-reading, ask the person directly",
      "Weekly reflection: Which replacement felt most natural? Most difficult?",
    ],
  },
  week3: {
    title: "Week 3: Experiments",
    subtitle: "Test your beliefs through real-world behavioral experiments",
    color: "from-amber-500 to-orange-500",
    days: [
      "Say no to one small request. Record what actually happens vs. what you feared",
      "Share one vulnerability with a trusted person. Notice their actual response",
      "Submit something at 80% quality. Track the real consequences",
      "Ask for help with one thing. Observe if people respect you less (they won't)",
      "Express a need directly. Note the difference from hinting",
      "Sit with discomfort for 5 minutes without your phone. You will survive",
      "Weekly reflection: How did reality compare to your predictions?",
    ],
  },
  week4: {
    title: "Week 4: Consolidation",
    subtitle: "Lock in new patterns and build sustainable practices",
    color: "from-purple-500 to-violet-500",
    days: [
      "Review your journal — identify the top 3 patterns you've disrupted",
      "Write a letter to your past self about what you've learned",
      "Set one boundary and hold it for 48 hours without apologizing",
      "Teach someone else one technique you've learned (this deepens your learning)",
      "Create a personal 'pattern interrupt toolkit' — your go-to moves for each trigger",
      "Practice cognitive defusion with your most persistent negative thought",
      "Final reflection: Write your growth story — who were you 30 days ago vs. now?",
    ],
  },
};

/* ─────────────────────────────────────────────────────────────────── */
/*                          COMPONENT                                 */
/* ─────────────────────────────────────────────────────────────────── */

export default function GrowthPage() {
  const [activeTab, setActiveTab] = useState<GrowthTab>("shadow");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  /* Derived from profile */
  const lifePathResult = profile?.birthday
    ? calculateLifePath(new Date(profile.birthday + "T00:00:00"))
    : null;
  const lifePath = lifePathResult?.value ?? null;
  const sunSign = profile?.birthday
    ? getSunSign(new Date(profile.birthday + "T00:00:00"))
    : null;
  const firstName = profile?.nickname || profile?.firstName || "Friend";
  const shadowProfile = lifePath ? getShadowProfileForLifePath(lifePath) : null;
  const personalizedPatterns = shadowProfile
    ? shadowProfile.patternOrder.map((i) => shadowPatterns[i])
    : shadowPatterns;

  useEffect(() => {
    db.getProfile().then((p) => {
      setProfile(p);
      setLoading(false);
    });
  }, []);

  /* Shadow Work */
  const [expandedPattern, setExpandedPattern] = useState<string | null>(null);

  /* CBT */
  const [expandedDistortion, setExpandedDistortion] = useState<string | null>(null);
  const [thoughtRecord, setThoughtRecord] = useState({
    situation: "",
    automaticThought: "",
    emotion: "",
    emotionIntensity: 5,
    evidenceFor: "",
    evidenceAgainst: "",
    balancedThought: "",
    newEmotion: "",
    newEmotionIntensity: 5,
  });
  const [experimentChecked, setExperimentChecked] = useState<Record<number, boolean>>({});
  const [experimentReflections, setExperimentReflections] = useState<Record<number, string>>({});

  /* Neuroplasticity */
  const [expandedOptimization, setExpandedOptimization] = useState<string | null>(null);
  const [expandedInterrupt, setExpandedInterrupt] = useState<string | null>(null);

  /* Boundaries */
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  /* 30-Day Plan */
  const [dayChecked, setDayChecked] = useState<Record<string, boolean>>({});

  const totalDays = 28;
  const completedDays = Object.values(dayChecked).filter(Boolean).length;
  const progressPercent = Math.round((completedDays / totalDays) * 100);

  const tabs: { key: GrowthTab; label: string; icon: string }[] = [
    { key: "shadow", label: "Shadow Work", icon: "🌑" },
    { key: "cbt", label: "CBT Tools", icon: "🧠" },
    { key: "neuroplasticity", label: "Neuroplasticity", icon: "⚡" },
    { key: "boundaries", label: "Boundary Scripts", icon: "🛡️" },
    { key: "plan", label: "30-Day Plan", icon: "📅" },
  ];

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl pb-16">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
            <p className="text-surface-400 text-sm">Loading your growth toolkit...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile || !profile.intakeComplete) {
    return (
      <div className="mx-auto max-w-5xl pb-16">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="rounded-2xl bg-white p-8 md:p-12 shadow-sm border border-surface-100 text-center max-w-md">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-cosmic-600 text-3xl mx-auto mb-4">
              🌱
            </div>
            <h2 className="text-xl font-bold text-surface-900 mb-2">Complete Your Profile First</h2>
            <p className="text-surface-400 text-sm mb-6">
              Your Growth Toolkit is personalized to your numerology and cosmic blueprint. Complete the intake questionnaire so we can tailor shadow patterns, CBT exercises, and growth recommendations to your unique wiring.
            </p>
            <a
              href="/intake"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-cosmic-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all"
            >
              Complete Intake
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl pb-16">
      {/* ─── Page Header ─── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-cosmic-600 to-purple-800 p-8 md:p-12 mb-8">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-8 h-32 w-32 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-4 left-12 h-24 w-24 rounded-full bg-white blur-2xl" />
        </div>
        <div className="relative">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            {firstName}&apos;s Growth Toolkit
          </h1>
          <p className="text-white/80 text-lg max-w-2xl">
            {lifePath && sunSign
              ? `Personalized for Life Path ${lifePath} and ${sunSign.name} energy. Your shadow work, CBT tools, and neuroplasticity exercises — tailored to your unique wiring.`
              : "Real psychological tools for real change. Shadow work, CBT techniques, neuroplasticity science, and practical scripts — your personal therapy workbook."}
          </p>
        </div>
      </div>

      {/* ─── Tab Navigation ─── */}
      <div className="flex gap-1 rounded-2xl bg-surface-100 p-1.5 mb-8 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 flex-1 min-w-fit rounded-xl px-4 py-3 text-sm font-medium transition-all ${
              activeTab === tab.key
                ? "bg-white text-surface-900 shadow-md"
                : "text-surface-400 hover:text-surface-700 hover:bg-white/50"
            }`}
          >
            <span>{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/*  TAB 1: SHADOW WORK                                           */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {activeTab === "shadow" && (
        <div className="space-y-8">
          {/* Section Header */}
          <div>
            <h2 className="text-2xl font-bold text-surface-900 mb-1">{firstName}&apos;s Shadow Work</h2>
            <p className="text-surface-400">Pattern recognition and interrupt techniques tailored to your Life Path</p>
          </div>

          {/* Personalized Shadow Insight */}
          {shadowProfile && lifePath && (
            <div className="rounded-2xl bg-gradient-to-br from-surface-800 to-surface-900 p-6 md:p-8 text-white">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-2xl flex-shrink-0">
                  🔮
                </div>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-bold text-lg">Life Path {lifePath} Shadow Profile</h3>
                    <p className="text-white/60 text-sm mt-1">
                      {firstName}, your numerology reveals specific shadow patterns to watch for.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="rounded-xl bg-white/10 p-4">
                      <span className="text-xs font-bold text-white/50 uppercase tracking-wide">Primary Shadow</span>
                      <p className="text-sm font-semibold text-white mt-1">{shadowProfile.primary}</p>
                    </div>
                    <div className="rounded-xl bg-white/10 p-4">
                      <span className="text-xs font-bold text-white/50 uppercase tracking-wide">Secondary Shadow</span>
                      <p className="text-sm font-semibold text-white mt-1">{shadowProfile.secondary}</p>
                    </div>
                    <div className="rounded-xl bg-white/10 p-4">
                      <span className="text-xs font-bold text-white/50 uppercase tracking-wide">Core Wound</span>
                      <p className="text-sm text-white/80 mt-1 capitalize">{shadowProfile.coreWound}</p>
                    </div>
                    <div className="rounded-xl bg-white/10 p-4">
                      <span className="text-xs font-bold text-white/50 uppercase tracking-wide">Growth Edge</span>
                      <p className="text-sm text-white/80 mt-1 capitalize">{shadowProfile.growthEdge}</p>
                    </div>
                  </div>
                  <div className="rounded-xl bg-gradient-to-r from-brand-500/20 to-cosmic-500/20 border border-white/10 p-4">
                    <span className="text-xs font-bold text-white/50 uppercase tracking-wide">Your Affirmation</span>
                    <p className="text-sm text-white font-medium mt-1 italic">&ldquo;{shadowProfile.affirmation}&rdquo;</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Growth Focus Areas — from intake goals */}
          {profile?.goals && profile.goals.length > 0 && (
            <div className="rounded-2xl bg-white p-6 md:p-8 shadow-sm border border-surface-100">
              <h3 className="text-lg font-bold text-surface-900 mb-1">Growth Focus Areas</h3>
              <p className="text-sm text-surface-400 mb-4">Your stated goals guide your shadow work and growth trajectory.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {profile.goals.map((goal) => (
                  <div key={goal} className="flex items-start gap-3 rounded-xl bg-gradient-to-r from-brand-50 to-cosmic-50 border border-brand-100 p-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-cosmic-500 text-white text-sm flex-shrink-0">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-surface-800">{goal}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Core Values Badges */}
          {profile?.valuesList && profile.valuesList.length > 0 && (
            <div className="rounded-2xl bg-white p-6 md:p-8 shadow-sm border border-surface-100">
              <h3 className="text-lg font-bold text-surface-900 mb-1">Your Core Values</h3>
              <p className="text-sm text-surface-400 mb-4">These values shape how you approach growth and relationships.</p>
              <div className="flex flex-wrap gap-2">
                {profile.valuesList.map((value) => (
                  <span key={value} className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 text-sm font-semibold text-emerald-700">
                    <svg className="h-3.5 w-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                    </svg>
                    {value}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Pattern Loop Diagram */}
          <div className="rounded-2xl bg-white p-6 md:p-8 shadow-sm border border-surface-100">
            <h3 className="text-lg font-bold text-surface-900 mb-2">The Pattern Loop</h3>
            <p className="text-sm text-surface-400 mb-6">
              Every unwanted behavior follows this cycle. The goal isn't to eliminate the loop — it's to interrupt it between Thought and Behavior.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
              {[
                { label: "Trigger", color: "bg-red-500", desc: "Event or situation" },
                { label: "Thought", color: "bg-orange-500", desc: "Automatic interpretation" },
                { label: "Emotion", color: "bg-amber-500", desc: "What you feel" },
                { label: "Behavior", color: "bg-blue-500", desc: "What you do" },
                { label: "Outcome", color: "bg-purple-500", desc: "The result" },
              ].map((step, i) => (
                <div key={step.label} className="flex items-center gap-2 md:gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`${step.color} rounded-xl px-4 py-3 text-white text-sm font-bold shadow-lg min-w-[100px] text-center`}>
                      {step.label}
                    </div>
                    <span className="text-xs text-surface-300 mt-1 text-center">{step.desc}</span>
                  </div>
                  {i < 4 && (
                    <svg className="w-6 h-6 text-surface-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4">
              <div className="flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-xs text-red-600 font-medium border border-red-200">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Outcome loops back to Trigger — the cycle repeats until interrupted
              </div>
            </div>

            {/* Interrupt zone */}
            <div className="mt-6 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-white text-sm flex-shrink-0">
                  ✂️
                </div>
                <div>
                  <h4 className="font-semibold text-emerald-800 text-sm">The Interrupt Zone</h4>
                  <p className="text-xs text-emerald-700 mt-1">
                    The space between Emotion and Behavior is where change happens. This is the gap you're training to expand. The longer you can sit in that gap, the more choice you have.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Shadow Patterns */}
          <div>
            <h3 className="text-lg font-bold text-surface-900 mb-4">
              {shadowProfile ? `${firstName}'s Shadow Patterns` : "5 Common Shadow Patterns"}
              {shadowProfile && <span className="text-sm font-normal text-surface-400 ml-2">(ordered by relevance to Life Path {lifePath})</span>}
            </h3>
            <div className="space-y-4">
              {personalizedPatterns.map((pattern) => {
                const isExpanded = expandedPattern === pattern.name;
                return (
                  <div key={pattern.name} className="rounded-2xl bg-white shadow-sm border border-surface-100 overflow-hidden transition-all">
                    {/* Gradient header */}
                    <div className={`h-1.5 bg-gradient-to-r ${pattern.gradient}`} />
                    <button
                      onClick={() => setExpandedPattern(isExpanded ? null : pattern.name)}
                      className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-surface-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-2xl">{pattern.icon}</span>
                        <div>
                          <h4 className="font-bold text-surface-900">{pattern.name}</h4>
                          <p className="text-sm text-surface-400 mt-0.5">Click to explore this pattern</p>
                        </div>
                      </div>
                      <svg
                        className={`w-5 h-5 text-surface-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {isExpanded && (
                      <div className="px-6 pb-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="rounded-xl bg-red-50 p-4 border border-red-100">
                            <span className="text-xs font-bold text-red-600 uppercase tracking-wide">Trigger</span>
                            <p className="text-sm text-red-800 mt-1">{pattern.trigger}</p>
                          </div>
                          <div className="rounded-xl bg-orange-50 p-4 border border-orange-100">
                            <span className="text-xs font-bold text-orange-600 uppercase tracking-wide">Automatic Thought</span>
                            <p className="text-sm text-orange-800 mt-1 italic">&ldquo;{pattern.thought}&rdquo;</p>
                          </div>
                          <div className="rounded-xl bg-amber-50 p-4 border border-amber-100">
                            <span className="text-xs font-bold text-amber-600 uppercase tracking-wide">Emotion Created</span>
                            <p className="text-sm text-amber-800 mt-1">{pattern.emotion}</p>
                          </div>
                          <div className="rounded-xl bg-blue-50 p-4 border border-blue-100">
                            <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">Default Behavior</span>
                            <p className="text-sm text-blue-800 mt-1">{pattern.behavior}</p>
                          </div>
                        </div>

                        <div className="rounded-xl bg-purple-50 p-4 border border-purple-100">
                          <span className="text-xs font-bold text-purple-600 uppercase tracking-wide">What It Costs You</span>
                          <p className="text-sm text-purple-800 mt-1">{pattern.outcome}</p>
                        </div>

                        <div className="rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 p-5 border border-emerald-200">
                          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide flex items-center gap-1">
                            ✂️ Pattern Interrupt
                          </span>
                          <p className="text-sm text-emerald-800 mt-2 font-medium">{pattern.interrupt}</p>
                        </div>

                        <div className="rounded-xl bg-gradient-to-r from-brand-50 to-cosmic-50 p-5 border border-brand-200">
                          <span className="text-xs font-bold text-brand-600 uppercase tracking-wide flex items-center gap-1">
                            🔄 The New Pattern
                          </span>
                          <p className="text-sm text-brand-800 mt-2 font-medium">{pattern.newPattern}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/*  TAB 2: CBT TOOLS                                             */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {activeTab === "cbt" && (
        <div className="space-y-10">
          {/* Section Header */}
          <div>
            <h2 className="text-2xl font-bold text-surface-900 mb-1">{firstName}&apos;s CBT Tools</h2>
            <p className="text-surface-400">
              {shadowProfile
                ? `Cognitive Behavioral Therapy techniques to address your ${shadowProfile.primary.toLowerCase()} and ${shadowProfile.secondary.toLowerCase()} patterns`
                : "Cognitive Behavioral Therapy techniques you can use right now"}
            </p>
          </div>

          {/* ── Cognitive Distortions ── */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 text-white text-lg">
                🔍
              </div>
              <div>
                <h3 className="text-lg font-bold text-surface-900">Cognitive Distortions Identifier</h3>
                <p className="text-sm text-surface-400">10 thinking traps that keep you stuck</p>
              </div>
            </div>

            <div className="space-y-3">
              {cognitiveDistortions.map((d) => {
                const isExpanded = expandedDistortion === d.name;
                return (
                  <div key={d.name} className={`rounded-xl bg-white shadow-sm overflow-hidden border-l-4 ${d.color} transition-all`}>
                    <button
                      onClick={() => setExpandedDistortion(isExpanded ? null : d.name)}
                      className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-surface-50 transition-colors"
                    >
                      <span className="font-semibold text-surface-900 text-sm">{d.name}</span>
                      <svg
                        className={`w-4 h-4 text-surface-400 transition-transform flex-shrink-0 ${isExpanded ? "rotate-180" : ""}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {isExpanded && (
                      <div className="px-5 pb-5 space-y-3">
                        <p className="text-sm text-surface-600">{d.definition}</p>
                        <div className="rounded-lg bg-red-50 p-3 border border-red-100">
                          <span className="text-xs font-bold text-red-500 uppercase">Distorted Thought</span>
                          <p className="text-sm text-red-700 mt-1 italic">&ldquo;{d.example}&rdquo;</p>
                        </div>
                        <div className="rounded-lg bg-emerald-50 p-3 border border-emerald-100">
                          <span className="text-xs font-bold text-emerald-500 uppercase">Reframed Thought</span>
                          <p className="text-sm text-emerald-700 mt-1">&ldquo;{d.reframe}&rdquo;</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Thought Record ── */}
          <div className="rounded-2xl bg-white p-6 md:p-8 shadow-sm border border-surface-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-lg">
                📝
              </div>
              <div>
                <h3 className="text-lg font-bold text-surface-900">Thought Record</h3>
                <p className="text-sm text-surface-400">The core CBT exercise — challenge your automatic thoughts</p>
              </div>
            </div>

            <div className="space-y-5">
              {/* Situation */}
              <div>
                <label className="block text-sm font-semibold text-surface-700 mb-1.5">1. Situation</label>
                <p className="text-xs text-surface-400 mb-2">What happened? Where were you? Who was involved?</p>
                <textarea
                  value={thoughtRecord.situation}
                  onChange={(e) => setThoughtRecord({ ...thoughtRecord, situation: e.target.value })}
                  className="w-full rounded-xl border border-surface-200 px-4 py-3 text-sm min-h-[80px] focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100 resize-none"
                  placeholder="Describe the situation..."
                />
              </div>

              {/* Automatic Thought */}
              <div>
                <label className="block text-sm font-semibold text-surface-700 mb-1.5">2. Automatic Thought</label>
                <p className="text-xs text-surface-400 mb-2">What went through your mind in that moment?</p>
                <textarea
                  value={thoughtRecord.automaticThought}
                  onChange={(e) => setThoughtRecord({ ...thoughtRecord, automaticThought: e.target.value })}
                  className="w-full rounded-xl border border-surface-200 px-4 py-3 text-sm min-h-[80px] focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100 resize-none"
                  placeholder="What were you thinking?"
                />
              </div>

              {/* Emotion & Intensity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-surface-700 mb-1.5">3. Emotion</label>
                  <input
                    type="text"
                    value={thoughtRecord.emotion}
                    onChange={(e) => setThoughtRecord({ ...thoughtRecord, emotion: e.target.value })}
                    className="w-full rounded-xl border border-surface-200 px-4 py-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
                    placeholder="e.g., Anxious, sad, angry..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-surface-700 mb-1.5">
                    Intensity: {thoughtRecord.emotionIntensity}/10
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={thoughtRecord.emotionIntensity}
                    onChange={(e) => setThoughtRecord({ ...thoughtRecord, emotionIntensity: parseInt(e.target.value) })}
                    className="w-full mt-3 accent-brand-600"
                  />
                  <div className="flex justify-between text-xs text-surface-300 mt-1">
                    <span>Mild</span>
                    <span>Intense</span>
                  </div>
                </div>
              </div>

              {/* Evidence For / Against */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-red-600 mb-1.5">4. Evidence FOR the thought</label>
                  <textarea
                    value={thoughtRecord.evidenceFor}
                    onChange={(e) => setThoughtRecord({ ...thoughtRecord, evidenceFor: e.target.value })}
                    className="w-full rounded-xl border border-red-200 px-4 py-3 text-sm min-h-[100px] focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-100 resize-none"
                    placeholder="What facts support this thought?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-emerald-600 mb-1.5">5. Evidence AGAINST the thought</label>
                  <textarea
                    value={thoughtRecord.evidenceAgainst}
                    onChange={(e) => setThoughtRecord({ ...thoughtRecord, evidenceAgainst: e.target.value })}
                    className="w-full rounded-xl border border-emerald-200 px-4 py-3 text-sm min-h-[100px] focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 resize-none"
                    placeholder="What facts contradict this thought?"
                  />
                </div>
              </div>

              {/* Balanced Thought */}
              <div>
                <label className="block text-sm font-semibold text-surface-700 mb-1.5">6. Balanced Thought</label>
                <p className="text-xs text-surface-400 mb-2">Considering all evidence, what is a more balanced perspective?</p>
                <textarea
                  value={thoughtRecord.balancedThought}
                  onChange={(e) => setThoughtRecord({ ...thoughtRecord, balancedThought: e.target.value })}
                  className="w-full rounded-xl border border-brand-200 px-4 py-3 text-sm min-h-[80px] focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100 resize-none bg-brand-50/30"
                  placeholder="Write a more balanced, realistic thought..."
                />
              </div>

              {/* New Emotion & Intensity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-surface-700 mb-1.5">7. New Emotion</label>
                  <input
                    type="text"
                    value={thoughtRecord.newEmotion}
                    onChange={(e) => setThoughtRecord({ ...thoughtRecord, newEmotion: e.target.value })}
                    className="w-full rounded-xl border border-surface-200 px-4 py-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
                    placeholder="How do you feel now?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-surface-700 mb-1.5">
                    New Intensity: {thoughtRecord.newEmotionIntensity}/10
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={thoughtRecord.newEmotionIntensity}
                    onChange={(e) => setThoughtRecord({ ...thoughtRecord, newEmotionIntensity: parseInt(e.target.value) })}
                    className="w-full mt-3 accent-emerald-600"
                  />
                  <div className="flex justify-between text-xs text-surface-300 mt-1">
                    <span>Mild</span>
                    <span>Intense</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Behavioral Experiments ── */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white text-lg">
                🧪
              </div>
              <div>
                <h3 className="text-lg font-bold text-surface-900">Behavioral Experiments</h3>
                <p className="text-sm text-surface-400">Test your beliefs. Reality is usually kinder than your predictions.</p>
              </div>
            </div>

            <div className="space-y-3">
              {behavioralExperiments.map((exp, i) => (
                <div key={i} className="rounded-xl bg-white p-5 shadow-sm border border-surface-100">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => setExperimentChecked({ ...experimentChecked, [i]: !experimentChecked[i] })}
                      className={`flex h-6 w-6 items-center justify-center rounded-lg border-2 flex-shrink-0 mt-0.5 transition-all ${
                        experimentChecked[i]
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : "border-surface-300 hover:border-brand-400"
                      }`}
                    >
                      {experimentChecked[i] && (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${experimentChecked[i] ? "text-surface-400 line-through" : "text-surface-900"}`}>
                        {exp.task}
                      </p>
                      <p className="text-xs text-surface-400 mt-1">
                        <span className="font-medium text-red-400">Your fear:</span> &ldquo;{exp.prediction}&rdquo;
                      </p>
                      <div className="mt-3">
                        <textarea
                          value={experimentReflections[i] || ""}
                          onChange={(e) => setExperimentReflections({ ...experimentReflections, [i]: e.target.value })}
                          className="w-full rounded-lg border border-surface-200 px-3 py-2 text-xs min-h-[60px] focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100 resize-none"
                          placeholder="What actually happened? What did you learn?"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/*  TAB 3: NEUROPLASTICITY                                       */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {activeTab === "neuroplasticity" && (
        <div className="space-y-10">
          {/* Section Header */}
          <div>
            <h2 className="text-2xl font-bold text-surface-900 mb-1">Neuroplasticity</h2>
            <p className="text-surface-400">{firstName}, your brain is not fixed. Here is how to rewire it.</p>
          </div>

          {/* How Neural Pathways Form */}
          <div className="rounded-2xl bg-white p-6 md:p-8 shadow-sm border border-surface-100">
            <h3 className="text-lg font-bold text-surface-900 mb-2">How Neural Pathways Form</h3>
            <p className="text-sm text-surface-500 mb-6">
              &ldquo;Neurons that fire together wire together.&rdquo; Every thought you repeat strengthens a neural connection. Over time, that connection becomes automatic — you don't choose it, it chooses you. The good news: this works both ways.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
              {[
                { label: "Repeated Thought", color: "bg-gradient-to-br from-violet-500 to-purple-600", desc: "You think the same thing over and over" },
                { label: "Stronger Connection", color: "bg-gradient-to-br from-purple-500 to-indigo-600", desc: "The neural pathway thickens" },
                { label: "Automatic Pattern", color: "bg-gradient-to-br from-indigo-500 to-blue-600", desc: "It becomes your default response" },
              ].map((step, i) => (
                <div key={step.label} className="flex items-center gap-3">
                  <div className="flex flex-col items-center max-w-[140px]">
                    <div className={`${step.color} rounded-xl px-5 py-4 text-white text-sm font-bold shadow-lg text-center w-full`}>
                      {step.label}
                    </div>
                    <span className="text-xs text-surface-400 mt-2 text-center">{step.desc}</span>
                  </div>
                  {i < 2 && (
                    <svg className="w-6 h-6 text-surface-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200 p-4">
              <p className="text-sm text-violet-800">
                <span className="font-bold">Key insight:</span> It takes roughly 66 days of consistent practice to form a new automatic pattern (not 21 days — that's a myth). Be patient with yourself. Every repetition counts, even the ones that feel clumsy.
              </p>
            </div>
          </div>

          {/* 4-Step Rewiring Process */}
          <div>
            <h3 className="text-lg font-bold text-surface-900 mb-4">The 4-Step Rewiring Process</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  step: 1,
                  title: "RECOGNIZE",
                  icon: "👁️",
                  description: "Notice the old pattern activating. Catch yourself in the act. 'There it is — my controller pattern is online.'",
                  color: "from-red-500 to-rose-600",
                },
                {
                  step: 2,
                  title: "RELABEL",
                  icon: "🏷️",
                  description: "Name it for what it is: old wiring, not truth. 'This is my amygdala firing, not reality. This is anxiety, not danger.'",
                  color: "from-amber-500 to-orange-600",
                },
                {
                  step: 3,
                  title: "REFOCUS",
                  icon: "🎯",
                  description: "Consciously choose the new response. Direct your attention to the replacement behavior. This is the rewiring moment.",
                  color: "from-emerald-500 to-teal-600",
                },
                {
                  step: 4,
                  title: "REVALUE",
                  icon: "💎",
                  description: "Acknowledge: 'The old pattern has less power now.' Every time you choose differently, the old pathway weakens and the new one strengthens.",
                  color: "from-blue-500 to-indigo-600",
                },
              ].map((step) => (
                <div key={step.step} className="rounded-2xl bg-white shadow-sm border border-surface-100 overflow-hidden">
                  <div className={`bg-gradient-to-r ${step.color} p-5 text-white`}>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-xl font-extrabold">
                        {step.step}
                      </div>
                      <div>
                        <span className="text-2xl mr-2">{step.icon}</span>
                        <span className="text-lg font-bold">{step.title}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-sm text-surface-600 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Brain Optimization Techniques */}
          <div>
            <h3 className="text-lg font-bold text-surface-900 mb-4">Brain Optimization Techniques</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {brainOptimizations.map((opt) => {
                const isExpanded = expandedOptimization === opt.title;
                return (
                  <div key={opt.title} className="rounded-2xl bg-white shadow-sm border border-surface-100 overflow-hidden">
                    <div className={`h-1 bg-gradient-to-r ${opt.gradient}`} />
                    <button
                      onClick={() => setExpandedOptimization(isExpanded ? null : opt.title)}
                      className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-surface-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{opt.icon}</span>
                        <span className="font-bold text-surface-900 text-sm">{opt.title}</span>
                      </div>
                      <svg
                        className={`w-4 h-4 text-surface-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {isExpanded && (
                      <div className="px-5 pb-5 space-y-3">
                        <div className="rounded-lg bg-surface-50 p-3">
                          <span className="text-xs font-bold text-surface-500 uppercase">What it does to your brain</span>
                          <p className="text-sm text-surface-700 mt-1">{opt.mechanism}</p>
                        </div>
                        <div className="rounded-lg bg-emerald-50 p-3 border border-emerald-100">
                          <span className="text-xs font-bold text-emerald-600 uppercase">How to start</span>
                          <p className="text-sm text-emerald-800 mt-1">{opt.howToStart}</p>
                        </div>
                        <div className="rounded-lg bg-brand-50 p-3 border border-brand-100">
                          <span className="text-xs font-bold text-brand-600 uppercase">Minimum effective dose</span>
                          <p className="text-sm text-brand-800 mt-1">{opt.minimumDose}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pattern Interrupt Techniques */}
          <div>
            <h3 className="text-lg font-bold text-surface-900 mb-4">Pattern Interrupt Techniques</h3>
            <div className="space-y-4">
              {patternInterrupts.map((pi) => {
                const isExpanded = expandedInterrupt === pi.title;
                return (
                  <div key={pi.title} className="rounded-2xl bg-white shadow-sm border border-surface-100 overflow-hidden">
                    <div className={`h-1.5 bg-gradient-to-r ${pi.gradient}`} />
                    <button
                      onClick={() => setExpandedInterrupt(isExpanded ? null : pi.title)}
                      className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-surface-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{pi.icon}</span>
                        <div>
                          <h4 className="font-bold text-surface-900 text-sm">{pi.title}</h4>
                          <p className="text-xs text-surface-400 mt-0.5">{pi.purpose.slice(0, 80)}...</p>
                        </div>
                      </div>
                      <svg
                        className={`w-4 h-4 text-surface-400 transition-transform flex-shrink-0 ${isExpanded ? "rotate-180" : ""}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {isExpanded && (
                      <div className="px-6 pb-5 space-y-3">
                        <p className="text-sm text-surface-600">{pi.purpose}</p>
                        <div className="space-y-2">
                          {pi.steps.map((step, i) => (
                            <div key={i} className="flex items-start gap-3 rounded-lg bg-surface-50 p-3">
                              <div className={`flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br ${pi.gradient} text-white text-xs font-bold flex-shrink-0`}>
                                {i + 1}
                              </div>
                              <p className="text-sm text-surface-700">{step}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/*  TAB 4: BOUNDARY SCRIPTS                                      */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {activeTab === "boundaries" && (
        <div className="space-y-8">
          {/* Section Header */}
          <div>
            <h2 className="text-2xl font-bold text-surface-900 mb-1">{firstName}&apos;s Boundary Scripts</h2>
            <p className="text-surface-400">
              {shadowProfile
                ? `Especially important for your ${shadowProfile.primary.toLowerCase()} pattern. Real words you can use in real situations.`
                : "Real words you can use in real situations. Copy them, adapt them, make them yours."}
            </p>
          </div>

          <div className="rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 p-5">
            <div className="flex items-start gap-3">
              <span className="text-xl">💡</span>
              <div>
                <h4 className="font-semibold text-amber-800 text-sm">Why scripts matter</h4>
                <p className="text-xs text-amber-700 mt-1">
                  When emotions are high, your prefrontal cortex goes offline. Having pre-rehearsed words means you don't have to think — you just have to remember. Practice these out loud until they feel natural. Your future self will thank you.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {boundaryScripts.map((bs, i) => (
              <div key={i} className="rounded-2xl bg-white shadow-sm border border-surface-100 overflow-hidden">
                <div className="px-6 py-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600 mb-3">
                        {bs.category}
                      </span>
                      <blockquote className="text-lg font-medium text-surface-900 leading-relaxed italic">
                        &ldquo;{bs.script}&rdquo;
                      </blockquote>
                      <p className="text-sm text-surface-400 mt-3">
                        <span className="font-medium text-surface-500">When to use:</span> {bs.context}
                      </p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(bs.script, i)}
                      className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all flex-shrink-0 ${
                        copiedIdx === i
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-surface-100 text-surface-600 hover:bg-surface-200"
                      }`}
                    >
                      {copiedIdx === i ? (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          Copied
                        </>
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-brand-600 via-cosmic-600 to-purple-700 p-6 text-white">
            <h4 className="font-bold text-lg mb-2">Remember</h4>
            <ul className="space-y-2 text-sm text-white/90">
              <li className="flex items-start gap-2">
                <span className="mt-0.5">1.</span>
                <span>A boundary without enforcement is just a suggestion. Follow through.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">2.</span>
                <span>You don&apos;t need to justify a boundary. &ldquo;No&rdquo; is a complete sentence.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">3.</span>
                <span>The people who get angry at your boundaries are the ones who benefited from you having none.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">4.</span>
                <span>Guilt after setting a boundary is normal. It&apos;s withdrawal from people-pleasing, not proof you did something wrong.</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/*  TAB 5: 30-DAY PLAN                                           */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {activeTab === "plan" && (
        <div className="space-y-8">
          {/* Section Header */}
          <div>
            <h2 className="text-2xl font-bold text-surface-900 mb-1">{firstName}&apos;s 30-Day Growth Plan</h2>
            <p className="text-surface-400">Four weeks from awareness to transformation. One small task per day.</p>
          </div>

          {/* Progress Bar */}
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-surface-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-surface-900">Overall Progress</h3>
              <span className="text-sm font-semibold text-brand-600">{completedDays}/{totalDays} days ({progressPercent}%)</span>
            </div>
            <div className="h-4 rounded-full bg-surface-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-500 via-cosmic-500 to-purple-500 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-surface-400">Week 1</span>
              <span className="text-xs text-surface-400">Week 2</span>
              <span className="text-xs text-surface-400">Week 3</span>
              <span className="text-xs text-surface-400">Week 4</span>
            </div>
          </div>

          {/* Weeks */}
          {Object.entries(thirtyDayPlan).map(([weekKey, week], weekIdx) => (
            <div key={weekKey} className="rounded-2xl bg-white shadow-sm border border-surface-100 overflow-hidden">
              <div className={`bg-gradient-to-r ${week.color} p-6 text-white`}>
                <h3 className="text-lg font-bold">{week.title}</h3>
                <p className="text-sm text-white/80 mt-1">{week.subtitle}</p>
              </div>
              <div className="p-4 md:p-6 space-y-2">
                {week.days.map((task, dayIdx) => {
                  const key = `w${weekIdx}-d${dayIdx}`;
                  const dayNumber = weekIdx * 7 + dayIdx + 1;
                  const isChecked = dayChecked[key] || false;
                  return (
                    <button
                      key={key}
                      onClick={() => setDayChecked({ ...dayChecked, [key]: !isChecked })}
                      className={`w-full flex items-start gap-3 rounded-xl p-3 text-left transition-all ${
                        isChecked ? "bg-emerald-50" : "hover:bg-surface-50"
                      }`}
                    >
                      <div
                        className={`flex h-7 w-7 items-center justify-center rounded-lg flex-shrink-0 text-xs font-bold transition-all ${
                          isChecked
                            ? "bg-emerald-500 text-white"
                            : "border-2 border-surface-200 text-surface-400"
                        }`}
                      >
                        {isChecked ? (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          dayNumber
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className={`text-sm ${isChecked ? "text-surface-400 line-through" : "text-surface-700"}`}>
                          <span className="font-medium text-surface-500">Day {dayNumber}:</span> {task}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Completion Message */}
          <div className="rounded-2xl bg-gradient-to-br from-surface-800 to-surface-900 p-6 md:p-8 text-white">
            <h4 className="font-bold text-lg mb-2">After 30 Days</h4>
            <p className="text-white/80 text-sm leading-relaxed">
              {firstName}, you won&apos;t be a completely different person — and that&apos;s not the goal. The goal is to be the same person with different wiring. You&apos;ll still feel the old triggers, but the gap between trigger and response will be wider. You&apos;ll still hear the old thoughts, but you&apos;ll recognize them as echoes instead of commands. That gap, that recognition — that&apos;s freedom.
            </p>
            <p className="text-white/60 text-xs mt-4">
              If you fall off the plan, don&apos;t restart at Day 1. Pick up where you left off. Progress isn&apos;t linear, and the self-judgment of &ldquo;starting over&rdquo; is just another pattern to interrupt.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
