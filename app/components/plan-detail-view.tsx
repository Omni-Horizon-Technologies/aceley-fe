"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Icon,
  PrimaryButton,
  SecondaryButton,
  cn,
} from "@/app/components/ui";
import {
  useDeleteStudyPlan,
  usePatchStudyTask,
  useStudyPlan,
} from "@/services/hooks/useStudyPlans";
import type { StudyPlan, StudyTask } from "@/services/dtos/study-plans";

function utcDayNumber(iso: string | Date | number): number {
  const d = typeof iso === "string" || typeof iso === "number" ? new Date(iso) : iso;
  return Math.floor(d.getTime() / 86_400_000);
}

function computeTotalDays(plan: StudyPlan): number {
  return plan.total_days ?? plan.days.length;
}

function computeCompletedDays(plan: StudyPlan): number {
  if (plan.completed_days !== undefined && plan.completed_days !== null) {
    return plan.completed_days;
  }
  return plan.days.reduce(
    (acc, d) => acc + (d.tasks.length > 0 && d.tasks.every((t) => t.done) ? 1 : 0),
    0,
  );
}

function computeEnterableDayIndex(plan: StudyPlan): number {
  const total = computeTotalDays(plan);
  if (plan.enterable_day_index !== null && plan.enterable_day_index !== undefined) {
    return Math.max(0, Math.min(total - 1, plan.enterable_day_index));
  }
  const today = utcDayNumber(Date.now());
  // Prefer matching by each day's own date — the authoritative server rule.
  const matchByDate = plan.days.findIndex(
    (d) => d.date && utcDayNumber(d.date) === today,
  );
  if (matchByDate !== -1) return matchByDate;
  // Today is beyond the schedule → the final day stays enterable.
  const lastDate = plan.days
    .map((d) => (d.date ? utcDayNumber(d.date) : null))
    .filter((n): n is number => n !== null)
    .at(-1);
  if (lastDate !== undefined && today > lastDate) {
    return Math.max(0, total - 1);
  }
  // Today is before the plan start → index 0.
  return 0;
}

export function PlanDetailView({ id }: { id: string }) {
  const router = useRouter();
  const plan = useStudyPlan(id);
  const patchTask = usePatchStudyTask(id);
  const deletePlan = useDeleteStudyPlan();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [modeForTask, setModeForTask] = useState<StudyTask | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const totalDays = plan.data ? computeTotalDays(plan.data) : 0;
  const completedDays = plan.data ? computeCompletedDays(plan.data) : 0;
  const enterableIndex = plan.data ? computeEnterableDayIndex(plan.data) : 0;
  const activeIndex = selectedDay ?? enterableIndex;
  // Mobile caps the pill row at 14 but this backend ships 14 study days + an
  // exam day = 15 entries; show whatever the backend returns, capped at 15.
  const daysToShow = plan.data?.days.slice(0, 15) ?? [];
  const currentDay = plan.data?.days[activeIndex];
  const dayOpen = activeIndex === enterableIndex;

  const progress = useMemo(() => {
    if (!totalDays) return 0;
    return Math.round((completedDays / totalDays) * 100);
  }, [totalDays, completedDays]);

  if (plan.isLoading) {
    return (
      <div className="animate-pulse space-y-4" aria-label="Loading study plan">
        <div className="h-10 w-48 rounded-lg bg-slate-200" />
        <div className="h-32 w-full rounded-2xl bg-slate-200" />
        <div className="h-20 w-full rounded-2xl bg-slate-200" />
        <div className="h-64 w-full rounded-2xl bg-slate-200" />
      </div>
    );
  }

  if (plan.isError || !plan.data) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
        <h1 className="text-xl font-black text-red-700">Plan not found</h1>
        <p className="mt-2 text-sm font-semibold text-red-700/80">
          We couldn&apos;t load this plan. It may have been deleted.
        </p>
        <button
          className="mt-4 rounded-full bg-[#1E1B4B] px-4 py-2 text-sm font-black text-white"
          onClick={() => router.replace("/dashboard")}
          type="button"
        >
          Back to dashboard
        </button>
      </div>
    );
  }

  const data = plan.data;

  function handleTaskToggle(task: StudyTask) {
    if (!dayOpen) return;
    if (task.activities_status !== "ready") return;
    patchTask.mutate({ taskId: task.id, done: !task.done });
  }

  function handleTaskOpen(task: StudyTask) {
    if (!dayOpen) return;
    if (task.activities_status !== "ready") return;
    setModeForTask(task);
  }

  async function handleDelete() {
    try {
      await deletePlan.mutateAsync(data.id);
      setConfirmDelete(false);
      router.replace("/dashboard");
    } catch {
      setConfirmDelete(false);
    }
  }

  return (
    <div className="space-y-6 pb-24">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[.18em] text-[#CA8A04]">
            Study plan
          </p>
          <h1 className="mt-1 truncate text-2xl font-black text-[#1E1B4B] sm:text-3xl">
            {data.title || data.subject || "Study plan"}
          </h1>
          <p className="mt-1 text-sm font-semibold text-slate-500">
            Day {Math.min(completedDays + 1, totalDays)} of {totalDays}
            {" · "}
            {data.hours_per_day} hr/day · {data.confidence} confidence
          </p>
        </div>
        <div className="relative">
          <button
            aria-label="Plan menu"
            className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-slate-300"
            onClick={() => setMenuOpen((v) => !v)}
            type="button"
          >
            <Icon name="edit" className="h-4 w-4" />
          </button>
          {menuOpen && (
            <div
              className="absolute right-0 top-11 z-20 w-44 rounded-xl border border-slate-200 bg-white p-1 shadow-lg"
              onMouseLeave={() => setMenuOpen(false)}
            >
              <button
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-black text-red-600 hover:bg-red-50"
                onClick={() => {
                  setMenuOpen(false);
                  setConfirmDelete(true);
                }}
                type="button"
              >
                <Icon name="delete" className="h-4 w-4" />
                Delete plan
              </button>
            </div>
          )}
        </div>
      </header>

      <section className="rounded-2xl bg-gradient-to-br from-[#312E81] to-[#1E1B4B] p-6 text-white shadow-sm">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[.18em] text-white/60">
              Progress
            </p>
            <p className="mt-1 text-3xl font-black">{progress}%</p>
          </div>
          <p className="text-sm font-semibold text-white/80">
            {completedDays} / {totalDays} days complete
          </p>
        </div>
        <div
          aria-label={`Plan progress: ${progress}%`}
          className="mt-4 h-2 w-full overflow-hidden rounded-lg bg-white/15"
        >
          <div
            className="h-full rounded-lg bg-[#FACC15]"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      </section>

      <section>
        <p className="text-xs font-black uppercase tracking-[.18em] text-slate-500">
          Days
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {daysToShow.map((day, idx) => {
            const complete =
              day.tasks.length > 0 && day.tasks.every((t) => t.done);
            const isActive = idx === activeIndex;
            const isEnterable = idx === enterableIndex;
            return (
              <button
                className={cn(
                  "min-h-10 rounded-full border px-4 py-2 text-sm font-black transition",
                  isActive
                    ? "border-[#312E81] bg-[#312E81] text-white"
                    : complete
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : isEnterable
                        ? "border-[#FACC15] bg-[#FACC15]/15 text-[#1E1B4B]"
                        : "border-slate-200 bg-white text-slate-500",
                )}
                key={day.day ?? day.day_index ?? idx}
                onClick={() => setSelectedDay(idx)}
                type="button"
              >
                Day {idx + 1}
                {complete && (
                  <Icon name="check" className="ml-1.5 inline h-3.5 w-3.5" />
                )}
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[.18em] text-[#CA8A04]">
              Day {activeIndex + 1}
            </p>
            <h2 className="mt-1 text-xl font-black text-[#1E1B4B]">
              {currentDay?.focus || "Focus for the day"}
            </h2>
          </div>
          {!dayOpen && (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black uppercase tracking-[.14em] text-slate-500">
              Locked
            </span>
          )}
        </div>

        <ul className="mt-4 space-y-2">
          {(currentDay?.tasks ?? []).map((task) => (
            <TaskRow
              dayOpen={dayOpen}
              key={task.id}
              onOpen={() => handleTaskOpen(task)}
              onToggle={() => handleTaskToggle(task)}
              task={task}
            />
          ))}
          {currentDay && currentDay.tasks.length === 0 && (
            <p className="text-sm font-semibold text-slate-500">
              No tasks on this day.
            </p>
          )}
        </ul>
      </section>

      {modeForTask && (
        <TaskModePickerSheet
          onClose={() => setModeForTask(null)}
          planId={data.id}
          task={modeForTask}
        />
      )}

      {confirmDelete && (
        <ConfirmDeleteSheet
          onCancel={() => setConfirmDelete(false)}
          onConfirm={handleDelete}
          pending={deletePlan.isPending}
        />
      )}
    </div>
  );
}

function TaskRow({
  task,
  dayOpen,
  onToggle,
  onOpen,
}: {
  task: StudyTask;
  dayOpen: boolean;
  onToggle: () => void;
  onOpen: () => void;
}) {
  const status = task.activities_status;
  const disabled = !dayOpen || status !== "ready";

  if (status === "pending") {
    return (
      <li className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 opacity-80">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-slate-200">
          <span className="h-3 w-3 animate-pulse rounded-full bg-slate-300" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-black text-[#1E1B4B]">
            {task.title}
          </span>
          <span className="mt-0.5 block text-xs font-semibold text-slate-500">
            Preparing your activities…
          </span>
        </span>
      </li>
    );
  }

  if (status === "failed") {
    return (
      <li className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-red-200 text-red-500">
          <Icon name="warning" className="h-4 w-4" />
        </span>
        <button
          className="min-w-0 flex-1 text-left"
          onClick={onOpen}
          type="button"
        >
          <span className="block truncate text-sm font-black text-red-700">
            {task.title}
          </span>
          <span className="mt-0.5 block text-xs font-semibold text-red-700/80">
            Couldn&apos;t prepare — tap to retry
          </span>
        </button>
      </li>
    );
  }

  return (
    <li
      className={cn(
        "flex items-center gap-3 rounded-2xl border p-4 transition",
        task.done
          ? "border-emerald-200 bg-emerald-50"
          : disabled
            ? "border-slate-200 bg-white opacity-70"
            : "border-slate-200 bg-white shadow-sm hover:border-[#312E81]/30",
      )}
    >
      <button
        aria-label={task.done ? "Mark incomplete" : "Mark complete"}
        className={cn(
          "grid h-9 w-9 shrink-0 place-items-center rounded-full border transition",
          task.done
            ? "border-emerald-500 bg-emerald-500 text-white"
            : disabled
              ? "border-slate-200 bg-white text-slate-300"
              : "border-slate-300 bg-white text-slate-300 hover:border-[#312E81]",
        )}
        disabled={disabled}
        onClick={onToggle}
        type="button"
      >
        {task.done && <Icon name="check" className="h-4 w-4" />}
      </button>
      <button
        className="min-w-0 flex-1 text-left"
        disabled={disabled}
        onClick={onOpen}
        type="button"
      >
        <span
          className={cn(
            "block truncate text-sm font-black",
            task.done ? "text-emerald-700 line-through" : "text-[#1E1B4B]",
          )}
        >
          {task.title}
        </span>
        <span className="mt-0.5 block text-xs font-semibold uppercase tracking-[.14em] text-slate-500">
          {task.kind}
        </span>
      </button>
      {!disabled && (
        <Icon name="chevronRight" className="h-4 w-4 text-slate-300" />
      )}
    </li>
  );
}

function TaskModePickerSheet({
  task,
  planId,
  onClose,
}: {
  task: StudyTask;
  planId: string;
  onClose: () => void;
}) {
  const router = useRouter();
  const returnTo = `plan:${planId}`;
  const quizRef = task.quiz_ref_id ?? null;
  const deckRef = task.flashcard_deck_ref_id ?? null;

  function openFlashcards() {
    if (!deckRef) return;
    router.push(
      `/flashcards?deckId=${encodeURIComponent(deckRef)}&returnTo=${encodeURIComponent(returnTo)}`,
    );
  }

  function openQuiz() {
    if (!quizRef) return;
    router.push(
      `/quiz?quizId=${encodeURIComponent(quizRef)}&returnTo=${encodeURIComponent(returnTo)}`,
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 px-3 pb-3 sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[.18em] text-[#CA8A04]">
              Pick a mode
            </p>
            <h2 className="mt-1 text-xl font-black text-[#1E1B4B]">
              {task.title}
            </h2>
          </div>
          <button
            aria-label="Close"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-500 transition hover:bg-slate-200"
            onClick={onClose}
            type="button"
          >
            <Icon name="x" className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            className={cn(
              "flex flex-col items-start gap-2 rounded-2xl border p-4 text-left transition",
              deckRef
                ? "border-slate-200 bg-white hover:border-[#312E81]/40"
                : "cursor-not-allowed border-slate-100 bg-slate-50 opacity-60",
            )}
            disabled={!deckRef}
            onClick={openFlashcards}
            type="button"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#312E81]/10 text-[#312E81]">
              <Icon name="book" className="h-5 w-5" />
            </span>
            <span className="text-sm font-black text-[#1E1B4B]">Flashcards</span>
            <span className="text-xs font-semibold text-slate-500">
              Review a quick deck.
            </span>
          </button>
          <button
            className={cn(
              "flex flex-col items-start gap-2 rounded-2xl border p-4 text-left transition",
              quizRef
                ? "border-slate-200 bg-white hover:border-[#CA8A04]/40"
                : "cursor-not-allowed border-slate-100 bg-slate-50 opacity-60",
            )}
            disabled={!quizRef}
            onClick={openQuiz}
            type="button"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#FACC15]/20 text-[#CA8A04]">
              <Icon name="bolt" className="h-5 w-5" />
            </span>
            <span className="text-sm font-black text-[#1E1B4B]">Quiz</span>
            <span className="text-xs font-semibold text-slate-500">
              Short, timed, scored.
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

function ConfirmDeleteSheet({
  onCancel,
  onConfirm,
  pending,
}: {
  onCancel: () => void;
  onConfirm: () => void;
  pending: boolean;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 px-3 pb-3 sm:items-center sm:p-6"
      onClick={pending ? undefined : onCancel}
    >
      <div
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-black text-[#1E1B4B]">Delete this plan?</h2>
        <p className="mt-2 text-sm font-semibold text-slate-500">
          This removes the plan and every day&apos;s activities. You can&apos;t undo it.
        </p>
        <div className="mt-6 flex gap-3">
          <SecondaryButton
            className="flex-1"
            disabled={pending}
            onClick={onCancel}
          >
            Cancel
          </SecondaryButton>
          <PrimaryButton
            className="flex-1 !bg-red-600 hover:!bg-red-700"
            disabled={pending}
            onClick={onConfirm}
          >
            {pending ? "Deleting…" : "Delete plan"}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
