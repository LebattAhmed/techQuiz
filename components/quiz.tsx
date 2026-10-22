"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, ChevronDown, Flame, RotateCcw, Shuffle, Sprout, TrendingUp, Trophy, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Breadcrumb from "@/components/breadcrumb";
import { cn } from "@/lib/utils";
import { drawQuestions, QUESTIONS_PER_QUIZ } from "@/lib/shuffle";
import { saveBestScore } from "@/lib/best-score";
import type { Difficulty, Question } from "@/lib/quizzes";

type Level = Difficulty | "tous";

const LEVELS: { level: Level; label: string; hint: string; icon: typeof Sprout }[] = [
  { level: "facile", label: "Facile", hint: "Les fondamentaux", icon: Sprout },
  { level: "moyen", label: "Moyen", hint: "Pour aller plus loin", icon: TrendingUp },
  { level: "difficile", label: "Difficile", hint: "Pour les experts", icon: Flame },
  { level: "tous", label: "Mélange", hint: "5 questions de chaque niveau", icon: Shuffle },
];

const LETTERS = ["A", "B", "C", "D", "E", "F"];

type Props = {
  subject: { slug: string; name: string; short: string };
  category: { slug: string; name: string; accent: string };
  questions: Question[];
};

export default function Quiz({ subject, category, questions }: Props) {
  const [level, setLevel] = useState<Level | null>(null);
  const [session, setSession] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<(string | null)[]>([]);
  const [current, setCurrent] = useState(0);

  const start = (newLevel: Level) => {
    const drawn = drawQuestions(questions, newLevel);
    setSession(drawn);
    setAnswers(drawn.map(() => null));
    setCurrent(0);
    setLevel(newLevel);
  };

  const breadcrumb = (
    <Breadcrumb
      items={[
        { label: "Accueil", href: "/" },
        { label: category.name, href: `/quiz/${category.slug}` },
        { label: subject.name },
      ]}
    />
  );

  return (
    <main className="mx-auto max-w-3xl px-4 pt-8 pb-24 sm:px-6">
      {breadcrumb}
      <AnimatePresence mode="wait">
        {!level ? (
          <LevelPicker key="intro" subject={subject} accent={category.accent} onPick={start} />
        ) : current < session.length ? (
          <Play
            key={`play-${level}`}
            title={subject.name}
            level={level}
            session={session}
            answers={answers}
            current={current}
            onAnswer={(option) =>
              setAnswers((a) => (a[current] ? a : a.map((v, i) => (i === current ? option : v))))
            }
            onNext={() => setCurrent((c) => c + 1)}
          />
        ) : (
          <Result
            key="result"
            subjectSlug={subject.slug}
            session={session}
            answers={answers}
            onReplay={() => start(level)}
            onChangeLevel={() => setLevel(null)}
            backHref={`/quiz/${category.slug}`}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

const screen = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
  transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const },
};

function LevelPicker({
  subject,
  accent,
  onPick,
}: {
  subject: Props["subject"];
  accent: string;
  onPick: (level: Level) => void;
}) {
  return (
    <motion.section {...screen} className="mt-8">
      <div className="flex items-center gap-4">
        <span
          className={cn(
            "grid h-14 min-w-14 place-items-center rounded-2xl bg-gradient-to-br px-2 font-mono font-bold text-white shadow-lg",
            accent
          )}
          aria-hidden
        >
          {subject.short}
        </span>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quiz {subject.name}</h1>
          <p className="text-muted-foreground">{QUESTIONS_PER_QUIZ} questions · choisissez votre niveau</p>
        </div>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {LEVELS.map(({ level, label, hint, icon: Icon }, i) => (
          <motion.button
            key={level}
            type="button"
            onClick={() => onPick(level)}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "group glass flex items-center gap-4 rounded-2xl p-5 text-left transition-colors hover:border-primary/50 focus-visible:outline-2 focus-visible:outline-primary",
              level === "tous" && "border-primary/30 bg-primary/5"
            )}
          >
            <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <Icon className="size-5" aria-hidden />
            </span>
            <span className="flex-1">
              <span className="block font-semibold">{label}</span>
              <span className="block text-sm text-muted-foreground">{hint}</span>
            </span>
            <ArrowRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
          </motion.button>
        ))}
      </div>
    </motion.section>
  );
}

function Play({
  title,
  level,
  session,
  answers,
  current,
  onAnswer,
  onNext,
}: {
  title: string;
  level: Level;
  session: Question[];
  answers: (string | null)[];
  current: number;
  onAnswer: (option: string) => void;
  onNext: () => void;
}) {
  const question = session[current];
  const selected = answers[current];
  const total = session.length;
  const score = answers.filter((a, i) => a === session[i].answer).length;
  const streak = currentStreak(session, answers);

  // Raccourcis : 1-4 ou A-D pour répondre, Entrée ou → pour continuer.
  const onKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (!selected) {
        const key = e.key.toUpperCase();
        const index = /^[1-9]$/.test(key) ? Number(key) - 1 : LETTERS.indexOf(key);
        if (index >= 0 && index < question.options.length) onAnswer(question.options[index]);
      } else if (e.key === "Enter" || e.key === "ArrowRight") {
        e.preventDefault();
        onNext();
      }
    },
    [selected, question, onAnswer, onNext]
  );
  useEffect(() => {
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onKey]);

  return (
    <motion.section {...screen} className="mt-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h1 className="font-semibold">{title}</h1>
          <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
            {LEVELS.find((l) => l.level === level)?.label}
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm font-medium tabular-nums">
          <AnimatePresence>
            {streak >= 3 && (
              <motion.span
                key={streak}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                className="inline-flex items-center gap-1 rounded-full bg-orange-500/15 px-2.5 py-0.5 text-orange-600 dark:text-orange-300"
              >
                <Zap className="size-3.5" aria-hidden /> {streak} d&apos;affilée
              </motion.span>
            )}
          </AnimatePresence>
          <span className="text-muted-foreground">
            {current + 1}
            <span className="opacity-60">/{total}</span>
          </span>
        </div>
      </div>

      {/* Progression segmentée : vert = juste, rouge = faux */}
      <ol className="mt-3 flex gap-1" aria-label={`Question ${current + 1} sur ${total}, score ${score}`}>
        {session.map((q, i) => (
          <li
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors duration-500",
              answers[i] === null && i !== current && "bg-muted",
              answers[i] === null && i === current && "bg-primary/60",
              answers[i] !== null && answers[i] === q.answer && "bg-success",
              answers[i] !== null && answers[i] !== q.answer && "bg-destructive"
            )}
          />
        ))}
      </ol>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="glass mt-6 rounded-3xl p-6 sm:p-8"
        >
          <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {question.difficulty}
          </span>
          <h2 className="mt-2 text-xl leading-snug font-semibold text-balance sm:text-2xl">{question.question}</h2>

          <div className="mt-6 grid gap-2.5">
            {question.options.map((option, i) => (
              <OptionButton
                key={option}
                letter={LETTERS[i]}
                option={option}
                state={optionState(option, question.answer, selected)}
                disabled={selected !== null}
                onClick={() => onAnswer(option)}
              />
            ))}
          </div>

          <AnimatePresence>
            {selected && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="overflow-hidden"
              >
                <div className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between" aria-live="polite">
                  {selected === question.answer ? (
                    <p className="flex items-center gap-2 font-medium text-success">
                      <Check className="size-5" aria-hidden /> Bonne réponse !
                    </p>
                  ) : (
                    <p className="flex items-start gap-2 font-medium text-destructive">
                      <X className="mt-0.5 size-5 shrink-0" aria-hidden />
                      <span>
                        Raté. La bonne réponse : <span className="text-foreground">{question.answer}</span>
                      </span>
                    </p>
                  )}
                  <Button onClick={onNext} autoFocus className="h-11 shrink-0 rounded-xl px-5">
                    {current === total - 1 ? "Voir les résultats" : "Suivante"}
                    <ArrowRight />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      <p className="mt-4 hidden text-center text-xs text-muted-foreground sm:block">
        Astuce : touches <kbd className="rounded border px-1 font-mono">A</kbd>–<kbd className="rounded border px-1 font-mono">D</kbd> pour répondre,{" "}
        <kbd className="rounded border px-1 font-mono">Entrée</kbd> pour continuer
      </p>
    </motion.section>
  );
}

type OptionState = "idle" | "correct" | "wrong" | "dimmed";

function optionState(option: string, answer: string, selected: string | null): OptionState {
  if (!selected) return "idle";
  if (option === answer) return "correct"; // la bonne réponse est toujours mise en évidence
  if (option === selected) return "wrong";
  return "dimmed";
}

function OptionButton({
  letter,
  option,
  state,
  disabled,
  onClick,
}: {
  letter: string;
  option: string;
  state: OptionState;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileTap={disabled ? undefined : { scale: 0.985 }}
      animate={state === "wrong" ? { x: [0, -6, 6, -4, 4, 0] } : state === "correct" ? { scale: [1, 1.02, 1] } : {}}
      transition={{ duration: 0.4 }}
      className={cn(
        "group flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-3.5 text-left transition-colors duration-200",
        state === "idle" && "cursor-pointer border-border bg-card hover:border-primary/60 hover:bg-accent",
        state === "correct" && "border-success bg-success/10",
        state === "wrong" && "border-destructive bg-destructive/10",
        state === "dimmed" && "border-border bg-card opacity-50"
      )}
    >
      <span
        className={cn(
          "grid size-8 shrink-0 place-items-center rounded-lg font-mono text-sm font-semibold transition-colors",
          state === "idle" && "bg-secondary text-secondary-foreground group-hover:bg-primary group-hover:text-primary-foreground",
          state === "correct" && "bg-success text-white",
          state === "wrong" && "bg-destructive text-white",
          state === "dimmed" && "bg-secondary text-muted-foreground"
        )}
        aria-hidden
      >
        {state === "correct" ? <Check className="size-4" /> : state === "wrong" ? <X className="size-4" /> : letter}
      </span>
      <span className="font-medium">{option}</span>
    </motion.button>
  );
}

function currentStreak(session: Question[], answers: (string | null)[]) {
  let streak = 0;
  for (let i = 0; i < answers.length && answers[i] !== null; i++) {
    streak = answers[i] === session[i].answer ? streak + 1 : 0;
  }
  return streak;
}

function bestStreak(session: Question[], answers: (string | null)[]) {
  let best = 0;
  let run = 0;
  answers.forEach((a, i) => {
    run = a === session[i].answer ? run + 1 : 0;
    best = Math.max(best, run);
  });
  return best;
}

function Result({
  subjectSlug,
  session,
  answers,
  onReplay,
  onChangeLevel,
  backHref,
}: {
  subjectSlug: string;
  session: Question[];
  answers: (string | null)[];
  onReplay: () => void;
  onChangeLevel: () => void;
  backHref: string;
}) {
  const total = session.length;
  const score = answers.filter((a, i) => a === session[i].answer).length;
  const ratio = total ? score / total : 0;
  const [isRecord, setIsRecord] = useState(false);

  useEffect(() => {
    setIsRecord(saveBestScore(subjectSlug, { score, total }));
  }, [subjectSlug, score, total]);

  const message =
    ratio === 1
      ? "Score parfait, impressionnant !"
      : ratio >= 0.8
        ? "Excellent travail !"
        : ratio >= 0.5
          ? "Bon score, continue comme ça !"
          : "Pas encore ça… réessaie, tu vas progresser !";

  const stats = [
    { label: "Bonnes réponses", value: score, className: "text-success" },
    { label: "Erreurs", value: total - score, className: "text-destructive" },
    { label: "Meilleure série", value: bestStreak(session, answers), className: "text-primary" },
  ];

  return (
    <motion.section {...screen} className="mt-8">
      <div className="glass flex flex-col items-center rounded-3xl p-8 text-center">
        <ScoreRing ratio={ratio} score={score} total={total} />
        <h1 className="mt-6 text-2xl font-bold tracking-tight">{message}</h1>
        {isRecord && (
          <motion.p
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, type: "spring" }}
            className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-sm font-semibold text-amber-700 dark:text-amber-300"
          >
            <Trophy className="size-4" aria-hidden /> Nouveau record !
          </motion.p>
        )}
        <dl className="mt-6 grid w-full max-w-md grid-cols-3 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl bg-secondary/60 p-3">
              <dd className={cn("text-2xl font-bold tabular-nums", s.className)}>{s.value}</dd>
              <dt className="text-xs text-muted-foreground">{s.label}</dt>
            </div>
          ))}
        </dl>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <Button onClick={onReplay} className="h-11 rounded-xl px-5">
            <RotateCcw /> Rejouer
          </Button>
          <Button onClick={onChangeLevel} variant="outline" className="h-11 rounded-xl px-5">
            Changer de niveau
          </Button>
          <Button asChild variant="ghost" className="h-11 rounded-xl px-5">
            <Link href={backHref}>Autres sujets</Link>
          </Button>
        </div>
      </div>

      <h2 className="mt-10 mb-3 text-lg font-semibold">Correction</h2>
      <ol className="grid gap-2">
        {session.map((q, i) => {
          const ok = answers[i] === q.answer;
          return (
            <li key={q.question}>
              <details className="group glass rounded-2xl">
                <summary className="flex cursor-pointer list-none items-center gap-3 p-4 [&::-webkit-details-marker]:hidden">
                  <span
                    className={cn(
                      "grid size-7 shrink-0 place-items-center rounded-full text-white",
                      ok ? "bg-success" : "bg-destructive"
                    )}
                    aria-label={ok ? "Juste" : "Faux"}
                  >
                    {ok ? <Check className="size-4" /> : <X className="size-4" />}
                  </span>
                  <span className="flex-1 text-sm font-medium">{q.question}</span>
                  <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden />
                </summary>
                <div className="space-y-1 px-4 pb-4 pl-14 text-sm">
                  {!ok && (
                    <p className="text-destructive">
                      Votre réponse : <span className="font-medium">{answers[i]}</span>
                    </p>
                  )}
                  <p className="text-success">
                    Bonne réponse : <span className="font-medium">{q.answer}</span>
                  </p>
                </div>
              </details>
            </li>
          );
        })}
      </ol>
    </motion.section>
  );
}

function ScoreRing({ ratio, score, total }: { ratio: number; score: number; total: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const color = ratio >= 0.8 ? "text-success" : ratio >= 0.5 ? "text-primary" : "text-destructive";

  return (
    <div className="relative size-40">
      <svg viewBox="0 0 120 120" className="size-full -rotate-90">
        <circle cx="60" cy="60" r={radius} fill="none" strokeWidth="10" className="stroke-muted" />
        <motion.circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          stroke="currentColor"
          className={color}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - ratio) }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold tabular-nums">{Math.round(ratio * 100)}%</span>
        <span className="text-sm text-muted-foreground tabular-nums">
          {score}/{total}
        </span>
      </div>
    </div>
  );
}
