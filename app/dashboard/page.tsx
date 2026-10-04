"use client";

import Link from "next/link";
import { AppLayout } from "@/app/components/app-layout";
import { LottieMascot } from "@/app/components/lottie-mascot";
import { CreditChip } from "@/app/components/credit-chip";
import { cn, Icon, ProgressBar } from "@/app/components/ui";
import { usePlanBuilder } from "@/app/components/use-plan-builder";
import { useAuth } from "@/services/hooks/useAuth";
import { useHomeDashboard } from "@/services/hooks/useHomeDashboard";

export default function DashboardPage() {
  const { profile } = useAuth();
  const { data, isLoading, isError, refetch } = useHomeDashboard();
  const planBuilder = usePlanBuilder();
  const name = profile?.nickname?.trim() || profile?.email?.split("@")[0] || "there";
  const plan = data?.active_plan;
  const percent = plan?.total_days ? Math.round((plan.completed_days / plan.total_days) * 100) : 0;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return <AppLayout><main className="mx-auto max-w-6xl space-y-8">
    <section className="relative overflow-hidden rounded-[24px] bg-[#312E81] px-6 py-6 text-white sm:px-8">
      <div className="absolute right-4 top-4 z-20"><CreditChip /></div>
      <div className="relative z-10 flex items-center gap-4"><LottieMascot className="h-20 w-20 shrink-0 sm:h-24 sm:w-24" /><div><p className="text-sm font-semibold text-white/70">{greeting}</p><h1 className="mt-1 text-2xl font-black sm:text-3xl">Hi {name} 👋</h1><p className="mt-1 text-sm font-medium text-white/80">Ready when you are.</p></div></div>
      <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-[#818CF8]/30 blur-2xl" />
    </section>
    {data && (data.streak_days > 0 || plan?.exam_date) ? <div className="flex flex-wrap gap-2">{data.streak_days > 0 && <Pill icon="flame">🔥 {data.streak_days}-day streak</Pill>}{plan?.exam_date && <Pill icon="calendar">📅 {daysUntil(plan.exam_date)}d to {plan.exam_name || plan.subject || "your exam"}</Pill>}</div> : null}
    {isLoading ? <Skeleton /> : isError ? <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-700">We couldn&apos;t load your dashboard. <button className="underline" onClick={() => refetch()}>Try again</button></div> : plan ? <Link href={`/plan/${plan.id}`} className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-[#818CF8] sm:p-6"><p className="text-xs font-black uppercase tracking-[.16em] text-[#CA8A04]">Keep the progress going</p><div className="mt-3 flex items-end justify-between"><div><h2 className="text-xl font-black text-[#0F1626]">{plan.title || plan.subject || "Active study plan"}</h2><p className="mt-1 text-sm font-semibold text-slate-500">Day {Math.min(plan.completed_days + 1, plan.total_days)} of {plan.total_days}</p></div><b className="text-lg text-[#312E81]">{percent}%</b></div><div className="mt-4"><ProgressBar value={percent} label="Study plan progress" /></div>{data.next_task?.title || data.next_task?.focus ? <p className="mt-4 text-sm font-semibold text-slate-600">Next up: {data.next_task.title || data.next_task.focus}</p> : null}</Link> : <button type="button" onClick={planBuilder.open} className="flex w-full items-center justify-between gap-4 rounded-2xl border border-dashed border-[#818CF8] bg-white p-5 text-left shadow-sm transition hover:border-[#312E81] hover:shadow-md"><div><h2 className="text-lg font-black text-[#0F1626]">Build your first plan</h2><p className="mt-1 text-sm font-semibold text-slate-500">Pick a source — we&apos;ll handle the rest.</p></div><span className="rounded-full bg-[#FACC15] px-4 py-2 text-sm font-black text-[#312E81]">Get started</span></button>}
    <section>
      <p className="text-xs font-black uppercase tracking-[.18em] text-slate-500">Build your day</p>
      <div className="mt-3 space-y-3">
        <Link
          href="/test-prep"
          className="group block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[#312E81]/30 hover:shadow-md sm:p-8"
        >
          <div className="flex items-start gap-4">
            <span className="relative grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#312E81]/10">
              <Icon name="target" className="h-7 w-7 text-[#312E81]" />
              <Icon name="spark" className="absolute -top-1.5 -right-1.5 hidden h-5 w-5 text-[#CA8A04] sm:block" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-black uppercase tracking-[.18em] text-[#CA8A04]">Test Prep</p>
              <h2 className="mt-2 text-2xl font-black leading-tight text-[#0F1626] sm:text-3xl">
                Ace your next test
              </h2>
              <p className="mt-2 max-w-xl text-sm font-medium text-slate-600 sm:text-base">
                Practice, drill, and quiz — lock in the subject that matters.
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#312E81]">
                Start prepping <span aria-hidden="true">→</span>
              </span>
            </div>
          </div>
        </Link>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href="/tutor"
            className="group block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#312E81]/30 hover:shadow-md"
          >
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-[#312E81]/10">
              <Icon name="chat" className="h-6 w-6 text-[#312E81]" />
            </span>
            <h2 className="mt-5 text-xl font-black text-[#0F1626]">AI Tutor</h2>
            <p className="mt-2 text-sm font-medium text-slate-600">
              Learn anything, ask anytime.
            </p>
          </Link>
          <Link
            href="/ask"
            className="group block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#CA8A04]/40 hover:shadow-md"
          >
            <span className="relative grid h-12 w-12 place-items-center rounded-xl bg-[#FACC15]/20">
              <Icon name="file" className="h-6 w-6 text-[#CA8A04]" />
              <Icon name="search" className="absolute -bottom-1 -right-1 h-5 w-5 text-[#CA8A04]" />
            </span>
            <h2 className="mt-5 text-xl font-black text-[#0F1626]">Ask My Docs</h2>
            <p className="mt-2 text-sm font-medium text-slate-600">
              Chat with anything you upload.
            </p>
          </Link>
        </div>
      </div>
    </section>
    {planBuilder.element}
  </main></AppLayout>;
}

function Pill({ icon, children }: { icon: "flame" | "calendar"; children: React.ReactNode }) { return <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black shadow-sm"><Icon name={icon} className={cn("h-4 w-4", icon === "flame" ? "text-[#F59E0B]" : "text-[#312E81]")} />{children}</span>; }
function Skeleton() { return <div className="animate-pulse space-y-3"><div className="h-28 rounded-2xl bg-slate-200" /><div className="h-24 rounded-2xl bg-slate-200" /><div className="h-64 rounded-2xl bg-slate-200" /></div>; }
function daysUntil(date: string) { return Math.max(0, Math.ceil((new Date(`${date}T00:00:00`).getTime() - Date.now()) / 86400000)); }
