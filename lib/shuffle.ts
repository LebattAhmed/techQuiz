import { GLOBAL_OPTION } from "./option-rules.mjs";
import type { Difficulty, Question } from "./quizzes";

export const QUESTIONS_PER_QUIZ = 15;

// Mélange de Fisher-Yates (uniforme, contrairement à sort(() => 0.5 - Math.random())).
export function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Mélange les options, mais garde « Toutes ces réponses » / « Aucune de ces
// réponses » en dernière position. La bonne réponse est comparée par son texte,
// donc l'ordre affiché n'a aucune incidence sur la correction.
export function shuffleOptions(options: readonly string[]): string[] {
  const global = options.filter((o) => GLOBAL_OPTION.test(o));
  const regular = options.filter((o) => !GLOBAL_OPTION.test(o));
  return [...shuffle(regular), ...global];
}

// Tire les questions d'une partie : 15 du niveau choisi, ou 5 de chaque niveau pour « tous ».
export function drawQuestions(questions: Question[], level: Difficulty | "tous"): Question[] {
  const pick = (difficulty: Difficulty, count: number) =>
    shuffle(questions.filter((q) => q.difficulty === difficulty)).slice(0, count);

  const drawn =
    level === "tous"
      ? [
          ...pick("facile", QUESTIONS_PER_QUIZ / 3),
          ...pick("moyen", QUESTIONS_PER_QUIZ / 3),
          ...pick("difficile", QUESTIONS_PER_QUIZ / 3),
        ]
      : pick(level, QUESTIONS_PER_QUIZ);

  return shuffle(drawn).map((q) => ({ ...q, options: shuffleOptions(q.options) }));
}
