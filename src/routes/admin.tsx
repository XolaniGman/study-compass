import { createFileRoute } from "@tanstack/react-router";
import { AdminDashboardView } from "../features/admin";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      {
        title: "Administration Portal — Learning Disability Detector & Classifier",
      },
      {
        name: "description",
        content:
          "Simulated administrator panel for managing users, screening modules, resources, and system metrics.",
      },
      {
        property: "og:title",
        content: "Administration Portal — Learning Disability Detector & Classifier",
      },
      {
        property: "og:description",
        content:
          "Simulated administrator panel for managing users, screening modules, resources, and system metrics.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminDashboardView,
});
