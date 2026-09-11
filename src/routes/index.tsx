import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, HeartHandshake, Shield } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Learning Disability Detector and Classifier System" },
      {
        name: "description",
        content:
          "A screening and support tool that helps university students identify possible learning difficulties early and connects them to appropriate support.",
      },
      {
        property: "og:title",
        content: "Learning Disability Detector and Classifier System",
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
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <section className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          Learning Disability Detector and Classifier System
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          A screening and support tool that helps university students identify possible
          learning difficulties early and connects them to appropriate support. This is not a
          formal diagnosis tool.
        </p>
      </section>

      <section
        aria-label="Role selection"
        className="mt-12 grid gap-6 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3"
      >
        <RoleCard
          to="/student"
          icon={<BookOpen className="h-7 w-7" aria-hidden="true" />}
          title="Student"
          description="View available assessments, sample screening results, recommended exercises, and support information."
        />
        <RoleCard
          to="/support"
          icon={<HeartHandshake className="h-7 w-7" aria-hidden="true" />}
          title="DUT Disability Unit / Support Staff"
          description="See an overview of screened students, flagged cases, pending referrals, and a simulated student list."
        />
        <RoleCard
          to="/admin"
          icon={<Shield className="h-7 w-7" aria-hidden="true" />}
          title="System Administrator"
          description="Explore a simulated admin panel with overview cards and sections for users, assessments, and content."
        />
      </section>

      <section className="mt-14 rounded-2xl border border-border bg-card p-6 text-center sm:p-8">
        <h2 className="text-lg font-semibold text-foreground">Important note</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          This prototype demonstrates the intended look and feel of the system. All dashboards,
          results, and actions shown are simulated for demonstration purposes only.
        </p>
      </section>
    </div>
  );
}

function RoleCard({
  to,
  icon,
  title,
  description,
}: {
  to: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link
      to={to}
      className="group flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/30 hover:bg-accent hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        {icon}
      </div>
      <h3 className="mt-5 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
      <span className="mt-5 inline-flex items-center text-sm font-medium text-primary group-hover:underline">
        Enter dashboard
      </span>
    </Link>
  );
}
