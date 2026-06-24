"use client";

import { useRouter } from "next/navigation";
import { Icon, cn } from "@/app/components/ui";

export function BackButton({
  className,
  fallbackHref = "/dashboard",
}: {
  className?: string;
  fallbackHref?: string;
}) {
  const router = useRouter();

  function goBack() {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push(fallbackHref);
  }

  return (
    <button
      aria-label="Go back to previous page"
      className={cn(
        "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-[#1E1B4B] shadow-sm transition hover:border-[#FACC15]/60 hover:text-[#CA8A04] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#FACC15]/20",
        className,
      )}
      onClick={goBack}
      type="button"
    >
      <Icon name="arrowLeft" />
    </button>
  );
}
