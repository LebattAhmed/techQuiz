import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ChoiceGrid from "@/components/choice-grid";
import { categories, getCategory, getQuestions } from "@/lib/quizzes";

type Props = { params: Promise<{ category: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = getCategory((await params).category);
  return { title: `${category?.name ?? "Quiz"} | Tech Quiz` };
}

export default async function CategoryPage({ params }: Props) {
  const category = getCategory((await params).category);
  if (!category) notFound();

  const choices = await Promise.all(
    category.subjects.map(async (s) => ({
      href: `/quiz/${category.slug}/${s.slug}`,
      name: s.name,
      description: s.description,
      icon: s.icon,
      disabled: (await getQuestions(s.slug)).length === 0,
    }))
  );

  return (
    <ChoiceGrid
      title={category.name}
      subtitle="Sélectionnez le sujet que vous souhaitez tester"
      backHref="/quiz"
      choices={choices}
    />
  );
}
