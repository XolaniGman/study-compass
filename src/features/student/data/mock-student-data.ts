import type { ScreeningResultItem, RecommendedExerciseItem, StudentProfile } from "../types";

export const mockStudentProfile: StudentProfile = {
  name: "Alex Ndlovu",
  studentId: "220194821",
  program: "Bachelor of Information and Communications Technology",
  year: "2nd Year",
};

export const mockStudentResults: ScreeningResultItem[] = [
  { area: "Reading & Lexical Processing", status: "Moderate difficulty", color: "bg-chart-2", level: "moderate" },
  { area: "Mathematics & Quantitative", status: "Needs attention", color: "bg-chart-5", level: "needs-attention" },
  { area: "Written Expression", status: "Mild difficulty", color: "bg-chart-1", level: "mild" },
  { area: "Sustained Attention", status: "Typical range", color: "bg-chart-3", level: "typical" },
];

export const mockRecommendedExercises: RecommendedExerciseItem[] = [
  {
    id: "ex-1",
    title: "Guided Academic Text Processing",
    schedule: "15 minutes, 3 times per week",
    category: "Reading Support",
  },
  {
    id: "ex-2",
    title: "Number-Pattern & Spatial Equation Worksheets",
    schedule: "20 minutes, twice per week",
    category: "Mathematics",
  },
  {
    id: "ex-3",
    title: "Interval Focus & Task-Chunking Technique",
    schedule: "Daily 25-minute study sprints",
    category: "Study Strategy",
  },
  {
    id: "ex-4",
    title: "Auditory Note-Taking & Text-to-Speech Review",
    schedule: "Before and after lecture sessions",
    category: "Assistive Tool",
  },
];
