import React from "react";
import {
  HardDriveDownload,
  FileText,
  RefreshCw,
  Clock,
  RotateCcw,
  Shield,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { useInstitutional } from "../../shared";

interface SystemSettingsCardProps {
  onViewLogs: () => void;
}

export function SystemSettingsCard({ onViewLogs }: SystemSettingsCardProps) {
  const {
    performBackup,
    syncIndexes,
    triggerMaintenanceMode,
    resetAllToBaseline,
  } = useInstitutional();

  return (
    <section className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6 hover:border-primary/40 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-5 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-primary font-semibold bg-primary/10 px-2.5 py-0.5 rounded-full">
              NFR07 &bull; Infrastructure &amp; Maintainability
            </span>
          </div>
          <h2 className="font-serif text-2xl font-normal text-foreground mt-2">
            System Operations &amp; Maintenance
          </h2>
          <p className="mt-1 text-xs text-muted-foreground font-light leading-relaxed">
            Simulated administrative operations for automated cloud backups, database index
            synchronization, log auditing, and sandbox disaster recovery.
          </p>
        </div>

        <div className="text-xs text-muted-foreground bg-muted/40 px-3 py-1.5 rounded-xl border border-border/60 self-start sm:self-auto font-mono">
          DUT Node: Healthy
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          onClick={performBackup}
          size="sm"
          className="bg-primary text-primary-foreground rounded-xl text-xs h-9 px-3.5 gap-2 shadow-sm"
        >
          <HardDriveDownload className="h-3.5 w-3.5" />
          <span>Perform System Backup</span>
        </Button>

        <Button
          onClick={onViewLogs}
          variant="outline"
          size="sm"
          className="rounded-xl text-xs h-9 px-3.5 gap-2"
        >
          <FileText className="h-3.5 w-3.5 text-primary" />
          <span>View Audit Trail Logs</span>
        </Button>

        <Button
          onClick={syncIndexes}
          variant="outline"
          size="sm"
          className="rounded-xl text-xs h-9 px-3.5 gap-2"
        >
          <RefreshCw className="h-3.5 w-3.5 text-chart-2" />
          <span>Sync Database Indexes</span>
        </Button>

        <Button
          onClick={triggerMaintenanceMode}
          variant="outline"
          size="sm"
          className="rounded-xl text-xs h-9 px-3.5 gap-2"
        >
          <Clock className="h-3.5 w-3.5 text-amber-600" />
          <span>Trigger Maintenance Mode</span>
        </Button>

        <Button
          onClick={resetAllToBaseline}
          variant="ghost"
          size="sm"
          className="rounded-xl text-xs h-9 px-3.5 gap-2 text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset Sandbox Baseline</span>
        </Button>
      </div>
    </section>
  );
}
