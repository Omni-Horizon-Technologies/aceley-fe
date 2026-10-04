import { apiClient } from "@/services/apiClient";

export type HomeDashboard = {
  active_plan: null | { id: string; title?: string | null; subject?: string | null; exam_name?: string | null; exam_date?: string | null; total_days: number; completed_days: number };
  next_task: null | { id?: string; title?: string; focus?: string; completed?: boolean };
  recenty?: unknown[];
  recent?: unknown[];
  streak_days: number;
};

export function fetchHomeDashboard(): Promise<HomeDashboard> {
  return apiClient.get<HomeDashboard>("/api/v1/home/dashboard");
}
