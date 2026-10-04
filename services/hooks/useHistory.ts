"use client";

import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteQuiz,
  fetchHistory,
  getFlashcardDeckById,
  getQuizById,
  updateQuiz,
} from "@/services/modules/history";
import type {
  HistoryItem,
  HistoryType,
  UpdateQuizRequest,
} from "@/services/dtos/history";

const SUPPORTED_TYPES: HistoryType[] = ["quizzes", "flashcards"];
const PREFETCH_CONCURRENCY = 4;

export const historyKey = (type?: HistoryType) =>
  ["history", type ?? "all"] as const;
export const quizDetailKey = (id: string) => ["quizzes", id] as const;
export const flashcardDeckKey = (id: string) => ["flashcards", "decks", id] as const;

/**
 * Fetches history and warms the per-row quiz/deck caches in the background.
 * 30 s stale + refetchOnMount: 'always' so a session started elsewhere shows
 * up without a manual refresh.
 */
export function useHistory(params: { type?: HistoryType } = {}) {
  const client = useQueryClient();
  const query = useQuery({
    queryKey: historyKey(params.type),
    queryFn: () => fetchHistory({ type: params.type }),
    staleTime: 30_000,
    refetchOnMount: "always",
    select: (items) => items.filter((it) => SUPPORTED_TYPES.includes(it.type)),
  });

  const items = query.data;

  useEffect(() => {
    if (!items?.length) return;
    let cancelled = false;

    const queue: HistoryItem[] = items.filter((it) => Boolean(it.ref_id));
    let active = 0;

    async function pump() {
      if (cancelled) return;
      while (active < PREFETCH_CONCURRENCY && queue.length) {
        const next = queue.shift();
        if (!next || !next.ref_id) continue;
        active += 1;
        void prefetch(next).finally(() => {
          active -= 1;
          if (!cancelled && queue.length) void pump();
        });
      }
    }

    async function prefetch(item: HistoryItem) {
      const refId = item.ref_id;
      if (!refId) return;
      if (item.type === "quizzes") {
        await client.prefetchQuery({
          queryKey: quizDetailKey(refId),
          queryFn: () => getQuizById(refId),
          staleTime: 60_000,
        });
      } else if (item.type === "flashcards") {
        await client.prefetchQuery({
          queryKey: flashcardDeckKey(refId),
          queryFn: () => getFlashcardDeckById(refId),
          staleTime: 60_000,
        });
      }
    }

    void pump();
    return () => {
      cancelled = true;
    };
  }, [items, client]);

  return query;
}

export function useQuizDetail(id: string | null | undefined) {
  return useQuery({
    queryKey: quizDetailKey(id ?? ""),
    queryFn: () => getQuizById(id as string),
    enabled: Boolean(id),
    staleTime: 60_000,
  });
}

export function useUpdateQuiz(id: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (patch: UpdateQuizRequest) => updateQuiz(id, patch),
    onSuccess: (quiz) => {
      client.setQueryData(quizDetailKey(id), quiz);
      void client.invalidateQueries({ queryKey: ["history"] });
    },
  });
}

export function useDeleteQuiz() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: deleteQuiz,
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: ["history"] });
    },
  });
}
