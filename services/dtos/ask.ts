export type Page<T> = { items: T[]; total?: number; page?: number; page_size?: number };

export type AskDocument = {
  id: string;
  name: string;
  subject: string;
  pages: { text: string }[];
  file_url: string;
  created_at: string;
};

export type AskSessionItem = {
  id: string;
  title: string;
  kind: "document" | "question";
  created_at: string;
};

export type AskDocumentMessage = {
  id: string;
  document_id: string;
  role: "assistant" | "user";
  text: string;
  created_at: string;
};
