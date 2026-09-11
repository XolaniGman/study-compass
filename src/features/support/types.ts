export interface StudentQueueRecord {
  id: string;
  name: string;
  department: string;
  status: "Flagged for support" | "Pending referral" | "In review" | "Supported";
  primaryIndicator: string;
  dateFlagged: string;
}

export interface SupportStaffProfile {
  name: string;
  unitRole: string;
  department: string;
}
