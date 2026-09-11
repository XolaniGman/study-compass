export interface ScreeningResultItem {
  area: string;
  status: string;
  color: string;
  level: "mild" | "moderate" | "needs-attention" | "typical";
}

export interface RecommendedExerciseItem {
  id: string;
  title: string;
  schedule: string;
  category: string;
}

export interface StudentProfile {
  name: string;
  studentId: string;
  program: string;
  year: string;
}
