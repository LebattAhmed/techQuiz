import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Quiz from "@/components/quiz";
import { categories, getQuestions, getSubject } from "@/lib/quizzes";

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
  const { category, subject: subjectSlug } = await params;
  const subject = getSubject(category, subjectSlug);
  const questions = subject ? await getQuestions(subject.slug) : [];
  if (!subject || questions.length === 0) notFound();

  return <Quiz title={subject.name} questions={questions} backHref={`/quiz/${category}`} />;
}
