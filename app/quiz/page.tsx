import type { Metadata } from "next";
import ChoiceGrid from "@/components/choice-grid";
import { categories } from "@/lib/quizzes";

export const metadata: Metadata = { title: "Catégories | Tech Quiz" };

export default function CategoriesPage() {
  return (
    <ChoiceGrid
      title="Choisissez une catégorie"
      subtitle="Sélectionnez le domaine que vous souhaitez explorer"
      backHref="/"
      choices={categories.map((c) => ({
        href: `/quiz/${c.slug}`,
        name: c.name,
        description: c.description,
        icon: c.icon,
      }))}
    />
  );
}
