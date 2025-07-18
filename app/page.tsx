"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import QuizSelector from "@/components/quiz-selector";
import Image from "next/image";

export default function Home() {
  const [quizStarted, setQuizStarted] = useState(false);

  if (!quizStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
        <div className="w-full max-w-2xl flex flex-col items-center space-y-6 text-center">
          {/* Logo et description */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center space-y-4"
          >
            <Image src="/logo.png" width={180} height={180} alt="Logo" />
            <p className="text-lg md:text-xl text-gray-700 max-w-xl">
              Évaluez vos connaissances en informatique : programmation, réseau,
              cybersécurité, et bien plus encore.
            </p>
          </motion.div>

          {/* Bouton commencer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Button
              onClick={() => setQuizStarted(true)}
              className="px-8 py-4 text-base md:text-lg bg-indigo-600 hover:bg-indigo-700 shadow-md cursor-pointer"
            >
              Commencer
            </Button>
          </motion.div>

          {/* Footer info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-gray-500 text-sm"
          >
            <p>
              Langages, réseau, sécurité, bases de données • 15 à 30 questions
              par quiz
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return <QuizSelector setQuizStarted={setQuizStarted} />;
}
