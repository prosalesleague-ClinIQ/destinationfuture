"use client";

import { useRef, useEffect } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SymbolicBackgroundProps {
  opacity?: number;
}

type SymbolCategory =
  | "numerology"
  | "astrology"
  | "planet"
  | "city"
  | "coordinate"
  | "metric"
  | "formula"
  | "label"
  | "timeline"
  | "star";

interface Particle {
  category: SymbolCategory;
  text: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  opacity: number;
  baseOpacity: number;
  size: number;
  depth: number; // 0 = far, 1 = mid, 2 = near
  rotation: number;
  rotationSpeed: number;
  phase: number; // offset for oscillation
  pulseSpeed: number;
  font: string;
}

// ---------------------------------------------------------------------------
// Symbol pools — 150 total
// ---------------------------------------------------------------------------

const NUMEROLOGY: string[] = [
  "1", "2", "3", "4", "5", "6", "7", "8", "9",
  "11", "22", "33",
  "10", "12", "13", "14", "15", "16", "17", "18", "19",
  "20", "21", "23", "24", "25",
];

const ASTROLOGY: string[] = [
  "\u2648", "\u2649", "\u264A", "\u264B", "\u264C", "\u264D",
  "\u264E", "\u264F", "\u2650", "\u2651", "\u2652", "\u2653",
  "\u2648", "\u2649", "\u264A", "\u264B", "\u264C", "\u264D",
  "\u264E", "\u264F",
];

const PLANETS: string[] = [
  "\u2609", "\u263D", "\u263F", "\u2640", "\u2642",
  "\u2643", "\u2644", "\u2645", "\u2646", "\u2647",
];

const PLANET_LABELS: string[] = [
  "Venus", "Mars", "Saturn", "Jupiter", "Mercury",
];

const CITIES: string[] = [
  "Paris", "Tokyo", "New York", "London", "Dubai",
  "Sydney", "Lisbon", "Berlin", "Seoul", "Mumbai",
  "Rio", "Cape Town", "Vancouver", "Bangkok", "Barcelona",
  "Florence", "Kyoto", "Sedona", "Amsterdam", "Reykjavik",
];

const COORDINATES: string[] = [
  "48.86\u00B0N 2.35\u00B0E",
  "35.68\u00B0N 139.69\u00B0E",
  "40.71\u00B0N 74.01\u00B0W",
  "51.51\u00B0N 0.13\u00B0W",
  "25.20\u00B0N 55.27\u00B0E",
  "33.87\u00B0S 151.21\u00B0E",
  "38.72\u00B0N 9.14\u00B0W",
  "52.52\u00B0N 13.40\u00B0E",
  "37.57\u00B0N 126.98\u00B0E",
  "19.08\u00B0N 72.88\u00B0E",
];

const METRICS: string[] = [
  "94%", "87%", "76%", "91%", "83%",
  "\u221E", "\u2192", "\u27F7",
  "LP:6", "SU:3", "EX:5", "PY:7",
  "88%", "72%", "96%",
];

const FORMULAS: string[] = [
  "\u03A3(LP+EX)", "\u0394 cycle", "\u03B8 = 23.4\u00B0",
  "\u03C6 ratio", "f(x,t)", "\u222B growth",
  "destiny.vector", "align(city,soul)", "match.score",
  "shadow.index", "\u03BB phase", "d/dt(soul)",
  "\u221A\u03C0", "\u2207field", "cos(\u03B8)",
];

const LABELS: string[] = [
  "identity", "shadow", "forecast", "soulmate", "career",
  "growth", "reinvention", "aligned", "threshold", "emergence",
  "destiny", "resonance", "blueprint", "catalyst", "axis",
];

const TIMELINE: string[] = [
  "Y1", "Y2", "Y3", "Q1\u2192Q4", "cycle:7",
  "phase:3", "window:open", "peak:2026",
  "epoch:now", "transit:active",
];

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------

function rand(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ---------------------------------------------------------------------------
// Color per category
// ---------------------------------------------------------------------------

function getCategoryColor(cat: SymbolCategory, opacity: number): string {
  switch (cat) {
    case "numerology":
      return `rgba(129, 140, 248, ${opacity})`; // indigo-400
    case "astrology":
      return `rgba(168, 85, 247, ${opacity})`; // purple-500
    case "planet":
      return `rgba(192, 132, 252, ${opacity})`; // purple-300
    case "city":
      return `rgba(148, 163, 184, ${opacity})`; // slate-400
    case "coordinate":
      return `rgba(100, 116, 139, ${opacity})`; // slate-500
    case "metric":
      return `rgba(99, 102, 241, ${opacity})`; // indigo-500
    case "formula":
      return `rgba(79, 70, 229, ${opacity})`; // indigo-600
    case "label":
      return `rgba(139, 92, 246, ${opacity})`; // violet-500
    case "timeline":
      return `rgba(99, 102, 241, ${opacity})`; // indigo-500
    case "star":
      return `rgba(255, 255, 255, ${opacity})`; // white
  }
}

// ---------------------------------------------------------------------------
// Depth layer configuration
// ---------------------------------------------------------------------------

interface DepthConfig {
  opacityMin: number;
  opacityMax: number;
  sizeScale: number;
  speedScale: number;
  blur: number;
}

const DEPTH_LAYERS: DepthConfig[] = [
  // 0 = far
  { opacityMin: 0.03, opacityMax: 0.06, sizeScale: 0.6, speedScale: 0.4, blur: 1.5 },
  // 1 = mid
  { opacityMin: 0.06, opacityMax: 0.1, sizeScale: 0.85, speedScale: 0.7, blur: 0.5 },
  // 2 = near
  { opacityMin: 0.08, opacityMax: 0.15, sizeScale: 1.0, speedScale: 1.0, blur: 0 },
];

// ---------------------------------------------------------------------------
// Particle factory
// ---------------------------------------------------------------------------

function createParticle(
  category: SymbolCategory,
  w: number,
  h: number
): Particle {
  const depth = Math.floor(Math.random() * 3) as 0 | 1 | 2;
  const layer = DEPTH_LAYERS[depth];
  const baseOpacity = rand(layer.opacityMin, layer.opacityMax);

  let text = "";
  let size = 14;
  let vx = 0;
  let vy = 0;
  let rotationSpeed = 0;
  let pulseSpeed = 0;
  let font = "";

  const ss = layer.speedScale;
  const szs = layer.sizeScale;

  switch (category) {
    case "numerology":
      text = pick(NUMEROLOGY);
      size = rand(14, 30) * szs;
      vy = rand(0.12, 0.4) * ss; // fall slowly
      vx = 0; // sine wave added in update
      font = `600 ${size}px "JetBrains Mono", "SF Mono", monospace`;
      break;

    case "astrology":
      text = pick(ASTROLOGY);
      size = rand(18, 38) * szs;
      // diagonal drift
      vx = rand(0.05, 0.18) * ss * (Math.random() > 0.5 ? 1 : -1);
      vy = rand(0.08, 0.25) * ss;
      rotationSpeed = rand(-0.004, 0.004);
      font = `${size}px serif`;
      break;

    case "planet":
      text = Math.random() > 0.35 ? pick(PLANETS) : pick(PLANET_LABELS);
      size = text.length > 2 ? rand(10, 16) * szs : rand(18, 34) * szs;
      // float upward (counterflow)
      vy = rand(-0.08, -0.2) * ss;
      vx = rand(-0.03, 0.03) * ss;
      font = text.length > 2
        ? `300 ${size}px "Inter", system-ui, sans-serif`
        : `${size}px serif`;
      break;

    case "city":
      text = pick(CITIES);
      size = rand(10, 16) * szs;
      // horizontal left-to-right
      vx = rand(0.12, 0.4) * ss;
      vy = 0;
      font = `300 ${size}px "Inter", system-ui, sans-serif`;
      break;

    case "coordinate":
      text = pick(COORDINATES);
      size = rand(9, 13) * szs;
      // fall faster — data stream
      vy = rand(0.5, 1.0) * ss;
      vx = rand(-0.02, 0.02);
      font = `400 ${size}px "JetBrains Mono", "SF Mono", monospace`;
      break;

    case "metric":
      text = pick(METRICS);
      size = rand(12, 22) * szs;
      // mostly stationary, pulse opacity
      vx = rand(-0.02, 0.02);
      vy = rand(-0.02, 0.02);
      pulseSpeed = rand(0.008, 0.025);
      font = `700 ${size}px "JetBrains Mono", "SF Mono", monospace`;
      break;

    case "formula":
      text = pick(FORMULAS);
      size = rand(10, 16) * szs;
      // diagonal upward-left
      vx = rand(-0.1, -0.25) * ss;
      vy = rand(-0.06, -0.15) * ss;
      rotationSpeed = rand(-0.002, 0.002);
      font = `400 italic ${size}px "JetBrains Mono", "SF Mono", monospace`;
      break;

    case "label":
      text = pick(LABELS);
      size = rand(16, 26) * szs;
      // very slow horizontal drift
      vx = rand(0.02, 0.08) * ss * (Math.random() > 0.5 ? 1 : -1);
      vy = 0;
      font = `200 ${size}px "Inter", system-ui, sans-serif`;
      break;

    case "timeline":
      text = pick(TIMELINE);
      size = rand(10, 16) * szs;
      // fall in clusters, slightly faster
      vy = rand(0.3, 0.65) * ss;
      vx = rand(-0.05, 0.05);
      font = `500 ${size}px "JetBrains Mono", "SF Mono", monospace`;
      break;

    case "star":
      text = "";
      size = rand(1.5, 4) * szs;
      // stationary, twinkle
      vx = 0;
      vy = 0;
      pulseSpeed = rand(0.01, 0.03);
      break;
  }

  return {
    category,
    text,
    x: rand(-50, w + 50),
    y: rand(-50, h + 50),
    vx,
    vy,
    opacity: baseOpacity,
    baseOpacity,
    size,
    depth,
    rotation: rand(0, Math.PI * 2),
    rotationSpeed,
    phase: rand(0, Math.PI * 2),
    pulseSpeed,
    font,
  };
}

// ---------------------------------------------------------------------------
// Update particle position per frame
// ---------------------------------------------------------------------------

function updateParticle(p: Particle, w: number, h: number, time: number): void {
  const margin = 120;

  switch (p.category) {
    case "numerology":
      // Slow fall with sine wave horizontal drift
      p.y += p.vy;
      p.x += Math.sin(time * 0.004 + p.phase) * 0.35;
      if (p.y > h + margin) { p.y = -margin; p.x = rand(0, w); }
      break;

    case "astrology":
      // Diagonal drift with slow rotation
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;
      if (p.y > h + margin) { p.y = -margin; p.x = rand(0, w); }
      if (p.x > w + margin) { p.x = -margin; }
      if (p.x < -margin) { p.x = w + margin; }
      break;

    case "planet":
      // Float upward (counterflow), very slow
      p.x += p.vx + Math.sin(time * 0.002 + p.phase) * 0.08;
      p.y += p.vy;
      if (p.y < -margin) { p.y = h + margin; p.x = rand(0, w); }
      break;

    case "city":
      // Horizontal left-to-right at varied speeds
      p.x += p.vx;
      p.y += Math.sin(time * 0.003 + p.phase) * 0.025;
      if (p.x > w + margin) { p.x = -margin; p.y = rand(0, h); }
      break;

    case "coordinate":
      // Fall faster — data streaming
      p.y += p.vy;
      p.x += p.vx;
      if (p.y > h + margin) { p.y = -margin; p.x = rand(0, w); }
      break;

    case "metric":
      // Pulse opacity cyclically, barely move
      p.x += p.vx;
      p.y += p.vy;
      p.opacity = p.baseOpacity * (0.4 + 0.6 * Math.abs(Math.sin(time * p.pulseSpeed + p.phase)));
      // Wrap
      if (p.x > w + margin) p.x = -margin;
      if (p.x < -margin) p.x = w + margin;
      if (p.y > h + margin) p.y = -margin;
      if (p.y < -margin) p.y = h + margin;
      break;

    case "formula":
      // Diagonal upward-left, rotate slowly
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;
      if (p.y < -margin) { p.y = h + margin; p.x = rand(0, w); }
      if (p.x < -margin) { p.x = w + margin; p.y = rand(0, h); }
      break;

    case "label":
      // Very slow horizontal drift
      p.x += p.vx;
      p.y += Math.sin(time * 0.002 + p.phase) * 0.015;
      if (p.x > w + margin) { p.x = -margin; p.y = rand(0, h); }
      if (p.x < -margin) { p.x = w + margin; p.y = rand(0, h); }
      break;

    case "timeline":
      // Fall in clusters, slightly faster
      p.y += p.vy;
      p.x += p.vx + Math.sin(time * 0.006 + p.phase) * 0.1;
      if (p.y > h + margin) { p.y = -margin; p.x = rand(0, w); }
      break;

    case "star":
      // Stationary, twinkle
      p.opacity = p.baseOpacity * (0.3 + 0.7 * Math.abs(Math.sin(time * p.pulseSpeed + p.phase)));
      break;
  }
}

// ---------------------------------------------------------------------------
// Draw particle
// ---------------------------------------------------------------------------

function drawParticle(ctx: CanvasRenderingContext2D, p: Particle): void {
  ctx.save();

  // Depth-based blur
  const layer = DEPTH_LAYERS[p.depth];
  if (layer.blur > 0) {
    ctx.filter = `blur(${layer.blur}px)`;
  }

  const currentOpacity = p.category === "star" || p.category === "metric"
    ? p.opacity
    : p.baseOpacity;

  ctx.fillStyle = getCategoryColor(p.category, currentOpacity);

  if (p.category === "star") {
    // Draw as a glowing dot
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();

    // Subtle glow halo
    if (p.opacity > p.baseOpacity * 0.7) {
      ctx.globalAlpha = currentOpacity * 0.3;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity * 0.15})`;
      ctx.fill();
    }
  } else {
    ctx.translate(p.x, p.y);

    if (p.rotation !== 0 && (p.category === "astrology" || p.category === "formula")) {
      ctx.rotate(p.rotation);
    }

    ctx.font = p.font;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(p.text, 0, 0);
  }

  ctx.restore();
}

// ---------------------------------------------------------------------------
// Static render for reduced motion
// ---------------------------------------------------------------------------

function renderStatic(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  w: number,
  h: number
): void {
  ctx.clearRect(0, 0, w, h);
  for (const p of particles) {
    // Show at reduced opacity
    const savedOpacity = p.baseOpacity;
    p.baseOpacity = savedOpacity * 0.5;
    p.opacity = p.baseOpacity;
    drawParticle(ctx, p);
    p.baseOpacity = savedOpacity;
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function SymbolicBackground({ opacity = 1 }: SymbolicBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Check reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let animId: number;
    let w = 0;
    let h = 0;

    // DPR-aware canvas sizing
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // -----------------------------------------------------------------------
    // Generate 150 symbols across 10 categories
    // -----------------------------------------------------------------------
    const particles: Particle[] = [];

    // 25 numerology
    for (let i = 0; i < 25; i++) particles.push(createParticle("numerology", w, h));
    // 20 astrology
    for (let i = 0; i < 20; i++) particles.push(createParticle("astrology", w, h));
    // 10 planets
    for (let i = 0; i < 10; i++) particles.push(createParticle("planet", w, h));
    // 20 cities
    for (let i = 0; i < 20; i++) particles.push(createParticle("city", w, h));
    // 10 coordinates
    for (let i = 0; i < 10; i++) particles.push(createParticle("coordinate", w, h));
    // 15 metrics
    for (let i = 0; i < 15; i++) particles.push(createParticle("metric", w, h));
    // 15 formulas
    for (let i = 0; i < 15; i++) particles.push(createParticle("formula", w, h));
    // 15 labels
    for (let i = 0; i < 15; i++) particles.push(createParticle("label", w, h));
    // 10 timeline markers
    for (let i = 0; i < 10; i++) particles.push(createParticle("timeline", w, h));
    // 10 stars
    for (let i = 0; i < 10; i++) particles.push(createParticle("star", w, h));

    // If reduced motion, render once static and stop
    if (prefersReducedMotion) {
      renderStatic(ctx, particles, w, h);
      return () => {
        window.removeEventListener("resize", resize);
      };
    }

    // -----------------------------------------------------------------------
    // Animation loop
    // -----------------------------------------------------------------------
    let time = 0;

    const animate = () => {
      time += 1;
      ctx.clearRect(0, 0, w, h);

      // Update and draw each particle
      for (let i = 0; i < particles.length; i++) {
        updateParticle(particles[i], w, h, time);
        drawParticle(ctx, particles[i]);
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    // -----------------------------------------------------------------------
    // Cleanup
    // -----------------------------------------------------------------------
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity }}
      aria-hidden="true"
    />
  );
}
