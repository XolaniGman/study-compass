import type { SupportStaffProfile, TriageStudentRecord } from "../types";

export const mockSupportStaffProfile: SupportStaffProfile = {
  name: "Dr. N. Dube",
  unitRole: "Senior Disability & Neurodiversity Specialist",
  department: "DUT Disability Unit, Student Services",
  campus: "ML Sultan Campus (Steve Biko Hub)",
};

// Curated list of South African student names and faculties for realistic demographic distribution
const FIRST_NAMES = [
  "Sibusiso", "Amina", "Thabo", "Jessica", "Lerato", "Kavisha", "Sipho", "Zanele",
  "Pieter", "Nthabiseng", "Tariq", "Nomvula", "Bongani", "Fatima", "Liam", "Ayanda",
  "Keagan", "Priya", "Andile", "Chloe", "Musa", "Farzana", "Lungile", "David",
  "Precious", "Kagiso", "Lindiwe", "Brandon", "Shalini", "Nkosinathi", "Tshepo", "Bianca",
  "Simphiwe", "Nirav", "Busisiwe", "Francois", "Anathi", "Thandeka", "Craig", "Dineo"
];

const LAST_NAMES = [
  "Mkhize", "Patel", "Nkosi", "van Wyk", "Dlamini", "Naidoo", "Sithole", "Khumalo",
  "du Plessis", "Molefe", "Mahomed", "Ndaba", "Zulu", "Seedat", "Botha", "Cele",
  "Petersen", "Pillay", "Dladla", "Smith", "Gumede", "Cassim", "Mthembu", "Williams",
  "Shabalala", "Modise", "Mabaso", "Fourie", "Govender", "Hlatshwayo", "Radebe", "Coetzee",
  "Ngcobo", "Chetty", "Mahlangu", "Venter", "Ntuli", "Buthelezi", "Adams", "Kekana"
];

const FACULTIES_AND_DEPTS = [
  { faculty: "Faculty of Accounting & Informatics", dept: "Information Technology & Software Dev" },
  { faculty: "Faculty of Accounting & Informatics", dept: "Financial Accounting & Auditing" },
  { faculty: "Faculty of Engineering & the Built Environment", dept: "Mechanical & Mechatronics Engineering" },
  { faculty: "Faculty of Engineering & the Built Environment", dept: "Civil Engineering & Surveying" },
  { faculty: "Faculty of Engineering & the Built Environment", dept: "Electrical & Computer Engineering" },
  { faculty: "Faculty of Health Sciences", dept: "Nursing Science & Clinical Care" },
  { faculty: "Faculty of Health Sciences", dept: "Radiography & Medical Imaging" },
  { faculty: "Faculty of Health Sciences", dept: "Emergency Medical Care" },
  { faculty: "Faculty of Applied Sciences", dept: "Biotechnology & Food Technology" },
  { faculty: "Faculty of Applied Sciences", dept: "Chemistry & Industrial Processing" },
  { faculty: "Faculty of Management Sciences", dept: "Business Administration & HR" },
  { faculty: "Faculty of Management Sciences", dept: "Marketing & Retail Management" },
  { faculty: "Faculty of Arts & Design", dept: "Graphic Design & Digital Media" },
  { faculty: "Faculty of Arts & Design", dept: "Drama & Performance Studies" },
];

const CAMPUSES = [
  "ML Sultan Campus",
  "Steve Biko Campus",
  "Ritson Campus",
  "Brickfield Campus",
  "Indumiso Campus (PMB)",
  "Riverside Campus (PMB)",
];

const STUDY_YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year / BTech", "Postgraduate"];

// Helper to deterministically build 128 records
export function generateMockStudents(): TriageStudentRecord[] {
  const records: TriageStudentRecord[] = [];

  // 1. Exactly 34 students will meet the FLAGGED criteria initially:
  // (riskLevel === "High" || flaggedDomainCount >= 2) && !flagReviewed
  // Among these, we'll configure some as Pending Specialist, and some as Screened / In Review.
  
  // 2. Exactly 12 students will have status === "Pending Specialist" initially.
  // Let's ensure:
  // - Flagged: exactly 34 records (indexes 0 to 33)
  // - Pending Specialist: exactly 12 records (indexes 0 to 7 among flagged + indexes 34 to 37 among non-flagged, total = 12)
  // - Non-flagged: exactly 94 records (indexes 34 to 127)

  for (let i = 0; i < 128; i++) {
    const isFlagged = i < 34; // exactly 34 flagged
    const isPending = (i >= 0 && i < 8) || (i >= 34 && i < 38); // exactly 8 + 4 = 12 pending specialist
    
    const firstName = FIRST_NAMES[i % FIRST_NAMES.length];
    const lastName = LAST_NAMES[(i * 3 + 7) % LAST_NAMES.length];
    const name = `${firstName} ${lastName}`;
    const studentId = `221${(10000 + i * 73).toString().padStart(5, "0").slice(0, 5)}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase().replace(/[^a-z]/g, "")}@dut4life.ac.za`;
    const facDept = FACULTIES_AND_DEPTS[i % FACULTIES_AND_DEPTS.length];
    const campus = CAMPUSES[i % CAMPUSES.length];
    const year = STUDY_YEARS[i % STUDY_YEARS.length];

    // Screening Date (staggered across Semester 2, Aug-Sept 2026)
    const day = 1 + (i % 28);
    const screeningDate = `2026-09-${day.toString().padStart(2, "0")}`;

    let riskLevel: "High" | "Moderate" | "Mild" | "Low";
    let flaggedDomainCount: number;
    let readingScore: number;
    let mathScore: number;
    let writingScore: number;
    let attentionScore: number;
    let primaryDomain: "Reading" | "Mathematics" | "Writing" | "Attention & Memory";
    let primaryIndicator: string;
    let compositeScore: number;

    if (isFlagged) {
      // Must satisfy: (riskLevel === "High" || flaggedDomainCount >= 2) && !flagReviewed
      riskLevel = i % 3 === 0 ? "High" : "High";
      flaggedDomainCount = 2 + (i % 3); // 2, 3, or 4 domains below threshold <= 45
      
      if (i % 4 === 0) {
        primaryDomain = "Reading";
        primaryIndicator = "Severe Lexical & Reading Fluency Difficulty";
        readingScore = 32 + (i % 12);
        mathScore = 38 + ((i * 2) % 8);
        writingScore = 58 + (i % 20);
        attentionScore = 65 + (i % 15);
      } else if (i % 4 === 1) {
        primaryDomain = "Mathematics";
        primaryIndicator = "Spatial & Quantitative Dyscalculia Indicators";
        readingScore = 62 + (i % 15);
        mathScore = 28 + (i % 14);
        writingScore = 39 + (i % 7);
        attentionScore = 55 + (i % 20);
      } else if (i % 4 === 2) {
        primaryDomain = "Writing";
        primaryIndicator = "Orthographic & Fine Motor Dysgraphia Signs";
        readingScore = 41 + (i % 5);
        mathScore = 58 + (i % 18);
        writingScore = 30 + (i % 13);
        attentionScore = 62 + (i % 16);
      } else {
        primaryDomain = "Attention & Memory";
        primaryIndicator = "Executive Function & Working Memory Pacing";
        readingScore = 38 + (i % 7);
        mathScore = 40 + (i % 6);
        writingScore = 64 + (i % 15);
        attentionScore = 29 + (i % 14);
      }
      compositeScore = Math.round((readingScore + mathScore + writingScore + attentionScore) / 4);
    } else {
      // Non-flagged: must have (riskLevel !== "High" && flaggedDomainCount < 2)
      // Exactly 0 or 1 domain below 45, and riskLevel Moderate, Mild, or Low
      const variant = i % 3;
      if (variant === 0) {
        riskLevel = "Moderate";
        flaggedDomainCount = 1; // only 1 domain below threshold
        primaryDomain = "Reading";
        primaryIndicator = "Mild Reading Speed Variance";
        readingScore = 42;
        mathScore = 68;
        writingScore = 72;
        attentionScore = 65;
      } else if (variant === 1) {
        riskLevel = "Mild";
        flaggedDomainCount = 0;
        primaryDomain = "Attention & Memory";
        primaryIndicator = "Slight Processing Pacing Variation";
        readingScore = 68;
        mathScore = 74;
        writingScore = 70;
        attentionScore = 58;
      } else {
        riskLevel = "Low";
        flaggedDomainCount = 0;
        primaryDomain = "Mathematics";
        primaryIndicator = "Age-Appropriate Academic Baseline";
        readingScore = 82;
        mathScore = 78;
        writingScore = 85;
        attentionScore = 80;
      }
      compositeScore = Math.round((readingScore + mathScore + writingScore + attentionScore) / 4);
    }

    // Determine status
    let status: TriageStudentRecord["status"];
    if (isPending) {
      status = "Pending Specialist";
    } else if (i === 40 || i === 41 || i === 42 || i === 43) {
      status = "In Review";
    } else if (i === 50 || i === 51 || i === 52) {
      status = "Referred to Accommodations";
    } else if (i === 60 || i === 61) {
      status = "Supported";
    } else {
      status = "Screened";
    }

    const referralNotes: TriageStudentRecord["referralNotes"] = [];
    if (isPending || status === "In Review" || status === "Referred to Accommodations" || status === "Supported") {
      referralNotes.push({
        id: `note-${i}-1`,
        date: screeningDate,
        author: "Dr. N. Dube",
        category: "Referral Note",
        text: `Screening indicates ${primaryIndicator.toLowerCase()}. Recommended for formal psycho-educational consultation and assistive technology appraisal.`,
      });
    }

    const assignedAccommodations: string[] = [];
    if (status === "Referred to Accommodations" || status === "Supported") {
      assignedAccommodations.push("Extra Time (15 min per hour)", "Quiet Examination Venue");
      if (primaryDomain === "Reading" || primaryDomain === "Writing") {
        assignedAccommodations.push("Screen Reader / Read & Write Gold Software");
      }
    }

    records.push({
      id: studentId,
      name,
      email,
      department: facDept.dept,
      faculty: facDept.faculty,
      campus,
      year,
      screeningDate,
      compositeScore,
      riskLevel,
      status,
      primaryIndicator,
      primaryDomain,
      domainScores: {
        reading: readingScore,
        math: mathScore,
        writing: writingScore,
        attention: attentionScore,
      },
      flaggedDomainCount,
      flagReviewed: false,
      referralDate: isPending || status === "Referred to Accommodations" ? screeningDate : undefined,
      referralNotes,
      assignedAccommodations: assignedAccommodations.length > 0 ? assignedAccommodations : undefined,
    });
  }

  return records;
}

export const mockStudents: TriageStudentRecord[] = generateMockStudents();

// Quick verify sanity constants for reference
export const INITIAL_STUDENTS_COUNT = mockStudents.length; // exactly 128
export const INITIAL_FLAGGED_COUNT = mockStudents.filter(
  (s) => (s.riskLevel === "High" || s.flaggedDomainCount >= 2) && !s.flagReviewed
).length; // exactly 34
export const INITIAL_PENDING_COUNT = mockStudents.filter(
  (s) => s.status === "Pending Specialist"
).length; // exactly 12

// Legacy support if needed
export const mockStudentQueue = mockStudents.slice(0, 6).map((s) => ({
  id: s.id,
  name: s.name,
  department: s.department,
  status: s.status,
  primaryIndicator: s.primaryIndicator,
  dateFlagged: s.screeningDate,
}));
