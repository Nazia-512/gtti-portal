// Career pathway scoring utility for the GTTI portal.
// Maps Section A / Section B questionnaire answers onto four career pathways
// and recommends the strongest pathway for a student.

/** Allowed answers for Section A questions. */
export type SectionAAnswer = "always" | "sometimes" | "rarely";

/** Allowed answers for Section B questions. */
export type SectionBAnswer = "yes" | "notsure" | "no";

/** The four career pathways scored by this utility. */
export type Pathway =
  | "entrepreneurship"
  | "foreignJob"
  | "higherEducation"
  | "localJob";

/** Answers keyed by their question code, e.g. { A2: "always", A3: "rarely" }. */
export type SectionAAnswers = Record<string, SectionAAnswer>;

/** Answers keyed by their question code, e.g. { B4: "yes", B6: "no" }. */
export type SectionBAnswers = Record<string, SectionBAnswer>;

export interface PathwayResult {
  scores: Record<Pathway, number>;
  recommendedPathway: Pathway;
}

/** Which question codes contribute to each pathway. */
const PATHWAY_INDICATORS: Record<Pathway, readonly string[]> = {
  entrepreneurship: ["A2", "A3", "A6", "B4", "B6"],
  foreignJob: ["A4", "A10", "B2", "B7"],
  higherEducation: ["A7", "A5", "A8", "B3", "B8"],
  localJob: ["A5", "A9", "B1", "B5"],
};

/** Points awarded for each Section A answer. */
const SECTION_A_POINTS: Record<SectionAAnswer, number> = {
  always: 2,
  sometimes: 1,
  rarely: 0,
};

/** Points awarded for each Section B answer. */
const SECTION_B_POINTS: Record<SectionBAnswer, number> = {
  yes: 2,
  notsure: 1,
  no: 0,
};

// Tie-break order: earlier pathways win when scores are equal.
const TIE_BREAK_PRIORITY: readonly Pathway[] = [
  "localJob",
  "higherEducation",
  "foreignJob",
  "entrepreneurship",
];

/** Returns the points for a single question code, or 0 if unanswered. */
function pointsForIndicator(
  code: string,
  sectionA: SectionAAnswers,
  sectionB: SectionBAnswers
): number {
  if (code.startsWith("A")) {
    const answer = sectionA[code];
    return answer ? SECTION_A_POINTS[answer] : 0;
  }

  if (code.startsWith("B")) {
    const answer = sectionB[code];
    return answer ? SECTION_B_POINTS[answer] : 0;
  }

  return 0;
}

/**
 * Calculates each pathway's total score and the recommended pathway.
 *
 * @param sectionA Section A answers keyed by code (e.g. "A2").
 * @param sectionB Section B answers keyed by code (e.g. "B4").
 */
export function calculatePathway(
  sectionA: SectionAAnswers,
  sectionB: SectionBAnswers
): PathwayResult {
  const scores = {} as Record<Pathway, number>;

  for (const pathway of Object.keys(PATHWAY_INDICATORS) as Pathway[]) {
    scores[pathway] = PATHWAY_INDICATORS[pathway].reduce(
      (total, code) => total + pointsForIndicator(code, sectionA, sectionB),
      0
    );
  }

  let recommendedPathway: Pathway = TIE_BREAK_PRIORITY[0];
  for (const pathway of TIE_BREAK_PRIORITY) {
    if (scores[pathway] > scores[recommendedPathway]) {
      recommendedPathway = pathway;
    }
  }

  return { scores, recommendedPathway };
}
