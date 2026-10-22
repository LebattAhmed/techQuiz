import { readFile } from "node:fs/promises";
import path from "node:path";

export type Difficulty = "facile" | "moyen" | "difficile";

export type Question = {
  question: string;
  options: string[];
  answer: string;
  difficulty: Difficulty;
};

export type Subject = {
  slug: string; // nom du fichier data/quizzes/<slug>-quiz.json
  name: string;
  description: string;
  short: string; // monogramme affiché dans la tuile
};

export type CategoryIcon =
  | "code"
  | "network"
  | "shield"
  | "globe"
  | "smartphone"
  | "database"
  | "workflow"
  | "binary"
  | "brain"
  | "boxes";

export type Category = {
  slug: string;
  name: string;
  description: string;
  icon: CategoryIcon;
  accent: string; // classes Tailwind du dégradé (from-… to-…)
  subjects: Subject[];
};

// Source unique de vérité pour les catégories, les sujets et les URLs.
export const categories: Category[] = [
  {
    slug: "langages",
    name: "Langages",
    description: "Les bases et les subtilités des langages de programmation",
    icon: "code",
    accent: "from-violet-500 to-indigo-500",
    subjects: [
      { slug: "javascript", name: "JavaScript", description: "Le langage du web interactif", short: "JS" },
      { slug: "typescript", name: "TypeScript", description: "JavaScript avec un système de types", short: "TS" },
      { slug: "python", name: "Python", description: "Polyvalent, lisible et partout", short: "PY" },
      { slug: "php", name: "PHP", description: "Le back-end historique du web", short: "PHP" },
      { slug: "java", name: "Java", description: "Orienté objet, robuste, JVM", short: "JV" },
      { slug: "c", name: "C", description: "Programmation système et mémoire", short: "C" },
    ],
  },
  {
    slug: "reseau",
    name: "Réseau",
    description: "Protocoles, adressage et infrastructures",
    icon: "network",
    accent: "from-sky-500 to-cyan-500",
    subjects: [
      { slug: "protocoles", name: "Protocoles", description: "TCP/IP, HTTP, DNS, QUIC…", short: "TCP" },
      { slug: "reseau-ip", name: "Réseaux IP", description: "Adressage, routage, sous-réseaux", short: "IP" },
      { slug: "dns", name: "DNS", description: "Le système de noms de domaine", short: "DNS" },
      { slug: "securite-reseau", name: "Sécurité réseau", description: "Pare-feu, VPN, IDS", short: "FW" },
      { slug: "wifi", name: "Wi-Fi", description: "Réseaux sans fil et leur sécurité", short: "WiFi" },
      { slug: "cloud", name: "Cloud", description: "IaaS, PaaS, AWS, Azure, GCP", short: "☁" },
    ],
  },
  {
    slug: "securite",
    name: "Sécurité",
    description: "Cybersécurité offensive et défensive",
    icon: "shield",
    accent: "from-rose-500 to-orange-500",
    subjects: [
      { slug: "cryptographie", name: "Cryptographie", description: "Chiffrement, hachage, signatures", short: "🔐" },
      { slug: "malware", name: "Malware", description: "Virus, ransomware, analyse", short: "MAL" },
      { slug: "securite-web", name: "Sécurité web", description: "XSS, CSRF, injections, OWASP", short: "OWASP" },
      { slug: "securite-mobile", name: "Sécurité mobile", description: "Protéger les apps mobiles", short: "MOB" },
    ],
  },
  {
    slug: "web",
    name: "Développement web",
    description: "Frontend, backend et frameworks",
    icon: "globe",
    accent: "from-emerald-500 to-teal-500",
    subjects: [
      { slug: "html-css", name: "HTML/CSS", description: "Structure et mise en forme", short: "</>" },
      { slug: "react", name: "React", description: "Composants, hooks et état", short: "⚛" },
      { slug: "nextjs", name: "Next.js", description: "Le framework React full-stack", short: "N" },
      { slug: "nodejs", name: "Node.js", description: "JavaScript côté serveur", short: "NODE" },
      { slug: "api-rest", name: "API REST", description: "Concevoir des APIs web", short: "API" },
      { slug: "laravel", name: "Laravel", description: "Le framework PHP élégant", short: "LV" },
      { slug: "django", name: "Django", description: "Le framework Python « batteries included »", short: "DJ" },
      { slug: "jee", name: "Jakarta EE", description: "Java pour les applications d'entreprise", short: "JEE" },
    ],
  },
  {
    slug: "mobile",
    name: "Développement mobile",
    description: "Applications natives et multiplateformes",
    icon: "smartphone",
    accent: "from-fuchsia-500 to-pink-500",
    subjects: [
      { slug: "android", name: "Android", description: "Kotlin, Jetpack et cycle de vie", short: "AND" },
      { slug: "ios", name: "iOS", description: "Swift, SwiftUI et UIKit", short: "iOS" },
      { slug: "react-native", name: "React Native", description: "Apps mobiles en React", short: "RN" },
      { slug: "flutter", name: "Flutter", description: "Dart et widgets multiplateformes", short: "FL" },
    ],
  },
  {
    slug: "bases-de-donnees",
    name: "Bases de données",
    description: "SQL, modélisation et SGBD",
    icon: "database",
    accent: "from-amber-500 to-yellow-500",
    subjects: [
      { slug: "mysql", name: "MySQL", description: "Le SGBD relationnel populaire", short: "MY" },
      { slug: "postgresql", name: "PostgreSQL", description: "Le SGBD relationnel avancé", short: "PG" },
      { slug: "sql-server", name: "SQL Server", description: "Le SGBD de Microsoft", short: "MS" },
      { slug: "pl-sql", name: "PL/SQL", description: "Le langage procédural d'Oracle", short: "PL" },
    ],
  },
  {
    slug: "devops",
    name: "DevOps",
    description: "Conteneurs, automatisation et systèmes",
    icon: "workflow",
    accent: "from-blue-500 to-violet-500",
    subjects: [
      { slug: "git", name: "Git", description: "Gestion de versions", short: "GIT" },
      { slug: "linux", name: "Linux", description: "Shell et administration système", short: "SH" },
      { slug: "docker", name: "Docker", description: "Conteneurisation d'applications", short: "DK" },
      { slug: "kubernetes", name: "Kubernetes", description: "Orchestration de conteneurs", short: "K8s" },
      { slug: "ci-cd", name: "CI/CD", description: "Intégration et déploiement continus", short: "CI" },
    ],
  },
  {
    slug: "algorithmique",
    name: "Algorithmique",
    description: "Structures de données et complexité",
    icon: "binary",
    accent: "from-lime-500 to-emerald-500",
    subjects: [
      { slug: "structures-de-donnees", name: "Structures de données", description: "Tableaux, listes, arbres, graphes", short: "{ }" },
      { slug: "algorithmes", name: "Algorithmes", description: "Tri, recherche, complexité", short: "O(n)" },
    ],
  },
  {
    slug: "ia-data",
    name: "IA & Data",
    description: "Machine learning et science des données",
    icon: "brain",
    accent: "from-purple-500 to-fuchsia-500",
    subjects: [
      { slug: "machine-learning", name: "Machine learning", description: "Modèles, entraînement, évaluation", short: "ML" },
      { slug: "data-science", name: "Data science", description: "Statistiques, pandas, visualisation", short: "DS" },
    ],
  },
  {
    slug: "genie-logiciel",
    name: "Génie logiciel",
    description: "Conception, qualité et méthodes",
    icon: "boxes",
    accent: "from-teal-500 to-sky-500",
    subjects: [
      { slug: "design-patterns", name: "Design patterns", description: "Patrons de conception et SOLID", short: "GoF" },
      { slug: "tests-logiciels", name: "Tests logiciels", description: "Unitaires, intégration, TDD", short: "✓" },
    ],
  },
];

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function getSubject(categorySlug: string, subjectSlug: string) {
  return getCategory(categorySlug)?.subjects.find((s) => s.slug === subjectSlug);
}

// Lu côté serveur uniquement (au build, les pages sont statiques).
// Un sujet sans fichier ou sans questions renvoie une liste vide.
export async function getQuestions(subjectSlug: string): Promise<Question[]> {
  const file = path.join(process.cwd(), "data", "quizzes", `${subjectSlug}-quiz.json`);
  try {
    const data = JSON.parse(await readFile(file, "utf8")) as { questions: Question[] };
    return data.questions;
  } catch {
    return [];
  }
}

export async function getQuestionCounts(): Promise<Record<string, number>> {
  const slugs = categories.flatMap((c) => c.subjects.map((s) => s.slug));
  const counts = await Promise.all(slugs.map(async (slug) => (await getQuestions(slug)).length));
  return Object.fromEntries(slugs.map((slug, i) => [slug, counts[i]]));
}
