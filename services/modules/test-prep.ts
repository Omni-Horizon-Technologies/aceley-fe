import { apiClient } from "@/services/apiClient";
import type { CreateTestPrepTrackRequest, ReusableTestPrepMaterial, StartTestPrepPracticeResponse, TestPrepExam, TestPrepTrack } from "@/services/dtos/test-prep";

const ROOT = "/api/v1/test-prep";

export const getTestPrepExams = () => apiClient.get<TestPrepExam[]>(`${ROOT}/exams`);
export const getReusableTestPrepMaterials = (params: { examId?: string; customSubject?: string }) =>
  apiClient.get<{ items: ReusableTestPrepMaterial[] }>(`${ROOT}/reusable-materials`, {
    query: params.examId ? { exam_id: params.examId } : { custom_subject: params.customSubject },
  });
export const createTestPrepTrack = (payload: CreateTestPrepTrackRequest) => apiClient.post<TestPrepTrack>(`${ROOT}/tracks`, payload);
export const getTestPrepTracks = () => apiClient.get<TestPrepTrack[]>(`${ROOT}/tracks`);
export const getTestPrepTrack = (id: string) => apiClient.get<TestPrepTrack>(`${ROOT}/tracks/${encodeURIComponent(id)}`);
export const toggleTestPrepTask = (trackId: string, taskId: string) => apiClient.patch<TestPrepTrack>(`${ROOT}/tracks/${encodeURIComponent(trackId)}/tasks/${encodeURIComponent(taskId)}`);
export const startTestPrepPractice = (trackId: string) => apiClient.post<StartTestPrepPracticeResponse>(`${ROOT}/tracks/${encodeURIComponent(trackId)}/practice`);

export async function uploadTestPrepFile(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  const result = await apiClient.post<{ id?: string; file_id?: string }>("/api/v1/files", form);
  const id = result.id ?? result.file_id;
  if (!id) throw new Error("The upload response did not include a file id");
  return id;
}
