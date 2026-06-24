export type Deck = {
  slug: string;
  title: string;
  subject: string;
  cards: number;
  progress: number;
  lastStudied: string;
};

export type StudyCard = {
  question: string;
  answer: string;
  difficulty: "New" | "Review" | "Strong";
};

export const decks: Deck[] = [
  {
    slug: "biology-revision",
    title: "Biology Revision",
    subject: "Biology",
    cards: 24,
    progress: 72,
    lastStudied: "Today",
  },
  {
    slug: "chemistry-formulas",
    title: "Chemistry Formulas",
    subject: "Chemistry",
    cards: 18,
    progress: 45,
    lastStudied: "Yesterday",
  },
  {
    slug: "history-dates",
    title: "History Dates",
    subject: "History",
    cards: 30,
    progress: 60,
    lastStudied: "Mon",
  },
];

export const flashcards: StudyCard[] = [
  {
    question: "What is photosynthesis?",
    answer:
      "Photosynthesis is the process by which green plants use sunlight, carbon dioxide, and water to produce glucose and oxygen.",
    difficulty: "Review",
  },
  {
    question: "Where does photosynthesis mainly happen?",
    answer:
      "Photosynthesis mainly happens in chloroplasts, where chlorophyll captures light energy.",
    difficulty: "New",
  },
  {
    question: "Which gas do plants absorb during photosynthesis?",
    answer: "Plants absorb carbon dioxide from the air during photosynthesis.",
    difficulty: "Strong",
  },
];

export const profileStats = [
  { label: "Study streak", value: "12 days", tone: "coral" },
  { label: "Total decks", value: "3", tone: "indigo" },
  { label: "Cards studied", value: "412", tone: "ink" },
];
