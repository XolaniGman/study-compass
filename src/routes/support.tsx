import { createFileRoute } from "@tanstack/react-router";
import { SupportDashboardView } from "../features/support";

export const Route = createFileRoute("/support")({
  validateSearch: (search: Record<string, unknown>): { tab?: string | undefined; studentId?: string | undefined } => {
    const result: { tab?: string | undefined; studentId?: string | undefined } = {};
    if (search["tab"]) result.tab = String(search["tab"]);
    if (search["studentId"]) result.studentId = String(search["studentId"]);
    return result;
  },
  head: () => ({
    meta: [
      {
        title: "DUT Disability Unit Portal — Learning Disability Detector & Classifier",
      },
      {
        name: "description",
        content:
          "DUT Disability Unit Triage System: Student screening queue, flagged priority support, and clinical referral intake pipeline.",
      },
      {
        property: "og:title",
        content: "DUT Disability Unit Portal — Learning Disability Detector & Classifier",
      },
      {
        property: "og:description",
        content:
          "DUT Disability Unit Triage System: Student screening queue, flagged priority support, and clinical referral intake pipeline.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SupportDashboardView,
});
