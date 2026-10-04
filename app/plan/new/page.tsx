"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/app/components/app-layout";
import { usePlanBuilder } from "@/app/components/use-plan-builder";
import { Icon } from "@/app/components/ui";

export default function Page() {
  const router = useRouter();
  const planBuilder = usePlanBuilder();

  useEffect(() => {
    planBuilder.open();
    // Mount-time trigger only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppLayout>
      <main className="mx-auto flex min-h-[50vh] max-w-xl flex-col items-center justify-center text-center">
        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-[#312E81]/10 text-[#312E81]">
          <Icon name="calendar" className="h-8 w-8" />
        </span>
        <h1 className="mt-5 text-2xl font-black tracking-tight text-[#1E1B4B] sm:text-3xl">
          Let&apos;s build your plan
        </h1>
        <p className="mt-3 max-w-md text-sm font-semibold text-slate-500">
          Pick what you want to study from and we&apos;ll shape a 14-day plan around
          it.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            className="rounded-full bg-[#312E81] px-5 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-[#1E1B4B]"
            onClick={planBuilder.open}
            type="button"
          >
            Pick a source
          </button>
          <button
            className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-black text-slate-600 transition hover:border-slate-300"
            onClick={() => router.replace("/dashboard")}
            type="button"
          >
            Back to dashboard
          </button>
        </div>
        {planBuilder.element}
      </main>
    </AppLayout>
  );
}
