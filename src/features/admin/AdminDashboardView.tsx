import { AdminHeader } from "./components/AdminHeader";
import { AdminMetrics } from "./components/AdminMetrics";
import { AdminManagementGrid } from "./components/AdminManagementGrid";
import { SystemSettingsCard } from "./components/SystemSettingsCard";
import { AdminNotice } from "./components/AdminNotice";
import { mockAdminProfile, mockAdminSections } from "./data/mock-admin-data";

export function AdminDashboardView() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-12 space-y-10">
      <AdminHeader profile={mockAdminProfile} />
      <AdminMetrics />
      <AdminManagementGrid sections={mockAdminSections} />
      <SystemSettingsCard />
      <AdminNotice />
    </div>
  );
}
