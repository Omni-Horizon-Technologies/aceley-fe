import { AppLayout } from "@/app/components/app-layout";
import {
  DeckCard,
  EmptyState,
  Icon,
  PageHeader,
  PrimaryButton,
  ProgressBar,
  QuickActionCard,
  SecondaryButton,
} from "@/app/components/ui";
import { decks } from "@/app/lib/data";

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <PageHeader
          action={
            <PrimaryButton href="/create">
              <Icon name="create" />
              Create Deck
            </PrimaryButton>
          }
          description="Pick up your latest deck or create new flashcards from today's notes."
          eyebrow="Dashboard"
          title="Good morning, Maya"
        />

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-sm font-bold text-[#CA8A04]">Continue Learning</p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-[#1E1B4B]">
                Biology Revision
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                24 cards ready. Your next review focuses on photosynthesis and
                cell structure.
              </p>
              <div className="mt-5 max-w-lg">
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-semibold text-slate-500">Deck progress</span>
                  <span className="font-black text-[#1E1B4B]">72%</span>
                </div>
                <ProgressBar value={72} label="Biology Revision progress" />
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <PrimaryButton href="/study">
                <Icon name="play" />
                Start Studying
              </PrimaryButton>
              <SecondaryButton href="/decks/biology-revision">View Deck</SecondaryButton>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-black tracking-tight text-[#1E1B4B]">
            Quick actions
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <QuickActionCard
              description="Start with a title, subject, and your study notes."
              href="/create"
              icon="create"
              title="Create Deck"
            />
            <QuickActionCard
              description="Paste today's notes and generate cards immediately."
              href="/create"
              icon="notes"
              title="Paste Notes"
            />
            <QuickActionCard
              description="Add notes from PDF, document, text, or image files."
              href="/create"
              icon="upload"
              title="Upload File"
            />
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-black tracking-tight text-[#1E1B4B]">
              Recent decks
            </h2>
            <SecondaryButton href="/create" className="hidden sm:inline-flex">
              New Deck
            </SecondaryButton>
          </div>
          {decks.length ? (
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {decks.map((deck) => (
                <DeckCard deck={deck} key={deck.slug} />
              ))}
            </div>
          ) : (
            <div className="mt-4">
              <EmptyState />
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  );
}
