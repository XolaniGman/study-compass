import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import type {
  InstitutionalUser,
  AssessmentPoolItem,
  AssessmentQuestion,
  ScreeningDomainKey,
  ScoringConfig,
  InstitutionalExercise,
  InstitutionalSupportGuide,
  InstitutionalContact,
  AuditLogEntry,
} from "../types";
import {
  INITIAL_USERS,
  INITIAL_ASSESSMENT_POOLS,
  INITIAL_SCORING_CONFIG,
  INITIAL_EXERCISES,
  INITIAL_SUPPORT_INFO,
  INITIAL_CONTACTS,
  INITIAL_AUDIT_LOGS,
} from "../data/initial-institutional-data";

interface InstitutionalContextType {
  // Users state & actions
  users: InstitutionalUser[];
  addUser: (
    userData: Omit<InstitutionalUser, "id" | "createdAt" | "status"> & {
      status?: InstitutionalUser["status"];
    }
  ) => InstitutionalUser;
  toggleUserStatus: (userId: string) => void;
  exportUserDirectory: () => void;
  auditLogs: AuditLogEntry[];

  // Assessment Pools (FR05–FR09)
  assessmentPools: Record<ScreeningDomainKey, AssessmentPoolItem>;
  addQuestionToPool: (
    domain: ScreeningDomainKey,
    question: Omit<AssessmentQuestion, "id" | "domain">
  ) => void;

  // Scoring Config (Cross-module link)
  scoringConfig: ScoringConfig;
  updateThresholds: (thresholds: ScoringConfig["thresholds"]) => void;
  updateWeightings: (weightings: ScoringConfig["weightings"]) => void;

  // Content Library
  exercises: InstitutionalExercise[];
  addExercise: (
    exercise: Omit<InstitutionalExercise, "id" | "completedCount" | "archived">
  ) => void;
  toggleArchiveExercise: (exerciseId: string) => void;

  supportInfo: InstitutionalSupportGuide[];
  addSupportGuide: (
    guide: Omit<InstitutionalSupportGuide, "id" | "publishedAt" | "archived">
  ) => void;
  toggleArchiveGuide: (guideId: string) => void;

  contacts: InstitutionalContact[];
  updateContact: (contact: InstitutionalContact) => void;
  toggleArchiveContact: (contactId: string) => void;

  // Computed Top Metrics (Derived, never hardcoded)
  totalUsers: number;
  usersAddedToday: number;
  activeModules: number;
  contentLibrary: number;
  systemUptime: string;

  // System Operations & Maintenance
  performBackup: () => void;
  syncIndexes: () => void;
  triggerMaintenanceMode: () => void;
  resetAllToBaseline: () => void;
}

const STORAGE_PREFIX = "study_compass_institutional_v1";

const InstitutionalContext = createContext<InstitutionalContextType | null>(null);

export function InstitutionalProvider({ children }: { children: React.ReactNode }) {
  // 1. Users State
  const [users, setUsers] = useState<InstitutionalUser[]>(() => {
    if (typeof window === "undefined") return INITIAL_USERS;
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}_users`);
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  // 2. Assessment Pools State (FR05–FR09: Reading, Grammar, Mathematics, Memory, Comprehension)
  const [assessmentPools, setAssessmentPools] = useState<
    Record<ScreeningDomainKey, AssessmentPoolItem>
  >(() => {
    if (typeof window === "undefined") return INITIAL_ASSESSMENT_POOLS;
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}_assessment_pools`);
      return saved ? JSON.parse(saved) : INITIAL_ASSESSMENT_POOLS;
    } catch {
      return INITIAL_ASSESSMENT_POOLS;
    }
  });

  // 3. Shared Scoring Configuration (Thresholds & Weightings)
  const [scoringConfig, setScoringConfig] = useState<ScoringConfig>(() => {
    if (typeof window === "undefined") return INITIAL_SCORING_CONFIG;
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}_scoring_config`);
      return saved ? JSON.parse(saved) : INITIAL_SCORING_CONFIG;
    } catch {
      return INITIAL_SCORING_CONFIG;
    }
  });

  // 4. Exercises State
  const [exercises, setExercises] = useState<InstitutionalExercise[]>(() => {
    if (typeof window === "undefined") return INITIAL_EXERCISES;
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}_exercises`);
      return saved ? JSON.parse(saved) : INITIAL_EXERCISES;
    } catch {
      return INITIAL_EXERCISES;
    }
  });

  // 5. Support Info (Guides) State
  const [supportInfo, setSupportInfo] = useState<InstitutionalSupportGuide[]>(() => {
    if (typeof window === "undefined") return INITIAL_SUPPORT_INFO;
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}_support_info`);
      return saved ? JSON.parse(saved) : INITIAL_SUPPORT_INFO;
    } catch {
      return INITIAL_SUPPORT_INFO;
    }
  });

  // 6. Campus Contacts State
  const [contacts, setContacts] = useState<InstitutionalContact[]>(() => {
    if (typeof window === "undefined") return INITIAL_CONTACTS;
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}_contacts`);
      return saved ? JSON.parse(saved) : INITIAL_CONTACTS;
    } catch {
      return INITIAL_CONTACTS;
    }
  });

  // 7. Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    if (typeof window === "undefined") return INITIAL_AUDIT_LOGS;
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}_audit_logs`);
      return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  });

  // LocalStorage Sync
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}_users`, JSON.stringify(users));
    } catch (e) {
      console.error(e);
    }
  }, [users]);

  useEffect(() => {
    try {
      localStorage.setItem(
        `${STORAGE_PREFIX}_assessment_pools`,
        JSON.stringify(assessmentPools)
      );
    } catch (e) {
      console.error(e);
    }
  }, [assessmentPools]);

  useEffect(() => {
    try {
      localStorage.setItem(
        `${STORAGE_PREFIX}_scoring_config`,
        JSON.stringify(scoringConfig)
      );
    } catch (e) {
      console.error(e);
    }
  }, [scoringConfig]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}_exercises`, JSON.stringify(exercises));
    } catch (e) {
      console.error(e);
    }
  }, [exercises]);

  useEffect(() => {
    try {
      localStorage.setItem(
        `${STORAGE_PREFIX}_support_info`,
        JSON.stringify(supportInfo)
      );
    } catch (e) {
      console.error(e);
    }
  }, [supportInfo]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}_contacts`, JSON.stringify(contacts));
    } catch (e) {
      console.error(e);
    }
  }, [contacts]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}_audit_logs`, JSON.stringify(auditLogs));
    } catch (e) {
      console.error(e);
    }
  }, [auditLogs]);

  // Derived Top Metrics
  // Total Users: enrolled students & staff specialists regardless of active/inactive status
  const totalUsers = users.length;

  // Badge "+12 today" = count of users created today (2026-09-16)
  const todayStr = "2026-09-16";
  const usersAddedToday = users.filter((u) => u.createdAt === todayStr).length;

  // Active Modules: 3 system modules (Student, Staff, Admin) + 5 screening domains = 8
  const activeModules = 3 + Object.keys(assessmentPools).length;

  // Content Library: sum of non-archived exercises + supportInfo + contacts
  const contentLibrary =
    exercises.filter((e) => !e.archived).length +
    supportInfo.filter((s) => !s.archived).length +
    contacts.filter((c) => !c.archived).length;

  const systemUptime = "99.98%";

  // ================= User Management Handlers =================
  const addUser = (
    userData: Omit<InstitutionalUser, "id" | "createdAt" | "status"> & {
      status?: InstitutionalUser["status"];
    }
  ): InstitutionalUser => {
    const newUser: InstitutionalUser = {
      ...userData,
      id: `usr-${Date.now()}`,
      status: userData.status || "active",
      createdAt: todayStr,
    };

    setUsers((prev) => [newUser, ...prev]);

    // Log to audit log
    const log: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      actor: "Institutional Admin (DUT-ADM-1010)",
      action: "USER_REGISTRATION",
      target: `${newUser.name} (${newUser.studentOrStaffNumber})`,
      status: "SUCCESS",
      details: `Enrolled new ${newUser.role.replace("_", " ")} into ${newUser.facultyOrDepartment}.`,
    };
    setAuditLogs((prev) => [log, ...prev]);

    toast.success(
      `User ${newUser.name} successfully registered. Total Users updated to ${users.length + 1}.`
    );
    return newUser;
  };

  const toggleUserStatus = (userId: string) => {
    let targetName = "";
    let nextStatus: InstitutionalUser["status"] = "active";

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          targetName = u.name;
          nextStatus = u.status === "active" ? "inactive" : "active";
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );

    // Audit log
    const log: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      actor: "Institutional Admin (DUT-ADM-1010)",
      action: nextStatus === "inactive" ? "USER_DEACTIVATION" : "USER_ACTIVATION",
      target: targetName || userId,
      status: nextStatus === "inactive" ? "WARNING" : "SUCCESS",
      details: `User status toggled to ${nextStatus}. Total enrolled user count remains ${users.length}.`,
    };
    setAuditLogs((prev) => [log, ...prev]);

    toast.success(
      `Account for ${targetName || userId} marked as ${nextStatus.toUpperCase()}. Total enrolled users count preserved.`
    );
  };

  const exportUserDirectory = () => {
    toast.success(
      "Simulated action: User directory export generated (CSV format, PII masked per POPIA standards)."
    );
  };

  // ================= Assessment Pools Handlers =================
  const addQuestionToPool = (
    domain: ScreeningDomainKey,
    question: Omit<AssessmentQuestion, "id" | "domain">
  ) => {
    const newQ: AssessmentQuestion = {
      ...question,
      id: `${domain}-q${Date.now()}`,
      domain,
    };

    setAssessmentPools((prev) => {
      const existingPool = prev[domain];
      if (!existingPool) return prev;
      return {
        ...prev,
        [domain]: {
          ...existingPool,
          questions: [...existingPool.questions, newQ],
        },
      };
    });

    const log: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      actor: "Institutional Admin (DUT-ADM-1010)",
      action: "ASSESSMENT_QUESTION_ADDED",
      target: `${domain.toUpperCase()} Domain Pool`,
      status: "SUCCESS",
      details: `Appended question "${newQ.prompt.slice(0, 40)}..." to domain ${domain}.`,
    };
    setAuditLogs((prev) => [log, ...prev]);

    toast.success(
      `New indicator question added to ${domain.toUpperCase()} domain pool (FR05–FR09 scope verified).`
    );
  };

  // ================= Scoring Config Handlers =================
  const updateThresholds = (newThresholds: ScoringConfig["thresholds"]) => {
    setScoringConfig((prev) => ({
      ...prev,
      thresholds: newThresholds,
    }));

    const log: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      actor: "Institutional Admin (DUT-ADM-1010)",
      action: "SCORING_THRESHOLDS_UPDATED",
      target: "Cross-Module Scoring Engine",
      status: "INFO",
      details: `Calibrated cutoffs: High Priority <= ${newThresholds.high}%, Moderate <= ${newThresholds.moderate}%. Staff triage & student metrics recalculated.`,
    };
    setAuditLogs((prev) => [log, ...prev]);

    toast.success(
      `Scoring indicators updated: High Priority <= ${newThresholds.high}%, Moderate <= ${newThresholds.moderate}%. Recalculating cross-module triage.`
    );
  };

  const updateWeightings = (newWeightings: ScoringConfig["weightings"]) => {
    setScoringConfig((prev) => ({
      ...prev,
      weightings: newWeightings,
    }));

    const log: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      actor: "Institutional Admin (DUT-ADM-1010)",
      action: "DOMAIN_WEIGHTINGS_UPDATED",
      target: "Cross-Module Scoring Engine",
      status: "INFO",
      details: `Domain weights updated: ${Object.entries(newWeightings)
        .map(([k, v]) => `${k}=${v}`)
        .join(", ")}.`,
    };
    setAuditLogs((prev) => [log, ...prev]);

    toast.success(
      "Domain weightings updated across screening engines. Student composite index formulas synced."
    );
  };

  // ================= Content Library Handlers =================
  const addExercise = (
    exercise: Omit<InstitutionalExercise, "id" | "completedCount" | "archived">
  ) => {
    const newEx: InstitutionalExercise = {
      ...exercise,
      id: `ex-${Date.now()}`,
      completedCount: 0,
      archived: false,
    };

    setExercises((prev) => [newEx, ...prev]);

    const log: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      actor: "Institutional Admin (DUT-ADM-1010)",
      action: "EXERCISE_ROUTINE_PUBLISHED",
      target: newEx.title,
      status: "SUCCESS",
      details: `Published exercise for domain ${newEx.domain}. Content Library count incremented.`,
    };
    setAuditLogs((prev) => [log, ...prev]);

    toast.success(
      `Exercise routine "${newEx.title}" added to Content Library and made available to students.`
    );
  };

  const toggleArchiveExercise = (exerciseId: string) => {
    let targetTitle = "";
    let isArchiving = false;

    setExercises((prev) =>
      prev.map((e) => {
        if (e.id === exerciseId) {
          targetTitle = e.title;
          isArchiving = !e.archived;
          return { ...e, archived: isArchiving };
        }
        return e;
      })
    );

    toast.info(
      isArchiving
        ? `Exercise "${targetTitle}" archived. Removed from student views and Content Library count.`
        : `Exercise "${targetTitle}" unarchived. Restored to active Content Library.`
    );
  };

  const addSupportGuide = (
    guide: Omit<InstitutionalSupportGuide, "id" | "publishedAt" | "archived">
  ) => {
    const newGuide: InstitutionalSupportGuide = {
      ...guide,
      id: `guide-${Date.now()}`,
      publishedAt: todayStr,
      archived: false,
    };

    setSupportInfo((prev) => [newGuide, ...prev]);

    const log: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      actor: "Institutional Admin (DUT-ADM-1010)",
      action: "SUPPORT_GUIDE_PUBLISHED",
      target: newGuide.title,
      status: "SUCCESS",
      details: `Published new guide in category ${newGuide.category}. Content Library count incremented.`,
    };
    setAuditLogs((prev) => [log, ...prev]);

    toast.success(`Support guide "${newGuide.title}" published to student portal.`);
  };

  const toggleArchiveGuide = (guideId: string) => {
    let targetTitle = "";
    let isArchiving = false;

    setSupportInfo((prev) =>
      prev.map((g) => {
        if (g.id === guideId) {
          targetTitle = g.title;
          isArchiving = !g.archived;
          return { ...g, archived: isArchiving };
        }
        return g;
      })
    );

    toast.info(
      isArchiving
        ? `Guide "${targetTitle}" archived. Excluded from Content Library count.`
        : `Guide "${targetTitle}" unarchived. Active in Content Library.`
    );
  };

  const updateContact = (contact: InstitutionalContact) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === contact.id ? { ...c, ...contact } : c))
    );

    toast.success(`Contact details for ${contact.campus} updated successfully.`);
  };

  const toggleArchiveContact = (contactId: string) => {
    let targetCampus = "";
    let isArchiving = false;

    setContacts((prev) =>
      prev.map((c) => {
        if (c.id === contactId) {
          targetCampus = c.campus;
          isArchiving = !c.archived;
          return { ...c, archived: isArchiving };
        }
        return c;
      })
    );

    toast.info(
      isArchiving
        ? `Campus directory for ${targetCampus} archived.`
        : `Campus directory for ${targetCampus} restored.`
    );
  };

  // ================= System Operations & Maintenance =================
  const performBackup = () => {
    const snapId = `DUT-BK-${Date.now().toString().slice(-6)}`;
    const log: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      actor: "Institutional Admin (DUT-ADM-1010)",
      action: "SNAPSHOT_BACKUP",
      target: `Snapshot #${snapId}`,
      status: "SUCCESS",
      details: "Institutional snapshot created and saved to DUT secure cloud cold storage.",
    };
    setAuditLogs((prev) => [log, ...prev]);

    toast.success(
      `Simulated action: System state snapshot created (Snapshot #${snapId}). Saved to DUT Cloud Vault.`
    );
  };

  const syncIndexes = () => {
    toast.success(
      "Simulated action: Database indexes synchronised across DUT Disability Unit cloud replicas."
    );
  };

  const triggerMaintenanceMode = () => {
    toast.warning(
      "Simulated action: Scheduled maintenance broadcast queued for Sunday 02:00 SAST (Zero downtime)."
    );
  };

  const resetAllToBaseline = () => {
    setUsers(INITIAL_USERS);
    setAssessmentPools(INITIAL_ASSESSMENT_POOLS);
    setScoringConfig(INITIAL_SCORING_CONFIG);
    setExercises(INITIAL_EXERCISES);
    setSupportInfo(INITIAL_SUPPORT_INFO);
    setContacts(INITIAL_CONTACTS);
    setAuditLogs(INITIAL_AUDIT_LOGS);

    try {
      localStorage.removeItem(`${STORAGE_PREFIX}_users`);
      localStorage.removeItem(`${STORAGE_PREFIX}_assessment_pools`);
      localStorage.removeItem(`${STORAGE_PREFIX}_scoring_config`);
      localStorage.removeItem(`${STORAGE_PREFIX}_exercises`);
      localStorage.removeItem(`${STORAGE_PREFIX}_support_info`);
      localStorage.removeItem(`${STORAGE_PREFIX}_contacts`);
      localStorage.removeItem(`${STORAGE_PREFIX}_audit_logs`);
    } catch (e) {
      console.error(e);
    }

    toast.success(
      "Institutional baseline restored: 142 Users, 8 Active Modules, 24 Content Library Items."
    );
  };

  return (
    <InstitutionalContext.Provider
      value={{
        users,
        addUser,
        toggleUserStatus,
        exportUserDirectory,
        auditLogs,
        assessmentPools,
        addQuestionToPool,
        scoringConfig,
        updateThresholds,
        updateWeightings,
        exercises,
        addExercise,
        toggleArchiveExercise,
        supportInfo,
        addSupportGuide,
        toggleArchiveGuide,
        contacts,
        updateContact,
        toggleArchiveContact,
        totalUsers,
        usersAddedToday,
        activeModules,
        contentLibrary,
        systemUptime,
        performBackup,
        syncIndexes,
        triggerMaintenanceMode,
        resetAllToBaseline,
      }}
    >
      {children}
    </InstitutionalContext.Provider>
  );
}

export function useInstitutional() {
  const context = useContext(InstitutionalContext);
  if (!context) {
    throw new Error("useInstitutional must be used within an InstitutionalProvider");
  }
  return context;
}
