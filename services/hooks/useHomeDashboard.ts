"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchHomeDashboard } from "@/services/modules/home";

export const homeDashboardQueryKey = ["home", "dashboard"] as const;

export function useHomeDashboard() {
  return useQuery({ queryKey: homeDashboardQueryKey, queryFn: fetchHomeDashboard, staleTime: 30_000 });
}
