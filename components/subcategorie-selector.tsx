"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const subcategories = {
  languages: [
    {
      name: "JavaScript",
      description: "Langage du web interactif",
      icon: "JS",
    },
    {
      name: "Python",
      description: "Langage polyvalent et lisible",
      icon: "PY",
    },
    {
      name: "PHP",
      description: "Langage back-end pour le web",
      icon: "PHP",
    },
    {
      name: "Java",
      description: "Langage orienté objet robuste",
      icon: "J",
    },
    {
      name: "C",
      description: "Langage de programmation système",
      icon: "C",
    },
  ],
  network: [
    {
      name: "Protocoles",
      description: "TCP/IP, HTTP, FTP, etc.",
      icon: "📡",
    },
    {
      name: "Réseaux IP",
      description: "Adressage, routage, etc.",
      icon: "🖧",
    },
    {
      name: "DNS",
      description: "Système de noms de domaine",
      icon: "🔗",
    },
    {
      name: "Sécurité Réseau",
      description: "Firewalls, VPN, etc.",
      icon: "🛡️",
    },
    {
      name: "WiFi",
      description: "Réseaux sans fil",
      icon: "📶",
    },
    {
      name: "Cloud",
      description: "AWS, Azure, GCP",
      icon: "☁️",
    },
  ],
  security: [
    {
      name: "Cryptographie",
      description: "Chiffrement et sécurité des données",
      icon: "🔐",
    },
    {
      name: "Malware",
      description: "Virus, ransomware, etc.",
      icon: "🦠",
    },
    {
      name: "Sécurité Web",
      description: "XSS, CSRF, SQLi, etc.",
      icon: "🕸️",
    },
    {
      name: "Sécurité Mobile",
      description: "Protection des apps mobiles",
      icon: "📱",
    },
  ],
  web: [
    {
      name: "HTML/CSS",
      description: "Bases du développement web",
      icon: "</>",
    },
    {
      name: "React",
      description: "Librairie JavaScript frontend",
      icon: "⚛️",
    },
    {
      name: "Node.js",
      description: "JavaScript côté serveur",
      icon: "⬢",
    },
    {
      name: "API REST",
      description: "Conception d'APIs web",
      icon: "🔄",
    },
    {
      name: "Laravel",
      description: "Framework PHP élégant et expressif",
      icon: "🪄",
    },
    {
      name: "Django",
      description: "Framework Python 'batteries included'",
      icon: "🐍",
    },
    {
      name: "JEE",
      description: "Java Enterprise Edition pour applications d'entreprise",
      icon: "☕",
    },
    {
      name: "Next.js",
      description: "Framework React pour applications full-stack",
      icon: "⏭️",
    },
  ],
  mobile: [
    {
      name: "Android",
      description: "Développement avec Kotlin/Java",
      icon: "🤖",
    },
    {
      name: "iOS",
      description: "Développement avec Swift",
      icon: "🍏",
    },
    {
      name: "React Native",
      description: "Applications cross-platform",
      icon: "⚛️",
    },
    {
      name: "Flutter",
      description: "Framework mobile de Google",
      icon: "📱",
    },
  ],
  databases: [
    {
      name: "MySQL",
      description: "SGBD relationnel populaire",
      icon: "🐬",
    },
    {
      name: "PostgreSQL",
      description: "SGBD relationnel avancé",
      icon: "🐘",
    },
    {
      name: "SQL Server",
      description: "SGBD relationnel de Microsoft",
      icon: "🗄️",
    },
    {
      name: "PL/SQL",
      description: "Langage procédural pour Oracle",
      icon: "🟠",
    },
  ],
  devops: [
    {
      name: "Docker",
      description: "Conteneurisation d'applications",
      icon: "🐳",
    },
    {
      name: "Kubernetes",
      description: "Orchestration de conteneurs",
      icon: "☸️",
    },
    {
      name: "CI/CD",
      description: "Intégration continue",
      icon: "🔄",
    },
    {
      name: "Linux",
      description: "Administration système",
      icon: "🐧",
    },
  ],
};

export default function SubcategorySelector({
  category,
}: {
  category: string;
}) {
  const router = useRouter();
  const currentSubcategories =
    subcategories[category as keyof typeof subcategories] || [];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl font-bold text-indigo-700 mb-2">
            Choisissez un quiz
          </h1>
          <p className="text-gray-600">
            Sélectionnez le sujet que vous souhaitez tester
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentSubcategories.map((subcat, index) => (
            <motion.div
              key={subcat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <div
                onClick={() =>
                  router.push(
                    `/quiz/${category}/${subcat.name
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`
                  )
                }
                className="w-full h-full p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-indigo-300 cursor-pointer transition-all flex flex-col items-center text-center hover:shadow-md"
              >
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mb-4 text-xl font-mono">
                  {subcat.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {subcat.name}
                </h3>
                <p className="text-gray-600 text-sm">{subcat.description}</p>
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
