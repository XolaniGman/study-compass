import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../../../components/ui/dialog";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";
import { useInstitutional } from "../../../shared";
import { Terminal, Shield, RefreshCw } from "lucide-react";

interface SystemAuditLogsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SystemAuditLogsModal({ open, onOpenChange }: SystemAuditLogsModalProps) {
  const { auditLogs } = useInstitutional();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl rounded-3xl p-6 sm:p-8 max-h-[85vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-wider font-semibold">
            <Terminal className="h-4 w-4" />
            <span>NFR07 &bull; Maintainability &amp; Operational Audit</span>
          </div>
          <DialogTitle className="font-serif text-2xl font-normal text-foreground mt-1">
            System Operations &amp; Maintenance Logs
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground font-light">
            Real-time operational audit log capturing database index synchronizations, cold-storage
            backups, role calibrations, and sandbox resets.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 pt-2 my-2 border-y border-border/60 py-3 font-mono text-xs">
          {auditLogs.map((log) => (
            <div
              key={log.id}
              className="rounded-2xl border border-border/80 bg-muted/20 p-3.5 space-y-1.5"
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">{log.timestamp}</span>
                <Badge
                  variant="outline"
                  className={`text-[10px] ${
                    log.status === "SUCCESS"
                      ? "text-emerald-600 border-emerald-500/30"
                      : log.status === "WARNING"
                      ? "text-amber-600 border-amber-500/30"
                      : "text-blue-600 border-blue-500/30"
                  }`}
                >
                  {log.status}
                </Badge>
              </div>

              <div className="text-foreground font-medium">
                [{log.action}] <span className="text-primary">{log.actor}</span>
              </div>

              <p className="text-[11px] text-muted-foreground font-light font-sans leading-relaxed">
                {log.details}
              </p>
            </div>
          ))}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-1">
          <span className="text-[11px] font-mono text-muted-foreground">
            DUT Cloud Node &bull; Audit Trail v2.4.0
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="rounded-xl text-xs"
          >
            Close Operational Logs
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
