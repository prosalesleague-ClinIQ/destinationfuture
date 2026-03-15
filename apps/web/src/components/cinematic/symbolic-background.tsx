"use client";

import { useRef, useEffect } from "react";

interface SymbolicBackgroundProps {
  opacity?: number;
}

type SymbolKind = "number" | "glyph" | "star" | "city";

interface Symbol {
  kind: SymbolKind;
  text: string;
  x: number;
  y: number;
  speed: number;
  horizontalDrift: number;
  opacity: number;
  baseOpacity: number;
  size: number;
  depth: number; // 0-1, affects blur/speed/size
  rotation: number;
  rotationSpeed: number;
  phase: number; // for twinkle offset
}

const NUMBERS = "0123456789".split("");
const GLYPHS = "\u2648\u2649\u264A\u264B\u264C\u264D\u264E\u264F\u2650\u2651\u2652\u2653".split("");
const CITIES = [
  "Paris", "Tokyo", "New York", "London", "Dubai", "Sydney",
  "Lisbon", "Berlin", "Seoul", "Mumbai", "Rio", "Cape Town",
  "Vancouver", "Bangkok", "Barcelona",
];

function randomRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function createSymbol(kind: SymbolKind, canvasW: number, canvasH: number): Symbol {
  const depth = randomRange(0.2, 1);
  const depthScale = 0.4 + depth * 0.6;

  let text = "";
  let size = 14;
  let speed = 0;
  let horizontalDrift = 0;
  let rotationSpeed = 0;
  const baseOpacity = randomRange(0.03, 0.15);

  switch (kind) {
    case "number":
      text = pickRandom(NUMBERS);
      size = randomRange(12, 28) * depthScale;
      speed = randomRange(0.15, 0.45) * depthScale;
      horizontalDrift = randomRange(-0.08, 0.08);
      break;
    case "glyph":
      text = pickRandom(GLYPHS);
      size = randomRange(16, 36) * depthScale;
      speed = randomRange(0.1, 0.3) * depthScale;
      horizontalDrift = randomRange(-0.2, 0.2);
      rotationSpeed = randomRange(-0.003, 0.003);
      break;
    case "star":
      text = "\u00B7";
      size = randomRange(2, 5) * depthScale;
      speed = 0;
      horizontalDrift = 0;
      break;
    case "city":
      text = pickRandom(CITIES);
      size = randomRange(10, 16) * depthScale;
      speed = 0;
      horizontalDrift = randomRange(0.1, 0.35) * depthScale * (Math.random() > 0.5 ? 1 : -1);
      break;
  }

  return {
    kind,
    text,
    x: randomRange(0, canvasW),
    y: randomRange(0, canvasH),
    speed,
    horizontalDrift,
    opacity: baseOpacity,
    baseOpacity,
    size,
    depth,
    rotation: randomRange(0, Math.PI * 2),
    rotationSpeed,
    phase: randomRange(0, Math.PI * 2),
  };
}

function getColor(kind: SymbolKind, opacity: number): string {
  switch (kind) {
    case "number":
      return `rgba(99, 102, 241, ${opacity})`;
    case "glyph":
      return `rgba(168, 85, 247, ${opacity})`;
    case "star":
      return `rgba(255, 255, 255, ${opacity})`;
    case "city":
      return `rgba(100, 116, 139, ${opacity})`;
  }
}

export default function SymbolicBackground({ opacity = 1 }: SymbolicBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    let animId: number;
    let w = 0;
    let h = 0;

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

    // Generate symbols — ~100 total
    const symbols: Symbol[] = [];

    // 30 numbers
    for (let i = 0; i < 30; i++) symbols.push(createSymbol("number", w, h));
    // 20 glyphs
    for (let i = 0; i < 20; i++) symbols.push(createSymbol("glyph", w, h));
    // 35 stars
    for (let i = 0; i < 35; i++) symbols.push(createSymbol("star", w, h));
    // 15 cities
    for (let i = 0; i < 15; i++) symbols.push(createSymbol("city", w, h));

    let time = 0;

    const animate = () => {
      time += 1;
      ctx.clearRect(0, 0, w, h);

      for (const s of symbols) {
        // Update position
        switch (s.kind) {
          case "number":
            s.y += s.speed;
            s.x += s.horizontalDrift + Math.sin(time * 0.005 + s.phase) * 0.05;
            if (s.y > h + s.size) {
              s.y = -s.size;
              s.x = randomRange(0, w);
            }
            break;

          case "glyph":
            s.y += s.speed;
            s.x += s.horizontalDrift + Math.sin(time * 0.008 + s.phase) * 0.1;
            s.rotation += s.rotationSpeed;
            if (s.y > h + s.size) {
              s.y = -s.size;
              s.x = randomRange(0, w);
            }
            if (s.x > w + s.size) s.x = -s.size;
            if (s.x < -s.size) s.x = w + s.size;
            break;

          case "star":
            // Stars twinkle in place
            s.opacity =
              s.baseOpacity *
              (0.4 + 0.6 * Math.abs(Math.sin(time * 0.015 + s.phase)));
            break;

          case "city":
            s.x += s.horizontalDrift;
            s.y += Math.sin(time * 0.003 + s.phase) * 0.03;
            if (s.horizontalDrift > 0 && s.x > w + 100) {
              s.x = -100;
              s.y = randomRange(0, h);
            }
            if (s.horizontalDrift < 0 && s.x < -100) {
              s.x = w + 100;
              s.y = randomRange(0, h);
            }
            break;
        }

        // Draw
        ctx.save();

        // Depth-based blur (subtle)
        if (s.depth < 0.5) {
          ctx.filter = `blur(${(1 - s.depth * 2) * 1.5}px)`;
        } else {
          ctx.filter = "none";
        }

        const currentOpacity = s.kind === "star" ? s.opacity : s.baseOpacity;
        ctx.fillStyle = getColor(s.kind, currentOpacity);

        if (s.kind === "star") {
          // Draw as a small circle
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.translate(s.x, s.y);
          if (s.kind === "glyph") {
            ctx.rotate(s.rotation);
          }
          ctx.font = `${s.size}px "Inter", "SF Pro Display", system-ui, sans-serif`;
          if (s.kind === "city") {
            ctx.font = `300 ${s.size}px "Inter", "SF Pro Display", system-ui, sans-serif`;
            ctx.letterSpacing = "2px";
          }
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(s.text, 0, 0);
        }

        ctx.restore();
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

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
