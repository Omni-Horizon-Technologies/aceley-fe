import { apiClient } from "@/services/apiClient";
import type {
  CreateStudyPlanRequest,
  PatchStudyTaskRequest,
  StudyPlan,
  StudyTask,
} from "@/services/dtos/study-plans";

const ROOT = "/api/v1/study-plans";

function newIdempotencyKey(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

export function createStudyPlan(payload: CreateStudyPlanRequest): Promise<StudyPlan> {
  return apiClient.post<StudyPlan>(ROOT, payload, {
    headers: { "Idempotency-Key": newIdempotencyKey() },
  });
}

export function getStudyPlan(id: string): Promise<StudyPlan> {
  return apiClient.get<StudyPlan>(`${ROOT}/${encodeURIComponent(id)}`);
}

export function listStudyPlans(): Promise<StudyPlan[]> {
  return apiClient.get<StudyPlan[]>(ROOT);
}

export function patchStudyTask(
  planId: string,
  taskId: string,
  body: PatchStudyTaskRequest,
): Promise<StudyTask> {
  return apiClient.patch<StudyTask>(
    `${ROOT}/${encodeURIComponent(planId)}/tasks/${encodeURIComponent(taskId)}`,
    body,
  );
}

export function regenerateStudyPlanActivities(id: string): Promise<StudyPlan> {
  return apiClient.post<StudyPlan>(
    `${ROOT}/${encodeURIComponent(id)}/regenerate-activities`,
  );
}

export function deleteStudyPlan(id: string): Promise<void> {
  return apiClient.delete<void>(`${ROOT}/${encodeURIComponent(id)}`, {
    parseAs: "none",
  });
}

export async function uploadPlanSourceFile(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  const result = await apiClient.post<{ id?: string; file_id?: string }>(
    "/api/v1/files",
    form,
  );
  const id = result.id ?? result.file_id;
  if (!id) throw new Error("Upload response did not include a file id");
  return id;
}
