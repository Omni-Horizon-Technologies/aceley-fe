import { apiFetch } from "@/lib/api";

export type HomeDashboard = {
  active_plan: null | { id: string; title?: string | null; subject?: string | null; exam_name?: string | null; exam_date?: string | null; total_days: number; completed_days: number };
  next_task: null | { id?: string; title?: string; focus?: string; completed?: boolean };
  recenty?: unknown[];
  recent?: unknown[];
  streak_days: number;
};

export async function fetchHomeDashboard(): Promise<HomeDashboard> {
  const response = await apiFetch("/home/dashboard");
  if (!response.ok) throw new Error("Failed to load dashboard");
  return response.json();
}
