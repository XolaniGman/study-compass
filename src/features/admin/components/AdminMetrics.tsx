import { MetricStatCard } from "../../shared";

export function AdminMetrics() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <MetricStatCard
        title="Total Registered Users"
        value="142"
        label="Students & support staff"
      />
      <MetricStatCard
        title="Active Assessments"
        value="8"
        label="Deployed screening tools"
      />
      <MetricStatCard
        title="Curated Content Items"
        value="24"
        label="Exercises & support guides"
      />
    </div>
  );
}
