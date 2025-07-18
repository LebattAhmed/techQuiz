import QuizComponent from "@/components/quiz-principale";

export async function generateStaticParams() {
  const subcategories = {
    languages: ["javascript", "python", "php", "java", "c"],
    network: [
      "protocoles",
      "reseau-ip",
      "dns",
      "securite-reseau",
      "wifi",
      "cloud",
    ],
    security: ["cryptographie", "malware", "securite-web", "securite-mobile"],
    web: [
      "html-css",
      "react",
      "nodejs",
      "api-rest",
      "laravel",
      "django",
      "jee",
      "nextjs",
    ],
    mobile: ["android", "ios", "react-native", "flutter"],
    databases: ["mysql", "postgresql", "sql-server", "pl-sql"],
    devops: ["docker", "kubernetes", "ci-cd", "linux"],
  };

  return Object.entries(subcategories).flatMap(([category, subcats]) =>
    subcats.map((subcategory) => ({
      category,
      subcategory,
    }))
  );
}

export default function QuizPage({
  params,
}: {
  params: { category: string; subcategory: string };
}) {
  return <QuizComponent params={params} />;
}
