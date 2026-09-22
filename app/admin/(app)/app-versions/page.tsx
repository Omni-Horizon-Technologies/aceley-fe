"use client";

import { useMemo, useState } from "react";
import { useAppVersions, useUpdateAppVersion } from "@/app/admin/lib/hooks";
import type { AppVersionConfig, AppVersionUpdate, Platform } from "@/app/admin/lib/types";
import { Button, Card, Chip, ErrorBanner, Input, Label, Spinner, Textarea } from "@/app/admin/components/ui";
import { useToaster } from "@/app/admin/components/toaster";

const SEMVER = /^\d+\.\d+\.\d+$/;

export default function AppVersionsPage() {
  const [platform, setPlatform] = useState<Platform>("ios");
  const query = useAppVersions();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header>
        <p className="text-xs font-black uppercase tracking-[.18em] text-[#CA8A04]">Mobile</p>
        <h1 className="mt-1 text-3xl font-black tracking-tight">App version gating</h1>
        <p className="mt-2 text-sm font-semibold text-slate-500">
          Control the mobile app&rsquo;s force/optional update behavior per platform.
        </p>
      </header>

      <div className="flex gap-2">
        <Chip active={platform === "ios"} onClick={() => setPlatform("ios")}>iOS</Chip>
        <Chip active={platform === "android"} onClick={() => setPlatform("android")}>Android</Chip>
      </div>

      {query.isLoading ? (
        <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
          <Spinner className="h-5 w-5 text-[#312E81]" /> Loading configs…
        </div>
      ) : query.isError ? (
        <ErrorBanner message={(query.error as Error).message} onRetry={() => query.refetch()} />
      ) : query.data ? (
        <PlatformForm
          key={platform}
          platform={platform}
          initial={query.data[platform] ?? emptyConfig(platform)}
        />
      ) : null}
    </div>
  );
}

const DEFAULT_UPDATE_URLS: Record<Platform, string> = {
  ios: "https://apps.apple.com/us/app/aceley/id6478291234",
  android: "",
};

function emptyConfig(platform: Platform): AppVersionConfig {
  return {
    platform,
    enabled: false,
    minimum_supported_version: "1.0.0",
    latest_version: "1.0.0",
    force_update_message: "",
    optional_update_message: "",
    update_url: DEFAULT_UPDATE_URLS[platform],
    release_notes: "",
    created_at: "",
    updated_at: "",
    updated_by: null,
  };
}

function withDefaults(cfg: AppVersionConfig, platform: Platform): AppVersionConfig {
  return {
    ...cfg,
    update_url: cfg.update_url?.trim() ? cfg.update_url : DEFAULT_UPDATE_URLS[platform],
  };
}

function PlatformForm({ platform, initial }: { platform: Platform; initial: AppVersionConfig }) {
  const toaster = useToaster();
  const mutation = useUpdateAppVersion(platform);
  const seeded = withDefaults(initial, platform);
  const initSignature = initial.updated_at || `${initial.minimum_supported_version}-${initial.latest_version}`;
  const [signature, setSignature] = useState(initSignature);
  const [form, setForm] = useState<AppVersionConfig>(seeded);
  if (initSignature !== signature) {
    setSignature(initSignature);
    setForm(seeded);
  }

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!SEMVER.test(form.minimum_supported_version)) e.minimum_supported_version = "Must be X.Y.Z";
    if (!SEMVER.test(form.latest_version)) e.latest_version = "Must be X.Y.Z";
    if (!e.minimum_supported_version && !e.latest_version) {
      if (cmpSemver(form.latest_version, form.minimum_supported_version) < 0) {
        e.latest_version = "Latest must be ≥ minimum supported";
      }
    }
    if (form.enabled && !form.update_url.trim()) e.update_url = "Required when Enabled is on";
    if (form.force_update_message.length > 500) e.force_update_message = "Max 500 chars";
    if (form.optional_update_message.length > 500) e.optional_update_message = "Max 500 chars";
    if (form.update_url.length > 500) e.update_url = "Max 500 chars";
    if (form.release_notes.length > 2000) e.release_notes = "Max 2000 chars";
    return e;
  }, [form]);

  const isDirty = JSON.stringify(form) !== JSON.stringify(initial);
  const canSave = isDirty && Object.keys(errors).length === 0 && !mutation.isPending;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave) return;
    const patch: AppVersionUpdate = {
      enabled: form.enabled,
      minimum_supported_version: form.minimum_supported_version,
      latest_version: form.latest_version,
      force_update_message: form.force_update_message,
      optional_update_message: form.optional_update_message,
      update_url: form.update_url,
      release_notes: form.release_notes,
    };
    mutation.mutate(patch, {
      onSuccess: () => toaster.success(`${platform === "ios" ? "iOS" : "Android"} config saved`),
      onError: (err) => toaster.error("Save failed", (err as Error).message),
    });
  };

  return (
    <form className="space-y-6" onSubmit={submit}>
      <Card>
        <label className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-[#1E1B4B]">Enabled</h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              When on, the app enforces update behavior based on the versions below.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={form.enabled}
            onClick={() => setForm((f) => ({ ...f, enabled: !f.enabled }))}
            className={"relative h-7 w-12 rounded-full transition " + (form.enabled ? "bg-[#10B981]" : "bg-slate-300")}
          >
            <span
              className={
                "absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition " +
                (form.enabled ? "left-[22px]" : "left-0.5")
              }
            />
          </button>
        </label>
        {form.enabled ? (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-black text-amber-800">
            ⚠️ This will show a blocking update dialog to users on versions below {form.minimum_supported_version}.
          </div>
        ) : null}
      </Card>

      <Card>
        <h2 className="text-lg font-black text-[#1E1B4B]">Versions</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="min">Minimum supported</Label>
            <Input id="min" value={form.minimum_supported_version} onChange={(e) => setForm((f) => ({ ...f, minimum_supported_version: e.target.value }))} className="mt-2" placeholder="1.2.0" />
            {errors.minimum_supported_version ? <p className="mt-1 text-xs font-black text-red-600">{errors.minimum_supported_version}</p> : null}
          </div>
          <div>
            <Label htmlFor="latest">Latest</Label>
            <Input id="latest" value={form.latest_version} onChange={(e) => setForm((f) => ({ ...f, latest_version: e.target.value }))} className="mt-2" placeholder="1.4.0" />
            {errors.latest_version ? <p className="mt-1 text-xs font-black text-red-600">{errors.latest_version}</p> : null}
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-black text-[#1E1B4B]">Messages</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <MessageBlock
            label="Force update"
            hint={`${form.force_update_message.length}/500`}
            value={form.force_update_message}
            onChange={(v) => setForm((f) => ({ ...f, force_update_message: v }))}
            error={errors.force_update_message}
          />
          <MessageBlock
            label="Optional update"
            hint={`${form.optional_update_message.length}/500`}
            value={form.optional_update_message}
            onChange={(v) => setForm((f) => ({ ...f, optional_update_message: v }))}
            error={errors.optional_update_message}
          />
        </div>
        <div className="mt-6">
          <Label htmlFor="url">Update URL</Label>
          <Input id="url" value={form.update_url} onChange={(e) => setForm((f) => ({ ...f, update_url: e.target.value }))} className="mt-2" placeholder="https://apps.apple.com/…" />
          {errors.update_url ? <p className="mt-1 text-xs font-black text-red-600">{errors.update_url}</p> : null}
        </div>
        <div className="mt-6">
          <Label htmlFor="notes">Release notes</Label>
          <Textarea id="notes" rows={5} value={form.release_notes} onChange={(e) => setForm((f) => ({ ...f, release_notes: e.target.value }))} className="mt-2 font-mono text-xs" placeholder="- Fixed…&#10;- Improved…" />
          {errors.release_notes ? <p className="mt-1 text-xs font-black text-red-600">{errors.release_notes}</p> : null}
        </div>
      </Card>

      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-xs font-semibold text-slate-500">
          Last updated {fmt(initial.updated_at)}
          {initial.updated_by ? <> by <b className="text-[#1E1B4B]">{initial.updated_by}</b></> : null}
        </p>
        <div className="flex gap-3">
          <Button type="button" variant="ghost" onClick={() => setForm(initial)} disabled={!isDirty || mutation.isPending}>
            Discard
          </Button>
          <Button type="submit" loading={mutation.isPending} disabled={!canSave}>
            Save changes
          </Button>
        </div>
      </div>
    </form>
  );
}

function MessageBlock({ label, hint, value, onChange, error }: { label: string; hint: string; value: string; onChange: (v: string) => void; error?: string }) {
  return (
    <div>
      <Label hint={hint}>{label}</Label>
      <Textarea rows={4} value={value} onChange={(e) => onChange(e.target.value)} className="mt-2" />
      {error ? <p className="mt-1 text-xs font-black text-red-600">{error}</p> : null}
      <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
        <p className="text-[10px] font-black uppercase tracking-[.14em] text-slate-500">Preview</p>
        <p className="mt-1 text-sm font-semibold text-[#1E1B4B]">{value || <span className="italic text-slate-400">(empty)</span>}</p>
      </div>
    </div>
  );
}

function cmpSemver(a: string, b: string): number {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < 3; i++) {
    const da = pa[i] ?? 0;
    const db = pb[i] ?? 0;
    if (da !== db) return da - db;
  }
  return 0;
}

function fmt(iso: string) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleString();
}
