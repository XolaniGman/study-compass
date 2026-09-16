export type RiskLevel = "High" | "Moderate" | "Mild" | "Low";

export type ScreeningDomain = "Reading" | "Mathematics" | "Writing" | "Attention & Memory";

export type TriageStatus =
  | "Screened"
  | "Pending Specialist"
  | "In Review"
  | "Referred to Accommodations"
  | "Supported";

export interface InterventionNote {
  id: string;
  date: string;
  author: string;
  category: "Consultation" | "Academic Advice" | "Accommodations Review" | "Clinical Observation" | "Referral Note";
  text: string;
}

export interface TriageStudentRecord {
  id: string; // DUT Student ID, e.g. "22100412"
  name: string;
  email: string;
  department: string;
  faculty: string;
  campus: string;
  year: string;
  screeningDate: string;
  compositeScore: number; // 0-100
  riskLevel: RiskLevel;
  status: TriageStatus;
  primaryIndicator: string;
  primaryDomain: ScreeningDomain;
  domainScores: {
    reading: number;
    math: number;
    writing: number;
    attention: number;
  };
  flaggedDomainCount: number; // Count of domains where score <= 45% (severe difficulty)
  flagReviewed: boolean; // When true, excluded from Flagged Support view
  referralDate?: string;
  referralNotes: InterventionNote[];
  assignedAccommodations?: string[];
}

export interface ActivityLogItem {
  id: string;
  timestamp: string;
  studentId: string;
  studentName: string;
  action: "referral_recorded" | "flag_reviewed" | "status_updated" | "note_logged";
  description: string;
  badgeText?: string;
}

export interface SupportStaffProfile {
  name: string;
  unitRole: string;
  department: string;
  campus: string;
}

// Compatibility alias for legacy components if needed
export type StudentQueueRecord = {
  id: string;
  name: string;
  department: string;
  status: string;
  primaryIndicator: string;
  dateFlagged: string;
};
