import type { Metadata } from "next";
import { AppLayout } from "@/app/components/app-layout";
import { HistoryView } from "@/app/components/history-view";

export const metadata: Metadata = {
  title: "History | Aceley",
  description:
    "Every quiz and flashcard deck you've taken on Aceley — tap to replay.",
};

export default function Page() {
  return (
    <AppLayout>
      <HistoryView />
    </AppLayout>
  );
}
