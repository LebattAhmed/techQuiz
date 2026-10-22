import Link from "next/link";
import { ArrowDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/logo";
import Reveal from "@/components/reveal";
import { CardGrid, CategoryCard } from "@/components/cards";
import { categories, getQuestionCounts } from "@/lib/quizzes";

export default async function Home() {
  const counts = await getQuestionCounts();
  const totalQuestions = Object.values(counts).reduce((a, b) => a + b, 0);
  const totalSubjects = Object.values(counts).filter((n) => n > 0).length;

  const stats = [
    { value: totalQuestions.toLocaleString("fr-FR"), label: "questions" },
    { value: totalSubjects, label: "sujets" },
    { value: categories.length, label: "catégories" },
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
      <section className="flex flex-col items-center pt-12 pb-20 text-center sm:pt-16">
        <Reveal>
          <Logo className="mb-8 size-32 rounded-3xl shadow-xl shadow-primary/20 sm:size-40" />
        </Reveal>
        <Reveal delay={0.04}>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            <Sparkles className="size-4" aria-hidden />
            Entraînez-vous gratuitement, sans inscription
          </span>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="mt-6 max-w-3xl text-4xl font-bold tracking-tight text-balance sm:text-6xl">
            Testez vos connaissances{" "}
            <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
              en informatique
            </span>
          </h1>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-5 max-w-xl text-lg text-pretty text-muted-foreground">
            Programmation, réseau, cybersécurité, bases de données, DevOps, IA… Des quiz de
            15 questions, trois niveaux de difficulté et la correction immédiate.
          </p>
        </Reveal>
        <Reveal delay={0.24} className="mt-8">
          <Button asChild size="lg" className="h-12 rounded-xl px-7 text-base shadow-lg shadow-primary/25">
            <Link href="#categories">
              Commencer <ArrowDown className="size-4" />
            </Link>
          </Button>
        </Reveal>
        <Reveal delay={0.32}>
          <dl className="mt-12 grid grid-cols-3 gap-6 sm:gap-12">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse items-center">
                <dt className="text-sm text-muted-foreground">{s.label}</dt>
                <dd className="text-3xl font-bold tracking-tight tabular-nums">{s.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      <section id="categories" className="scroll-mt-24">
        <h2 className="text-2xl font-bold tracking-tight">Catégories</h2>
        <p className="mt-1 mb-6 text-muted-foreground">Choisissez un domaine, puis un sujet.</p>
        <CardGrid>
          {categories.map((c) => (
            <CategoryCard
              key={c.slug}
              href={`/quiz/${c.slug}`}
              name={c.name}
              description={c.description}
              icon={c.icon}
              accent={c.accent}
              subjects={c.subjects.length}
              questions={c.subjects.reduce((n, s) => n + counts[s.slug], 0)}
            />
          ))}
        </CardGrid>
      </section>
    </main>
  );
}
