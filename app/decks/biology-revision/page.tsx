import { AppLayout } from "@/app/components/app-layout";
import {
  Flashcard,
  Icon,
  PageHeader,
  PrimaryButton,
  ProgressBar,
  SecondaryButton,
  StudySummaryCard,
} from "@/app/components/ui";
import { decks, flashcards } from "@/app/lib/data";

const deck = decks[0];

export default function DeckDetailsPage() {
  return (
    <AppLayout active="dashboard">
      <div className="space-y-8">
        <PageHeader
          action={
            <PrimaryButton href="/study">
              <Icon name="play" />
              Start Studying
            </PrimaryButton>
          }
          description="Biology flashcards generated from your revision notes."
          eyebrow={deck.subject}
          title={deck.title}
        />

        <section className="grid gap-4 md:grid-cols-3">
          <StudySummaryCard label="Total cards" value={`${deck.cards}`} />
          <StudySummaryCard label="Progress" value={`${deck.progress}%`} tone="coral" />
          <StudySummaryCard label="Difficult cards" value="6" tone="ink" />
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.7fr] lg:items-center">
            <div>
              <h2 className="text-xl font-black tracking-tight text-[#1E1B4B]">
                Current progress
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Keep this deck moving with one short review session.
              </p>
              <div className="mt-5">
                <ProgressBar value={deck.progress} label={`${deck.title} progress`} />
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <PrimaryButton href="/study">Start Studying</PrimaryButton>
              <SecondaryButton href="/study">Review Difficult Cards</SecondaryButton>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-black tracking-tight text-[#1E1B4B]">
              Flashcards
            </h2>
            <SecondaryButton href="/create">Edit Deck</SecondaryButton>
          </div>
          <div className="mt-4 grid gap-4">
            {flashcards.map((card, index) => (
              <Flashcard card={card} index={index} key={card.question} />
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
