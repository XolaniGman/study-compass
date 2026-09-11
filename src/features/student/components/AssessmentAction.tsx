import React from "react";
import { ClipboardList, FileBarChart2, Users } from "lucide-react";
import { useStudent } from "../context/StudentContext";
import { Button } from "../../../components/ui/button";

export function AssessmentAction() {
  const { setIsAssessmentModalOpen, setActiveAssessmentModuleId, setIsReportModalOpen, setIsConsultationModalOpen } =
    useStudent();

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        onClick={() => {
          setActiveAssessmentModuleId("all-comprehensive");
          setIsAssessmentModalOpen(true);
        }}
        className="bg-primary text-primary-foreground text-xs gap-2 rounded-xl"
      >
        <ClipboardList className="h-4 w-4" />
        <span>Start New Screening Assessment</span>
      </Button>

      <Button
        onClick={() => setIsReportModalOpen(true)}
        variant="outline"
        className="text-xs gap-2 rounded-xl"
      >
        <FileBarChart2 className="h-4 w-4" />
        <span>Download Indicator Summary</span>
      </Button>

      <Button
        onClick={() => setIsConsultationModalOpen(true)}
        variant="outline"
        className="text-xs gap-2 rounded-xl"
      >
        <Users className="h-4 w-4" />
        <span>Request Disability Unit Consultation</span>
      </Button>
    </div>
  );
}
