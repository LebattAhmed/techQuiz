import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-xl flex-col items-center px-4 py-32 text-center">
      <p className="font-mono text-sm font-semibold text-primary">404</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">Page introuvable</h1>
      <p className="mt-3 text-muted-foreground">Ce quiz n&apos;existe pas ou n&apos;est pas encore disponible.</p>
      <Button asChild className="mt-8 h-11 rounded-xl px-6">
        <Link href="/">Retour à l&apos;accueil</Link>
      </Button>
    </main>
  );
}
