import { createFileRoute } from "@tanstack/react-router";
import { SupportDashboardView } from "../features/support";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      {
        title: "DUT Disability Unit Portal — Learning Disability Detector & Classifier",
      },
      {
        name: "description",
        content:
          "Simulated disability unit staff dashboard for screening queues, priority cases, and student referrals.",
      },
      {
        property: "og:title",
        content: "DUT Disability Unit Portal — Learning Disability Detector & Classifier",
      },
      {
        property: "og:description",
        content:
          "Simulated disability unit staff dashboard for screening queues, priority cases, and student referrals.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SupportDashboardView,
});
