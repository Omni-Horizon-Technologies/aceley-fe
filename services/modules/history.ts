import { apiClient } from "@/services/apiClient";
import type {
  FlashcardDeckDetail,
  HistoryItem,
  HistoryType,
  QuizDetail,
  UpdateQuizRequest,
} from "@/services/dtos/history";

const ROOT = "/api/v1";

type HistoryEnvelope = {
  items: HistoryItem[];
  next_cursor: string | null;
};

export async function fetchHistory(
  params: { type?: HistoryType } = {},
): Promise<HistoryItem[]> {
  const res = await apiClient.get<HistoryEnvelope | HistoryItem[]>(
    `${ROOT}/history`,
    { query: params.type ? { type: params.type } : undefined },
  );
  // Backend currently returns { items, next_cursor }. Tolerate a bare array too
  // in case the shape ever changes.
  if (Array.isArray(res)) return res;
  return res.items ?? [];
}

export function getQuizById(id: string): Promise<QuizDetail> {
  return apiClient.get<QuizDetail>(`${ROOT}/quizzes/${encodeURIComponent(id)}`);
}

export function getFlashcardDeckById(id: string): Promise<FlashcardDeckDetail> {
  return apiClient.get<FlashcardDeckDetail>(
    `${ROOT}/flashcards/decks/${encodeURIComponent(id)}`,
  );
}

export function updateQuiz(id: string, patch: UpdateQuizRequest): Promise<QuizDetail> {
  return apiClient.patch<QuizDetail>(
    `${ROOT}/quizzes/${encodeURIComponent(id)}`,
    patch,
  );
}

export function deleteQuiz(id: string): Promise<void> {
  return apiClient.delete<void>(`${ROOT}/quizzes/${encodeURIComponent(id)}`, {
    parseAs: "none",
  });
}
