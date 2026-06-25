function keywordFrom(input: string) {
  const words = input
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 3);

  return words[0] ?? "concept";
}

export function buildAskAnswer(question: string) {
  const q = question.trim() || "How do I solve this?";
  const keyword = keywordFrom(q);

  return {
    understand:
      `The question is asking you to identify the important idea behind "${q}" and apply it in order, not guess from the final numbers.`,
    steps: [
      `Underline the command word and the known information about ${keyword}.`,
      "Write the rule, definition, or formula that connects those facts.",
      "Substitute one value or idea at a time so each line follows from the previous one.",
      "Check whether the final answer matches the units and wording of the question.",
    ],
    keyConcept:
      `Key concept: ${keyword} questions reward clear setup. A correct method with labelled steps is usually worth more than a bare final answer.`,
    similar:
      `Try this: create a new question about ${keyword}, change one value or condition, and solve it using the same four-step structure.`,
  };
}
