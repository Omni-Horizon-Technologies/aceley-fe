"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AppLayout } from "@/app/components/app-layout";
import { StudyPackResultPage } from "@/app/components/aceley-pages";

function StudyPackResultWithParams() {
  const params = useSearchParams();
  const source = params.get("source") || "Study material";
  return <StudyPackResultPage source={source} />;
}

export default function Page() {
  return (
    <AppLayout>
      <Suspense fallback={null}>
        <StudyPackResultWithParams />
      </Suspense>
    </AppLayout>
  );
}
