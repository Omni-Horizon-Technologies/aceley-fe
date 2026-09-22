"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { usePushEstimate, useSendPush, useSendTestPush } from "@/app/admin/lib/hooks";
import type { PushTarget } from "@/app/admin/lib/types";
import { Button, Card, Chip, Input, Label, Select, Spinner, Textarea } from "@/app/admin/components/ui";
import { useToaster } from "@/app/admin/components/toaster";

type AudienceKind = "all" | "platform" | "tier" | "device_ids";

export default function PushComposePage() {
  const router = useRouter();
  const toaster = useToaster();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [route, setRoute] = useState("");
  const [kind, setKind] = useState<AudienceKind>("all");
  const [platform, setPlatform] = useState<"ios" | "android" | "web">("ios");
  const [tier, setTier] = useState<"free" | "pro" | "premium">("pro");
  const [tokensRaw, setTokensRaw] = useState("");
  const [testTokenOpen, setTestTokenOpen] = useState(false);
  const [testToken, setTestToken] = useState("");
  const [idempotencyKey, setIdempotencyKey] = useState<string>(() => crypto.randomUUID());

  const tokens = useMemo(
    () => tokensRaw.split(/[\s,]+/).map((t) => t.trim()).filter(Boolean),
    [tokensRaw],
  );

  const target: PushTarget = useMemo(() => {
    switch (kind) {
      case "all": return { type: "all" };
      case "platform": return { type: "platform", platform };
      case "tier": return { type: "tier", tier };
      case "device_ids": return { type: "device_ids", device_ids: tokens };
    }
  }, [kind, platform, tier, tokens]);

  const [debouncedTarget, setDebouncedTarget] = useState<PushTarget>(target);
  useEffect(() => {
    const id = setTimeout(() => setDebouncedTarget(target), 300);
    return () => clearTimeout(id);
  }, [target]);

  const estimateEnabled = kind !== "device_ids" || tokens.length > 0;
  const estimate = usePushEstimate(debouncedTarget, estimateEnabled);
  const send = useSendPush();
  const testSend = useSendTestPush();

  const data = route.trim() ? { route: route.trim() } : undefined;
  const readyToSend =
    title.trim().length > 0 &&
    body.trim().length > 0 &&
    title.length <= 120 &&
    body.length <= 500 &&
    (estimate.data?.target_count ?? 0) > 0;

  const submit = () => {
    if (!readyToSend) return;
    send.mutate(
      { body: { title: title.trim(), body: body.trim(), target, data }, idempotencyKey },
      {
        onSuccess: (result) => {
          toaster.success("Push sent", `${result.sent_count} delivered, ${result.error_count} errors.`);
          setIdempotencyKey(crypto.randomUUID());
          router.push(`/push/${result.notification_id}`);
        },
        onError: (err) => {
          const e = err as { code?: string; message?: string; status?: number };
          if (e.code === "idempotency_conflict") {
            toaster.error("Already recorded", "Generate a new draft to send different content.");
            setIdempotencyKey(crypto.randomUUID());
          } else {
            toaster.error("Send failed", e.message ?? "Try again.");
          }
        },
      },
    );
  };

  const sendTest = () => {
    if (!testToken.trim()) return;
    testSend.mutate(
      { device_id: testToken.trim(), title: title.trim() || "Test", body: body.trim() || "Test body", data },
      {
        onSuccess: (res) => {
          toaster.success("Test sent", `sent=${res.sent_count} · errors=${res.error_count}`);
          const dead = res.tickets.find((t) => t.status === "error" && (t.details as { error?: string })?.error === "DeviceNotRegistered");
          if (dead) toaster.error("Device no longer registered", "Remove this token from your test list.");
        },
        onError: (err) => toaster.error("Test failed", (err as Error).message),
      },
    );
  };

  return (
    <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <header>
          <p className="text-xs font-black uppercase tracking-[.18em] text-[#CA8A04]">Push</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight">Compose notification</h1>
          <p className="mt-2 text-sm font-semibold text-slate-500">
            Live audience estimate + idempotency-safe send. Test on your own device before broadcasting.
          </p>
        </header>

        <Card>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" hint={`${title.length}/120`}>Title</Label>
              <Input id="title" maxLength={120} value={title} onChange={(e) => setTitle(e.target.value)} className="mt-2" />
            </div>
            <div>
              <Label htmlFor="body" hint={`${body.length}/500`}>Body</Label>
              <Textarea id="body" rows={4} maxLength={500} value={body} onChange={(e) => setBody(e.target.value)} className="mt-2" />
            </div>
            <div>
              <Label htmlFor="route">Deep link (optional)</Label>
              <Input id="route" value={route} onChange={(e) => setRoute(e.target.value)} className="mt-2" placeholder="/plan-detail?id=abc" />
              <p className="mt-1 text-xs font-semibold text-slate-500">Sent as <code className="font-mono">data.route</code>.</p>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-black text-[#1E1B4B]">Audience</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <Chip active={kind === "all"} onClick={() => setKind("all")}>Everyone</Chip>
            <Chip active={kind === "platform"} onClick={() => setKind("platform")}>Platform</Chip>
            <Chip active={kind === "tier"} onClick={() => setKind("tier")}>Tier</Chip>
            <Chip active={kind === "device_ids"} onClick={() => setKind("device_ids")}>Custom devices</Chip>
          </div>
          {kind === "platform" ? (
            <div className="mt-4">
              <Label htmlFor="pf">Platform</Label>
              <Select id="pf" value={platform} onChange={(e) => setPlatform(e.target.value as "ios" | "android" | "web")} className="mt-2 max-w-xs">
                <option value="ios">iOS</option>
                <option value="android">Android</option>
                <option value="web">Web</option>
              </Select>
            </div>
          ) : null}
          {kind === "tier" ? (
            <div className="mt-4">
              <Label htmlFor="tier">Tier</Label>
              <Select id="tier" value={tier} onChange={(e) => setTier(e.target.value as "free" | "pro" | "premium")} className="mt-2 max-w-xs">
                <option value="free">Free</option>
                <option value="pro">Pro</option>
                <option value="premium">Premium</option>
              </Select>
            </div>
          ) : null}
          {kind === "device_ids" ? (
            <div className="mt-4">
              <Label hint={`${tokens.length} token${tokens.length === 1 ? "" : "s"}`}>Device tokens</Label>
              <Textarea rows={5} value={tokensRaw} onChange={(e) => setTokensRaw(e.target.value)} className="mt-2 font-mono text-xs" placeholder="Paste ExponentPushToken[...] — one per line or comma-separated" />
            </div>
          ) : null}
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-[#1E1B4B]">Send a test first</h2>
              <p className="text-xs font-semibold text-slate-500">Doesn&rsquo;t write to history.</p>
            </div>
            <Button variant="secondary" size="sm" onClick={() => setTestTokenOpen((v) => !v)} type="button">
              {testTokenOpen ? "Hide" : "Show"}
            </Button>
          </div>
          {testTokenOpen ? (
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Input value={testToken} onChange={(e) => setTestToken(e.target.value)} placeholder="ExponentPushToken[...]" className="flex-1 font-mono text-xs" />
              <Button type="button" onClick={sendTest} loading={testSend.isPending} disabled={!testToken.trim()}>
                Send test
              </Button>
            </div>
          ) : null}
        </Card>
      </div>

      <aside className="space-y-4">
        <Card className="sticky top-24">
          <h3 className="text-xs font-black uppercase tracking-[.16em] text-slate-500">Audience</h3>
          {estimate.isFetching ? (
            <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-500"><Spinner className="h-4 w-4 text-[#312E81]" /> Estimating…</p>
          ) : estimate.isError ? (
            <p className="mt-2 text-sm font-semibold text-red-600">Couldn&rsquo;t estimate</p>
          ) : (
            <p className={"mt-2 text-3xl font-black " + ((estimate.data?.target_count ?? 0) === 0 ? "text-red-600" : "text-[#1E1B4B]")}>
              {(estimate.data?.target_count ?? 0).toLocaleString()}
            </p>
          )}
          <p className="mt-1 text-xs font-semibold text-slate-500">
            {(estimate.data?.target_count ?? 0) > 0 ? "devices will receive this push" : "Nobody matches this audience."}
          </p>
          <hr className="my-4 border-slate-100" />
          <h3 className="text-xs font-black uppercase tracking-[.16em] text-slate-500">Preview</h3>
          <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-900 p-4 text-white">
            <p className="text-[10px] font-black uppercase tracking-[.16em] text-white/50">ACELEY · now</p>
            <p className="mt-1 text-sm font-black">{title || <span className="text-white/40">Title preview</span>}</p>
            <p className="mt-1 text-xs font-semibold text-white/80">{body || <span className="text-white/40">Body preview</span>}</p>
          </div>
          <Button type="button" className="mt-5 w-full" onClick={submit} loading={send.isPending} disabled={!readyToSend}>
            Send now to {(estimate.data?.target_count ?? 0).toLocaleString()}
          </Button>
          <p className="mt-2 text-[10px] font-semibold text-slate-400">
            Idempotency key: <code className="font-mono">{idempotencyKey.slice(0, 8)}…</code>
          </p>
        </Card>
      </aside>
    </div>
  );
}
