import type { ReactNode } from "react";

export type RoleType = "student" | "support" | "admin";

export interface NavItem {
  id: string;
  label: string;
  to: string;
  search?: Record<string, string>;
  icon: ReactNode;
  badge?: string | number;
  badgeVariant?: "primary" | "secondary" | "accent";
  roles?: RoleType[];
}

export interface NavGroup {
  groupTitle: string;
  items: NavItem[];
}
