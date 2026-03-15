"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useAnimate, stagger } from "framer-motion";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TitleRevealProps {
  show: boolean;
  onComplete: () => void;
}

// ---------------------------------------------------------------------------
// Particle dust background
// ---------------------------------------------------------------------------

function ParticleDust() {
  const particles = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 8 + 6,
    delay: Math.random() * 4,
    opacity: Math.random() * 0.4 + 0.1,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, rgba(255,255,255,${p.opacity}) 0%, transparent 70%)`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0, p.opacity, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Letter-by-letter animation component
// ---------------------------------------------------------------------------

function AnimatedWord({
  text,
  className,
  delayOffset = 0,
}: {
  text: string;
  className?: string;
  delayOffset?: number;
}) {
  const letters = text.split("");

  return (
    <span className={className} aria-label={text}>
      {letters.map((letter, i) => (
        <motion.span
          key={`${letter}-${i}`}
          className="inline-block"
          initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.6,
            delay: delayOffset + i * 0.05,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Glow backdrop behind text
// ---------------------------------------------------------------------------

function TextGlow() {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2, delay: 0.3 }}
    >
      {/* Primary glow */}
      <div
        className="absolute rounded-full"
        style={{
          width: "60vw",
          height: "30vh",
          background:
            "radial-gradient(ellipse, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.08) 40%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      {/* Secondary warm glow */}
      <div
        className="absolute rounded-full"
        style={{
          width: "40vw",
          height: "20vh",
          background:
            "radial-gradient(ellipse, rgba(251, 191, 36, 0.08) 0%, transparent 60%)",
          filter: "blur(60px)",
        }}
      />
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Horizontal accent line
// ---------------------------------------------------------------------------

function AccentLine({ delay }: { delay: number }) {
  return (
    <motion.div
      className="mx-auto mt-6 h-px"
      style={{
        background:
          "linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.5) 30%, rgba(251,191,36,0.5) 70%, transparent 100%)",
        maxWidth: "280px",
      }}
      initial={{ scaleX: 0, opacity: 0 }}
      animate={{ scaleX: 1, opacity: 1 }}
      transition={{ duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function TitleReveal({ show, onComplete }: TitleRevealProps) {
  const completeCalled = useRef(false);

  useEffect(() => {
    if (!show || completeCalled.current) return;

    // Total animation: letters ~1.2s + hold 2s => call onComplete at ~3.5s
    const timer = setTimeout(() => {
      if (!completeCalled.current) {
        completeCalled.current = true;
        onComplete();
      }
    }, 4500);

    return () => clearTimeout(timer);
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
          style={{ background: "#0a0e27" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Particle dust */}
          <ParticleDust />

          {/* Glow behind text */}
          <TextGlow />

          {/* Main title block */}
          <div className="relative z-10 text-center px-6">
            {/* "Destination" in gradient */}
            <motion.div
              className="overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h1
                className="font-bold tracking-tight"
                style={{
                  fontSize: "clamp(2.5rem, 8vw, 7rem)",
                  lineHeight: 1.1,
                }}
              >
                <AnimatedWord
                  text="Destination"
                  className="bg-gradient-to-r from-indigo-400 via-purple-400 to-amber-400 bg-clip-text text-transparent"
                  delayOffset={0.3}
                />
              </h1>
            </motion.div>

            {/* "Future" in silver/white */}
            <motion.div
              className="overflow-hidden -mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <h1
                className="font-bold tracking-tight"
                style={{
                  fontSize: "clamp(2.5rem, 8vw, 7rem)",
                  lineHeight: 1.1,
                }}
              >
                <AnimatedWord
                  text="Future"
                  className="bg-gradient-to-r from-slate-200 via-white to-slate-300 bg-clip-text text-transparent"
                  delayOffset={0.9}
                />
              </h1>
            </motion.div>

            {/* Accent line */}
            <AccentLine delay={1.6} />

            {/* Tagline */}
            <motion.p
              className="mt-8 text-sm sm:text-base md:text-lg font-light tracking-[0.2em] uppercase"
              style={{
                color: "rgba(203, 213, 225, 0.7)",
              }}
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                duration: 1,
                delay: 2,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              Your destiny. Your direction. Your future.
            </motion.p>

            {/* Subtle bottom shimmer */}
            <motion.div
              className="mt-12 mx-auto"
              style={{
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.6)",
                boxShadow: "0 0 20px 4px rgba(99,102,241,0.3)",
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0.5, 1.5, 0.5],
              }}
              transition={{
                duration: 3,
                delay: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
