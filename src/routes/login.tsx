import { createFileRoute } from "@tanstack/react-router";
import { LoginView } from "../features/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In — Study Compass | DUT Disability Unit Portal" },
      {
        name: "description",
        content: "Sign in to the DUT Study Compass screening and disability unit support portal.",
      },
      { property: "og:title", content: "Sign In — Study Compass | DUT Disability Unit Portal" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: LoginView,
});
