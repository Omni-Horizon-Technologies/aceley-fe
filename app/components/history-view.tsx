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
  useDeleteQuiz,
  useHistory,
  useQuizDetail,
  useUpdateQuiz,
} from "@/services/hooks/useHistory";
import type { HistoryItem, HistoryType } from "@/services/dtos/history";

const FILTERS: Array<{ id: "all" | HistoryType; label: string }> = [
  { id: "all", label: "All" },
  { id: "quizzes", label: "Quizzes" },
  { id: "flashcards", label: "Flashcards" },
];

type Bucket = "today" | "yesterday" | "week" | "earlier";
const BUCKET_LABELS: Record<Bucket, string> = {
  today: "Today",
  yesterday: "Yesterday",
  week: "This week",
  earlier: "Earlier",
};

function bucketFor(createdAt: string): Bucket {
  const now = new Date();
  const then = new Date(createdAt);
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfYesterday = startOfToday - 86_400_000;
  const startOfWeek = startOfToday - 7 * 86_400_000;
  const t = then.getTime();
  if (t >= startOfToday) return "today";
  if (t >= startOfYesterday) return "yesterday";
  if (t >= startOfWeek) return "week";
  return "earlier";
}

function timeAgo(createdAt: string): string {
  const diffMs = Date.now() - new Date(createdAt).getTime();
  const mins = Math.round(diffMs / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d`;
  const weeks = Math.round(days / 7);
  if (weeks < 5) return `${weeks}w`;
  const months = Math.round(days / 30);
  if (months < 12) return `${months}mo`;
  const years = Math.round(days / 365);
  return `${years}y`;
}

function groupByBucket(items: HistoryItem[]): Array<[Bucket, HistoryItem[]]> {
  const groups: Record<Bucket, HistoryItem[]> = {
    today: [],
    yesterday: [],
    week: [],
    earlier: [],
  };
  for (const item of items) groups[bucketFor(item.created_at)].push(item);
  const order: Bucket[] = ["today", "yesterday", "week", "earlier"];
  return order.filter((b) => groups[b].length > 0).map((b) => [b, groups[b]]);
}

function routeFor(item: HistoryItem): string | null {
  if (!item.ref_id) return null;
  const base =
    item.type === "quizzes"
      ? `/quiz?quizId=${encodeURIComponent(item.ref_id)}`
      : `/flashcards?deckId=${encodeURIComponent(item.ref_id)}`;
  if (item.status === "in_progress") {
    if (item.type === "quizzes" && item.attempt_id) {
      return `${base}&attemptId=${encodeURIComponent(item.attempt_id)}`;
    }
    if (item.type === "flashcards" && item.session_id) {
      return `${base}&sessionId=${encodeURIComponent(item.session_id)}`;
    }
  }
  return base;
}

function notesRouteFor(item: HistoryItem): string | null {
  if (item.type !== "quizzes" || !item.ref_id) return null;
  return `/study-notes?quizId=${encodeURIComponent(item.ref_id)}`;
}

export function HistoryView() {
  const [filter, setFilter] = useState<"all" | HistoryType>("all");
  const [editing, setEditing] = useState<HistoryItem | null>(null);
  const router = useRouter();

  const type = filter === "all" ? undefined : filter;
  const history = useHistory({ type });

  const items = history.data;
  const groups = useMemo(() => groupByBucket(items ?? []), [items]);

  function openCard(item: HistoryItem) {
    if (item.type === "quizzes") {
      setEditing(item);
    }
    // Flashcards don't have a settings sheet yet in this build.
  }

  function openReplay(item: HistoryItem) {
    const target = routeFor(item);
    if (!target) {
      window.alert("Can't replay — missing source data");
      return;
    }
    router.push(target);
  }

  function openNotes(item: HistoryItem) {
    const target = notesRouteFor(item);
    if (!target) return;
    router.push(target);
  }

  return (
    <div className="space-y-6 pb-24">
      <header>
        <p className="text-xs font-black uppercase tracking-[.18em] text-[#CA8A04]">
          Recently
        </p>
        <h1 className="mt-1 text-2xl font-black tracking-tight text-[#1E1B4B] sm:text-3xl">
          Your history
        </h1>
        <p className="mt-2 max-w-xl text-sm font-semibold text-slate-500">
          Every quiz and flashcard deck you&apos;ve taken — tap to replay.
        </p>
      </header>

      <nav aria-label="Filter history" className="-mx-1 flex gap-2 overflow-x-auto px-1">
        {FILTERS.map((f) => {
          const active = filter === f.id;
          return (
            <button
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-sm font-black transition",
                active
                  ? "border-[#312E81] bg-[#312E81] text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300",
              )}
              key={f.id}
              onClick={() => setFilter(f.id)}
              type="button"
            >
              {f.label}
            </button>
          );
        })}
      </nav>

      {history.isLoading ? (
        <HistorySkeleton />
      ) : history.isError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-700">
          We couldn&apos;t load your history.{" "}
          <button
            className="underline"
            onClick={() => history.refetch()}
            type="button"
          >
            Try again
          </button>
        </div>
      ) : !items || items.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-7">
          {groups.map(([bucket, entries]) => (
            <section key={bucket}>
              <p className="text-xs font-black uppercase tracking-[.18em] text-slate-500">
                {BUCKET_LABELS[bucket]}
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {entries.map((item) => (
                  <HistoryCard
                    item={item}
                    key={item.id}
                    onNotes={() => openNotes(item)}
                    onOpen={() => openCard(item)}
                    onReplay={() => openReplay(item)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {editing && editing.type === "quizzes" && editing.ref_id && (
        <QuizSettingsSheet
          item={editing}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}

function HistoryCard({
  item,
  onOpen,
  onReplay,
  onNotes,
}: {
  item: HistoryItem;
  onOpen: () => void;
  onReplay: () => void;
  onNotes: () => void;
}) {
  const isQuiz = item.type === "quizzes";
  const inProgress = item.status === "in_progress";
  const resumable =
    inProgress && (isQuiz ? Boolean(item.attempt_id) : Boolean(item.session_id));
  const replayLabel = resumable ? "Resume" : "Replay";
  const replayTone = resumable
    ? "bg-[#FACC15]/20 text-[#CA8A04]"
    : isQuiz
      ? "bg-emerald-50 text-emerald-700"
      : "bg-[#312E81]/10 text-[#312E81]";

  return (
    <article className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-[#312E81]/30">
      <div className="flex items-start justify-between gap-2">
        <button
          aria-label={item.is_favorite ? "Unfavorite" : "Favorite"}
          className={cn(
            "grid h-8 w-8 shrink-0 place-items-center rounded-lg transition",
            item.is_favorite
              ? "bg-[#FACC15]/20 text-[#CA8A04]"
              : "bg-slate-100 text-slate-400 hover:text-slate-600",
          )}
          onClick={(e) => {
            e.stopPropagation();
            // Favorite endpoint not wired yet; placeholder for parity with mobile.
            window.alert("Favoriting is coming soon.");
          }}
          type="button"
        >
          <Icon name="bookmark" className="h-4 w-4" />
        </button>
        <span className="text-xs font-semibold text-slate-500">
          {timeAgo(item.created_at)}
        </span>
      </div>

      <button className="mt-3 text-left" onClick={onOpen} type="button">
        <h2 className="line-clamp-2 text-base font-black text-[#1E1B4B]">
          {item.title || (isQuiz ? "Untitled quiz" : "Untitled deck")}
        </h2>
        {item.subtitle && (
          <p className="mt-1 line-clamp-1 text-sm font-semibold text-slate-500">
            {item.subtitle}
          </p>
        )}
      </button>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {isQuiz && item.ref_id && (
          <button
            className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-700 hover:bg-slate-200"
            onClick={onNotes}
            type="button"
          >
            <Icon name="notes" className="h-3.5 w-3.5" />
            Notes
          </button>
        )}
        {item.ref_id && (
          <button
            className={cn(
              "ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-black",
              replayTone,
            )}
            onClick={onReplay}
            type="button"
          >
            <Icon
              name={resumable ? "play" : isQuiz ? "bolt" : "book"}
              className="h-3.5 w-3.5"
            />
            {replayLabel}
          </button>
        )}
      </div>
    </article>
  );
}

function HistorySkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      {[0, 1].map((group) => (
        <section key={group}>
          <div className="h-3 w-24 rounded bg-slate-200" />
          <div className="mt-3 space-y-3">
            {[0, 1, 2].map((i) => (
              <div
                className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4"
                key={i}
              >
                <div className="h-10 w-10 rounded-xl bg-slate-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-slate-200" />
                  <div className="h-3 w-1/2 rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#312E81]/10 text-[#312E81]">
        <Icon name="clock" className="h-7 w-7" />
      </span>
      <h2 className="mt-5 text-xl font-black text-[#1E1B4B]">
        Nothing to replay yet
      </h2>
      <p className="mx-auto mt-2 max-w-sm text-sm font-semibold text-slate-500">
        Take a quiz or run a flashcard deck — it&apos;ll show up here.
      </p>
    </div>
  );
}

function QuizSettingsSheet({
  item,
  onClose,
}: {
  item: HistoryItem;
  onClose: () => void;
}) {
  const quizId = item.ref_id ?? "";
  const detail = useQuizDetail(quizId);
  const update = useUpdateQuiz(quizId);
  const remove = useDeleteQuiz();

  const [name, setName] = useState(item.title);
  const [category, setCategory] = useState(item.category ?? "");
  const [isPrivate, setIsPrivate] = useState(false);
  const [spaced, setSpaced] = useState(false);
  const [examDate, setExamDate] = useState<string>("");
  const [error, setError] = useState("");
  const [hydrated, setHydrated] = useState(false);

  // Pre-fill once the authoritative detail loads.
  if (detail.data && !hydrated) {
    setName(detail.data.name ?? detail.data.title ?? item.title);
    setCategory(detail.data.category ?? item.category ?? "");
    setIsPrivate(Boolean(detail.data.is_private));
    setSpaced(Boolean(detail.data.spaced_repetitions));
    setExamDate(detail.data.exam_date ?? "");
    setHydrated(true);
  }

  async function submit() {
    setError("");
    try {
      await update.mutateAsync({
        name: name.trim() || item.title,
        category: category.trim() || null,
        is_private: isPrivate,
        spaced_repetitions: spaced,
        exam_date: examDate || null,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save your changes.");
    }
  }

  async function handleDelete() {
    setError("");
    if (!window.confirm("Delete this quiz? This also hides it from history.")) {
      return;
    }
    try {
      await remove.mutateAsync(quizId);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't delete this quiz.");
    }
  }

  const comingSoon = () => window.alert("Coming soon.");
  const busy = update.isPending || remove.isPending;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 px-3 pb-3 sm:items-center sm:p-6"
      onClick={busy ? undefined : onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[.18em] text-[#CA8A04]">
              Quiz settings
            </p>
            <h2 className="mt-1 text-xl font-black text-[#1E1B4B]">
              {item.title}
            </h2>
          </div>
          <button
            aria-label="Close"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-500 transition hover:bg-slate-200"
            disabled={busy}
            onClick={onClose}
            type="button"
          >
            <Icon name="x" className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <Field label="Name">
            <input
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold outline-none focus:border-[#312E81]"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </Field>
          <Field label="Category">
            <input
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold outline-none focus:border-[#312E81]"
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Biology"
              value={category}
            />
          </Field>
          <Toggle
            checked={isPrivate}
            label="Private"
            onChange={setIsPrivate}
            sub="Only you can see this quiz."
          />
          <Toggle
            checked={spaced}
            label="Spaced repetitions"
            onChange={setSpaced}
            sub="Resurface weak questions over time."
          />
          <Field label="Exam date">
            <input
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold outline-none focus:border-[#312E81]"
              min={new Date().toISOString().slice(0, 10)}
              onChange={(e) => setExamDate(e.target.value)}
              type="date"
              value={examDate}
            />
          </Field>

          <div className="grid grid-cols-3 gap-2 pt-1">
            <SmallGhost onClick={comingSoon}>Share</SmallGhost>
            <SmallGhost onClick={comingSoon}>Manual questions</SmallGhost>
            <SmallGhost onClick={comingSoon}>Learn more</SmallGhost>
          </div>
        </div>

        {error && (
          <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">
            {error}
          </p>
        )}

        <div className="mt-6 flex gap-3">
          <SecondaryButton
            className="flex-1 !text-red-600"
            disabled={busy}
            onClick={handleDelete}
          >
            Delete
          </SecondaryButton>
          <PrimaryButton
            className="flex-1"
            disabled={busy}
            onClick={submit}
          >
            {update.isPending ? "Saving…" : "Validate"}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase tracking-[.14em] text-slate-500">
        {label}
      </span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

function Toggle({
  label,
  sub,
  checked,
  onChange,
}: {
  label: string;
  sub: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <button
      className="flex w-full items-start justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 text-left"
      onClick={() => onChange(!checked)}
      type="button"
    >
      <span>
        <span className="block text-sm font-black text-[#1E1B4B]">{label}</span>
        <span className="mt-0.5 block text-xs font-semibold text-slate-500">
          {sub}
        </span>
      </span>
      <span
        className={cn(
          "mt-1 h-6 w-11 shrink-0 rounded-full p-0.5 transition",
          checked ? "bg-[#312E81]" : "bg-slate-200",
        )}
      >
        <span
          className={cn(
            "block h-5 w-5 rounded-full bg-white shadow-sm transition",
            checked ? "translate-x-5" : "translate-x-0",
          )}
        />
      </span>
    </button>
  );
}

function SmallGhost({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-600 transition hover:border-slate-300"
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
