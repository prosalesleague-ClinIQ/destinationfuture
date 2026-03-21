"use client";

import { useState, useEffect, useRef, lazy, Suspense } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

const CinematicIntroSequence = dynamic(
  () => import("@/components/cinematic/intro-sequence"),
  { ssr: false }
);

const FEATURES = [
  {
    title: "Identity Snapshot",
    description:
      "Uncover your core personality traits, values, and psychological patterns through multi-system analysis.",
    emoji: "\uD83E\uDDEC",
    gradient: "from-blue-500 to-indigo-600",
    glow: "shadow-blue-500/20",
  },
  {
    title: "Numerology",
    description:
      "Decode the hidden meaning in your birth date and name through life path, expression, and soul urge numbers.",
    emoji: "\uD83D\uDD22",
    gradient: "from-violet-500 to-purple-600",
    glow: "shadow-violet-500/20",
  },
  {
    title: "Location Intelligence",
    description:
      "Find your ideal cities based on your personality, lifestyle, and astrological profile.",
    emoji: "\uD83D\uDDFA\uFE0F",
    gradient: "from-cyan-500 to-blue-600",
    glow: "shadow-cyan-500/20",
  },
  {
    title: "Love & Compatibility",
    description:
      "Understand your relationship dynamics, soulmate timing, love languages, and potential red flags.",
    emoji: "\uD83D\uDC9C",
    gradient: "from-pink-500 to-rose-600",
    glow: "shadow-pink-500/20",
  },
  {
    title: "Growth & Shadow Work",
    description:
      "Dive deep into your unconscious patterns, triggers, and untapped potential for real transformation.",
    emoji: "\uD83C\uDF11",
    gradient: "from-amber-500 to-orange-600",
    glow: "shadow-amber-500/20",
  },
  {
    title: "Future Forecast",
    description:
      "Get personalized 7-day, 30-day, and 3-year plans aligned with your cosmic timing.",
    emoji: "\uD83D\uDD2E",
    gradient: "from-emerald-500 to-teal-600",
    glow: "shadow-emerald-500/20",
  },
  {
    title: "Style & Fashion",
    description:
      "Discover your style archetype, color palette, and capsule wardrobe tailored to your energy.",
    emoji: "\uD83D\uDC54",
    gradient: "from-fuchsia-500 to-pink-600",
    glow: "shadow-fuchsia-500/20",
  },
  {
    title: "Music & Frequency",
    description:
      "Curated playlists, brainwave frequency guide, and personalized music expansion.",
    emoji: "\uD83C\uDFB5",
    gradient: "from-green-500 to-emerald-600",
    glow: "shadow-green-500/20",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Share Your Info",
    description:
      "Enter your name, birth details, and preferences. Your data stays private and encrypted.",
  },
  {
    step: "02",
    title: "Choose Your Focus",
    description:
      "Select a preset or customize which sections matter most to you right now.",
  },
  {
    step: "03",
    title: "Generate Insights",
    description:
      "Our AI synthesizes numerology, astrology, psychology, and location data into your report.",
  },
  {
    step: "04",
    title: "Grow & Level Up",
    description:
      "Complete quests, earn XP, unlock badges, and watch your personal growth unfold.",
  },
];

// ---------------------------------------------------------------------------
// Milky Way fly-through — smooth gentle drift with planets & galaxies
// ---------------------------------------------------------------------------

interface Star {
  x: number; y: number; z: number; px: number; py: number;
  twinkleSpeed: number; twinkleOffset: number;
  hue: number;
}

interface ShootingStar {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  size: number; brightness: number;
}

interface CelestialBody {
  x: number; y: number; z: number;
  type: "planet" | "galaxy" | "nebula";
  size: number;
  color1: string; color2: string; color3: string;
  rotation: number; rotationSpeed: number;
  ringColor?: string; hasRing?: boolean;
  spiralArms?: number;
}

function StarWarpBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const starsRef = useRef<Star[]>([]);
  const bodiesRef = useRef<CelestialBody[]>([]);
  const shootingRef = useRef<ShootingStar[]>([]);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const w = () => canvas.width / dpr;
    const h = () => canvas.height / dpr;

    // Initialize stars with varied properties
    if (starsRef.current.length === 0) {
      for (let i = 0; i < 800; i++) {
        starsRef.current.push({
          x: (Math.random() - 0.5) * 3000,
          y: (Math.random() - 0.5) * 3000,
          z: Math.random() * 3000,
          px: 0, py: 0,
          twinkleSpeed: 0.5 + Math.random() * 2,
          twinkleOffset: Math.random() * Math.PI * 2,
          hue: Math.random() < 0.1 ? 30 + Math.random() * 30 : // warm yellow/orange
               Math.random() < 0.15 ? 200 + Math.random() * 40 : // blue
               0, // white
        });
      }
    }

    // Initialize celestial bodies — planets, galaxies, nebulae
    if (bodiesRef.current.length === 0) {
      const bodies: CelestialBody[] = [];

      // Planets — fewer for performance
      const planetDefs = [
        { color1: "#4a6fa5", color2: "#2d4a7a", color3: "#1a3055", size: 35, hasRing: true, ringColor: "rgba(180,170,140,0.3)" },
        { color1: "#d4a373", color2: "#b07840", color3: "#8a5a28", size: 45, hasRing: true, ringColor: "rgba(200,180,140,0.35)" },
        { color1: "#6ec4a8", color2: "#4a9a80", color3: "#2a7a60", size: 25, hasRing: false },
      ];
      for (let i = 0; i < planetDefs.length; i++) {
        const def = planetDefs[i];
        bodies.push({
          x: (Math.random() - 0.5) * 2400,
          y: (Math.random() - 0.5) * 1600,
          z: 500 + Math.random() * 2500,
          type: "planet",
          size: def.size,
          color1: def.color1, color2: def.color2, color3: def.color3,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: 0.001 + Math.random() * 0.003,
          hasRing: def.hasRing, ringColor: def.ringColor,
        });
      }

      // Distant galaxies — spiral shapes
      for (let i = 0; i < 2; i++) {
        bodies.push({
          x: (Math.random() - 0.5) * 3000,
          y: (Math.random() - 0.5) * 2000,
          z: 1500 + Math.random() * 1500,
          type: "galaxy",
          size: 40 + Math.random() * 60,
          color1: `rgba(${150 + Math.random() * 80}, ${120 + Math.random() * 60}, ${200 + Math.random() * 55}, 0.15)`,
          color2: `rgba(${100 + Math.random() * 60}, ${80 + Math.random() * 60}, ${180 + Math.random() * 75}, 0.08)`,
          color3: `rgba(${80 + Math.random() * 40}, ${60 + Math.random() * 40}, ${150 + Math.random() * 50}, 0.03)`,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: 0.0005 + Math.random() * 0.001,
          spiralArms: 2 + Math.floor(Math.random() * 3),
        });
      }

      // Nebula clouds — large colorful gas clouds
      const nebulaColors = [
        ["rgba(100,60,180,0.06)", "rgba(140,80,220,0.03)", "rgba(80,40,150,0.01)"],
        ["rgba(60,100,200,0.05)", "rgba(80,140,230,0.025)", "rgba(40,80,180,0.01)"],
      ];
      for (let i = 0; i < nebulaColors.length; i++) {
        const cols = nebulaColors[i];
        bodies.push({
          x: (Math.random() - 0.5) * 2800,
          y: (Math.random() - 0.5) * 1800,
          z: 800 + Math.random() * 2200,
          type: "nebula",
          size: 100 + Math.random() * 150,
          color1: cols[0], color2: cols[1], color3: cols[2],
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: 0.0002 + Math.random() * 0.0005,
        });
      }

      bodiesRef.current = bodies;
    }

    const speed = 4; // Brisk cruising speed
    let running = true;

    function drawPlanet(ctx: CanvasRenderingContext2D, sx: number, sy: number, r: number, body: CelestialBody, alpha: number) {
      if (r < 1) return;
      ctx.save();

      // Planet sphere — radial gradient for 3D look
      const grad = ctx.createRadialGradient(sx - r * 0.3, sy - r * 0.3, r * 0.1, sx, sy, r);
      grad.addColorStop(0, body.color1);
      grad.addColorStop(0.6, body.color2);
      grad.addColorStop(1, body.color3);
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(sx, sy, r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Atmospheric glow
      const glowGrad = ctx.createRadialGradient(sx, sy, r * 0.8, sx, sy, r * 1.8);
      glowGrad.addColorStop(0, "transparent");
      glowGrad.addColorStop(0.5, `rgba(150, 180, 255, ${alpha * 0.08})`);
      glowGrad.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.arc(sx, sy, r * 1.8, 0, Math.PI * 2);
      ctx.fillStyle = glowGrad;
      ctx.fill();

      // Ring if applicable
      if (body.hasRing && body.ringColor && r > 4) {
        ctx.globalAlpha = alpha * 0.7;
        ctx.beginPath();
        ctx.ellipse(sx, sy, r * 2.2, r * 0.4, body.rotation, 0, Math.PI * 2);
        ctx.strokeStyle = body.ringColor;
        ctx.lineWidth = r * 0.15;
        ctx.stroke();
        // Second ring
        ctx.beginPath();
        ctx.ellipse(sx, sy, r * 1.8, r * 0.3, body.rotation, 0, Math.PI * 2);
        ctx.strokeStyle = body.ringColor;
        ctx.lineWidth = r * 0.08;
        ctx.stroke();
      }

      ctx.restore();
    }

    function drawGalaxy(ctx: CanvasRenderingContext2D, sx: number, sy: number, r: number, body: CelestialBody, alpha: number) {
      if (r < 2) return;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(sx, sy);
      ctx.rotate(body.rotation);

      // Galaxy core glow
      const coreGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 0.3);
      coreGrad.addColorStop(0, `rgba(255, 240, 220, ${0.2 * alpha})`);
      coreGrad.addColorStop(0.5, `rgba(200, 180, 255, ${0.08 * alpha})`);
      coreGrad.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = coreGrad;
      ctx.fill();

      // Spiral arms
      const arms = body.spiralArms || 2;
      for (let a = 0; a < arms; a++) {
        const angleOffset = (a / arms) * Math.PI * 2;
        ctx.beginPath();
        for (let t = 0; t < 30; t++) {
          const angle = angleOffset + t * 0.12;
          const dist = (t / 30) * r;
          const x = Math.cos(angle) * dist;
          const y = Math.sin(angle) * dist * 0.4; // flatten for tilt
          if (t === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = body.color1;
        ctx.lineWidth = r * 0.06;
        ctx.stroke();
      }

      // Outer diffuse glow
      const outerGrad = ctx.createRadialGradient(0, 0, r * 0.2, 0, 0, r);
      outerGrad.addColorStop(0, body.color2);
      outerGrad.addColorStop(0.6, body.color3);
      outerGrad.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.ellipse(0, 0, r, r * 0.4, 0, 0, Math.PI * 2);
      ctx.fillStyle = outerGrad;
      ctx.fill();

      ctx.restore();
    }

    function drawNebula(ctx: CanvasRenderingContext2D, sx: number, sy: number, r: number, body: CelestialBody, alpha: number) {
      if (r < 3) return;
      ctx.save();
      ctx.globalAlpha = alpha;

      // Multiple overlapping gradients for cloud-like shape
      for (let i = 0; i < 3; i++) {
        const ox = Math.cos(body.rotation + i * 2.1) * r * 0.2;
        const oy = Math.sin(body.rotation + i * 2.1) * r * 0.15;
        const nr = r * (0.6 + i * 0.2);
        const grad = ctx.createRadialGradient(sx + ox, sy + oy, 0, sx + ox, sy + oy, nr);
        const col = [body.color1, body.color2, body.color3][i];
        grad.addColorStop(0, col);
        grad.addColorStop(0.5, col.replace(/[\d.]+\)$/, `${parseFloat(col.match(/[\d.]+\)$/)?.[0] || "0.03") * 0.5})`));
        grad.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.ellipse(sx + ox, sy + oy, nr, nr * 0.6, body.rotation, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      ctx.restore();
    }

    const animate = () => {
      if (!running) return;
      timeRef.current += 0.016;
      const t = timeRef.current;
      const cw = w();
      const ch = h();
      const cx = cw / 2;
      const cy = ch / 2;

      // Clear fully — no motion trails for smooth gentle drift
      ctx.fillStyle = "#050810";
      ctx.fillRect(0, 0, cw, ch);

      // --- Draw celestial bodies (behind stars, sorted by depth) ---
      const sortedBodies = [...bodiesRef.current].sort((a, b) => b.z - a.z);
      for (const body of sortedBodies) {
        body.z -= speed * 0.6;
        body.rotation += body.rotationSpeed;
        if (body.z <= 10) {
          body.z = 2500 + Math.random() * 500;
          body.x = (Math.random() - 0.5) * 2800;
          body.y = (Math.random() - 0.5) * 1800;
        }

        const sx = cx + (body.x / body.z) * 600;
        const sy = cy + (body.y / body.z) * 600;
        const depthFactor = 1 - body.z / 3000;
        const projectedSize = (body.size / body.z) * 600;
        const alpha = Math.min(depthFactor * 1.2, 1);

        if (sx < -200 || sx > cw + 200 || sy < -200 || sy > ch + 200) continue;

        if (body.type === "nebula") drawNebula(ctx, sx, sy, projectedSize, body, alpha * 0.7);
        else if (body.type === "galaxy") drawGalaxy(ctx, sx, sy, projectedSize, body, alpha);
        else if (body.type === "planet") drawPlanet(ctx, sx, sy, projectedSize, body, alpha);
      }

      // --- Draw stars ---
      for (const star of starsRef.current) {
        star.z -= speed;
        if (star.z <= 0) {
          star.x = (Math.random() - 0.5) * 3000;
          star.y = (Math.random() - 0.5) * 3000;
          star.z = 3000;
          star.px = 0; star.py = 0;
        }

        const sx = cx + (star.x / star.z) * 600;
        const sy = cy + (star.y / star.z) * 600;
        const depth = 1 - star.z / 3000;

        // Twinkle
        const twinkle = 0.6 + 0.4 * Math.sin(t * star.twinkleSpeed + star.twinkleOffset);
        const alpha = depth * 0.85 * twinkle;
        const size = depth * 2;

        if (sx < -10 || sx > cw + 10 || sy < -10 || sy > ch + 10) {
          star.px = sx; star.py = sy;
          continue;
        }

        // Subtle drift trail (not warp streak — very short)
        if (star.px !== 0 && star.py !== 0 && depth > 0.3) {
          const dx = sx - star.px;
          const dy = sy - star.py;
          const trailLen = Math.sqrt(dx * dx + dy * dy);
          if (trailLen > 0.5 && trailLen < 8) {
            ctx.beginPath();
            ctx.moveTo(star.px, star.py);
            ctx.lineTo(sx, sy);
            ctx.strokeStyle = `rgba(200, 210, 255, ${alpha * 0.15})`;
            ctx.lineWidth = size * 0.3;
            ctx.stroke();
          }
        }

        // Star point with color variation
        ctx.beginPath();
        ctx.arc(sx, sy, size, 0, Math.PI * 2);
        if (star.hue > 0) {
          ctx.fillStyle = `hsla(${star.hue}, 60%, 80%, ${alpha})`;
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        }
        ctx.fill();

        // Soft glow on close/bright stars — simple circle instead of gradient
        if (depth > 0.7 && twinkle > 0.85) {
          ctx.globalAlpha = alpha * 0.08;
          ctx.beginPath();
          ctx.arc(sx, sy, size * 3, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(180, 200, 255, 1)";
          ctx.fill();
          ctx.globalAlpha = 1;
        }

        star.px = sx;
        star.py = sy;
      }

      // --- Shooting stars ---
      // Spawn new ones randomly
      if (Math.random() < 0.012) {
        const fromLeft = Math.random() < 0.5;
        const startX = fromLeft ? Math.random() * cw * 0.4 : cw * 0.6 + Math.random() * cw * 0.4;
        const startY = Math.random() * ch * 0.5;
        const angle = fromLeft ? 0.3 + Math.random() * 0.5 : Math.PI - 0.3 - Math.random() * 0.5;
        const spd = 12 + Math.random() * 18;
        shootingRef.current.push({
          x: startX, y: startY,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          life: 0,
          maxLife: 30 + Math.random() * 40,
          size: 1.5 + Math.random() * 1.5,
          brightness: 0.7 + Math.random() * 0.3,
        });
      }

      // Update and draw shooting stars
      const activeShooting: ShootingStar[] = [];
      for (const ss of shootingRef.current) {
        ss.life++;
        if (ss.life > ss.maxLife) continue;
        ss.x += ss.vx;
        ss.y += ss.vy;
        activeShooting.push(ss);

        const progress = ss.life / ss.maxLife;
        const fadeIn = Math.min(progress * 5, 1);
        const fadeOut = 1 - Math.pow(progress, 2);
        const alpha = fadeIn * fadeOut * ss.brightness;

        // Bright head
        ctx.beginPath();
        ctx.arc(ss.x, ss.y, ss.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();

        // Glowing head halo
        ctx.beginPath();
        ctx.arc(ss.x, ss.y, ss.size * 3, 0, Math.PI * 2);
        const headGrad = ctx.createRadialGradient(ss.x, ss.y, 0, ss.x, ss.y, ss.size * 3);
        headGrad.addColorStop(0, `rgba(200, 220, 255, ${alpha * 0.4})`);
        headGrad.addColorStop(1, "transparent");
        ctx.fillStyle = headGrad;
        ctx.fill();

        // Luminous tail
        const tailLen = 40 + progress * 60;
        const tailX = ss.x - (ss.vx / Math.sqrt(ss.vx * ss.vx + ss.vy * ss.vy)) * tailLen;
        const tailY = ss.y - (ss.vy / Math.sqrt(ss.vx * ss.vx + ss.vy * ss.vy)) * tailLen;
        const tailGrad = ctx.createLinearGradient(ss.x, ss.y, tailX, tailY);
        tailGrad.addColorStop(0, `rgba(220, 230, 255, ${alpha * 0.6})`);
        tailGrad.addColorStop(0.3, `rgba(160, 180, 255, ${alpha * 0.2})`);
        tailGrad.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = tailGrad;
        ctx.lineWidth = ss.size * 0.8;
        ctx.stroke();
      }
      shootingRef.current = activeShooting;

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      running = false;
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: "#050810" }}
    />
  );
}

// ---------------------------------------------------------------------------
// Landing Page
// ---------------------------------------------------------------------------

export default function LandingPage() {
  const [showIntro, setShowIntro] = useState(false);
  const [introComplete, setIntroComplete] = useState(true); // default true to avoid flash
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const seen = localStorage.getItem("df-intro-seen");
    if (!seen) {
      setShowIntro(true);
      setIntroComplete(false);
    }
  }, []);

  const handleIntroComplete = () => {
    setIntroComplete(true);
    setShowIntro(false);
    localStorage.setItem("df-intro-seen", "1");
  };

  if (!mounted) return null;

  return (
    <>
      {/* Cinematic intro overlay — Three.js globe + warp */}
      {showIntro && !introComplete && (
        <CinematicIntroSequence onComplete={handleIntroComplete} />
      )}

      {/* Main landing page */}
      <div
        className="relative min-h-screen bg-[#0a0e27] text-white transition-opacity duration-1000"
        style={{ opacity: introComplete ? 1 : 0 }}
      >
          <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
              {/* Flying through space — star warp canvas background */}
              <div className="pointer-events-none absolute inset-0">
                <StarWarpBackground />

                {/* Nebula overlay on top of star warp for color depth */}
                <div className="absolute inset-0">
                  <div className="absolute -left-[20%] -top-[10%] h-[600px] w-[800px] rounded-full opacity-20 blur-[120px]"
                    style={{ background: "radial-gradient(ellipse, rgba(88,28,135,0.6), rgba(49,46,129,0.3), transparent 70%)" }} />
                  <div className="absolute -right-[15%] top-[20%] h-[500px] w-[700px] rounded-full opacity-15 blur-[100px]"
                    style={{ background: "radial-gradient(ellipse, rgba(79,70,229,0.5), rgba(139,92,246,0.2), transparent 70%)" }} />
                  <div className="absolute left-[10%] bottom-[5%] h-[400px] w-[600px] rounded-full opacity-12 blur-[110px]"
                    style={{ background: "radial-gradient(ellipse, rgba(14,165,233,0.4), rgba(59,130,246,0.15), transparent 70%)" }} />
                </div>

              </div>

              <div className="relative z-10 mx-auto max-w-4xl text-center">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-300">
                  <span className="inline-block h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
                  Privacy-first insight platform
                </div>

                <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
                  <span
                    className="bg-clip-text text-transparent"
                    style={{
                      backgroundImage:
                        "linear-gradient(135deg, #818cf8, #a78bfa, #c084fc)",
                    }}
                  >
                    Destination
                  </span>{" "}
                  <span className="text-white/90">Future</span>
                </h1>

                <p className="mx-auto mb-10 max-w-2xl text-lg text-white/60 sm:text-xl md:text-2xl leading-relaxed">
                  Discover who you are. Find where you thrive.{" "}
                  <span className="font-semibold text-white/90">
                    Build what&apos;s next.
                  </span>
                </p>

                <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                  <Link
                    href="/login"
                    className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5"
                  >
                    Begin Your Journey
                    <svg
                      className="h-5 w-5 transition-transform group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm px-8 py-4 text-lg font-semibold text-white/80 transition-all duration-200 hover:border-indigo-400/30 hover:bg-white/10"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </section>

            {/* Features Grid */}
            <section className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
              <div className="mb-16 text-center">
                <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl text-white/90">
                  Everything you need to understand{" "}
                  <span
                    className="bg-clip-text text-transparent"
                    style={{
                      backgroundImage:
                        "linear-gradient(135deg, #818cf8, #a78bfa, #c084fc)",
                    }}
                  >
                    yourself
                  </span>
                </h2>
                <p className="mx-auto max-w-2xl text-lg text-white/50">
                  Multi-dimensional insights powered by numerology, astrology,
                  psychology, and AI — all in one place.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {FEATURES.map((feature) => (
                  <div
                    key={feature.title}
                    className={`group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm p-6 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.06] hover:shadow-lg ${feature.glow}`}
                  >
                    <div
                      className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} text-2xl shadow-lg`}
                    >
                      {feature.emoji}
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-white/90">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-white/50 leading-relaxed">
                      {feature.description}
                    </p>
                    <div
                      className={`absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-gradient-to-br ${feature.gradient} opacity-[0.04] transition-all duration-300 group-hover:opacity-[0.1] group-hover:scale-150`}
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* How It Works */}
            <section className="border-t border-white/[0.06] px-4 py-24">
              <div className="mx-auto max-w-5xl">
                <div className="mb-16 text-center">
                  <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl text-white/90">
                    How it works
                  </h2>
                  <p className="mx-auto max-w-2xl text-lg text-white/50">
                    From first visit to lasting transformation in four simple
                    steps.
                  </p>
                </div>

                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                  {STEPS.map((step, index) => (
                    <div key={step.step} className="relative">
                      {index < STEPS.length - 1 && (
                        <div className="absolute left-1/2 top-12 hidden h-px w-full bg-gradient-to-r from-indigo-500/30 to-purple-500/30 lg:block" />
                      )}
                      <div className="relative flex flex-col items-center text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-xl font-bold text-white shadow-lg shadow-indigo-500/20">
                          {step.step}
                        </div>
                        <h3 className="mb-2 text-lg font-semibold text-white/90">
                          {step.title}
                        </h3>
                        <p className="text-sm text-white/50 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Dashboard Preview */}
            <section className="border-t border-white/[0.06] px-4 py-24">
              <div className="mx-auto max-w-6xl">
                <div className="mb-12 text-center">
                  <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl text-white/90">
                    Your personal{" "}
                    <span
                      className="bg-clip-text text-transparent"
                      style={{ backgroundImage: "linear-gradient(135deg, #818cf8, #a78bfa, #c084fc)" }}
                    >
                      growth dashboard
                    </span>
                  </h2>
                  <p className="mx-auto max-w-2xl text-lg text-white/50">
                    Track your progress, complete quests, earn badges, and level up as you grow.
                  </p>
                </div>

                {/* Mock Dashboard */}
                <div className="rounded-3xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-6 sm:p-8 shadow-2xl shadow-black/30">
                  {/* Greeting */}
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-white/90">
                      Welcome back, <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Sarah</span>
                    </h3>
                    <p className="mt-1 text-white/50">Here&apos;s your growth snapshot for today.</p>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-3">
                    {/* Left Column */}
                    <div className="space-y-5 lg:col-span-2">
                      {/* XP Bar */}
                      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
                        <div className="mb-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-lg font-bold text-white shadow-lg shadow-indigo-500/20">4</div>
                            <div>
                              <p className="text-base font-bold text-white/90">Pathfinder</p>
                              <p className="text-xs text-white/50">Level 4</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">620</p>
                            <p className="text-xs text-white/50">Total XP</p>
                          </div>
                        </div>
                        <div className="mb-2 h-3 w-full overflow-hidden rounded-full bg-white/[0.06]">
                          <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" style={{ width: "40%" }} />
                        </div>
                        <div className="flex items-center justify-between text-xs text-white/50">
                          <span>40% to next level</span>
                          <span>180 XP needed</span>
                        </div>
                      </div>

                      {/* Quick Stats */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-4 text-center">
                          <p className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">5</p>
                          <p className="mt-0.5 text-xs text-white/50">Reports Generated</p>
                        </div>
                        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-4 text-center">
                          <p className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">8</p>
                          <p className="mt-0.5 text-xs text-white/50">Quests Completed</p>
                        </div>
                        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <p className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">12</p>
                            <svg className="h-5 w-5 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12.75 2.25c.966 3.767.41 6.65-1.015 8.604C10.49 12.713 8.59 13.63 7.5 14.25c-.08.046-.116.098-.116.16 0 .054.03.099.082.138 1.27.955 3.083 1.42 4.854 1.11 1.17-.205 2.274-.727 3.15-1.508a7.46 7.46 0 0 0 2.39-4.287c.22-1.324.04-2.705-.486-3.942a7.474 7.474 0 0 0-2.636-3.172c-.616-.45-1.298-.795-1.988-1.549ZM8.25 17.25c-.622 0-1.228.076-1.813.222C4.863 17.872 3.75 19.04 3.75 20.25c0 .966.784 1.75 1.75 1.75h13c.966 0 1.75-.784 1.75-1.75 0-1.21-1.113-2.378-2.687-2.778A6.716 6.716 0 0 0 15.75 17.25h-7.5Z" />
                            </svg>
                          </div>
                          <p className="mt-0.5 text-xs text-white/50">Day Streak</p>
                        </div>
                      </div>

                      {/* Active Quests */}
                      <div>
                        <h4 className="mb-3 text-sm font-semibold text-white/90">Active Quests</h4>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-4">
                            <div className="mb-2 flex items-center justify-between">
                              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300">Daily</span>
                              <span className="flex items-center gap-1 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 px-2 py-0.5 text-xs font-bold text-indigo-300">+15 XP</span>
                            </div>
                            <h5 className="mb-1 text-sm font-semibold text-white/90">Morning Reflection</h5>
                            <p className="mb-3 text-xs text-white/50">Write a 3-sentence reflection about your current emotional state.</p>
                            <div className="h-9 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-xs font-semibold text-white shadow-lg shadow-indigo-500/20">Complete Quest</div>
                          </div>
                          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-4">
                            <div className="mb-2 flex items-center justify-between">
                              <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-300">Weekly</span>
                              <span className="flex items-center gap-1 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 px-2 py-0.5 text-xs font-bold text-indigo-300">+30 XP</span>
                            </div>
                            <h5 className="mb-1 text-sm font-semibold text-white/90">Shadow Journal</h5>
                            <p className="mb-3 text-xs text-white/50">Identify one pattern that frustrated you this week and explore its origin.</p>
                            <div className="h-9 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-xs font-semibold text-white shadow-lg shadow-indigo-500/20">Complete Quest</div>
                          </div>
                        </div>
                      </div>

                      {/* Completed notice */}
                      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
                        <p className="text-xs text-emerald-400 font-medium">8 quests completed &mdash; 620 XP earned total</p>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-5">
                      {/* Quick Actions */}
                      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
                        <h4 className="mb-3 text-sm font-semibold text-white/90">Quick Actions</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2.5 rounded-xl border border-indigo-400/20 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 px-3 py-2.5 text-xs font-medium text-indigo-300">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                            </svg>
                            Generate Report
                          </div>
                          <div className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] px-3 py-2.5 text-xs font-medium text-white/90">
                            <svg className="h-4 w-4 text-white/50" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
                            </svg>
                            Start Quest
                          </div>
                          <div className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] px-3 py-2.5 text-xs font-medium text-white/90">
                            <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
                            </svg>
                            Talk to Future You
                          </div>
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-5">
                        <h4 className="mb-3 text-sm font-semibold text-white/90">Badges Earned</h4>
                        <div className="space-y-2.5">
                          {[
                            { name: "First Quest", icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" },
                            { name: "First Report", icon: "M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" },
                            { name: "Self-Aware", icon: "M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" },
                            { name: "Quest Master", icon: "M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" },
                          ].map((badge) => (
                            <div key={badge.name} className="flex items-center gap-2.5">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20">
                                <svg className="h-4 w-4 text-amber-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d={badge.icon} />
                                </svg>
                              </div>
                              <p className="text-xs font-semibold text-white/90">{badge.name}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="mt-6 text-center text-sm text-white/40">
                  This is an example dashboard showing a user mid-way through their journey. Your dashboard starts fresh and grows with you.
                </p>
              </div>
            </section>

            {/* CTA */}
            <section className="px-4 py-24">
              <div
                className="mx-auto max-w-3xl rounded-3xl px-8 py-16 text-center text-white shadow-2xl shadow-indigo-500/10 border border-white/[0.06]"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.15))",
                }}
              >
                <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
                  Ready to discover your future?
                </h2>
                <p className="mx-auto mb-8 max-w-xl text-lg text-white/60">
                  Join thousands already using Destination Future to unlock
                  deeper self-understanding and build a life aligned with who
                  they truly are.
                </p>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5"
                >
                  Get Started Free
                </Link>
              </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/[0.06] px-4 py-8">
              <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
                <p className="text-sm text-white/40">
                  Destination Future. Privacy-first, always.
                </p>
                <div className="flex gap-6 text-sm text-white/40">
                  <a
                    href="#"
                    className="hover:text-indigo-400 transition-colors"
                  >
                    Privacy Policy
                  </a>
                  <a
                    href="#"
                    className="hover:text-indigo-400 transition-colors"
                  >
                    Terms of Service
                  </a>
                  <a
                    href="#"
                    className="hover:text-indigo-400 transition-colors"
                  >
                    Contact
                  </a>
                </div>
              </div>
            </footer>
          </div>
      </div>
    </>
  );
}
