import { Users, AlertTriangle, CalendarCheck2 } from "lucide-react";

export function SupportMetrics() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Users className="h-5 w-5" />
          </div>
          <span className="text-[10px] font-mono font-medium text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md">
            +18% this month
          </span>
        </div>
        <div className="mt-4">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Students Screened
          </h3>
          <p className="mt-1 text-3xl font-bold tracking-tight text-foreground">128</p>
          <p className="mt-1 text-xs text-muted-foreground font-light">
            Total screening submissions for Semester 2
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <div className="h-10 w-10 rounded-xl bg-chart-5/15 text-chart-5 flex items-center justify-center">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <span className="text-[10px] font-mono font-medium text-chart-5 bg-chart-5/10 px-2 py-0.5 rounded-md">
            Requires Attention
          </span>
        </div>
        <div className="mt-4">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Flagged for Support
          </h3>
          <p className="mt-1 text-3xl font-bold tracking-tight text-foreground">34</p>
          <p className="mt-1 text-xs text-muted-foreground font-light">
            Students with moderate to high indicator scores
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <div className="h-10 w-10 rounded-xl bg-chart-3/15 text-chart-3 flex items-center justify-center">
            <CalendarCheck2 className="h-5 w-5" />
          </div>
          <span className="text-[10px] font-mono font-medium text-chart-3 bg-chart-3/10 px-2 py-0.5 rounded-md">
            In Queue
          </span>
        </div>
        <div className="mt-4">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Pending Referrals
          </h3>
          <p className="mt-1 text-3xl font-bold tracking-tight text-foreground">12</p>
          <p className="mt-1 text-xs text-muted-foreground font-light">
            Awaiting clinical consultation intake
          </p>
        </div>
      </div>
    </div>
  );
}
