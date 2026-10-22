import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/breadcrumb";
import Reveal from "@/components/reveal";
import { CardGrid, CategoryGlyph, SubjectCard } from "@/components/cards";
import { categories, getCategory, getQuestionCounts } from "@/lib/quizzes";

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
  const counts = await getQuestionCounts();

  return (
    <main className="mx-auto max-w-6xl px-4 pt-8 pb-24 sm:px-6">
      <Breadcrumb items={[{ label: "Accueil", href: "/" }, { label: category.name }]} />
      <Reveal className="mt-6 mb-10 flex items-center gap-4">
        <CategoryGlyph icon={category.icon} accent={category.accent} className="size-14" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{category.name}</h1>
          <p className="text-muted-foreground">{category.description}</p>
        </div>
      </Reveal>
      <CardGrid>
        {category.subjects.map((s) => (
          <SubjectCard
            key={s.slug}
            href={`/quiz/${category.slug}/${s.slug}`}
            slug={s.slug}
            name={s.name}
            description={s.description}
            short={s.short}
            accent={category.accent}
            questions={counts[s.slug]}
          />
        ))}
      </CardGrid>
    </main>
  );
}
