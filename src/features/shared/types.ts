import type { ReactNode } from "react";

export interface DashboardMetric {
  id: string;
  title: string;
  value: string | number;
  label: string;
  icon?: ReactNode;
}

export type UserRole = "student" | "support_specialist" | "administrator";
export type UserStatus = "active" | "inactive";

export interface InstitutionalUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  studentOrStaffNumber: string;
  facultyOrDepartment: string;
  status: UserStatus;
  createdAt: string; // ISO date string e.g. "2026-09-16"
}

export type ScreeningDomainKey =
  | "reading"
  | "grammar"
  | "mathematics"
  | "memory"
  | "comprehension";

export interface AssessmentQuestion {
  id: string;
  domain: ScreeningDomainKey;
  prompt: string;
  context: string;
  type: "frequency-scale" | "impact-scale" | "accuracy-scale";
}

export interface AssessmentPoolItem {
  domain: ScreeningDomainKey;
  code: string; // "FR05", "FR06", "FR07", "FR08", "FR09"
  title: string;
  shortName: string;
  description: string;
  estimatedMinutes: number;
  questions: AssessmentQuestion[];
}

export interface ScoringConfig {
  thresholds: {
    high: number; // e.g. 40: score below or equal to which a domain counts as high difficulty / risk
    moderate: number; // e.g. 60: score below or equal to which counts as moderate difficulty
  };
  weightings: Record<ScreeningDomainKey, number>;
}

export interface InstitutionalExercise {
  id: string;
  title: string;
  domain: string;
  category: string;
  schedule?: string;
  durationMinutes: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  interactiveType?: string;
  description: string;
  objectives: string[];
  steps?: string[];
  completedCount: number;
  lastCompletedAt?: string;
  archived: boolean;
}

export interface InstitutionalSupportGuide {
  id: string;
  title: string;
  category: string;
  targetAudience: string;
  readingMinutes: number;
  summary: string;
  content: string;
  author: string;
  publishedAt: string;
  archived: boolean;
}

export interface InstitutionalContact {
  id: string;
  campus: string;
  building: string;
  phone: string;
  email: string;
  hours: string;
  specialistInCharge: string;
  archived: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  status: "SUCCESS" | "WARNING" | "INFO";
  details: string;
}
