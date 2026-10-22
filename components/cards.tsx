"use client";

import { Children, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Binary,
  Boxes,
  BrainCircuit,
  Code2,
  Database,
  Globe,
  Network,
  ShieldCheck,
  Smartphone,
  Trophy,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { readBestScore, type BestScore } from "@/lib/best-score";
import type { CategoryIcon } from "@/lib/quizzes";

const ICONS: Record<CategoryIcon, LucideIcon> = {
  code: Code2,
  network: Network,
  shield: ShieldCheck,
  globe: Globe,
  smartphone: Smartphone,
  database: Database,
  workflow: Workflow,
  binary: Binary,
  brain: BrainCircuit,
  boxes: Boxes,
};

export function CategoryGlyph({ icon, accent, className }: { icon: CategoryIcon; accent: string; className?: string }) {
  const Icon = ICONS[icon];
  return (
    <span
      className={cn(
        "grid size-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br text-white shadow-lg shadow-black/10",
        accent,
        className
      )}
      aria-hidden
    >
      <Icon className="size-6" />
    </span>
  );
}

// Grille de cartes : chaque carte apparaît avec un léger décalage (animation CSS).
export function CardGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <ul className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {Children.toArray(children).map((child, i) => (
        <li key={i} className="reveal" style={{ "--delay": `${i * 40}ms` } as React.CSSProperties}>
          {child}
        </li>
      ))}
    </ul>
  );
}

const cardClass =
  "group relative flex h-full flex-col rounded-2xl p-5 glass transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

export function CategoryCard({
  href,
  name,
  description,
  icon,
  accent,
  subjects,
  questions,
}: {
  href: string;
  name: string;
  description: string;
  icon: CategoryIcon;
  accent: string;
  subjects: number;
  questions: number;
}) {
  return (
    <Link href={href} className={cardClass}>
      <div className="flex items-start justify-between">
        <CategoryGlyph icon={icon} accent={accent} className="transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3" />
        <ArrowRight className="size-5 text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary" />
      </div>
      <h3 className="mt-4 text-lg font-semibold tracking-tight">{name}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      <p className="mt-auto pt-4 text-xs font-medium text-muted-foreground">
        {subjects} sujets · {questions} questions
      </p>
    </Link>
  );
}

export function SubjectCard({
  href,
  slug,
  name,
  description,
  short,
  accent,
  questions,
}: {
  href: string;
  slug: string;
  name: string;
  description: string;
  short: string;
  accent: string;
  questions: number;
}) {
  const [best, setBest] = useState<BestScore | null>(null);
  useEffect(() => setBest(readBestScore(slug)), [slug]);

  const disabled = questions === 0;
  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            "grid h-12 min-w-12 place-items-center rounded-xl bg-gradient-to-br px-2 font-mono text-sm font-bold text-white shadow-lg shadow-black/10 transition-transform duration-300 group-hover:scale-110",
            accent
          )}
          aria-hidden
        >
          {short}
        </span>
        {best && (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300">
            <Trophy className="size-3.5" aria-hidden />
            Record {best.score}/{best.total}
          </span>
        )}
      </div>
      <h3 className="mt-4 text-lg font-semibold tracking-tight">{name}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      <div className="mt-auto flex items-center justify-between pt-4 text-xs font-medium text-muted-foreground">
        <span>{disabled ? "Bientôt disponible" : `${questions} questions`}</span>
        {!disabled && (
          <span className="inline-flex items-center gap-1 text-primary opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100">
            Jouer <ArrowRight className="size-3.5" />
          </span>
        )}
      </div>
    </>
  );

  return disabled ? (
    <div className={cn(cardClass, "pointer-events-none opacity-55")} aria-disabled>
      {content}
    </div>
  ) : (
    <Link href={href} className={cardClass}>
      {content}
    </Link>
  );
}
