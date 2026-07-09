"use client";

import { Suspense } from "react";
import { AppLayout } from "@/app/components/app-layout";
import { ScanResultPage } from "@/app/components/aceley-pages";

export default function Page() {
  return (
    <AppLayout>
      <Suspense fallback={null}>
        <ScanResultPage />
      </Suspense>
    </AppLayout>
  );
}
