"use client";

import { useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createStudyPlan,
  deleteStudyPlan,
  getStudyPlan,
  listStudyPlans,
  patchStudyTask,
  regenerateStudyPlanActivities,
} from "@/services/modules/study-plans";
import type { StudyPlan, StudyTask } from "@/services/dtos/study-plans";

export const studyPlansKey = ["study-plans"] as const;
export const studyPlanKey = (id: string) => ["study-plans", id] as const;

const AUTO_REGEN_AFTER_MS = 2 * 60 * 1000;

function hasPending(plan: StudyPlan | undefined): boolean {
  if (!plan) return false;
  return plan.days.some((d) => d.tasks.some((t) => t.activities_status === "pending"));
}

function hasFailed(plan: StudyPlan | undefined): boolean {
  if (!plan) return false;
  return plan.days.some((d) => d.tasks.some((t) => t.activities_status === "failed"));
}

export function useListStudyPlans() {
  return useQuery({ queryKey: studyPlansKey, queryFn: listStudyPlans });
}

/**
 * Fetches a plan and polls every 3s while any task is still pending.
 * Automatically fires regenerate-activities when:
 *   - any task is in `failed`, OR
 *   - the plan is older than 2 minutes and still has pending tasks.
 */
export function useStudyPlan(id: string) {
  const query = useQuery({
    queryKey: studyPlanKey(id),
    queryFn: () => getStudyPlan(id),
    enabled: Boolean(id),
    refetchInterval: (q) => (hasPending(q.state.data) ? 3000 : false),
  });

  const regenerate = useRegenerateStudyPlan();
  const regenAttempted = useRef(false);

  useEffect(() => {
    const plan = query.data;
    if (!plan) return;
    if (regenAttempted.current) return;
    if (regenerate.isPending) return;

    const createdAt = new Date(plan.created_at).getTime();
    const ageMs = Date.now() - createdAt;
    const shouldRegen =
      hasFailed(plan) || (hasPending(plan) && ageMs > AUTO_REGEN_AFTER_MS);

    if (shouldRegen) {
      regenAttempted.current = true;
      regenerate.mutate(plan.id);
    }
  }, [query.data, regenerate]);

  return query;
}

export function useCreateStudyPlan() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: createStudyPlan,
    onSuccess: (plan) => {
      client.setQueryData(studyPlanKey(plan.id), plan);
      void client.invalidateQueries({ queryKey: studyPlansKey });
    },
  });
}

export function usePatchStudyTask(planId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (vars: { taskId: string; done: boolean }) =>
      patchStudyTask(planId, vars.taskId, { done: vars.done }),
    onSuccess: (task: StudyTask) => {
      // Patch the task in the cached plan without a full refetch.
      client.setQueryData<StudyPlan | undefined>(studyPlanKey(planId), (prev) => {
        if (!prev) return prev;
        const days = prev.days.map((d) => ({
          ...d,
          tasks: d.tasks.map((t) => (t.id === task.id ? { ...t, ...task } : t)),
        }));
        const completed_days = days.reduce(
          (acc, d) => acc + (d.tasks.length > 0 && d.tasks.every((t) => t.done) ? 1 : 0),
          0,
        );
        return { ...prev, days, completed_days };
      });
    },
  });
}

export function useRegenerateStudyPlan() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: regenerateStudyPlanActivities,
    onSuccess: (plan) => {
      client.setQueryData(studyPlanKey(plan.id), plan);
    },
  });
}

export function useDeleteStudyPlan() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: deleteStudyPlan,
    onSuccess: (_, id) => {
      client.removeQueries({ queryKey: studyPlanKey(id) });
      void client.invalidateQueries({ queryKey: studyPlansKey });
    },
  });
}
