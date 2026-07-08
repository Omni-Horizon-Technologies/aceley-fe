"use client";

import type { ReactNode } from "react";
import { useAppState } from "@/lib/state";

export function HydrationGate({ children }: { children: ReactNode }) {
  const { hydrated } = useAppState();

  if (!hydrated) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#F8FAFC] px-4 text-[#1E1B4B]">
        <div className="h-12 w-12 animate-pulse rounded-lg bg-[#FACC15]" />
      </main>
    );
  }

  return children;
}
