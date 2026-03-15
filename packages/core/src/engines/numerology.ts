// ─── Numerology Calculation Engine (Pythagorean System) ─────────────────────

const LETTER_VALUES: Record<string, number> = {
  a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
  j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
  s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8,
};

const VOWELS = new Set(["a", "e", "i", "o", "u"]);

const MASTER_NUMBERS = [11, 22, 33];

// ─── Interfaces ─────────────────────────────────────────────────────────────

export interface NumerologyResult {
  lifePath: NumberResult;
  birthdayNumber: NumberResult;
  expressionNumber: NumberResult;
  soulUrge: NumberResult;
  personalityNumber: NumberResult;
  maturityNumber: NumberResult;
  pinnacles: PinnacleResult[];
  challenges: ChallengeResult[];
  personalYear: NumberResult;
}

export interface NumberResult {
  value: number;
  isMaster: boolean;
  math: string;
  interpretation: string;
  risk: string;
  opportunity: string;
  bestResponse: string;
}

export interface PinnacleResult {
  pinnacleNumber: number;
  period: string;
  ageRange: string;
  value: number;
  math: string;
  interpretation: string;
}

export interface ChallengeResult {
  challengeNumber: number;
  period: string;
  value: number;
  math: string;
  interpretation: string;
}

// ─── Core Calculation Functions ─────────────────────────────────────────────

export function reduceToSingleDigit(n: number): number {
  if (MASTER_NUMBERS.includes(n)) return n;
  while (n > 9 && !MASTER_NUMBERS.includes(n)) {
    n = String(n)
      .split("")
      .reduce((sum, d) => sum + parseInt(d), 0);
  }
  return n;
}

export function sumLetters(
  name: string,
  filter?: "vowels" | "consonants"
): { sum: number; math: string } {
  const letters = name
    .toLowerCase()
    .replace(/[^a-z]/g, "")
    .split("");
  const filtered = filter
    ? letters.filter((l) =>
        filter === "vowels" ? VOWELS.has(l) : !VOWELS.has(l)
      )
    : letters;
  const values = filtered.map((l) => LETTER_VALUES[l] || 0);
  const sum = values.reduce((a, b) => a + b, 0);
  const math =
    filtered.map((l) => `${l.toUpperCase()}(${LETTER_VALUES[l]})`).join(" + ") +
    ` = ${sum}`;
  return { sum, math };
}

// ─── Number Calculations ────────────────────────────────────────────────────

export function calculateLifePath(dob: Date): NumberResult {
  const month = dob.getMonth() + 1;
  const day = dob.getDate();
  const year = dob.getFullYear();

  const monthReduced = reduceToSingleDigit(month);
  const dayReduced = reduceToSingleDigit(day);
  const yearReduced = reduceToSingleDigit(
    String(year)
      .split("")
      .reduce((s, d) => s + parseInt(d), 0)
  );
  const total = monthReduced + dayReduced + yearReduced;
  const value = reduceToSingleDigit(total);

  const math = `Month: ${month} → ${monthReduced} | Day: ${day} → ${dayReduced} | Year: ${year} → ${yearReduced} | Total: ${monthReduced} + ${dayReduced} + ${yearReduced} = ${total} → ${value}`;

  return {
    value,
    isMaster: MASTER_NUMBERS.includes(value),
    math,
    ...getLifePathInterpretation(value),
  };
}

export function calculateBirthdayNumber(dob: Date): NumberResult {
  const day = dob.getDate();
  const value = reduceToSingleDigit(day);
  const math = `Birth day: ${day} → ${value}`;
  return {
    value,
    isMaster: MASTER_NUMBERS.includes(value),
    math,
    ...getBirthdayInterpretation(value),
  };
}

export function calculateExpressionNumber(fullName: string): NumberResult {
  const { sum, math: letterMath } = sumLetters(fullName);
  const value = reduceToSingleDigit(sum);
  const math = `Full name: ${letterMath} → ${value}`;
  return {
    value,
    isMaster: MASTER_NUMBERS.includes(value),
    math,
    ...getExpressionInterpretation(value),
  };
}

export function calculateSoulUrge(fullName: string): NumberResult {
  const { sum, math: letterMath } = sumLetters(fullName, "vowels");
  const value = reduceToSingleDigit(sum);
  const math = `Vowels: ${letterMath} → ${value}`;
  return {
    value,
    isMaster: MASTER_NUMBERS.includes(value),
    math,
    ...getSoulUrgeInterpretation(value),
  };
}

export function calculatePersonalityNumber(fullName: string): NumberResult {
  const { sum, math: letterMath } = sumLetters(fullName, "consonants");
  const value = reduceToSingleDigit(sum);
  const math = `Consonants: ${letterMath} → ${value}`;
  return {
    value,
    isMaster: MASTER_NUMBERS.includes(value),
    math,
    ...getPersonalityInterpretation(value),
  };
}

export function calculateMaturityNumber(
  lifePath: number,
  expression: number
): NumberResult {
  const total = lifePath + expression;
  const value = reduceToSingleDigit(total);
  const math = `Life Path (${lifePath}) + Expression (${expression}) = ${total} → ${value}`;
  return {
    value,
    isMaster: MASTER_NUMBERS.includes(value),
    math,
    ...getMaturityInterpretation(value),
  };
}

export function calculatePersonalYear(
  dob: Date,
  currentYear: number
): NumberResult {
  const month = dob.getMonth() + 1;
  const day = dob.getDate();
  const sum =
    reduceToSingleDigit(month) +
    reduceToSingleDigit(day) +
    reduceToSingleDigit(
      String(currentYear)
        .split("")
        .reduce((s, d) => s + parseInt(d), 0)
    );
  const value = reduceToSingleDigit(sum);
  const math = `Month (${month}) + Day (${day}) + Year (${currentYear}) → ${value}`;
  return {
    value,
    isMaster: MASTER_NUMBERS.includes(value),
    math,
    ...getPersonalYearInterpretation(value),
  };
}

// ─── Pinnacles & Challenges ─────────────────────────────────────────────────

export function calculatePinnacles(dob: Date): PinnacleResult[] {
  const lifePath = calculateLifePath(dob).value;
  const month = reduceToSingleDigit(dob.getMonth() + 1);
  const day = reduceToSingleDigit(dob.getDate());
  const year = reduceToSingleDigit(
    String(dob.getFullYear())
      .split("")
      .reduce((s, d) => s + parseInt(d), 0)
  );

  const firstEnd = 36 - lifePath;
  const p1 = reduceToSingleDigit(month + day);
  const p2 = reduceToSingleDigit(day + year);
  const p3 = reduceToSingleDigit(p1 + p2);
  const p4 = reduceToSingleDigit(month + year);

  return [
    {
      pinnacleNumber: 1,
      period: "First",
      ageRange: `Birth to ${firstEnd}`,
      value: p1,
      math: `Month (${month}) + Day (${day}) = ${p1}`,
      interpretation: getPinnacleInterpretation(p1),
    },
    {
      pinnacleNumber: 2,
      period: "Second",
      ageRange: `${firstEnd + 1} to ${firstEnd + 9}`,
      value: p2,
      math: `Day (${day}) + Year (${year}) = ${p2}`,
      interpretation: getPinnacleInterpretation(p2),
    },
    {
      pinnacleNumber: 3,
      period: "Third",
      ageRange: `${firstEnd + 10} to ${firstEnd + 18}`,
      value: p3,
      math: `P1 (${p1}) + P2 (${p2}) = ${p3}`,
      interpretation: getPinnacleInterpretation(p3),
    },
    {
      pinnacleNumber: 4,
      period: "Fourth",
      ageRange: `${firstEnd + 19}+`,
      value: p4,
      math: `Month (${month}) + Year (${year}) = ${p4}`,
      interpretation: getPinnacleInterpretation(p4),
    },
  ];
}

export function calculateChallenges(dob: Date): ChallengeResult[] {
  const month = reduceToSingleDigit(dob.getMonth() + 1);
  const day = reduceToSingleDigit(dob.getDate());
  const year = reduceToSingleDigit(
    String(dob.getFullYear())
      .split("")
      .reduce((s, d) => s + parseInt(d), 0)
  );

  const c1 = Math.abs(month - day);
  const c2 = Math.abs(day - year);
  const c3 = Math.abs(c1 - c2);
  const c4 = Math.abs(month - year);

  return [
    {
      challengeNumber: 1,
      period: "First",
      value: c1,
      math: `|Month (${month}) - Day (${day})| = ${c1}`,
      interpretation: getChallengeInterpretation(c1),
    },
    {
      challengeNumber: 2,
      period: "Second",
      value: c2,
      math: `|Day (${day}) - Year (${year})| = ${c2}`,
      interpretation: getChallengeInterpretation(c2),
    },
    {
      challengeNumber: 3,
      period: "Third (Main)",
      value: c3,
      math: `|C1 (${c1}) - C2 (${c2})| = ${c3}`,
      interpretation: getChallengeInterpretation(c3),
    },
    {
      challengeNumber: 4,
      period: "Fourth",
      value: c4,
      math: `|Month (${month}) - Year (${year})| = ${c4}`,
      interpretation: getChallengeInterpretation(c4),
    },
  ];
}

// ─── Master Calculator ──────────────────────────────────────────────────────

export function calculateFullNumerology(
  dob: Date,
  fullName: string,
  currentYear: number
): NumerologyResult {
  const lifePath = calculateLifePath(dob);
  const expressionNumber = calculateExpressionNumber(fullName);
  return {
    lifePath,
    birthdayNumber: calculateBirthdayNumber(dob),
    expressionNumber,
    soulUrge: calculateSoulUrge(fullName),
    personalityNumber: calculatePersonalityNumber(fullName),
    maturityNumber: calculateMaturityNumber(
      lifePath.value,
      expressionNumber.value
    ),
    pinnacles: calculatePinnacles(dob),
    challenges: calculateChallenges(dob),
    personalYear: calculatePersonalYear(dob, currentYear),
  };
}

// ─── Interpretation Data ────────────────────────────────────────────────────

function getLifePathInterpretation(n: number): {
  interpretation: string;
  risk: string;
  opportunity: string;
  bestResponse: string;
} {
  const data: Record<
    number,
    {
      interpretation: string;
      risk: string;
      opportunity: string;
      bestResponse: string;
    }
  > = {
    1: {
      interpretation:
        "The Independent Leader. You are driven to pioneer, innovate, and lead. Your path is about individuality, courage, and self-reliance.",
      risk: "Stubbornness, isolation, ego dominance",
      opportunity: "Original ideas, entrepreneurship, trailblazing",
      bestResponse: "Lead with empathy, embrace collaboration when needed",
    },
    2: {
      interpretation:
        "The Diplomatic Peacemaker. You thrive through partnerships, sensitivity, and cooperation. Your path is about balance and emotional intelligence.",
      risk: "Over-sensitivity, indecision, people-pleasing",
      opportunity: "Mediation, deep partnerships, counseling, art",
      bestResponse:
        "Set boundaries while maintaining your natural empathy",
    },
    3: {
      interpretation:
        "The Creative Communicator. You are expressive, optimistic, and artistic. Your path is about joy, self-expression, and inspiring others.",
      risk: "Scattered energy, superficiality, escapism",
      opportunity: "Writing, performing, teaching, design",
      bestResponse: "Focus your creative energy, finish what you start",
    },
    4: {
      interpretation:
        "The Practical Builder. You are disciplined, methodical, and grounded. Your path is about creating lasting structures and systems.",
      risk: "Rigidity, overwork, resistance to change",
      opportunity:
        "Architecture, management, engineering, process design",
      bestResponse:
        "Build flexibility into your systems, allow room for spontaneity",
    },
    5: {
      interpretation:
        "The Freedom Seeker. You crave variety, adventure, and change. Your path is about adaptability and experiencing life fully.",
      risk: "Restlessness, impulsiveness, commitment issues",
      opportunity:
        "Travel, sales, marketing, entrepreneurship, consulting",
      bestResponse:
        "Create freedom within structure, commit to growth",
    },
    6: {
      interpretation:
        "The Responsible Nurturer. You are caring, protective, and community-oriented. Your path is about love, responsibility, and service.",
      risk: "Over-giving, martyrdom, controlling behavior",
      opportunity:
        "Healing, teaching, counseling, design, hospitality",
      bestResponse:
        "Nurture yourself first, set healthy limits on giving",
    },
    7: {
      interpretation:
        "The Analytical Seeker. You are introspective, intuitive, and knowledge-driven. Your path is about wisdom, research, and inner truth.",
      risk: "Isolation, overthinking, cynicism, emotional detachment",
      opportunity:
        "Research, technology, psychology, philosophy, writing",
      bestResponse:
        "Balance solitude with connection, trust your intuition",
    },
    8: {
      interpretation:
        "The Power Player. You are ambitious, authoritative, and materially focused. Your path is about mastery, wealth, and influence.",
      risk: "Workaholism, materialism, power struggles",
      opportunity:
        "Business leadership, finance, real estate, executive roles",
      bestResponse: "Use power for collective benefit, stay ethical",
    },
    9: {
      interpretation:
        "The Humanitarian Visionary. You are compassionate, idealistic, and globally minded. Your path is about service, completion, and transformation.",
      risk: "Resentment from unreciprocated giving, boundary issues",
      opportunity:
        "Nonprofit, art, healing, international work, teaching",
      bestResponse:
        "Release what no longer serves you, give without expectation",
    },
    11: {
      interpretation:
        "The Intuitive Illuminator (Master Number). You carry heightened intuition, spiritual insight, and visionary energy. Your path is about inspiration and awakening.",
      risk: "Anxiety, nervous energy, imposter syndrome",
      opportunity:
        "Spiritual leadership, counseling, creative arts, innovation",
      bestResponse:
        "Ground your visions in practical action, manage your sensitivity",
    },
    22: {
      interpretation:
        "The Master Builder (Master Number). You have the potential to turn grand visions into reality. Your path is about large-scale creation and legacy.",
      risk: "Overwhelm, perfectionism, fear of failure at scale",
      opportunity:
        "Architecture, global business, institutional creation, policy",
      bestResponse:
        "Start with small builds, scale methodically, delegate",
    },
    33: {
      interpretation:
        "The Master Teacher (Master Number). You embody selfless service, healing, and uplifting others. Your path is about compassion at the highest level.",
      risk: "Self-sacrifice, burnout, emotional absorption",
      opportunity:
        "Teaching, healing arts, humanitarian leadership, mentoring",
      bestResponse:
        "Protect your energy, teach by example not exhaustion",
    },
  };
  return data[n] || data[reduceToSingleDigit(n)] || data[1];
}

function getBirthdayInterpretation(n: number): {
  interpretation: string;
  risk: string;
  opportunity: string;
  bestResponse: string;
} {
  return {
    interpretation: `Birthday number ${n} adds a secondary influence of ${
      n === 1
        ? "independence and initiative"
        : n === 2
          ? "cooperation and sensitivity"
          : n === 3
            ? "creativity and expression"
            : n === 4
              ? "stability and discipline"
              : n === 5
                ? "freedom and adaptability"
                : n === 6
                  ? "responsibility and care"
                  : n === 7
                    ? "analysis and introspection"
                    : n === 8
                      ? "ambition and authority"
                      : "compassion and vision"
    } to your core profile.`,
    risk: "May amplify tendencies already present in Life Path",
    opportunity: "Provides additional tools and talents to draw from",
    bestResponse:
      "Integrate this energy consciously into daily decisions",
  };
}

function getExpressionInterpretation(n: number): {
  interpretation: string;
  risk: string;
  opportunity: string;
  bestResponse: string;
} {
  return {
    interpretation: `Expression ${n} reveals your natural talents and abilities — ${
      n === 1
        ? "leadership and originality"
        : n === 2
          ? "diplomacy and partnership"
          : n === 3
            ? "artistry and communication"
            : n === 4
              ? "organization and dedication"
              : n === 5
                ? "versatility and resourcefulness"
                : n === 6
                  ? "nurturing and creativity"
                  : n === 7
                    ? "intellect and spirituality"
                    : n === 8
                      ? "executive ability and judgment"
                      : n === 9
                        ? "humanitarianism and generosity"
                        : n === 11
                          ? "intuition and inspiration"
                          : n === 22
                            ? "master building and vision"
                            : "teaching and healing"
    }.`,
    risk: "Underusing these talents or overcompensating",
    opportunity:
      "Aligning career and relationships with natural expression",
    bestResponse:
      "Lean into this energy in your professional and creative life",
  };
}

function getSoulUrgeInterpretation(n: number): {
  interpretation: string;
  risk: string;
  opportunity: string;
  bestResponse: string;
} {
  return {
    interpretation: `Soul Urge ${n} reveals your deepest desire: ${
      n === 1
        ? "to lead and be recognized"
        : n === 2
          ? "to find love and harmony"
          : n === 3
            ? "to express and create joy"
            : n === 4
              ? "to build lasting security"
              : n === 5
                ? "to experience freedom"
                : n === 6
                  ? "to nurture and be needed"
                  : n === 7
                    ? "to understand life's mysteries"
                    : n === 8
                      ? "to achieve mastery and success"
                      : "to serve and uplift humanity"
    }.`,
    risk: "Ignoring this need leads to chronic dissatisfaction",
    opportunity:
      "Fulfillment comes from aligning life with this core desire",
    bestResponse:
      "Make decisions that honor this deep motivation",
  };
}

function getPersonalityInterpretation(n: number): {
  interpretation: string;
  risk: string;
  opportunity: string;
  bestResponse: string;
} {
  return {
    interpretation: `Personality ${n} is how others perceive you — ${
      n === 1
        ? "confident and independent"
        : n === 2
          ? "gentle and approachable"
          : n === 3
            ? "charming and expressive"
            : n === 4
              ? "reliable and grounded"
              : n === 5
                ? "dynamic and magnetic"
                : n === 6
                  ? "warm and responsible"
                  : n === 7
                    ? "mysterious and thoughtful"
                    : n === 8
                      ? "powerful and authoritative"
                      : "compassionate and wise"
    }.`,
    risk: "Gap between outer perception and inner truth",
    opportunity: "Use this social energy strategically",
    bestResponse:
      "Align your outer presentation with your authentic self",
  };
}

function getMaturityInterpretation(n: number): {
  interpretation: string;
  risk: string;
  opportunity: string;
  bestResponse: string;
} {
  return {
    interpretation: `Maturity Number ${n} emerges in your 40s-50s, bringing ${
      n === 1
        ? "a drive for independence"
        : n === 2
          ? "deeper relationship focus"
          : n === 3
            ? "creative renaissance"
            : n === 4
              ? "practical mastery"
              : n === 5
                ? "a second wind of adventure"
                : n === 6
                  ? "family and community leadership"
                  : n === 7
                    ? "spiritual deepening"
                    : n === 8
                      ? "financial mastery"
                      : "humanitarian calling"
    }.`,
    risk: "Resisting the shift in priorities this number brings",
    opportunity:
      "A powerful second-half-of-life energy to harness",
    bestResponse: "Prepare for this evolution and welcome it",
  };
}

function getPersonalYearInterpretation(n: number): {
  interpretation: string;
  risk: string;
  opportunity: string;
  bestResponse: string;
} {
  const themes: Record<
    number,
    {
      interpretation: string;
      risk: string;
      opportunity: string;
      bestResponse: string;
    }
  > = {
    1: {
      interpretation:
        "Year of new beginnings, fresh starts, and planting seeds.",
      risk: "Impatience with slow results",
      opportunity:
        "Launch projects, set intentions, take initiative",
      bestResponse: "Be bold but strategic with new ventures",
    },
    2: {
      interpretation:
        "Year of patience, partnerships, and behind-the-scenes growth.",
      risk: "Frustration with the pace",
      opportunity:
        "Deepen relationships, refine plans, cooperate",
      bestResponse: "Trust the process and nurture connections",
    },
    3: {
      interpretation:
        "Year of creativity, social expansion, and self-expression.",
      risk: "Scattered focus, overcommitting socially",
      opportunity: "Create, network, communicate, play",
      bestResponse:
        "Channel joy into productive creative outlets",
    },
    4: {
      interpretation:
        "Year of building foundations, hard work, and discipline.",
      risk: "Burnout, feeling restricted",
      opportunity:
        "Build systems, establish roots, get organized",
      bestResponse:
        "Embrace the grind — this year's work pays off later",
    },
    5: {
      interpretation:
        "Year of change, freedom, travel, and unexpected opportunities.",
      risk: "Instability, reckless choices",
      opportunity:
        "Travel, pivot, take calculated risks, explore",
      bestResponse:
        "Stay adaptable but don't abandon everything",
    },
    6: {
      interpretation:
        "Year of home, family, responsibility, and love.",
      risk: "Over-obligation, neglecting self",
      opportunity:
        "Strengthen family bonds, commit, beautify your space",
      bestResponse:
        "Balance giving with receiving, tend to your home",
    },
    7: {
      interpretation:
        "Year of reflection, study, solitude, and inner growth.",
      risk: "Isolation, depression if resisted",
      opportunity:
        "Study, meditate, research, heal, go inward",
      bestResponse:
        "Honor the need for retreat without withdrawing from life",
    },
    8: {
      interpretation:
        "Year of power, money, career advancement, and recognition.",
      risk: "Obsession with status, ethical shortcuts",
      opportunity:
        "Negotiate, invest, lead, claim authority",
      bestResponse:
        "Step into your power responsibly and generously",
    },
    9: {
      interpretation:
        "Year of endings, release, completion, and transformation.",
      risk: "Clinging to what's over, grief",
      opportunity:
        "Let go, forgive, clear space, complete cycles",
      bestResponse:
        "Release gracefully — new beginnings await next year",
    },
  };
  return themes[n] || themes[reduceToSingleDigit(n)] || themes[1];
}

function getPinnacleInterpretation(n: number): string {
  const interps: Record<number, string> = {
    1: "A period of independence, self-reliance, and new ventures.",
    2: "A period of cooperation, patience, and relationship building.",
    3: "A period of creative expression, joy, and social expansion.",
    4: "A period of hard work, building foundations, and practical growth.",
    5: "A period of change, adventure, and personal freedom.",
    6: "A period of family responsibility, love, and community service.",
    7: "A period of introspection, study, and spiritual development.",
    8: "A period of material achievement, power, and career advancement.",
    9: "A period of humanitarian service, completion, and letting go.",
  };
  return interps[reduceToSingleDigit(n)] || interps[1];
}

function getChallengeInterpretation(n: number): string {
  const interps: Record<number, string> = {
    0: "The challenge of choice — all options are open but direction must be chosen consciously.",
    1: "The challenge of asserting yourself without dominating others.",
    2: "The challenge of maintaining self-worth in partnerships.",
    3: "The challenge of focusing creative energy without scattering.",
    4: "The challenge of embracing discipline without becoming rigid.",
    5: "The challenge of using freedom responsibly.",
    6: "The challenge of caring for others without losing yourself.",
    7: "The challenge of trusting others and opening up emotionally.",
    8: "The challenge of handling power and money ethically.",
    9: "The challenge of letting go and serving without attachment.",
  };
  return interps[n] || interps[0];
}
