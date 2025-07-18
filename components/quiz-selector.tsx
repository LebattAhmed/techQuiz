//quiz selector

"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const languages = [
  {
    name: "JavaScript",
    description: "Langage du web interactif",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 12h14M12 5l7 7-7 7"
        />
      </svg>
    ),
  },
  {
    name: "Python",
    description: "Langage polyvalent et lisible",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 12h14M12 5l7 7-7 7"
        />
      </svg>
    ),
  },
  {
    name: "PHP",
    description: "Langage back-end pour le web",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 12h14M12 5l7 7-7 7"
        />
      </svg>
    ),
  },
  {
    name: "Java",
    description: "Langage orienté objet robuste",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 12h14M12 5l7 7-7 7"
        />
      </svg>
    ),
  },
  {
    name: "C",
    description: "Langage de programmation système",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 12h14M12 5l7 7-7 7"
        />
      </svg>
    ),
  },
  {
    name: "Reseau",
    description: "Concepts réseaux et protocoles",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 12h14M12 5l7 7-7 7"
        />
      </svg>
    ),
  },
];

export default function QuizSelector({ setQuizStarted }: any) {
  const router = useRouter();

  const returnToLanguageSelection = () => {
    setQuizStarted(false);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      {/* Nouveau header avec bouton de retour intégré */}
      <header className="max-w-4xl mx-auto pt-6 pb-4 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between"
        >
          <Button
            onClick={returnToLanguageSelection}
            variant="ghost"
            className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg transition-colors"
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
            <span>Retour</span>
          </Button>

          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-indigo-700">
              Choisissez un thème
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              Sélectionnez le quiz que vous souhaitez passer
            </p>
          </div>

          {/* Espace vide pour équilibrer le layout */}
          <div className="w-24"></div>
        </motion.div>
      </header>

      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {languages.map((lang, index) => (
            <motion.div
              key={lang.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <div
                onClick={() =>
                  router.replace(`/quiz/${lang.name.toLowerCase()}`)
                }
                className="w-full h-full p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-indigo-300 cursor-pointer transition-all flex flex-col items-center text-center hover:shadow-md"
              >
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
                  {lang.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {lang.name}
                </h3>
                <p className="text-gray-600 text-sm">{lang.description}</p>
                <Button
                  variant="ghost"
                  className="mt-4 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                >
                  Commencer
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
