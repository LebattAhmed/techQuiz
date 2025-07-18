"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import QuizSelector from "@/components/quiz-selector";

export default function Home() {
  const [quizStarted, setQuizStarted] = useState(false);

  if (!quizStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
        <div className="w-full max-w-2xl space-y-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-indigo-700 mb-4">
              Quiz de Programmation
            </h1>
            <p className="text-xl text-gray-600">
              Testez vos connaissances en développement
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="mt-10">
              <Button
                onClick={() => setQuizStarted(true)}
                className="px-8 py-6 text-lg bg-indigo-600 hover:bg-indigo-700 shadow-lg transition-all"
                size="lg"
              >
                Commencer
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-12 text-gray-500 text-sm"
          >
            <p>Plusieurs langages disponibles • 15 questions par quiz</p>
          </motion.div>
        </div>
      </div>
    );
  }

  return <QuizSelector />;
}
