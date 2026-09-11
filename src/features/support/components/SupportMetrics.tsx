import { MetricStatCard } from "../../shared";

export function SupportMetrics() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <MetricStatCard
        title="Students Screened"
        value="128"
        label="Total semester submissions"
      />
      <MetricStatCard
        title="Flagged for Support"
        value="34"
        label="High & moderate priority"
      />
      <MetricStatCard
        title="Pending Referrals"
        value="12"
        label="Awaiting clinical intake"
      />
    </div>
  );
}
