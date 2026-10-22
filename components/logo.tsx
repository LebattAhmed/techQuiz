import Image from "next/image";
import { cn } from "@/lib/utils";

// Le logo (public/logo.png) a un fond transparent et un texte noir : on l'affiche
// sur une pastille blanche pour qu'il reste lisible en mode sombre. L'image a
// beaucoup de marge autour du dessin, d'où le léger zoom.
export default function Logo({ className, priority }: { className?: string; priority?: boolean }) {
  return (
    <span className={cn("relative block overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-black/5", className)}>
      <Image src="/logo.png" alt="Tech Quiz" fill sizes="200px" priority={priority} className="scale-[1.6] object-contain" />
    </span>
  );
}
