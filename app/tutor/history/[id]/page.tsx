"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AppLayout } from "@/app/components/app-layout";
import { cn } from "@/app/components/ui";
import { Icon } from "@/app/components/ui";
import {
  fetchConversation,
  fetchMessages,
  sendTutorMessage,
  type BackendConversation,
  type BackendMessage,
} from "@/lib/services";

function cleanMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/#{1,3}\s/g, "")
    .trim();
}

function dismissKeyboard() {
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
}

type ChatMessage = { id: string; role: "tutor" | "student"; text: string };

export default function ConversationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [conversation, setConversation] = useState<BackendConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;
    Promise.all([fetchConversation(id), fetchMessages(id)])
      .then(([conv, msgs]) => {
        setConversation(conv);
        const chatMsgs: ChatMessage[] = msgs.map((m: BackendMessage) => ({
          id: m.id,
          role: m.role === "assistant" ? "tutor" as const : "student" as const,
          text: cleanMarkdown(m.content),
        }));
        if (chatMsgs.length === 0) {
          chatMsgs.unshift({
            id: "seed",
            role: "tutor",
            text: "Hey! I'm here to help you understand, not just answer. What are we working on?",
          });
        }
        setMessages(chatMsgs);
      })
      .catch(() => setError("Failed to load conversation"))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  async function send(value = text) {
    const clean = value.trim();
    if (!clean || sending || !id) return;

    dismissKeyboard();
    setSending(true);
    setMessages((current) => [
      ...current,
      { id: `student-${Date.now()}`, role: "student", text: clean },
    ]);
    setText("");

    try {
      const reply = await sendTutorMessage(id, clean);
      setMessages((current) => [
        ...current,
        { id: reply.id, role: "tutor", text: cleanMarkdown(reply.content) },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        { id: `error-${Date.now()}`, role: "tutor", text: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  if (loading) {
    return (
      <AppLayout active="tutor">
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#312E81]" />
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout active="tutor">
        <div className="rounded-lg bg-red-50 p-4 text-center text-sm font-semibold text-red-600">
          {error}
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout active="tutor">
      <div className="flex min-h-[calc(100vh-11rem)] flex-col">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-[#CA8A04]">
              {conversation?.subject || "AI Tutor"}
            </p>
            <h1 className="text-lg font-black">
              {conversation?.title || "Conversation"}
            </h1>
          </div>
          <Link
            href="/tutor/history"
            className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-200"
          >
            All Chats
          </Link>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-4">
          {messages.map((message) => (
            <div className={cn("flex gap-3", message.role === "student" && "justify-end")} key={message.id}>
              {message.role === "tutor" ? (
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#FACC15] text-sm font-black">A</span>
              ) : null}
              <div
                className={cn(
                  "max-w-[82%] whitespace-pre-line rounded-lg px-4 py-3 text-sm font-semibold leading-6 shadow-sm",
                  message.role === "tutor" ? "bg-white text-[#1E1B4B]" : "bg-[#312E81] text-white",
                )}
              >
                {message.text}
              </div>
            </div>
          ))}

          {sending && (
            <div className="flex gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#FACC15] text-sm font-black">A</span>
              <div className="flex items-center gap-1.5 rounded-lg bg-white px-4 py-3 shadow-sm">
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:0ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:150ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:300ms]" />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="sticky bottom-20 mt-6 rounded-lg border border-slate-200 bg-white p-3 shadow-lg">
          <div className="flex items-end gap-2">
            <textarea
              className="min-h-11 flex-1 resize-none rounded-lg border border-slate-200 px-3 py-3 text-sm font-semibold outline-none focus:border-[#312E81]"
              onChange={(event) => setText(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Continue the conversation..."
              rows={1}
              value={text}
            />
            <button
              className={cn(
                "grid h-11 w-11 shrink-0 place-items-center rounded-lg transition",
                sending ? "bg-slate-200 text-slate-400" : "bg-[#FACC15] text-[#1E1B4B]",
              )}
              disabled={sending}
              onClick={() => send()}
              type="button"
            >
              <Icon name="arrowUp" className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
