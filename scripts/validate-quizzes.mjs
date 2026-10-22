// Vérifie la cohérence des fichiers data/quizzes/*.json.
// Usage : npm run validate:quizzes
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { GLOBAL_OPTION, POSITIONAL_OPTION } from "../lib/option-rules.mjs";

const DIR = join(import.meta.dirname, "..", "data", "quizzes");
const DIFFICULTIES = ["facile", "moyen", "difficile"];
const MIN_PER_DIFFICULTY = 15;

let errors = 0;
const error = (file, msg) => {
  errors++;
  console.error(`✗ ${file}: ${msg}`);
};

for (const file of readdirSync(DIR).filter((f) => f.endsWith(".json")).sort()) {
  let data;
  try {
    data = JSON.parse(readFileSync(join(DIR, file), "utf8"));
  } catch (e) {
    error(file, `JSON invalide (${e.message})`);
    continue;
  }

  const questions = data.questions;
  if (!Array.isArray(questions)) {
    error(file, "champ « questions » manquant");
    continue;
  }
  if (questions.length === 0) {
    console.log(`- ${file}: vide (affiché « bientôt disponible »)`);
    continue;
  }

  const seen = new Set();
  questions.forEach((q, i) => {
    const at = `#${i} « ${q.question} »`;
    if (seen.has(q.question)) error(file, `${at} question en double`);
    seen.add(q.question);
    if (!DIFFICULTIES.includes(q.difficulty)) error(file, `${at} difficulté inconnue « ${q.difficulty} »`);
    if (!Array.isArray(q.options) || q.options.length < 2) error(file, `${at} il faut au moins 2 options`);
    if (new Set(q.options).size !== q.options.length) error(file, `${at} options en double`);
    if (!q.options.includes(q.answer)) error(file, `${at} la réponse n'est pas dans les options`);
    for (const o of q.options) {
      if (POSITIONAL_OPTION.test(o)) error(file, `${at} option qui dépend de la position : « ${o} »`);
    }
    if (q.options.filter((o) => GLOBAL_OPTION.test(o)).length > 1) {
      error(file, `${at} plusieurs options « toutes / aucune de ces réponses »`);
    }
  });

  const counts = DIFFICULTIES.map((d) => questions.filter((q) => q.difficulty === d).length);
  DIFFICULTIES.forEach((d, i) => {
    if (counts[i] < MIN_PER_DIFFICULTY) error(file, `seulement ${counts[i]} questions « ${d} » (minimum ${MIN_PER_DIFFICULTY})`);
  });
  console.log(`✓ ${file}: ${questions.length} questions (${counts.join(" / ")})`);
}

if (errors) {
  console.error(`\n${errors} erreur(s)`);
  process.exit(1);
}
