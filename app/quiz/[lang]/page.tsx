import Quiz from "@/components/quiz";
import PythonQuiz from "@/components/quiz-python";
import PhpQuiz from "@/components/quiz-php";
import JavaQuiz from "@/components/quiz-java";
import CQuiz from "@/components/quiz-c";

export async function generateStaticParams() {
  return [
    { lang: "javascript" },
    { lang: "python" },
    { lang: "php" },
    { lang: "java" },
    { lang: "c" },
  ];
}

export default async function QuizPage({
  params,
}: {
  params: { lang: string };
}) {
  const awaitedParams = await params;

  const quizzes: Record<string, React.ComponentType> = {
    javascript: Quiz,
    python: PythonQuiz,
    php: PhpQuiz,
    java: JavaQuiz,
    c: CQuiz,
  };

  const QuizComponent = quizzes[awaitedParams.lang.toLowerCase()] || Quiz;

  return <QuizComponent />;
}
