import React, { useState } from "react";
import { useRouterState, useNavigate } from "@tanstack/react-router";
import { AdminHeader } from "./components/AdminHeader";
import { AdminMetrics } from "./components/AdminMetrics";
import { AdminManagementGrid } from "./components/AdminManagementGrid";
import { SystemSettingsCard } from "./components/SystemSettingsCard";
import { AdminNotice } from "./components/AdminNotice";
import { mockAdminProfile } from "./data/mock-admin-data";

// Full Module Pages with Horizontal Subtabs matching reference image
import { UsersManagementPage } from "./components/pages/UsersManagementPage";
import { AssessmentsManagementPage } from "./components/pages/AssessmentsManagementPage";
import { ContentManagementPage } from "./components/pages/ContentManagementPage";
import { OperationsMaintenancePage } from "./components/pages/OperationsMaintenancePage";

// Interactive Modals (Available for modal overlays or quick actions)
import { AddUserModal } from "./components/modals/AddUserModal";
import { AuditPermissionsModal } from "./components/modals/AuditPermissionsModal";
import { DeactivateUserModal } from "./components/modals/DeactivateUserModal";
import { ExportUserModal } from "./components/modals/ExportUserModal";
import { CreateAssessmentModal } from "./components/modals/CreateAssessmentModal";
import { EditIndicatorsModal } from "./components/modals/EditIndicatorsModal";
import { PreviewFlowModal } from "./components/modals/PreviewFlowModal";
import { SetWeightingsModal } from "./components/modals/SetWeightingsModal";
import { AddExerciseModal } from "./components/modals/AddExerciseModal";
import { UpdateContactModal } from "./components/modals/UpdateContactModal";
import { PublishGuideModal } from "./components/modals/PublishGuideModal";
import { ArchiveResourceModal } from "./components/modals/ArchiveResourceModal";
import { SystemAuditLogsModal } from "./components/modals/SystemAuditLogsModal";

export function AdminDashboardView() {
  const routerState = useRouterState();
  const navigate = useNavigate();
  const search = (routerState.location.search || {}) as Record<string, string | undefined>;

  const activeTab = search["tab"] || "overview";
  const activeSubtab = search["subtab"];

  const handleSelectTab = (tab: string, subtab?: string) => {
    navigate({
      to: "/admin",
      search: { tab, ...(subtab ? { subtab } : {}) },
    });
  };

  const handleSelectSubtab = (subtab: string) => {
    navigate({
      to: "/admin",
      search: { tab: activeTab, subtab },
    });
  };

  // Optional Modal open states for overlay access
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isAuditPermissionsOpen, setIsAuditPermissionsOpen] = useState(false);
  const [isDeactivateUserOpen, setIsDeactivateUserOpen] = useState(false);
  const [isExportUserOpen, setIsExportUserOpen] = useState(false);

  const [isCreateAssessmentOpen, setIsCreateAssessmentOpen] = useState(false);
  const [isEditIndicatorsOpen, setIsEditIndicatorsOpen] = useState(false);
  const [isPreviewFlowOpen, setIsPreviewFlowOpen] = useState(false);
  const [isSetWeightingsOpen, setIsSetWeightingsOpen] = useState(false);

  const [isAddExerciseOpen, setIsAddExerciseOpen] = useState(false);
  const [isUpdateContactOpen, setIsUpdateContactOpen] = useState(false);
  const [isPublishGuideOpen, setIsPublishGuideOpen] = useState(false);
  const [isArchiveResourceOpen, setIsArchiveResourceOpen] = useState(false);

  const [isSystemLogsOpen, setIsSystemLogsOpen] = useState(false);

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-12 space-y-8">
      {/* 1. Overview Tab: Displays portal header, metrics, and module cards */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          <AdminHeader profile={mockAdminProfile} />

          {/* Top Metric Cards (Computed Dynamically) */}
          <AdminMetrics />

          {/* Three Scannable Module Cards: Clicking card or sub-action navigates directly to that full page */}
          <AdminManagementGrid
            onAddUser={() => handleSelectTab("users", "add-user")}
            onAuditPermissions={() => handleSelectTab("users", "audit-permissions")}
            onDeactivateAccount={() => handleSelectTab("users", "deactivate-account")}
            onExportDirectory={() => handleSelectTab("users", "export-directory")}
            onCreateAssessment={() => handleSelectTab("assessments", "create-assessment")}
            onEditIndicators={() => handleSelectTab("assessments", "edit-indicators")}
            onPreviewFlow={() => handleSelectTab("assessments", "preview-flow")}
            onSetWeightings={() => handleSelectTab("assessments", "set-weightings")}
            onAddExercise={() => handleSelectTab("content", "add-exercise")}
            onUpdateContact={() => handleSelectTab("content", "update-contact")}
            onPublishGuide={() => handleSelectTab("content", "publish-guide")}
            onArchiveResource={() => handleSelectTab("content", "archive-resource")}
            onOpenModulePage={(tab, subtab) => handleSelectTab(tab, subtab)}
          />

          {/* Bottom Panel: System Operations & Maintenance */}
          <SystemSettingsCard
            onViewLogs={() => handleSelectTab("maintenance", "audit-logs")}
          />

          {/* Institutional Disclaimer Notice */}
          <AdminNotice />
        </div>
      )}

      {/* 2. Module 1 Full Page: Manage Users & Permissions */}
      {activeTab === "users" && (
        <UsersManagementPage
          initialSubtab={activeSubtab || "add-user"}
          onNavigateToOverview={() => handleSelectTab("overview")}
          onSubtabChange={handleSelectSubtab}
        />
      )}

      {/* 3. Module 2 Full Page: Manage Screening Modules */}
      {activeTab === "assessments" && (
        <AssessmentsManagementPage
          initialSubtab={activeSubtab || "create-assessment"}
          onNavigateToOverview={() => handleSelectTab("overview")}
          onSubtabChange={handleSelectSubtab}
        />
      )}

      {/* 4. Module 3 Full Page: Manage Exercises & Support */}
      {activeTab === "content" && (
        <ContentManagementPage
          initialSubtab={activeSubtab || "add-exercise"}
          onNavigateToOverview={() => handleSelectTab("overview")}
          onSubtabChange={handleSelectSubtab}
        />
      )}

      {/* 5. System Operations & Maintenance Full Page */}
      {activeTab === "maintenance" && (
        <OperationsMaintenancePage
          initialSubtab={activeSubtab || "system-health"}
          onNavigateToOverview={() => handleSelectTab("overview")}
          onSubtabChange={handleSelectSubtab}
        />
      )}

      {/* Standalone Interactive Overlays */}
      <AddUserModal open={isAddUserOpen} onOpenChange={setIsAddUserOpen} />
      <AuditPermissionsModal open={isAuditPermissionsOpen} onOpenChange={setIsAuditPermissionsOpen} />
      <DeactivateUserModal open={isDeactivateUserOpen} onOpenChange={setIsDeactivateUserOpen} />
      <ExportUserModal open={isExportUserOpen} onOpenChange={setIsExportUserOpen} />

      <CreateAssessmentModal open={isCreateAssessmentOpen} onOpenChange={setIsCreateAssessmentOpen} />
      <EditIndicatorsModal open={isEditIndicatorsOpen} onOpenChange={setIsEditIndicatorsOpen} />
      <PreviewFlowModal open={isPreviewFlowOpen} onOpenChange={setIsPreviewFlowOpen} />
      <SetWeightingsModal open={isSetWeightingsOpen} onOpenChange={setIsSetWeightingsOpen} />

      <AddExerciseModal open={isAddExerciseOpen} onOpenChange={setIsAddExerciseOpen} />
      <UpdateContactModal open={isUpdateContactOpen} onOpenChange={setIsUpdateContactOpen} />
      <PublishGuideModal open={isPublishGuideOpen} onOpenChange={setIsPublishGuideOpen} />
      <ArchiveResourceModal open={isArchiveResourceOpen} onOpenChange={setIsArchiveResourceOpen} />

      <SystemAuditLogsModal open={isSystemLogsOpen} onOpenChange={setIsSystemLogsOpen} />
    </div>
  );
}
