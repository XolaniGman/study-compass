import React from "react";
import { StudentProvider, useStudent } from "./context/StudentContext";
import { StudentHeader } from "./components/StudentHeader";
import { StudentOverviewTab } from "./components/tabs/StudentOverviewTab";
import { StudentQuizzesTab } from "./components/tabs/StudentQuizzesTab";
import { StudentAssessmentsTab } from "./components/tabs/StudentAssessmentsTab";
import { StudentResultsTab } from "./components/tabs/StudentResultsTab";
import { StudentExercisesTab } from "./components/tabs/StudentExercisesTab";
import { StudentSupportTab } from "./components/tabs/StudentSupportTab";
import { StudentSettingsTab } from "./components/tabs/StudentSettingsTab";
import { AssessmentRunnerModal } from "./components/AssessmentRunnerModal";
import { QuizRunnerModal } from "./components/quizzes/QuizRunnerModal";
import { InteractiveExerciseModal } from "./components/InteractiveExerciseModal";
import { ConsultationBookingModal } from "./components/ConsultationBookingModal";
import { ScreeningReportModal } from "./components/ScreeningReportModal";
import { StudentDisclaimer } from "./components/StudentDisclaimer";

function StudentDashboardContent() {
  const { activeTab, setActiveTab, accessibility } = useStudent();

  const renderActiveTab = () => {
    switch (activeTab) {
      case "overview":
        return <StudentOverviewTab onSelectTab={setActiveTab} />;
      case "quizzes":
        return <StudentQuizzesTab />;
      case "assessments":
        return <StudentAssessmentsTab />;
      case "results":
        return <StudentResultsTab />;
      case "exercises":
        return <StudentExercisesTab />;
      case "support":
        return <StudentSupportTab />;
      case "settings":
        return <StudentSettingsTab />;
      default:
        return <StudentOverviewTab onSelectTab={setActiveTab} />;
    }
  };

  return (
    <div
      className={`mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-12 space-y-8 ${
        accessibility.dyslexiaFont ? "font-sans tracking-wide leading-relaxed" : ""
      } ${accessibility.highContrast ? "contrast-125" : ""}`}
    >
      <StudentHeader activeTab={activeTab} onSelectTab={setActiveTab} />

      <main className="min-h-[500px]">{renderActiveTab()}</main>

      <StudentDisclaimer />

      {/* Interactive Global Modals */}
      <QuizRunnerModal />
      <AssessmentRunnerModal />
      <InteractiveExerciseModal />
      <ConsultationBookingModal />
      <ScreeningReportModal />
    </div>
  );
}

export function StudentDashboardView() {
  return (
    <StudentProvider>
      <StudentDashboardContent />
    </StudentProvider>
  );
}
