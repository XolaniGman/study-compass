import { createFileRoute } from "@tanstack/react-router";
import { StudentDashboardView } from "../features/student";

export const Route = createFileRoute("/student")({
  validateSearch: (search: Record<string, unknown>): { tab?: string | undefined; quizId?: string | undefined } => {
    const result: { tab?: string | undefined; quizId?: string | undefined } = {};
    if (search["tab"]) result.tab = String(search["tab"]);
    if (search["quizId"]) result.quizId = String(search["quizId"]);
    return result;
  },
  head: () => ({
    meta: [
      {
        title: "Student Portal — Learning Disability Detector & Classifier",
      },
      {
        name: "description",
        content:
          "Interactive student screening results, online cognitive quizzes, recommended study tools, and support pathways.",
      },
      {
        property: "og:title",
        content: "Student Portal — Learning Disability Detector & Classifier",
      },
      {
        property: "og:description",
        content:
          "Interactive student screening results, online cognitive quizzes, recommended study tools, and support pathways.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StudentDashboardView,
});
