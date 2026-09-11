import { createFileRoute } from "@tanstack/react-router";
import { StudentDashboardView } from "../features/student";

export const Route = createFileRoute("/student")({
  head: () => ({
    meta: [
      {
        title: "Student Portal — Learning Disability Detector & Classifier",
      },
      {
        name: "description",
        content:
          "Simulated student screening results, recommended exercises, and support pathways.",
      },
      {
        property: "og:title",
        content: "Student Portal — Learning Disability Detector & Classifier",
      },
      {
        property: "og:description",
        content:
          "Simulated student screening results, recommended exercises, and support pathways.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StudentDashboardView,
});
