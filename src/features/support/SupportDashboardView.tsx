import React from "react";
import { useSupport } from "./context/SupportContext";
import { SupportHeader } from "./components/SupportHeader";
import { SupportPopiaNotice } from "./components/SupportPopiaNotice";
import { SupportDashboardTab } from "./components/views/SupportDashboardTab";
import { StudentScreeningTab } from "./components/views/StudentScreeningTab";
import { FlaggedSupportTab } from "./components/views/FlaggedSupportTab";
import { IntakeReferralsTab } from "./components/views/IntakeReferralsTab";
import { StudentBreakdownModal } from "./components/modals/StudentBreakdownModal";
import { RecordReferralModal } from "./components/modals/RecordReferralModal";
import { LogInterventionNoteModal } from "./components/modals/LogInterventionNoteModal";
import { UpdateReferralStatusModal } from "./components/modals/UpdateReferralStatusModal";

export function SupportDashboardView() {
  const { activeTab, setActiveTab } = useSupport();

  const renderActiveTab = () => {
    switch (activeTab) {
      case "dashboard":
        return <SupportDashboardTab onSelectTab={setActiveTab} />;
      case "screening":
        return <StudentScreeningTab />;
      case "flagged":
        return <FlaggedSupportTab />;
      case "intake":
        return <IntakeReferralsTab />;
      default:
        return <SupportDashboardTab onSelectTab={setActiveTab} />;
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-12 space-y-8">
      {/* Top Header & Navigation Sub-Tabs */}
      <SupportHeader activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Main Tab View */}
      <main className="min-h-[550px]">{renderActiveTab()}</main>

      {/* Institutional Confidentiality & POPIA Disclaimer on all 4 views */}
      <SupportPopiaNotice />

      {/* Interactive Global Triage Modals */}
      <StudentBreakdownModal />
      <RecordReferralModal />
      <LogInterventionNoteModal />
      <UpdateReferralStatusModal />
    </div>
  );
}
