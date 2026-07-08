"use client";

import { useSearchParams } from "next/navigation";
import { AppLayout } from "@/app/components/app-layout";
import { QuizPage } from "@/app/components/aceley-pages";

export default function Page() {
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic") || undefined;
  return (
    <AppLayout>
      <QuizPage topic={topic} />
    </AppLayout>
  );
}
