import { createFileRoute } from "@tanstack/react-router";
import { Users, Flag, Clock, Mail } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      {
        title: "DUT Disability Unit Dashboard — Learning Disability Detector and Classifier System",
      },
      {
        name: "description",
        content:
          "Simulated support staff dashboard for the Learning Disability Detector and Classifier System.",
      },
      {
        property: "og:title",
        content:
          "DUT Disability Unit Dashboard — Learning Disability Detector and Classifier System",
      },
      {
        property: "og:description",
        content:
          "Simulated support staff dashboard for the Learning Disability Detector and Classifier System.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SupportDashboard,
});

const fakeStudents = [
  { id: "219012345", name: "Sibusiso Mkhize", status: "Flagged for support" },
  { id: "219023456", name: "Amina Patel", status: "Pending referral" },
  { id: "219034567", name: "Thabo Nkosi", status: "In review" },
  { id: "219045678", name: "Jessica van Wyk", status: "Supported" },
  { id: "219056789", name: "Lerato Dlamini", status: "Pending referral" },
];

function SupportDashboard() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          DUT Disability Unit / Support Staff
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Simulated overview of student screening activity. No real records are shown.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          icon={<Users className="h-5 w-5" aria-hidden="true" />}
          title="Students Screened"
          value="128"
          label="Simulated count"
        />
        <DashboardCard
          icon={<Flag className="h-5 w-5" aria-hidden="true" />}
          title="Flagged for Support"
          value="34"
          label="Simulated count"
        />
        <DashboardCard
          icon={<Clock className="h-5 w-5" aria-hidden="true" />}
          title="Pending Referrals"
          value="12"
          label="Simulated count"
        />
      </div>

      <section className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Recent student list</h2>
            <p className="text-sm text-muted-foreground">
              Fake student names and numbers for demonstration only.
            </p>
          </div>
          <button
            type="button"
            onClick={() => toast("Simulated action: export report")}
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Export report
          </button>
        </div>

        <div className="mt-5 overflow-hidden rounded-xl border border-border">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Student number
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {fakeStudents.map((student) => (
                <tr key={student.id} className="hover:bg-accent/20">
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-foreground">
                    {student.id}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-foreground">
                    {student.name}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground">
                    {student.status}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    <button
                      type="button"
                      onClick={() => toast("Simulated action: view profile")}
                      className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                      Contact
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => toast("Simulated action: schedule follow-up")}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Schedule follow-up
        </button>
        <button
          type="button"
          onClick={() => toast("Simulated action: mark as referred")}
          className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Mark as referred
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
