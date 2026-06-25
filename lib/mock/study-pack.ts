function seedWords(source: string) {
  const words = source
    .trim()
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 3);

  return words.slice(0, 5).length ? words.slice(0, 5) : ["cells", "energy", "revision", "process", "exam"];
}

export function buildStudyPack(source: string) {
  const words = seedWords(source);

  return {
    stats: {
      keyPoints: 6,
      flashcards: 8,
      quizQs: 5,
      examQs: 4,
    },
    summary:
      `This pack turns your notes into a concise revision guide focused on ${words.join(", ")}. Review the big idea first, then test recall with cards and exam prompts.`,
    keyPoints: words.map((word, index) => ({
      title: `${word[0]?.toUpperCase() ?? "T"}${word.slice(1)} point`,
      body: `Point ${index + 1} links ${word} to a clear exam-ready explanation.`,
    })),
    flashcards: words.map((word) => ({
      front: `What should you remember about ${word}?`,
      back: `${word} matters because it connects the definition to the process in the question.`,
    })),
    quiz: words.slice(0, 5).map((word, index) => ({
      question: `Which statement best explains ${word}?`,
      answer: `The statement that defines ${word} and links it to an outcome.`,
      number: index + 1,
    })),
    studyGuide: [
      "Read the summary once without highlighting.",
      "Cover the key points and recall them from memory.",
      "Answer the quiz questions, then rewrite missed explanations.",
      "Finish with one exam question under timed conditions.",
    ],
    examQs: words.slice(0, 4).map((word) => `Explain the role of ${word} in a complete exam paragraph.`),
  };
}
