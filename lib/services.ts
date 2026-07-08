/**
 * Backend API service functions.
 * Each function calls the real backend and returns typed data.
 */
import { apiFetch } from "@/lib/api";

// ── Tutor ──────────────────────────────────────────────

export async function createConversation(subject?: string) {
  const res = await apiFetch("/tutor/conversations", {
    method: "POST",
    body: JSON.stringify({ subject, title: subject }),
  });
  if (!res.ok) throw new Error("Failed to create conversation");
  return res.json();
}

export async function sendTutorMessage(conversationId: string, content: string) {
  const res = await apiFetch(`/tutor/conversations/${conversationId}/messages`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
  if (!res.ok) throw new Error("Failed to send message");
  return res.json();
}

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

export async function fetchConversations(): Promise<BackendConversation[]> {
  const res = await apiFetch("/tutor/conversations");
  if (!res.ok) throw new Error("Failed to fetch conversations");
  return res.json();
}

export async function fetchConversation(conversationId: string): Promise<BackendConversation> {
  const res = await apiFetch(`/tutor/conversations/${conversationId}`);
  if (!res.ok) throw new Error("Failed to fetch conversation");
  return res.json();
}

export async function fetchMessages(conversationId: string): Promise<BackendMessage[]> {
  const res = await apiFetch(`/tutor/conversations/${conversationId}/messages`);
  if (!res.ok) throw new Error("Failed to fetch messages");
  return res.json();
}

// ── Ask ────────────────────────────────────────────────

export async function askQuestion(question: string, subject?: string) {
  const res = await apiFetch("/learning/ask", {
    method: "POST",
    body: JSON.stringify({ question, subject }),
  });
  if (!res.ok) throw new Error("Failed to ask question");
  return res.json() as Promise<{ answer: string; sources: string[] }>;
}

// ── Explain ────────────────────────────────────────────

export async function explainTopic(topic: string, style: string, context?: string) {
  const res = await apiFetch("/learning/explain", {
    method: "POST",
    body: JSON.stringify({ topic, style, context }),
  });
  if (!res.ok) throw new Error("Failed to explain");
  return res.json() as Promise<{ explanation: string; style: string }>;
}

// ── Quiz ───────────────────────────────────────────────

export async function generateQuiz(topic: string, numQuestions = 5) {
  const res = await apiFetch("/learning/quizzes", {
    method: "POST",
    body: JSON.stringify({ topic, num_questions: numQuestions }),
  });
  if (!res.ok) throw new Error("Failed to generate quiz");
  return res.json() as Promise<{
    id: string;
    topic: string;
    questions: { question: string; options: string[]; correct_index: number; explanation: string }[];
  }>;
}

export async function submitQuiz(quizId: string, answers: number[]) {
  const res = await apiFetch(`/learning/quizzes/${quizId}/submit`, {
    method: "POST",
    body: JSON.stringify({ answers }),
  });
  if (!res.ok) throw new Error("Failed to submit quiz");
  return res.json() as Promise<{
    quiz_id: string;
    score: number;
    total: number;
    results: { question: string; user_answer: number; correct_answer: number; is_correct: boolean; explanation: string }[];
  }>;
}

// ── Flashcards ─────────────────────────────────────────

export async function generateFlashcards(topic: string, numCards = 10) {
  const res = await apiFetch("/learning/flashcards", {
    method: "POST",
    body: JSON.stringify({ topic, num_cards: numCards }),
  });
  if (!res.ok) throw new Error("Failed to generate flashcards");
  return res.json() as Promise<{
    id: string;
    topic: string;
    cards: { front: string; back: string }[];
  }>;
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

export async function createPlan(data: {
  subject: string;
  topic: string;
  goal?: string;
  exam_date?: string;
  total_days?: number;
  confidence?: string;
  hours_per_day?: string;
}): Promise<BackendPlan> {
  const res = await apiFetch("/learning/plans", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to generate plan");
  return res.json();
}

export async function fetchPlans(): Promise<BackendPlan[]> {
  const res = await apiFetch("/learning/plans");
  if (!res.ok) throw new Error("Failed to fetch plans");
  return res.json();
}

export async function fetchPlan(planId: string): Promise<BackendPlan> {
  const res = await apiFetch(`/learning/plans/${planId}`);
  if (!res.ok) throw new Error("Failed to fetch plan");
  return res.json();
}

export async function completePlanDay(planId: string, day: number, completed = true): Promise<BackendPlan> {
  const res = await apiFetch(`/learning/plans/${planId}/day`, {
    method: "PATCH",
    body: JSON.stringify({ day, completed }),
  });
  if (!res.ok) throw new Error("Failed to update plan day");
  return res.json();
}

// ── Study Sessions ────────────────────────────────────

export async function recordStudySession(data: {
  minutes: number;
  preset?: string;
  audio?: string;
}) {
  const res = await apiFetch("/learning/sessions", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to record session");
  return res.json();
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

export async function fetchSpaces(): Promise<BackendSpace[]> {
  const res = await apiFetch("/community/spaces");
  if (!res.ok) throw new Error("Failed to fetch spaces");
  return res.json();
}

export async function createSpace(data: {
  name: string;
  description?: string;
  space_type?: string;
}): Promise<BackendSpace> {
  const res = await apiFetch("/community/spaces", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create space");
  return res.json();
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

export async function fetchProgress(): Promise<BackendProgress> {
  const res = await apiFetch("/learning/progress");
  if (!res.ok) throw new Error("Failed to fetch progress");
  return res.json();
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

export async function uploadFile(file: File): Promise<BackendUpload> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await apiFetch("/intake/uploads", {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to upload file");
  return res.json();
}

export async function listUploads(): Promise<BackendUpload[]> {
  const res = await apiFetch("/intake/uploads");
  if (!res.ok) throw new Error("Failed to list uploads");
  return res.json();
}

export async function scanUpload(uploadId: string, question?: string): Promise<BackendScanResult> {
  const res = await apiFetch("/intake/scan", {
    method: "POST",
    body: JSON.stringify({ upload_id: uploadId, question }),
  });
  if (!res.ok) throw new Error("Failed to scan document");
  return res.json();
}

export async function generateStudyPack(uploadId: string, title?: string): Promise<BackendStudyPack> {
  const res = await apiFetch("/intake/study-pack", {
    method: "POST",
    body: JSON.stringify({ upload_id: uploadId, title }),
  });
  if (!res.ok) throw new Error("Failed to generate study pack");
  return res.json();
}

export async function fetchStudyPack(packId: string): Promise<BackendStudyPack> {
  const res = await apiFetch(`/intake/study-pack/${packId}`);
  if (!res.ok) throw new Error("Failed to fetch study pack");
  return res.json();
}

// ── Profile ────────────────────────────────────────────

export async function getProfile() {
  const res = await apiFetch("/identity/profile");
  if (!res.ok) throw new Error("Failed to get profile");
  return res.json();
}
