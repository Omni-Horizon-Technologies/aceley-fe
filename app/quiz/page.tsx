"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AppLayout } from "@/app/components/app-layout";
import { QuizPage } from "@/app/components/aceley-pages";

function QuizPageWithParams() {
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic") || undefined;
  return <QuizPage topic={topic} />;
}

export default function Page() {
  return (
    <AppLayout>
      <Suspense fallback={<QuizPage />}>
        <QuizPageWithParams />
      </Suspense>
    </AppLayout>
  );
}
