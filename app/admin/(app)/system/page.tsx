"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useCronBackfillCounters, useCronRefreshCredits, useCronZeroStreaks } from "@/app/admin/lib/hooks";
import { Button, Card, Input, Label } from "@/app/admin/components/ui";
import { useToaster } from "@/app/admin/components/toaster";

const STORAGE_KEY = "admin.shared_secret";

const readStoredSecret = () => (typeof window === "undefined" ? "" : window.sessionStorage.getItem(STORAGE_KEY) ?? "");
const subscribeStorage = (cb: () => void) => {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
};

export default function SystemPage() {
  const toaster = useToaster();
  const stored = useSyncExternalStore(subscribeStorage, readStoredSecret, () => "");
  const [secret, setSecret] = useState(stored);
  const [signature, setSignature] = useState(stored);
  if (stored !== signature) {
    setSignature(stored);
    setSecret(stored);
  }
  const [backfillUser, setBackfillUser] = useState("");

  useEffect(() => {
    if (secret) window.sessionStorage.setItem(STORAGE_KEY, secret);
    else window.sessionStorage.removeItem(STORAGE_KEY);
  }, [secret]);

  const refresh = useCronRefreshCredits();
  const zero = useCronZeroStreaks();
  const backfill = useCronBackfillCounters();

  const ready = secret.length > 0;

  const run = <TArgs, TRes>(
    label: string,
    mutate: (args: TArgs, opts: { onSuccess: (d: TRes) => void; onError: (e: Error) => void }) => void,
    args: TArgs,
    describe: (d: TRes) => string,
  ) => {
    mutate(args, {
      onSuccess: (d: TRes) => toaster.success(`${label} complete`, describe(d)),
      onError: (e: Error) => toaster.error(`${label} failed`, e.message),
    });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <p className="text-xs font-black uppercase tracking-[.18em] text-[#CA8A04]">Operations</p>
        <h1 className="mt-1 text-3xl font-black tracking-tight">System</h1>
        <p className="mt-2 text-sm font-semibold text-slate-500">
          Manual triggers for cron endpoints. Secret is used from browser memory only — never sent to our servers.
        </p>
      </header>

      <Card>
        <Label htmlFor="secret" hint="X-Admin-Secret header">Shared secret</Label>
        <Input
          id="secret"
          type="password"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          className="mt-2"
          placeholder="Paste ADMIN_SHARED_SECRET"
        />
        <p className="mt-2 text-xs font-semibold text-slate-500">
          Kept in <code className="font-mono">sessionStorage</code> so it clears when you close the tab.
        </p>
      </Card>

      <Card>
        <h2 className="text-lg font-black text-[#1E1B4B]">Refresh monthly credit grants</h2>
        <p className="mt-1 text-sm font-semibold text-slate-500">Sweeps users whose next refresh date has passed.</p>
        <Button
          className="mt-4"
          disabled={!ready}
          loading={refresh.isPending}
          onClick={() =>
            run(
              "Credit refresh",
              refresh.mutate,
              secret,
              (d) => `Refreshed ${d.refreshed} user${d.refreshed === 1 ? "" : "s"}.`,
            )
          }
        >
          Run credit refresh
        </Button>
      </Card>

      <Card>
        <h2 className="text-lg font-black text-[#1E1B4B]">Zero stale streaks</h2>
        <p className="mt-1 text-sm font-semibold text-slate-500">Drops streaks to 0 for users idle ≥ 2 days.</p>
        <Button
          className="mt-4"
          variant="secondary"
          disabled={!ready}
          loading={zero.isPending}
          onClick={() =>
            run(
              "Streak zero",
              zero.mutate,
              secret,
              (d) => `Zeroed ${d.zeroed} streak${d.zeroed === 1 ? "" : "s"}.`,
            )
          }
        >
          Zero stale streaks
        </Button>
      </Card>

      <Card>
        <h2 className="text-lg font-black text-[#1E1B4B]">Backfill activity counters</h2>
        <p className="mt-1 text-sm font-semibold text-slate-500">Recomputes counters from historical data. Leave user ID blank to run for everyone.</p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Input value={backfillUser} onChange={(e) => setBackfillUser(e.target.value)} placeholder="user_id (optional)" className="flex-1" />
          <Button
            variant="secondary"
            disabled={!ready}
            loading={backfill.isPending}
            onClick={() =>
              run(
                "Counter backfill",
                backfill.mutate,
                { secret, userId: backfillUser.trim() || undefined },
                (d) => `Backfilled ${d.backfilled} row${d.backfilled === 1 ? "" : "s"}.`,
              )
            }
          >
            Run backfill
          </Button>
        </div>
      </Card>
    </div>
  );
}
