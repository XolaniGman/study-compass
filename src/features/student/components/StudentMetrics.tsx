import { MetricStatCard } from "../../shared";

export function StudentMetrics() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <MetricStatCard
        title="Available Assessments"
        value="3"
        label="Screening modules ready"
      />
      <MetricStatCard
        title="My Results"
        value="4"
        label="Evaluated dimensions"
      />
      <MetricStatCard
        title="Recommended Exercises"
        value="4"
        label="Customized study plans"
      />
      <MetricStatCard
        title="Support Information"
        value="2"
        label="DUT advisors assigned"
      />
    </div>
  );
}
