import type { AdminManagementSectionItem, AdminProfile } from "../types";

export const mockAdminProfile: AdminProfile = {
  name: "Institutional Admin",
  role: "Lead Systems Administrator",
  systemVersion: "v2.4.0-screening-core",
};

export const mockAdminSections: AdminManagementSectionItem[] = [
  {
    id: "users",
    title: "Manage Users & Permissions",
    description: "Manage student registrations, support specialist roles, and access permissions.",
    actions: ["Add New User", "Audit Permissions", "Deactivate Account", "Export User Directory"],
  },
  {
    id: "assessments",
    title: "Manage Screening Modules",
    description: "Configure screening questionnaires, scoring indicator thresholds, and prompt structures.",
    actions: ["Create Assessment", "Edit Indicators", "Preview Flow", "Set Weightings"],
  },
  {
    id: "content",
    title: "Manage Exercises & Support Resources",
    description: "Curate study guides, cognitive exercise routines, and DUT contact directories.",
    actions: ["Add Exercise Routine", "Update Contact Info", "Publish Guide", "Archive Resource"],
  },
];
