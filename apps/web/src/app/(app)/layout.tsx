"use client";

import dynamic from "next/dynamic";
import Navbar from "@/components/shared/navbar";

const SymbolicBackground = dynamic(
  () => import("@/components/cinematic/symbolic-background"),
  { ssr: false }
);

const FutureYouFab = dynamic(
  () => import("@/components/future-you/future-you-fab"),
  { ssr: false }
);

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[#0a0e27] text-white">
      {/* Living symbolic background */}
      <SymbolicBackground opacity={0.5} />

      {/* Vignette overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[1]"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)",
        }}
      />

      {/* Top gradient for navbar blending */}
      <div
        className="fixed top-0 left-0 right-0 h-24 pointer-events-none z-[2]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,14,39,0.9) 0%, transparent 100%)",
        }}
      />

      {/* Navbar */}
      <div className="relative z-50">
        <Navbar />
      </div>

      {/* Page content */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Future You floating button */}
      <FutureYouFab />
    </div>
  );
}
