import { apiClient } from "@/services/apiClient";
import type { AskDocument, AskDocumentMessage, AskSessionItem, Page } from "@/services/dtos/ask";

const ROOT = "/api/v1/ask";

export const getAskDocuments = () => apiClient.get<Page<AskDocument>>(`${ROOT}/documents`);
export const getAskSessions = () => apiClient.get<Page<AskSessionItem>>(`${ROOT}/sessions`);
export const getAskDocument = (id: string) => apiClient.get<AskDocument>(`${ROOT}/documents/${encodeURIComponent(id)}`);
export const getAskDocumentMessages = (id: string) => apiClient.get<Page<AskDocumentMessage>>(`${ROOT}/documents/${encodeURIComponent(id)}/messages`);

export function uploadAskDocument(file: File, fields: { name: string; subject: string }) {
  const form = new FormData();
  form.append("name", fields.name);
  form.append("subject", fields.subject);
  form.append("file", file);
  return apiClient.post<AskDocument>(`${ROOT}/documents`, form);
}

export const renameAskDocument = ({ id, name }: { id: string; name: string }) => apiClient.patch<AskDocument>(`${ROOT}/documents/${encodeURIComponent(id)}`, { name });
export const deleteAskDocument = (id: string) => apiClient.delete<void>(`${ROOT}/documents/${encodeURIComponent(id)}`, { parseAs: "none" });
export const sendAskDocumentMessage = ({ docId, text }: { docId: string; text: string }) => apiClient.post<AskDocumentMessage>(`${ROOT}/documents/${encodeURIComponent(docId)}/messages`, { text });
