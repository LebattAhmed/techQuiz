import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Fil d'Ariane">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="size-4" aria-hidden />}
            {item.href ? (
              <Link href={item.href} className="rounded px-1 transition-colors hover:text-foreground">
                {item.label}
              </Link>
            ) : (
              <span className="px-1 font-medium text-foreground" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
