import { ClipboardList, FileBarChart, Dumbbell, UserCheck } from "lucide-react";

export function StudentMetrics() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <ClipboardList className="h-5 w-5" />
          </div>
          <span className="text-[10px] font-mono font-medium text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md">
            Active S2
          </span>
        </div>
        <div className="mt-4">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Available Modules
          </h3>
          <p className="mt-1 text-3xl font-bold tracking-tight text-foreground">3</p>
          <p className="mt-1 text-xs text-muted-foreground font-light">
            Adaptive screening assessments ready
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <div className="h-10 w-10 rounded-xl bg-chart-2/15 text-chart-2 flex items-center justify-center">
            <FileBarChart className="h-5 w-5" />
          </div>
          <span className="text-[10px] font-mono font-medium text-chart-2 bg-chart-2/10 px-2 py-0.5 rounded-md">
            Evaluated
          </span>
        </div>
        <div className="mt-4">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Screening Indicators
          </h3>
          <p className="mt-1 text-3xl font-bold tracking-tight text-foreground">4</p>
          <p className="mt-1 text-xs text-muted-foreground font-light">
            Evaluated cognitive &amp; study domains
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <div className="h-10 w-10 rounded-xl bg-chart-3/15 text-chart-3 flex items-center justify-center">
            <Dumbbell className="h-5 w-5" />
          </div>
          <span className="text-[10px] font-mono font-medium text-chart-3 bg-chart-3/10 px-2 py-0.5 rounded-md">
            Recommended
          </span>
        </div>
        <div className="mt-4">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Study Exercises
          </h3>
          <p className="mt-1 text-3xl font-bold tracking-tight text-foreground">4</p>
          <p className="mt-1 text-xs text-muted-foreground font-light">
            Personalized practice routines
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <div className="h-10 w-10 rounded-xl bg-chart-1/15 text-chart-1 flex items-center justify-center">
            <UserCheck className="h-5 w-5" />
          </div>
          <span className="text-[10px] font-mono font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-md">
            DUT Unit
          </span>
        </div>
        <div className="mt-4">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            DUT Advisors
          </h3>
          <p className="mt-1 text-3xl font-bold tracking-tight text-foreground">2</p>
          <p className="mt-1 text-xs text-muted-foreground font-light">
            ML Sultan campus disability specialists
          </p>
        </div>
      </div>
    </div>
  );
}
