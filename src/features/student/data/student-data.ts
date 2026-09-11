import type {
  StudentProfile,
  RecommendedExerciseItem,
  ConsultationBooking,
  AccessibilitySettings,
  ScreeningSessionRecord,
} from "../types";
import { compileScreeningSession } from "../lib/screeningClassifier";

export const DEFAULT_STUDENT_PROFILE: StudentProfile = {
  name: "Alex Ndlovu",
  studentId: "220194821",
  email: "alex.ndlovu@dut4life.ac.za",
  faculty: "Faculty of Accounting & Informatics",
  program: "Bachelor of Information and Communications Technology",
  year: "2nd Year",
  campus: "ML Sultan Campus (Durban)",
  phone: "+27 82 491 8203",
};

// Realistic baseline answers to populate the initial screening state
export const DEFAULT_BASELINE_ANSWERS: Record<string, number> = {
  // Reading (moderate difficulty: 60%)
  "read-q1": 2,
  "read-q2": 2,
  "read-q3": 2,
  "read-q4": 1,
  "read-q5": 2,
  // Math (needs attention: 73%)
  "math-q1": 3,
  "math-q2": 2,
  "math-q3": 2,
  "math-q4": 2,
  "math-q5": 2,
  // Writing (mild difficulty: 40%)
  "write-q1": 2,
  "write-q2": 1,
  "write-q3": 1,
  "write-q4": 1,
  "write-q5": 1,
  // Attention (typical range: 20%)
  "att-q1": 1,
  "att-q2": 1,
  "att-q3": 1,
  "att-q4": 0,
  "att-q5": 0,
};

export const DEFAULT_BASELINE_SESSION: ScreeningSessionRecord = compileScreeningSession(
  DEFAULT_BASELINE_ANSWERS,
  "all-comprehensive"
);

export const DEFAULT_EXERCISES: RecommendedExerciseItem[] = [
  {
    id: "ex-tts-reader",
    title: "Guided Academic Text Reader & TTS Assistant",
    domain: "reading",
    category: "Assistive Tool & Reading",
    schedule: "Daily 15 minutes before lecture prep",
    durationMinutes: 15,
    difficulty: "Beginner",
    interactiveType: "tts-reader",
    description:
      "Synthesizes academic texts into natural speech with synchronized bionic highlighting, custom dyslexic typography, and scotopic color overlays.",
    objectives: [
      "Mitigate visual line skipping and saccadic tracking fatigue",
      "Reinforce text comprehension through dual visual-auditory channels",
      "Enable custom pacing of complex academic papers",
    ],
    steps: [
      "Select an academic article from the library or paste your own coursework notes",
      "Adjust playback speed (0.85x - 1.25x) and select your preferred speech voice",
      "Toggle dyslexic font or colored contrast overlay for maximum comfort",
      "Read along with synchronized word-highlighting",
    ],
    completedCount: 6,
    lastCompletedAt: "2026-09-10T14:30:00Z",
  },
  {
    id: "ex-pomodoro-timer",
    title: "Interval Focus & Ambient White Noise Sprint",
    domain: "attention",
    category: "Executive Strategy",
    schedule: "Daily during self-study blocks",
    durationMinutes: 25,
    difficulty: "Beginner",
    interactiveType: "pomodoro",
    description:
      "Structured 25-minute study sprints coupled with synthetic audio frequency masking (Brown Noise, Theta Waves) to bypass executive paralysis.",
    objectives: [
      "Overcome task initiation barriers through micro-commitment",
      "Mask distracting ambient background noise in library/dorm environments",
      "Track study streaks and task milestone completion",
    ],
    steps: [
      "Enter 1 to 3 specific sub-tasks to complete during this block",
      "Select your background soundscape (Deep Brown Noise or Theta Waves)",
      "Engage the 25-minute sprint timer and focus solely on the active task",
      "Take an intentional 5-minute cognitive rest when the chime sounds",
    ],
    completedCount: 9,
    lastCompletedAt: "2026-09-11T10:15:00Z",
  },
  {
    id: "ex-peel-essay",
    title: "PEEL Academic Paragraph & Thesis Builder",
    domain: "writing",
    category: "Written Expression",
    schedule: "Twice weekly during assignment drafting",
    durationMinutes: 20,
    difficulty: "Intermediate",
    interactiveType: "peel-essay",
    description:
      "Scaffolds complex thoughts into structured academic paragraphs following Point, Evidence, Explanation, and Link methodology.",
    objectives: [
      "Overcome blank-page anxiety and idea organization obstacles",
      "Ensure balanced integration of academic citations and critical analysis",
      "Export structured drafts directly to clipboard or markdown",
    ],
    steps: [
      "Define the central Point / topic claim of your paragraph",
      "Input key supporting Evidence or research citation",
      "Articulate your deep Explanation and contextual relevance",
      "Craft the conclusive Link back to your primary research question",
      "Review and export your unified paragraph",
    ],
    completedCount: 3,
    lastCompletedAt: "2026-09-08T16:45:00Z",
  },
  {
    id: "ex-math-patterns",
    title: "Spatial Equations & Number Sense Trainer",
    domain: "math",
    category: "Quantitative Reasoning",
    schedule: "3 times per week, 15 minutes",
    durationMinutes: 15,
    difficulty: "Intermediate",
    interactiveType: "math-patterns",
    description:
      "Interactive number pattern extrapolation and visual-spatial arithmetic drills designed to reinforce numerical sequencing and reduce digit reversal.",
    objectives: [
      "Reinforce rapid numerical pattern identification",
      "Reduce arithmetic anxiety through non-timed visual feedback",
      "Strengthen working memory for multi-step numeric sequences",
    ],
    steps: [
      "Analyze the spatial number pattern and visual grid relationship",
      "Identify the governing algorithmic rule (arithmetic, geometric, or spatial)",
      "Select or input the missing value to receive instant step-by-step logic",
    ],
    completedCount: 5,
    lastCompletedAt: "2026-09-09T11:20:00Z",
  },
  {
    id: "ex-word-drill",
    title: "Rapid Phonological & Technical Vocabulary Drill",
    domain: "reading",
    category: "Lexical Processing",
    schedule: "Twice per week, 10 minutes",
    durationMinutes: 10,
    difficulty: "Beginner",
    interactiveType: "word-drill",
    description:
      "Speed flashcard drill designed to build sight-word recognition of complex academic terms, ICT nomenclature, and multisyllabic vocabulary.",
    objectives: [
      "Build rapid automatic naming speed for scientific terminology",
      "Reduce visual substitution errors in ICT coursework",
      "Practice phonetic syllable chunking",
    ],
    steps: [
      "Review the flashing technical term under timed presentation",
      "Identify the correct phonetic breakdown or definition",
      "Track your recognition speed latency and accuracy rate",
    ],
    completedCount: 4,
    lastCompletedAt: "2026-09-07T09:00:00Z",
  },
];

export const DEFAULT_BOOKED_CONSULTATIONS: ConsultationBooking[] = [
  {
    id: "bk-2026-001",
    referenceNumber: "DUT-DIS-2026-8942",
    consultationType: "screening-review",
    consultationTypeLabel: "Screening Indicator Review & Intake Consultation",
    campus: "ML Sultan Campus — Disability Care Centre",
    specialistName: "Dr. N. Dube",
    specialistTitle: "Senior Educational Psychologist & Disability Specialist",
    date: "2026-09-18",
    timeSlot: "10:30 AM - 11:15 AM",
    studentNotes:
      "Screening indicators show moderate reading fatigue and math transposition difficulties during ICT exams. Requesting review for semester 2 exam extra-time accommodation.",
    status: "confirmed",
    requestedAccommodations: [
      "15 min/hr Exam Extra Time",
      "Disability Monitored PC for Essay Tests",
      "Lecture Audio Recording Permission",
    ],
    createdAt: "2026-09-10T08:15:00Z",
  },
];

export const DEFAULT_ACCESSIBILITY_SETTINGS: AccessibilitySettings = {
  dyslexiaFont: false,
  highContrast: false,
  fontSize: "base",
  letterSpacing: "normal",
  lineSpacing: "normal",
  scotopicTint: "none",
  soundEffects: true,
  bionicReading: false,
};
