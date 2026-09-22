"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useAnalytics } from "@/app/admin/lib/hooks";
import type { AnalyticsPeriod } from "@/app/admin/lib/types";
import { Card, Chip, ErrorBanner, Spinner, StatCard } from "@/app/admin/components/ui";
import { DistributionPie, UserGrowthChart } from "@/app/admin/components/charts";

const PERIODS: Array<{ value: AnalyticsPeriod; label: string }> = [
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
  { value: "90d", label: "90 days" },
  { value: "365d", label: "1 year" },
];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<AnalyticsPeriod>("30d");
  const query = useAnalytics(period);
  const data = query.data;

  const safe = useMemo(() => {
    if (!data) return null;
    return {
      user_growth: data.user_growth ?? [],
      revenue_data: data.revenue_data ?? [],
      plan_distribution: data.plan_distribution ?? [],
      subscription_status: data.subscription_status ?? [],
      top_users: data.top_users ?? [],
    };
  }, [data]);

  const stats = useMemo(() => {
    if (!safe) return null;
    const totalUsers = safe.user_growth.at(-1)?.users ?? 0;
    const newUsers = safe.user_growth.reduce((sum, p) => sum + p.new_users, 0);
    const revenue = safe.revenue_data.reduce((sum, p) => sum + p.revenue, 0);
    const activeSubs = safe.subscription_status.find((s) => s.status === "active")?.count ?? 0;
    const activeSubToday = safe.revenue_data.at(-1)?.subscriptions ?? 0;
    return { totalUsers, newUsers, revenue, activeSubs, activeSubToday };
  }, [safe]);

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[.18em] text-[#CA8A04]">Overview</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight">Aceley control room</h1>
          <p className="mt-2 text-sm font-semibold text-slate-500">
            {query.dataUpdatedAt ? `Updated ${relativeMinutes(query.dataUpdatedAt)}` : "Loading…"}
            <span className="ml-2 text-slate-400">· 5-min cache on the backend</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {PERIODS.map((p) => (
            <Chip key={p.value} active={period === p.value} onClick={() => setPeriod(p.value)}>
              {p.label}
            </Chip>
          ))}
        </div>
      </header>

      {query.isLoading ? (
        <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
          <Spinner className="h-5 w-5 text-[#312E81]" /> Loading analytics…
        </div>
      ) : query.isError ? (
        <ErrorBanner message={(query.error as Error).message} onRetry={() => query.refetch()} />
      ) : safe && stats ? (
        <>
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total users" value={stats.totalUsers.toLocaleString()} tone="primary" />
            <StatCard label={`New (${period})`} value={stats.newUsers.toLocaleString()} tone="accent" />
            <StatCard label={`Revenue (${period})`} value={`$${stats.revenue.toFixed(2)}`} tone="success" />
            <StatCard label="Active subs" value={stats.activeSubs.toLocaleString()} hint={`Today: ${stats.activeSubToday}`} />
          </section>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-[#1E1B4B]">User growth</h2>
                <p className="text-xs font-semibold text-slate-500">Total users vs. new sign-ups</p>
              </div>
            </div>
            <div className="mt-4">
              <UserGrowthChart data={safe.user_growth} />
            </div>
          </Card>

          <section className="grid gap-4 lg:grid-cols-2">
            <Card>
              <h2 className="text-lg font-black text-[#1E1B4B]">Plan distribution</h2>
              <p className="text-xs font-semibold text-slate-500">Users per plan tier</p>
              <div className="mt-2">
                <DistributionPie data={safe.plan_distribution.map((p) => ({ label: p.plan, value: p.users }))} />
              </div>
              <ul className="mt-3 space-y-2 text-sm font-semibold text-slate-600">
                {safe.plan_distribution.map((p) => (
                  <li key={p.plan} className="flex items-center justify-between">
                    <span className="capitalize">{p.plan}</span>
                    <span>
                      {p.users.toLocaleString()} <span className="text-slate-400">({p.percentage.toFixed(1)}%)</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
            <Card>
              <h2 className="text-lg font-black text-[#1E1B4B]">Subscription status</h2>
              <p className="text-xs font-semibold text-slate-500">Point-in-time snapshot</p>
              <div className="mt-2">
                <DistributionPie data={safe.subscription_status.map((p) => ({ label: p.status, value: p.count }))} />
              </div>
              <ul className="mt-3 space-y-2 text-sm font-semibold text-slate-600">
                {safe.subscription_status.map((p) => (
                  <li key={p.status} className="flex items-center justify-between">
                    <span className="capitalize">{p.status}</span>
                    <span>
                      {p.count.toLocaleString()} <span className="text-slate-400">({p.percentage.toFixed(1)}%)</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          </section>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-[#1E1B4B]">Top users</h2>
                <p className="text-xs font-semibold text-slate-500">Most requests in {period}</p>
              </div>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-[10px] font-black uppercase tracking-[.14em] text-slate-500">
                    <th className="py-2 pr-4">Email</th>
                    <th className="py-2 pr-4">Plan</th>
                    <th className="py-2 pr-4">Requests</th>
                    <th className="py-2 pr-4">Last activity</th>
                  </tr>
                </thead>
                <tbody>
                  {safe.top_users.map((u) => (
                    <tr key={u.email} className="border-b border-slate-50 last:border-none">
                      <td className="py-3 pr-4 font-semibold text-[#1E1B4B]">
                        <Link href={`/users?search=${encodeURIComponent(u.email)}`} className="hover:underline">
                          {u.email}
                        </Link>
                      </td>
                      <td className="py-3 pr-4 font-black capitalize text-slate-600">{u.plan_type}</td>
                      <td className="py-3 pr-4 font-black text-[#312E81]">{u.requests.toLocaleString()}</td>
                      <td className="py-3 pr-4 font-semibold text-slate-500">
                        {u.last_activity ? relativeAbs(u.last_activity) : "—"}
                      </td>
                    </tr>
                  ))}
                  {safe.top_users.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-sm font-semibold text-slate-400">
                        No activity yet in this window.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      ) : null}
    </div>
  );
}

function relativeMinutes(ts: number) {
  const mins = Math.max(0, Math.floor((Date.now() - ts) / 60_000));
  if (mins < 1) return "just now";
  if (mins === 1) return "1m ago";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  return hrs === 1 ? "1h ago" : `${hrs}h ago`;
}

function relativeAbs(iso: string) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
