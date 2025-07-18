"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const categories = [
  {
    name: "Langages",
    description: "Programmation avec différents langages",
    icon: "💻",
    path: "languages",
  },
  {
    name: "Réseau",
    description: "Concepts réseaux et protocoles",
    icon: "🌐",
    path: "network",
  },
  {
    name: "Sécurité",
    description: "Cybersécurité et bonnes pratiques",
    icon: "🔒",
    path: "security",
  },
  {
    name: "Développement Web",
    description: "Frontend, backend et technologies web",
    icon: "🕸️",
    path: "web",
  },
  {
    name: "Développement Mobile",
    description: "Applications iOS et Android",
    icon: "📱",
    path: "mobile",
  },
  {
    name: "Base de données",
    description: "SGBD relationnels et NoSQL, modélisation et requêtes",
    icon: "🗃️",
    path: "databases",
  },
  {
    name: "DevOps",
    description: "Pratiques de déploiement, conteneurisation et automatisation",
    icon: "🔁",
    path: "devops",
  },
];

export default function CategorySelector() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl font-bold text-indigo-700 mb-2">
            Choisissez une catégorie
          </h1>
          <p className="text-gray-600">
            Sélectionnez le domaine que vous souhaitez explorer
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <div
                onClick={() => router.push(`/quiz/${category.path}`)}
                className="w-full h-full p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-indigo-300 cursor-pointer transition-all flex flex-col items-center text-center hover:shadow-md"
              >
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mb-4 text-2xl">
                  {category.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {category.name}
                </h3>
                <p className="text-gray-600 text-sm">{category.description}</p>
                <button className="mt-4 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 px-4 py-2 rounded-md text-sm font-medium">
                  Voir les quiz
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
