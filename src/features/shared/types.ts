import type { ReactNode } from "react";

export interface DashboardMetric {
  id: string;
  title: string;
  value: string | number;
  label: string;
  icon?: ReactNode;
}
