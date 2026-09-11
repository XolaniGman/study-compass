import { createFileRoute } from "@tanstack/react-router";
import { ClipboardList, FileText, Dumbbell, Info, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/student")({
  head: () => ({
    meta: [
      { title: "Student Dashboard — Learning Disability Detector and Classifier System" },
      {
        name: "description",
        content:
          "Simulated student dashboard for the Learning Disability Detector and Classifier System.",
      },
      {
        property: "og:title",
        content: "Student Dashboard — Learning Disability Detector and Classifier System",
      },
      {
        property: "og:description",
        content:
          "Simulated student dashboard for the Learning Disability Detector and Classifier System.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StudentDashboard,
});

const sampleResults = [
  { area: "Reading", status: "Moderate difficulty", color: "bg-chart-2" },
  { area: "Mathematics", status: "Needs attention", color: "bg-chart-5" },
  { area: "Writing", status: "Mild difficulty", color: "bg-chart-1" },
  { area: "Attention", status: "Typical range", color: "bg-chart-2" },
];

function StudentDashboard() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Welcome, Alex
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          This is a simulated student dashboard. No real data is stored or processed.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          icon={<ClipboardList className="h-5 w-5" aria-hidden="true" />}
          title="Available Assessments"
          value="3"
          label="Screening modules"
        />
        <DashboardCard
          icon={<FileText className="h-5 w-5" aria-hidden="true" />}
          title="My Results"
          value="4"
          label="Sample indicators"
        />
        <DashboardCard
          icon={<Dumbbell className="h-5 w-5" aria-hidden="true" />}
          title="Recommended Exercises"
          value="5"
          label="Suggested activities"
        />
        <DashboardCard
          icon={<Info className="h-5 w-5" aria-hidden="true" />}
          title="Support Information"
          value="2"
          label="Support contacts"
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">Sample screening results</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            These results are fake and shown for demonstration only.
          </p>
          <ul className="mt-5 space-y-3">
            {sampleResults.map((result) => (
              <li
                key={result.area}
                className="flex items-center justify-between rounded-xl border border-border bg-background p-4"
              >
                <span className="font-medium text-foreground">{result.area}</span>
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className={`h-2.5 w-2.5 rounded-full ${result.color}`} />
                  {result.status}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">Recommended exercises</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Simulated recommendations for demonstration purposes.
          </p>
          <ul className="mt-5 space-y-3">
            <li className="rounded-xl border border-border bg-background p-4 text-sm text-foreground">
              <span className="font-medium">Guided reading practice</span>
              <p className="mt-1 text-muted-foreground">15 minutes, 3 times per week</p>
            </li>
            <li className="rounded-xl border border-border bg-background p-4 text-sm text-foreground">
              <span className="font-medium">Number-pattern worksheets</span>
              <p className="mt-1 text-muted-foreground">20 minutes, twice per week</p>
            </li>
            <li className="rounded-xl border border-border bg-background p-4 text-sm text-foreground">
              <span className="font-medium">Focus timer technique</span>
              <p className="mt-1 text-muted-foreground">Daily 25-minute sessions</p>
            </li>
          </ul>
        </section>
      </div>

      <div className="mt-8 flex items-start gap-3 rounded-2xl border border-border bg-accent/40 p-5">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
        <div>
          <h3 className="font-semibold text-foreground">Disclaimer</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            The results shown here are screening indicators only. They are not a diagnosis.
            Please contact the DUT Disability Unit or a qualified professional for a formal
            assessment.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <button
          type="button"
          onClick={() => toast("Simulated action: start assessment")}
          className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Start a simulated assessment
        </button>
      </div>
    </div>
  );
}

function DashboardCard({
  icon,
  title,
  value,
  label,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-colors hover:bg-accent/30">
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="mt-4 text-sm font-medium text-muted-foreground">{title}</h3>
      <p className="mt-1 text-3xl font-bold text-foreground">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
