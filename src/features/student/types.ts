export type DomainId = "reading" | "math" | "writing" | "attention";

export type ScreeningLevel = "typical" | "mild" | "moderate" | "needs-attention";

export interface StudentProfile {
  name: string;
  studentId: string;
  email: string;
  faculty: string;
  program: string;
  year: string;
  campus: string;
  phone?: string;
}

export interface QuestionOption {
  value: number;
  label: string;
  description?: string;
}

export interface AssessmentQuestion {
  id: string;
  domain: DomainId;
  prompt: string;
  context: string;
  type: "frequency-scale" | "impact-scale" | "timed-cognitive-check";
  timedChallenge?: {
    instruction: string;
    sampleText?: string;
    options: { id: string; text: string; isCorrect: boolean }[];
    timeLimitSeconds?: number;
  };
}

export interface AssessmentModule {
  id: string;
  domain: DomainId;
  title: string;
  shortName: string;
  focusArea: string;
  description: string;
  estimatedMinutes: number;
  questions: AssessmentQuestion[];
  badgeColor: string;
}

export interface DomainResult {
  domain: DomainId;
  domainTitle: string;
  score: number; // 0 to 100 percentage
  rawScore: number;
  maxScore: number;
  level: ScreeningLevel;
  levelLabel: string;
  color: string;
  summary: string;
  primaryStrengths: string[];
  challengeAreas: string[];
  recommendedAccommodations: string[];
  suggestedExercises: string[];
}

export interface ScreeningSessionRecord {
  id: string;
  completedAt: string;
  moduleId: string | "all-comprehensive";
  moduleTitle: string;
  answers: Record<string, number>;
  domainResults: Record<DomainId, DomainResult>;
  overallIndex: number;
  primaryConcernDomain?: DomainId | undefined;
}

export type ExerciseInteractiveType =
  | "tts-reader"
  | "pomodoro"
  | "word-drill"
  | "math-patterns"
  | "peel-essay";

export interface RecommendedExerciseItem {
  id: string;
  title: string;
  domain: DomainId;
  category: string;
  schedule: string;
  durationMinutes: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  interactiveType: ExerciseInteractiveType;
  description: string;
  objectives: string[];
  steps: string[];
  completedCount: number;
  lastCompletedAt?: string | undefined;
}

export interface ConsultationBooking {
  id: string;
  referenceNumber: string;
  consultationType:
    | "screening-review"
    | "formal-referral"
    | "exam-accommodations"
    | "assistive-tech"
    | "counseling";
  consultationTypeLabel: string;
  campus: string;
  specialistName: string;
  specialistTitle: string;
  date: string;
  timeSlot: string;
  studentNotes: string;
  status: "scheduled" | "confirmed" | "completed" | "cancelled";
  requestedAccommodations: string[];
  createdAt: string;
}

export interface AccessibilitySettings {
  dyslexiaFont: boolean;
  highContrast: boolean;
  fontSize: "sm" | "base" | "lg" | "xl";
  letterSpacing: "normal" | "wide" | "wider";
  lineSpacing: "normal" | "relaxed" | "loose";
  scotopicTint: "none" | "amber" | "mint" | "sky" | "rose" | "sepia";
  soundEffects: boolean;
  bionicReading: boolean;
}

export type QuizQuestionType =
  | "multiple-choice"
  | "stroop-test"
  | "reading-passage"
  | "sequence"
  | "syntax-spotter";

export interface QuizQuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface QuizQuestion {
  id: string;
  type: QuizQuestionType;
  prompt: string;
  passage?: string;
  stroopWord?: {
    word: string;
    displayColor: string;
    colorClass: string;
    correctColorName: string;
  };
  options: QuizQuestionOption[];
  hint?: string;
  skillTested: string;
}

export interface Quiz {
  id: string;
  title: string;
  domain: DomainId | string;
  category: string;
  durationMinutes: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  badgeColor: string;
  questions: QuizQuestion[];
  passingScore?: number;
  isCustom?: boolean;
  createdAt?: string;
  author?: string;
}

export interface QuizAttemptRecord {
  id: string;
  quizId: string;
  quizTitle: string;
  domain: DomainId;
  scorePercent: number;
  correctCount: number;
  totalQuestions: number;
  timeSpentSeconds: number;
  completedAt: string;
  answers: Record<string, string>; // questionId -> optionId
}

