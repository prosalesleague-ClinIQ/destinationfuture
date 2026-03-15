"use client";

import SymbolicBackground from "./symbolic-background";

interface CinematicDashboardShellProps {
  children: React.ReactNode;
}

export default function CinematicDashboardShell({
  children,
}: CinematicDashboardShellProps) {
  return (
    <div className="relative min-h-screen bg-[#0a0e27] text-white">
      {/* Animated symbolic background */}
      <SymbolicBackground opacity={0.6} />

      {/* Vignette overlay — darker at edges for cinematic depth */}
      <div
        className="fixed inset-0 pointer-events-none z-[1]"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)",
        }}
      />

      {/* Subtle top gradient for navbar blending */}
      <div
        className="fixed inset-x-0 top-0 h-32 pointer-events-none z-[2]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,14,39,0.8) 0%, transparent 100%)",
        }}
      />

      {/* Content layer */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
