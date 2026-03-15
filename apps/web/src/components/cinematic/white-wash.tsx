"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface WhiteWashProps {
  active: boolean;
  onComplete: () => void;
}

type SubPhase = "idle" | "building" | "peak" | "dissolving";

// ---------------------------------------------------------------------------
// Light rays — radial beams emanating from center
// ---------------------------------------------------------------------------

function LightRays() {
  const rays = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        id: i,
        rotation: i * 22.5 + (Math.random() - 0.5) * 8,
        width: Math.random() * 2.5 + 0.8,
        opacity: Math.random() * 0.25 + 0.1,
        delay: Math.random() * 0.4,
        duration: 0.6 + Math.random() * 0.4,
      })),
    []
  );

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
      {rays.map((ray) => (
        <motion.div
          key={ray.id}
          className="absolute"
          style={{
            width: `${ray.width}vw`,
            height: "250vh",
            background: `linear-gradient(
              180deg,
              transparent 0%,
              rgba(255, 255, 255, ${ray.opacity * 0.3}) 20%,
              rgba(255, 255, 255, ${ray.opacity}) 40%,
              rgba(255, 255, 255, ${ray.opacity}) 60%,
              rgba(255, 255, 255, ${ray.opacity * 0.3}) 80%,
              transparent 100%
            )`,
            transform: `rotate(${ray.rotation}deg)`,
            transformOrigin: "center center",
          }}
          initial={{ opacity: 0, scaleY: 0, scaleX: 0.5 }}
          animate={{ opacity: 1, scaleY: 1, scaleX: 1 }}
          transition={{
            duration: ray.duration,
            delay: ray.delay,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Central flash burst — radial gradient bloom
// ---------------------------------------------------------------------------

function FlashBurst() {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{ opacity: [0, 1, 0.9], scale: [0.3, 1.2, 1] }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="rounded-full"
        style={{
          width: "50vmin",
          height: "50vmin",
          background:
            "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0.7) 25%, rgba(255,255,255,0.3) 50%, transparent 75%)",
          filter: "blur(25px)",
        }}
      />
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Outward streak particles — during building phase
// ---------------------------------------------------------------------------

function OutwardStreaks() {
  const particles = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => {
        const angle = (i / 24) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
        const distance = 40 + Math.random() * 30;
        return {
          id: i,
          startX: 50 + Math.cos(angle) * 2,
          startY: 50 + Math.sin(angle) * 2,
          endX: 50 + Math.cos(angle) * distance,
          endY: 50 + Math.sin(angle) * distance,
          size: Math.random() * 3 + 1,
          delay: Math.random() * 0.6,
          duration: 0.5 + Math.random() * 0.4,
        };
      }),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white"
          style={{
            width: p.size,
            height: p.size,
            filter: "blur(0.5px)",
          }}
          initial={{
            left: `${p.startX}%`,
            top: `${p.startY}%`,
            opacity: 0,
            scale: 0,
          }}
          animate={{
            left: `${p.endX}%`,
            top: `${p.endY}%`,
            opacity: [0, 0.9, 0],
            scale: [0, 1.5, 0.5],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Luminous shimmer texture — subtle noise during peak
// ---------------------------------------------------------------------------

function ShimmerTexture() {
  const dots = useMemo(
    () =>
      Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 0.5,
        delay: Math.random() * 0.4,
        duration: 0.3 + Math.random() * 0.3,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Very faint noise grain overlay */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
          mixBlendMode: "overlay",
        }}
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 0.4, repeat: Infinity, ease: "linear" }}
      />

      {/* Shimmer particles */}
      {dots.map((dot) => (
        <motion.div
          key={dot.id}
          className="absolute rounded-full"
          style={{
            width: dot.size,
            height: dot.size,
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            backgroundColor: "rgba(255,255,255,0.9)",
            boxShadow: "0 0 4px rgba(255,255,255,0.5)",
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.7, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: dot.duration,
            delay: dot.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Star emergence — stars appearing through dissolving white
// ---------------------------------------------------------------------------

function StarEmergence() {
  const stars = useMemo(
    () =>
      Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        finalOpacity: Math.random() * 0.5 + 0.15,
        delay: 0.2 + Math.random() * 0.8,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full"
          style={{
            width: star.size,
            height: star.size,
            left: `${star.x}%`,
            top: `${star.y}%`,
            backgroundColor: "rgba(255,255,255,0.8)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: star.finalOpacity }}
          transition={{
            duration: 0.6,
            delay: star.delay,
            ease: "easeIn",
          }}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Ember particles — falling downward during dissolve
// ---------------------------------------------------------------------------

function EmberParticles() {
  const embers = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        startX: 20 + Math.random() * 60,
        startY: 20 + Math.random() * 40,
        drift: (Math.random() - 0.5) * 15,
        size: Math.random() * 3 + 1.5,
        delay: Math.random() * 0.5,
        duration: 0.8 + Math.random() * 0.4,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {embers.map((ember) => (
        <motion.div
          key={ember.id}
          className="absolute rounded-full"
          style={{
            width: ember.size,
            height: ember.size,
            backgroundColor: "rgba(255,240,220,0.8)",
            boxShadow:
              "0 0 6px rgba(255,200,100,0.4), 0 0 12px rgba(255,150,50,0.2)",
            filter: "blur(0.5px)",
          }}
          initial={{
            left: `${ember.startX}%`,
            top: `${ember.startY}%`,
            opacity: 0,
            scale: 1,
          }}
          animate={{
            left: `${ember.startX + ember.drift}%`,
            top: `${ember.startY + 35}%`,
            opacity: [0, 0.8, 0],
            scale: [1, 0.6, 0.2],
          }}
          transition={{
            duration: ember.duration,
            delay: ember.delay,
            ease: "easeIn",
          }}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function WhiteWash({ active, onComplete }: WhiteWashProps) {
  const completeCalled = useRef(false);
  const [subPhase, setSubPhase] = useState<SubPhase>("idle");

  useEffect(() => {
    if (!active) {
      setSubPhase("idle");
      completeCalled.current = false;
      return;
    }

    // Sub-phase 1: Building (0 -> 1.2s)
    setSubPhase("building");

    // Sub-phase 2: Peak (1.2s -> 1.8s)
    const peakTimer = setTimeout(() => {
      setSubPhase("peak");
    }, 1200);

    // Sub-phase 3: Dissolving (1.8s -> 3.0s)
    const dissolveTimer = setTimeout(() => {
      setSubPhase("dissolving");
    }, 1800);

    // Complete (3.0s)
    const completeTimer = setTimeout(() => {
      if (!completeCalled.current) {
        completeCalled.current = true;
        onComplete();
      }
    }, 3000);

    return () => {
      clearTimeout(peakTimer);
      clearTimeout(dissolveTimer);
      clearTimeout(completeTimer);
    };
  }, [active, onComplete]);

  // Background animation based on sub-phase
  const getBgAnimation = useCallback(() => {
    switch (subPhase) {
      case "building":
        return {
          initial: { opacity: 0, backgroundColor: "#ffffff" },
          animate: { opacity: 1, backgroundColor: "#ffffff" },
          transition: {
            duration: 1.2,
            ease: [0.22, 1, 0.36, 1] as const,
          },
        };
      case "peak":
        return {
          animate: { opacity: 1, backgroundColor: "#ffffff" },
          transition: { duration: 0.1 },
        };
      case "dissolving":
        return {
          animate: { opacity: 1, backgroundColor: "#0a0e27" },
          transition: {
            duration: 1.2,
            ease: [0.22, 1, 0.36, 1] as const,
          },
        };
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 0 },
          transition: { duration: 0.1 },
        };
    }
  }, [subPhase]);

  const bgProps = getBgAnimation();

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
          {/* BUILDING: Light rays + flash burst + outward streaks */}
          {subPhase === "building" && (
            <>
              <LightRays />
              <FlashBurst />
              <OutwardStreaks />
            </>
          )}

          {/* PEAK: Luminous shimmer — the white is alive, not flat */}
          {subPhase === "peak" && <ShimmerTexture />}

          {/* DISSOLVING: Stars emerge + ember particles fall */}
          {subPhase === "dissolving" && (
            <>
              <StarEmergence />
              <EmberParticles />

              {/* Dissolving radial wipe from center outward */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(circle at center, transparent 0%, rgba(10,14,39,0.1) 30%, rgba(10,14,39,0.6) 70%, rgba(10,14,39,0.95) 100%)",
                }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1.5 }}
                transition={{
                  duration: 1.2,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
