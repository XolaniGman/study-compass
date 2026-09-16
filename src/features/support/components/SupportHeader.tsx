import React from "react";
import {
  LayoutDashboard,
  Users,
  AlertTriangle,
  CalendarCheck,
  RotateCcw,
  Printer,
  ShieldCheck,
  FileSpreadsheet,
} from "lucide-react";
import { useSupport } from "../context/SupportContext";
import { Button } from "../../../components/ui/button";
import { toast } from "sonner";

interface SupportHeaderProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export function SupportHeader({ activeTab, onSelectTab }: SupportHeaderProps) {
  const {
    staffProfile,
    students,
    flaggedStudents,
    pendingReferrals,
    resetTriageData,
  } = useSupport();

  const navTabs = [
    {
      id: "dashboard",
      label: "Staff Dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      id: "screening",
      label: "Student Screening",
      icon: <Users className="h-4 w-4" />,
      badge: `${students.length} Screened`,
      badgeVariant: "default",
    },
    {
      id: "flagged",
      label: "Flagged Support",
      icon: <AlertTriangle className="h-4 w-4" />,
      badge: `${flaggedStudents.length} High Priority`,
      badgeVariant: "danger",
    },
    {
      id: "intake",
      label: "Intake & Referrals",
      icon: <CalendarCheck className="h-4 w-4" />,
      badge: `${pendingReferrals.length} Pending`,
      badgeVariant: "warning",
    },
  ];

  const handleExportCsv = () => {
    toast.success("POPIA-compliant anonymized screening queue exported to CSV.");
  };

  const handleAuditLog = () => {
    toast.info("DUT Disability Unit Compliance Audit Log compiled (Act 4 of 2013).");
  };

  return (
    <div className="space-y-6 border-b border-border/70 pb-6">
      {/* Staff Identity & Top Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary">
              Disability Unit Triage
            </span>
            <span className="text-muted-foreground font-mono text-xs">&bull;</span>
            <span className="text-xs text-muted-foreground font-mono">
              {staffProfile.campus}
            </span>
          </div>

          <h1 className="mt-1 font-serif text-3xl sm:text-4xl font-light tracking-tight text-foreground">
            DUT Triage &amp; Clinical Review
          </h1>

          <p className="mt-1 text-xs sm:text-sm text-muted-foreground font-light">
            Staff: <strong className="font-medium text-foreground">{staffProfile.name}</strong> &bull;{" "}
            {staffProfile.unitRole} &bull; {staffProfile.department}
          </p>
        </div>

        {/* Global Staff Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={resetTriageData}
            className="text-xs rounded-xl gap-1.5 h-9"
            title="Reset dataset to default 128-record state"
          >
            <RotateCcw className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Reset Demo Data</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleExportCsv}
            className="text-xs rounded-xl gap-1.5 h-9"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-primary" />
            <span>Export CSV</span>
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleAuditLog}
            className="bg-primary text-primary-foreground text-xs rounded-xl gap-1.5 h-9 shadow-sm shadow-primary/20"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>POPIA Compliance Log</span>
          </Button>
        </div>
      </div>

      {/* Navigation Sub-Tabs Bar */}
      <div className="flex overflow-x-auto no-scrollbar gap-1.5 pt-2">
        {navTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
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
                    isActive
                      ? "bg-white/20 text-white font-semibold"
                      : tab.badgeVariant === "danger"
                      ? "bg-rose-500/15 text-rose-600 font-semibold"
                      : tab.badgeVariant === "warning"
                      ? "bg-amber-500/15 text-amber-600 font-semibold"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
