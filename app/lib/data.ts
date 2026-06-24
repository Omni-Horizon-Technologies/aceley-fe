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

export const deckFlashcards: Record<string, StudyCard[]> = {
  "biology-revision": [
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
  ],
  "chemistry-formulas": [
    {
      question: "What does pH measure?",
      answer:
        "pH measures how acidic or alkaline a solution is, using a scale where lower numbers are more acidic.",
      difficulty: "Review",
    },
    {
      question: "What is the formula for calculating concentration?",
      answer:
        "Concentration can be calculated using concentration equals amount of solute divided by volume of solution.",
      difficulty: "New",
    },
    {
      question: "What is Avogadro's constant used for?",
      answer:
        "Avogadro's constant links the amount of substance in moles to the number of particles.",
      difficulty: "Strong",
    },
  ],
  "history-dates": [
    {
      question: "When did World War I begin?",
      answer: "World War I began in 1914 after the assassination of Archduke Franz Ferdinand.",
      difficulty: "Review",
    },
    {
      question: "What happened in 1066?",
      answer:
        "The Battle of Hastings took place in 1066, leading to the Norman conquest of England.",
      difficulty: "New",
    },
    {
      question: "Why are timelines useful in history revision?",
      answer:
        "Timelines help connect events in order, making causes, consequences, and patterns easier to remember.",
      difficulty: "Strong",
    },
  ],
};

export const flashcards: StudyCard[] = deckFlashcards["biology-revision"];

export const profileStats = [
  { label: "Study streak", value: "12 days", tone: "coral" },
  { label: "Total decks", value: "3", tone: "indigo" },
  { label: "Cards studied", value: "412", tone: "ink" },
];
