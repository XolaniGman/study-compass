import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouterState, useNavigate } from "@tanstack/react-router";
import type {
  StudentProfile,
  ScreeningSessionRecord,
  RecommendedExerciseItem,
  ConsultationBooking,
  AccessibilitySettings,
  DomainId,
  Quiz,
  QuizAttemptRecord,
} from "../types";
import {
  DEFAULT_STUDENT_PROFILE,
  DEFAULT_BASELINE_SESSION,
  DEFAULT_EXERCISES,
  DEFAULT_BOOKED_CONSULTATIONS,
  DEFAULT_ACCESSIBILITY_SETTINGS,
} from "../data/student-data";
import { STUDENT_QUIZZES, DEFAULT_QUIZ_ATTEMPTS } from "../data/quiz-data";
import { getAllQuizzes } from "../../admin/lib/quizStorage";
import { compileScreeningSession } from "../lib/screeningClassifier";
import { useInstitutional } from "../../shared";

interface StudentContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  profile: StudentProfile;
  updateProfile: (updated: Partial<StudentProfile>) => void;
  latestSession: ScreeningSessionRecord;
  sessionsHistory: ScreeningSessionRecord[];
  submitAssessment: (answers: Record<string, number>, moduleId: string | "all-comprehensive") => ScreeningSessionRecord;
  exercises: RecommendedExerciseItem[];
  recordExerciseCompletion: (exerciseId: string) => void;
  consultations: ConsultationBooking[];
  bookConsultation: (booking: Omit<ConsultationBooking, "id" | "referenceNumber" | "createdAt" | "status">) => ConsultationBooking;
  cancelConsultation: (bookingId: string) => void;
  accessibility: AccessibilitySettings;
  updateAccessibility: (updated: Partial<AccessibilitySettings>) => void;
  // Quizzes
  quizzes: Quiz[];
  quizAttempts: QuizAttemptRecord[];
  submitQuizAttempt: (attempt: Omit<QuizAttemptRecord, "id" | "completedAt">) => QuizAttemptRecord;
  activeQuiz: Quiz | null;
  setActiveQuiz: (quiz: Quiz | null) => void;
  // Modals
  activeExercise: RecommendedExerciseItem | null;
  setActiveExercise: (exercise: RecommendedExerciseItem | null) => void;
  isAssessmentModalOpen: boolean;
  setIsAssessmentModalOpen: (open: boolean) => void;
  activeAssessmentModuleId: string | "all-comprehensive";
  setActiveAssessmentModuleId: (id: string | "all-comprehensive") => void;
  isConsultationModalOpen: boolean;
  setIsConsultationModalOpen: (open: boolean) => void;
  isReportModalOpen: boolean;
  setIsReportModalOpen: (open: boolean) => void;
  resetAllToDefault: () => void;
}

const STORAGE_KEY = "study_compass_student_state_v3";

const StudentContext = createContext<StudentContextType | null>(null);

export function StudentProvider({ children }: { children: React.ReactNode }) {
  const routerState = useRouterState();
  const navigate = useNavigate();

  // Read activeTab directly from TanStack Router reactive search state
  const currentSearch = (routerState.location.search || {}) as Record<string, string | undefined>;
  const activeTab = currentSearch["tab"] || "overview";

  const setActiveTab = (tab: string) => {
    navigate({
      to: "/student",
      search: (prev: any) => ({
        ...(prev || {}),
        tab,
      }),
    });
  };

  const [profile, setProfile] = useState<StudentProfile>(() => {
    if (typeof window === "undefined") return DEFAULT_STUDENT_PROFILE;
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_profile`);
      return saved ? JSON.parse(saved) : DEFAULT_STUDENT_PROFILE;
    } catch {
      return DEFAULT_STUDENT_PROFILE;
    }
  });

  const [latestSession, setLatestSession] = useState<ScreeningSessionRecord>(() => {
    if (typeof window === "undefined") return DEFAULT_BASELINE_SESSION;
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_latest_session`);
      return saved ? JSON.parse(saved) : DEFAULT_BASELINE_SESSION;
    } catch {
      return DEFAULT_BASELINE_SESSION;
    }
  });

  const [sessionsHistory, setSessionsHistory] = useState<ScreeningSessionRecord[]>(() => {
    if (typeof window === "undefined") return [DEFAULT_BASELINE_SESSION];
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_history`);
      return saved ? JSON.parse(saved) : [DEFAULT_BASELINE_SESSION];
    } catch {
      return [DEFAULT_BASELINE_SESSION];
    }
  });

  const institutional = useInstitutional();

  const [exerciseProgress, setExerciseProgress] = useState<
    Record<string, { completedCount: number; lastCompletedAt?: string | undefined }>
  >(() => {
    if (typeof window === "undefined") return {};
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_exercise_progress`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Shared active exercises filtered by !archived, merged with student progress
  const sharedActiveExercises: RecommendedExerciseItem[] = React.useMemo(() => {
    const baseList =
      institutional?.exercises && institutional.exercises.length > 0
        ? institutional.exercises.filter((e) => !e.archived)
        : DEFAULT_EXERCISES;

    return baseList.map((e) => {
      const progress = exerciseProgress[e.id];
      const completedCount = progress ? progress.completedCount : (e.completedCount || 0);
      const lastCompletedAt = progress?.lastCompletedAt ?? e.lastCompletedAt ?? undefined;

      return {
        id: e.id,
        title: e.title,
        domain: (e.domain as DomainId) || "reading",
        category: e.category,
        schedule: e.schedule || "Daily self-paced routine",
        durationMinutes: e.durationMinutes,
        difficulty: e.difficulty,
        interactiveType: (e.interactiveType as any) || "tts-reader",
        description: e.description,
        objectives: e.objectives || [],
        steps: e.steps || ["Review instructions", "Complete interactive drill"],
        completedCount,
        lastCompletedAt,
      };
    });
  }, [institutional?.exercises, exerciseProgress]);

  const [consultations, setConsultations] = useState<ConsultationBooking[]>(() => {
    if (typeof window === "undefined") return DEFAULT_BOOKED_CONSULTATIONS;
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_consultations`);
      return saved ? JSON.parse(saved) : DEFAULT_BOOKED_CONSULTATIONS;
    } catch {
      return DEFAULT_BOOKED_CONSULTATIONS;
    }
  });

  const [accessibility, setAccessibility] = useState<AccessibilitySettings>(() => {
    if (typeof window === "undefined") return DEFAULT_ACCESSIBILITY_SETTINGS;
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_accessibility`);
      return saved ? JSON.parse(saved) : DEFAULT_ACCESSIBILITY_SETTINGS;
    } catch {
      return DEFAULT_ACCESSIBILITY_SETTINGS;
    }
  });

  const [quizzes, setQuizzes] = useState<Quiz[]>(() => getAllQuizzes());

  useEffect(() => {
    const handleQuizzesUpdated = () => {
      setQuizzes(getAllQuizzes());
    };
    window.addEventListener("quizzes-updated", handleQuizzesUpdated);
    return () => window.removeEventListener("quizzes-updated", handleQuizzesUpdated);
  }, []);

  const [quizAttempts, setQuizAttempts] = useState<QuizAttemptRecord[]>(() => {
    if (typeof window === "undefined") return DEFAULT_QUIZ_ATTEMPTS;
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_quiz_attempts`);
      return saved ? JSON.parse(saved) : DEFAULT_QUIZ_ATTEMPTS;
    } catch {
      return DEFAULT_QUIZ_ATTEMPTS;
    }
  });

  // Active UI modal states
  const [activeQuiz, setActiveQuizState] = useState<Quiz | null>(null);

  useEffect(() => {
    const quizId = currentSearch?.["quizId"];
    if (quizId && !activeQuiz) {
      const target = quizzes.find((q) => q.id === quizId);
      if (target) {
        setActiveQuizState(target);
      }
    }
  }, [currentSearch?.["quizId"], quizzes]);

  const setActiveQuiz = (quiz: Quiz | null) => {
    setActiveQuizState(quiz);
    if (!quiz && currentSearch?.["quizId"]) {
      navigate({
        to: "/student",
        search: (prev: any) => {
          const next = { ...(prev || {}) };
          delete next.quizId;
          return next;
        },
      });
    }
  };

  const [activeExercise, setActiveExercise] = useState<RecommendedExerciseItem | null>(null);
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [activeAssessmentModuleId, setActiveAssessmentModuleId] = useState<string | "all-comprehensive">("all-comprehensive");
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_profile`, JSON.stringify(profile));
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("student-profile-updated"));
      }
    } catch (e) {
      console.error(e);
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_latest_session`, JSON.stringify(latestSession));
    } catch (e) {
      console.error(e);
    }
  }, [latestSession]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_history`, JSON.stringify(sessionsHistory));
    } catch (e) {
      console.error(e);
    }
  }, [sessionsHistory]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_consultations`, JSON.stringify(consultations));
    } catch (e) {
      console.error(e);
    }
  }, [consultations]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_exercise_progress`, JSON.stringify(exerciseProgress));
    } catch (e) {
      console.error(e);
    }
  }, [exerciseProgress]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_accessibility`, JSON.stringify(accessibility));
    } catch (e) {
      console.error(e);
    }
  }, [accessibility]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_quiz_attempts`, JSON.stringify(quizAttempts));
    } catch (e) {
      console.error(e);
    }
  }, [quizAttempts]);

  const updateProfile = (updated: Partial<StudentProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
    toast.success("Student profile updated successfully");
  };

  const submitAssessment = (
    answers: Record<string, number>,
    moduleId: string | "all-comprehensive"
  ): ScreeningSessionRecord => {
    const mergedAnswers = {
      ...latestSession.answers,
      ...answers,
    };
    const newSession = compileScreeningSession(mergedAnswers, moduleId, institutional?.scoringConfig);
    setLatestSession(newSession);
    setSessionsHistory((prev) => [newSession, ...prev]);
    toast.success("Screening assessment evaluated! New indicators generated.");
    return newSession;
  };

  const recordExerciseCompletion = (exerciseId: string) => {
    setExerciseProgress((prev) => {
      const current = prev[exerciseId] || { completedCount: 0 };
      return {
        ...prev,
        [exerciseId]: {
          completedCount: current.completedCount + 1,
          lastCompletedAt: new Date().toISOString(),
        },
      };
    });
    toast.success("Exercise milestone recorded! Great work on your study routine.");
  };

  const submitQuizAttempt = (
    attemptData: Omit<QuizAttemptRecord, "id" | "completedAt">
  ): QuizAttemptRecord => {
    const newRecord: QuizAttemptRecord = {
      ...attemptData,
      id: `att-${Date.now()}`,
      completedAt: new Date().toISOString(),
    };
    setQuizAttempts((prev) => [newRecord, ...prev]);
    toast.success(`Quiz completed! Score: ${newRecord.scorePercent}%`);
    return newRecord;
  };

  const bookConsultation = (
    bookingData: Omit<ConsultationBooking, "id" | "referenceNumber" | "createdAt" | "status">
  ): ConsultationBooking => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newBooking: ConsultationBooking = {
      ...bookingData,
      id: `bk-${Date.now()}`,
      referenceNumber: `DUT-DIS-2026-${randomNum}`,
      createdAt: new Date().toISOString(),
      status: "confirmed",
    };
    setConsultations((prev) => [newBooking, ...prev]);
    toast.success(`Consultation confirmed! Ref: ${newBooking.referenceNumber}`);
    return newBooking;
  };

  const cancelConsultation = (bookingId: string) => {
    setConsultations((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: "cancelled" } : b))
    );
    toast.info("Consultation booking cancelled");
  };

  const updateAccessibility = (updated: Partial<AccessibilitySettings>) => {
    setAccessibility((prev) => ({ ...prev, ...updated }));
  };

  const resetAllToDefault = () => {
    setProfile(DEFAULT_STUDENT_PROFILE);
    setLatestSession(DEFAULT_BASELINE_SESSION);
    setSessionsHistory([DEFAULT_BASELINE_SESSION]);
    setExerciseProgress({});
    setConsultations(DEFAULT_BOOKED_CONSULTATIONS);
    setAccessibility(DEFAULT_ACCESSIBILITY_SETTINGS);
    setQuizAttempts(DEFAULT_QUIZ_ATTEMPTS);
    toast.success("Reset student data to DUT baseline demo configuration");
  };

  return (
    <StudentContext.Provider
      value={{
        activeTab,
        setActiveTab,
        profile,
        updateProfile,
        latestSession,
        sessionsHistory,
        submitAssessment,
        exercises: sharedActiveExercises,
        recordExerciseCompletion,
        consultations,
        bookConsultation,
        cancelConsultation,
        accessibility,
        updateAccessibility,
        quizzes,
        quizAttempts,
        submitQuizAttempt,
        activeQuiz,
        setActiveQuiz,
        activeExercise,
        setActiveExercise,
        isAssessmentModalOpen,
        setIsAssessmentModalOpen,
        activeAssessmentModuleId,
        setActiveAssessmentModuleId,
        isConsultationModalOpen,
        setIsConsultationModalOpen,
        isReportModalOpen,
        setIsReportModalOpen,
        resetAllToDefault,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}

export function useStudent() {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error("useStudent must be used within a StudentProvider");
  }
  return context;
}
