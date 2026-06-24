import { DeckDetailsView } from "@/app/components/deck-details-view";
import { deckFlashcards, decks } from "@/app/lib/data";

const deck = decks[0];

export default function DeckDetailsPage() {
  return <DeckDetailsView cards={deckFlashcards[deck.slug]} deck={deck} />;
}
