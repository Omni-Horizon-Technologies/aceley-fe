import { DeckDetailsView } from "@/app/components/deck-details-view";
import { deckFlashcards, decks, type Deck } from "@/app/lib/data";

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getSampleDeck(slug: string): Deck {
  return (
    decks.find((deck) => deck.slug === slug) ?? {
      cards: 12,
      lastStudied: "New",
      progress: 0,
      slug,
      subject: "Sample",
      title: titleFromSlug(slug) || "Sample Deck",
    }
  );
}

export default async function DeckSamplePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const deck = getSampleDeck(slug);
  const cards = deckFlashcards[deck.slug] ?? deckFlashcards["biology-revision"];

  return <DeckDetailsView cards={cards} deck={deck} />;
}
