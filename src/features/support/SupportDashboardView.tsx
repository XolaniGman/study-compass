import { SupportHeader } from "./components/SupportHeader";
import { SupportMetrics } from "./components/SupportMetrics";
import { StudentQueueTable } from "./components/StudentQueueTable";
import { CaseActionButtons } from "./components/CaseActionButtons";
import { mockSupportStaffProfile, mockStudentQueue } from "./data/mock-support-data";

export function SupportDashboardView() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-12 space-y-10">
      <SupportHeader profile={mockSupportStaffProfile} />
      <SupportMetrics />
      <StudentQueueTable students={mockStudentQueue} />
      <CaseActionButtons />
    </div>
  );
}
