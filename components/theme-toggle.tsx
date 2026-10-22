"use client";

import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const toggle = () => {
    const dark = document.documentElement.classList.toggle("dark");
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch {
      // stockage indisponible (navigation privée…) : le thème ne sera simplement pas mémorisé
    }
  };

  // Les deux icônes sont rendues et la classe .dark choisit laquelle afficher,
  // ce qui évite tout décalage d'hydratation.
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Changer de thème"
      className="grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
    >
      <Sun className="size-5 dark:hidden" />
      <Moon className="hidden size-5 dark:block" />
    </button>
  );
}
