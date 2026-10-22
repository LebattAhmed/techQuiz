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
  icon: string;
};

export type Category = {
  slug: string;
  name: string;
  description: string;
  icon: string;
  subjects: Subject[];
};

// Source unique de vérité pour les catégories, les sujets et les URLs.
export const categories: Category[] = [
  {
    slug: "langages",
    name: "Langages",
    description: "Programmation avec différents langages",
    icon: "💻",
    subjects: [
      { slug: "javascript", name: "JavaScript", description: "Langage du web interactif", icon: "JS" },
      { slug: "python", name: "Python", description: "Langage polyvalent et lisible", icon: "PY" },
      { slug: "php", name: "PHP", description: "Langage back-end pour le web", icon: "PHP" },
      { slug: "java", name: "Java", description: "Langage orienté objet robuste", icon: "☕" },
      { slug: "c", name: "C", description: "Langage de programmation système", icon: "C" },
    ],
  },
  {
    slug: "reseau",
    name: "Réseau",
    description: "Concepts réseaux et protocoles",
    icon: "🌐",
    subjects: [
      { slug: "protocoles", name: "Protocoles", description: "TCP/IP, HTTP, FTP, etc.", icon: "📡" },
      { slug: "reseau-ip", name: "Réseaux IP", description: "Adressage, routage, etc.", icon: "🖧" },
      { slug: "dns", name: "DNS", description: "Système de noms de domaine", icon: "🔗" },
      { slug: "securite-reseau", name: "Sécurité réseau", description: "Firewalls, VPN, etc.", icon: "🛡️" },
      { slug: "wifi", name: "WiFi", description: "Réseaux sans fil", icon: "📶" },
      { slug: "cloud", name: "Cloud", description: "AWS, Azure, GCP", icon: "☁️" },
    ],
  },
  {
    slug: "securite",
    name: "Sécurité",
    description: "Cybersécurité et bonnes pratiques",
    icon: "🔒",
    subjects: [
      { slug: "cryptographie", name: "Cryptographie", description: "Chiffrement et sécurité des données", icon: "🔐" },
      { slug: "malware", name: "Malware", description: "Virus, ransomware, etc.", icon: "🦠" },
      { slug: "securite-web", name: "Sécurité web", description: "XSS, CSRF, SQLi, etc.", icon: "🕸️" },
      { slug: "securite-mobile", name: "Sécurité mobile", description: "Protection des apps mobiles", icon: "📱" },
    ],
  },
  {
    slug: "web",
    name: "Développement web",
    description: "Frontend, backend et technologies web",
    icon: "🕸️",
    subjects: [
      { slug: "html-css", name: "HTML/CSS", description: "Bases du développement web", icon: "</>" },
      { slug: "react", name: "React", description: "Librairie JavaScript frontend", icon: "⚛️" },
      { slug: "nodejs", name: "Node.js", description: "JavaScript côté serveur", icon: "⬢" },
      { slug: "api-rest", name: "API REST", description: "Conception d'APIs web", icon: "🔄" },
      { slug: "laravel", name: "Laravel", description: "Framework PHP élégant et expressif", icon: "🪄" },
      { slug: "django", name: "Django", description: "Framework Python « batteries included »", icon: "🐍" },
      { slug: "jee", name: "JEE", description: "Java pour les applications d'entreprise", icon: "☕" },
      { slug: "nextjs", name: "Next.js", description: "Framework React full-stack", icon: "⏭️" },
    ],
  },
  {
    slug: "mobile",
    name: "Développement mobile",
    description: "Applications iOS et Android",
    icon: "📱",
    subjects: [
      { slug: "android", name: "Android", description: "Développement avec Kotlin/Java", icon: "🤖" },
      { slug: "ios", name: "iOS", description: "Développement avec Swift", icon: "🍏" },
      { slug: "react-native", name: "React Native", description: "Applications cross-platform", icon: "⚛️" },
      { slug: "flutter", name: "Flutter", description: "Framework mobile de Google", icon: "📱" },
    ],
  },
  {
    slug: "bases-de-donnees",
    name: "Bases de données",
    description: "SGBD relationnels, modélisation et requêtes",
    icon: "🗃️",
    subjects: [
      { slug: "mysql", name: "MySQL", description: "SGBD relationnel populaire", icon: "🐬" },
      { slug: "postgresql", name: "PostgreSQL", description: "SGBD relationnel avancé", icon: "🐘" },
      { slug: "sql-server", name: "SQL Server", description: "SGBD relationnel de Microsoft", icon: "🗄️" },
      { slug: "pl-sql", name: "PL/SQL", description: "Langage procédural pour Oracle", icon: "🟠" },
    ],
  },
  {
    slug: "devops",
    name: "DevOps",
    description: "Déploiement, conteneurisation et automatisation",
    icon: "🔁",
    subjects: [
      { slug: "docker", name: "Docker", description: "Conteneurisation d'applications", icon: "🐳" },
      { slug: "kubernetes", name: "Kubernetes", description: "Orchestration de conteneurs", icon: "☸️" },
      { slug: "ci-cd", name: "CI/CD", description: "Intégration et déploiement continus", icon: "🔄" },
      { slug: "linux", name: "Linux", description: "Administration système", icon: "🐧" },
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
