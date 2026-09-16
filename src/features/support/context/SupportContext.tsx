import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import type {
  TriageStudentRecord,
  ActivityLogItem,
  TriageStatus,
  InterventionNote,
  SupportStaffProfile,
} from "../types";
import {
  generateMockStudents,
  mockSupportStaffProfile,
} from "../data/mock-support-data";
import { useInstitutional } from "../../shared";

interface SupportContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  staffProfile: SupportStaffProfile;
  students: TriageStudentRecord[];
  flaggedStudents: TriageStudentRecord[];
  pendingReferrals: TriageStudentRecord[];
  completedReferrals: TriageStudentRecord[];
  recentActivity: ActivityLogItem[];
  
  // Core Actions
  recordReferral: (
    studentId: string,
    options?: { notes?: string; specialistType?: string; priority?: string }
  ) => void;
  updateReferralStatus: (
    studentId: string,
    newStatus: TriageStatus,
    options?: { notes?: string; accommodations?: string[] }
  ) => void;
  markFlagReviewed: (studentId: string, reviewNotes?: string) => void;
  logInterventionNote: (
    studentId: string,
    noteText: string,
    category?: InterventionNote["category"]
  ) => void;
  resetTriageData: () => void;

  // Active student for modals
  activeStudentForBreakdown: TriageStudentRecord | null;
  setActiveStudentForBreakdown: (student: TriageStudentRecord | null) => void;
  activeStudentForReferral: TriageStudentRecord | null;
  setActiveStudentForReferral: (student: TriageStudentRecord | null) => void;
  activeStudentForNote: TriageStudentRecord | null;
  setActiveStudentForNote: (student: TriageStudentRecord | null) => void;
  activeStudentForStatusUpdate: TriageStudentRecord | null;
  setActiveStudentForStatusUpdate: (student: TriageStudentRecord | null) => void;
}

const STORAGE_KEY = "study_compass_support_triage_v1";

const INITIAL_RECENT_ACTIVITY: ActivityLogItem[] = [
  {
    id: "act-init-1",
    timestamp: "10 mins ago",
    studentId: "22100000",
    studentName: "Sibusiso Mkhize",
    action: "referral_recorded",
    description: "Referral recorded to DUT Neurodiversity Specialist",
    badgeText: "Pending Specialist",
  },
  {
    id: "act-init-2",
    timestamp: "35 mins ago",
    studentId: "22103650",
    studentName: "Pieter du Plessis",
    action: "status_updated",
    description: "Approved accommodations: Extra Time (15m/hr) & Screen Reader",
    badgeText: "Referred to Accommodations",
  },
  {
    id: "act-init-3",
    timestamp: "1 hour ago",
    studentId: "22101460",
    studentName: "Thabo Nkosi",
    action: "note_logged",
    description: "Clinical consultation summary added to student file",
    badgeText: "Clinical Note",
  },
];

const SupportContext = createContext<SupportContextType | null>(null);

export function SupportProvider({ children }: { children: React.ReactNode }) {
  // Sync tab with URL search parameter (?tab=)
  const [activeTab, setActiveTabState] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return params.get("tab") || "dashboard";
    }
    return "dashboard";
  });

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", tab);
      window.history.pushState({}, "", url.toString());
    }
  };

  // Sync tab on popstate / history changes
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab");
      if (tab) {
        setActiveTabState(tab);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Top-level live students state — single dataset for all views
  const [students, setStudents] = useState<TriageStudentRecord[]>(() => {
    if (typeof window === "undefined") return generateMockStudents();
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_students`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return generateMockStudents();
    } catch {
      return generateMockStudents();
    }
  });

  // Recent activity feed (resets on refresh / session, with local caching)
  const [recentActivity, setRecentActivity] = useState<ActivityLogItem[]>(() => {
    if (typeof window === "undefined") return INITIAL_RECENT_ACTIVITY;
    try {
      const saved = sessionStorage.getItem(`${STORAGE_KEY}_activity`);
      return saved ? JSON.parse(saved) : INITIAL_RECENT_ACTIVITY;
    } catch {
      return INITIAL_RECENT_ACTIVITY;
    }
  });

  // Modal active targets
  const [activeStudentForBreakdown, setActiveStudentForBreakdown] =
    useState<TriageStudentRecord | null>(null);
  const [activeStudentForReferral, setActiveStudentForReferral] =
    useState<TriageStudentRecord | null>(null);
  const [activeStudentForNote, setActiveStudentForNote] =
    useState<TriageStudentRecord | null>(null);
  const [activeStudentForStatusUpdate, setActiveStudentForStatusUpdate] =
    useState<TriageStudentRecord | null>(null);

  // Sync students to localStorage for seamless tab switches
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_students`, JSON.stringify(students));
    } catch (e) {
      console.error("Failed to save support students to localStorage", e);
    }
  }, [students]);

  useEffect(() => {
    try {
      sessionStorage.setItem(`${STORAGE_KEY}_activity`, JSON.stringify(recentActivity));
    } catch (e) {
      console.error("Failed to save activity to sessionStorage", e);
    }
  }, [recentActivity]);

  const { scoringConfig } = useInstitutional();

  // Dynamic student triage evaluation driven by shared scoringConfig (Admin writes, Staff reads)
  const evaluatedStudents = React.useMemo(() => {
    if (!scoringConfig) return students;
    const { high, moderate } = scoringConfig.thresholds;
    const { reading: wR, mathematics: wM, grammar: wW, memory: wA } = scoringConfig.weightings;
    const totalWeight = (wR || 1) + (wM || 1) + (wW || 1) + (wA || 1);

    return students.map((s) => {
      const scores = s.domainScores;
      // Count domains with score <= high threshold
      let flaggedCount = 0;
      if (scores.reading <= high) flaggedCount++;
      if (scores.math <= high) flaggedCount++;
      if (scores.writing <= high) flaggedCount++;
      if (scores.attention <= high) flaggedCount++;

      const weightedComposite = Math.round(
        (scores.reading * (wR || 1) +
          scores.math * (wM || 1) +
          scores.writing * (wW || 1) +
          scores.attention * (wA || 1)) /
          totalWeight
      );

      let risk: TriageStudentRecord["riskLevel"] = "Low";
      if (flaggedCount >= 2 || weightedComposite <= high) {
        risk = "High";
      } else if (flaggedCount >= 1 || weightedComposite <= moderate) {
        risk = "Moderate";
      } else if (weightedComposite < 75) {
        risk = "Mild";
      } else {
        risk = "Low";
      }

      return {
        ...s,
        flaggedDomainCount: flaggedCount,
        riskLevel: risk,
        compositeScore: weightedComposite,
      };
    });
  }, [students, scoringConfig]);

  // Derived filtered views — strictly computed from evaluatedStudents live array
  const flaggedStudents = evaluatedStudents.filter(
    (s) => (s.riskLevel === "High" || s.flaggedDomainCount >= 2) && !s.flagReviewed
  );

  const pendingReferrals = evaluatedStudents.filter(
    (s) => s.status === "Pending Specialist"
  );

  const completedReferrals = evaluatedStudents.filter(
    (s) => s.status === "Referred to Accommodations" || s.status === "Supported"
  );

  // Helper to log an activity item
  const logActivity = (
    student: TriageStudentRecord,
    action: ActivityLogItem["action"],
    description: string,
    badgeText?: string
  ) => {
    const newItem: ActivityLogItem = {
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: "Just now",
      studentId: student.id,
      studentName: student.name,
      action,
      description,
      badgeText,
    };
    setRecentActivity((prev) => [newItem, ...prev.slice(0, 4)]);
  };

  // Action: Record Referral
  const recordReferral = (
    studentId: string,
    options?: { notes?: string; specialistType?: string; priority?: string }
  ) => {
    let targetStudentName = "";
    const today = new Date().toISOString().split("T")[0];

    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        targetStudentName = s.name;

        const newNotes = [...s.referralNotes];
        if (options?.notes) {
          newNotes.unshift({
            id: `note-${Date.now()}`,
            date: today,
            author: mockSupportStaffProfile.name,
            category: "Referral Note",
            text: `${options.specialistType ? `[Referred to ${options.specialistType}] ` : ""}${options.notes}`,
          });
        } else {
          newNotes.unshift({
            id: `note-${Date.now()}`,
            date: today,
            author: mockSupportStaffProfile.name,
            category: "Referral Note",
            text: `Screening review completed. Intake referral initiated for specialist neurodiversity evaluation.`,
          });
        }

        return {
          ...s,
          status: "Pending Specialist",
          referralDate: today,
          referralNotes: newNotes,
        };
      })
    );

    const studentObj = students.find((s) => s.id === studentId);
    if (studentObj) {
      logActivity(
        studentObj,
        "referral_recorded",
        `Initiated referral to ${options?.specialistType || "DUT Specialist Intake"}`,
        "Pending Specialist"
      );
    }

    toast.success(
      `Referral recorded for ${targetStudentName || studentId}. Status is now Pending Specialist.`
    );
  };

  // Action: Update Referral Status (moves to terminal state e.g. "Referred to Accommodations")
  const updateReferralStatus = (
    studentId: string,
    newStatus: TriageStatus,
    options?: { notes?: string; accommodations?: string[] }
  ) => {
    let targetStudentName = "";
    const today = new Date().toISOString().split("T")[0];

    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        targetStudentName = s.name;

        const newNotes = [...s.referralNotes];
        if (options?.notes) {
          newNotes.unshift({
            id: `note-${Date.now()}`,
            date: today,
            author: mockSupportStaffProfile.name,
            category: "Accommodations Review",
            text: `[Status: ${newStatus}] ${options.notes}`,
          });
        }

        const mergedAccommodations = options?.accommodations
          ? Array.from(new Set([...(s.assignedAccommodations || []), ...options.accommodations]))
          : s.assignedAccommodations;

        return {
          ...s,
          status: newStatus,
          referralNotes: newNotes,
          assignedAccommodations: mergedAccommodations,
        };
      })
    );

    const studentObj = students.find((s) => s.id === studentId);
    if (studentObj) {
      logActivity(
        studentObj,
        "status_updated",
        `Referral status changed to ${newStatus}`,
        newStatus
      );
    }

    toast.success(`Referral status for ${targetStudentName || studentId} updated to ${newStatus}.`);
  };

  // Action: Mark Flag as Reviewed (resolves flag, immediately decrements 34 badge)
  const markFlagReviewed = (studentId: string, reviewNotes?: string) => {
    let targetStudentName = "";
    const today = new Date().toISOString().split("T")[0];

    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        targetStudentName = s.name;

        const newNotes = [...s.referralNotes];
        if (reviewNotes) {
          newNotes.unshift({
            id: `note-${Date.now()}`,
            date: today,
            author: mockSupportStaffProfile.name,
            category: "Clinical Observation",
            text: `[Flag Reviewed] ${reviewNotes}`,
          });
        }

        return {
          ...s,
          flagReviewed: true,
          referralNotes: newNotes,
        };
      })
    );

    const studentObj = students.find((s) => s.id === studentId);
    if (studentObj) {
      logActivity(
        studentObj,
        "flag_reviewed",
        "High-priority flag reviewed and marked as addressed",
        "Flag Resolved"
      );
    }

    toast.success(`Flag marked as reviewed for ${targetStudentName || studentId}. Case resolved.`);
  };

  // Action: Log Intervention Note
  const logInterventionNote = (
    studentId: string,
    noteText: string,
    category: InterventionNote["category"] = "Consultation"
  ) => {
    let targetStudentName = "";
    const today = new Date().toISOString().split("T")[0];

    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        targetStudentName = s.name;

        const newNotes = [
          {
            id: `note-${Date.now()}`,
            date: today,
            author: mockSupportStaffProfile.name,
            category,
            text: noteText,
          },
          ...s.referralNotes,
        ];

        return {
          ...s,
          referralNotes: newNotes,
        };
      })
    );

    const studentObj = students.find((s) => s.id === studentId);
    if (studentObj) {
      logActivity(
        studentObj,
        "note_logged",
        `Intervention note added (${category}): "${noteText.slice(0, 45)}..."`,
        category
      );
    }

    toast.success(`Intervention note logged for ${targetStudentName || studentId}.`);
  };

  // Reset to default baseline
  const resetTriageData = () => {
    const fresh = generateMockStudents();
    setStudents(fresh);
    setRecentActivity(INITIAL_RECENT_ACTIVITY);
    try {
      localStorage.removeItem(`${STORAGE_KEY}_students`);
      sessionStorage.removeItem(`${STORAGE_KEY}_activity`);
    } catch (e) {
      console.error(e);
    }
    toast.success("Triage dataset reset to default baseline (128 Screened, 34 Flagged, 12 Pending)");
  };

  return (
    <SupportContext.Provider
      value={{
        activeTab,
        setActiveTab,
        staffProfile: mockSupportStaffProfile,
        students: evaluatedStudents,
        flaggedStudents,
        pendingReferrals,
        completedReferrals,
        recentActivity,
        recordReferral,
        updateReferralStatus,
        markFlagReviewed,
        logInterventionNote,
        resetTriageData,
        activeStudentForBreakdown,
        setActiveStudentForBreakdown,
        activeStudentForReferral,
        setActiveStudentForReferral,
        activeStudentForNote,
        setActiveStudentForNote,
        activeStudentForStatusUpdate,
        setActiveStudentForStatusUpdate,
      }}
    >
      {children}
    </SupportContext.Provider>
  );
}

export function useSupport() {
  const context = useContext(SupportContext);
  if (!context) {
    throw new Error("useSupport must be used within a SupportProvider");
  }
  return context;
}
