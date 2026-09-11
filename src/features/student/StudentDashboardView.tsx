import { StudentHeader } from "./components/StudentHeader";
import { StudentMetrics } from "./components/StudentMetrics";
import { ScreeningResultsList } from "./components/ScreeningResultsList";
import { RecommendedExercises } from "./components/RecommendedExercises";
import { StudentDisclaimer } from "./components/StudentDisclaimer";
import { AssessmentAction } from "./components/AssessmentAction";
import { mockStudentProfile, mockStudentResults, mockRecommendedExercises } from "./data/mock-student-data";

export function StudentDashboardView() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-12 space-y-10">
      <StudentHeader profile={mockStudentProfile} />
      <StudentMetrics />

      <div className="grid gap-8 lg:grid-cols-2">
        <ScreeningResultsList results={mockStudentResults} />
        <RecommendedExercises exercises={mockRecommendedExercises} />
      </div>

      <StudentDisclaimer />
      <AssessmentAction />
    </div>
  );
}
