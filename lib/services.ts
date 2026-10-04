import { apiClient } from "@/services/apiClient";

const ROOT = "/api/v1";

// ── Tutor ──────────────────────────────────────────────

export type BackendConversation = {
  id: string;
  user_id: string;
  subject: string | null;
  title: string | null;
  created_at: string;
  updated_at: string;
};

export type BackendMessage = {
  id: string;
  conversation_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
};

export function createConversation(subject?: string) {
  return apiClient.post<BackendConversation>(`${ROOT}/tutor/conversations`, {
    subject,
    title: subject,
  });
}

export function sendTutorMessage(conversationId: string, content: string) {
  return apiClient.post<BackendMessage>(
    `${ROOT}/tutor/conversations/${conversationId}/messages`,
    { content },
  );
}

export function fetchConversations(): Promise<BackendConversation[]> {
  return apiClient.get<BackendConversation[]>(`${ROOT}/tutor/conversations`);
}

export function fetchConversation(conversationId: string): Promise<BackendConversation> {
  return apiClient.get<BackendConversation>(
    `${ROOT}/tutor/conversations/${conversationId}`,
  );
}

export function fetchMessages(conversationId: string): Promise<BackendMessage[]> {
  return apiClient.get<BackendMessage[]>(
    `${ROOT}/tutor/conversations/${conversationId}/messages`,
  );
}

// ── Ask ────────────────────────────────────────────────

export function askQuestion(question: string, subject?: string) {
  return apiClient.post<{ answer: string; sources: string[] }>(
    `${ROOT}/learning/ask`,
    { question, subject },
  );
}

// ── Explain ────────────────────────────────────────────

export function explainTopic(topic: string, style: string, context?: string) {
  return apiClient.post<{ explanation: string; style: string }>(
    `${ROOT}/learning/explain`,
    { topic, style, context },
  );
}

// ── Quiz ───────────────────────────────────────────────

export function generateQuiz(topic: string, numQuestions = 5) {
  return apiClient.post<{
    id: string;
    topic: string;
    questions: { question: string; options: string[]; correct_index: number; explanation: string }[];
  }>(`${ROOT}/quizzes`, { topic, num_questions: numQuestions });
}

export function fetchQuiz(quizId: string) {
  return apiClient.get<{
    id: string;
    topic?: string;
    title?: string;
    questions: { question: string; options: string[]; correct_index: number; explanation: string }[];
  }>(`${ROOT}/quizzes/${encodeURIComponent(quizId)}`);
}

export function submitQuiz(quizId: string, answers: number[]) {
  return apiClient.post<{
    quiz_id: string;
    score: number;
    total: number;
    results: { question: string; user_answer: number; correct_answer: number; is_correct: boolean; explanation: string }[];
  }>(`${ROOT}/learning/quizzes/${quizId}/submit`, { answers });
}

// ── Flashcards ─────────────────────────────────────────

export function generateFlashcards(topic: string, numCards = 10) {
  return apiClient.post<{
    id: string;
    topic: string;
    cards: { front: string; back: string }[];
  }>(`${ROOT}/learning/flashcards`, { topic, num_cards: numCards });
}

// ── Study Plan ─────────────────────────────────────────

export type BackendPlan = {
  id: string;
  user_id: string;
  subject: string;
  topic: string;
  goal: string | null;
  exam_date: string | null;
  total_days: number;
  completed_days: number;
  confidence: string | null;
  hours_per_day: string | null;
  milestones: { day?: number; focus?: string; tasks?: string[] }[];
  daily_tasks: { day: number; focus: string; tasks: string[]; completed: boolean }[];
  status: string;
  created_at: string;
  updated_at: string;
};

export function createPlan(data: {
  subject: string;
  topic: string;
  goal?: string;
  exam_date?: string;
  total_days?: number;
  confidence?: string;
  hours_per_day?: string;
}): Promise<BackendPlan> {
  return apiClient.post<BackendPlan>(`${ROOT}/learning/plans`, data);
}

export function fetchPlans(): Promise<BackendPlan[]> {
  return apiClient.get<BackendPlan[]>(`${ROOT}/learning/plans`);
}

export function fetchPlan(planId: string): Promise<BackendPlan> {
  return apiClient.get<BackendPlan>(`${ROOT}/learning/plans/${planId}`);
}

export function completePlanDay(
  planId: string,
  day: number,
  completed = true,
): Promise<BackendPlan> {
  return apiClient.patch<BackendPlan>(
    `${ROOT}/learning/plans/${planId}/day`,
    { day, completed },
  );
}

// ── Study Sessions ────────────────────────────────────

export function recordStudySession(data: {
  minutes: number;
  preset?: string;
  audio?: string;
}) {
  return apiClient.post<unknown>(`${ROOT}/learning/sessions`, data);
}

// ── Community / Spaces ────────────────────────────────

export type BackendSpace = {
  id: string;
  name: string;
  description: string | null;
  space_type: string;
  school_id: string | null;
  member_count: number;
  created_at: string;
};

export function fetchSpaces(): Promise<BackendSpace[]> {
  return apiClient.get<BackendSpace[]>(`${ROOT}/community/spaces`);
}

export function createSpace(data: {
  name: string;
  description?: string;
  space_type?: string;
}): Promise<BackendSpace> {
  return apiClient.post<BackendSpace>(`${ROOT}/community/spaces`, data);
}

// ── Progress ──────────────────────────────────────────

export type BackendProgress = {
  user_id: string;
  quizzes_taken: number;
  average_score: number;
  flashcards_reviewed: number;
  topics_studied: string[];
  streak_days: number;
};

export function fetchProgress(): Promise<BackendProgress> {
  return apiClient.get<BackendProgress>(`${ROOT}/learning/progress`);
}

// ── Intake / Uploads ─────────────────────────────────

export type BackendUpload = {
  id: string;
  user_id: string;
  file_url: string;
  upload_type: "image" | "pdf" | "text";
  original_filename: string;
  created_at: string;
};

export type BackendScanResult = {
  upload_id: string;
  ocr: { upload_id: string; text: string; confidence: number };
  explanation: string;
};

export type BackendStudyPack = {
  id: string;
  user_id: string;
  upload_id: string;
  title: string;
  summary: string;
  flashcards: { front: string; back: string }[];
  quiz_questions: { question: string; options: string[]; correct_index: number; explanation: string }[];
  created_at: string;
};

export function uploadFile(file: File): Promise<BackendUpload> {
  const formData = new FormData();
  formData.append("file", file);
  return apiClient.post<BackendUpload>(`${ROOT}/intake/uploads`, formData);
}

export function listUploads(): Promise<BackendUpload[]> {
  return apiClient.get<BackendUpload[]>(`${ROOT}/intake/uploads`);
}

export function scanUpload(
  uploadId: string,
  question?: string,
): Promise<BackendScanResult> {
  return apiClient.post<BackendScanResult>(`${ROOT}/intake/scan`, {
    upload_id: uploadId,
    question,
  });
}

export function generateStudyPack(
  uploadId: string,
  title?: string,
): Promise<BackendStudyPack> {
  return apiClient.post<BackendStudyPack>(`${ROOT}/intake/study-pack`, {
    upload_id: uploadId,
    title,
  });
}

export function fetchStudyPack(packId: string): Promise<BackendStudyPack> {
  return apiClient.get<BackendStudyPack>(`${ROOT}/intake/study-pack/${packId}`);
}

// ── Profile ────────────────────────────────────────────

export function getProfile() {
  return apiClient.get<unknown>(`${ROOT}/identity/profile`);
}
