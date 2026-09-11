import { Users2, ShieldCheck, Database, Server } from "lucide-react";

export function AdminMetrics() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Users2 className="h-5 w-5" />
          </div>
          <span className="text-[10px] font-mono font-medium text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md">
            +12 today
          </span>
        </div>
        <div className="mt-4">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Total Users
          </h3>
          <p className="mt-1 text-3xl font-bold tracking-tight text-foreground">142</p>
          <p className="mt-1 text-xs text-muted-foreground font-light">
            Enrolled students &amp; staff specialists
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm hover:shadow-md transition-all">
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
          <p className="mt-1 text-3xl font-bold tracking-tight text-foreground">8</p>
          <p className="mt-1 text-xs text-muted-foreground font-light">
            Screening &amp; classification pipelines
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm hover:shadow-md transition-all">
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
          <p className="mt-1 text-3xl font-bold tracking-tight text-foreground">24</p>
          <p className="mt-1 text-xs text-muted-foreground font-light">
            Exercises, guides &amp; contact profiles
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <div className="h-10 w-10 rounded-xl bg-chart-1/15 text-chart-1 flex items-center justify-center">
            <Server className="h-5 w-5" />
          </div>
          <span className="text-[10px] font-mono font-medium text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md">
            99.98%
          </span>
        </div>
        <div className="mt-4">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            System Uptime
          </h3>
          <p className="mt-1 text-3xl font-bold tracking-tight text-foreground">Healthy</p>
          <p className="mt-1 text-xs text-muted-foreground font-light">
            DUT Cloud Node • Zero degradation
          </p>
        </div>
      </div>
    </div>
  );
}
