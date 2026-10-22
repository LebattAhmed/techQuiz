import Link from "next/link";
import Logo from "@/components/logo";
import ThemeToggle from "@/components/theme-toggle";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5 rounded-lg font-semibold tracking-tight">
          <Logo className="size-10 rounded-lg transition-transform group-hover:rotate-3" priority />
          <span className="text-lg" aria-hidden>
            Tech<span className="text-primary">Quiz</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          <Link
            href="/#categories"
            className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Catégories
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
