"use client";

import Link from "next/link";
import { usePushHistory } from "@/app/admin/lib/hooks";
import type { PushNotification, PushTarget } from "@/app/admin/lib/types";
import { Card, EmptyState, ErrorBanner, LinkButton, Spinner } from "@/app/admin/components/ui";

function normalizeHistory(data: unknown): PushNotification[] {
  if (Array.isArray(data)) return data as PushNotification[];
  if (data && typeof data === "object") {
    const d = data as Record<string, unknown>;
    for (const key of ["items", "notifications", "results", "data"]) {
      if (Array.isArray(d[key])) return d[key] as PushNotification[];
    }
  }
  return [];
}

export default function PushHistoryPage() {
  const query = usePushHistory(50, 0);
  const items = normalizeHistory(query.data);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[.18em] text-[#CA8A04]">Push</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight">History</h1>
          <p className="mt-2 text-sm font-semibold text-slate-500">Newest sends first. Click a row for delivery details.</p>
        </div>
        <LinkButton href="/push">Compose new</LinkButton>
      </header>

      {query.isLoading ? (
        <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
          <Spinner className="h-5 w-5 text-[#312E81]" /> Loading history…
        </div>
      ) : query.isError ? (
        <ErrorBanner message={(query.error as Error).message} onRetry={() => query.refetch()} />
      ) : items.length === 0 ? (
        <EmptyState title="No pushes sent yet" hint="Compose your first push and it'll land here." action={<LinkButton href="/push">Compose</LinkButton>} />
      ) : (
        <Card className="!p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50">
                <tr className="text-left text-[10px] font-black uppercase tracking-[.14em] text-slate-500">
                  <th className="px-6 py-3">Sent</th>
                  <th className="px-4 py-3">Content</th>
                  <th className="px-4 py-3">Audience</th>
                  <th className="px-4 py-3">Sent / target</th>
                  <th className="px-4 py-3">Errors</th>
                </tr>
              </thead>
              <tbody>
                {items.map((n, i) => (
                  <Row key={n?.notification_id ?? i} n={n} />
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

function Row({ n }: { n: PushNotification }) {
  return (
    <tr className="border-b border-slate-50 last:border-none hover:bg-slate-50">
      <td className="px-6 py-3 align-top font-semibold text-slate-500">
        <p className="text-[#1E1B4B]">{fmtDate(n.sent_at)}</p>
        <p className="text-[10px]">{n.sent_by_admin}</p>
      </td>
      <td className="px-4 py-3 align-top">
        <Link href={`/push/${n.notification_id}`} className="font-black text-[#1E1B4B] hover:underline">{n.title}</Link>
        <p className="mt-1 line-clamp-1 max-w-md text-xs font-semibold text-slate-500">{n.body}</p>
      </td>
      <td className="px-4 py-3 align-top text-xs font-black text-slate-600">{summarizeTarget(n.target_filter, n.target_count)}</td>
      <td className="px-4 py-3 align-top font-black text-[#312E81]">{n.sent_count} <span className="text-slate-400">/ {n.target_count}</span></td>
      <td className={"px-4 py-3 align-top font-black " + (n.error_count > 0 ? "text-red-600" : "text-slate-400")}>{n.error_count}</td>
    </tr>
  );
}

function summarizeTarget(t: PushTarget, count: number) {
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
