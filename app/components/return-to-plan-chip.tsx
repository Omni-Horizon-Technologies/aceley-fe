"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Icon } from "@/app/components/ui";

/**
 * Renders a sticky "Back to plan" chip when the current URL carries
 * `?returnTo=plan:{planId}`. Lets a user return to the originating plan
 * after finishing a quiz / flashcard deck launched from the plan screen.
 */
export function ReturnToPlanChip() {
  const search = useSearchParams();
  const returnTo = search.get("returnTo");
  if (!returnTo) return null;

  const [kind, id] = returnTo.split(":");
  if (kind !== "plan" || !id) return null;

  return (
    <div className="sticky top-0 z-20 mb-4 flex justify-center">
      <Link
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-[#1E1B4B] shadow-sm transition hover:border-[#312E81]/40"
        href={`/plan/${encodeURIComponent(id)}`}
      >
        <Icon name="arrowLeft" className="h-4 w-4" />
        Back to plan
      </Link>
    </div>
  );
}
