"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export type Choice = {
  href: string;
  name: string;
  description: string;
  icon: string;
  disabled?: boolean;
};

// Grille de cartes cliquables, utilisée pour choisir une catégorie puis un sujet.
export default function ChoiceGrid({
  title,
  subtitle,
  backHref,
  choices,
}: {
  title: string;
  subtitle: string;
  backHref: string;
  choices: Choice[];
}) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-6xl mx-auto py-6 px-2 sm:px-6">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden />
          Retour
        </Link>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center my-8"
        >
          <h1 className="text-3xl font-bold text-indigo-700 mb-2">{title}</h1>
          <p className="text-gray-600">{subtitle}</p>
        </motion.div>

        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {choices.map((choice, index) => (
            <motion.li
              key={choice.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <ChoiceCard choice={choice} />
            </motion.li>
          ))}
        </ul>
      </div>
    </main>
  );
}

function ChoiceCard({ choice }: { choice: Choice }) {
  const content = (
    <>
      <span
        className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mb-4 text-xl font-mono"
        aria-hidden
      >
        {choice.icon}
      </span>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">{choice.name}</h2>
      <p className="text-gray-600 text-sm">{choice.description}</p>
      <span className="mt-4 text-sm font-medium text-indigo-600">
        {choice.disabled ? "Bientôt disponible" : "Commencer →"}
      </span>
    </>
  );

  const className =
    "w-full h-full p-6 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col items-center text-center";

  if (choice.disabled) {
    return (
      <div className={cn(className, "opacity-60 cursor-not-allowed")} aria-disabled>
        {content}
      </div>
    );
  }

  return (
    <Link
      href={choice.href}
      className={cn(
        className,
        "transition-all hover:border-indigo-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-indigo-600"
      )}
    >
      {content}
    </Link>
  );
}
