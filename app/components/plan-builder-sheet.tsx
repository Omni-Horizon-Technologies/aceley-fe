"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon, PrimaryButton, SecondaryButton, cn } from "@/app/components/ui";
import { useCreateStudyPlan } from "@/services/hooks/useStudyPlans";
import type { PlanConfidence, PlanSource } from "@/services/dtos/study-plans";
import { ApiError } from "@/services/apiClient";

function sourceIcon(type: PlanSource["type"]): Parameters<typeof Icon>[0]["name"] {
  switch (type) {
    case "text":
      return "notes";
    case "file":
    case "pdf":
      return "file";
    case "youtu":
      return "play";
    case "url":
      return "upload";
    case "image":
      return "image";
    case "scan":
      return "scan";
  }
}

function isPremiumRequired(err: unknown): boolean {
  return err instanceof ApiError && err.status === 402;
}
function isRateLimited(err: unknown): boolean {
  return err instanceof ApiError && err.status === 429;
}

const CONFIDENCE_OPTIONS: Array<{ id: PlanConfidence; label: string; sub: string }> = [
  { id: "low", label: "Low", sub: "New ground." },
  { id: "medium", label: "Medium", sub: "Some familiarity." },
  { id: "high", label: "High", sub: "Mostly review." },
];

export function PlanBuilderSheet({
  open,
  source,
  onClose,
}: {
  open: boolean;
  source: PlanSource | null;
  onClose: () => void;
}) {
  const router = useRouter();
  const [hoursPerDay, setHoursPerDay] = useState(1);
  const [confidence, setConfidence] = useState<PlanConfidence>("medium");
  const [error, setError] = useState("");
  const create = useCreateStudyPlan();

  if (!open || !source) return null;

  async function submit() {
    if (!source) return;
    setError("");
    try {
      const plan = await create.mutateAsync({
        hours_per_day: hoursPerDay,
        confidence,
        sources: [source],
      });
      onClose();
      router.push(`/plan/${plan.id}`);
    } catch (err) {
      if (isPremiumRequired(err)) {
        onClose();
        router.push("/paywall");
        return;
      }
      if (isRateLimited(err)) {
        setError("Slow down a moment and try again.");
        return;
      }
      setError(err instanceof Error ? err.message : "Couldn't build your plan.");
    }
  }

  const submitting = create.isPending;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 px-3 pb-3 sm:items-center sm:p-6"
      onClick={submitting ? undefined : onClose}
    >
      <div
        className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[.18em] text-[#CA8A04]">
              Configure plan
            </p>
            <h2 className="mt-1 text-xl font-black text-[#1E1B4B]">
              A couple of details and we&apos;re off.
            </h2>
          </div>
          <button
            aria-label="Close"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-500 transition hover:bg-slate-200"
            disabled={submitting}
            onClick={onClose}
            type="button"
          >
            <Icon name="x" className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-slate-200 bg-[#F8FAFC] p-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#312E81]/10 text-[#312E81]">
            <Icon name={sourceIcon(source.type)} className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-black text-[#1E1B4B]">
              {source.label || source.ref}
            </p>
            <p className="mt-0.5 text-xs font-semibold uppercase tracking-[.14em] text-slate-500">
              {source.type}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-baseline justify-between">
            <label className="text-sm font-black text-[#1E1B4B]" htmlFor="hours-per-day">
              Hours per day
            </label>
            <span className="text-sm font-black text-[#312E81]">
              {hoursPerDay} hr{hoursPerDay === 1 ? "" : "s"}
            </span>
          </div>
          <input
            className="mt-3 w-full accent-[#312E81]"
            id="hours-per-day"
            max={6}
            min={1}
            onChange={(e) => setHoursPerDay(Number(e.target.value))}
            step={0.5}
            type="range"
            value={hoursPerDay}
          />
          <div className="mt-1 flex justify-between text-[11px] font-semibold text-slate-400">
            <span>1 hr</span>
            <span>6 hrs</span>
          </div>
        </div>

        <fieldset className="mt-6">
          <legend className="text-sm font-black text-[#1E1B4B]">
            How confident are you?
          </legend>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {CONFIDENCE_OPTIONS.map((opt) => (
              <button
                className={cn(
                  "flex flex-col items-start rounded-2xl border p-3 text-left transition",
                  confidence === opt.id
                    ? "border-[#312E81] bg-[#312E81]/5 text-[#1E1B4B]"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
                )}
                key={opt.id}
                onClick={() => setConfidence(opt.id)}
                type="button"
              >
                <span className="text-sm font-black">{opt.label}</span>
                <span className="mt-1 text-xs font-semibold text-slate-500">
                  {opt.sub}
                </span>
              </button>
            ))}
          </div>
        </fieldset>

        {error && (
          <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">
            {error}
          </p>
        )}

        <div className="mt-6 flex gap-3">
          <SecondaryButton className="flex-1" disabled={submitting} onClick={onClose}>
            Cancel
          </SecondaryButton>
          <PrimaryButton className="flex-1" disabled={submitting} onClick={submit}>
            {submitting ? "Building…" : "Build plan"}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
