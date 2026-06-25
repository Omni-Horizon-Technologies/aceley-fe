import { buildAskAnswer } from "./ask";

export const MOCK_SCANNED_QUESTION =
  "A student observes a cell with visible chromosomes lined up across the middle. Identify the stage of mitosis and explain your answer.";

export function buildScanAnswer() {
  const answer = buildAskAnswer(MOCK_SCANNED_QUESTION);

  return {
    extractedText: MOCK_SCANNED_QUESTION,
    subject: "Biology",
    explanation:
      "The stage is metaphase because chromosomes are aligned along the cell equator before sister chromatids separate.",
    steps: answer.steps,
    keyTerm: "Metaphase: the mitosis stage where chromosomes line up at the equator.",
    practice:
      "A cell shows sister chromatids moving to opposite poles. Name the stage and explain the evidence.",
  };
}
