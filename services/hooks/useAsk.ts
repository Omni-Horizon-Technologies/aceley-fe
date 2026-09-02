"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteAskDocument, getAskDocument, getAskDocumentMessages, getAskDocuments, getAskSessions, renameAskDocument, sendAskDocumentMessage, uploadAskDocument } from "@/services/modules/ask";

export const askDocumentsKey = ["ask", "documents", "list"] as const;
export const askSessionsKey = ["ask", "sessions", "list"] as const;
export const askDocumentKey = (id: string) => ["ask", "documents", id] as const;
export const askDocumentMessagesKey = (id: string) => ["ask", "documents", id, "messages"] as const;

export const useAskDocuments = () => useQuery({ queryKey: askDocumentsKey, queryFn: getAskDocuments, staleTime: 30_000 });
export const useAskSessions = () => useQuery({ queryKey: askSessionsKey, queryFn: getAskSessions, staleTime: 30_000 });
export const useAskDocument = (id: string) => useQuery({ queryKey: askDocumentKey(id), queryFn: () => getAskDocument(id), enabled: Boolean(id), staleTime: 30_000 });
export const useAskDocumentMessages = (id: string) => useQuery({ queryKey: askDocumentMessagesKey(id), queryFn: () => getAskDocumentMessages(id), enabled: Boolean(id), staleTime: 15_000 });

export function useUploadAskDocument() {
  const client = useQueryClient();
  return useMutation({ mutationFn: ({ file, name, subject }: { file: File; name: string; subject: string }) => uploadAskDocument(file, { name, subject }), onSuccess: doc => { client.setQueryData(askDocumentKey(doc.id), doc); void client.invalidateQueries({ queryKey: askDocumentsKey }); void client.invalidateQueries({ queryKey: askSessionsKey }); } });
}
export function useRenameAskDocument() {
  const client = useQueryClient();
  return useMutation({ mutationFn: renameAskDocument, onSuccess: doc => { client.setQueryData(askDocumentKey(doc.id), doc); void client.invalidateQueries({ queryKey: askDocumentsKey }); void client.invalidateQueries({ queryKey: askSessionsKey }); } });
}
export function useDeleteAskDocument() {
  const client = useQueryClient();
  return useMutation({ mutationFn: deleteAskDocument, onSuccess: (_, id) => { client.removeQueries({ queryKey: askDocumentKey(id) }); void client.invalidateQueries({ queryKey: askDocumentsKey }); void client.invalidateQueries({ queryKey: askSessionsKey }); } });
}
export function useSendAskDocumentMessage() {
  const client = useQueryClient();
  return useMutation({ mutationFn: sendAskDocumentMessage, onSuccess: (_, variables) => { void client.invalidateQueries({ queryKey: askDocumentMessagesKey(variables.docId) }); void client.invalidateQueries({ queryKey: askSessionsKey }); } });
}
