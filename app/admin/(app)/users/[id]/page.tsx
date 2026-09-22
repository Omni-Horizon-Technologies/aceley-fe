"use client";

import Link from "next/link";
import { use, useState } from "react";
import { useAdjustCredits, useOverrideTier, useUser } from "@/app/admin/lib/hooks";
import type { Tier } from "@/app/admin/lib/types";
import { Button, Card, Dialog, ErrorBanner, Input, Label, Select, Sheet, Spinner, Textarea } from "@/app/admin/components/ui";
import { TierBadge } from "@/app/admin/components/tier-badge";
import { useToaster } from "@/app/admin/components/toaster";

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const query = useUser(id);
  const [creditsOpen, setCreditsOpen] = useState(false);
  const [tierOpen, setTierOpen] = useState(false);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <Link href="/users" className="text-xs font-black text-[#312E81] hover:underline">← All users</Link>
      </div>

      {query.isLoading ? (
        <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
          <Spinner className="h-5 w-5 text-[#312E81]" /> Loading user…
        </div>
      ) : query.isError ? (
        <ErrorBanner message={(query.error as Error).message} onRetry={() => query.refetch()} />
      ) : query.data ? (
        (() => {
          const u = query.data;
          const email = u.email ?? "(no email)";
          const tier = u.tier ?? "none";
          const credits = u.credits_balance ?? 0;
          return (
            <>
              <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#312E81] text-lg font-black text-white">
                    {initials(email)}
                  </span>
                  <div>
                    <h1 className="text-2xl font-black tracking-tight text-[#1E1B4B]">{email}</h1>
                    <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-500">
                      <TierBadge tier={tier} />
                      <span>{u.created_at ? `Joined ${daysAgo(u.created_at)} days ago` : "Join date unknown"}</span>
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => setCreditsOpen(true)}>Adjust credits</Button>
                  <Button onClick={() => setTierOpen(true)}>Override tier</Button>
                </div>
              </header>

              <div className="grid gap-4 lg:grid-cols-3">
                <Card>
                  <h2 className="text-xs font-black uppercase tracking-[.16em] text-slate-500">Profile</h2>
                  <dl className="mt-3 space-y-2 text-sm">
                    <ProfileRow label="Nickname" value={u.nickname ?? "—"} />
                    <ProfileRow label="Age" value={u.age?.toString() ?? "—"} />
                    <ProfileRow label="Country" value={u.country ?? "—"} />
                    <ProfileRow label="Study level" value={u.study_level ?? "—"} />
                    <ProfileRow label="Main goal" value={u.main_goal ?? "—"} />
                    <ProfileRow label="Onboarded" value={u.onboarded_at ? fmtDate(u.onboarded_at) : "—"} />
                  </dl>
                </Card>

                <Card>
                  <h2 className="text-xs font-black uppercase tracking-[.16em] text-slate-500">Activity</h2>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <StatBlock label="Quizzes" value={(u.quizzes_taken_count ?? 0).toLocaleString()} />
                    <StatBlock label="Questions" value={(u.questions_answered ?? 0).toLocaleString()} />
                    <StatBlock label="Study days" value={(u.study_days_count ?? 0).toLocaleString()} />
                    <StatBlock label="Streak" value={`🔥 ${u.current_streak_days ?? 0}`} tone="accent" />
                  </div>
                  <p className="mt-4 text-xs font-semibold text-slate-500">
                    Last active {u.last_activity_date ?? "—"}
                  </p>
                </Card>

                <Card>
                  <h2 className="text-xs font-black uppercase tracking-[.16em] text-slate-500">Subscription</h2>
                  <dl className="mt-3 space-y-2 text-sm">
                    <ProfileRow label="Tier" value={<TierBadge tier={tier} />} />
                    <ProfileRow label="Credits" value={<b className="text-[#312E81]">{credits.toLocaleString()}</b>} />
                    <ProfileRow label="Unlimited" value={u.is_unlimited ? "Yes" : "No"} />
                    <ProfileRow label="Premium" value={u.is_premium ? "Yes" : "No"} />
                    <ProfileRow label="Provider" value={u.payment_provider ?? "—"} />
                    <ProfileRow
                      label="Expires"
                      value={u.subscription_expires_at ? fmtDate(u.subscription_expires_at) : "—"}
                    />
                  </dl>
                </Card>
              </div>

              <CreditsSheet open={creditsOpen} onClose={() => setCreditsOpen(false)} userId={id} balance={credits} />
              <TierSheet open={tierOpen} onClose={() => setTierOpen(false)} userId={id} currentTier={tier} />
            </>
          );
        })()
      ) : null}
    </div>
  );
}

function CreditsSheet({ open, onClose, userId, balance }: { open: boolean; onClose: () => void; userId: string; balance: number }) {
  const toaster = useToaster();
  const [amount, setAmount] = useState<string>("");
  const [reason, setReason] = useState("");
  const mutation = useAdjustCredits(userId);
  const amountNum = Number(amount);
  const valid = Number.isFinite(amountNum) && amountNum !== 0 && reason.trim().length >= 3;
  const preview = valid ? balance + amountNum : balance;
  const insufficient = valid && preview < 0;

  return (
    <Sheet open={open} onClose={onClose} title="Adjust credits" description="Positive to grant, negative to deduct. All adjustments are logged.">
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!valid || insufficient) return;
          mutation.mutate(
            { amount: amountNum, reason: reason.trim() },
            {
              onSuccess: () => {
                toaster.success("Credits updated", `New balance: ${balance + amountNum}`);
                onClose();
                setAmount("");
                setReason("");
              },
              onError: (err) => {
                const e = err as { code?: string; message?: string };
                if (e.code === "insufficient_balance") {
                  toaster.error("Insufficient balance", "The user doesn't have enough credits to deduct.");
                } else {
                  toaster.error("Adjustment failed", e.message ?? "Try again.");
                }
              },
            },
          );
        }}
      >
        <div>
          <Label htmlFor="amount">Amount</Label>
          <Input id="amount" type="number" step="1" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-2" placeholder="e.g. 50 or -25" />
          {insufficient ? <p className="mt-2 text-xs font-black text-red-600">Cannot deduct below zero (current balance: {balance})</p> : null}
        </div>
        <div>
          <Label htmlFor="reason" hint="min 3 chars">Reason</Label>
          <Textarea id="reason" rows={3} value={reason} onChange={(e) => setReason(e.target.value)} className="mt-2" placeholder="e.g., Comp for beta feedback" />
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">Preview</p>
          <p className="mt-1 text-lg font-black text-[#1E1B4B]">
            {balance.toLocaleString()} → <span className={insufficient ? "text-red-600" : "text-[#312E81]"}>{preview.toLocaleString()}</span>
          </p>
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose} disabled={mutation.isPending}>Cancel</Button>
          <Button type="submit" loading={mutation.isPending} disabled={!valid || insufficient} className="flex-1">
            Apply adjustment
          </Button>
        </div>
      </form>
    </Sheet>
  );
}

function TierSheet({ open, onClose, userId, currentTier }: { open: boolean; onClose: () => void; userId: string; currentTier: Tier }) {
  const toaster = useToaster();
  const [tier, setTier] = useState<Tier>(currentTier);
  const [neverExpires, setNeverExpires] = useState(true);
  const [expiresAt, setExpiresAt] = useState<string>("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const mutation = useOverrideTier(userId);

  const canSubmit = tier !== currentTier || !neverExpires;

  const submit = () => {
    mutation.mutate(
      {
        tier,
        expires_at: neverExpires ? null : expiresAt ? new Date(expiresAt).toISOString() : null,
      },
      {
        onSuccess: () => {
          toaster.success("Tier updated", `Now: ${tier}`);
          setConfirmOpen(false);
          onClose();
        },
        onError: (err) => {
          toaster.error("Tier override failed", (err as Error).message);
          setConfirmOpen(false);
        },
      },
    );
  };

  return (
    <Sheet open={open} onClose={onClose} title="Override tier" description="Writes real subscription state + a ledger row.">
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          setConfirmOpen(true);
        }}
      >
        <div>
          <Label htmlFor="tier">Tier</Label>
          <Select id="tier" value={tier} onChange={(e) => setTier(e.target.value as Tier)} className="mt-2">
            <option value="none">None</option>
            <option value="small">Small</option>
            <option value="best">Best</option>
            <option value="unlimited">Unlimited</option>
          </Select>
        </div>
        <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <input type="checkbox" checked={neverExpires} onChange={(e) => setNeverExpires(e.target.checked)} className="h-4 w-4 accent-[#312E81]" />
          <span className="text-sm font-black text-[#1E1B4B]">Never expires (comp&rsquo;d forever)</span>
        </label>
        {!neverExpires ? (
          <div>
            <Label htmlFor="exp">Expires at</Label>
            <Input id="exp" type="datetime-local" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} className="mt-2" required />
          </div>
        ) : null}
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose} disabled={mutation.isPending}>Cancel</Button>
          <Button type="submit" disabled={!canSubmit} className="flex-1">Review &amp; apply</Button>
        </div>
      </form>
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Apply tier override?"
        description={`Set tier to "${tier}"${neverExpires ? " with no expiry" : expiresAt ? ` until ${expiresAt}` : ""}. This writes to subscription state and the audit ledger.`}
        confirmText="Yes, apply"
        onConfirm={submit}
        loading={mutation.isPending}
      />
    </Sheet>
  );
}

function ProfileRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 py-2 last:border-none">
      <dt className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="text-sm font-semibold text-[#1E1B4B]">{value}</dd>
    </div>
  );
}

function StatBlock({ label, value, tone }: { label: string; value: string; tone?: "default" | "accent" }) {
  return (
    <div className={"rounded-xl p-3 " + (tone === "accent" ? "bg-amber-50" : "bg-slate-50")}>
      <p className="text-[10px] font-black uppercase tracking-[.14em] text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-black text-[#1E1B4B]">{value}</p>
    </div>
  );
}

function initials(email: string) {
  const local = email.split("@")[0] || email;
  const parts = local.split(/[._-]/).filter(Boolean);
  const first = parts[0]?.[0] ?? email[0] ?? "?";
  const second = parts[1]?.[0] ?? "";
  return (first + second).toUpperCase();
}

function fmtDate(iso: string) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function daysAgo(iso: string) {
  const d = new Date(iso).getTime();
  return Math.max(0, Math.floor((Date.now() - d) / 86_400_000));
}
