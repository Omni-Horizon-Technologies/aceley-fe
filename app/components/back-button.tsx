"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/app/components/ui";

type Variant = "surface" | "ghost" | "solid";

const VARIANT_STYLES: Record<Variant, string> = {
  // Frosted white pill — reads clean against the aurora background.
  surface:
    "bg-white/80 text-[#1E1B4B] shadow-[0_2px_10px_rgba(30,27,75,0.08)] backdrop-blur-md ring-1 ring-inset ring-white/60 hover:bg-white hover:shadow-[0_6px_20px_rgba(30,27,75,0.14)]",
  // Transparent — sits inside a card / already-tinted surface.
  ghost:
    "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-[#1E1B4B]",
  // Dark filled — for light on light contexts where we need presence.
  solid:
    "bg-[#1E1B4B] text-white shadow-md hover:bg-[#312E81]",
};

export function BackButton({
  className,
  fallbackHref = "/dashboard",
  variant = "surface",
  label,
}: {
  className?: string;
  fallbackHref?: string;
  variant?: Variant;
  label?: string;
}) {
  const router = useRouter();

  function goBack() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push(fallbackHref);
  }

  const hasLabel = Boolean(label);

  return (
    <button
      aria-label={hasLabel ? undefined : "Go back to previous page"}
      className={cn(
        "group inline-flex shrink-0 items-center justify-center rounded-full transition-all duration-200",
        "focus:outline-none focus-visible:ring-4 focus-visible:ring-[#1E1B4B]/15",
        "active:scale-95",
        VARIANT_STYLES[variant],
        hasLabel ? "h-11 gap-2 pr-4 pl-3.5" : "h-11 w-11",
        className,
      )}
      onClick={goBack}
      type="button"
    >
      <svg
        aria-hidden="true"
        className="transition-transform duration-200 group-hover:-translate-x-0.5"
        fill="none"
        height="18"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.4"
        viewBox="0 0 24 24"
        width="18"
      >
        <path d="M19 12H5" />
        <path d="m12 19-7-7 7-7" />
      </svg>
      {hasLabel ? <span className="text-sm font-black">{label}</span> : null}
    </button>
  );
}
