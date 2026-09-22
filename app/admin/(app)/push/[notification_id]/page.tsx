"use client";

import Link from "next/link";
import { use, useState } from "react";
import { usePushNotification } from "@/app/admin/lib/hooks";
import type { PushTarget, PushTicket } from "@/app/admin/lib/types";
import { Button, Card, ErrorBanner, Spinner } from "@/app/admin/components/ui";
import { useToaster } from "@/app/admin/components/toaster";

export default function PushDetailPage({ params }: { params: Promise<{ notification_id: string }> }) {
  const { notification_id } = use(params);
  const toaster = useToaster();
  const query = usePushNotification(notification_id);
  const [tab, setTab] = useState<"content" | "delivery">("content");

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <Link href="/push/history" className="text-xs font-black text-[#312E81] hover:underline">← All pushes</Link>
      </div>

      {query.isLoading ? (
        <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
          <Spinner className="h-5 w-5 text-[#312E81]" /> Loading…
        </div>
      ) : query.isError ? (
        <ErrorBanner message={(query.error as Error).message} onRetry={() => query.refetch()} />
      ) : query.data ? (
        <>
          <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[.18em] text-[#CA8A04]">Push notification</p>
            <h1 className="mt-1 text-2xl font-black tracking-tight text-[#1E1B4B]">{query.data.title}</h1>
            <p className="mt-2 text-sm font-semibold text-slate-500">
              Sent {fmtDate(query.data.sent_at)} by <b className="text-[#1E1B4B]">{query.data.sent_by_admin}</b>
            </p>
            <p className="mt-1 text-xs font-black text-slate-600">Audience: {summarize(query.data.target_filter, query.data.target_count)}</p>
            <div className="mt-4 grid grid-cols-4 gap-4">
              <Metric label="Target" value={query.data.target_count} />
              <Metric label="Sent" value={query.data.sent_count} tone="success" />
              <Metric label="Errors" value={query.data.error_count} tone={query.data.error_count > 0 ? "danger" : undefined} />
              <Metric label="Skipped" value={query.data.skipped_count} />
            </div>
          </header>

          <div className="flex gap-2 border-b border-slate-200">
            {(["content", "delivery"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={
                  "-mb-px border-b-2 px-4 py-2 text-sm font-black transition " +
                  (tab === t ? "border-[#312E81] text-[#1E1B4B]" : "border-transparent text-slate-400 hover:text-slate-600")
                }
              >
                {t === "content" ? "Content" : `Delivery (${query.data.tickets.length})`}
              </button>
            ))}
          </div>

          {tab === "content" ? (
            <Card className="space-y-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[.14em] text-slate-500">Title</p>
                <p className="mt-1 text-lg font-black text-[#1E1B4B]">{query.data.title}</p>
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[.14em] text-slate-500">Body</p>
                <p className="mt-1 whitespace-pre-wrap text-sm font-semibold text-[#1E1B4B]">{query.data.body}</p>
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[.14em] text-slate-500">Data payload</p>
                <pre className="mt-1 max-h-72 overflow-auto rounded-xl bg-slate-900 p-4 text-xs font-mono text-slate-100">
{JSON.stringify(query.data.data ?? {}, null, 2)}
                </pre>
              </div>
            </Card>
          ) : (
            <Card className="!p-0 overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 p-4">
                <p className="text-xs font-black uppercase tracking-[.14em] text-slate-500">Tickets</p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    const dead = query.data.tickets
                      .filter((t): t is Extract<PushTicket, { status: "error" }> => t.status === "error" && (t.details as { error?: string })?.error === "DeviceNotRegistered")
                      .map((t) => (t.details as { device_id?: string; token?: string }).device_id ?? (t.details as { token?: string }).token ?? "");
                    const uniq = Array.from(new Set(dead.filter(Boolean)));
                    if (uniq.length === 0) {
                      toaster.info("No dead tokens", "Nothing to copy.");
                      return;
                    }
                    navigator.clipboard.writeText(uniq.join("\n"));
                    toaster.success("Copied", `${uniq.length} dead token${uniq.length === 1 ? "" : "s"} copied.`);
                  }}
                >
                  Copy dead tokens
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr className="text-left text-[10px] font-black uppercase tracking-[.14em] text-slate-500">
                      <th className="px-6 py-3">Status</th>
                      <th className="px-4 py-3">Detail</th>
                    </tr>
                  </thead>
                  <tbody>
                    {query.data.tickets.length === 0 ? (
                      <tr><td colSpan={2} className="px-6 py-6 text-center text-sm font-semibold text-slate-400">No tickets recorded.</td></tr>
                    ) : (
                      query.data.tickets.map((t, i) => (
                        <tr key={i} className={"border-b border-slate-50 last:border-none " + (t.status === "error" ? "bg-red-50/50" : "")}>
                          <td className="px-6 py-3">
                            <span className={
                              "inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide " +
                              (t.status === "ok" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700")
                            }>{t.status}</span>
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-slate-700">
                            {t.status === "ok" ? t.id : `${(t.details as { error?: string })?.error ?? "error"} — ${t.message}`}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </>
      ) : null}
    </div>
  );
}

function Metric({ label, value, tone }: { label: string; value: number; tone?: "success" | "danger" }) {
  const cls = tone === "success" ? "text-emerald-600" : tone === "danger" ? "text-red-600" : "text-[#1E1B4B]";
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-[10px] font-black uppercase tracking-[.14em] text-slate-500">{label}</p>
      <p className={"mt-1 text-2xl font-black " + cls}>{value.toLocaleString()}</p>
    </div>
  );
}

function summarize(t: PushTarget, count: number) {
  switch (t.type) {
    case "all": return `All (${count.toLocaleString()})`;
    case "platform": return `${t.platform === "ios" ? "iOS" : t.platform === "android" ? "Android" : "Web"} (${count.toLocaleString()})`;
    case "tier": return `Tier: ${t.tier} (${count.toLocaleString()})`;
    case "device_ids": return `${t.device_ids.length} device${t.device_ids.length === 1 ? "" : "s"}`;
  }
}

function fmtDate(iso: string) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleString();
}
