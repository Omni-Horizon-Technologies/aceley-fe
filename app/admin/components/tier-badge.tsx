import type { Tier } from "@/app/admin/lib/types";

const styles: Record<Tier, string> = {
  none: "bg-slate-100 text-slate-600 border-slate-200",
  small: "bg-blue-50 text-blue-700 border-blue-200",
  best: "bg-purple-50 text-purple-700 border-purple-200",
  unlimited: "bg-amber-50 text-amber-700 border-amber-200",
};

const labels: Record<Tier, string> = {
  none: "Free",
  small: "Small",
  best: "Best",
  unlimited: "Unlimited",
};

export function TierBadge({ tier }: { tier: Tier }) {
  return (
    <span
      className={
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wide " +
        styles[tier]
      }
    >
      {labels[tier]}
    </span>
  );
}
