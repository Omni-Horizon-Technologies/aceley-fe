"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useUsersList } from "@/app/admin/lib/hooks";
import type { AdminUserSummary } from "@/app/admin/lib/types";
import { Button, Card, EmptyState, ErrorBanner, Input, Spinner } from "@/app/admin/components/ui";
import { TierBadge } from "@/app/admin/components/tier-badge";

export default function UsersListPage() {
  const router = useRouter();
  const params = useSearchParams();
  const initial = params.get("search") ?? "";
  const [search, setSearch] = useState(initial);
  const [debounced, setDebounced] = useState(initial);
  const query = useUsersList(debounced);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(search.trim()), 300);
    return () => clearTimeout(id);
  }, [search]);

  useEffect(() => {
    const q = search.trim();
    const url = q ? `/users?search=${encodeURIComponent(q)}` : "/users";
    router.replace(url);
  }, [debounced, router, search]);

  useEffect(() => {
    if (!query.hasNextPage) return;
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !query.isFetchingNextPage) {
          query.fetchNextPage();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [query]);

  const items = useMemo<AdminUserSummary[]>(
    () =>
      query.data?.pages
        .flatMap((p) => p?.items ?? [])
        .filter((u): u is AdminUserSummary => Boolean(u)) ?? [],
    [query.data],
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[.18em] text-[#CA8A04]">Users</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight">All accounts</h1>
          <p className="mt-2 text-sm font-semibold text-slate-500">
            Search by email or nickname prefix (case-insensitive).
          </p>
        </div>
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search users…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search users"
          />
        </div>
      </header>

      {query.isLoading ? (
        <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
          <Spinner className="h-5 w-5 text-[#312E81]" /> Loading users…
        </div>
      ) : query.isError ? (
        <ErrorBanner message={(query.error as Error).message} onRetry={() => query.refetch()} />
      ) : items.length === 0 ? (
        <EmptyState title="No users match" hint="Try a different email or nickname prefix." />
      ) : (
        <Card className="!p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50">
                <tr className="text-left text-[10px] font-black uppercase tracking-[.14em] text-slate-500">
                  <th className="px-6 py-3">Email</th>
                  <th className="px-4 py-3">Nickname</th>
                  <th className="px-4 py-3">Tier</th>
                  <th className="px-4 py-3">Credits</th>
                  <th className="px-4 py-3">Last activity</th>
                  <th className="px-4 py-3">Joined</th>
                </tr>
              </thead>
              <tbody>
                {items.map((u, i) => {
                  const id = u.id ?? u._id;
                  const href = id ? `/users/${id}` : "#";
                  return (
                    <tr
                      key={id ?? `${u.email}-${i}`}
                      className={"border-b border-slate-50 last:border-none hover:bg-slate-50 " + (id ? "cursor-pointer" : "")}
                      onClick={() => id && router.push(href)}
                    >
                      <td className="px-6 py-3">
                        {id ? (
                          <Link href={href} className="font-black text-[#1E1B4B] hover:underline">
                            {u.email}
                          </Link>
                        ) : (
                          <span className="font-black text-slate-500">{u.email}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-600">{u.nickname ?? "—"}</td>
                      <td className="px-4 py-3"><TierBadge tier={u.tier ?? "none"} /></td>
                      <td className="px-4 py-3 font-black text-[#312E81]">{(u.credits_balance ?? 0).toLocaleString()}</td>
                      <td className="px-4 py-3 font-semibold text-slate-500">{u.last_activity_date ?? "—"}</td>
                      <td className="px-4 py-3 font-semibold text-slate-500">{u.created_at ? fmtDate(u.created_at) : "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div ref={sentinelRef} className="flex items-center justify-center py-6 text-xs font-semibold text-slate-400">
            {query.isFetchingNextPage ? (
              <span className="inline-flex items-center gap-2"><Spinner className="h-4 w-4 text-[#312E81]" /> Loading more…</span>
            ) : query.hasNextPage ? (
              <Button variant="ghost" size="sm" onClick={() => query.fetchNextPage()}>Load more</Button>
            ) : items.length > 0 ? (
              "End of list"
            ) : null}
          </div>
        </Card>
      )}
    </div>
  );
}

function fmtDate(iso: string) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}
