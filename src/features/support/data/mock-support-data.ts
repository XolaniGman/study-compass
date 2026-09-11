import type { StudentQueueRecord, SupportStaffProfile } from "../types";

export const mockSupportStaffProfile: SupportStaffProfile = {
  name: "Dr. N. Dube",
  unitRole: "Senior Disability & Neurodiversity Coordinator",
  department: "DUT Disability Unit, ML Sultan Campus",
};

export const mockStudentQueue: StudentQueueRecord[] = [
  {
    id: "219012345",
    name: "Sibusiso Mkhize",
    department: "Accounting & Informatics",
    status: "Flagged for support",
    primaryIndicator: "Severe Lexical & Reading Fluency",
    dateFlagged: "2026-09-08",
  },
  {
    id: "219023456",
    name: "Amina Patel",
    department: "Engineering & Built Environment",
    status: "Pending referral",
    primaryIndicator: "Spatial & Quantitative Alignment",
    dateFlagged: "2026-09-09",
  },
  {
    id: "219034567",
    name: "Thabo Nkosi",
    department: "Health Sciences",
    status: "In review",
    primaryIndicator: "Working Memory & Pacing",
    dateFlagged: "2026-09-07",
  },
  {
    id: "219045678",
    name: "Jessica van Wyk",
    department: "Arts & Design",
    status: "Supported",
    primaryIndicator: "Accommodations Active (Extra Time)",
    dateFlagged: "2026-09-02",
  },
  {
    id: "219056789",
    name: "Lerato Dlamini",
    department: "Management Sciences",
    status: "Pending referral",
    primaryIndicator: "Lexical Comprehension & Attention",
    dateFlagged: "2026-09-10",
  },
  {
    id: "219067890",
    name: "Kavisha Naidoo",
    department: "Applied Sciences",
    status: "In review",
    primaryIndicator: "Mathematical Equation Processing",
    dateFlagged: "2026-09-11",
  },
];
