"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check, RotateCcw, Trophy, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { drawQuestions, QUESTIONS_PER_QUIZ } from "@/lib/shuffle";
import type { Difficulty, Question } from "@/lib/quizzes";

type Level = Difficulty | "tous";

const LEVELS: { level: Level; label: string }[] = [
  { level: "facile", label: "Facile" },
  { level: "moyen", label: "Moyen" },
  { level: "difficile", label: "Difficile" },
  { level: "tous", label: "Toutes les difficultés" },
];

export default function Quiz({
  title,
  questions,
  backHref,
}: {
  title: string;
  questions: Question[];
  backHref: string;
}) {
  const [level, setLevel] = useState<Level | null>(null);
  const [session, setSession] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const start = (newLevel: Level) => {
    setSession(drawQuestions(questions, newLevel));
    setLevel(newLevel);
    setCurrent(0);
    setSelected(null);
    setScore(0);
  };

  const choose = (option: string) => {
    if (selected) return;
    setSelected(option);
    if (option === session[current].answer) setScore((s) => s + 1);
  };

  const next = () => {
    setSelected(null);
    setCurrent((c) => c + 1);
  };

  if (!level) {
    return (
      <Screen>
        <div className="w-full max-w-md space-y-6 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <BackLink href={backHref} />
          <div className="text-center">
            <h1 className="text-2xl font-bold text-indigo-700 mb-2">Quiz {title}</h1>
            <p className="text-gray-600">
              Choisissez le niveau de difficulté ({QUESTIONS_PER_QUIZ} questions)
            </p>
          </div>
          <div className="grid gap-3">
            {LEVELS.map(({ level, label }) => (
              <Button
                key={level}
                onClick={() => start(level)}
                variant={level === "tous" ? "default" : "outline"}
                className={cn(
                  "py-6 text-sm",
                  level === "tous"
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                    : "hover:bg-indigo-50 hover:border-indigo-300"
                )}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
      </Screen>
    );
  }

  const total = session.length;
  const isFinished = current >= total;
  const question = session[current];
  const answered = current + (selected ? 1 : 0);

  return (
    <Screen>
      <div className="w-full max-w-md md:max-w-lg space-y-6">
        <header className="space-y-2">
          <div className="flex justify-between items-center gap-2">
            <div className="flex items-center gap-2">
              <BackLink href={backHref} />
              <h1 className="text-xl font-bold text-indigo-700">
                Quiz {title} – {LEVELS.find((l) => l.level === level)?.label}
              </h1>
            </div>
            {!isFinished && (
              <span className="text-sm font-medium text-gray-500 whitespace-nowrap">
                Question {current + 1}/{total}
              </span>
            )}
          </div>
          <Progress
            value={(answered / total) * 100}
            aria-label="Progression"
            className="bg-gray-200 [&>[data-slot=progress-indicator]]:bg-indigo-600"
          />
        </header>

        <AnimatePresence mode="wait">
          {!isFinished ? (
            <motion.section
              key={`question-${current}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="text-center space-y-2">
                <h2 className="text-xl font-semibold text-gray-800">{question.question}</h2>
                <span className="inline-block text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                  {question.difficulty}
                </span>
              </div>

              <div className="grid gap-3">
                {question.options.map((option) => (
                  <OptionButton
                    key={option}
                    option={option}
                    state={optionState(option, question.answer, selected)}
                    disabled={selected !== null}
                    onClick={() => choose(option)}
                  />
                ))}
              </div>

              {selected && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-center pt-2"
                  aria-live="polite"
                >
                  {selected === question.answer ? (
                    <p className="text-green-600 font-medium mb-4">Correct ! Bien joué.</p>
                  ) : (
                    <p className="text-red-600 font-medium mb-4">
                      La bonne réponse était : <span className="font-bold">{question.answer}</span>
                    </p>
                  )}
                  <Button onClick={next} className="bg-indigo-600 hover:bg-indigo-700 shadow-sm">
                    {current === total - 1 ? "Voir les résultats" : "Question suivante"}
                  </Button>
                </motion.div>
              )}
            </motion.section>
          ) : (
            <Result
              score={score}
              total={total}
              onRestart={() => setLevel(null)}
              backHref={backHref}
            />
          )}
        </AnimatePresence>
      </div>
    </Screen>
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
  option,
  state,
  disabled,
  onClick,
}: {
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
      whileTap={disabled ? undefined : { scale: 0.98 }}
      className={cn(
        "w-full text-left px-4 py-3 rounded-lg text-sm border flex items-center gap-3 transition-all duration-200",
        state === "idle" && "bg-white border-gray-200 hover:bg-indigo-50 hover:border-indigo-300 cursor-pointer",
        state === "correct" && "bg-green-50 border-green-300 text-green-700",
        state === "wrong" && "bg-red-50 border-red-300 text-red-700",
        state === "dimmed" && "bg-gray-50 border-gray-200 opacity-70"
      )}
    >
      <span
        className={cn(
          "w-5 h-5 shrink-0 rounded-full border flex items-center justify-center text-white",
          state === "correct" && "border-green-500 bg-green-500",
          state === "wrong" && "border-red-500 bg-red-500",
          (state === "idle" || state === "dimmed") && "border-gray-300"
        )}
        aria-hidden
      >
        {state === "correct" && <Check className="w-3 h-3" />}
        {state === "wrong" && <X className="w-3 h-3" />}
      </span>
      <span>{option}</span>
    </motion.button>
  );
}

function Result({
  score,
  total,
  onRestart,
  backHref,
}: {
  score: number;
  total: number;
  onRestart: () => void;
  backHref: string;
}) {
  const ratio = total ? score / total : 0;
  const message =
    score === total
      ? "Score parfait ! Excellent !"
      : ratio >= 0.5
        ? "Bon score ! Continue comme ça !"
        : "Tu peux faire mieux ! Essaie encore.";

  return (
    <motion.section
      key="result"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="text-center space-y-6 bg-white p-8 rounded-xl shadow-sm border border-gray-100"
    >
      <div
        className={cn(
          "inline-flex items-center justify-center w-20 h-20 rounded-full",
          ratio >= 0.5 ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"
        )}
      >
        {ratio >= 0.5 ? <Trophy className="w-10 h-10" /> : <RotateCcw className="w-10 h-10" />}
      </div>
      <h2 className="text-2xl font-bold text-gray-800">Quiz terminé</h2>
      <div className="py-2">
        <p className="text-3xl font-bold text-indigo-600">
          {score} <span className="text-gray-500">/ {total}</span>
        </p>
        <p className="text-sm text-gray-500 mt-1">{message}</p>
      </div>
      <div className="flex justify-center gap-2">
        <Button asChild variant="ghost" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
          <Link href={backHref}>← Retour</Link>
        </Button>
        <Button onClick={onRestart} className="bg-indigo-600 hover:bg-indigo-700 shadow-sm">
          Recommencer le quiz
        </Button>
      </div>
    </motion.section>
  );
}

function Screen({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      {children}
    </main>
  );
}

function BackLink({ href }: { href: string }) {
  return (
    <Link
      href={href}
      aria-label="Retour"
      className="inline-flex items-center justify-center h-9 w-9 rounded-md text-gray-500 hover:text-indigo-600 hover:bg-indigo-50"
    >
      <ArrowLeft className="h-5 w-5" aria-hidden />
    </Link>
  );
}
