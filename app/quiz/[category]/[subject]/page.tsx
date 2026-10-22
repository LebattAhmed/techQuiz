import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Quiz from "@/components/quiz";
import { categories, getCategory, getQuestions, getSubject } from "@/lib/quizzes";

type Props = { params: Promise<{ category: string; subject: string }> };

export const dynamicParams = false;

// Seuls les sujets qui ont des questions sont générés ; les autres renvoient une 404.
export async function generateStaticParams() {
  const params = categories.flatMap((c) => c.subjects.map((s) => ({ category: c.slug, subject: s.slug })));
  const available = await Promise.all(params.map(async (p) => (await getQuestions(p.subject)).length > 0));
  return params.filter((_, i) => available[i]);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, subject } = await params;
  return { title: `Quiz ${getSubject(category, subject)?.name ?? ""} | Tech Quiz` };
}

export default async function SubjectPage({ params }: Props) {
  const { category: categorySlug, subject: subjectSlug } = await params;
  const category = getCategory(categorySlug);
  const subject = getSubject(categorySlug, subjectSlug);
  const questions = subject ? await getQuestions(subject.slug) : [];
  if (!category || !subject || questions.length === 0) notFound();

  return (
    <Quiz
      subject={{ slug: subject.slug, name: subject.name, short: subject.short }}
      category={{ slug: category.slug, name: category.name, accent: category.accent }}
      questions={questions}
    />
  );
}
