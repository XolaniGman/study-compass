import { SimulatedButton } from "../../shared";

export function SystemSettingsCard() {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-5 mb-6">
        <div>
          <h2 className="font-serif text-xl font-normal text-foreground">
            System Operations &amp; Maintenance
          </h2>
          <p className="mt-1 text-xs text-muted-foreground font-light">
            Simulated operational controls for maintenance, log auditing, and disaster recovery.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SimulatedButton
          label="Perform System Backup"
          toastMessage="Simulated action: System state snapshot created."
          variant="primary"
          size="md"
        />
        <SimulatedButton
          label="View Audit Trail Logs"
          toastMessage="Simulated action: Loading audit logs..."
          variant="outline"
          size="md"
        />
        <SimulatedButton
          label="Sync Database Indexes"
          toastMessage="Simulated action: Indexes rebuilt."
          variant="outline"
          size="md"
        />
        <SimulatedButton
          label="Reset Sandbox Environment"
          toastMessage="Simulated action: Sandbox reset to baseline."
          variant="outline"
          size="md"
        />
      </div>
    </section>
  );
}
