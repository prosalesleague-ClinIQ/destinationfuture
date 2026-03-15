// ─── Solar Astrology Engine (No Birth Time Required) ────────────────────────

// ─── Interfaces ─────────────────────────────────────────────────────────────

export interface SolarAstrologyResult {
  sunSign: ZodiacSign;
  decan: DecanResult;
  element: ElementResult;
  modality: ModalityResult;
  seasonalEnergy: SeasonalEnergy;
  planetaryThemes: PlanetaryTheme[];
  doList: string[];
  avoidList: string[];
  hasBirthTime: boolean;
  moonSign?: ZodiacSign;
  risingSign?: ZodiacSign;
  limitations: string[];
}

export interface ZodiacSign {
  name: string;
  symbol: string;
  dateRange: string;
  rulingPlanet: string;
  element: string;
  modality: string;
  keywords: string[];
}

export interface DecanResult {
  number: 1 | 2 | 3;
  dateRange: string;
  subRuler: string;
  description: string;
  influence: string;
}

export interface ElementResult {
  name: "Fire" | "Earth" | "Air" | "Water";
  traits: string[];
  strengths: string[];
  challenges: string[];
}

export interface ModalityResult {
  name: "Cardinal" | "Fixed" | "Mutable";
  traits: string[];
  approach: string;
}

export interface SeasonalEnergy {
  season: string;
  phase: string;
  naturalRhythm: string;
  bestMonths: string[];
  challengeMonths: string[];
}

export interface PlanetaryTheme {
  planet: string;
  theme: string;
  behavior: string;
  strength: string;
  caution: string;
}

// ─── Zodiac Data ────────────────────────────────────────────────────────────

const ZODIAC_SIGNS: ZodiacSign[] = [
  {
    name: "Aries",
    symbol: "\u2648",
    dateRange: "Mar 21 \u2013 Apr 19",
    rulingPlanet: "Mars",
    element: "Fire",
    modality: "Cardinal",
    keywords: ["courageous", "energetic", "pioneering", "competitive", "impulsive"],
  },
  {
    name: "Taurus",
    symbol: "\u2649",
    dateRange: "Apr 20 \u2013 May 20",
    rulingPlanet: "Venus",
    element: "Earth",
    modality: "Fixed",
    keywords: ["stable", "sensual", "patient", "determined", "possessive"],
  },
  {
    name: "Gemini",
    symbol: "\u264A",
    dateRange: "May 21 \u2013 Jun 20",
    rulingPlanet: "Mercury",
    element: "Air",
    modality: "Mutable",
    keywords: ["curious", "adaptable", "communicative", "witty", "restless"],
  },
  {
    name: "Cancer",
    symbol: "\u264B",
    dateRange: "Jun 21 \u2013 Jul 22",
    rulingPlanet: "Moon",
    element: "Water",
    modality: "Cardinal",
    keywords: ["nurturing", "intuitive", "protective", "emotional", "tenacious"],
  },
  {
    name: "Leo",
    symbol: "\u264C",
    dateRange: "Jul 23 \u2013 Aug 22",
    rulingPlanet: "Sun",
    element: "Fire",
    modality: "Fixed",
    keywords: ["confident", "generous", "dramatic", "creative", "proud"],
  },
  {
    name: "Virgo",
    symbol: "\u264D",
    dateRange: "Aug 23 \u2013 Sep 22",
    rulingPlanet: "Mercury",
    element: "Earth",
    modality: "Mutable",
    keywords: ["analytical", "precise", "helpful", "modest", "critical"],
  },
  {
    name: "Libra",
    symbol: "\u264E",
    dateRange: "Sep 23 \u2013 Oct 22",
    rulingPlanet: "Venus",
    element: "Air",
    modality: "Cardinal",
    keywords: ["balanced", "diplomatic", "charming", "fair", "indecisive"],
  },
  {
    name: "Scorpio",
    symbol: "\u264F",
    dateRange: "Oct 23 \u2013 Nov 21",
    rulingPlanet: "Pluto",
    element: "Water",
    modality: "Fixed",
    keywords: ["intense", "passionate", "resourceful", "determined", "secretive"],
  },
  {
    name: "Sagittarius",
    symbol: "\u2650",
    dateRange: "Nov 22 \u2013 Dec 21",
    rulingPlanet: "Jupiter",
    element: "Fire",
    modality: "Mutable",
    keywords: ["adventurous", "philosophical", "optimistic", "blunt", "freedom-loving"],
  },
  {
    name: "Capricorn",
    symbol: "\u2651",
    dateRange: "Dec 22 \u2013 Jan 19",
    rulingPlanet: "Saturn",
    element: "Earth",
    modality: "Cardinal",
    keywords: ["ambitious", "disciplined", "practical", "patient", "reserved"],
  },
  {
    name: "Aquarius",
    symbol: "\u2652",
    dateRange: "Jan 20 \u2013 Feb 18",
    rulingPlanet: "Uranus",
    element: "Air",
    modality: "Fixed",
    keywords: ["innovative", "independent", "humanitarian", "eccentric", "detached"],
  },
  {
    name: "Pisces",
    symbol: "\u2653",
    dateRange: "Feb 19 \u2013 Mar 20",
    rulingPlanet: "Neptune",
    element: "Water",
    modality: "Mutable",
    keywords: ["intuitive", "compassionate", "artistic", "dreamy", "escapist"],
  },
];

// ─── Decan Data ─────────────────────────────────────────────────────────────

const DECAN_DATA: Record<string, DecanResult[]> = {
  Aries: [
    { number: 1, dateRange: "Mar 21 \u2013 Mar 30", subRuler: "Mars", description: "Pure Aries energy \u2014 bold, impulsive, pioneering", influence: "Double Mars influence amplifies courage and competitiveness" },
    { number: 2, dateRange: "Mar 31 \u2013 Apr 9", subRuler: "Sun", description: "Leo-influenced \u2014 confident, dramatic, warm-hearted", influence: "Sun sub-ruler adds charisma and desire for recognition" },
    { number: 3, dateRange: "Apr 10 \u2013 Apr 19", subRuler: "Jupiter", description: "Sagittarius-influenced \u2014 philosophical, adventurous, optimistic", influence: "Jupiter expands vision and adds wisdom to Aries fire" },
  ],
  Taurus: [
    { number: 1, dateRange: "Apr 20 \u2013 Apr 29", subRuler: "Venus", description: "Pure Taurus \u2014 sensual, determined, comfort-seeking", influence: "Double Venus enhances aesthetic sense and love of luxury" },
    { number: 2, dateRange: "Apr 30 \u2013 May 10", subRuler: "Mercury", description: "Virgo-influenced \u2014 analytical, practical, detail-oriented", influence: "Mercury adds intellectual depth to Taurus groundedness" },
    { number: 3, dateRange: "May 11 \u2013 May 20", subRuler: "Saturn", description: "Capricorn-influenced \u2014 ambitious, disciplined, strategic", influence: "Saturn adds structure and long-term planning ability" },
  ],
  Gemini: [
    { number: 1, dateRange: "May 21 \u2013 May 31", subRuler: "Mercury", description: "Pure Gemini \u2014 curious, quick-witted, versatile", influence: "Double Mercury amplifies communication and mental agility" },
    { number: 2, dateRange: "Jun 1 \u2013 Jun 10", subRuler: "Venus", description: "Libra-influenced \u2014 charming, social, aesthetically aware", influence: "Venus adds grace and relationship focus to Gemini intellect" },
    { number: 3, dateRange: "Jun 11 \u2013 Jun 20", subRuler: "Uranus", description: "Aquarius-influenced \u2014 innovative, eccentric, visionary", influence: "Uranus adds originality and humanitarian perspective" },
  ],
  Cancer: [
    { number: 1, dateRange: "Jun 21 \u2013 Jul 1", subRuler: "Moon", description: "Pure Cancer \u2014 deeply emotional, nurturing, intuitive", influence: "Double Moon enhances emotional depth and psychic sensitivity" },
    { number: 2, dateRange: "Jul 2 \u2013 Jul 12", subRuler: "Pluto", description: "Scorpio-influenced \u2014 intense, transformative, magnetic", influence: "Pluto adds intensity and power to Cancer's emotional nature" },
    { number: 3, dateRange: "Jul 13 \u2013 Jul 22", subRuler: "Neptune", description: "Pisces-influenced \u2014 dreamy, compassionate, artistic", influence: "Neptune adds creativity and spiritual depth" },
  ],
  Leo: [
    { number: 1, dateRange: "Jul 23 \u2013 Aug 1", subRuler: "Sun", description: "Pure Leo \u2014 radiant, confident, generous leader", influence: "Double Sun amplifies charisma and creative self-expression" },
    { number: 2, dateRange: "Aug 2 \u2013 Aug 12", subRuler: "Jupiter", description: "Sagittarius-influenced \u2014 philosophical, expansive, adventurous", influence: "Jupiter broadens Leo's vision and adds optimism" },
    { number: 3, dateRange: "Aug 13 \u2013 Aug 22", subRuler: "Mars", description: "Aries-influenced \u2014 action-oriented, competitive, bold", influence: "Mars adds drive and assertiveness to Leo's fire" },
  ],
  Virgo: [
    { number: 1, dateRange: "Aug 23 \u2013 Sep 1", subRuler: "Mercury", description: "Pure Virgo \u2014 analytical, precise, service-oriented", influence: "Double Mercury enhances critical thinking and communication" },
    { number: 2, dateRange: "Sep 2 \u2013 Sep 12", subRuler: "Saturn", description: "Capricorn-influenced \u2014 disciplined, ambitious, structured", influence: "Saturn adds authority and long-term strategic thinking" },
    { number: 3, dateRange: "Sep 13 \u2013 Sep 22", subRuler: "Venus", description: "Taurus-influenced \u2014 artistic, sensual, appreciation for beauty", influence: "Venus softens Virgo's critical edge with warmth" },
  ],
  Libra: [
    { number: 1, dateRange: "Sep 23 \u2013 Oct 2", subRuler: "Venus", description: "Pure Libra \u2014 harmonious, fair, aesthetically driven", influence: "Double Venus amplifies charm and desire for beauty" },
    { number: 2, dateRange: "Oct 3 \u2013 Oct 13", subRuler: "Uranus", description: "Aquarius-influenced \u2014 independent, innovative, socially aware", influence: "Uranus adds originality and progressive thinking" },
    { number: 3, dateRange: "Oct 14 \u2013 Oct 22", subRuler: "Mercury", description: "Gemini-influenced \u2014 intellectual, communicative, versatile", influence: "Mercury adds mental agility and communication skills" },
  ],
  Scorpio: [
    { number: 1, dateRange: "Oct 23 \u2013 Nov 1", subRuler: "Pluto", description: "Pure Scorpio \u2014 intense, transformative, powerful", influence: "Double Pluto amplifies depth and regenerative power" },
    { number: 2, dateRange: "Nov 2 \u2013 Nov 11", subRuler: "Neptune", description: "Pisces-influenced \u2014 intuitive, mystical, compassionate", influence: "Neptune adds spiritual depth and artistic sensitivity" },
    { number: 3, dateRange: "Nov 12 \u2013 Nov 21", subRuler: "Moon", description: "Cancer-influenced \u2014 emotional, nurturing, family-oriented", influence: "Moon adds emotional warmth and protective instincts" },
  ],
  Sagittarius: [
    { number: 1, dateRange: "Nov 22 \u2013 Dec 1", subRuler: "Jupiter", description: "Pure Sagittarius \u2014 adventurous, philosophical, optimistic", influence: "Double Jupiter amplifies luck, expansion, and wanderlust" },
    { number: 2, dateRange: "Dec 2 \u2013 Dec 11", subRuler: "Mars", description: "Aries-influenced \u2014 action-oriented, courageous, direct", influence: "Mars adds physical energy and competitive drive" },
    { number: 3, dateRange: "Dec 12 \u2013 Dec 21", subRuler: "Sun", description: "Leo-influenced \u2014 creative, charismatic, warm-hearted", influence: "Sun adds creative flair and desire for recognition" },
  ],
  Capricorn: [
    { number: 1, dateRange: "Dec 22 \u2013 Dec 31", subRuler: "Saturn", description: "Pure Capricorn \u2014 disciplined, ambitious, pragmatic", influence: "Double Saturn amplifies structure and authority" },
    { number: 2, dateRange: "Jan 1 \u2013 Jan 10", subRuler: "Venus", description: "Taurus-influenced \u2014 sensual, patient, materially focused", influence: "Venus adds warmth and appreciation for luxury" },
    { number: 3, dateRange: "Jan 11 \u2013 Jan 19", subRuler: "Mercury", description: "Virgo-influenced \u2014 analytical, detail-oriented, efficient", influence: "Mercury adds intellectual precision and communication" },
  ],
  Aquarius: [
    { number: 1, dateRange: "Jan 20 \u2013 Jan 29", subRuler: "Uranus", description: "Pure Aquarius \u2014 innovative, independent, visionary", influence: "Double Uranus amplifies originality and unconventional thinking" },
    { number: 2, dateRange: "Jan 30 \u2013 Feb 8", subRuler: "Mercury", description: "Gemini-influenced \u2014 intellectual, communicative, curious", influence: "Mercury adds versatility and social charm" },
    { number: 3, dateRange: "Feb 9 \u2013 Feb 18", subRuler: "Venus", description: "Libra-influenced \u2014 harmonious, artistic, relationship-focused", influence: "Venus adds aesthetic sense and diplomatic skill" },
  ],
  Pisces: [
    { number: 1, dateRange: "Feb 19 \u2013 Feb 29", subRuler: "Neptune", description: "Pure Pisces \u2014 dreamy, intuitive, mystical", influence: "Double Neptune amplifies imagination and spiritual sensitivity" },
    { number: 2, dateRange: "Mar 1 \u2013 Mar 10", subRuler: "Moon", description: "Cancer-influenced \u2014 nurturing, emotionally deep, protective", influence: "Moon adds emotional strength and family connection" },
    { number: 3, dateRange: "Mar 11 \u2013 Mar 20", subRuler: "Pluto", description: "Scorpio-influenced \u2014 intense, transformative, magnetic", influence: "Pluto adds depth, power, and regenerative ability" },
  ],
};

// ─── Element & Modality Data ────────────────────────────────────────────────

const ELEMENT_DATA: Record<string, ElementResult> = {
  Fire: {
    name: "Fire",
    traits: ["passionate", "energetic", "spontaneous", "warm"],
    strengths: ["Leadership", "Enthusiasm", "Courage", "Inspiration"],
    challenges: ["Impatience", "Burnout", "Aggression", "Impulsiveness"],
  },
  Earth: {
    name: "Earth",
    traits: ["grounded", "practical", "reliable", "sensory"],
    strengths: ["Stability", "Persistence", "Resourcefulness", "Pragmatism"],
    challenges: ["Stubbornness", "Materialism", "Resistance to change", "Overthinking practicalities"],
  },
  Air: {
    name: "Air",
    traits: ["intellectual", "social", "communicative", "curious"],
    strengths: ["Adaptability", "Communication", "Innovation", "Objectivity"],
    challenges: ["Detachment", "Overthinking", "Inconsistency", "Anxiety"],
  },
  Water: {
    name: "Water",
    traits: ["emotional", "intuitive", "empathetic", "deep"],
    strengths: ["Empathy", "Intuition", "Creativity", "Emotional depth"],
    challenges: ["Moodiness", "Over-sensitivity", "Boundary issues", "Escapism"],
  },
};

const MODALITY_DATA: Record<string, ModalityResult> = {
  Cardinal: {
    name: "Cardinal",
    traits: ["initiating", "leading", "ambitious", "action-oriented"],
    approach: "You start things. You see what's needed and act first.",
  },
  Fixed: {
    name: "Fixed",
    traits: ["persistent", "stable", "determined", "resistant to change"],
    approach: "You sustain things. You see things through with unwavering focus.",
  },
  Mutable: {
    name: "Mutable",
    traits: ["adaptable", "flexible", "versatile", "changeable"],
    approach: "You transform things. You adapt and flow with circumstances.",
  },
};

// ─── Core Calculation Functions ─────────────────────────────────────────────

export function getSunSign(dob: Date): ZodiacSign {
  const month = dob.getMonth() + 1;
  const day = dob.getDate();

  const ranges: [number, number, number, number, string][] = [
    [3, 21, 4, 19, "Aries"],
    [4, 20, 5, 20, "Taurus"],
    [5, 21, 6, 20, "Gemini"],
    [6, 21, 7, 22, "Cancer"],
    [7, 23, 8, 22, "Leo"],
    [8, 23, 9, 22, "Virgo"],
    [9, 23, 10, 22, "Libra"],
    [10, 23, 11, 21, "Scorpio"],
    [11, 22, 12, 21, "Sagittarius"],
    [12, 22, 1, 19, "Capricorn"],
    [1, 20, 2, 18, "Aquarius"],
    [2, 19, 3, 20, "Pisces"],
  ];

  for (const [startMonth, startDay, endMonth, endDay, name] of ranges) {
    if (startMonth <= endMonth) {
      if (
        (month === startMonth && day >= startDay) ||
        (month === endMonth && day <= endDay) ||
        (month > startMonth && month < endMonth)
      ) {
        return ZODIAC_SIGNS.find((s) => s.name === name)!;
      }
    } else {
      // Capricorn wraps around year
      if (
        (month === startMonth && day >= startDay) ||
        (month === endMonth && day <= endDay) ||
        month > startMonth ||
        month < endMonth
      ) {
        return ZODIAC_SIGNS.find((s) => s.name === name)!;
      }
    }
  }
  return ZODIAC_SIGNS[0]; // fallback
}

function getDayInSign(month: number, day: number, signName: string): number {
  const startDates: Record<string, [number, number]> = {
    Aries: [3, 21],
    Taurus: [4, 20],
    Gemini: [5, 21],
    Cancer: [6, 21],
    Leo: [7, 23],
    Virgo: [8, 23],
    Libra: [9, 23],
    Scorpio: [10, 23],
    Sagittarius: [11, 22],
    Capricorn: [12, 22],
    Aquarius: [1, 20],
    Pisces: [2, 19],
  };
  const [startMonth, startDay] = startDates[signName] || [1, 1];

  if (month === startMonth) return day - startDay + 1;
  // If in second month of the sign
  const daysInStartMonth = new Date(2024, startMonth, 0).getDate();
  return daysInStartMonth - startDay + 1 + day;
}

export function getDecan(dob: Date, sunSign: ZodiacSign): DecanResult {
  const month = dob.getMonth() + 1;
  const day = dob.getDate();

  const decans = DECAN_DATA[sunSign.name];
  if (!decans)
    return {
      number: 1,
      dateRange: "",
      subRuler: "",
      description: "",
      influence: "",
    };

  const dayInSign = getDayInSign(month, day, sunSign.name);

  if (dayInSign <= 10) return decans[0];
  if (dayInSign <= 20) return decans[1];
  return decans[2];
}

// ─── Planetary Theme Helpers ────────────────────────────────────────────────

function getMercuryBehavior(element: string): string {
  const map: Record<string, string> = {
    Fire: "Quick, decisive communication. You think on your feet and speak boldly.",
    Earth: "Practical, methodical thinking. You process information thoroughly.",
    Air: "Rapid, versatile communication. You juggle multiple ideas with ease.",
    Water: "Intuitive, emotionally colored communication. You read between lines.",
  };
  return map[element] || map.Fire;
}

function getVenusBehavior(element: string): string {
  const map: Record<string, string> = {
    Fire: "Passionate, direct in love. You pursue what you want with intensity.",
    Earth: "Sensual, loyal in love. You show affection through acts and gifts.",
    Air: "Intellectual, social in love. You connect through conversation and ideas.",
    Water: "Deep, emotional in love. You bond through vulnerability and intuition.",
  };
  return map[element] || map.Fire;
}

function getMarsBehavior(element: string): string {
  const map: Record<string, string> = {
    Fire: "Explosive energy, quick to act, competitive. You charge forward.",
    Earth: "Steady, enduring energy. You work methodically toward goals.",
    Air: "Strategic, cerebral approach. You plan before acting.",
    Water: "Emotionally driven action. You fight for what you feel deeply about.",
  };
  return map[element] || map.Fire;
}

function getJupiterBehavior(element: string): string {
  const map: Record<string, string> = {
    Fire: "Growth through adventure, travel, and bold risk-taking.",
    Earth: "Growth through material building, career advancement, and stability.",
    Air: "Growth through learning, networking, and idea exchange.",
    Water: "Growth through emotional depth, spiritual practice, and healing.",
  };
  return map[element] || map.Fire;
}

function getSaturnBehavior(element: string): string {
  const map: Record<string, string> = {
    Fire: "Lessons in patience, humility, and channeling energy constructively.",
    Earth: "Lessons in flexibility, letting go of control, and trusting the process.",
    Air: "Lessons in commitment, follow-through, and depth over breadth.",
    Water: "Lessons in emotional boundaries, self-reliance, and practical grounding.",
  };
  return map[element] || map.Fire;
}

function getPlanetaryThemes(sunSign: ZodiacSign): PlanetaryTheme[] {
  return [
    {
      planet: "Mercury",
      theme: "Communication & Mind",
      behavior: getMercuryBehavior(sunSign.element),
      strength: "Mental clarity and learning",
      caution: "Overthinking or miscommunication",
    },
    {
      planet: "Venus",
      theme: "Love & Values",
      behavior: getVenusBehavior(sunSign.element),
      strength: "Attraction and relationship harmony",
      caution: "Overindulgence or people-pleasing",
    },
    {
      planet: "Mars",
      theme: "Drive & Action",
      behavior: getMarsBehavior(sunSign.element),
      strength: "Energy, motivation, and assertiveness",
      caution: "Aggression or burnout",
    },
    {
      planet: "Jupiter",
      theme: "Growth & Expansion",
      behavior: getJupiterBehavior(sunSign.element),
      strength: "Opportunity and optimism",
      caution: "Overextension or blind faith",
    },
    {
      planet: "Saturn",
      theme: "Structure & Discipline",
      behavior: getSaturnBehavior(sunSign.element),
      strength: "Maturity and long-term building",
      caution: "Rigidity or self-doubt",
    },
  ];
}

// ─── Do / Avoid Lists ──────────────────────────────────────────────────────

function getDoList(sunSign: ZodiacSign): string[] {
  const lists: Record<string, string[]> = {
    Aries: ["Take initiative on projects", "Exercise daily", "Set ambitious goals", "Lead by example", "Embrace competition healthily"],
    Taurus: ["Build financial security", "Create comfortable environments", "Invest in quality", "Practice patience", "Engage senses mindfully"],
    Gemini: ["Network regularly", "Learn continuously", "Write or communicate daily", "Explore diverse interests", "Stay curious"],
    Cancer: ["Nurture close relationships", "Create a safe home base", "Honor your emotions", "Cook or create for others", "Trust your intuition"],
    Leo: ["Express yourself creatively", "Take the stage when possible", "Mentor others", "Celebrate achievements", "Lead with generosity"],
    Virgo: ["Organize systems", "Serve others practically", "Refine skills daily", "Practice self-care", "Analyze then act"],
    Libra: ["Seek fairness in all dealings", "Cultivate beauty around you", "Build strong partnerships", "Practice diplomacy", "Create harmony"],
    Scorpio: ["Pursue depth over breadth", "Transform what isn't working", "Research thoroughly", "Build inner power", "Practice vulnerability selectively"],
    Sagittarius: ["Travel and explore", "Study philosophy or culture", "Take calculated risks", "Stay optimistic", "Share wisdom generously"],
    Capricorn: ["Set long-term goals", "Build professional reputation", "Practice discipline daily", "Invest wisely", "Mentor the next generation"],
    Aquarius: ["Innovate solutions", "Champion causes you believe in", "Build community", "Stay true to your vision", "Embrace your uniqueness"],
    Pisces: ["Create art or music", "Practice meditation", "Help those in need", "Trust your dreams", "Set healthy boundaries"],
  };
  return lists[sunSign.name] || lists.Aries;
}

function getAvoidList(sunSign: ZodiacSign): string[] {
  const lists: Record<string, string[]> = {
    Aries: ["Rushing without planning", "Starting fights unnecessarily", "Abandoning projects halfway", "Ignoring others' feelings", "Overcommitting physically"],
    Taurus: ["Resisting all change", "Overindulging in comfort", "Hoarding possessions", "Stubbornly holding grudges", "Avoiding risk entirely"],
    Gemini: ["Spreading yourself too thin", "Gossiping or oversharing", "Avoiding emotional depth", "Starting without finishing", "Saying yes to everything"],
    Cancer: ["Smothering loved ones", "Retreating into isolation", "Holding onto the past", "Guilt-tripping others", "Neglecting personal boundaries"],
    Leo: ["Seeking validation constantly", "Dominating conversations", "Taking criticism personally", "Overspending for status", "Ignoring feedback"],
    Virgo: ["Perfectionism paralysis", "Criticizing others harshly", "Overworking yourself", "Worrying about everything", "Neglecting fun and play"],
    Libra: ["Avoiding all conflict", "Losing yourself in relationships", "Indecision that blocks progress", "People-pleasing at your expense", "Superficial connections"],
    Scorpio: ["Holding grudges indefinitely", "Manipulating to maintain control", "Obsessing over perceived slights", "Isolating from support", "All-or-nothing thinking"],
    Sagittarius: ["Overcommitting to adventures", "Being brutally blunt", "Avoiding responsibility", "Ignoring details", "Promise without follow-through"],
    Capricorn: ["All work no play", "Emotional suppression", "Using status as worth", "Pessimistic outlook", "Controlling others' choices"],
    Aquarius: ["Emotional detachment from loved ones", "Contrarianism for its own sake", "Ignoring practical realities", "Alienating potential allies", "Cold intellectualism"],
    Pisces: ["Escaping through substances or fantasy", "Absorbing others' emotions unchecked", "Avoiding confrontation entirely", "Martyrdom patterns", "Losing practical grounding"],
  };
  return lists[sunSign.name] || lists.Aries;
}

// ─── Seasonal Energy ────────────────────────────────────────────────────────

function getSeasonalEnergy(sunSign: ZodiacSign): SeasonalEnergy {
  const seasonMap: Record<string, SeasonalEnergy> = {
    Aries: { season: "Early Spring", phase: "Initiation", naturalRhythm: "High energy, launch phase. Act on ideas now.", bestMonths: ["March", "April", "July", "November"], challengeMonths: ["June", "September"] },
    Taurus: { season: "Mid Spring", phase: "Cultivation", naturalRhythm: "Grounding energy, build and nurture.", bestMonths: ["April", "May", "September", "December"], challengeMonths: ["July", "October"] },
    Gemini: { season: "Late Spring", phase: "Connection", naturalRhythm: "Social expansion, networking, learning.", bestMonths: ["May", "June", "September", "January"], challengeMonths: ["August", "November"] },
    Cancer: { season: "Early Summer", phase: "Nesting", naturalRhythm: "Emotional deepening, home focus.", bestMonths: ["June", "July", "October", "February"], challengeMonths: ["September", "December"] },
    Leo: { season: "Mid Summer", phase: "Expression", naturalRhythm: "Creative peak, visibility, leadership.", bestMonths: ["July", "August", "November", "March"], challengeMonths: ["October", "January"] },
    Virgo: { season: "Late Summer", phase: "Refinement", naturalRhythm: "Organizing, optimizing, health focus.", bestMonths: ["August", "September", "December", "April"], challengeMonths: ["November", "February"] },
    Libra: { season: "Early Autumn", phase: "Balance", naturalRhythm: "Partnership focus, aesthetic creation.", bestMonths: ["September", "October", "January", "May"], challengeMonths: ["December", "March"] },
    Scorpio: { season: "Mid Autumn", phase: "Transformation", naturalRhythm: "Deep inner work, release, rebirth.", bestMonths: ["October", "November", "February", "June"], challengeMonths: ["January", "April"] },
    Sagittarius: { season: "Late Autumn", phase: "Expansion", naturalRhythm: "Adventure, study, travel season.", bestMonths: ["November", "December", "March", "July"], challengeMonths: ["February", "May"] },
    Capricorn: { season: "Early Winter", phase: "Foundation", naturalRhythm: "Career building, strategic planning.", bestMonths: ["December", "January", "April", "August"], challengeMonths: ["March", "June"] },
    Aquarius: { season: "Mid Winter", phase: "Innovation", naturalRhythm: "Visioning, community building, disruption.", bestMonths: ["January", "February", "May", "September"], challengeMonths: ["April", "July"] },
    Pisces: { season: "Late Winter", phase: "Integration", naturalRhythm: "Reflection, healing, creative synthesis.", bestMonths: ["February", "March", "June", "October"], challengeMonths: ["May", "August"] },
  };
  return seasonMap[sunSign.name] || seasonMap.Aries;
}

// ─── Main Function ──────────────────────────────────────────────────────────

export function calculateSolarAstrology(
  dob: Date,
  hasBirthTime: boolean
): SolarAstrologyResult {
  const sunSign = getSunSign(dob);
  const decan = getDecan(dob, sunSign);
  const element = ELEMENT_DATA[sunSign.element];
  const modality = MODALITY_DATA[sunSign.modality];
  const seasonalEnergy = getSeasonalEnergy(sunSign);
  const planetaryThemes = getPlanetaryThemes(sunSign);
  const doList = getDoList(sunSign);
  const avoidList = getAvoidList(sunSign);

  const limitations: string[] = [];
  if (!hasBirthTime) {
    limitations.push(
      "Without exact birth time, Moon sign cannot be calculated precisely",
      "Rising sign (Ascendant) requires exact birth time",
      "House placements are unavailable without birth time",
      "Planetary aspects are limited to Sun-only analysis"
    );
  }

  return {
    sunSign,
    decan,
    element,
    modality,
    seasonalEnergy,
    planetaryThemes,
    doList,
    avoidList,
    hasBirthTime,
    limitations,
  };
}
