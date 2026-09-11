import { SimulatedButton } from "../../shared";
import type { StudentQueueRecord } from "../types";

interface StudentQueueTableProps {
  students: StudentQueueRecord[];
}

export function StudentQueueTable({ students }: StudentQueueTableProps) {
  const getStatusBadgeClass = (status: StudentQueueRecord["status"]) => {
    switch (status) {
      case "Flagged for support":
        return "text-chart-5 font-medium";
      case "Pending referral":
        return "text-chart-3 font-medium";
      case "In review":
        return "text-chart-2 font-medium";
      case "Supported":
        return "text-chart-1 font-medium";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-5 mb-6">
        <div>
          <h2 className="font-serif text-xl font-normal text-foreground">
            Student Screening Queue
          </h2>
          <p className="mt-1 text-xs text-muted-foreground font-light">
            Review student screening indicators, priority classifications, and support statuses.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <SimulatedButton
            label="Export Screening CSV"
            toastMessage="Simulated action: Exporting student queue to CSV..."
            variant="outline"
            size="sm"
          />
          <SimulatedButton
            label="Refresh Queue"
            toastMessage="Simulated action: Queue data updated."
            variant="outline"
            size="sm"
          />
        </div>
      </div>

      <div className="overflow-x-auto min-w-full">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-border text-xs font-mono uppercase tracking-wider text-muted-foreground">
              <th className="py-3 px-4">Student ID</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Department</th>
              <th className="py-3 px-4">Primary Indicator</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {students.map((student) => (
              <tr
                key={student.id}
                className="transition-colors hover:bg-accent/20"
              >
                <td className="py-3.5 px-4 font-mono text-xs text-muted-foreground">
                  {student.id}
                </td>
                <td className="py-3.5 px-4 font-medium text-foreground">
                  {student.name}
                </td>
                <td className="py-3.5 px-4 text-xs text-muted-foreground">
                  {student.department}
                </td>
                <td className="py-3.5 px-4 text-xs text-foreground/90 font-light">
                  {student.primaryIndicator}
                </td>
                <td className="py-3.5 px-4 text-xs whitespace-nowrap">
                  <span className={getStatusBadgeClass(student.status)}>
                    {student.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="inline-flex items-center gap-2">
                    <SimulatedButton
                      label="Contact"
                      toastMessage={`Simulated action: Composing message to ${student.name} (${student.id})`}
                      variant="ghost"
                      size="sm"
                    />
                    <SimulatedButton
                      label="Refer"
                      toastMessage={`Simulated action: Referral initiated for ${student.name}`}
                      variant="outline"
                      size="sm"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
