import { createFileRoute } from "@tanstack/react-router";
import { RegisterView } from "../features/auth";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Register — Study Compass | DUT Disability Unit Portal" },
      {
        name: "description",
        content: "Create a new student or staff account on the DUT Study Compass portal.",
      },
      { property: "og:title", content: "Register — Study Compass | DUT Disability Unit Portal" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: RegisterView,
});
