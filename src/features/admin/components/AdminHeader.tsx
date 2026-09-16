import React from "react";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Database,
  Sliders,
  RotateCcw,
  Activity,
  ShieldCheck,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { useInstitutional } from "../../shared";
import type { AdminProfile } from "../types";

interface AdminHeaderProps {
  profile: AdminProfile;
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
}

export function AdminHeader({
  profile,
  activeTab = "overview",
  onSelectTab,
}: AdminHeaderProps) {
  const { totalUsers, activeModules, contentLibrary, resetAllToBaseline } =
    useInstitutional();

  const navTabs = [
    {
      id: "overview",
      label: "Overview",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      id: "users",
      label: "Users & Permissions",
      icon: <Users className="h-4 w-4" />,
      badge: `${totalUsers} Enrolled`,
    },
    {
      id: "assessments",
      label: "Screening Modules",
      icon: <FolderKanban className="h-4 w-4" />,
      badge: `${activeModules} Active`,
    },
    {
      id: "content",
      label: "Exercises & Support",
      icon: <Database className="h-4 w-4" />,
      badge: `${contentLibrary} Items`,
    },
    {
      id: "maintenance",
      label: "Operations & Backups",
      icon: <Sliders className="h-4 w-4" />,
      badge: "Healthy",
    },
  ];

  return (
    <div className="space-y-6 border-b border-border/70 pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary">
              DUT Institutional Portal
            </span>
            <span className="text-muted-foreground font-mono text-xs">&bull;</span>
            <span className="text-xs text-muted-foreground font-mono">
              Systems Administration
            </span>
          </div>

          <h1 className="mt-1 font-serif text-3xl sm:text-4xl font-light tracking-tight text-foreground">
            Institutional Administration Portal
          </h1>

          <p className="mt-1 text-xs sm:text-sm text-muted-foreground font-light">
            {profile.role} &bull; System Core:{" "}
            <strong className="font-mono text-foreground font-medium">
              {profile.systemVersion}
            </strong>{" "}
            &bull; Durban University of Technology
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 text-xs font-mono font-medium">
            <Activity className="h-3.5 w-3.5 animate-pulse" />
            <span>Operational &bull; Config Live</span>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={resetAllToBaseline}
            className="text-xs rounded-xl gap-1.5 h-9"
            title="Reset sandbox data to default institutional baseline"
          >
            <RotateCcw className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Reset Baseline</span>
          </Button>
        </div>
      </div>

      {/* Top Horizontal Navigation Sub-Tabs Bar — Matching Screenshot */}
      <div className="flex overflow-x-auto no-scrollbar gap-1.5 pt-2">
        {navTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab && onSelectTab(tab.id)}
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
    </div>
  );
}
