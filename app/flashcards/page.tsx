"use client";

import { Suspense } from "react";
import { AppLayout } from "@/app/components/app-layout";
import { FlashcardsPage } from "@/app/components/aceley-pages";
import { ReturnToPlanChip } from "@/app/components/return-to-plan-chip";

export default function Page() {
  return (
    <AppLayout>
      <Suspense fallback={null}>
        <ReturnToPlanChip />
      </Suspense>
      <FlashcardsPage />
    </AppLayout>
  );
}
