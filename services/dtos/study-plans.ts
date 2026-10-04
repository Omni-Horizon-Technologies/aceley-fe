export type PlanSourceType = "text" | "file" | "pdf" | "youtu" | "url" | "image" | "scan";

export type PlanSource = {
  type: PlanSourceType;
  ref: string;
  label?: string;
};

export type PlanConfidence = "low" | "medium" | "high";

export type StudyTaskKind = "quiz" | "flashcards" | "revision" | "study" | string;

export type StudyTaskActivitiesStatus = "pending" | "ready" | "failed";

export type StudyTask = {
  id: string;
  title: string;
  done: boolean;
  activities_status: StudyTaskActivitiesStatus;
  kind?: StudyTaskKind;
  quiz_ref_id?: string | null;
  flashcard_deck_ref_id?: string | null;
};

export type StudyPlanDay = {
  /**
   * Backend ships `day` (1-indexed). Older/mobile shapes may use `day_index`;
   * both are tolerated here — the view treats array position as authoritative.
   */
  day?: number;
  day_index?: number;
  date?: string | null;
  focus?: string | null;
  tasks: StudyTask[];
};

export type StudyPlan = {
  id: string;
  user_id?: string;
  subject?: string | null;
  title?: string | null;
  exam_date?: string | null;
  hours_per_day: number;
  confidence: PlanConfidence;
  sources: PlanSource[];
  days: StudyPlanDay[];
  // Optional server-provided summary fields. The view derives these from
  // `days` when the backend omits them.
  total_days?: number;
  completed_days?: number;
  enterable_day_index?: number | null;
  created_at: string;
  updated_at: string;
};

export type CreateStudyPlanRequest = {
  hours_per_day: number;
  confidence: PlanConfidence;
  sources: PlanSource[];
};

export type PatchStudyTaskRequest = {
  done: boolean;
};
