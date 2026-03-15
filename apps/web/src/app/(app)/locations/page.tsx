"use client";

import { useState } from "react";

type RegionScope = "california" | "usa" | "world";
type Category = "reinvention" | "love" | "money" | "creativity" | "spirituality" | "community" | "family" | "short_trips";

interface CityInfo {
  name: string;
  score: number;
  reason: string;
  risk: string;
  neighborhood: string;
  gradient: string;
  emoji: string;
}

const CITY_DATA: Record<Category, CityInfo[]> = {
  reinvention: [
    {
      name: "Austin, TX",
      score: 92,
      reason: "Tech-meets-creativity energy with a 'keep it weird' ethos that rewards reinvention. Strong startup culture means reinventing yourself is the norm, not the exception.",
      risk: "Rapid growth is pricing out the very culture that made it attractive",
      neighborhood: "East Austin or South Congress",
      gradient: "from-amber-400 via-orange-500 to-red-500",
      emoji: "\u{1F3B8}",
    },
    {
      name: "Denver, CO",
      score: 89,
      reason: "Altitude shift meets attitude shift. The outdoor lifestyle and booming economy create ideal conditions for people rewriting their life story.",
      risk: "Winter isolation can amplify transition anxiety if unprepared",
      neighborhood: "RiNo or Capitol Hill",
      gradient: "from-emerald-400 via-teal-500 to-cyan-600",
      emoji: "\u{1F3D4}\uFE0F",
    },
    {
      name: "Lisbon, Portugal",
      score: 88,
      reason: "Affordable European living with a thriving expat community of people who left their old lives behind. The saudade culture honors transformation through melancholy.",
      risk: "Language barrier and bureaucratic slowness test patience during transition",
      neighborhood: "Alfama or Principe Real",
      gradient: "from-rose-400 via-pink-500 to-fuchsia-600",
      emoji: "\u{1F1F5}\u{1F1F9}",
    },
    {
      name: "Medell\u00EDn, Colombia",
      score: 85,
      reason: "A city that reinvented itself from violence to innovation. The energy of transformation is in the air, and the cost of living gives you runway to experiment.",
      risk: "Safety concerns in certain neighborhoods require local knowledge",
      neighborhood: "El Poblado or Laureles",
      gradient: "from-green-400 via-emerald-500 to-teal-600",
      emoji: "\u{1F1E8}\u{1F1F4}",
    },
    {
      name: "Taipei, Taiwan",
      score: 83,
      reason: "Incredible infrastructure, affordable healthcare, and a culture that respects both tradition and innovation. Digital nomad visa makes long-term stays feasible.",
      risk: "Humidity and language barrier create an adjustment curve",
      neighborhood: "Da'an or Xinyi District",
      gradient: "from-red-400 via-rose-500 to-pink-600",
      emoji: "\u{1F1F9}\u{1F1FC}",
    },
  ],
  love: [
    {
      name: "Paris, France",
      score: 95,
      reason: "City of love with deep romantic culture woven into every cobblestone. The cafe culture encourages lingering conversation, and beauty surrounds you at every turn.",
      risk: "High cost of living and Parisian social codes can feel exclusionary at first",
      neighborhood: "Le Marais or Montmartre",
      gradient: "from-rose-400 via-pink-500 to-purple-600",
      emoji: "\u{1F1EB}\u{1F1F7}",
    },
    {
      name: "Buenos Aires, Argentina",
      score: 91,
      reason: "Tango culture means passion is a way of life. The late-night dining, expressive art scene, and warm social culture make deep connection effortless.",
      risk: "Economic instability and inflation can complicate long-term planning",
      neighborhood: "Palermo Soho or San Telmo",
      gradient: "from-sky-400 via-blue-500 to-indigo-600",
      emoji: "\u{1F1E6}\u{1F1F7}",
    },
    {
      name: "Lisbon, Portugal",
      score: 88,
      reason: "The fado music tradition channels heartbreak and longing into beauty. Warm people, stunning architecture, and a pace of life that prioritizes human connection over hustle.",
      risk: "Language barrier can limit depth of early romantic connections",
      neighborhood: "Bairro Alto or Chiado",
      gradient: "from-amber-400 via-orange-500 to-rose-500",
      emoji: "\u{1F1F5}\u{1F1F9}",
    },
    {
      name: "Barcelona, Spain",
      score: 86,
      reason: "Mediterranean warmth in both climate and culture. The beach-to-city lifestyle and social dining culture create endless opportunities for connection.",
      risk: "Tourist density can make finding authentic community challenging",
      neighborhood: "Gr\u00E0cia or El Born",
      gradient: "from-orange-400 via-red-500 to-rose-600",
      emoji: "\u{1F1EA}\u{1F1F8}",
    },
    {
      name: "Kyoto, Japan",
      score: 84,
      reason: "Subtle, intentional beauty in every interaction. The culture of omotenashi (hospitality) and seasonal awareness creates a deeply romantic awareness of fleeting moments.",
      risk: "Reserved social norms mean romantic connections develop slowly",
      neighborhood: "Higashiyama or Arashiyama",
      gradient: "from-pink-400 via-rose-500 to-red-600",
      emoji: "\u{1F1EF}\u{1F1F5}",
    },
  ],
  money: [
    {
      name: "San Francisco, CA",
      score: 94,
      reason: "The global epicenter of venture capital and tech innovation. Proximity to Sand Hill Road and a culture that celebrates ambitious thinking means your ideas have the highest ceiling here.",
      risk: "Extreme cost of living can drain savings before momentum builds",
      neighborhood: "SoMa or Mission District",
      gradient: "from-slate-400 via-blue-500 to-amber-500",
      emoji: "\u{1F309}",
    },
    {
      name: "Singapore",
      score: 92,
      reason: "Asia's financial powerhouse with zero capital gains tax, world-class infrastructure, and a government that actively courts entrepreneurs and investors.",
      risk: "High cost of living and social rigidity can feel constraining",
      neighborhood: "Tanjong Pagar or Tiong Bahru",
      gradient: "from-red-500 via-white to-red-600",
      emoji: "\u{1F1F8}\u{1F1EC}",
    },
    {
      name: "Dubai, UAE",
      score: 90,
      reason: "Zero income tax, booming real estate, and a global crossroads where East meets West for business. The city rewards ambition with few bureaucratic barriers.",
      risk: "Extreme heat limits outdoor lifestyle half the year; social norms differ significantly",
      neighborhood: "DIFC or Dubai Marina",
      gradient: "from-amber-400 via-yellow-500 to-orange-600",
      emoji: "\u{1F1E6}\u{1F1EA}",
    },
    {
      name: "Austin, TX",
      score: 88,
      reason: "No state income tax, exploding tech scene, and a fraction of Silicon Valley's cost. Tesla, Oracle, and countless startups chose here for a reason.",
      risk: "Infrastructure struggling to keep pace with explosive growth",
      neighborhood: "Downtown or The Domain",
      gradient: "from-orange-400 via-amber-500 to-yellow-600",
      emoji: "\u{1F3B8}",
    },
    {
      name: "Zurich, Switzerland",
      score: 85,
      reason: "Global banking capital with extraordinary stability, rule of law, and access to European markets. High salaries offset high costs, and quality of life is unmatched.",
      risk: "Very high cost of living and conservative business culture can slow maverick approaches",
      neighborhood: "Kreis 1 or Seefeld",
      gradient: "from-gray-400 via-slate-500 to-blue-600",
      emoji: "\u{1F1E8}\u{1F1ED}",
    },
  ],
  creativity: [
    {
      name: "Berlin, Germany",
      score: 93,
      reason: "The world's creative capital where cheap rent, abandoned warehouses, and a counter-cultural spirit fuel artistic risk-taking. The city doesn't just tolerate weirdness \u2014 it demands it.",
      risk: "Bureaucratic German systems and gray winters can dampen momentum",
      neighborhood: "Kreuzberg or Neuk\u00F6lln",
      gradient: "from-gray-500 via-slate-600 to-purple-700",
      emoji: "\u{1F1E9}\u{1F1EA}",
    },
    {
      name: "Brooklyn, NY",
      score: 91,
      reason: "The beating heart of American creative culture. Every block has a gallery, studio, or performance space. The density of creative talent creates an electric feedback loop.",
      risk: "Gentrification has pushed costs to unsustainable levels for many artists",
      neighborhood: "Bushwick or Williamsburg",
      gradient: "from-orange-400 via-red-500 to-purple-600",
      emoji: "\u{1F5FD}",
    },
    {
      name: "Melbourne, Australia",
      score: 88,
      reason: "Laneway culture, world-class street art, and a coffee obsession that fuels creative energy. The arts funding ecosystem is among the best in the Southern Hemisphere.",
      risk: "Geographic isolation from major markets can limit career reach",
      neighborhood: "Fitzroy or Collingwood",
      gradient: "from-blue-400 via-indigo-500 to-violet-600",
      emoji: "\u{1F1E6}\u{1F1FA}",
    },
    {
      name: "Portland, OR",
      score: 86,
      reason: "DIY ethos meets maker culture. The low pretension and high collaboration make this ideal for creatives who want community over competition.",
      risk: "Gray winters (8+ months of overcast) and growing homelessness crisis",
      neighborhood: "Alberta Arts District or Division",
      gradient: "from-green-500 via-emerald-500 to-lime-500",
      emoji: "\u{1F332}",
    },
    {
      name: "Florence, Italy",
      score: 84,
      reason: "The birthplace of the Renaissance still pulses with artistic energy. Walking past Brunelleschi's dome daily rewires your creative ambition at a cellular level.",
      risk: "Tourist saturation and limited contemporary art market",
      neighborhood: "Oltrarno or Santo Spirito",
      gradient: "from-amber-400 via-orange-500 to-red-600",
      emoji: "\u{1F1EE}\u{1F1F9}",
    },
  ],
  spirituality: [
    {
      name: "Sedona, AZ",
      score: 95,
      reason: "Vortex energy sites, red rock cathedrals, and a community built around spiritual practice. The landscape itself feels like a portal to something deeper.",
      risk: "Small-town isolation and New Age commercialization can feel inauthentic",
      neighborhood: "West Sedona or Village of Oak Creek",
      gradient: "from-red-500 via-orange-600 to-amber-700",
      emoji: "\u{1F3DC}\uFE0F",
    },
    {
      name: "Bali, Indonesia",
      score: 93,
      reason: "Daily temple offerings, rice terrace meditation, and a Hindu-animist culture that weaves spirituality into every moment. The cost of living lets you focus inward, not on survival.",
      risk: "Tourist overload in popular areas dilutes the spiritual atmosphere",
      neighborhood: "Ubud or Sidemen",
      gradient: "from-green-400 via-emerald-500 to-teal-600",
      emoji: "\u{1F1EE}\u{1F1E9}",
    },
    {
      name: "Rishikesh, India",
      score: 90,
      reason: "The yoga capital of the world where the Ganges meets the Himalayas. Ashrams, meditation centers, and a 5000-year tradition of seeking enlightenment right here.",
      risk: "Infrastructure challenges, pollution, and culture shock for Western visitors",
      neighborhood: "Tapovan or Laxman Jhula area",
      gradient: "from-orange-400 via-amber-500 to-yellow-600",
      emoji: "\u{1F1EE}\u{1F1F3}",
    },
    {
      name: "Tulum, Mexico",
      score: 87,
      reason: "Ancient Mayan energy meets modern wellness culture. Cenote ceremonies, cacao rituals, and Caribbean sunrises create a potent container for spiritual growth.",
      risk: "Rapid commercialization is eroding the authentic spiritual community",
      neighborhood: "Tulum Pueblo or Beach Zone South",
      gradient: "from-cyan-400 via-teal-500 to-emerald-600",
      emoji: "\u{1F1F2}\u{1F1FD}",
    },
    {
      name: "Kyoto, Japan",
      score: 85,
      reason: "Zen Buddhism permeates daily life through tea ceremonies, rock gardens, and forest bathing. The city teaches presence through aesthetics and seasonal awareness.",
      risk: "Spiritual practices are deeply culturally embedded and may feel inaccessible to outsiders",
      neighborhood: "Arashiyama or Northern Higashiyama",
      gradient: "from-pink-400 via-rose-500 to-red-600",
      emoji: "\u{1F1EF}\u{1F1F5}",
    },
  ],
  community: [
    {
      name: "Copenhagen, Denmark",
      score: 94,
      reason: "The world's happiest city, designed around community. Cohousing, cycling culture, and hygge philosophy create effortless human connection at every scale.",
      risk: "Extremely high cost of living and difficult-to-penetrate social circles for newcomers",
      neighborhood: "N\u00F8rrebro or Vesterbro",
      gradient: "from-red-400 via-white to-red-500",
      emoji: "\u{1F1E9}\u{1F1F0}",
    },
    {
      name: "Vancouver, Canada",
      score: 91,
      reason: "Multicultural mosaic with nature at your doorstep. Strong neighborhood identities, public spaces designed for gathering, and a culture that values inclusivity.",
      risk: "Housing crisis makes affordability a serious barrier to putting down roots",
      neighborhood: "Commercial Drive or Kitsilano",
      gradient: "from-emerald-400 via-teal-500 to-cyan-600",
      emoji: "\u{1F1E8}\u{1F1E6}",
    },
    {
      name: "Amsterdam, Netherlands",
      score: 89,
      reason: "Bicycle culture, brown cafes, and a Dutch directness that shortens the path to real friendship. The city is built at human scale, making bumping into people inevitable.",
      risk: "Housing shortage is acute; securing an apartment can take months",
      neighborhood: "De Pijp or Jordaan",
      gradient: "from-orange-400 via-amber-500 to-yellow-500",
      emoji: "\u{1F1F3}\u{1F1F1}",
    },
    {
      name: "Portland, OR",
      score: 87,
      reason: "Neighborhood identity is everything here. Farmers markets, community gardens, and a buy-local ethos create the small-town feeling inside a city.",
      risk: "Political polarization and homelessness crisis have strained community fabric",
      neighborhood: "Hawthorne or Sellwood",
      gradient: "from-green-400 via-emerald-500 to-lime-500",
      emoji: "\u{1F332}",
    },
    {
      name: "Wellington, NZ",
      score: 84,
      reason: "A capital city that feels like a village. Creative, politically engaged, and small enough that you become a regular everywhere within weeks.",
      risk: "Geographic isolation and earthquake risk; small market limits career options",
      neighborhood: "Cuba Street or Aro Valley",
      gradient: "from-blue-400 via-indigo-500 to-violet-600",
      emoji: "\u{1F1F3}\u{1F1FF}",
    },
  ],
  family: [
    {
      name: "San Diego, CA",
      score: 93,
      reason: "Year-round sunshine, world-class beaches, excellent schools, and a laid-back pace that lets families actually enjoy each other. The zoo, Legoland, and nature are always minutes away.",
      risk: "High cost of living especially in top school districts",
      neighborhood: "North Park or La Jolla",
      gradient: "from-sky-400 via-cyan-500 to-blue-600",
      emoji: "\u{1F3D6}\uFE0F",
    },
    {
      name: "Nashville, TN",
      score: 90,
      reason: "Booming economy, no state income tax, strong community values, and a culture of hospitality that makes raising a family feel supported by an entire city.",
      risk: "Rapid growth straining infrastructure; summer heat is intense",
      neighborhood: "12 South or East Nashville",
      gradient: "from-amber-400 via-yellow-500 to-orange-500",
      emoji: "\u{1F3B6}",
    },
    {
      name: "Zurich, Switzerland",
      score: 88,
      reason: "Among the safest cities on Earth with pristine nature, exceptional public schools, and a culture that prioritizes work-life balance. The lake and Alps are your family's backyard.",
      risk: "Extremely high cost of living; Swiss social integration takes years",
      neighborhood: "Enge or Wollishofen",
      gradient: "from-gray-400 via-slate-500 to-blue-600",
      emoji: "\u{1F1E8}\u{1F1ED}",
    },
    {
      name: "Auckland, NZ",
      score: 86,
      reason: "Adventure lifestyle with exceptional safety. Beaches, rainforests, and volcanoes are all within 30 minutes. The school system emphasizes outdoor learning and creativity.",
      risk: "Geographic isolation from extended family; housing costs have surged",
      neighborhood: "Devonport or Ponsonby",
      gradient: "from-emerald-400 via-teal-500 to-cyan-600",
      emoji: "\u{1F1F3}\u{1F1FF}",
    },
    {
      name: "Raleigh, NC",
      score: 84,
      reason: "Research Triangle brings world-class education and career opportunities. Affordable homes with yards, mild climate, and a strong sense of Southern neighborliness.",
      risk: "Suburban sprawl requires car dependency; less walkable than coastal cities",
      neighborhood: "Cameron Village or North Hills",
      gradient: "from-green-400 via-emerald-500 to-teal-500",
      emoji: "\u{1F333}",
    },
  ],
  short_trips: [
    {
      name: "Tokyo, Japan",
      score: 96,
      reason: "Maximum sensory density per square mile on Earth. From Shibuya crossing to hidden ramen counters to robot restaurants, every hour delivers a new unforgettable moment.",
      risk: "Overwhelming stimulation and language barrier can cause decision fatigue",
      neighborhood: "Shimokitazawa or Yanaka",
      gradient: "from-cyan-400 via-pink-500 to-fuchsia-600",
      emoji: "\u{1F1EF}\u{1F1F5}",
    },
    {
      name: "Iceland",
      score: 93,
      reason: "Otherworldly landscapes packed into a small island. Northern lights, geysers, black sand beaches, and glacier hikes deliver a lifetime of memories in one week.",
      risk: "Extreme weather can disrupt plans; very expensive for food and lodging",
      neighborhood: "Reykjavik 101 or Golden Circle route",
      gradient: "from-blue-400 via-indigo-500 to-slate-600",
      emoji: "\u{1F1EE}\u{1F1F8}",
    },
    {
      name: "Marrakech, Morocco",
      score: 90,
      reason: "Sensory overload in the best way: spice markets, mosaic palaces, rooftop terraces with Atlas Mountain views. A week here rewires your relationship with beauty and chaos.",
      risk: "Aggressive vendor culture and navigating medina can be stressful for first-timers",
      neighborhood: "Medina or Gueliz",
      gradient: "from-orange-400 via-red-500 to-rose-600",
      emoji: "\u{1F1F2}\u{1F1E6}",
    },
    {
      name: "Prague, Czech Republic",
      score: 88,
      reason: "Gothic fairy-tale architecture, incredible beer culture, and one of Europe's best value-for-money destinations. Walkable, photogenic, and endlessly charming.",
      risk: "Tourist traps in Old Town can erode authenticity of experience",
      neighborhood: "Vinohrady or \u017Di\u017Ekov",
      gradient: "from-amber-400 via-orange-500 to-red-600",
      emoji: "\u{1F1E8}\u{1F1FF}",
    },
    {
      name: "Cape Town, South Africa",
      score: 85,
      reason: "Table Mountain, penguin beaches, world-class wine country, and dramatic coastlines. The natural beauty per dollar spent is perhaps the highest on Earth.",
      risk: "Safety concerns require awareness; load-shedding power cuts can disrupt plans",
      neighborhood: "Bo-Kaap or Camps Bay",
      gradient: "from-yellow-400 via-amber-500 to-orange-600",
      emoji: "\u{1F1FF}\u{1F1E6}",
    },
  ],
};

const CITY_GRADIENTS: Record<string, string> = {
  "Paris, France": "from-rose-400 via-pink-500 to-purple-600",
  "Buenos Aires, Argentina": "from-sky-400 via-blue-500 to-indigo-600",
  "Lisbon, Portugal": "from-amber-400 via-orange-500 to-rose-500",
  "Barcelona, Spain": "from-orange-400 via-red-500 to-rose-600",
  "Kyoto, Japan": "from-pink-400 via-rose-500 to-red-600",
  "San Francisco, CA": "from-slate-400 via-blue-500 to-amber-500",
  "Singapore": "from-red-500 via-rose-400 to-red-600",
  "Dubai, UAE": "from-amber-400 via-yellow-500 to-orange-600",
  "Austin, TX": "from-amber-400 via-orange-500 to-red-500",
  "Zurich, Switzerland": "from-gray-400 via-slate-500 to-blue-600",
  "Berlin, Germany": "from-gray-500 via-slate-600 to-purple-700",
  "Brooklyn, NY": "from-orange-400 via-red-500 to-purple-600",
  "Melbourne, Australia": "from-blue-400 via-indigo-500 to-violet-600",
  "Portland, OR": "from-green-500 via-emerald-500 to-lime-500",
  "Florence, Italy": "from-amber-400 via-orange-500 to-red-600",
  "Sedona, AZ": "from-red-500 via-orange-600 to-amber-700",
  "Bali, Indonesia": "from-green-400 via-emerald-500 to-teal-600",
  "Rishikesh, India": "from-orange-400 via-amber-500 to-yellow-600",
  "Tulum, Mexico": "from-cyan-400 via-teal-500 to-emerald-600",
  "Copenhagen, Denmark": "from-red-400 via-rose-300 to-red-500",
  "Vancouver, Canada": "from-emerald-400 via-teal-500 to-cyan-600",
  "Amsterdam, Netherlands": "from-orange-400 via-amber-500 to-yellow-500",
  "Wellington, NZ": "from-blue-400 via-indigo-500 to-violet-600",
  "San Diego, CA": "from-sky-400 via-cyan-500 to-blue-600",
  "Nashville, TN": "from-amber-400 via-yellow-500 to-orange-500",
  "Auckland, NZ": "from-emerald-400 via-teal-500 to-cyan-600",
  "Raleigh, NC": "from-green-400 via-emerald-500 to-teal-500",
  "Tokyo, Japan": "from-cyan-400 via-pink-500 to-fuchsia-600",
  "Iceland": "from-blue-400 via-indigo-500 to-slate-600",
  "Marrakech, Morocco": "from-orange-400 via-red-500 to-rose-600",
  "Prague, Czech Republic": "from-amber-400 via-orange-500 to-red-600",
  "Cape Town, South Africa": "from-yellow-400 via-amber-500 to-orange-600",
  "Denver, CO": "from-emerald-400 via-teal-500 to-cyan-600",
  "Medell\u00EDn, Colombia": "from-green-400 via-emerald-500 to-teal-600",
  "Taipei, Taiwan": "from-red-400 via-rose-500 to-pink-600",
};

const REGION_CONFIG: { key: RegionScope; label: string; emoji: string }[] = [
  { key: "california", label: "California", emoji: "\u{1F334}" },
  { key: "usa", label: "United States", emoji: "\u{1F1FA}\u{1F1F8}" },
  { key: "world", label: "Worldwide", emoji: "\u{1F30D}" },
];

const CATEGORY_CONFIG: { key: Category; label: string; emoji: string; color: string }[] = [
  { key: "reinvention", label: "Reinvention", emoji: "\u{1F98B}", color: "from-purple-500 to-violet-500" },
  { key: "love", label: "Love", emoji: "\u{1F495}", color: "from-rose-400 to-pink-500" },
  { key: "money", label: "Money", emoji: "\u{1F4B0}", color: "from-emerald-400 to-green-500" },
  { key: "creativity", label: "Creativity", emoji: "\u{1F3A8}", color: "from-orange-400 to-amber-500" },
  { key: "spirituality", label: "Spirituality", emoji: "\u{1F52E}", color: "from-indigo-400 to-purple-500" },
  { key: "community", label: "Community", emoji: "\u{1F91D}", color: "from-sky-400 to-blue-500" },
  { key: "family", label: "Family", emoji: "\u{1F468}\u200D\u{1F469}\u200D\u{1F467}\u200D\u{1F466}", color: "from-teal-400 to-cyan-500" },
  { key: "short_trips", label: "Short Trips", emoji: "\u2708\uFE0F", color: "from-fuchsia-400 to-pink-500" },
];

const MAP_PIN_POSITIONS = [
  { top: "18%", left: "22%" },
  { top: "38%", left: "48%" },
  { top: "12%", left: "68%" },
  { top: "55%", left: "32%" },
  { top: "30%", left: "78%" },
];

function ScoreRing({ score, size = 80 }: { score: number; size?: number }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 90 ? "stroke-emerald-400" : score >= 85 ? "stroke-cyan-400" : score >= 80 ? "stroke-amber-400" : "stroke-gray-400";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth="5" className="stroke-white/10" />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          strokeWidth="5" strokeLinecap="round"
          className={color}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-extrabold text-white">{score}</span>
        <span className="text-[10px] text-white/40 font-medium">/ 100</span>
      </div>
    </div>
  );
}

function RiskPill({ risk }: { risk: string }) {
  const isHigh = risk.toLowerCase().includes("high") || risk.toLowerCase().includes("extreme") || risk.toLowerCase().includes("pressure");
  const isMedium = risk.toLowerCase().includes("rapid") || risk.toLowerCase().includes("winter") || risk.toLowerCase().includes("gray") || risk.toLowerCase().includes("overwhelming");
  const color = isHigh
    ? "bg-red-500/10 text-red-400 border-red-500/20"
    : isMedium
    ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
    : "bg-blue-500/10 text-blue-400 border-blue-500/20";

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${color}`}>
      {isHigh ? "\u26A0\uFE0F" : isMedium ? "\u26A1" : "\u2139\uFE0F"} {risk}
    </span>
  );
}

export default function LocationsPage() {
  const [region, setRegion] = useState<RegionScope>("usa");
  const [category, setCategory] = useState<Category>("reinvention");

  const cities = CITY_DATA[category];
  const activeCategoryConfig = CATEGORY_CONFIG.find((c) => c.key === category);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-950 via-slate-900 to-zinc-900 p-8 md:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(6,182,212,0.2),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(16,185,129,0.15),transparent_60%)]" />
        <div className="relative z-10">
          <p className="text-sm font-medium uppercase tracking-widest text-cyan-400 mb-2">{"\u{1F4CD}"} GPS for Your Soul</p>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3">Location Analysis</h1>
          <p className="text-lg text-white/50 max-w-xl">
            Discover cities that align with your energy, goals, and growth trajectory.
          </p>
        </div>
      </div>

      {/* Region Selector */}
      <div className="flex gap-3">
        {REGION_CONFIG.map((r) => (
          <button
            key={r.key}
            onClick={() => setRegion(r.key)}
            className={`flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold transition-all duration-300 ${
              region === r.key
                ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 scale-105"
                : "bg-white/5 border border-white/10 text-white/50 hover:border-white/20 hover:text-white/70"
            }`}
          >
            <span className="text-lg">{r.emoji}</span>
            {r.label}
          </button>
        ))}
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {CATEGORY_CONFIG.map((c) => (
          <button
            key={c.key}
            onClick={() => setCategory(c.key)}
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
              category === c.key
                ? `bg-gradient-to-r ${c.color} text-white shadow-lg scale-105`
                : "bg-white/5 border border-white/10 text-white/40 hover:border-white/20 hover:text-white/60"
            }`}
          >
            <span>{c.emoji}</span>
            {c.label}
          </button>
        ))}
      </div>

      {/* Map Placeholder */}
      <div className="relative overflow-hidden rounded-3xl h-72 bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 border border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,_rgba(6,182,212,0.08),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,_rgba(16,185,129,0.06),transparent_40%)]" />
        {/* Grid lines for map feel */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

        {/* Dynamic pin markers based on current category */}
        {cities.map((city, i) => (
          <div
            key={city.name}
            className="absolute flex flex-col items-center animate-bounce"
            style={{
              top: MAP_PIN_POSITIONS[i]?.top ?? "50%",
              left: MAP_PIN_POSITIONS[i]?.left ?? "50%",
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${2 + i * 0.3}s`,
            }}
          >
            <span className="text-2xl drop-shadow-lg">{"\u{1F4CD}"}</span>
            <span className="mt-1 rounded-full bg-white/10 backdrop-blur-sm px-2 py-0.5 text-[10px] font-bold text-white/80 shadow-sm border border-white/10">
              {city.name.split(",")[0]}
            </span>
          </div>
        ))}

        {/* Category label and count */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${activeCategoryConfig?.color ?? "from-purple-500 to-violet-500"} px-4 py-1.5 text-xs font-bold text-white shadow-lg`}>
            <span>{activeCategoryConfig?.emoji}</span>
            {activeCategoryConfig?.label}
          </span>
          <span className="rounded-full bg-white/10 backdrop-blur-sm px-3 py-1.5 text-xs font-bold text-white/60 border border-white/10">
            {cities.length} cities
          </span>
        </div>

        <div className="absolute inset-0 flex items-end justify-center pb-4">
          <span className="rounded-full bg-white/10 backdrop-blur-sm px-4 py-2 text-xs font-medium text-white/40 shadow-sm border border-white/5">
            {"\u{1F5FA}\uFE0F"} Interactive map coming soon
          </span>
        </div>
      </div>

      {/* City Cards */}
      <div className="space-y-6">
        {cities.map((city, i) => {
          const imageGradient = CITY_GRADIENTS[city.name] || city.gradient;
          return (
            <div
              key={city.name}
              className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 border border-white/5 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
            >
              {/* City image placeholder */}
              <div className={`relative h-[180px] bg-gradient-to-br ${imageGradient} rounded-t-3xl overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-black/30 to-transparent" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.1),transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                {/* Noise texture overlay */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E\")" }} />
                {/* Rank badge */}
                <div className="absolute top-4 left-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-white text-sm font-extrabold border border-white/20 shadow-lg`}>
                    #{i + 1}
                  </div>
                </div>
                {/* City name overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{city.emoji}</span>
                    <h3 className="text-3xl font-extrabold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">{city.name}</h3>
                  </div>
                </div>
                {/* Score ring */}
                <div className="absolute top-4 right-4">
                  <ScoreRing score={city.score} size={72} />
                </div>
              </div>

              {/* Content */}
              <div className="relative p-6 md:p-8">
                <p className="text-sm text-white/60 mb-5 leading-relaxed">{city.reason}</p>

                <div className="flex flex-wrap gap-2 mb-5">
                  <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-400">
                    {"\u{1F4CD}"} {city.neighborhood}
                  </span>
                  <span className={`inline-flex items-center gap-1 rounded-full bg-gradient-to-r ${activeCategoryConfig?.color ?? "from-purple-500 to-violet-500"} px-3 py-1 text-xs font-semibold text-white shadow-sm`}>
                    {activeCategoryConfig?.emoji} {activeCategoryConfig?.label}
                  </span>
                </div>

                <RiskPill risk={city.risk} />
              </div>

              {/* Bottom gradient line */}
              <div className={`h-1 bg-gradient-to-r ${imageGradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
