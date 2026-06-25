const styleTone: Record<string, string> = {
  kid: "Imagine it with a simple everyday example.",
  lecturer: "Use the formal idea, then connect it to a worked example.",
  exam: "State the point, explain it, and link it directly to marks.",
  friend: "Think of it as the shortcut you would tell a classmate before the test.",
};

export function buildExplanation(topic: string, styleId: string) {
  const safeTopic = topic.trim() || "cell biology";
  const tone = styleTone[styleId] ?? styleTone.lecturer;

  return {
    title: safeTopic,
    preview: `${safeTopic}: ${tone}`,
    summary:
      `${safeTopic} becomes easier when you split it into the core definition, the process, and one example you can reuse in an exam.`,
    sections: [
      {
        heading: "Core idea",
        body: `${tone} The core idea is the rule that stays true even when the question changes.`,
      },
      {
        heading: "How it works",
        body:
          "Start with the definition, follow the order of events, and keep cause and effect linked in each sentence.",
      },
      {
        heading: "Exam move",
        body:
          "Use precise keywords, then add a short explanation showing why that keyword answers the question.",
      },
    ],
  };
}
