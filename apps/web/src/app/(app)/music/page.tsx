"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { db, type UserProfile } from "@/lib/db";
import { calculateLifePath } from "@destination-future/core";
import { getSunSign } from "@destination-future/core";

type MusicTab = "frequencies" | "playlist" | "expansion" | "recommendations";

const ALL_GENRES = [
  { name: "Hip-Hop", color: "from-red-500 to-orange-500" },
  { name: "R&B", color: "from-purple-500 to-pink-500" },
  { name: "Pop", color: "from-pink-400 to-rose-500" },
  { name: "Rock", color: "from-gray-600 to-gray-800" },
  { name: "Alternative", color: "from-teal-500 to-cyan-500" },
  { name: "Electronic", color: "from-blue-500 to-indigo-600" },
  { name: "Jazz", color: "from-amber-500 to-yellow-600" },
  { name: "Soul", color: "from-orange-400 to-red-500" },
  { name: "Classical", color: "from-slate-400 to-slate-600" },
  { name: "Country", color: "from-yellow-500 to-amber-600" },
  { name: "Latin", color: "from-rose-500 to-red-600" },
  { name: "Ambient", color: "from-indigo-400 to-purple-500" },
  { name: "Indie", color: "from-emerald-400 to-teal-500" },
  { name: "Metal", color: "from-zinc-600 to-zinc-900" },
  { name: "Folk", color: "from-green-500 to-emerald-600" },
  { name: "Reggae", color: "from-green-400 to-yellow-500" },
  { name: "Funk", color: "from-fuchsia-500 to-purple-600" },
  { name: "Blues", color: "from-blue-600 to-blue-800" },
];

const GENRE_ARTISTS: Record<string, { name: string; description: string; vibe: string; topTrack: string }[]> = {
  "Hip-Hop": [
    { name: "Kendrick Lamar", description: "Conscious lyricism with deep storytelling", vibe: "Introspective", topTrack: "HUMBLE." },
    { name: "J. Cole", description: "Raw honesty and relatable narratives", vibe: "Thoughtful", topTrack: "No Role Modelz" },
    { name: "Tyler, the Creator", description: "Genre-bending creative vision", vibe: "Experimental", topTrack: "See You Again" },
    { name: "JID", description: "Technical rap with emotional depth", vibe: "Dynamic", topTrack: "Surround Sound" },
    { name: "Smino", description: "Melodic flow with jazz influences", vibe: "Smooth", topTrack: "Noir" },
  ],
  "R&B": [
    { name: "SZA", description: "Vulnerable storytelling with ethereal vocals", vibe: "Emotional", topTrack: "Kill Bill" },
    { name: "Daniel Caesar", description: "Soulful R&B with gospel undertones", vibe: "Warm", topTrack: "Best Part" },
    { name: "Summer Walker", description: "Raw emotional vulnerability", vibe: "Intimate", topTrack: "Playing Games" },
    { name: "Steve Lacy", description: "Indie-R&B with playful production", vibe: "Eclectic", topTrack: "Bad Habit" },
    { name: "Jorja Smith", description: "UK soul with poetic depth", vibe: "Graceful", topTrack: "Blue Lights" },
  ],
  "Pop": [
    { name: "Billie Eilish", description: "Dark pop with intimate production", vibe: "Atmospheric", topTrack: "everything i wanted" },
    { name: "Lorde", description: "Introspective pop with vivid imagery", vibe: "Cinematic", topTrack: "Green Light" },
    { name: "Tame Impala", description: "Psychedelic pop with lush production", vibe: "Dreamy", topTrack: "The Less I Know the Better" },
    { name: "Maggie Rogers", description: "Nature-inspired indie pop", vibe: "Organic", topTrack: "Light On" },
    { name: "Hozier", description: "Soulful folk-pop with literary lyrics", vibe: "Poetic", topTrack: "Take Me to Church" },
  ],
  "Rock": [
    { name: "Radiohead", description: "Experimental rock pushing boundaries", vibe: "Cerebral", topTrack: "Karma Police" },
    { name: "Arctic Monkeys", description: "Sharp wit with evolving sound", vibe: "Cool", topTrack: "Do I Wanna Know?" },
    { name: "Khruangbin", description: "Global psych-rock with groove", vibe: "Hypnotic", topTrack: "Maria Tambi\u00E9n" },
    { name: "The War on Drugs", description: "Expansive heartland rock", vibe: "Anthemic", topTrack: "Red Eyes" },
    { name: "King Gizzard", description: "Prolific genre-fluid rock", vibe: "Wild", topTrack: "Rattlesnake" },
  ],
  "Alternative": [
    { name: "Bon Iver", description: "Ethereal indie folk evolution", vibe: "Transcendent", topTrack: "Skinny Love" },
    { name: "Phoebe Bridgers", description: "Devastating indie rock balladry", vibe: "Melancholic", topTrack: "Motion Sickness" },
    { name: "Big Thief", description: "Raw Americana with poetic beauty", vibe: "Intimate", topTrack: "Not" },
    { name: "Japanese Breakfast", description: "Joyful indie with emotional depth", vibe: "Hopeful", topTrack: "Be Sweet" },
    { name: "Mitski", description: "Visceral emotional indie rock", vibe: "Intense", topTrack: "Your Best American Girl" },
  ],
  "Electronic": [
    { name: "Bonobo", description: "Organic electronic with world influences", vibe: "Lush", topTrack: "Kerala" },
    { name: "Tycho", description: "Ambient electronic with visual warmth", vibe: "Serene", topTrack: "Awake" },
    { name: "ODESZA", description: "Cinematic electronic anthems", vibe: "Euphoric", topTrack: "A Moment Apart" },
    { name: "Four Tet", description: "Textured minimalist electronic", vibe: "Meditative", topTrack: "Parallel Jalebi" },
    { name: "Jamie xx", description: "UK electronic with emotional weight", vibe: "Atmospheric", topTrack: "Gosh" },
  ],
  "Jazz": [
    { name: "Kamasi Washington", description: "Modern jazz with epic scope", vibe: "Majestic", topTrack: "Fists of Fury" },
    { name: "Robert Glasper", description: "Jazz-hip-hop fusion innovator", vibe: "Smooth", topTrack: "Afro Blue" },
    { name: "Nubya Garcia", description: "UK jazz with Caribbean energy", vibe: "Vibrant", topTrack: "Source" },
    { name: "GoGo Penguin", description: "Cinematic acoustic-electronic jazz", vibe: "Dynamic", topTrack: "Raven" },
    { name: "Shabaka", description: "Spiritual jazz with African roots", vibe: "Transcendent", topTrack: "Black Meditation" },
  ],
  "Soul": [
    { name: "Leon Bridges", description: "Modern vintage soul", vibe: "Warm", topTrack: "Coming Home" },
    { name: "Snoh Aalegra", description: "Swedish-Iranian R&B soul", vibe: "Elegant", topTrack: "I Want You Around" },
    { name: "Sampha", description: "Electronic soul with raw emotion", vibe: "Tender", topTrack: "Blood on Me" },
    { name: "H.E.R.", description: "Multi-instrument R&B talent", vibe: "Versatile", topTrack: "Best Part" },
    { name: "Erykah Badu", description: "Neo-soul queen with cosmic vision", vibe: "Mystical", topTrack: "Tyrone" },
  ],
  "Classical": [
    { name: "Max Richter", description: "Contemporary classical for modern minds", vibe: "Profound", topTrack: "On the Nature of Daylight" },
    { name: "\u00D3lafur Arnalds", description: "Ambient neo-classical from Iceland", vibe: "Ethereal", topTrack: "Near Light" },
    { name: "Ludovico Einaudi", description: "Accessible emotional piano works", vibe: "Moving", topTrack: "Experience" },
    { name: "Nils Frahm", description: "Experimental piano and electronics", vibe: "Intimate", topTrack: "Says" },
    { name: "Joep Beving", description: "Minimalist piano for reflection", vibe: "Peaceful", topTrack: "Prehension" },
  ],
  "Indie": [
    { name: "Alvvays", description: "Dream pop perfection", vibe: "Shimmering", topTrack: "In Undertow" },
    { name: "Beach House", description: "Ethereal dream pop atmosphere", vibe: "Hypnotic", topTrack: "Space Song" },
    { name: "Mac DeMarco", description: "Laid-back jangly indie", vibe: "Chill", topTrack: "Chamber of Reflection" },
    { name: "Clairo", description: "Bedroom pop with breezy charm", vibe: "Gentle", topTrack: "Sofia" },
    { name: "Men I Trust", description: "Dreamy Montreal indie", vibe: "Smooth", topTrack: "Tailwhip" },
  ],
  "Ambient": [
    { name: "Brian Eno", description: "Pioneer of ambient music", vibe: "Meditative", topTrack: "Music for Airports 1/1" },
    { name: "Boards of Canada", description: "Nostalgic electronic soundscapes", vibe: "Wistful", topTrack: "Dayvan Cowboy" },
    { name: "Stars of the Lid", description: "Glacial ambient drone beauty", vibe: "Vast", topTrack: "Requiem for Dying Mothers" },
    { name: "Grouper", description: "Haunting ambient folk", vibe: "Spectral", topTrack: "Clearing" },
    { name: "Helios", description: "Warm ambient textures", vibe: "Gentle", topTrack: "Halving the Compass" },
  ],
  "Folk": [
    { name: "Fleet Foxes", description: "Harmonic baroque folk", vibe: "Majestic", topTrack: "White Winter Hymnal" },
    { name: "Iron & Wine", description: "Intimate whispered folk", vibe: "Tender", topTrack: "Flightless Bird" },
    { name: "Adrianne Lenker", description: "Raw poetic folk beauty", vibe: "Vulnerable", topTrack: "anything" },
    { name: "Vashti Bunyan", description: "Ethereal English folk", vibe: "Dreamy", topTrack: "Diamond Day" },
    { name: "Nick Drake", description: "Timeless melancholic folk", vibe: "Haunting", topTrack: "Pink Moon" },
  ],
  "Country": [
    { name: "Chris Stapleton", description: "Powerhouse country soul", vibe: "Raw", topTrack: "Tennessee Whiskey" },
    { name: "Kacey Musgraves", description: "Progressive country pop", vibe: "Warm", topTrack: "Slow Burn" },
    { name: "Tyler Childers", description: "Appalachian country storytelling", vibe: "Authentic", topTrack: "Feathered Indians" },
    { name: "Orville Peck", description: "Queer country with cinematic flair", vibe: "Dramatic", topTrack: "Dead of Night" },
    { name: "Sturgill Simpson", description: "Outlaw country evolution", vibe: "Bold", topTrack: "Turtles All the Way Down" },
  ],
  "Latin": [
    { name: "Bad Bunny", description: "Genre-defying Latin trap/reggaeton", vibe: "Energetic", topTrack: "Dakiti" },
    { name: "Rosal\u00EDa", description: "Flamenco meets electronic pop", vibe: "Fierce", topTrack: "MALAMENTE" },
    { name: "Natalia Lafourcade", description: "Mexican folk-pop artistry", vibe: "Beautiful", topTrack: "Hasta la Ra\u00EDz" },
    { name: "Jorge Drexler", description: "Uruguayan singer-songwriter", vibe: "Poetic", topTrack: "Telefon\u00EDa" },
    { name: "Mon Laferte", description: "Chilean rock-pop powerhouse", vibe: "Passionate", topTrack: "Tu Falta de Querer" },
  ],
  "Metal": [
    { name: "Gojira", description: "Progressive eco-metal from France", vibe: "Powerful", topTrack: "Silvera" },
    { name: "Deafheaven", description: "Blackgaze beauty meets aggression", vibe: "Transcendent", topTrack: "Dream House" },
    { name: "Mastodon", description: "Progressive sludge metal storytelling", vibe: "Epic", topTrack: "Blood and Thunder" },
    { name: "Leprous", description: "Norwegian progressive metal art", vibe: "Complex", topTrack: "The Price" },
    { name: "Sleep Token", description: "Mysterious genre-fluid metal worship", vibe: "Hypnotic", topTrack: "The Summoning" },
  ],
  "Funk": [
    { name: "Vulfpeck", description: "Minimalist funk with maximum groove", vibe: "Joyful", topTrack: "Dean Town" },
    { name: "Thundercat", description: "Bass-heavy cosmic funk", vibe: "Trippy", topTrack: "Them Changes" },
    { name: "Anderson .Paak", description: "Funk-soul-hip-hop fusion", vibe: "Groovy", topTrack: "Come Down" },
    { name: "Cory Wong", description: "Rhythm guitar funk precision", vibe: "Tight", topTrack: "Golden" },
    { name: "Parcels", description: "Australian disco-funk elegance", vibe: "Smooth", topTrack: "Lightenup" },
  ],
  "Reggae": [
    { name: "Chronixx", description: "Modern roots reggae revival", vibe: "Uplifting", topTrack: "Here Comes Trouble" },
    { name: "Protoje", description: "Progressive Jamaican reggae", vibe: "Conscious", topTrack: "Who Knows" },
    { name: "Stick Figure", description: "California reggae-dub fusion", vibe: "Chill", topTrack: "Weight of Sound" },
    { name: "Koffee", description: "Young Jamaican reggae energy", vibe: "Fresh", topTrack: "Toast" },
    { name: "Rebelution", description: "Positive California reggae rock", vibe: "Sunny", topTrack: "Safe and Sound" },
  ],
  "Blues": [
    { name: "Gary Clark Jr.", description: "Modern blues-rock virtuoso", vibe: "Electric", topTrack: "Bright Lights" },
    { name: "Fantastic Negrito", description: "Black roots music reimagined", vibe: "Raw", topTrack: "An Honest Man" },
    { name: "Joe Bonamassa", description: "Blues guitar mastery", vibe: "Powerful", topTrack: "Mountain Time" },
    { name: "Christone Kingfish Ingram", description: "Young blues prodigy", vibe: "Soulful", topTrack: "Outside of This Town" },
    { name: "Beth Hart", description: "Blues-rock emotional powerhouse", vibe: "Intense", topTrack: "Tell Her You Belong to Me" },
  ],
};

const VIBE_COLORS: Record<string, string> = {
  Introspective: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  Thoughtful: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  Experimental: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  Dynamic: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  Smooth: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  Emotional: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  Warm: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  Intimate: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  Eclectic: "bg-teal-500/20 text-teal-300 border-teal-500/30",
  Graceful: "bg-violet-500/20 text-violet-300 border-violet-500/30",
  Atmospheric: "bg-slate-500/20 text-slate-300 border-slate-500/30",
  Cinematic: "bg-sky-500/20 text-sky-300 border-sky-500/30",
  Dreamy: "bg-indigo-400/20 text-indigo-300 border-indigo-400/30",
  Organic: "bg-green-500/20 text-green-300 border-green-500/30",
  Poetic: "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30",
  Cerebral: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  Cool: "bg-blue-400/20 text-blue-300 border-blue-400/30",
  Hypnotic: "bg-violet-400/20 text-violet-300 border-violet-400/30",
  Anthemic: "bg-red-500/20 text-red-300 border-red-500/30",
  Wild: "bg-lime-500/20 text-lime-300 border-lime-500/30",
  Transcendent: "bg-purple-400/20 text-purple-300 border-purple-400/30",
  Melancholic: "bg-gray-500/20 text-gray-300 border-gray-500/30",
  Hopeful: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  Intense: "bg-red-400/20 text-red-300 border-red-400/30",
  Lush: "bg-emerald-400/20 text-emerald-300 border-emerald-400/30",
  Serene: "bg-sky-400/20 text-sky-300 border-sky-400/30",
  Euphoric: "bg-pink-400/20 text-pink-300 border-pink-400/30",
  Meditative: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  Majestic: "bg-amber-400/20 text-amber-300 border-amber-400/30",
  Vibrant: "bg-orange-400/20 text-orange-300 border-orange-400/30",
  Tender: "bg-rose-400/20 text-rose-300 border-rose-400/30",
  Elegant: "bg-fuchsia-400/20 text-fuchsia-300 border-fuchsia-400/30",
  Versatile: "bg-teal-400/20 text-teal-300 border-teal-400/30",
  Mystical: "bg-violet-500/20 text-violet-300 border-violet-500/30",
  Profound: "bg-indigo-600/20 text-indigo-300 border-indigo-600/30",
  Ethereal: "bg-cyan-400/20 text-cyan-300 border-cyan-400/30",
  Moving: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  Peaceful: "bg-green-400/20 text-green-300 border-green-400/30",
  Shimmering: "bg-sky-500/20 text-sky-300 border-sky-500/30",
  Chill: "bg-teal-500/20 text-teal-300 border-teal-500/30",
  Gentle: "bg-green-300/20 text-green-300 border-green-300/30",
  Wistful: "bg-purple-300/20 text-purple-300 border-purple-300/30",
  Vast: "bg-blue-600/20 text-blue-300 border-blue-600/30",
  Spectral: "bg-gray-400/20 text-gray-300 border-gray-400/30",
  Vulnerable: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  Haunting: "bg-slate-400/20 text-slate-300 border-slate-400/30",
  Raw: "bg-red-600/20 text-red-300 border-red-600/30",
  Authentic: "bg-amber-600/20 text-amber-300 border-amber-600/30",
  Dramatic: "bg-purple-600/20 text-purple-300 border-purple-600/30",
  Bold: "bg-orange-600/20 text-orange-300 border-orange-600/30",
  Energetic: "bg-red-500/20 text-red-300 border-red-500/30",
  Fierce: "bg-rose-600/20 text-rose-300 border-rose-600/30",
  Beautiful: "bg-pink-300/20 text-pink-300 border-pink-300/30",
  Passionate: "bg-red-400/20 text-red-300 border-red-400/30",
  Powerful: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  Epic: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  Complex: "bg-cyan-600/20 text-cyan-300 border-cyan-600/30",
  Joyful: "bg-yellow-400/20 text-yellow-300 border-yellow-400/30",
  Trippy: "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30",
  Groovy: "bg-orange-400/20 text-orange-300 border-orange-400/30",
  Tight: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  Uplifting: "bg-green-500/20 text-green-300 border-green-500/30",
  Conscious: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  Fresh: "bg-lime-400/20 text-lime-300 border-lime-400/30",
  Sunny: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  Electric: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  Soulful: "bg-amber-400/20 text-amber-300 border-amber-400/30",
};

const GENRE_CIRCLE_COLORS: Record<string, string> = {
  "Hip-Hop": "from-red-500 to-orange-500",
  "R&B": "from-purple-500 to-pink-500",
  "Pop": "from-pink-400 to-rose-500",
  "Rock": "from-gray-500 to-gray-700",
  "Alternative": "from-teal-500 to-cyan-500",
  "Electronic": "from-blue-500 to-indigo-600",
  "Jazz": "from-amber-500 to-yellow-600",
  "Soul": "from-orange-400 to-red-500",
  "Classical": "from-slate-400 to-slate-600",
  "Country": "from-yellow-500 to-amber-600",
  "Latin": "from-rose-500 to-red-600",
  "Ambient": "from-indigo-400 to-purple-500",
  "Indie": "from-emerald-400 to-teal-500",
  "Metal": "from-zinc-500 to-zinc-800",
  "Folk": "from-green-500 to-emerald-600",
  "Reggae": "from-green-400 to-yellow-500",
  "Funk": "from-fuchsia-500 to-purple-600",
  "Blues": "from-blue-600 to-blue-800",
};

const FREQUENCY_DATA = [
  { wave: "Delta", range: "0.5 \u2013 4 Hz", state: "Deep sleep, healing, regeneration", use: "Sleep, physical recovery", color: "#6366f1", gradient: "from-indigo-600 to-violet-700", emoji: "\u{1F30A}", barWidth: 20 },
  { wave: "Theta", range: "4 \u2013 8 Hz", state: "Meditation, creativity, dream state", use: "Meditation, creative flow, light sleep", color: "#8b5cf6", gradient: "from-violet-500 to-purple-600", emoji: "\u{1F9D8}", barWidth: 35 },
  { wave: "Alpha", range: "8 \u2013 13 Hz", state: "Relaxed awareness, calm focus", use: "Calm, stress reduction, learning", color: "#06b6d4", gradient: "from-cyan-400 to-teal-500", emoji: "\u{1F60C}", barWidth: 55 },
  { wave: "Beta", range: "13 \u2013 30 Hz", state: "Active thinking, problem-solving", use: "Focus, productivity, mental tasks", color: "#22c55e", gradient: "from-green-400 to-emerald-500", emoji: "\u{1F9E0}", barWidth: 75 },
  { wave: "Gamma", range: "30 \u2013 100 Hz", state: "Peak awareness, insight, flow", use: "Peak performance, insight, happiness", color: "#f59e0b", gradient: "from-amber-400 to-yellow-500", emoji: "\u26A1", barWidth: 95 },
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
  { title: "Gymnop\u00E9die No.1", artist: "Erik Satie", purpose: "Deep sleep", type: "sleep", search: "Erik Satie Gymnopedie" },
];

const TYPE_CONFIG: Record<string, { label: string; gradient: string; icon: string; bg: string }> = {
  focus: { label: "Focus", gradient: "from-blue-500 to-cyan-500", icon: "\u{1F3AF}", bg: "bg-blue-500/10" },
  calm: { label: "Calm", gradient: "from-emerald-400 to-green-500", icon: "\u{1F343}", bg: "bg-emerald-500/10" },
  mood_lift: { label: "Mood Lift", gradient: "from-orange-400 to-amber-500", icon: "\u{1F305}", bg: "bg-orange-500/10" },
  sleep: { label: "Sleep", gradient: "from-indigo-500 to-violet-600", icon: "\u{1F319}", bg: "bg-indigo-500/10" },
};

const USE_CASE_PAIRINGS = [
  { label: "Peace", emoji: "\u262E\uFE0F", wave: "Alpha + Theta", tempo: "60-80 BPM", gradient: "from-teal-400 to-cyan-500" },
  { label: "Calm", emoji: "\u{1F9CA}", wave: "Alpha", tempo: "60-90 BPM", gradient: "from-sky-400 to-blue-500" },
  { label: "Focus", emoji: "\u{1F52C}", wave: "Beta + Low Gamma", tempo: "100-120 BPM", gradient: "from-emerald-400 to-green-500" },
  { label: "Love", emoji: "\u{1F497}", wave: "Theta + Alpha", tempo: "70-100 BPM", gradient: "from-rose-400 to-pink-500" },
  { label: "Happiness", emoji: "\u{1F31E}", wave: "Gamma + Beta", tempo: "110-130 BPM", gradient: "from-amber-400 to-yellow-500" },
  { label: "Sleep", emoji: "\u{1F4A4}", wave: "Delta + Theta", tempo: "40-60 BPM", gradient: "from-indigo-500 to-purple-600" },
];

const GENRE_EXPANSION = [
  { genre: "Dream Pop", artists: ["Beach House", "Cocteau Twins", "Alvvays"], reason: "Ethereal textures that complement your introspective nature", gradient: "from-pink-400 via-purple-400 to-indigo-500", emoji: "\u{1F4AD}" },
  { genre: "Neo-Soul", artists: ["Erykah Badu", "D'Angelo", "Anderson .Paak"], reason: "Emotional depth with groove \u2014 connects head and heart", gradient: "from-amber-500 via-orange-400 to-rose-500", emoji: "\u{1F3B7}" },
  { genre: "Ambient Electronic", artists: ["Tycho", "Bonobo", "Boards of Canada"], reason: "Focus-friendly atmospheres for creative work", gradient: "from-cyan-400 via-teal-400 to-emerald-500", emoji: "\u{1F52E}" },
  { genre: "Jazz Fusion", artists: ["Kamasi Washington", "Snarky Puppy", "Robert Glasper"], reason: "Complex arrangements that engage your analytical mind", gradient: "from-violet-500 via-purple-500 to-fuchsia-500", emoji: "\u{1F3BA}" },
];

const RECOMMENDATION_CATEGORIES = [
  {
    id: "deep-focus",
    title: "Deep Focus",
    emoji: "\u{1F3AF}",
    gradient: "from-blue-600 to-cyan-500",
    tracks: [
      { title: "Strobe", artist: "Deadmau5", bpm: "128", detail: "Progressive build keeps your brain locked in without jarring shifts" },
      { title: "Resonance", artist: "HOME", bpm: "100", detail: "Retro synths create a steady mental current for deep work" },
      { title: "Dissolve", artist: "Absofacto", bpm: "95", detail: "Dreamy yet rhythmic \u2014 prevents mind-wandering while staying calm" },
    ],
  },
  {
    id: "calm-restore",
    title: "Calm & Restore",
    emoji: "\u{1F9D8}",
    gradient: "from-emerald-500 to-teal-400",
    tracks: [
      { title: "Weightless", artist: "Marconi Union", bpm: "Alpha/Theta", detail: "Scientifically shown to reduce anxiety by up to 65%" },
      { title: "An Ending (Ascent)", artist: "Brian Eno", bpm: "Theta", detail: "Ambient masterpiece that dissolves tension in under 4 minutes" },
      { title: "Nuvole Bianche", artist: "Ludovico Einaudi", bpm: "Alpha", detail: "Piano arpeggios sync with parasympathetic nervous system rhythms" },
    ],
  },
  {
    id: "energy-boost",
    title: "Energy Boost",
    emoji: "\u26A1",
    gradient: "from-orange-500 to-red-500",
    tracks: [
      { title: "Lose Yourself to Dance", artist: "Daft Punk ft. Pharrell", bpm: "100", detail: "High energy" },
      { title: "Electric Feel", artist: "MGMT", bpm: "116", detail: "Very high energy" },
      { title: "One More Time", artist: "Daft Punk", bpm: "122", detail: "Peak energy" },
    ],
  },
  {
    id: "emotional-depth",
    title: "Emotional Depth",
    emoji: "\u{1F49C}",
    gradient: "from-purple-600 to-pink-500",
    tracks: [
      { title: "Motion Picture Soundtrack", artist: "Radiohead", bpm: "Melancholy beauty", detail: "Haunting harmonies that feel like staring at a sunset alone" },
      { title: "re: Stacks", artist: "Bon Iver", bpm: "Quiet ache", detail: "Raw, hushed vocals that mirror your inner contemplative voice" },
      { title: "Street Lights", artist: "Kanye West", bpm: "Introspective longing", detail: "Auto-tuned vulnerability over ambient beats \u2014 emotionally disarming" },
    ],
  },
  {
    id: "sleep-recovery",
    title: "Sleep & Recovery",
    emoji: "\u{1F319}",
    gradient: "from-indigo-600 to-violet-700",
    tracks: [
      { title: "Ambient 1: Music for Airports 1/1", artist: "Brian Eno", bpm: "Delta range", detail: "Play on a 45-minute timer for full sleep-cycle entry" },
      { title: "Sleeping Beauty", artist: "Marconi Union", bpm: "Theta range", detail: "60-minute loop designed for sleep onset \u2014 use with blackout curtain" },
      { title: "Comptine d'un autre \u00E9t\u00E9", artist: "Yann Tiersen", bpm: "Low Alpha", detail: "Gentle piano that lowers heart rate in 10 minutes \u2014 20 min play" },
    ],
  },
  {
    id: "mood-lift",
    title: "Mood Lift",
    emoji: "\u{1F3AD}",
    gradient: "from-amber-500 to-yellow-400",
    tracks: [
      { title: "September", artist: "Earth, Wind & Fire", bpm: "126", detail: "Pure serotonin \u2014 impossible not to move" },
      { title: "Lovely Day", artist: "Bill Withers", bpm: "98", detail: "Warm, sun-soaked optimism" },
      { title: "Golden Hour", artist: "JVKE", bpm: "106", detail: "Euphoric modern pop built for smiling" },
    ],
  },
];

const SPOTIFY_PLAYLISTS = [
  {
    name: "Focus Flow",
    gradient: "from-green-500 to-emerald-600",
    tracks: [
      "Deadmau5 \u2014 Strobe",
      "HOME \u2014 Resonance",
      "Tycho \u2014 Awake",
      "Bonobo \u2014 Kerala",
      "M83 \u2014 Midnight City",
      "Tame Impala \u2014 Let It Happen",
      "Four Tet \u2014 Lush",
      "Boards of Canada \u2014 Dayvan Cowboy",
      "Jon Hopkins \u2014 Open Eye Signal",
      "Kiasmos \u2014 Blurred",
    ],
  },
  {
    name: "Night Wind Down",
    gradient: "from-green-500 to-teal-600",
    tracks: [
      "Brian Eno \u2014 An Ending (Ascent)",
      "Marconi Union \u2014 Weightless",
      "Ludovico Einaudi \u2014 Nuvole Bianche",
      "Yann Tiersen \u2014 Comptine d'un autre \u00E9t\u00E9",
      "Sigur R\u00F3s \u2014 Hopp\u00EDpolla",
      "Sleeping at Last \u2014 Saturn",
      "Erik Satie \u2014 Gymnop\u00E9die No. 1",
      "Max Richter \u2014 On the Nature of Daylight",
      "\u00D3lafur Arnalds \u2014 Near Light",
      "Nils Frahm \u2014 Says",
    ],
  },
  {
    name: "Weekend Energy",
    gradient: "from-green-400 to-lime-500",
    tracks: [
      "Daft Punk \u2014 One More Time",
      "Earth, Wind & Fire \u2014 September",
      "MGMT \u2014 Electric Feel",
      "Doja Cat \u2014 Say So",
      "The Weeknd \u2014 Blinding Lights",
      "Dua Lipa \u2014 Levitating",
      "Pharrell Williams \u2014 Happy",
      "Lizzo \u2014 Juice",
      "Bruno Mars \u2014 24K Magic",
      "Outkast \u2014 Hey Ya!",
    ],
  },
];

// ─── Element-based genre affinities ───

const ELEMENT_GENRES: Record<string, string[]> = {
  Water: ["Ambient", "R&B", "Soul", "Classical", "Blues"],
  Fire: ["Rock", "Hip-Hop", "Electronic", "Metal", "Funk"],
  Earth: ["Jazz", "Folk", "Classical", "Country", "Blues"],
  Air: ["Indie", "Alternative", "Pop", "Electronic", "Reggae"],
};

const ELEMENT_FREQUENCIES: Record<string, { primary: string; secondary: string; description: string }> = {
  Water: { primary: "Theta", secondary: "Delta", description: "Deep meditation and emotional healing -- your Water element resonates with slower, immersive frequencies that mirror the ocean's depth." },
  Fire: { primary: "Beta", secondary: "Gamma", description: "Active focus and peak performance -- your Fire element thrives on high-energy brainwave states that fuel passion and drive." },
  Earth: { primary: "Alpha", secondary: "Theta", description: "Grounded calm and steady focus -- your Earth element aligns with balanced frequencies that promote stability and presence." },
  Air: { primary: "Gamma", secondary: "Alpha", description: "Insight, creativity, and flow -- your Air element connects with expansive frequencies that spark ideas and mental agility." },
};

const ELEMENT_COLORS: Record<string, { badge: string; text: string }> = {
  Water: { badge: "bg-blue-500/20 text-blue-300 border-blue-500/30", text: "text-blue-400" },
  Fire: { badge: "bg-red-500/20 text-red-300 border-red-500/30", text: "text-red-400" },
  Earth: { badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30", text: "text-emerald-400" },
  Air: { badge: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30", text: "text-cyan-400" },
};

const ELEMENT_EMOJIS: Record<string, string> = {
  Water: "\u{1F30A}",
  Fire: "\u{1F525}",
  Earth: "\u{1F33F}",
  Air: "\u{1F4A8}",
};

export default function MusicPage() {
  const [activeTab, setActiveTab] = useState<MusicTab>("frequencies");
  const [artist1, setArtist1] = useState("");
  const [artist2, setArtist2] = useState("");
  const [artist3, setArtist3] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [copiedPlaylist, setCopiedPlaylist] = useState<string | null>(null);

  // ─── Profile state ───
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    db.getProfile().then((p) => {
      setProfile(p);
      setProfileLoading(false);
      // Pre-select intake music genres first, then fill with element-aligned genres
      if (p?.musicGenres && p.musicGenres.length > 0) {
        const intakeGenres = p.musicGenres.filter((g) => ALL_GENRES.some((ag) => ag.name === g));
        if (p.birthday) {
          const dob = new Date(p.birthday + "T00:00:00");
          const sign = getSunSign(dob);
          const elementGenres = (ELEMENT_GENRES[sign.element] || []).filter((g) => !intakeGenres.includes(g));
          setSelectedGenres([...intakeGenres, ...elementGenres]);
        } else {
          setSelectedGenres(intakeGenres);
        }
      } else if (p?.birthday) {
        const dob = new Date(p.birthday + "T00:00:00");
        const sign = getSunSign(dob);
        const elementGenres = ELEMENT_GENRES[sign.element] || [];
        setSelectedGenres(elementGenres);
      }
    }).catch(() => setProfileLoading(false));
  }, []);

  // ─── Computed profile data ───
  const profileData = useMemo(() => {
    if (!profile?.birthday) return null;
    const dob = new Date(profile.birthday + "T00:00:00");
    const sunSign = getSunSign(dob);
    const lifePath = calculateLifePath(dob);
    const element = sunSign.element;
    const musicGenres = profile.musicGenres?.filter((g) => ALL_GENRES.some((ag) => ag.name === g)) || [];
    return { sunSign, lifePath, element, firstName: profile.firstName, musicGenres };
  }, [profile]);

  const toggleGenre = useCallback((genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  }, []);

  const handleCurate = useCallback(() => {
    setIsAnalyzing(true);
    setShowRecommendations(false);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowRecommendations(true);
      setActiveTab("recommendations");
    }, 2200);
  }, []);

  const copyPlaylist = useCallback((name: string, tracks: string[]) => {
    const text = `${name}\n\n${tracks.map((t, i) => `${i + 1}. ${t}`).join("\n")}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedPlaylist(name);
      setTimeout(() => setCopiedPlaylist(null), 2000);
    });
  }, []);

  const hasInput = artist1.trim() || artist2.trim() || artist3.trim() || selectedGenres.length > 0;

  const recommendedArtists = useMemo(() => {
    const intakeGenreSet = new Set(profileData?.musicGenres || []);
    // Sort so intake genres come first
    const sorted = [...selectedGenres].sort((a, b) => {
      const aIntake = intakeGenreSet.has(a) ? 0 : 1;
      const bIntake = intakeGenreSet.has(b) ? 0 : 1;
      return aIntake - bIntake;
    });
    return sorted
      .filter((g) => GENRE_ARTISTS[g])
      .map((genre) => ({
        genre,
        artists: GENRE_ARTISTS[genre],
        isIntakeGenre: intakeGenreSet.has(genre),
      }));
  }, [selectedGenres, profileData?.musicGenres]);

  const totalArtistCount = useMemo(() => {
    return recommendedArtists.reduce((sum, g) => sum + g.artists.length, 0);
  }, [recommendedArtists]);

  const tabs: { key: MusicTab; label: string; emoji: string }[] = [
    { key: "frequencies", label: "Frequencies", emoji: "\u{1F4E1}" },
    { key: "playlist", label: "Spotify Pack", emoji: "\u{1F3B5}" },
    { key: "expansion", label: "Music Expansion", emoji: "\u{1F30D}" },
    ...(showRecommendations
      ? [{ key: "recommendations" as MusicTab, label: "For You", emoji: "\u2728" }]
      : []),
  ];

  if (profileLoading) {
    return (
      <div className="mx-auto max-w-5xl flex items-center justify-center py-32">
        <div className="flex items-center gap-3 text-gray-400">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-sm font-medium">Loading your music profile...</span>
        </div>
      </div>
    );
  }

  if (!profile || !profile.intakeComplete) {
    return (
      <div className="mx-auto max-w-5xl py-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-950 p-12 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(139,92,246,0.3),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(6,182,212,0.15),transparent_60%)]" />
          <div className="relative z-10">
            <span className="text-5xl mb-4 block">{"\u{1F3B5}"}</span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Your Music Awaits</h1>
            <p className="text-lg text-white/60 max-w-lg mx-auto mb-8">
              Complete your intake first so we can tune your music and frequency recommendations to your unique cosmic profile.
            </p>
            <a
              href="/intake"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 px-8 py-4 text-sm font-bold text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300"
            >
              Complete Your Intake
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-950 p-8 md:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(139,92,246,0.3),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(6,182,212,0.15),transparent_60%)]" />
        {/* Animated wave bars in background */}
        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-1 px-8 opacity-20">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="w-2 rounded-t-full bg-gradient-to-t from-purple-400 to-cyan-400"
              style={{
                height: `${20 + Math.sin(i * 0.5) * 30 + Math.random() * 20}px`,
                animationDelay: `${i * 0.05}s`,
              }}
            />
          ))}
        </div>
        <div className="relative z-10">
          <p className="text-sm font-medium uppercase tracking-widest text-cyan-400 mb-2">{"\u{1F3A7}"} Tuned to You</p>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3">
            {profileData?.firstName ? `${profileData.firstName}'s Music & Frequency Guide` : "Music & Frequency Guide"}
          </h1>
          <p className="text-lg text-white/60 max-w-xl mb-4">
            {profileData
              ? profileData.musicGenres.length > 0
                ? `Tuned to your love of ${profileData.musicGenres.slice(0, 3).join(", ")}${profileData.musicGenres.length > 3 ? ` and ${profileData.musicGenres.length - 3} more` : ""} -- with brainwave frequencies aligned to your ${profileData.element} energy.`
                : "Personalized brainwave frequencies and music recommendations aligned to your cosmic profile."
              : "Educational guide to brainwave states and your personalized music recommendations."}
          </p>
          {profileData && (
            <div className="flex flex-wrap items-center gap-3">
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${ELEMENT_COLORS[profileData.element]?.badge || "bg-white/10 text-white/60 border-white/20"}`}>
                {ELEMENT_EMOJIS[profileData.element] || ""} {profileData.sunSign.name} {profileData.sunSign.symbol}
              </span>
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${ELEMENT_COLORS[profileData.element]?.badge || "bg-white/10 text-white/60 border-white/20"}`}>
                {ELEMENT_EMOJIS[profileData.element] || ""} {profileData.element} Element
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border bg-purple-500/20 text-purple-300 border-purple-500/30 px-3 py-1.5 text-xs font-semibold">
                Life Path {profileData.lifePath.value}{profileData.lifePath.isMaster ? " (Master)" : ""}
              </span>
              {profileData.musicGenres.map((genre) => {
                const genreData = ALL_GENRES.find((g) => g.name === genre);
                return (
                  <span
                    key={genre}
                    className={`inline-flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r ${genreData?.color || "from-gray-500 to-gray-600"}`}
                  >
                    {genre}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Your Top Genres (from intake) */}
      {profileData && profileData.musicGenres.length > 0 && (
        <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-950" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(139,92,246,0.15),transparent_60%)]" />
          <div className="relative z-10 p-8 md:p-10">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-3xl">{"\u{1F3B6}"}</span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white">Your Top Genres</h2>
            </div>
            <p className="text-white/40 text-sm mb-6 ml-12">
              Based on what you told us during intake -- these are the sounds that define you.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {profileData.musicGenres.map((genre) => {
                const genreData = ALL_GENRES.find((g) => g.name === genre);
                const artistCount = GENRE_ARTISTS[genre]?.length || 0;
                return (
                  <div
                    key={genre}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${genreData?.color || "from-gray-500 to-gray-600"} opacity-20 group-hover:opacity-30 transition-opacity`} />
                    <div className="relative p-5 text-center">
                      <div className={`mx-auto h-14 w-14 rounded-full bg-gradient-to-br ${genreData?.color || "from-gray-500 to-gray-600"} mb-3 flex items-center justify-center`}>
                        <span className="text-white text-lg font-extrabold">{genre.charAt(0)}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white mb-1">{genre}</h4>
                      {artistCount > 0 && (
                        <p className="text-[10px] text-white/30">{artistCount} artists curated</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Preference Input Section */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-950 via-violet-950 to-indigo-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(236,72,153,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(99,102,241,0.15),transparent_50%)]" />

        <div className="relative z-10 p-8 md:p-10">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-3xl">{"\u{1F3A4}"}</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">Tell us your taste</h2>
          </div>
          <p className="text-white/50 text-sm mb-8 ml-12">
            Share your favorite artists and genres so we can craft your perfect soundtrack.
          </p>

          {/* Artist Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { value: artist1, setter: setArtist1, placeholder: "Favorite artist/band 1", num: 1 },
              { value: artist2, setter: setArtist2, placeholder: "Favorite artist/band 2", num: 2 },
              { value: artist3, setter: setArtist3, placeholder: "Favorite artist/band 3", num: 3 },
            ].map((input) => (
              <div key={input.num} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-2xl opacity-0 group-focus-within:opacity-50 blur transition-opacity duration-300" />
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white/60">
                    {input.num}
                  </div>
                  <input
                    type="text"
                    value={input.value}
                    onChange={(e) => input.setter(e.target.value)}
                    placeholder={input.placeholder}
                    className="w-full rounded-2xl bg-white/5 border border-white/10 pl-14 pr-4 py-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all duration-300"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Genre Pills */}
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">Select your genres</p>
            <div className="flex flex-wrap gap-2">
              {ALL_GENRES.map((genre) => {
                const isSelected = selectedGenres.includes(genre.name);
                return (
                  <button
                    key={genre.name}
                    onClick={() => toggleGenre(genre.name)}
                    className={`relative rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                      isSelected
                        ? "text-white shadow-lg scale-105"
                        : "bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 hover:text-white/70"
                    }`}
                  >
                    {isSelected && (
                      <div className={`absolute inset-0 bg-gradient-to-r ${genre.color} rounded-full`} />
                    )}
                    <span className="relative z-10">{genre.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Instant Artist Recommendations */}
          <div className="mb-8">
            {selectedGenres.length === 0 ? (
              <div className="rounded-2xl bg-white/5 border border-white/5 p-6 text-center">
                <p className="text-sm text-white/30">Select genres above to see artist recommendations</p>
              </div>
            ) : (
              <div
                className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden"
                style={{ animation: "fadeIn 0.3s ease-in-out" }}
              >
                {/* Header */}
                <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{"\u{1F3B6}"}</span>
                    <h3 className="text-lg font-bold text-white">Recommended Artists</h3>
                  </div>
                  <span className="text-xs font-medium text-white/40 rounded-full bg-white/5 px-3 py-1 border border-white/10">
                    {selectedGenres.length} genre{selectedGenres.length > 1 ? "s" : ""} &middot; {totalArtistCount} artists
                  </span>
                </div>

                {/* Artist Grid by Genre */}
                <div className="max-h-[420px] overflow-y-auto">
                  {recommendedArtists.map(({ genre, artists, isIntakeGenre }) => {
                    const genreColor = GENRE_CIRCLE_COLORS[genre] || "from-gray-500 to-gray-700";
                    return (
                      <div key={genre} className="border-b border-white/5 last:border-b-0">
                        {/* Genre Header */}
                        <div className="px-6 py-3 bg-white/[0.02] flex items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-widest text-white/30">{genre}</span>
                          {isIntakeGenre && (
                            <span className="text-[10px] font-semibold uppercase tracking-wider rounded-full bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30 px-2 py-0.5">Your Pick</span>
                          )}
                        </div>
                        {/* Artist Cards Grid */}
                        <div className="px-4 py-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {artists.map((artist) => {
                            const vibeColor = VIBE_COLORS[artist.vibe] || "bg-gray-500/20 text-gray-300 border-gray-500/30";
                            return (
                              <div
                                key={artist.name}
                                className="flex items-start gap-3 rounded-xl bg-white/[0.03] border border-white/5 p-3 hover:bg-white/[0.06] transition-colors duration-200"
                              >
                                {/* Gradient Circle */}
                                <div className={`flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br ${genreColor} opacity-80`} />
                                {/* Info */}
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-bold text-white truncate">{artist.name}</p>
                                  <p className="text-xs text-white/40 leading-snug line-clamp-1">{artist.description}</p>
                                  <div className="flex items-center gap-2 mt-1.5">
                                    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${vibeColor}`}>
                                      {artist.vibe}
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-white/25 mt-1">Top Track: {artist.topTrack}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Curate Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleCurate}
              disabled={!hasInput || isAnalyzing}
              className={`relative group overflow-hidden rounded-2xl px-8 py-4 text-sm font-bold transition-all duration-300 ${
                hasInput && !isAnalyzing
                  ? "bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95"
                  : "bg-white/5 text-white/20 cursor-not-allowed"
              }`}
            >
              {isAnalyzing ? (
                <span className="flex items-center gap-3">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Analyzing your taste...
                </span>
              ) : (
                "Curate My Music"
              )}
            </button>
            {hasInput && !isAnalyzing && (
              <p className="text-xs text-white/30">
                {selectedGenres.length > 0 && `${selectedGenres.length} genre${selectedGenres.length > 1 ? "s" : ""} selected`}
                {selectedGenres.length > 0 && (artist1 || artist2 || artist3) && " \u00B7 "}
                {[artist1, artist2, artist3].filter(Boolean).length > 0 &&
                  `${[artist1, artist2, artist3].filter(Boolean).length} artist${[artist1, artist2, artist3].filter(Boolean).length > 1 ? "s" : ""} added`}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Fade-in keyframe (injected inline) */}
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>

      {/* Disclaimer */}
      <div className="rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 p-4 flex items-start gap-3">
        <span className="text-xl">{"\u26A0\uFE0F"}</span>
        <p className="text-sm text-amber-800">
          Frequency information is educational only. This is not medical advice. Consult healthcare professionals for clinical needs.
        </p>
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
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* FREQUENCIES TAB */}
      {activeTab === "frequencies" && (
        <div className="space-y-6">
          {/* Element-Based Frequency Insight */}
          {profileData && ELEMENT_FREQUENCIES[profileData.element] && (
            <div className={`rounded-3xl border border-white/10 bg-gradient-to-br from-gray-900 to-slate-900 p-8`}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{ELEMENT_EMOJIS[profileData.element]}</span>
                <div>
                  <h3 className="text-lg font-bold text-white">Your Healing Frequencies</h3>
                  <p className={`text-sm font-medium ${ELEMENT_COLORS[profileData.element]?.text || "text-white/60"}`}>
                    Tuned to {profileData.element} Element &middot; {profileData.sunSign.name}
                  </p>
                </div>
              </div>
              <p className="text-sm text-white/50 mb-5 max-w-2xl">{ELEMENT_FREQUENCIES[profileData.element].description}</p>
              <div className="flex flex-wrap gap-3">
                <div className={`rounded-2xl border px-5 py-3 ${ELEMENT_COLORS[profileData.element]?.badge || "bg-white/10 text-white/60 border-white/20"}`}>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">Primary Wave</p>
                  <p className="text-lg font-extrabold">{ELEMENT_FREQUENCIES[profileData.element].primary}</p>
                </div>
                <div className={`rounded-2xl border px-5 py-3 ${ELEMENT_COLORS[profileData.element]?.badge || "bg-white/10 text-white/60 border-white/20"}`}>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">Secondary Wave</p>
                  <p className="text-lg font-extrabold">{ELEMENT_FREQUENCIES[profileData.element].secondary}</p>
                </div>
              </div>
            </div>
          )}

          {/* Wave Visualization */}
          <div className="rounded-3xl bg-gradient-to-br from-gray-900 to-slate-900 p-8">
            <h3 className="text-lg font-bold text-white mb-6">{"\u{1F30A}"} Brainwave Spectrum</h3>
            <div className="space-y-4">
              {FREQUENCY_DATA.map((freq) => (
                <div key={freq.wave} className="group">
                  <div className="flex items-center gap-4 mb-1">
                    <span className="text-2xl">{freq.emoji}</span>
                    <span className="text-white font-bold w-16">{freq.wave}</span>
                    <span className="text-white/40 text-sm w-28">{freq.range}</span>
                    <div className="flex-1 h-8 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${freq.gradient} rounded-full transition-all duration-700 group-hover:shadow-lg`}
                        style={{ width: `${freq.barWidth}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Frequency Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {FREQUENCY_DATA.map((freq) => (
              <div
                key={freq.wave}
                className="group relative overflow-hidden rounded-2xl border border-white/10 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${freq.gradient} opacity-10 group-hover:opacity-20 transition-opacity`} />
                <div className="relative p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="h-12 w-12 rounded-2xl flex items-center justify-center text-2xl"
                      style={{ backgroundColor: `${freq.color}20` }}
                    >
                      {freq.emoji}
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold text-gray-900">{freq.wave} Waves</h3>
                      <span className="text-sm font-medium" style={{ color: freq.color }}>{freq.range}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">{freq.state}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wide text-gray-400">Best for</span>
                    <span className="text-xs text-gray-600 bg-gray-100 rounded-full px-3 py-1">{freq.use}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Use Case Pairings */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">{"\u{1F3AF}"} Use Case Pairings</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {USE_CASE_PAIRINGS.map((p) => (
                <div key={p.label} className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className={`h-2 bg-gradient-to-r ${p.gradient}`} />
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{p.emoji}</span>
                      <span className="text-lg font-extrabold text-gray-900">{p.label}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{p.wave}</p>
                    <p className="text-xs text-gray-400">{p.tempo}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PLAYLIST TAB */}
      {activeTab === "playlist" && (
        <div className="space-y-8">
          {(["focus", "calm", "mood_lift", "sleep"] as const).map((type) => {
            const config = TYPE_CONFIG[type];
            const tracks = PLAYLIST_DATA.filter((t) => t.type === type);
            return (
              <div key={type}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{config.icon}</span>
                  <h3 className="text-xl font-extrabold text-gray-900">{config.label}</h3>
                  <div className={`h-1 flex-1 bg-gradient-to-r ${config.gradient} rounded-full opacity-30`} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {tracks.map((track) => (
                    <div
                      key={track.title}
                      className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                    >
                      {/* Album art placeholder */}
                      <div className={`h-32 bg-gradient-to-br ${config.gradient} relative`}>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                            <div className="h-12 w-12 rounded-full bg-white/30 flex items-center justify-center">
                              <span className="text-white text-2xl ml-1">{"\u25B6"}</span>
                            </div>
                          </div>
                        </div>
                        <div className="absolute top-3 right-3 rounded-full bg-black/30 backdrop-blur-sm px-3 py-1 text-xs text-white font-medium">
                          {track.purpose}
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="text-sm font-bold text-gray-900 truncate">{track.title}</h4>
                        <p className="text-xs text-gray-400">{track.artist}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* EXPANSION TAB */}
      {activeTab === "expansion" && (
        <div className="space-y-6">
          <div className="rounded-3xl bg-gradient-to-br from-gray-900 to-slate-900 p-8">
            <h3 className="text-2xl font-extrabold text-white mb-2">{"\u{1F30D}"} Expand Your Musical Palette</h3>
            <p className="text-white/50 text-sm">
              {profileData
                ? `Based on your ${profileData.element} element energy (${profileData.sunSign.name}), here are genres and artists to explore.`
                : "Based on your preferences, here are genres and artists to explore."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {GENRE_EXPANSION.map((rec) => (
              <div key={rec.genre} className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className={`h-28 bg-gradient-to-br ${rec.gradient} relative`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-5xl opacity-50 group-hover:opacity-80 group-hover:scale-110 transition-all">{rec.emoji}</span>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <h4 className="text-xl font-extrabold text-white drop-shadow-lg">{rec.genre}</h4>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {rec.artists.map((artist) => (
                      <span key={artist} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                        {artist}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">{rec.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RECOMMENDATIONS TAB */}
      {activeTab === "recommendations" && showRecommendations && (
        <div className="space-y-8">
          {/* Recommendations Header */}
          <div className="rounded-3xl bg-gradient-to-br from-gray-900 to-slate-900 p-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{"\u2728"}</span>
              <h3 className="text-2xl font-extrabold text-white">Your Personalized Recommendations</h3>
            </div>
            <p className="text-white/50 text-sm ml-12">
              Curated based on
              {[artist1, artist2, artist3].filter(Boolean).length > 0 && (
                <span>
                  {" your love of "}
                  <span className="text-white/80 font-semibold">
                    {[artist1, artist2, artist3].filter(Boolean).join(", ")}
                  </span>
                </span>
              )}
              {selectedGenres.length > 0 && (
                <span>
                  {[artist1, artist2, artist3].filter(Boolean).length > 0 ? " and " : " "}
                  <span className="text-white/80 font-semibold">
                    {selectedGenres.join(", ")}
                  </span>
                </span>
              )}
              .
            </p>
          </div>

          {/* Recommendation Categories */}
          {RECOMMENDATION_CATEGORIES.map((category) => (
            <div
              key={category.id}
              className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              {/* Category Header */}
              <div className={`bg-gradient-to-r ${category.gradient} p-5`}>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{category.emoji}</span>
                  <h3 className="text-xl font-extrabold text-white drop-shadow">{category.title}</h3>
                </div>
              </div>

              {/* Track Rows */}
              <div className="divide-y divide-gray-100">
                {category.tracks.map((track, idx) => (
                  <div
                    key={track.title}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors duration-200"
                  >
                    {/* Play Button */}
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors cursor-pointer hover:scale-110 active:scale-95">
                      <span className="text-gray-500 text-sm ml-0.5">{"\u25B6"}</span>
                    </div>

                    {/* Track Number */}
                    <span className="text-xs font-bold text-gray-300 w-4">{idx + 1}</span>

                    {/* Track Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-gray-900 truncate">{track.title}</h4>
                      <p className="text-xs text-gray-400 truncate">{track.artist}</p>
                    </div>

                    {/* BPM / Wave Badge */}
                    <div className={`flex-shrink-0 rounded-full bg-gradient-to-r ${category.gradient} px-3 py-1`}>
                      <span className="text-xs font-bold text-white">{track.bpm}</span>
                    </div>

                    {/* Why It Works */}
                    <p className="hidden lg:block text-xs text-gray-400 max-w-[220px] truncate" title={track.detail}>
                      {track.detail}
                    </p>
                  </div>
                ))}
              </div>

              {/* Mobile detail view */}
              <div className="lg:hidden divide-y divide-gray-50 bg-gray-50/50">
                {category.tracks.map((track) => (
                  <div key={`detail-${track.title}`} className="px-4 py-2">
                    <p className="text-xs text-gray-500 italic">
                      <span className="font-semibold text-gray-600">{track.title}:</span> {track.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Spotify-Ready Playlists */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <svg className="h-8 w-8 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
              </svg>
              <h3 className="text-2xl font-extrabold text-gray-900">Spotify-Ready Playlists</h3>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              Copy these playlists and search for them on Spotify to build your perfect collection.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SPOTIFY_PLAYLISTS.map((playlist) => (
                <div
                  key={playlist.name}
                  className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Spotify-colored header */}
                  <div className={`bg-gradient-to-br ${playlist.gradient} p-5 relative`}>
                    <div className="absolute top-3 right-3 opacity-20">
                      <svg className="h-10 w-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-extrabold text-white">{playlist.name}</h4>
                    <p className="text-xs text-white/60 mt-1">{playlist.tracks.length} tracks</p>
                  </div>

                  {/* Track List */}
                  <div className="p-4">
                    <div className="space-y-2 mb-4">
                      {playlist.tracks.map((track, idx) => (
                        <div key={track} className="flex items-center gap-3 text-sm">
                          <span className="text-xs text-gray-300 font-mono w-5 text-right">{idx + 1}</span>
                          <span className="text-gray-700 truncate">{track}</span>
                        </div>
                      ))}
                    </div>

                    {/* Copy Button */}
                    <button
                      onClick={() => copyPlaylist(playlist.name, playlist.tracks)}
                      className={`w-full rounded-xl py-3 text-sm font-bold transition-all duration-300 ${
                        copiedPlaylist === playlist.name
                          ? "bg-green-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-green-500 hover:text-white active:scale-95"
                      }`}
                    >
                      {copiedPlaylist === playlist.name ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          Copied!
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Copy Playlist
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
