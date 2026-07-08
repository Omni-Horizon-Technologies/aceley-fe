"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/app/components/app-layout";
import { fetchConversations, type BackendConversation } from "@/lib/services";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function TutorHistoryPage() {
  const [conversations, setConversations] = useState<BackendConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchConversations()
      .then(setConversations)
      .catch(() => setError("Failed to load conversations"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppLayout active="tutor">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-[#CA8A04]">AI Tutor</p>
            <h1 className="mt-1 text-2xl font-black">Chat History</h1>
          </div>
          <Link
            href="/tutor"
            className="rounded-lg bg-[#312E81] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#1E1B4B]"
          >
            + New Chat
          </Link>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#312E81]" />
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-center text-sm font-semibold text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && conversations.length === 0 && (
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            <p className="text-4xl">💬</p>
            <p className="mt-3 text-lg font-bold">No conversations yet</p>
            <p className="mt-1 text-sm text-slate-500">Start chatting with your AI tutor to see your history here.</p>
            <Link
              href="/tutor"
              className="mt-4 inline-block rounded-lg bg-[#FACC15] px-5 py-2.5 text-sm font-black text-[#1E1B4B] shadow-sm"
            >
              Start a Conversation
            </Link>
          </div>
        )}

        {!loading && !error && conversations.length > 0 && (
          <div className="space-y-3">
            {conversations.map((conv) => (
              <Link
                key={conv.id}
                href={`/tutor/history/${conv.id}`}
                className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">
                    {conv.title || conv.subject || "Untitled conversation"}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {conv.subject && <span className="mr-2 rounded bg-[#FEFCE8] px-1.5 py-0.5 font-semibold text-[#CA8A04]">{conv.subject}</span>}
                    {timeAgo(conv.updated_at)}
                  </p>
                </div>
                <svg className="h-4 w-4 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
