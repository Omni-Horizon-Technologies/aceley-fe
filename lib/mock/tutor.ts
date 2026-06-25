function clean(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export function buildTutorReply(text: string, level = "student") {
  const prompt = clean(text) || "revision";
  const topic = prompt.length > 58 ? `${prompt.slice(0, 58)}...` : prompt;

  return [
    `Let's work through ${topic} at a ${level} pace.`,
    "First, I would separate what the question is asking from the facts you already know.",
    "Then we can solve one small step, check it, and build up to the full answer.",
    "Tell me the part that feels most unclear and I will zoom in there.",
  ].join("\n\n");
}
