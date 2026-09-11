export type TestPrepMaterialType = "url" | "pdf" | "scan" | "text" | "youtu" | "photo";
export type TestPrepMaterial = { type: TestPrepMaterialType; ref: string; label?: string };
export type TestPrepExam = { id: string; name: string; region: string; description: string };
export type ReusableTestPrepMaterial = {
  id?: string; label?: string; type?: TestPrepMaterialType; used_at?: string; track_count?: number;
  material: TestPrepMaterial;
};
export type TestPrepTask = {
  id: string; title: string; kind: "quiz" | "study" | "revision" | string; done?: boolean; completed?: boolean;
};
export type TestPrepTrackDay = { id?: string; date?: string; tasks?: TestPrepTask[] };
export type TestPrepTrack = {
  id: string; title: string; exam_name: string; exam_date: string; materials: TestPrepMaterial[];
  days: TestPrepTrackDay[]; today_tasks: TestPrepTask[]; readiness: number;
};
export type CreateTestPrepTrackRequest = {
  exam_id?: string; custom_subject?: string; exam_date: string; materials: TestPrepMaterial[];
};
export type StartTestPrepPracticeResponse = { quiz_id: string; attempt_id: string };
