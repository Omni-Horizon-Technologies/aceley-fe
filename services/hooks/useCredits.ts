"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { getCredits } from "@/services/modules/credits";
import { useAuthStore } from "@/services/context/auth";
import type { CreditsSnapshot } from "@/services/dtos/credits";

export const CREDITS_QUERY_KEY = ["me", "credits"] as const;

export function useCredits() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const qc = useQueryClient();

  const query = useQuery<CreditsSnapshot>({
    queryKey: CREDITS_QUERY_KEY,
    queryFn: getCredits,
    enabled: hasHydrated && isAuthenticated,
    // Never zero the balance from a transient 5xx.
    placeholderData: (prev) => prev,
    staleTime: 30_000,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onFocus = () => {
      if (document.visibilityState === "visible") {
        qc.invalidateQueries({ queryKey: CREDITS_QUERY_KEY });
      }
    };
    document.addEventListener("visibilitychange", onFocus);
    return () => document.removeEventListener("visibilitychange", onFocus);
  }, [qc]);

  return query;
}

export function invalidateCredits(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: CREDITS_QUERY_KEY });
}
