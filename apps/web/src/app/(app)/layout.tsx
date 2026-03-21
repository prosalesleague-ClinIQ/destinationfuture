"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Navbar from "@/components/shared/navbar";
import { db } from "@/lib/db";

const SymbolicBackground = dynamic(
  () => import("@/components/cinematic/symbolic-background"),
  { ssr: false }
);

const FutureYouFab = dynamic(
  () => import("@/components/future-you/future-you-fab"),
  { ssr: false }
);

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    (async () => {
      const authed = await db.isAuthenticated();
      if (!authed) {
        router.replace("/login");
        return;
      }
      const intakeDone = await db.isIntakeComplete();
      if (!intakeDone) {
        router.replace("/intake");
        return;
      }
      setChecked(true);
    })();
  }, [router]);

  if (!checked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0e27]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0a0e27] text-white">
      <SymbolicBackground opacity={0.5} />
      <div
        className="fixed inset-0 pointer-events-none z-[1]"
        style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)" }}
      />
      <div
        className="fixed top-0 left-0 right-0 h-24 pointer-events-none z-[2]"
        style={{ background: "linear-gradient(to bottom, rgba(10,14,39,0.9) 0%, transparent 100%)" }}
      />
      <div className="relative z-50">
        <Navbar />
      </div>
      <main className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
      <FutureYouFab />
    </div>
  );
}
