"use client";

import { useState, useMemo } from "react";

type RegionScope = "usa" | "international" | "world";
type Category = "reinvention" | "love" | "money" | "creativity" | "spirituality" | "community" | "family" | "short_trips";
type Continent = "Europe" | "Asia" | "South America" | "Africa" | "Oceania" | "Middle East";

interface CityInfo {
  name: string;
  state?: string;
  country: string;
  continent?: Continent;
  score: number;
  reason: string;
  risk: string;
  neighborhood: string;
  gradient: string;
  emoji: string;
  category: Category;
}

const US_STATES = [
  "California", "New York", "Texas", "Florida", "Colorado", "Oregon", "Washington",
  "Arizona", "Tennessee", "North Carolina", "Georgia", "Massachusetts", "Illinois",
  "Nevada", "Hawaii", "Virginia", "Utah", "Minnesota", "Michigan", "Pennsylvania",
] as const;

const CONTINENTS: Continent[] = ["Europe", "Asia", "South America", "Africa", "Oceania", "Middle East"];

const CONTINENT_COUNTRIES: Record<Continent, string[]> = {
  Europe: ["France", "Germany", "Spain", "Portugal", "Netherlands", "Italy", "Denmark", "UK", "Switzerland", "Czech Republic", "Iceland", "Sweden"],
  Asia: ["Japan", "South Korea", "Thailand", "Indonesia", "India", "Singapore", "Vietnam", "Taiwan"],
  "South America": ["Argentina", "Brazil", "Colombia", "Chile", "Mexico"],
  Africa: ["South Africa", "Morocco", "Kenya", "Tanzania"],
  Oceania: ["Australia", "New Zealand", "Fiji"],
  "Middle East": ["UAE", "Israel", "Turkey", "Jordan"],
};

const MAX_SELECTED_STATES = 3;
const MAX_SELECTED_COUNTRIES = 3;

const ALL_CITIES: CityInfo[] = [
  // ── REINVENTION ──
  { name: "Austin", state: "Texas", country: "USA", score: 92, reason: "Tech-meets-creativity energy with a 'keep it weird' ethos that rewards reinvention. Strong startup culture means reinventing yourself is the norm, not the exception.", risk: "Rapid growth is pricing out the very culture that made it attractive", neighborhood: "East Austin or South Congress", gradient: "from-amber-400 via-orange-500 to-red-500", emoji: "\u{1F3B8}", category: "reinvention" },
  { name: "Denver", state: "Colorado", country: "USA", score: 89, reason: "Altitude shift meets attitude shift. The outdoor lifestyle and booming economy create ideal conditions for people rewriting their life story.", risk: "Winter isolation can amplify transition anxiety if unprepared", neighborhood: "RiNo or Capitol Hill", gradient: "from-emerald-400 via-teal-500 to-cyan-600", emoji: "\u{1F3D4}\uFE0F", category: "reinvention" },
  { name: "Portland", state: "Oregon", country: "USA", score: 86, reason: "DIY ethos meets maker culture. The low pretension and high collaboration make this ideal for people reinventing themselves.", risk: "Gray winters and growing homelessness crisis", neighborhood: "Alberta Arts District or Division", gradient: "from-green-500 via-emerald-500 to-lime-500", emoji: "\u{1F332}", category: "reinvention" },
  { name: "Phoenix", state: "Arizona", country: "USA", score: 82, reason: "Low cost of living and booming job market create runway for reinvention. The desert landscape mirrors the blank-slate energy of starting fresh.", risk: "Extreme summer heat limits outdoor activity half the year", neighborhood: "Roosevelt Row or Arcadia", gradient: "from-orange-400 via-red-500 to-rose-600", emoji: "\u2600\uFE0F", category: "reinvention" },
  { name: "Atlanta", state: "Georgia", country: "USA", score: 84, reason: "A cultural powerhouse with booming industries in tech, film, and music. The city rewards hustlers and visionaries equally.", risk: "Traffic congestion and urban sprawl test patience", neighborhood: "Old Fourth Ward or West Midtown", gradient: "from-red-400 via-rose-500 to-pink-600", emoji: "\u{1F351}", category: "reinvention" },
  { name: "Lisbon", country: "Portugal", continent: "Europe", score: 88, reason: "Affordable European living with a thriving expat community of people who left their old lives behind. The saudade culture honors transformation through melancholy.", risk: "Language barrier and bureaucratic slowness test patience during transition", neighborhood: "Alfama or Principe Real", gradient: "from-rose-400 via-pink-500 to-fuchsia-600", emoji: "\u{1F1F5}\u{1F1F9}", category: "reinvention" },
  { name: "Medell\u00EDn", country: "Colombia", continent: "South America", score: 85, reason: "A city that reinvented itself from violence to innovation. The energy of transformation is in the air, and the cost of living gives you runway to experiment.", risk: "Safety concerns in certain neighborhoods require local knowledge", neighborhood: "El Poblado or Laureles", gradient: "from-green-400 via-emerald-500 to-teal-600", emoji: "\u{1F1E8}\u{1F1F4}", category: "reinvention" },
  { name: "Taipei", country: "Taiwan", continent: "Asia", score: 83, reason: "Incredible infrastructure, affordable healthcare, and a culture that respects both tradition and innovation. Digital nomad visa makes long-term stays feasible.", risk: "Humidity and language barrier create an adjustment curve", neighborhood: "Da'an or Xinyi District", gradient: "from-red-400 via-rose-500 to-pink-600", emoji: "\u{1F1F9}\u{1F1FC}", category: "reinvention" },
  { name: "Berlin", country: "Germany", continent: "Europe", score: 87, reason: "Low cost by European standards and a counter-cultural spirit that celebrates self-reinvention. The city's own rebirth after reunification infuses the air.", risk: "Bureaucratic German systems and gray winters can dampen momentum", neighborhood: "Kreuzberg or Neuk\u00F6lln", gradient: "from-gray-500 via-slate-600 to-purple-700", emoji: "\u{1F1E9}\u{1F1EA}", category: "reinvention" },
  { name: "Cape Town", country: "South Africa", continent: "Africa", score: 80, reason: "Stunning natural beauty and a post-apartheid culture of transformation make this a city that understands reinvention at its core.", risk: "Safety concerns and load-shedding power cuts require adaptability", neighborhood: "Woodstock or Bo-Kaap", gradient: "from-yellow-400 via-amber-500 to-orange-600", emoji: "\u{1F1FF}\u{1F1E6}", category: "reinvention" },

  // ── LOVE ──
  { name: "San Diego", state: "California", country: "USA", score: 89, reason: "Year-round sunshine, beach sunsets, and a laid-back warmth that makes deep connection feel effortless. The outdoor lifestyle creates natural settings for romance.", risk: "High cost of living especially in coastal neighborhoods", neighborhood: "North Park or La Jolla", gradient: "from-sky-400 via-cyan-500 to-blue-600", emoji: "\u{1F3D6}\uFE0F", category: "love" },
  { name: "Charleston", state: "South Carolina", country: "USA", score: 87, reason: "Southern charm meets coastal beauty. Horse-drawn carriages, candlelit restaurants, and centuries of romantic architecture create an intoxicating backdrop for love.", risk: "Humidity and hurricane season; conservative social norms may not suit everyone", neighborhood: "French Quarter or King Street", gradient: "from-rose-300 via-pink-400 to-rose-500", emoji: "\u{1F339}", category: "love" },
  { name: "Savannah", state: "Georgia", country: "USA", score: 85, reason: "Spanish moss, midnight garden mystique, and a slow pace that encourages lingering conversations. This city was designed for falling in love.", risk: "Extreme summer heat and humidity; small-city dating pool", neighborhood: "Historic District or Forsyth Park area", gradient: "from-emerald-300 via-green-400 to-teal-500", emoji: "\u{1F343}", category: "love" },
  { name: "Asheville", state: "North Carolina", country: "USA", score: 83, reason: "Mountain romance with a bohemian spirit. Farm-to-table dinners, craft breweries, and misty Blue Ridge sunsets set the stage for deep connection.", risk: "Small-city limitations; tourism crowding during peak seasons", neighborhood: "West Asheville or River Arts District", gradient: "from-violet-400 via-purple-500 to-indigo-600", emoji: "\u{1F3D4}\uFE0F", category: "love" },
  { name: "Paris", country: "France", continent: "Europe", score: 95, reason: "City of love with deep romantic culture woven into every cobblestone. The cafe culture encourages lingering conversation, and beauty surrounds you at every turn.", risk: "High cost of living and Parisian social codes can feel exclusionary at first", neighborhood: "Le Marais or Montmartre", gradient: "from-rose-400 via-pink-500 to-purple-600", emoji: "\u{1F1EB}\u{1F1F7}", category: "love" },
  { name: "Buenos Aires", country: "Argentina", continent: "South America", score: 91, reason: "Tango culture means passion is a way of life. The late-night dining, expressive art scene, and warm social culture make deep connection effortless.", risk: "Economic instability and inflation can complicate long-term planning", neighborhood: "Palermo Soho or San Telmo", gradient: "from-sky-400 via-blue-500 to-indigo-600", emoji: "\u{1F1E6}\u{1F1F7}", category: "love" },
  { name: "Lisbon", country: "Portugal", continent: "Europe", score: 88, reason: "The fado music tradition channels heartbreak and longing into beauty. Warm people, stunning architecture, and a pace of life that prioritizes human connection over hustle.", risk: "Language barrier can limit depth of early romantic connections", neighborhood: "Bairro Alto or Chiado", gradient: "from-amber-400 via-orange-500 to-rose-500", emoji: "\u{1F1F5}\u{1F1F9}", category: "love" },
  { name: "Barcelona", country: "Spain", continent: "Europe", score: 86, reason: "Mediterranean warmth in both climate and culture. The beach-to-city lifestyle and social dining culture create endless opportunities for connection.", risk: "Tourist density can make finding authentic community challenging", neighborhood: "Gr\u00E0cia or El Born", gradient: "from-orange-400 via-red-500 to-rose-600", emoji: "\u{1F1EA}\u{1F1F8}", category: "love" },
  { name: "Kyoto", country: "Japan", continent: "Asia", score: 84, reason: "Subtle, intentional beauty in every interaction. The culture of omotenashi (hospitality) and seasonal awareness creates a deeply romantic awareness of fleeting moments.", risk: "Reserved social norms mean romantic connections develop slowly", neighborhood: "Higashiyama or Arashiyama", gradient: "from-pink-400 via-rose-500 to-red-600", emoji: "\u{1F1EF}\u{1F1F5}", category: "love" },
  { name: "Cartagena", country: "Colombia", continent: "South America", score: 82, reason: "Colorful colonial architecture, Caribbean warmth, and a culture that celebrates passion through music, dance, and vibrant street life.", risk: "Tourist-heavy areas can feel transactional; heat is intense year-round", neighborhood: "Old City or Getseman\u00ED", gradient: "from-yellow-400 via-orange-500 to-red-500", emoji: "\u{1F1E8}\u{1F1F4}", category: "love" },

  // ── MONEY ──
  { name: "San Francisco", state: "California", country: "USA", score: 94, reason: "The global epicenter of venture capital and tech innovation. Proximity to Sand Hill Road and a culture that celebrates ambitious thinking means your ideas have the highest ceiling here.", risk: "Extreme cost of living can drain savings before momentum builds", neighborhood: "SoMa or Mission District", gradient: "from-slate-400 via-blue-500 to-amber-500", emoji: "\u{1F309}", category: "money" },
  { name: "Austin", state: "Texas", country: "USA", score: 88, reason: "No state income tax, exploding tech scene, and a fraction of Silicon Valley's cost. Tesla, Oracle, and countless startups chose here for a reason.", risk: "Infrastructure struggling to keep pace with explosive growth", neighborhood: "Downtown or The Domain", gradient: "from-orange-400 via-amber-500 to-yellow-600", emoji: "\u{1F3B8}", category: "money" },
  { name: "New York City", state: "New York", country: "USA", score: 91, reason: "The financial capital of the world. Wall Street, media empires, and a density of ambition that creates opportunities at every corner.", risk: "Crushing cost of living and relentless pace can burn out even the driven", neighborhood: "Midtown or FiDi", gradient: "from-slate-500 via-gray-600 to-zinc-700", emoji: "\u{1F5FD}", category: "money" },
  { name: "Miami", state: "Florida", country: "USA", score: 86, reason: "No state income tax, booming crypto and fintech scene, and a gateway to Latin American markets. The lifestyle attracts high-net-worth individuals.", risk: "Hurricane risk and extreme humidity; income inequality is stark", neighborhood: "Brickell or Wynwood", gradient: "from-cyan-400 via-teal-500 to-emerald-500", emoji: "\u{1F334}", category: "money" },
  { name: "Seattle", state: "Washington", country: "USA", score: 85, reason: "No state income tax, headquarters of Amazon and Microsoft, and a tech talent pool that rivals the Bay Area at lower costs.", risk: "Gray skies most of the year; cost of living climbing rapidly", neighborhood: "Capitol Hill or South Lake Union", gradient: "from-emerald-500 via-teal-600 to-cyan-700", emoji: "\u2615", category: "money" },
  { name: "Singapore", country: "Singapore", continent: "Asia", score: 92, reason: "Asia's financial powerhouse with zero capital gains tax, world-class infrastructure, and a government that actively courts entrepreneurs and investors.", risk: "High cost of living and social rigidity can feel constraining", neighborhood: "Tanjong Pagar or Tiong Bahru", gradient: "from-red-500 via-white to-red-600", emoji: "\u{1F1F8}\u{1F1EC}", category: "money" },
  { name: "Dubai", country: "UAE", continent: "Middle East", score: 90, reason: "Zero income tax, booming real estate, and a global crossroads where East meets West for business. The city rewards ambition with few bureaucratic barriers.", risk: "Extreme heat limits outdoor lifestyle half the year; social norms differ significantly", neighborhood: "DIFC or Dubai Marina", gradient: "from-amber-400 via-yellow-500 to-orange-600", emoji: "\u{1F1E6}\u{1F1EA}", category: "money" },
  { name: "Zurich", country: "Switzerland", continent: "Europe", score: 85, reason: "Global banking capital with extraordinary stability, rule of law, and access to European markets. High salaries offset high costs, and quality of life is unmatched.", risk: "Very high cost of living and conservative business culture can slow maverick approaches", neighborhood: "Kreis 1 or Seefeld", gradient: "from-gray-400 via-slate-500 to-blue-600", emoji: "\u{1F1E8}\u{1F1ED}", category: "money" },
  { name: "London", country: "UK", continent: "Europe", score: 87, reason: "Europe's largest financial hub with unmatched access to global capital markets, fintech innovation, and a deep talent pool.", risk: "Extremely high cost of living; post-Brexit complications for some business operations", neighborhood: "City of London or Canary Wharf", gradient: "from-gray-500 via-slate-600 to-indigo-700", emoji: "\u{1F1EC}\u{1F1E7}", category: "money" },
  { name: "S\u00E3o Paulo", country: "Brazil", continent: "South America", score: 81, reason: "Latin America's financial engine with massive consumer markets and growing startup ecosystem. The hustle energy here rivals New York.", risk: "Security concerns, traffic congestion, and bureaucratic complexity", neighborhood: "Faria Lima or Vila Madalena", gradient: "from-green-400 via-yellow-500 to-green-600", emoji: "\u{1F1E7}\u{1F1F7}", category: "money" },

  // ── CREATIVITY ──
  { name: "Berlin", country: "Germany", continent: "Europe", score: 93, reason: "The world's creative capital where cheap rent, abandoned warehouses, and a counter-cultural spirit fuel artistic risk-taking. The city doesn't just tolerate weirdness \u2014 it demands it.", risk: "Bureaucratic German systems and gray winters can dampen momentum", neighborhood: "Kreuzberg or Neuk\u00F6lln", gradient: "from-gray-500 via-slate-600 to-purple-700", emoji: "\u{1F1E9}\u{1F1EA}", category: "creativity" },
  { name: "Brooklyn", state: "New York", country: "USA", score: 91, reason: "The beating heart of American creative culture. Every block has a gallery, studio, or performance space. The density of creative talent creates an electric feedback loop.", risk: "Gentrification has pushed costs to unsustainable levels for many artists", neighborhood: "Bushwick or Williamsburg", gradient: "from-orange-400 via-red-500 to-purple-600", emoji: "\u{1F5FD}", category: "creativity" },
  { name: "Portland", state: "Oregon", country: "USA", score: 86, reason: "DIY ethos meets maker culture. The low pretension and high collaboration make this ideal for creatives who want community over competition.", risk: "Gray winters (8+ months of overcast) and growing homelessness crisis", neighborhood: "Alberta Arts District or Division", gradient: "from-green-500 via-emerald-500 to-lime-500", emoji: "\u{1F332}", category: "creativity" },
  { name: "Los Angeles", state: "California", country: "USA", score: 88, reason: "The entertainment capital of the world. Film, music, fashion, and digital media all converge here with unmatched industry infrastructure.", risk: "Brutal traffic, extreme cost of living, and competitive culture can be isolating", neighborhood: "Silver Lake or Arts District", gradient: "from-orange-400 via-pink-500 to-purple-600", emoji: "\u{1F3AC}", category: "creativity" },
  { name: "Nashville", state: "Tennessee", country: "USA", score: 84, reason: "Music City isn't just country anymore \u2014 it's a creative melting pot with affordable studios, a collaborative spirit, and a city that genuinely values artists.", risk: "Rapid gentrification is pushing creative communities to the edges", neighborhood: "East Nashville or The Gulch", gradient: "from-amber-400 via-yellow-500 to-orange-500", emoji: "\u{1F3B6}", category: "creativity" },
  { name: "Melbourne", country: "Australia", continent: "Oceania", score: 88, reason: "Laneway culture, world-class street art, and a coffee obsession that fuels creative energy. The arts funding ecosystem is among the best in the Southern Hemisphere.", risk: "Geographic isolation from major markets can limit career reach", neighborhood: "Fitzroy or Collingwood", gradient: "from-blue-400 via-indigo-500 to-violet-600", emoji: "\u{1F1E6}\u{1F1FA}", category: "creativity" },
  { name: "Florence", country: "Italy", continent: "Europe", score: 84, reason: "The birthplace of the Renaissance still pulses with artistic energy. Walking past Brunelleschi's dome daily rewires your creative ambition at a cellular level.", risk: "Tourist saturation and limited contemporary art market", neighborhood: "Oltrarno or Santo Spirito", gradient: "from-amber-400 via-orange-500 to-red-600", emoji: "\u{1F1EE}\u{1F1F9}", category: "creativity" },
  { name: "Tokyo", country: "Japan", continent: "Asia", score: 86, reason: "A city where ancient craft traditions meet cutting-edge digital art. The attention to aesthetic detail in every aspect of life is unparalleled creative education.", risk: "High cost and language barrier; conformity culture can feel restrictive", neighborhood: "Shimokitazawa or Yanaka", gradient: "from-cyan-400 via-pink-500 to-fuchsia-600", emoji: "\u{1F1EF}\u{1F1F5}", category: "creativity" },
  { name: "Mexico City", country: "Mexico", continent: "South America", score: 85, reason: "Vibrant muralism tradition, world-class museums, and a booming contemporary art scene at a fraction of New York or London prices.", risk: "Air quality issues and safety concerns in certain areas", neighborhood: "Roma Norte or Coyoac\u00E1n", gradient: "from-green-400 via-emerald-500 to-teal-600", emoji: "\u{1F1F2}\u{1F1FD}", category: "creativity" },
  { name: "Marrakech", country: "Morocco", continent: "Africa", score: 79, reason: "A feast for the senses that rewires creative perception. The interplay of color, pattern, and light in the medina is an endless source of inspiration.", risk: "Culture shock and aggressive vendor culture can be overwhelming", neighborhood: "Medina or Gueliz", gradient: "from-orange-400 via-red-500 to-rose-600", emoji: "\u{1F1F2}\u{1F1E6}", category: "creativity" },

  // ── SPIRITUALITY ──
  { name: "Sedona", state: "Arizona", country: "USA", score: 95, reason: "Vortex energy sites, red rock cathedrals, and a community built around spiritual practice. The landscape itself feels like a portal to something deeper.", risk: "Small-town isolation and New Age commercialization can feel inauthentic", neighborhood: "West Sedona or Village of Oak Creek", gradient: "from-red-500 via-orange-600 to-amber-700", emoji: "\u{1F3DC}\uFE0F", category: "spirituality" },
  { name: "Kailua-Kona", state: "Hawaii", country: "USA", score: 88, reason: "Ancient Hawaiian spiritual traditions, volcanic energy, and Pacific island serenity create a powerful container for inner exploration.", risk: "Extreme isolation and high cost of living; respect for native culture is essential", neighborhood: "Holualoa or Kealakekua", gradient: "from-blue-400 via-teal-500 to-emerald-500", emoji: "\u{1F30A}", category: "spirituality" },
  { name: "Taos", state: "New Mexico", country: "USA", score: 86, reason: "Pueblo spiritual traditions, vast desert skies, and a long history of artists seeking spiritual awakening in the high desert light.", risk: "Remote location and harsh winters; limited amenities", neighborhood: "Taos Pueblo area or Arroyo Seco", gradient: "from-amber-400 via-orange-500 to-red-600", emoji: "\u{1F3DC}\uFE0F", category: "spirituality" },
  { name: "Ojai", state: "California", country: "USA", score: 84, reason: "Krishnamurti chose this valley for its spiritual energy. The pink sunsets, meditation retreats, and health-conscious community create a grounded spiritual haven.", risk: "Small-town limitations and wildfire risk", neighborhood: "Downtown Ojai or East End", gradient: "from-pink-300 via-rose-400 to-orange-500", emoji: "\u{1F338}", category: "spirituality" },
  { name: "Bali", country: "Indonesia", continent: "Asia", score: 93, reason: "Daily temple offerings, rice terrace meditation, and a Hindu-animist culture that weaves spirituality into every moment. The cost of living lets you focus inward, not on survival.", risk: "Tourist overload in popular areas dilutes the spiritual atmosphere", neighborhood: "Ubud or Sidemen", gradient: "from-green-400 via-emerald-500 to-teal-600", emoji: "\u{1F1EE}\u{1F1E9}", category: "spirituality" },
  { name: "Rishikesh", country: "India", continent: "Asia", score: 90, reason: "The yoga capital of the world where the Ganges meets the Himalayas. Ashrams, meditation centers, and a 5000-year tradition of seeking enlightenment right here.", risk: "Infrastructure challenges, pollution, and culture shock for Western visitors", neighborhood: "Tapovan or Laxman Jhula area", gradient: "from-orange-400 via-amber-500 to-yellow-600", emoji: "\u{1F1EE}\u{1F1F3}", category: "spirituality" },
  { name: "Kyoto", country: "Japan", continent: "Asia", score: 85, reason: "Zen Buddhism permeates daily life through tea ceremonies, rock gardens, and forest bathing. The city teaches presence through aesthetics and seasonal awareness.", risk: "Spiritual practices are deeply culturally embedded and may feel inaccessible to outsiders", neighborhood: "Arashiyama or Northern Higashiyama", gradient: "from-pink-400 via-rose-500 to-red-600", emoji: "\u{1F1EF}\u{1F1F5}", category: "spirituality" },
  { name: "Tulum", country: "Mexico", continent: "South America", score: 87, reason: "Ancient Mayan energy meets modern wellness culture. Cenote ceremonies, cacao rituals, and Caribbean sunrises create a potent container for spiritual growth.", risk: "Rapid commercialization is eroding the authentic spiritual community", neighborhood: "Tulum Pueblo or Beach Zone South", gradient: "from-cyan-400 via-teal-500 to-emerald-600", emoji: "\u{1F1F2}\u{1F1FD}", category: "spirituality" },
  { name: "Fez", country: "Morocco", continent: "Africa", score: 81, reason: "Ancient Sufi mysticism, the world's oldest university, and a medina that transports you to another century. Deep spiritual traditions permeate daily life.", risk: "Navigating the medina is disorienting; culture shock for Western visitors", neighborhood: "Fes el Bali or Andalusian Quarter", gradient: "from-amber-400 via-orange-500 to-red-600", emoji: "\u{1F1F2}\u{1F1E6}", category: "spirituality" },
  { name: "Petra region", country: "Jordan", continent: "Middle East", score: 78, reason: "Ancient Nabataean sacred sites and the vast Wadi Rum desert create an awe-inspiring landscape for spiritual contemplation.", risk: "Remote, arid conditions; limited infrastructure outside tourist areas", neighborhood: "Wadi Musa or Dana Nature Reserve", gradient: "from-red-400 via-orange-500 to-amber-600", emoji: "\u{1F1EF}\u{1F1F4}", category: "spirituality" },

  // ── COMMUNITY ──
  { name: "Copenhagen", country: "Denmark", continent: "Europe", score: 94, reason: "The world's happiest city, designed around community. Cohousing, cycling culture, and hygge philosophy create effortless human connection at every scale.", risk: "Extremely high cost of living and difficult-to-penetrate social circles for newcomers", neighborhood: "N\u00F8rrebro or Vesterbro", gradient: "from-red-400 via-white to-red-500", emoji: "\u{1F1E9}\u{1F1F0}", category: "community" },
  { name: "Amsterdam", country: "Netherlands", continent: "Europe", score: 89, reason: "Bicycle culture, brown cafes, and a Dutch directness that shortens the path to real friendship. The city is built at human scale, making bumping into people inevitable.", risk: "Housing shortage is acute; securing an apartment can take months", neighborhood: "De Pijp or Jordaan", gradient: "from-orange-400 via-amber-500 to-yellow-500", emoji: "\u{1F1F3}\u{1F1F1}", category: "community" },
  { name: "Portland", state: "Oregon", country: "USA", score: 87, reason: "Neighborhood identity is everything here. Farmers markets, community gardens, and a buy-local ethos create the small-town feeling inside a city.", risk: "Political polarization and homelessness crisis have strained community fabric", neighborhood: "Hawthorne or Sellwood", gradient: "from-green-400 via-emerald-500 to-lime-500", emoji: "\u{1F332}", category: "community" },
  { name: "Minneapolis", state: "Minnesota", country: "USA", score: 85, reason: "Midwestern warmth meets progressive values. The park system, co-op culture, and strong arts scene create vibrant, welcoming neighborhoods.", risk: "Brutal winters and recent social tensions have tested community resilience", neighborhood: "Uptown or Northeast", gradient: "from-blue-400 via-indigo-500 to-violet-600", emoji: "\u2744\uFE0F", category: "community" },
  { name: "Boise", state: "Idaho", country: "USA", score: 83, reason: "A small city with big community energy. The Boise River greenbelt, farmers markets, and genuine neighborliness create instant belonging.", risk: "Rapid growth is straining the small-town charm; political tensions emerging", neighborhood: "North End or Boise Bench", gradient: "from-emerald-400 via-green-500 to-teal-600", emoji: "\u{1F3D4}\uFE0F", category: "community" },
  { name: "Ann Arbor", state: "Michigan", country: "USA", score: 82, reason: "University town energy with a permanent community that values intellectual curiosity, arts, and progressive values. Tree-lined streets and walkable neighborhoods.", risk: "High cost of living for a small city; cold winters", neighborhood: "Kerrytown or Burns Park", gradient: "from-amber-400 via-yellow-500 to-orange-500", emoji: "\u{1F333}", category: "community" },
  { name: "Vancouver", country: "Canada", continent: "Oceania", score: 91, reason: "Multicultural mosaic with nature at your doorstep. Strong neighborhood identities, public spaces designed for gathering, and a culture that values inclusivity.", risk: "Housing crisis makes affordability a serious barrier to putting down roots", neighborhood: "Commercial Drive or Kitsilano", gradient: "from-emerald-400 via-teal-500 to-cyan-600", emoji: "\u{1F1E8}\u{1F1E6}", category: "community" },
  { name: "Wellington", country: "New Zealand", continent: "Oceania", score: 84, reason: "A capital city that feels like a village. Creative, politically engaged, and small enough that you become a regular everywhere within weeks.", risk: "Geographic isolation and earthquake risk; small market limits career options", neighborhood: "Cuba Street or Aro Valley", gradient: "from-blue-400 via-indigo-500 to-violet-600", emoji: "\u{1F1F3}\u{1F1FF}", category: "community" },
  { name: "Chiang Mai", country: "Thailand", continent: "Asia", score: 83, reason: "The digital nomad community hub with warm Thai hospitality. Co-working spaces, temple culture, and incredibly low costs create easy community building.", risk: "Visa limitations and air quality issues during burning season", neighborhood: "Nimman or Old City", gradient: "from-amber-400 via-orange-500 to-red-500", emoji: "\u{1F1F9}\u{1F1ED}", category: "community" },
  { name: "Nairobi", country: "Kenya", continent: "Africa", score: 79, reason: "A rapidly growing tech hub with vibrant community energy. The spirit of harambee (pulling together) creates strong social bonds across communities.", risk: "Traffic, security concerns, and infrastructure challenges", neighborhood: "Westlands or Karen", gradient: "from-green-400 via-emerald-500 to-teal-600", emoji: "\u{1F1F0}\u{1F1EA}", category: "community" },

  // ── FAMILY ──
  { name: "San Diego", state: "California", country: "USA", score: 93, reason: "Year-round sunshine, world-class beaches, excellent schools, and a laid-back pace that lets families actually enjoy each other. The zoo, Legoland, and nature are always minutes away.", risk: "High cost of living especially in top school districts", neighborhood: "North Park or La Jolla", gradient: "from-sky-400 via-cyan-500 to-blue-600", emoji: "\u{1F3D6}\uFE0F", category: "family" },
  { name: "Nashville", state: "Tennessee", country: "USA", score: 90, reason: "Booming economy, no state income tax, strong community values, and a culture of hospitality that makes raising a family feel supported by an entire city.", risk: "Rapid growth straining infrastructure; summer heat is intense", neighborhood: "12 South or East Nashville", gradient: "from-amber-400 via-yellow-500 to-orange-500", emoji: "\u{1F3B6}", category: "family" },
  { name: "Raleigh", state: "North Carolina", country: "USA", score: 84, reason: "Research Triangle brings world-class education and career opportunities. Affordable homes with yards, mild climate, and a strong sense of Southern neighborliness.", risk: "Suburban sprawl requires car dependency; less walkable than coastal cities", neighborhood: "Cameron Village or North Hills", gradient: "from-green-400 via-emerald-500 to-teal-500", emoji: "\u{1F333}", category: "family" },
  { name: "Scottsdale", state: "Arizona", country: "USA", score: 82, reason: "Excellent public schools, safe neighborhoods, and 300+ days of sunshine. The outdoor lifestyle keeps families active and connected year-round.", risk: "Extreme summer heat; suburban car-dependent culture", neighborhood: "Old Town or North Scottsdale", gradient: "from-orange-300 via-amber-400 to-yellow-500", emoji: "\u{1F335}", category: "family" },
  { name: "Richmond", state: "Virginia", country: "USA", score: 81, reason: "Historic charm with modern amenities. Great schools, affordable neighborhoods, and a river-centric lifestyle that gives families room to breathe.", risk: "Humidity in summer; some neighborhoods lag in walkability", neighborhood: "The Fan or Carytown", gradient: "from-red-300 via-rose-400 to-pink-500", emoji: "\u{1F3DB}\uFE0F", category: "family" },
  { name: "Zurich", country: "Switzerland", continent: "Europe", score: 88, reason: "Among the safest cities on Earth with pristine nature, exceptional public schools, and a culture that prioritizes work-life balance. The lake and Alps are your family's backyard.", risk: "Extremely high cost of living; Swiss social integration takes years", neighborhood: "Enge or Wollishofen", gradient: "from-gray-400 via-slate-500 to-blue-600", emoji: "\u{1F1E8}\u{1F1ED}", category: "family" },
  { name: "Auckland", country: "New Zealand", continent: "Oceania", score: 86, reason: "Adventure lifestyle with exceptional safety. Beaches, rainforests, and volcanoes are all within 30 minutes. The school system emphasizes outdoor learning and creativity.", risk: "Geographic isolation from extended family; housing costs have surged", neighborhood: "Devonport or Ponsonby", gradient: "from-emerald-400 via-teal-500 to-cyan-600", emoji: "\u{1F1F3}\u{1F1FF}", category: "family" },
  { name: "Stockholm", country: "Sweden", continent: "Europe", score: 85, reason: "Generous parental leave, free healthcare, and a culture built around lagom (just the right amount). Safe, clean, and designed for families at every level.", risk: "Dark winters and high cost of living; social integration can be slow", neighborhood: "S\u00F6dermalm or Kungsholmen", gradient: "from-blue-300 via-indigo-400 to-violet-500", emoji: "\u{1F1F8}\u{1F1EA}", category: "family" },
  { name: "Lisbon", country: "Portugal", continent: "Europe", score: 83, reason: "Affordable European living with great weather, safe streets, and a family-oriented culture where children are welcomed everywhere, always.", risk: "Portuguese schooling system can be challenging for non-native speakers", neighborhood: "Parque das Na\u00E7\u00F5es or Cascais", gradient: "from-amber-400 via-orange-500 to-rose-500", emoji: "\u{1F1F5}\u{1F1F9}", category: "family" },
  { name: "Tokyo", country: "Japan", continent: "Asia", score: 82, reason: "Extraordinarily safe, world-class healthcare, and a culture that deeply values education. Public transit means kids gain independence early.", risk: "Intense academic pressure; language barrier is significant for families", neighborhood: "Setagaya or Kichijoji", gradient: "from-cyan-400 via-pink-500 to-fuchsia-600", emoji: "\u{1F1EF}\u{1F1F5}", category: "family" },

  // ── SHORT TRIPS ──
  { name: "Tokyo", country: "Japan", continent: "Asia", score: 96, reason: "Maximum sensory density per square mile on Earth. From Shibuya crossing to hidden ramen counters to robot restaurants, every hour delivers a new unforgettable moment.", risk: "Overwhelming stimulation and language barrier can cause decision fatigue", neighborhood: "Shimokitazawa or Yanaka", gradient: "from-cyan-400 via-pink-500 to-fuchsia-600", emoji: "\u{1F1EF}\u{1F1F5}", category: "short_trips" },
  { name: "Reykjavik", country: "Iceland", continent: "Europe", score: 93, reason: "Otherworldly landscapes packed into a small island. Northern lights, geysers, black sand beaches, and glacier hikes deliver a lifetime of memories in one week.", risk: "Extreme weather can disrupt plans; very expensive for food and lodging", neighborhood: "Reykjavik 101 or Golden Circle route", gradient: "from-blue-400 via-indigo-500 to-slate-600", emoji: "\u{1F1EE}\u{1F1F8}", category: "short_trips" },
  { name: "Marrakech", country: "Morocco", continent: "Africa", score: 90, reason: "Sensory overload in the best way: spice markets, mosaic palaces, rooftop terraces with Atlas Mountain views. A week here rewires your relationship with beauty and chaos.", risk: "Aggressive vendor culture and navigating medina can be stressful for first-timers", neighborhood: "Medina or Gueliz", gradient: "from-orange-400 via-red-500 to-rose-600", emoji: "\u{1F1F2}\u{1F1E6}", category: "short_trips" },
  { name: "Prague", country: "Czech Republic", continent: "Europe", score: 88, reason: "Gothic fairy-tale architecture, incredible beer culture, and one of Europe's best value-for-money destinations. Walkable, photogenic, and endlessly charming.", risk: "Tourist traps in Old Town can erode authenticity of experience", neighborhood: "Vinohrady or \u017Di\u017Ekov", gradient: "from-amber-400 via-orange-500 to-red-600", emoji: "\u{1F1E8}\u{1F1FF}", category: "short_trips" },
  { name: "Cape Town", country: "South Africa", continent: "Africa", score: 85, reason: "Table Mountain, penguin beaches, world-class wine country, and dramatic coastlines. The natural beauty per dollar spent is perhaps the highest on Earth.", risk: "Safety concerns require awareness; load-shedding power cuts can disrupt plans", neighborhood: "Bo-Kaap or Camps Bay", gradient: "from-yellow-400 via-amber-500 to-orange-600", emoji: "\u{1F1FF}\u{1F1E6}", category: "short_trips" },
  { name: "New Orleans", state: "Louisiana", country: "USA", score: 91, reason: "Jazz, beignets, and the best food city in America. The cultural density per block is unmatched, and the city's spirit is infectious from the first hour.", risk: "Heat, humidity, and some neighborhoods require awareness after dark", neighborhood: "French Quarter or Marigny", gradient: "from-purple-400 via-fuchsia-500 to-pink-600", emoji: "\u{1F3BA}", category: "short_trips" },
  { name: "Savannah", state: "Georgia", country: "USA", score: 85, reason: "Spanish moss, haunted history, and a walkable historic district that feels like stepping into a novel. Perfect for a long weekend of beauty and Southern charm.", risk: "Summer heat is brutal; limited diversity of activities beyond the historic core", neighborhood: "Historic District or Tybee Island", gradient: "from-emerald-300 via-green-400 to-teal-500", emoji: "\u{1F343}", category: "short_trips" },
  { name: "Banff", country: "Canada", continent: "Oceania", score: 87, reason: "Jaw-dropping Rocky Mountain scenery with turquoise lakes and world-class hiking. Nature delivers the kind of awe that resets your perspective in days.", risk: "Seasonal extremes; summer crowds can diminish the wilderness experience", neighborhood: "Banff townsite or Lake Louise", gradient: "from-cyan-400 via-blue-500 to-indigo-600", emoji: "\u{1F1E8}\u{1F1E6}", category: "short_trips" },
  { name: "Seoul", country: "South Korea", continent: "Asia", score: 86, reason: "K-culture, street food paradise, ancient palaces next to neon-lit nightlife. The juxtaposition of old and new creates a uniquely thrilling travel experience.", risk: "Language barrier and fast pace can be disorienting for first-timers", neighborhood: "Hongdae or Bukchon", gradient: "from-blue-400 via-purple-500 to-pink-600", emoji: "\u{1F1F0}\u{1F1F7}", category: "short_trips" },
  { name: "Zanzibar", country: "Tanzania", continent: "Africa", score: 82, reason: "Spice islands with turquoise waters, Stone Town history, and a pace of life that immediately dissolves stress. Pure tropical escapism with cultural depth.", risk: "Infrastructure is basic; malaria precautions needed", neighborhood: "Stone Town or Nungwi", gradient: "from-teal-400 via-cyan-500 to-blue-600", emoji: "\u{1F1F9}\u{1F1FF}", category: "short_trips" },
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
  { top: "45%", left: "15%" },
  { top: "25%", left: "55%" },
  { top: "60%", left: "65%" },
  { top: "15%", left: "40%" },
  { top: "50%", left: "85%" },
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
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedContinent, setSelectedContinent] = useState<Continent | null>(null);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

  const activeCategoryConfig = CATEGORY_CONFIG.find((c) => c.key === category);

  const toggleState = (state: string) => {
    setSelectedStates((prev) => {
      if (prev.includes(state)) return prev.filter((s) => s !== state);
      if (prev.length >= MAX_SELECTED_STATES) return prev;
      return [...prev, state];
    });
  };

  const toggleCountry = (country: string) => {
    setSelectedCountries((prev) => {
      if (prev.includes(country)) return prev.filter((c) => c !== country);
      if (prev.length >= MAX_SELECTED_COUNTRIES) return prev;
      return [...prev, country];
    });
  };

  const handleContinentSelect = (continent: Continent) => {
    if (selectedContinent === continent) {
      setSelectedContinent(null);
      setSelectedCountries([]);
    } else {
      setSelectedContinent(continent);
      setSelectedCountries([]);
    }
  };

  const filteredCities = useMemo(() => {
    let cities = ALL_CITIES.filter((c) => c.category === category);

    if (region === "usa") {
      cities = cities.filter((c) => c.country === "USA");
      if (selectedStates.length > 0) {
        cities = cities.filter((c) => c.state && selectedStates.includes(c.state));
      }
    } else if (region === "international") {
      cities = cities.filter((c) => c.country !== "USA");
      if (selectedContinent) {
        cities = cities.filter((c) => c.continent === selectedContinent);
        if (selectedCountries.length > 0) {
          cities = cities.filter((c) => selectedCountries.includes(c.country));
        }
      }
    }
    // "world" shows all

    return cities;
  }, [category, region, selectedStates, selectedContinent, selectedCountries]);

  const regionLabel = region === "usa" ? "United States" : region === "international" ? "International" : "Worldwide";

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

      {/* Region Scope — Tier 1 */}
      <div className="flex gap-3">
        {([
          { key: "usa" as RegionScope, label: "United States", emoji: "\u{1F1FA}\u{1F1F8}" },
          { key: "international" as RegionScope, label: "International", emoji: "\u{1F30D}" },
          { key: "world" as RegionScope, label: "Worldwide", emoji: "\u{1F30E}" },
        ]).map((r) => (
          <button
            key={r.key}
            onClick={() => {
              setRegion(r.key);
              setSelectedStates([]);
              setSelectedContinent(null);
              setSelectedCountries([]);
            }}
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

      {/* Tier 2 — State Filter (when USA selected) */}
      {region === "usa" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40">Filter by State</p>
            {selectedStates.length > 0 && (
              <span className="text-xs font-medium text-cyan-400">
                {selectedStates.length} of {MAX_SELECTED_STATES} states selected
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto pr-2 scrollbar-thin">
            <button
              onClick={() => setSelectedStates([])}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                selectedStates.length === 0
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg"
                  : "bg-white/5 border border-white/10 text-white/50 hover:border-white/20 hover:text-white/70"
              }`}
            >
              All States
            </button>
            {US_STATES.map((state) => {
              const isSelected = selectedStates.includes(state);
              const isDisabled = !isSelected && selectedStates.length >= MAX_SELECTED_STATES;
              return (
                <button
                  key={state}
                  onClick={() => toggleState(state)}
                  disabled={isDisabled}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                    isSelected
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg scale-105"
                      : isDisabled
                      ? "bg-white/5 border border-white/5 text-white/20 cursor-not-allowed"
                      : "bg-white/5 border border-white/10 text-white/50 hover:border-white/20 hover:text-white/70"
                  }`}
                >
                  {state}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Tier 2 & 3 — Continent / Country Filter (when International selected) */}
      {region === "international" && (
        <div className="space-y-4">
          {/* Continent pills */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40">Filter by Region</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => { setSelectedContinent(null); setSelectedCountries([]); }}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                  !selectedContinent
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg"
                    : "bg-white/5 border border-white/10 text-white/50 hover:border-white/20 hover:text-white/70"
                }`}
              >
                All Countries
              </button>
              {CONTINENTS.map((continent) => (
                <button
                  key={continent}
                  onClick={() => handleContinentSelect(continent)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                    selectedContinent === continent
                      ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg scale-105"
                      : "bg-white/5 border border-white/10 text-white/50 hover:border-white/20 hover:text-white/70"
                  }`}
                >
                  {continent}
                </button>
              ))}
            </div>
          </div>

          {/* Country pills (when continent is selected) */}
          {selectedContinent && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
                  Countries in {selectedContinent}
                </p>
                {selectedCountries.length > 0 && (
                  <span className="text-xs font-medium text-cyan-400">
                    {selectedCountries.length} of {MAX_SELECTED_COUNTRIES} countries selected
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCountries([])}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                    selectedCountries.length === 0
                      ? "bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white shadow-lg"
                      : "bg-white/5 border border-white/10 text-white/50 hover:border-white/20 hover:text-white/70"
                  }`}
                >
                  All in {selectedContinent}
                </button>
                {CONTINENT_COUNTRIES[selectedContinent].map((country) => {
                  const isSelected = selectedCountries.includes(country);
                  const isDisabled = !isSelected && selectedCountries.length >= MAX_SELECTED_COUNTRIES;
                  return (
                    <button
                      key={country}
                      onClick={() => toggleCountry(country)}
                      disabled={isDisabled}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                        isSelected
                          ? "bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white shadow-lg scale-105"
                          : isDisabled
                          ? "bg-white/5 border border-white/5 text-white/20 cursor-not-allowed"
                          : "bg-white/5 border border-white/10 text-white/50 hover:border-white/20 hover:text-white/70"
                      }`}
                    >
                      {country}
                    </button>
                  );
                })}
              </div>
              {/* Showing breadcrumb */}
              {selectedCountries.length > 0 && (
                <p className="text-xs text-white/40">
                  Showing: <span className="text-cyan-400 font-medium">{selectedContinent}</span>
                  {" \u2192 "}
                  <span className="text-white/70 font-medium">{selectedCountries.join(", ")}</span>
                </p>
              )}
            </div>
          )}
        </div>
      )}

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

        {/* Dynamic pin markers based on filtered cities */}
        {filteredCities.slice(0, MAP_PIN_POSITIONS.length).map((city, i) => (
          <div
            key={`${city.name}-${city.category}-${i}`}
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
              {city.name}
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
            {regionLabel} &middot; {filteredCities.length} {filteredCities.length === 1 ? "city" : "cities"}
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
        {filteredCities.length === 0 ? (
          <div className="rounded-3xl bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 border border-white/5 p-12 text-center">
            <span className="text-4xl mb-4 block">{"\u{1F50D}"}</span>
            <h3 className="text-xl font-bold text-white/70 mb-2">No cities match your filters</h3>
            <p className="text-sm text-white/40">Try broadening your selection or switching regions to discover more destinations.</p>
          </div>
        ) : (
          filteredCities.map((city, i) => (
            <div
              key={`${city.name}-${city.category}-${i}`}
              className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 border border-white/5 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
            >
              {/* City image placeholder */}
              <div className={`relative h-[180px] bg-gradient-to-br ${city.gradient} rounded-t-3xl overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-black/30 to-transparent" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.1),transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                {/* Noise texture overlay */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E\")" }} />
                {/* Rank badge */}
                <div className="absolute top-4 left-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-white text-sm font-extrabold border border-white/20 shadow-lg">
                    #{i + 1}
                  </div>
                </div>
                {/* City name overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{city.emoji}</span>
                    <div>
                      <h3 className="text-3xl font-extrabold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                        {city.name}{city.state ? `, ${city.state}` : ""}
                      </h3>
                      {city.country !== "USA" && (
                        <p className="text-sm text-white/60 font-medium">
                          {city.country}{city.continent ? ` \u2022 ${city.continent}` : ""}
                        </p>
                      )}
                    </div>
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
                  {city.state && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 text-xs font-semibold text-cyan-400">
                      {city.state}
                    </span>
                  )}
                  {city.continent && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 border border-purple-500/20 px-3 py-1 text-xs font-semibold text-purple-400">
                      {city.continent}
                    </span>
                  )}
                </div>

                <RiskPill risk={city.risk} />
              </div>

              {/* Bottom gradient line */}
              <div className={`h-1 bg-gradient-to-r ${city.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
