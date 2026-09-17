import React, { useState } from "react";
import {
  Activity,
  ShieldAlert,
  Database,
  RotateCcw,
  ArrowLeft,
  CheckCircle2,
  HardDrive,
  RefreshCw,
  Download,
  AlertTriangle,
  Server,
  Lock,
  Cpu,
  Clock,
} from "lucide-react";
import { useInstitutional } from "../../../shared/context/InstitutionalContext";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";
import { toast } from "sonner";

interface OperationsMaintenancePageProps {
  initialSubtab?: string;
  onNavigateToOverview: () => void;
  onSubtabChange?: (subtab: string) => void;
}

export function OperationsMaintenancePage({
  initialSubtab = "system-health",
  onNavigateToOverview,
  onSubtabChange,
}: OperationsMaintenancePageProps) {
  const {
    systemUptime,
    performBackup,
    syncIndexes,
    triggerMaintenanceMode,
    resetAllToBaseline,
    auditLogs,
    totalUsers,
    activeModules,
    contentLibrary,
  } = useInstitutional();

  const [activeSubtab, setActiveSubtab] = useState<string>(initialSubtab);

  React.useEffect(() => {
    if (initialSubtab) {
      setActiveSubtab(initialSubtab);
    }
  }, [initialSubtab]);

  const handleSelectSubtab = (id: string) => {
    setActiveSubtab(id);
    if (onSubtabChange) onSubtabChange(id);
  };

  const subTabs = [
    {
      id: "system-health",
      label: "System Health & Uptime",
      icon: <Activity className="h-4 w-4" />,
      badge: `${systemUptime}`,
    },
    {
      id: "audit-logs",
      label: "POPIA Audit Logs",
      icon: <ShieldAlert className="h-4 w-4" />,
      badge: `${auditLogs.length} Events`,
    },
    {
      id: "backup-restore",
      label: "Database & Backups",
      icon: <Database className="h-4 w-4" />,
      badge: "Auto-Sync",
    },
    {
      id: "baseline-reset",
      label: "Baseline Reset & Maintenance",
      icon: <RotateCcw className="h-4 w-4" />,
      badge: "Sandbox",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Horizontal Sub-Tabs Bar — Matching Reference Screenshot */}
      <div className="flex overflow-x-auto no-scrollbar gap-1.5 pt-1 pb-2 border-b border-border/70">
        {subTabs.map((tab) => {
          const isActive = activeSubtab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleSelectSubtab(tab.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm font-semibold"
                  : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                    isActive ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Sub-Tab 1: System Health & Uptime */}
      {activeSubtab === "system-health" && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-4">
            {[
              { label: "Rolling Uptime", value: "99.98%", caption: "Past 30 Days SLA", valueClass: "text-emerald-300", delay: "0s" },
              { label: "Database Latency", value: "14ms", caption: "Local SQLite / IndexedDB", valueClass: "text-white", delay: "-7s" },
              { label: "Active Modules", value: activeModules, caption: "3 Core + 5 Batteries", valueClass: "text-white", delay: "-14s" },
              { label: "POPIA S14 Status", value: "Active", caption: "AES-256 GCM Rest", valueClass: "text-emerald-300", delay: "-21s" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="relative overflow-hidden rounded-3xl border border-border/80 bg-slate-950 shadow-md hover:shadow-lg hover:border-primary/50 transition-all"
              >
                {/* Animated tech background (shared with the admin overview metric cards) */}
                <div
                  className="admin-metric-bg absolute inset-0 pointer-events-none"
                  style={{ animationDelay: stat.delay }}
                  aria-hidden="true"
                />
                <div
                  className="admin-metric-sweep absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-cyan-300/10 to-transparent pointer-events-none"
                  style={{ animationDelay: stat.delay }}
                  aria-hidden="true"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/25 pointer-events-none" />

                <div className="relative z-10 p-5 space-y-1">
                  <div className="text-xs font-mono text-slate-300">{stat.label}</div>
                  <div className={`font-serif text-3xl font-medium drop-shadow-sm ${stat.valueClass}`}>
                    {stat.value}
                  </div>
                  <div className="text-[11px] text-slate-300">{stat.caption}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Subsystem Health Matrix */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-border/60 pb-4">
              <h2 className="font-serif text-2xl font-normal text-foreground">
                Institutional Subsystem Telemetry
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Real-time operational status across institutional core services.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  name: "Psychometric Classifier Pipeline",
                  status: "100% Operational",
                  desc: "Evaluates student screening responses against dynamic thresholds & weightings.",
                  icon: <Cpu className="h-4 w-4 text-emerald-600" />,
                },
                {
                  name: "Institutional State Synchronization",
                  status: "Healthy",
                  desc: "Bidirectional sync between Admin, Staff Triage, and Student Hub.",
                  icon: <RefreshCw className="h-4 w-4 text-emerald-600" />,
                },
                {
                  name: "Role-Based Access Guard (RBAC)",
                  status: "Enforced",
                  desc: "Validates student, support specialist, and admin authorization tokens.",
                  icon: <Lock className="h-4 w-4 text-emerald-600" />,
                },
                {
                  name: "Campus Directory & Accommodations Index",
                  status: "Synced",
                  desc: `${contentLibrary} active items indexed across 6 DUT campuses.`,
                  icon: <Server className="h-4 w-4 text-emerald-600" />,
                },
              ].map((sub, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl border border-border bg-muted/20 flex items-start gap-3"
                >
                  <div className="p-2 rounded-xl bg-background border border-border/80">
                    {sub.icon}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-xs text-foreground">{sub.name}</span>
                      <Badge
                        variant="outline"
                        className="text-[10px] font-mono text-emerald-600 border-emerald-500/30"
                      >
                        {sub.status}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground font-light">{sub.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: POPIA Audit Logs */}
      {activeSubtab === "audit-logs" && (
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
            <div>
              <h2 className="font-serif text-2xl font-normal text-foreground">
                POPIA Section 14 Immutable Audit Logs
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Timestamped audit records for account creation, deactivation, threshold
                alterations, and administrative data exports.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.success("Audit trail downloaded.")}
              className="rounded-xl text-xs gap-1.5 h-9"
            >
              <Download className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Export Audit Trail (CSV)</span>
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-border text-muted-foreground font-mono">
                  <th className="py-3 px-3 font-medium">Timestamp</th>
                  <th className="py-3 px-3 font-medium">Administrator</th>
                  <th className="py-3 px-3 font-medium">Action Event</th>
                  <th className="py-3 px-3 font-medium">Target Entity</th>
                  <th className="py-3 px-3 font-medium">IP Address</th>
                  <th className="py-3 px-3 font-medium">Statutory Compliance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-3 font-mono text-muted-foreground">{log.timestamp}</td>
                    <td className="py-3 px-3 font-medium text-foreground">{log.admin}</td>
                    <td className="py-3 px-3">
                      <Badge variant="outline" className="font-mono text-[10px]">
                        {log.action}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-muted-foreground">{log.target}</td>
                    <td className="py-3 px-3 font-mono text-muted-foreground">{log.ip}</td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-mono text-[11px]">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>POPIA Verified</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-Tab 3: Database & Backups */}
      {activeSubtab === "backup-restore" && (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-border/60 pb-4">
              <h2 className="font-serif text-2xl font-normal text-foreground">
                Institutional Database Snapshots &amp; Backups
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Create full encrypted point-in-time backups of all users, assessment pools, scoring
                formulas, and accommodations directories.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-muted/20 border border-border space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-xs text-foreground">
                    Create Instant Backup Snapshot
                  </div>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    Snapshot Engine
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground font-light">
                  Captures active state of <strong>{totalUsers}</strong> registered users, 5
                  screening pools, and {contentLibrary} content items.
                </p>
                <div className="pt-2 flex gap-3">
                  <Button
                    onClick={performBackup}
                    className="rounded-xl text-xs bg-primary text-primary-foreground h-9 px-4 gap-1.5"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download JSON Snapshot</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={syncIndexes}
                    className="rounded-xl text-xs h-9 px-4 gap-1.5"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Re-index Database</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
            <h3 className="font-serif text-lg font-normal text-foreground">
              Automated Retention Policy
            </h3>
            <p className="text-xs text-muted-foreground font-light leading-relaxed">
              Institutional snapshots are encrypted using university HSM-managed AES-256 keys and
              retained on Durban University of Technology private cloud storage with a 7-year audit
              window.
            </p>
          </div>
        </div>
      )}

      {/* Sub-Tab 4: Baseline Reset & Sandbox */}
      {activeSubtab === "baseline-reset" && (
        <div className="rounded-3xl border border-destructive/20 bg-destructive/5 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-destructive/20 pb-4">
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              <h2 className="font-serif text-2xl font-normal">
                Sandbox Baseline Reset &amp; Maintenance Mode
              </h2>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Controls for resetting the evaluation sandbox to default institutional seed data.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="p-5 rounded-2xl bg-background border border-border space-y-3">
              <h4 className="font-medium text-xs text-foreground">Reset to Institutional Baseline</h4>
              <p className="text-xs text-muted-foreground font-light leading-relaxed">
                Clears any simulated user additions, threshold adjustments, or archived resources,
                and re-establishes the clean baseline (142 users, 8 active modules, 24 content
                items).
              </p>
              <Button
                variant="destructive"
                onClick={resetAllToBaseline}
                className="rounded-xl text-xs h-9 gap-1.5"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset All to Baseline</span>
              </Button>
            </div>

            <div className="p-5 rounded-2xl bg-background border border-border space-y-3">
              <h4 className="font-medium text-xs text-foreground">Scheduled Maintenance Flag</h4>
              <p className="text-xs text-muted-foreground font-light leading-relaxed">
                Display a system maintenance advisory notice on student and support portals during
                off-peak psychometric engine upgrades.
              </p>
              <Button
                variant="outline"
                onClick={triggerMaintenanceMode}
                className="rounded-xl text-xs h-9 gap-1.5"
              >
                <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                <span>Trigger Maintenance Mode</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
