"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CREDITS_QUERY_KEY } from "@/services/hooks/useCredits";

type Detail = { required: number; available: number };

export function InsufficientCreditsSheet() {
  const router = useRouter();
  const qc = useQueryClient();
  const [detail, setDetail] = useState<Detail | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<Detail>;
      qc.invalidateQueries({ queryKey: CREDITS_QUERY_KEY });
      setDetail(ce.detail ?? { required: 0, available: 0 });
    };
    window.addEventListener("aceley:insufficient-credits", handler);
    return () => window.removeEventListener("aceley:insufficient-credits", handler);
  }, [qc]);

  useEffect(() => {
    if (!detail) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDetail(null);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [detail]);

  if (!detail) return null;

  const shortBy = Math.max(0, detail.required - detail.available);

  return (
    <div className="fixed inset-0 z-[75] flex items-end justify-center sm:items-center" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-[#1E1B4B]/45" onClick={() => setDetail(null)} aria-hidden="true" />
      <div className="relative w-full max-w-md rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-200 sm:hidden" />
        <div className="flex items-start gap-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#FACC15] text-[#1E1B4B]">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
              <path d="M12 2 15 9l7 .8-5.3 4.8L18.2 22 12 18l-6.2 4 1.5-7.4L2 9.8 9 9l3-7Z" />
            </svg>
          </span>
          <div className="flex-1">
            <h2 className="text-xl font-black tracking-tight text-[#1E1B4B]">Not enough credits</h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              This action needs <b className="text-[#1E1B4B]">{detail.required.toLocaleString()}</b>. You have{" "}
              <b className="text-[#1E1B4B]">{detail.available.toLocaleString()}</b>.
            </p>
            {shortBy > 0 ? (
              <p className="mt-1 text-xs font-black text-[#CA8A04]">
                Short by {shortBy.toLocaleString()} credit{shortBy === 1 ? "" : "s"}.
              </p>
            ) : null}
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-2">
          <button
            className="min-h-12 w-full rounded-full bg-gradient-to-r from-[#1E1B4B] to-[#312E81] px-6 text-sm font-black text-white shadow-[0_12px_30px_rgba(30,27,75,0.28)] transition hover:shadow-[0_18px_40px_rgba(30,27,75,0.35)]"
            onClick={() => {
              setDetail(null);
              router.push("/paywall");
            }}
            type="button"
          >
            Get more credits
          </button>
          <button
            className="min-h-11 w-full text-sm font-black text-slate-500 transition hover:text-[#312E81]"
            onClick={() => setDetail(null)}
            type="button"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
