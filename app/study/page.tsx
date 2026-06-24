import { BackButton } from "@/app/components/back-button";
import { StudySession } from "@/app/components/study-session";
import { flashcards } from "@/app/lib/data";

export default function StudyPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] px-4 py-6 text-[#1E1B4B] sm:px-6 lg:px-8">
      <div className="mx-auto mb-4 max-w-4xl">
        <BackButton fallbackHref="/dashboard" />
      </div>
      <StudySession cards={flashcards} />
    </main>
  );
}
