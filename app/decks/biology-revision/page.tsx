import { AppLayout } from "@/app/components/app-layout";
import { DeckDetailsView } from "@/app/components/deck-details-view";
import { deckFlashcards, decks } from "@/app/lib/data";

const deck = decks[0];

export default function DeckDetailsPage() {
  return (
    <AppLayout>
      <DeckDetailsView cards={deckFlashcards[deck.slug]} deck={deck} />
    </AppLayout>
  );
}
