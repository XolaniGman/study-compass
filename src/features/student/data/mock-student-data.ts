import { DEFAULT_STUDENT_PROFILE, DEFAULT_BASELINE_SESSION, DEFAULT_EXERCISES } from "./student-data";

export const mockStudentProfile = DEFAULT_STUDENT_PROFILE;

export const mockStudentResults = Object.values(DEFAULT_BASELINE_SESSION.domainResults).map((d) => ({
  area: d.domainTitle,
  status: d.levelLabel,
  color: d.color,
  level: d.level,
}));

export const mockRecommendedExercises = DEFAULT_EXERCISES;
