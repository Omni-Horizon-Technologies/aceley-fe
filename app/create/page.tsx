import { AppLayout } from "@/app/components/app-layout";
import {
  Flashcard,
  DifficultySelector,
  Icon,
  InputField,
  PageHeader,
  PrimaryButton,
  TextArea,
  UploadBox,
} from "@/app/components/ui";
import { flashcards } from "@/app/lib/data";

export default function CreateDeckPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <PageHeader
          description="Paste notes, add a file, and review generated cards before saving the deck."
          eyebrow="Create Deck"
          title="Turn notes into a study deck"
        />

        <section className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <div className="grid gap-5 md:grid-cols-2">
              <InputField label="Deck title" placeholder="Biology Revision" value="Biology Revision" />
              <InputField label="Subject" placeholder="Biology" value="Biology" />
            </div>
            <div className="mt-5">
              <DifficultySelector />
            </div>
            <div className="mt-5">
              <TextArea
                label="Notes"
                placeholder="Paste class notes here..."
                value="Photosynthesis is the process plants use to convert sunlight, carbon dioxide, and water into glucose and oxygen. Chlorophyll in chloroplasts captures light energy."
              />
            </div>
            <div className="mt-5">
              <UploadBox />
            </div>
            <PrimaryButton className="mt-6 w-full sm:w-auto">
              <Icon name="spark" />
              Generate Flashcards
            </PrimaryButton>
          </div>

          <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <p className="text-sm font-bold text-[#CA8A04]">Generated preview</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-[#1E1B4B]">
              3 editable cards
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Review questions and answers before saving them to the deck. This
              preview uses medium difficulty.
            </p>
            <div className="mt-6 space-y-4">
              {flashcards.map((card, index) => (
                <Flashcard card={card} index={index} key={card.question} />
              ))}
            </div>
            <PrimaryButton href="/decks/biology-revision" className="mt-6 w-full">
              Save Deck
            </PrimaryButton>
          </aside>
        </section>
      </div>
    </AppLayout>
  );
}
