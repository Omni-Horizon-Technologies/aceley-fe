"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AppLayout } from "@/app/components/app-layout";
import { QuizPage } from "@/app/components/aceley-pages";

function QuizPageWithParams() {
  const searchParams = useSearchParams();
  const topic = searchParams.get("subject") || searchParams.get("topic") || undefined;
  const quizId = searchParams.get("quizId") || undefined;
  return <QuizPage quizId={quizId} topic={topic} />;
}

export default function Page() {
  return (
    <AppLayout>
      <Suspense fallback={<div className="space-y-4" aria-label="Loading quiz"><div className="h-8 w-40 animate-pulse rounded-lg bg-slate-200" /><div className="h-2 w-full animate-pulse rounded-full bg-slate-200" /><div className="h-80 animate-pulse rounded-2xl bg-slate-200" /></div>}>
        <QuizPageWithParams />
      </Suspense>
    </AppLayout>
  );
}
