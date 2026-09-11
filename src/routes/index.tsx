import { createFileRoute } from "@tanstack/react-router";
import { LandingView } from "../features/landing";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Learning Disability Detector & Classifier System | Study Compass" },
      {
        name: "description",
        content:
          "A screening and support tool that helps university students identify possible learning difficulties early and connects them to appropriate support. This is not a formal diagnosis tool.",
      },
      {
        property: "og:title",
        content: "Learning Disability Detector & Classifier System",
      },
      {
        property: "og:description",
        content:
          "A screening and support tool that helps university students identify possible learning difficulties early and connects them to appropriate support.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LandingView,
});
