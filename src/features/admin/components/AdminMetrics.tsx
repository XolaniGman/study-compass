import React from "react";
import { Users2, ShieldCheck, Database, Server } from "lucide-react";
import { useInstitutional } from "../../shared";

export function AdminMetrics() {
  const { totalUsers, usersAddedToday, activeModules, contentLibrary, systemUptime } =
    useInstitutional();

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {/* Metric 1: Total Users */}
      <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm hover:shadow-md hover:border-primary/40 transition-all">
        <div className="flex items-center justify-between">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Users2 className="h-5 w-5" />
          </div>
          <span className="text-[10px] font-mono font-medium text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md">
            +{usersAddedToday} today
          </span>
        </div>
        <div className="mt-4">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Total Users
          </h3>
          <p className="mt-1 text-3xl font-bold tracking-tight text-foreground font-mono">
            {totalUsers}
          </p>
          <p className="mt-1 text-xs text-muted-foreground font-light">
            Enrolled students &amp; staff specialists
          </p>
        </div>
      </div>

      {/* Metric 2: Active Modules */}
      <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm hover:shadow-md hover:border-primary/40 transition-all">
        <div className="flex items-center justify-between">
          <div className="h-10 w-10 rounded-xl bg-chart-2/15 text-chart-2 flex items-center justify-center">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <span className="text-[10px] font-mono font-medium text-chart-2 bg-chart-2/10 px-2 py-0.5 rounded-md">
            Operational
          </span>
        </div>
        <div className="mt-4">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Active Modules
          </h3>
          <p className="mt-1 text-3xl font-bold tracking-tight text-foreground font-mono">
            {activeModules}
          </p>
          <p className="mt-1 text-xs text-muted-foreground font-light">
            3 System Modules + 5 Screening Domains
          </p>
        </div>
      </div>

      {/* Metric 3: Content Library */}
      <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm hover:shadow-md hover:border-primary/40 transition-all">
        <div className="flex items-center justify-between">
          <div className="h-10 w-10 rounded-xl bg-chart-3/15 text-chart-3 flex items-center justify-center">
            <Database className="h-5 w-5" />
          </div>
          <span className="text-[10px] font-mono font-medium text-chart-3 bg-chart-3/10 px-2 py-0.5 rounded-md">
            Curated
          </span>
        </div>
        <div className="mt-4">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Content Library
          </h3>
          <p className="mt-1 text-3xl font-bold tracking-tight text-foreground font-mono">
            {contentLibrary}
          </p>
          <p className="mt-1 text-xs text-muted-foreground font-light">
            Active exercises, guides &amp; contact profiles
          </p>
        </div>
      </div>

      {/* Metric 4: System Uptime */}
      <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm hover:shadow-md hover:border-primary/40 transition-all">
        <div className="flex items-center justify-between">
          <div className="h-10 w-10 rounded-xl bg-chart-1/15 text-chart-1 flex items-center justify-center">
            <Server className="h-5 w-5" />
          </div>
          <span className="text-[10px] font-mono font-medium text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md">
            Healthy
          </span>
        </div>
        <div className="mt-4">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            System Uptime
          </h3>
          <p className="mt-1 text-3xl font-bold tracking-tight text-foreground font-mono">
            {systemUptime}
          </p>
          <p className="mt-1 text-xs text-muted-foreground font-light">
            DUT Cloud Node &bull; Zero degradation
          </p>
        </div>
      </div>
    </div>
  );
}
