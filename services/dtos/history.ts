export type HistoryType = "quizzes" | "flashcards";

export type HistoryStatus =
  | "in_progress"
  | "completed"
  | "failed"
  | "ready"
  | string;

export type HistoryItem = {
  id: string;
  type: HistoryType;
  title: string;
  subtitle?: string | null;
  ref_id: string | null;
  attempt_id?: string | null;
  session_id?: string | null;
  status: HistoryStatus;
  is_favorite?: boolean;
  category?: string | null;
  created_at: string;
};

export type QuizDetail = {
  id: string;
  title?: string | null;
  name?: string | null;
  category?: string | null;
  is_private?: boolean;
  spaced_repetitions?: boolean;
  exam_date?: string | null;
};

export type FlashcardDeckDetail = {
  id: string;
  title?: string | null;
  name?: string | null;
};

export type UpdateQuizRequest = {
  name?: string;
  category?: string | null;
  is_private?: boolean;
  spaced_repetitions?: boolean;
  exam_date?: string | null;
};
