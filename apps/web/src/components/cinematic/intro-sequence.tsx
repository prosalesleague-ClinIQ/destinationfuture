"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import WhiteWash from "./white-wash";
import TitleReveal from "./title-reveal";

// Dynamic import globe to avoid SSR issues with Three.js / WebGL
const GlobeScene = dynamic(() => import("./globe-scene"), {
  ssr: false,
  loading: () => (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ background: "#0a0e27" }}
    >
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative h-12 w-12">
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-indigo-500/30"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-1 rounded-full border-2 border-t-transparent border-indigo-400"
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        </div>
        <p className="text-xs tracking-[0.3em] uppercase text-slate-400">
          Loading experience
        </p>
      </motion.div>
    </div>
  ),
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type IntroPhase =
  | "globe-spinning"
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

// Map our IntroPhase to GlobeScene phase
function toGlobePhase(
  phase: IntroPhase
): "spinning" | "slowing" | "stopped" | "zooming" | "done" {
  switch (phase) {
    case "globe-spinning":
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
// "Tap to begin" prompt
// ---------------------------------------------------------------------------

function TapPrompt({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-12 left-0 right-0 z-30 flex flex-col items-center gap-3 pointer-events-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          {/* Pulsing ring */}
          <motion.div
            className="relative flex items-center justify-center"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="h-14 w-14 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-sm bg-white/5">
              <motion.svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-white/70"
                animate={{ y: [0, -2, 0] }}
                transition={{
                  duration: 1.5,
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

            {/* Expanding ring animation */}
            <motion.div
              className="absolute inset-0 rounded-full border border-white/10"
              animate={{
                scale: [1, 2],
                opacity: [0.3, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          </motion.div>

          <p className="text-xs tracking-[0.25em] uppercase text-white/50 font-light">
            Click the globe to begin
          </p>
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
          className="fixed top-6 right-6 z-50 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium tracking-wider uppercase text-white/50 backdrop-blur-md transition-colors hover:bg-white/10 hover:text-white/80"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.4, delay: 2 }}
        >
          Skip Intro
          <svg
            width="14"
            height="14"
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
// Phase indicator dots (subtle, bottom left)
// ---------------------------------------------------------------------------

function PhaseIndicator({ phase }: { phase: IntroPhase }) {
  const phases: IntroPhase[] = [
    "globe-spinning",
    "globe-slowing",
    "globe-stopped",
    "globe-zooming",
    "white-wash",
    "title-reveal",
  ];
  const currentIndex = phases.indexOf(phase);

  return (
    <motion.div
      className="fixed bottom-6 left-6 z-30 flex items-center gap-1.5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.4 }}
      transition={{ delay: 2 }}
    >
      {phases.map((_, i) => (
        <div
          key={i}
          className="h-1 rounded-full transition-all duration-500"
          style={{
            width: i <= currentIndex ? 12 : 6,
            backgroundColor:
              i <= currentIndex
                ? "rgba(255,255,255,0.6)"
                : "rgba(255,255,255,0.15)",
          }}
        />
      ))}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function IntroSequence({ onComplete }: IntroSequenceProps) {
  const [phase, setPhase] = useState<IntroPhase>("globe-spinning");
  const autoAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const completeCalled = useRef(false);

  // Auto-advance from spinning to slowing after 4 seconds
  useEffect(() => {
    if (phase === "globe-spinning") {
      autoAdvanceRef.current = setTimeout(() => {
        setPhase("globe-slowing");
      }, 4000);

      return () => {
        if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
      };
    }
  }, [phase]);

  // Handle user click/tap to trigger slowing early
  const handleGlobeClick = useCallback(() => {
    if (phase === "globe-spinning") {
      if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
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
        // Globe fade done (not used as primary driver)
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
    // Fade out everything, then complete
    setTimeout(() => {
      setPhase("complete");
      if (!completeCalled.current) {
        completeCalled.current = true;
        onComplete();
      }
    }, 1200);
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

  // Determine what to show
  const showGlobe =
    phase === "globe-spinning" ||
    phase === "globe-slowing" ||
    phase === "globe-stopped" ||
    phase === "globe-zooming" ||
    phase === "white-wash";

  const showWhiteWash = phase === "white-wash";
  const showTitle = phase === "title-reveal" || phase === "transition-out";
  const showSkip = phase !== "complete" && phase !== "transition-out";
  const showTapPrompt = phase === "globe-spinning";

  if (phase === "complete") return null;

  return (
    <motion.div
      className="fixed inset-0 z-40"
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === "transition-out" ? 0 : 1 }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
    >
      {/* Globe scene */}
      <AnimatePresence>
        {showGlobe && (
          <motion.div
            className="absolute inset-0"
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            onClick={handleGlobeClick}
            style={{ cursor: phase === "globe-spinning" ? "pointer" : "default" }}
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

      {/* Tap to begin prompt */}
      <TapPrompt visible={showTapPrompt} />

      {/* Phase indicator */}
      <PhaseIndicator phase={phase} />

      {/* Skip button */}
      <SkipButton visible={showSkip} onSkip={handleSkip} />
    </motion.div>
  );
}
