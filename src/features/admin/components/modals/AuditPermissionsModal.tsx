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
import { Input } from "../../../../components/ui/input";
import { useInstitutional } from "../../../shared";
import { ShieldCheck, Search, FileText } from "lucide-react";

interface AuditPermissionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuditPermissionsModal({ open, onOpenChange }: AuditPermissionsModalProps) {
  const { auditLogs } = useInstitutional();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.actor.toLowerCase().includes(search.toLowerCase()) ||
      log.target.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl rounded-3xl p-6 sm:p-8 max-h-[85vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-wider font-semibold">
            <ShieldCheck className="h-4 w-4" />
            <span>FR03 &bull; Role &amp; Permissions Audit Log</span>
          </div>
          <DialogTitle className="font-serif text-2xl font-normal text-foreground mt-1">
            Access &amp; Permissions Audit Trail
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground font-light">
            Immutable log of role grants, privilege modifications, and system indicator calibrations
            per DUT Institutional POPIA guidelines. (Read-only view)
          </DialogDescription>
        </DialogHeader>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search by actor, target, or action..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 text-xs rounded-xl h-9"
            />
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            {["ALL", "SUCCESS", "INFO", "WARNING"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all font-mono ${
                  statusFilter === st
                    ? "bg-primary text-primary-foreground border-primary font-semibold"
                    : "bg-muted/40 border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Log Entries Table / List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 pt-2 my-2 border-y border-border/60 py-3">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-8 text-xs text-muted-foreground font-light">
              No audit records matching your search query.
            </div>
          ) : (
            filteredLogs.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-border/80 bg-background/50 p-4 space-y-2 hover:border-primary/40 transition-all text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-foreground">
                      {item.action}
                    </span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-mono ${
                        item.status === "SUCCESS"
                          ? "text-emerald-600 border-emerald-500/30 bg-emerald-500/10"
                          : item.status === "WARNING"
                          ? "text-amber-600 border-amber-500/30 bg-amber-500/10"
                          : "text-blue-600 border-blue-500/30 bg-blue-500/10"
                      }`}
                    >
                      {item.status}
                    </Badge>
                  </div>
                  <span className="text-[11px] text-muted-foreground font-mono">
                    {item.timestamp}
                  </span>
                </div>

                <div className="text-muted-foreground font-light leading-relaxed">
                  <strong className="text-foreground font-medium">{item.actor}</strong> &rarr;{" "}
                  <span className="text-foreground">{item.target}</span>
                </div>

                <p className="text-[11px] text-muted-foreground bg-muted/30 p-2 rounded-xl font-light">
                  {item.details}
                </p>
              </div>
            ))
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-1">
          <span className="text-[11px] font-mono text-muted-foreground">
            Displaying {filteredLogs.length} of {auditLogs.length} audit records
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="rounded-xl text-xs"
          >
            Close Audit Trail
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
