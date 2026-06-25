"use client";

import { AppStateProvider } from "@/lib/state";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return <AppStateProvider>{children}</AppStateProvider>;
}
