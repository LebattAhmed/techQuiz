"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import quizData from "../app/api/php-quiz.json";
import { useRouter } from "next/navigation";

type Difficulty = "facile" | "moyen" | "difficile" | "tous";

export default function PhpQuiz() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [questions, setQuestions] = useState<typeof quizData.questions>([]);

  const returnToLanguageSelection = () => {
    router.replace("/");
  };

  // Fonction pour mélanger un tableau et prendre les n premiers éléments
  const getRandomQuestions = (arr: any[], n: number) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
  };

  // Initialiser le quiz avec 15 questions aléatoires
  const startQuiz = (difficulty: Difficulty) => {
    let filteredQuestions = [];

    if (difficulty === "tous") {
      // Pour "tous", on prend 5 questions de chaque difficulté
      const facile = getRandomQuestions(
        quizData.questions.filter((q) => q.difficulty === "facile"),
        5
      );
      const moyen = getRandomQuestions(
        quizData.questions.filter((q) => q.difficulty === "moyen"),
        5
      );
      const difficile = getRandomQuestions(
        quizData.questions.filter((q) => q.difficulty === "difficile"),
        5
      );
      filteredQuestions = [...facile, ...moyen, ...difficile].sort(
        () => 0.5 - Math.random()
      ); // Mélanger les questions
    } else {
      filteredQuestions = getRandomQuestions(
        quizData.questions.filter((q) => q.difficulty === difficulty),
        15
      );
    }

    setQuestions(filteredQuestions);
    setSelectedDifficulty(difficulty);
    setQuizStarted(true);
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setShowAnswer(false);
  };

  const total = questions.length;
  const progress = Math.round(((current + 1) / total) * 100);
  const isFinished = current >= total;
  const question = questions[current];

  const handleOptionClick = (option: string) => {
    if (selected) return;
    setSelected(option);
    setShowAnswer(true);
    if (option === question.answer) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    setSelected(null);
    setShowAnswer(false);
    setCurrent((prev) => prev + 1);
  };

  const handleRestart = () => {
    setQuizStarted(false);
    setSelectedDifficulty(null);
  };

  // Écran de sélection de difficulté
  if (!quizStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
        <div className="w-full max-w-md space-y-6 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-2xl font-bold text-center text-indigo-700 mb-2">
              Quiz PHP
            </h1>
            <p className="text-center text-gray-600 mb-6">
              Choisissez le niveau de difficulté (15 questions)
            </p>
          </motion.div>

          <motion.div
            className="grid gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              onClick={() => startQuiz("facile")}
              variant="outline"
              className="py-6 text-sm hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
            >
              Facile
            </Button>
            <Button
              onClick={() => startQuiz("moyen")}
              variant="outline"
              className="py-6 text-sm hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
            >
              Moyen
            </Button>
            <Button
              onClick={() => startQuiz("difficile")}
              variant="outline"
              className="py-6 text-sm hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
            >
              Difficile
            </Button>
            <Button
              onClick={() => startQuiz("tous")}
              className="py-6 text-sm bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Toutes les difficultés
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Écran du quiz
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="w-full max-w-md md:max-w-lg space-y-6">
        {/* En-tête avec progression */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Button
                onClick={returnToLanguageSelection}
                variant="ghost"
                size="icon"
                className="text-gray-500 hover:text-indigo-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Button>
              <h1 className="text-xl font-bold text-indigo-700">
                Quiz PHP - {selectedDifficulty}
              </h1>
            </div>
            <span className="text-sm font-medium text-gray-500">
              Question {current + 1}/{total}
            </span>
          </div>
          <div className="relative">
            <Progress
              value={isFinished ? 100 : progress}
              className="h-2 bg-gray-200"
            />
            <div
              className="absolute top-0 left-0 h-2 bg-indigo-600 rounded-full transition-all duration-300"
              style={{ width: `${isFinished ? 100 : progress}%` }}
            />
          </div>
        </div>

        {/* Contenu principal animé */}
        <AnimatePresence mode="wait">
          {!isFinished ? (
            <motion.div
              key={`question-${current}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="text-center space-y-2">
                <h2 className="text-xl font-semibold text-gray-800">
                  {question.question}
                </h2>
                <div className="flex justify-center items-center gap-2">
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                    {question.difficulty}
                  </span>
                  <div className="h-1 w-12 bg-indigo-100 rounded-full" />
                </div>
              </div>

              <div className="grid gap-3">
                {question.options.map((option) => {
                  const isCorrect = option === question.answer;
                  const isWrong = selected === option && !isCorrect;
                  const isSelected = selected === option;

                  return (
                    <motion.div
                      key={option}
                      whileTap={!selected ? { scale: 0.98 } : {}}
                    >
                      <label
                        onClick={() => handleOptionClick(option)}
                        className={cn(
                          "cursor-pointer px-4 py-3 rounded-lg text-sm transition-all duration-200",
                          "border hover:border-indigo-300 flex items-center gap-3",
                          !selected
                            ? "bg-white border-gray-200 hover:bg-indigo-50"
                            : "",
                          isSelected && isCorrect
                            ? "bg-green-50 border-green-300"
                            : "",
                          isSelected && isWrong
                            ? "bg-red-50 border-red-300"
                            : "",
                          selected && !isSelected ? "opacity-70 bg-gray-50" : ""
                        )}
                      >
                        <div
                          className={cn(
                            "w-5 h-5 rounded-full border flex items-center justify-center",
                            !selected
                              ? "border-gray-300"
                              : isSelected && isCorrect
                              ? "border-green-500 bg-green-500"
                              : isSelected && isWrong
                              ? "border-red-500 bg-red-500"
                              : "border-gray-300 bg-gray-100"
                          )}
                        >
                          {isSelected && (
                            <svg
                              className={cn(
                                "w-3 h-3",
                                isCorrect ? "text-white" : "text-white"
                              )}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              {isCorrect ? (
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              ) : (
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              )}
                            </svg>
                          )}
                        </div>
                        <span
                          className={cn(
                            isSelected && isCorrect ? "text-green-700" : "",
                            isSelected && isWrong ? "text-red-700" : ""
                          )}
                        >
                          {option}
                        </span>
                      </label>
                    </motion.div>
                  );
                })}
              </div>

              {showAnswer && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-center pt-2"
                >
                  <div className="mb-4">
                    {selected === question.answer ? (
                      <p className="text-green-600 font-medium">
                        Correct! Bien joué.
                      </p>
                    ) : (
                      <p className="text-red-600 font-medium">
                        La bonne réponse était:{" "}
                        <span className="font-bold">{question.answer}</span>
                      </p>
                    )}
                  </div>
                  <Button
                    onClick={handleNext}
                    className="mt-2 bg-indigo-600 hover:bg-indigo-700 shadow-sm"
                  >
                    {current === total - 1
                      ? "Voir les résultats"
                      : "Question suivante"}
                  </Button>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="text-center space-y-6 bg-white p-8 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full">
                <svg
                  className="w-10 h-10 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">🎉 Bravo !</h2>
              <p className="text-gray-600">Tu as terminé le quiz.</p>
              <div className="py-4">
                <p className="text-3xl font-bold text-indigo-600">
                  {score} <span className="text-gray-500">/ {total}</span>
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {score === total
                    ? "Score parfait! Excellent!"
                    : score >= total / 2
                    ? "Bon score! Continue comme ça!"
                    : "Tu peux faire mieux! Essaie encore."}
                </p>
              </div>
              <div className="mx-2">
                <Button
                  onClick={handleRestart}
                  className="bg-indigo-600 hover:bg-indigo-700 shadow-sm"
                >
                  Recommencer le quiz
                </Button>
                <Button
                  onClick={returnToLanguageSelection}
                  variant="ghost"
                  className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 mr-2"
                >
                  ← Retour
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
