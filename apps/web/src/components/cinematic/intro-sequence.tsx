"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import WhiteWash from "./white-wash";
import TitleReveal from "./title-reveal";

// ---------------------------------------------------------------------------
// Dynamic import — SSR-safe Three.js loading
// ---------------------------------------------------------------------------

const GlobeScene = dynamic(() => import("./globe-scene"), {
  ssr: false,
  loading: () => (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ background: "#050810" }}
    >
      <motion.div
        className="flex flex-col items-center gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Orbital spinner */}
        <div className="relative h-16 w-16">
          <motion.div
            className="absolute inset-0 rounded-full border border-indigo-500/20"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-1.5 rounded-full border border-violet-400/30"
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-3 rounded-full border border-t-transparent border-indigo-400/60"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          />
          {/* Center dot */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-indigo-400/80"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        {/* Loading text */}
        <div className="flex items-center gap-1.5">
          <p className="text-[10px] tracking-[0.35em] uppercase text-slate-500 font-light">
            Loading experience
          </p>
          <motion.span
            className="text-slate-500"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            ...
          </motion.span>
        </div>
      </motion.div>
    </div>
  ),
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type IntroPhase =
  | "prelude"
  | "globe-reveal"
  | "awaiting-touch"
  | "globe-slowing"
  | "globe-stopped"
  | "globe-zooming"
  | "white-wash"
  | "title-reveal"
  | "transition-out"
  | "complete";

interface IntroSequenceProps {
  onComplete: () => void;
}

// Map IntroPhase to GlobeScene phase
function toGlobePhase(
  phase: IntroPhase
): "spinning" | "slowing" | "stopped" | "zooming" | "done" {
  switch (phase) {
    case "globe-reveal":
    case "awaiting-touch":
      return "spinning";
    case "globe-slowing":
      return "slowing";
    case "globe-stopped":
      return "stopped";
    case "globe-zooming":
      return "zooming";
    case "white-wash":
      return "done";
    default:
      return "done";
  }
}

// ---------------------------------------------------------------------------
// Prelude — deep space atmospheric anticipation
// ---------------------------------------------------------------------------

function Prelude({ active }: { active: boolean }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="fixed inset-0 z-20"
          style={{ background: "#050810" }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        >
          {/* Subtle nebula haze */}
          <motion.div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 30% 40%, rgba(79,70,229,0.06) 0%, transparent 70%), " +
                "radial-gradient(ellipse 50% 60% at 70% 60%, rgba(124,58,237,0.04) 0%, transparent 70%)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
          />

          {/* Dense star-like particles */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 300 }).map((_, i) => {
              const isBright = i % 30 === 0;
              const size = isBright ? 2.5 : i % 8 === 0 ? 1.8 : 0.8 + (i % 5) * 0.2;
              return (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-white"
                  style={{
                    width: size,
                    height: size,
                    left: `${(i * 37.7 + i * i * 0.13) % 100}%`,
                    top: `${(i * 53.3 + i * i * 0.07) % 100}%`,
                    boxShadow: isBright ? '0 0 6px 2px rgba(255,255,255,0.4)' : 'none',
                  }}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0, isBright ? 0.7 : (i * 17 % 40 + 5) / 100, 0],
                  }}
                  transition={{
                    duration: 2 + (i % 4),
                    repeat: Infinity,
                    delay: (i * 0.3) % 3,
                    ease: "easeInOut",
                  }}
                />
              );
            })}
          </div>

          {/* Nebula haze layers */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute -left-[10%] top-[20%] h-[400px] w-[600px] rounded-full blur-[100px]"
              style={{ background: "radial-gradient(ellipse, rgba(88,28,135,0.15), transparent 70%)" }}
              animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute right-[5%] bottom-[15%] h-[350px] w-[500px] rounded-full blur-[90px]"
              style={{ background: "radial-gradient(ellipse, rgba(79,70,229,0.12), transparent 70%)" }}
              animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.08, 1] }}
              transition={{ duration: 6, delay: 1, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          {/* Atmospheric breathing glow at center */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: "40vmin",
              height: "40vmin",
              background:
                "radial-gradient(circle, rgba(79,70,229,0.08) 0%, transparent 60%)",
              filter: "blur(40px)",
            }}
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// "Touch the globe" prompt
// ---------------------------------------------------------------------------

function TouchPrompt({
  visible,
  onAutoAdvance,
}: {
  visible: boolean;
  onAutoAdvance: () => void;
}) {
  const autoRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (visible) {
      autoRef.current = setTimeout(onAutoAdvance, 5000);
      return () => {
        if (autoRef.current) clearTimeout(autoRef.current);
      };
    }
  }, [visible, onAutoAdvance]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-14 left-0 right-0 z-30 flex flex-col items-center gap-4 pointer-events-none"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
        >
          {/* Pulsing ring with cursor icon */}
          <motion.div
            className="relative flex items-center justify-center"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="h-16 w-16 rounded-full border border-white/15 flex items-center justify-center backdrop-blur-sm bg-white/[0.03]">
              <motion.svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-white/60"
                animate={{ y: [0, -3, 0] }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59"
                />
              </motion.svg>
            </div>

            {/* Expanding ring 1 */}
            <motion.div
              className="absolute inset-0 rounded-full border border-white/10"
              animate={{
                scale: [1, 2.2],
                opacity: [0.25, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
            {/* Expanding ring 2 (offset) */}
            <motion.div
              className="absolute inset-0 rounded-full border border-white/8"
              animate={{
                scale: [1, 2.5],
                opacity: [0.15, 0],
              }}
              transition={{
                duration: 2.5,
                delay: 0.8,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          </motion.div>

          <motion.p
            className="text-[11px] tracking-[0.3em] uppercase text-white/40 font-light"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            Touch the globe
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// Skip button
// ---------------------------------------------------------------------------

function SkipButton({
  visible,
  onSkip,
}: {
  visible: boolean;
  onSkip: () => void;
}) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={onSkip}
          className="fixed top-6 right-6 z-50 flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-4 py-2 text-[10px] font-medium tracking-[0.2em] uppercase text-white/40 backdrop-blur-md transition-all duration-300 hover:bg-white/[0.08] hover:text-white/80 hover:border-white/15"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.5, delay: 2.5 }}
        >
          Skip
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
            />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// Phase indicator dots
// ---------------------------------------------------------------------------

function PhaseIndicator({ phase }: { phase: IntroPhase }) {
  const phases: IntroPhase[] = [
    "prelude",
    "globe-reveal",
    "awaiting-touch",
    "globe-slowing",
    "globe-stopped",
    "globe-zooming",
    "white-wash",
    "title-reveal",
    "transition-out",
  ];
  const currentIndex = phases.indexOf(phase);

  return (
    <motion.div
      className="fixed bottom-6 left-6 z-30 flex items-center gap-1.5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.35 }}
      transition={{ delay: 3, duration: 1 }}
    >
      {phases.map((_, i) => (
        <motion.div
          key={i}
          className="rounded-full transition-all duration-700"
          style={{
            height: 3,
            width: i <= currentIndex ? 14 : 5,
            backgroundColor:
              i <= currentIndex
                ? "rgba(255,255,255,0.5)"
                : "rgba(255,255,255,0.1)",
          }}
          layout
        />
      ))}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Watermark during prelude
// ---------------------------------------------------------------------------

function PreludeWatermark({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-8 left-0 right-0 z-20 flex justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.08 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
        >
          <p className="text-[10px] tracking-[0.5em] uppercase text-white font-light">
            Destination Future
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// Deep space background with nebula hazes
// ---------------------------------------------------------------------------

function SpaceBackground({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-0"
          style={{
            background: `
              #050810
            `,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          {/* Rich nebula haze layers */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 50% at 25% 35%, rgba(79,70,229,0.1) 0%, transparent 55%), " +
                "radial-gradient(ellipse 50% 70% at 75% 65%, rgba(124,58,237,0.08) 0%, transparent 55%), " +
                "radial-gradient(ellipse 80% 40% at 50% 80%, rgba(30,27,75,0.12) 0%, transparent 45%), " +
                "radial-gradient(ellipse 60% 60% at 60% 30%, rgba(88,28,135,0.06) 0%, transparent 50%), " +
                "radial-gradient(ellipse 40% 50% at 15% 70%, rgba(139,92,246,0.05) 0%, transparent 50%)",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function IntroSequence({ onComplete }: IntroSequenceProps) {
  const [phase, setPhase] = useState<IntroPhase>("prelude");
  const autoAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const completeCalled = useRef(false);

  // --- Phase timing ---

  // Prelude -> globe-reveal after 2s
  useEffect(() => {
    if (phase === "prelude") {
      autoAdvanceRef.current = setTimeout(() => {
        setPhase("globe-reveal");
      }, 2000);
      return () => {
        if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
      };
    }
  }, [phase]);

  // Globe-reveal -> awaiting-touch after 3s
  useEffect(() => {
    if (phase === "globe-reveal") {
      const timer = setTimeout(() => {
        setPhase("awaiting-touch");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  // Handle user click/tap on globe to trigger slowing
  const handleGlobeClick = useCallback(() => {
    if (phase === "awaiting-touch" || phase === "globe-reveal") {
      setPhase("globe-slowing");
    }
  }, [phase]);

  // Auto-advance from awaiting-touch (called by TouchPrompt after 5s)
  const handleAutoAdvance = useCallback(() => {
    if (phase === "awaiting-touch") {
      setPhase("globe-slowing");
    }
  }, [phase]);

  // Handle globe phase completions
  const handleGlobePhaseComplete = useCallback((completedPhase: string) => {
    switch (completedPhase) {
      case "slowing":
        setPhase("globe-stopped");
        // Hold stopped for 1.5s then zoom
        setTimeout(() => setPhase("globe-zooming"), 1500);
        break;
      case "zooming":
        setPhase("white-wash");
        break;
      case "done":
        break;
    }
  }, []);

  // Handle white wash completion
  const handleWhiteWashComplete = useCallback(() => {
    setPhase("title-reveal");
  }, []);

  // Handle title reveal completion
  const handleTitleComplete = useCallback(() => {
    setPhase("transition-out");
    setTimeout(() => {
      setPhase("complete");
      if (!completeCalled.current) {
        completeCalled.current = true;
        onComplete();
      }
    }, 1500);
  }, [onComplete]);

  // Skip handler
  const handleSkip = useCallback(() => {
    if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    setPhase("complete");
    if (!completeCalled.current) {
      completeCalled.current = true;
      onComplete();
    }
  }, [onComplete]);

  // Determine visibility
  const showGlobe =
    phase === "globe-reveal" ||
    phase === "awaiting-touch" ||
    phase === "globe-slowing" ||
    phase === "globe-stopped" ||
    phase === "globe-zooming" ||
    phase === "white-wash";

  const showWhiteWash = phase === "white-wash";
  const showTitle = phase === "title-reveal" || phase === "transition-out";
  const showSkip = phase !== "complete" && phase !== "transition-out";
  const showTouchPrompt = phase === "awaiting-touch";
  const showPrelude = phase === "prelude";
  const showSpaceBg =
    phase !== "complete" &&
    phase !== "white-wash" &&
    phase !== "title-reveal" &&
    phase !== "transition-out";

  if (phase === "complete") return null;

  return (
    <motion.div
      className="fixed inset-0 z-40"
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === "transition-out" ? 0 : 1 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
    >
      {/* Deep space background */}
      <SpaceBackground visible={showSpaceBg} />

      {/* Prelude — atmospheric anticipation */}
      <Prelude active={showPrelude} />

      {/* Prelude watermark */}
      <PreludeWatermark visible={showPrelude} />

      {/* Globe scene */}
      <AnimatePresence>
        {showGlobe && (
          <motion.div
            className="absolute inset-0 z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.6 } }}
            transition={{ duration: 2, ease: "easeOut" }}
            onClick={handleGlobeClick}
            style={{
              cursor:
                phase === "awaiting-touch" || phase === "globe-reveal"
                  ? "pointer"
                  : "default",
            }}
          >
            <GlobeScene
              phase={toGlobePhase(phase)}
              onPhaseComplete={handleGlobePhaseComplete}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* White wash overlay */}
      <WhiteWash active={showWhiteWash} onComplete={handleWhiteWashComplete} />

      {/* Title reveal */}
      <TitleReveal show={showTitle} onComplete={handleTitleComplete} />

      {/* Touch prompt */}
      <TouchPrompt
        visible={showTouchPrompt}
        onAutoAdvance={handleAutoAdvance}
      />

      {/* Phase indicator */}
      <PhaseIndicator phase={phase} />

      {/* Skip button */}
      <SkipButton visible={showSkip} onSkip={handleSkip} />
    </motion.div>
  );
}
