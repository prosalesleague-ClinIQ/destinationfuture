"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TitleRevealProps {
  show: boolean;
  onComplete: () => void;
}

interface ConvergenceParticle {
  id: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  size: number;
  delay: number;
  trailLength: number;
  brightness: number;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PARTICLE_COUNT = 80;
const PHASE_PARTICLE_CONVERGE = 0; // 0 – 1.5s
const PHASE_TITLE_FORM = 1500; // 1.5 – 3s
const PHASE_SECOND_WORD = 3000; // 3 – 4s
const PHASE_ATMOSPHERE = 4000; // 4 – 5s
const PHASE_COMPLETE = 6000; // 5 – 6s

const DESTINATION_LETTERS = "Destination".split("");
const FUTURE_LETTERS = "Future".split("");

// ---------------------------------------------------------------------------
// Film grain overlay
// ---------------------------------------------------------------------------

function FilmGrain() {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-30"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        opacity: 0.35,
        mixBlendMode: "overlay" as const,
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// Anamorphic light streak
// ---------------------------------------------------------------------------

function AnamorphicStreak({ active }: { active: boolean }) {
  return (
    <motion.div
      className="absolute pointer-events-none z-20"
      style={{
        top: "50%",
        left: "-100%",
        width: "300%",
        height: "3px",
        transform: "translateY(-50%)",
        background:
          "linear-gradient(90deg, transparent 0%, rgba(129,140,248,0) 20%, rgba(129,140,248,0.4) 40%, rgba(255,255,255,0.8) 50%, rgba(192,132,252,0.4) 60%, rgba(139,92,246,0) 80%, transparent 100%)",
        filter: "blur(2px)",
        boxShadow: "0 0 30px 8px rgba(129,140,248,0.15)",
      }}
      initial={{ x: "-30%", opacity: 0 }}
      animate={
        active
          ? { x: "30%", opacity: [0, 1, 1, 0] }
          : { x: "-30%", opacity: 0 }
      }
      transition={{ duration: 1.8, delay: 1.6, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}

// ---------------------------------------------------------------------------
// Radial glow behind title
// ---------------------------------------------------------------------------

function TitleGlow({ phase }: { phase: number }) {
  const glowIntensity = phase >= 4000 ? 1 : phase >= 1500 ? 0.6 : 0.2;

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
      animate={{ opacity: glowIntensity }}
      transition={{ duration: 1.5, ease: "easeOut" }}
    >
      {/* Primary indigo-purple glow */}
      <div
        className="absolute rounded-full"
        style={{
          width: "70vw",
          height: "40vh",
          background:
            "radial-gradient(ellipse, rgba(99,102,241,0.18) 0%, rgba(139,92,246,0.1) 30%, rgba(79,70,229,0.04) 60%, transparent 80%)",
          filter: "blur(50px)",
        }}
      />
      {/* Inner bright core */}
      <div
        className="absolute rounded-full"
        style={{
          width: "30vw",
          height: "15vh",
          background:
            "radial-gradient(ellipse, rgba(255,255,255,0.06) 0%, rgba(192,132,252,0.04) 40%, transparent 70%)",
          filter: "blur(30px)",
        }}
      />
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Convergence particle system (Phase 1)
// ---------------------------------------------------------------------------

function ConvergenceParticles({
  particles,
  converging,
  dispersing,
}: {
  particles: ConvergenceParticle[];
  converging: boolean;
  dispersing: boolean;
}) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {particles.map((p) => {
        // When dispersing, move back outward
        const endX = dispersing
          ? p.startX + (p.startX - 50) * 0.6
          : converging
            ? p.targetX
            : p.startX;
        const endY = dispersing
          ? p.startY + (p.startY - 50) * 0.6
          : converging
            ? p.targetY
            : p.startY;
        const endOpacity = dispersing ? 0 : converging ? 0.9 : 0.6;
        const endScale = dispersing ? 0.3 : converging ? 0.4 : 1;

        return (
          <motion.div
            key={p.id}
            className="absolute"
            style={{
              left: `${p.startX}%`,
              top: `${p.startY}%`,
              width: p.size,
              height: p.size,
            }}
            animate={{
              left: `${endX}%`,
              top: `${endY}%`,
              opacity: endOpacity,
              scale: endScale,
            }}
            transition={{
              duration: dispersing ? 2.0 : converging ? 1.4 : 0,
              delay: dispersing ? p.delay * 0.3 : p.delay,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {/* Particle core */}
            <div
              className="rounded-full"
              style={{
                width: "100%",
                height: "100%",
                background: `radial-gradient(circle, rgba(255,255,255,${p.brightness}) 0%, rgba(129,140,248,${p.brightness * 0.5}) 60%, transparent 100%)`,
                boxShadow: `0 0 ${p.size * 2}px ${p.size * 0.5}px rgba(129,140,248,${p.brightness * 0.3})`,
              }}
            />
            {/* Motion trail */}
            {converging && !dispersing && (
              <motion.div
                className="absolute rounded-full"
                style={{
                  width: 2,
                  height: p.trailLength,
                  top: -p.trailLength,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: `linear-gradient(to bottom, transparent 0%, rgba(255,255,255,${p.brightness * 0.2}) 100%)`,
                  transformOrigin: "bottom center",
                }}
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                transition={{ duration: 0.6, delay: p.delay + 0.2 }}
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Letter reveal with flash
// ---------------------------------------------------------------------------

function FlashLetter({
  letter,
  index,
  delayBase,
  gradient,
}: {
  letter: string;
  index: number;
  delayBase: number;
  gradient: string;
}) {
  const delay = delayBase + index * 0.05;

  return (
    <span className="relative inline-block">
      {/* Flash overlay per letter */}
      <motion.span
        className="absolute inset-0 inline-block"
        style={{ color: "white", textShadow: "0 0 30px rgba(255,255,255,0.9)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.3, delay, ease: "easeOut" }}
        aria-hidden="true"
      >
        {letter === " " ? "\u00A0" : letter}
      </motion.span>

      {/* Actual letter */}
      <motion.span
        className={`inline-block ${gradient} bg-clip-text text-transparent`}
        initial={{ opacity: 0, y: 30, filter: "blur(16px)", scale: 1.2 }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
        transition={{
          duration: 0.7,
          delay: delay + 0.08,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {letter === " " ? "\u00A0" : letter}
      </motion.span>
    </span>
  );
}

// ---------------------------------------------------------------------------
// Metallic sheen sweep for "Future"
// ---------------------------------------------------------------------------

function MetallicSheen({ active }: { active: boolean }) {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 5 }}
    >
      <motion.div
        className="absolute"
        style={{
          top: 0,
          left: "-50%",
          width: "40%",
          height: "100%",
          background:
            "linear-gradient(105deg, transparent 0%, rgba(255,255,255,0) 30%, rgba(255,255,255,0.15) 45%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.15) 55%, rgba(255,255,255,0) 70%, transparent 100%)",
          transform: "skewX(-15deg)",
        }}
        initial={{ x: "0%" }}
        animate={active ? { x: "400%" } : { x: "0%" }}
        transition={{ duration: 1.5, delay: 3.3, ease: [0.22, 1, 0.36, 1] }}
      />
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Horizontal accent line
// ---------------------------------------------------------------------------

function AccentLine({ visible }: { visible: boolean }) {
  return (
    <motion.div
      className="mx-auto mt-6 h-[1px]"
      style={{
        background:
          "linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.6) 20%, rgba(192,132,252,0.6) 50%, rgba(139,92,246,0.6) 80%, transparent 100%)",
        maxWidth: "220px",
      }}
      initial={{ scaleX: 0, opacity: 0 }}
      animate={visible ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
      transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function TitleReveal({ show, onComplete }: TitleRevealProps) {
  const completeCalled = useRef(false);
  const [phase, setPhase] = useState(0);

  // Generate convergence particles deterministically on mount
  const convergenceParticles = useMemo<ConvergenceParticle[]>(() => {
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
      // Random start positions across the viewport
      const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
      const radius = 30 + Math.random() * 45;
      const startX = 50 + Math.cos(angle) * radius + (Math.random() - 0.5) * 20;
      const startY = 50 + Math.sin(angle) * radius + (Math.random() - 0.5) * 20;

      // Target: center area where title appears
      const targetX = 50 + (Math.random() - 0.5) * 20;
      const targetY = 48 + (Math.random() - 0.5) * 8;

      return {
        id: i,
        startX: Math.max(2, Math.min(98, startX)),
        startY: Math.max(2, Math.min(98, startY)),
        targetX,
        targetY,
        size: Math.random() * 3 + 2,
        delay: Math.random() * 0.5,
        trailLength: Math.random() * 20 + 10,
        brightness: Math.random() * 0.5 + 0.5,
      };
    });
  }, []);

  // Phase progression timers
  useEffect(() => {
    if (!show || completeCalled.current) return;

    const timers: ReturnType<typeof setTimeout>[] = [];

    // Phase 1: particles converge (immediate)
    setPhase(PHASE_PARTICLE_CONVERGE);

    // Phase 2: title formation
    timers.push(setTimeout(() => setPhase(PHASE_TITLE_FORM), PHASE_TITLE_FORM));

    // Phase 3: second word
    timers.push(setTimeout(() => setPhase(PHASE_SECOND_WORD), PHASE_SECOND_WORD));

    // Phase 4: atmospheric details
    timers.push(setTimeout(() => setPhase(PHASE_ATMOSPHERE), PHASE_ATMOSPHERE));

    // Phase 5: hold & complete
    timers.push(
      setTimeout(() => {
        setPhase(PHASE_COMPLETE);
        if (!completeCalled.current) {
          completeCalled.current = true;
          onComplete();
        }
      }, PHASE_COMPLETE)
    );

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [show, onComplete]);

  const showTitle = phase >= PHASE_TITLE_FORM;
  const showFuture = phase >= PHASE_SECOND_WORD;
  const showAtmosphere = phase >= PHASE_ATMOSPHERE;
  const particlesConverging = phase >= PHASE_PARTICLE_CONVERGE;
  const particlesDispersing = phase >= PHASE_ATMOSPHERE;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
          style={{
            background:
              "radial-gradient(ellipse at center, #0f1338 0%, #0a0e27 50%, #060918 100%)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1.0, ease: "easeInOut" } }}
          transition={{ duration: 0.6 }}
        >
          {/* Film grain texture */}
          <FilmGrain />

          {/* Radial glow behind title */}
          <TitleGlow phase={phase} />

          {/* Convergence particle system */}
          <ConvergenceParticles
            particles={convergenceParticles}
            converging={particlesConverging}
            dispersing={particlesDispersing}
          />

          {/* Anamorphic horizontal light streak */}
          <AnamorphicStreak active={showTitle} />

          {/* Main title block */}
          <div className="relative z-20 text-center px-6">
            {/* "Destination" — letter by letter with flash */}
            <AnimatePresence>
              {showTitle && (
                <motion.div
                  className="overflow-visible"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <h1
                    className="font-bold tracking-tight"
                    style={{
                      fontSize: "clamp(3rem, 8vw, 7rem)",
                      lineHeight: 1.1,
                    }}
                  >
                    {DESTINATION_LETTERS.map((letter, i) => (
                      <FlashLetter
                        key={`d-${i}`}
                        letter={letter}
                        index={i}
                        delayBase={0}
                        gradient="bg-gradient-to-r from-indigo-400 via-purple-400 to-violet-400"
                      />
                    ))}
                  </h1>
                </motion.div>
              )}
            </AnimatePresence>

            {/* "Future" — with metallic sheen sweep */}
            <AnimatePresence>
              {showFuture && (
                <motion.div
                  className="overflow-visible relative -mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <h1
                    className="font-bold tracking-tight relative"
                    style={{
                      fontSize: "clamp(3rem, 8vw, 7rem)",
                      lineHeight: 1.1,
                    }}
                  >
                    {FUTURE_LETTERS.map((letter, i) => (
                      <FlashLetter
                        key={`f-${i}`}
                        letter={letter}
                        index={i}
                        delayBase={0}
                        gradient="bg-gradient-to-r from-slate-200 via-white to-slate-300"
                      />
                    ))}
                    <MetallicSheen active={showFuture} />
                  </h1>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Accent line */}
            <AccentLine visible={showAtmosphere} />

            {/* Tagline */}
            <AnimatePresence>
              {showAtmosphere && (
                <motion.p
                  className="mt-8 text-sm sm:text-base md:text-lg font-light tracking-[0.2em] uppercase"
                  style={{ color: "rgba(203, 213, 225, 0.7)" }}
                  initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    duration: 1.2,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  Your destiny. Your direction. Your future.
                </motion.p>
              )}
            </AnimatePresence>

            {/* Subtle pulsing orb below */}
            <AnimatePresence>
              {showAtmosphere && (
                <motion.div
                  className="mt-12 mx-auto"
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.7)",
                    boxShadow:
                      "0 0 20px 6px rgba(99,102,241,0.3), 0 0 60px 15px rgba(139,92,246,0.1)",
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0.5, 1, 0.5],
                    scale: [0, 1.5, 1, 1.5, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
