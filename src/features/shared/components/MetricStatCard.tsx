import type { ReactNode } from "react";

interface MetricStatCardProps {
  icon?: ReactNode;
  title: string;
  value: string | number;
  label: string;
}

export function MetricStatCard({ icon, title, value, label }: MetricStatCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-colors hover:bg-accent/30">
      {icon && (
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
      )}
      <h3 className="mt-4 text-sm font-medium text-muted-foreground">{title}</h3>
      <p className="mt-1 text-3xl font-bold text-foreground">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
