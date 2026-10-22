import { cn } from "@/lib/utils";

// Fait apparaître son contenu en fondu vers le haut (animation CSS, voir globals.css).
export default function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number; // en secondes
  className?: string;
}) {
  return (
    <div className={cn("reveal", className)} style={{ "--delay": `${delay * 1000}ms` } as React.CSSProperties}>
      {children}
    </div>
  );
}
