import { AppLayout } from "@/app/components/app-layout";
import { StudySession } from "@/app/components/study-session";
import { flashcards } from "@/app/lib/data";

export default function StudyPage() {
  return (
    <AppLayout>
      <StudySession cards={flashcards} />
    </AppLayout>
  );
}
