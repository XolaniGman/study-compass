import { createFileRoute } from "@tanstack/react-router";
import { Users, ClipboardCheck, BookOpen, Settings, Shield } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Administrator Dashboard — Learning Disability Detector and Classifier System" },
      {
        name: "description",
        content:
          "Simulated administrator dashboard for the Learning Disability Detector and Classifier System.",
      },
      {
        property: "og:title",
        content: "Administrator Dashboard — Learning Disability Detector and Classifier System",
      },
      {
        property: "og:description",
        content:
          "Simulated administrator dashboard for the Learning Disability Detector and Classifier System.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          System Administrator
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Simulated admin panel. All buttons and data are for demonstration only.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          icon={<Users className="h-5 w-5" aria-hidden="true" />}
          title="Total Users"
          value="142"
          label="Simulated user count"
        />
        <DashboardCard
          icon={<ClipboardCheck className="h-5 w-5" aria-hidden="true" />}
          title="Active Assessments"
          value="8"
          label="Simulated assessments"
        />
        <DashboardCard
          icon={<BookOpen className="h-5 w-5" aria-hidden="true" />}
          title="Content Items"
          value="24"
          label="Simulated resources"
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <AdminSection
          icon={<Users className="h-5 w-5" aria-hidden="true" />}
          title="Manage Users"
          description="Simulated user management: add, edit, or deactivate accounts."
          actions={["Add user", "Edit user", "Deactivate user"]}
        />
        <AdminSection
          icon={<ClipboardCheck className="h-5 w-5" aria-hidden="true" />}
          title="Manage Assessments"
          description="Simulated assessment management: create or update screening modules."
          actions={["Create assessment", "Edit assessment", "Preview assessment"]}
        />
        <AdminSection
          icon={<BookOpen className="h-5 w-5" aria-hidden="true" />}
          title="Manage Exercises & Support Content"
          description="Simulated content management: exercises, guides, and support contacts."
          actions={["Add exercise", "Edit resource", "Update contact"]}
        />
      </div>

      <section className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <Settings className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
          <div>
            <h2 className="text-lg font-semibold text-foreground">System settings</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              These controls are simulated and do not change any real configuration.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <SimButton label="Backup data" />
              <SimButton label="Restore defaults" />
              <SimButton label="View logs" />
            </div>
          </div>
        </div>
      </section>

      <div className="mt-8 flex items-start gap-3 rounded-2xl border border-border bg-accent/40 p-5">
        <Shield className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
        <div>
          <h3 className="font-semibold text-foreground">Administrator notice</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            This panel is a visual simulation. No authentication, user accounts, or system
            settings are actually managed here.
          </p>
        </div>
      </div>
    </div>
  );
}

function AdminSection({
  icon,
  title,
  description,
  actions,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  actions: string[];
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{description}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {actions.map((action) => (
          <SimButton key={action} label={action} />
        ))}
      </div>
    </section>
  );
}

function SimButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => toast(`Simulated action: ${label.toLowerCase()}`)}
      className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {label}
    </button>
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
