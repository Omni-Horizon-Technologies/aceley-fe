"use client";

import { useMemo, useState } from "react";
import type { StudyCard } from "@/app/lib/data";
import {
  cn,
  Icon,
  PrimaryButton,
  ProgressBar,
  SecondaryButton,
  StudySummaryCard,
} from "@/app/components/ui";

export function StudySession({ cards }: { cards: StudyCard[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studied, setStudied] = useState(0);
  const [mastered, setMastered] = useState(0);
  const [review, setReview] = useState(0);
  const [complete, setComplete] = useState(false);

  const currentCard = cards[currentIndex];
  const progress = useMemo(() => {
    if (complete) {
      return 100;
    }

    return Math.round((currentIndex / cards.length) * 100);
  }, [cards.length, complete, currentIndex]);

  function gradeCard(grade: "Hard" | "Good" | "Easy") {
    const nextStudied = studied + 1;

    setStudied(nextStudied);
    setMastered((value) => value + (grade === "Easy" ? 1 : 0));
    setReview((value) => value + (grade === "Hard" ? 1 : 0));
    setIsFlipped(false);

    if (currentIndex + 1 >= cards.length) {
      setComplete(true);
      return;
    }

    setCurrentIndex((value) => value + 1);
  }

  function restart() {
    setCurrentIndex(0);
    setIsFlipped(false);
    setStudied(0);
    setMastered(0);
    setReview(0);
    setComplete(false);
  }

  if (complete) {
    return (
      <section className="mx-auto max-w-4xl">
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm md:p-10">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-[#FACC15]/10 text-[#CA8A04]">
            <Icon name="spark" />
          </div>
          <h1 className="mt-6 text-3xl font-black tracking-tight text-[#1E1B4B] md:text-4xl">
            Study session complete
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Biology Revision is updated with your latest answers.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <StudySummaryCard label="Cards studied" value={`${studied}`} />
            <StudySummaryCard label="Cards mastered" value={`${mastered}`} tone="yellow" />
            <StudySummaryCard label="Cards to review" value={`${review}`} tone="ink" />
          </div>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <PrimaryButton href="/dashboard">Back to Dashboard</PrimaryButton>
            <button
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-[#1E1B4B] shadow-sm transition hover:border-[#FACC15]/60 hover:text-[#CA8A04] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#FACC15]/20"
              onClick={restart}
              type="button"
            >
              Study Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-4xl flex-col">
      <div className="sticky top-0 z-10 -mx-4 bg-[#F8FAFC]/95 px-4 pb-5 pt-2 backdrop-blur sm:-mx-6 sm:px-6 lg:top-0">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[#CA8A04]">Biology Revision</p>
            <h1 className="mt-1 text-2xl font-black tracking-tight text-[#1E1B4B]">
              Study Mode
            </h1>
          </div>
          <span className="rounded-lg bg-white px-3 py-2 text-sm font-bold text-[#312E81] shadow-sm">
            {currentIndex + 1} / {cards.length}
          </span>
        </div>
        <div className="mt-5">
          <ProgressBar value={progress} label="Study progress" />
        </div>
      </div>

      <div className="flex flex-1 items-center py-8">
        <button
          aria-label={isFlipped ? "Show question" : "Show answer"}
          aria-pressed={isFlipped}
          className={cn(
            "min-h-[22rem] w-full rounded-lg border border-slate-200 bg-white p-7 text-left shadow-lg shadow-[#1E1B4B]/8 transition duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#312E81]/20 md:min-h-[28rem] md:p-10",
            isFlipped && "border-[#FACC15]/50 bg-[#FEFCE8]",
          )}
          onClick={() => setIsFlipped((value) => !value)}
          type="button"
        >
          <div className="flex items-center justify-between gap-3">
            <span className="rounded-lg bg-[#312E81]/10 px-3 py-1 text-sm font-black text-[#312E81]">
              {isFlipped ? "Answer" : "Question"}
            </span>
            <span className="text-sm font-semibold text-slate-400">
              {currentCard.difficulty}
            </span>
          </div>
          <div className="flex min-h-64 items-center">
            <p className="w-full text-center text-3xl font-black leading-tight tracking-tight text-[#1E1B4B] md:text-5xl">
              {isFlipped ? currentCard.answer : currentCard.question}
            </p>
          </div>
        </button>
      </div>

      <div className="grid gap-3 pb-4 sm:grid-cols-3">
        {(["Hard", "Good", "Easy"] as const).map((grade) => (
          <button
            className={cn(
              "min-h-12 rounded-lg border px-5 py-3 text-sm font-black shadow-sm transition focus:outline-none focus-visible:ring-4",
              grade === "Hard" &&
                "border-[#FACC15]/30 bg-[#FACC15]/10 text-[#CA8A04] hover:bg-[#FACC15] hover:text-[#1E1B4B] focus-visible:ring-[#FACC15]/20",
              grade === "Good" &&
                "border-[#312E81]/20 bg-white text-[#312E81] hover:bg-[#312E81] hover:text-white focus-visible:ring-[#312E81]/20",
              grade === "Easy" &&
                "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white focus-visible:ring-emerald-200",
            )}
            key={grade}
            onClick={() => gradeCard(grade)}
            type="button"
          >
            {grade}
          </button>
        ))}
      </div>
      <div className="pb-8 text-center">
        <SecondaryButton href="/decks/biology-revision">Exit Session</SecondaryButton>
      </div>
    </section>
  );
}
