"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface WhiteWashProps {
  active: boolean;
  onComplete: () => void;
}

// ---------------------------------------------------------------------------
// Light ray component for premium feel
// ---------------------------------------------------------------------------

function LightRays() {
  const rays = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    rotation: (i * 30) + Math.random() * 10,
    width: Math.random() * 3 + 1,
    opacity: Math.random() * 0.3 + 0.1,
    delay: Math.random() * 0.5,
  }));

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
      {rays.map((ray) => (
        <motion.div
          key={ray.id}
          className="absolute"
          style={{
            width: `${ray.width}vw`,
            height: "200vh",
            background: `linear-gradient(180deg, transparent 0%, rgba(255,255,255,${ray.opacity}) 40%, rgba(255,255,255,${ray.opacity}) 60%, transparent 100%)`,
            transform: `rotate(${ray.rotation}deg)`,
            transformOrigin: "center center",
          }}
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          transition={{
            duration: 0.8,
            delay: ray.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Central flash burst
// ---------------------------------------------------------------------------

function FlashBurst() {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0.8] }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div
        className="rounded-full"
        style={{
          width: "40vmin",
          height: "40vmin",
          background:
            "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0.6) 30%, transparent 70%)",
          filter: "blur(20px)",
        }}
      />
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function WhiteWash({ active, onComplete }: WhiteWashProps) {
  const completeCalled = useRef(false);
  const [subPhase, setSubPhase] = useState<
    "flash-in" | "hold" | "fade-to-dark" | "idle"
  >("idle");

  useEffect(() => {
    if (!active) {
      setSubPhase("idle");
      completeCalled.current = false;
      return;
    }

    // Phase 1: Flash to white (0 -> 1.5s)
    setSubPhase("flash-in");

    // Phase 2: Hold at full white (1.5s -> 2.0s)
    const holdTimer = setTimeout(() => {
      setSubPhase("hold");
    }, 1500);

    // Phase 3: Fade to deep space dark (2.0s -> 3.0s)
    const fadeTimer = setTimeout(() => {
      setSubPhase("fade-to-dark");
    }, 2000);

    // Complete: ready for title (3.0s)
    const completeTimer = setTimeout(() => {
      if (!completeCalled.current) {
        completeCalled.current = true;
        onComplete();
      }
    }, 3000);

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [active, onComplete]);

  // Determine background color based on sub-phase
  const getBgVariants = () => {
    switch (subPhase) {
      case "flash-in":
        return {
          initial: { opacity: 0, backgroundColor: "#ffffff" },
          animate: { opacity: 1, backgroundColor: "#ffffff" },
          transition: { duration: 1.5, ease: [0.22, 1, 0.36, 1] },
        };
      case "hold":
        return {
          animate: { opacity: 1, backgroundColor: "#ffffff" },
          transition: { duration: 0.1 },
        };
      case "fade-to-dark":
        return {
          animate: { opacity: 1, backgroundColor: "#0a0e27" },
          transition: { duration: 1.0, ease: [0.22, 1, 0.36, 1] },
        };
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 0 },
          transition: { duration: 0.1 },
        };
    }
  };

  const bgProps = getBgVariants();

  return (
    <AnimatePresence>
      {active && subPhase !== "idle" && (
        <motion.div
          className="fixed inset-0 z-50"
          initial={bgProps.initial}
          animate={bgProps.animate}
          transition={bgProps.transition}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
        >
          {/* Light rays during flash */}
          {subPhase === "flash-in" && <LightRays />}

          {/* Central flash burst */}
          {subPhase === "flash-in" && <FlashBurst />}

          {/* Subtle shimmer particles during hold */}
          {subPhase === "hold" && (
            <div className="absolute inset-0 overflow-hidden">
              {Array.from({ length: 30 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-white"
                  style={{
                    width: Math.random() * 4 + 1,
                    height: Math.random() * 4 + 1,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    opacity: 0,
                  }}
                  animate={{
                    opacity: [0, 0.8, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 0.6,
                    delay: Math.random() * 0.3,
                    ease: "easeOut",
                  }}
                />
              ))}
            </div>
          )}

          {/* Fade-to-dark: subtle star emergence */}
          {subPhase === "fade-to-dark" && (
            <div className="absolute inset-0 overflow-hidden">
              {Array.from({ length: 40 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: Math.random() * 2 + 1,
                    height: Math.random() * 2 + 1,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    backgroundColor: "rgba(255,255,255,0.6)",
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: Math.random() * 0.6 + 0.2 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.3 + Math.random() * 0.7,
                    ease: "easeIn",
                  }}
                />
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
