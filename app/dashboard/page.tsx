"use client";

import Link from "next/link";
import { AppLayout } from "@/app/components/app-layout";
import { LottieMascot } from "@/app/components/lottie-mascot";
import { CreditChip } from "@/app/components/credit-chip";
import { cn, Icon, ProgressBar } from "@/app/components/ui";
import { useAuth } from "@/services/hooks/useAuth";
import { useHomeDashboard } from "@/services/hooks/useHomeDashboard";

const cards = [
  ["Test Prep", "Ace your next test", "Practice from your notes, docs, and past papers.", "/test-prep", "target", "primary"],
  ["Ask My Docs", "Find answers fast", "Ask questions about your study material.", "/ask", "search", "accent"],
  ["FocusPods", "Get in the zone", "Short guided sessions for focused study.", "/focus", "music", "success"],
  ["AI Tutor", "Learn with guidance", "Explain a topic, solve a problem, or quiz yourself.", "/tutor", "chat", "primary"],
] as const;

export default function DashboardPage() {
  const { profile } = useAuth();
  const { data, isLoading, isError, refetch } = useHomeDashboard();
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
    {isLoading ? <Skeleton /> : isError ? <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-700">We couldn&apos;t load your dashboard. <button className="underline" onClick={() => refetch()}>Try again</button></div> : plan ? <Link href={`/plan/${plan.id}`} className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-[#818CF8] sm:p-6"><p className="text-xs font-black uppercase tracking-[.16em] text-[#CA8A04]">Keep the progress going</p><div className="mt-3 flex items-end justify-between"><div><h2 className="text-xl font-black text-[#0F1626]">{plan.title || plan.subject || "Active study plan"}</h2><p className="mt-1 text-sm font-semibold text-slate-500">Day {Math.min(plan.completed_days + 1, plan.total_days)} of {plan.total_days}</p></div><b className="text-lg text-[#312E81]">{percent}%</b></div><div className="mt-4"><ProgressBar value={percent} label="Study plan progress" /></div>{data.next_task?.title || data.next_task?.focus ? <p className="mt-4 text-sm font-semibold text-slate-600">Next up: {data.next_task.title || data.next_task.focus}</p> : null}</Link> : <Link href="/plan/new" className="flex items-center justify-between gap-4 rounded-2xl border border-dashed border-[#818CF8] bg-white p-5 shadow-sm"><div><h2 className="text-lg font-black text-[#0F1626]">Build your first plan</h2><p className="mt-1 text-sm font-semibold text-slate-500">Set an exam date and daily target.</p></div><span className="rounded-full bg-[#FACC15] px-4 py-2 text-sm font-black text-[#312E81]">Get started</span></Link>}
    <section><p className="text-xs font-black uppercase tracking-[.18em] text-slate-500">Build your day</p><div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3">{cards.map(([label, title, detail, href, icon, tone], i) => <Link key={label} href={href} className={cn("rounded-2xl p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md", tone === "primary" ? "bg-[#312E81] text-white" : tone === "accent" ? "bg-[#FACC15] text-[#0F1626]" : "bg-[#10B981] text-white", i === 0 && "md:row-span-2", i === 3 && "md:col-span-2")}><Icon name={icon} className="h-7 w-7" /><h2 className="mt-8 text-xl font-black">{title}</h2><p className="mt-2 text-sm font-medium opacity-80">{detail}</p><span className="mt-6 inline-flex text-sm font-black">{label} <span className="ml-2">→</span></span></Link>)}</div></section>
    <div className="flex flex-wrap items-center gap-3"><span className="text-xs font-black uppercase tracking-[.16em] text-slate-500">Quick tools</span><QuickLink href="/study-pack" icon="notes">Smart Notes</QuickLink><QuickLink href="/scan" icon="scan">Scan a page</QuickLink></div>
  </main></AppLayout>;
}

function Pill({ icon, children }: { icon: "flame" | "calendar"; children: React.ReactNode }) { return <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black shadow-sm"><Icon name={icon} className={cn("h-4 w-4", icon === "flame" ? "text-[#F59E0B]" : "text-[#312E81]")} />{children}</span>; }
function QuickLink({ href, icon, children }: { href: string; icon: "notes" | "scan"; children: string }) { return <Link href={href} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-[#312E81] shadow-sm"><Icon name={icon} className="h-4 w-4" />{children}</Link>; }
function Skeleton() { return <div className="animate-pulse space-y-3"><div className="h-28 rounded-2xl bg-slate-200" /><div className="h-24 rounded-2xl bg-slate-200" /><div className="h-64 rounded-2xl bg-slate-200" /></div>; }
function daysUntil(date: string) { return Math.max(0, Math.ceil((new Date(`${date}T00:00:00`).getTime() - Date.now()) / 86400000)); }
