"use client";

import { AppLayout } from "@/app/components/app-layout";
import { StudyPackResultPage } from "@/app/components/aceley-pages";

export default function Page() {
  const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const source = params.get("source") || "Study material";

  return (
    <AppLayout>
      <StudyPackResultPage source={source} />
    </AppLayout>
  );
}
