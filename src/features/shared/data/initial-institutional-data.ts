import type {
  InstitutionalUser,
  AssessmentPoolItem,
  ScreeningDomainKey,
  ScoringConfig,
  InstitutionalExercise,
  InstitutionalSupportGuide,
  InstitutionalContact,
  AuditLogEntry,
} from "../types";
import { generateMockStudents } from "../../support/data/mock-support-data";

// Generate 128 students matching the support triage dataset
const mockStudents = generateMockStudents();

const STUDENT_USERS: InstitutionalUser[] = mockStudents.map((s, idx) => {
  // Exactly 12 students created today (2026-09-16) for the "+12 today" dynamic badge
  const isCreatedToday = idx < 12;
  return {
    id: `usr-std-${s.id}`,
    name: s.name,
    email: s.email,
    role: "student",
    studentOrStaffNumber: s.id,
    facultyOrDepartment: s.faculty,
    status: "active",
    createdAt: isCreatedToday ? "2026-09-16" : s.screeningDate || "2026-09-01",
  };
});

// 10 Support Staff Specialists
const STAFF_USERS: InstitutionalUser[] = [
  {
    id: "usr-stf-001",
    name: "Dr. N. Dube",
    email: "n.dube@dut.ac.za",
    role: "support_specialist",
    studentOrStaffNumber: "DUT-EMP-4019",
    facultyOrDepartment: "Disability Unit — Lead Educational Psychologist",
    status: "active",
    createdAt: "2026-08-15",
  },
  {
    id: "usr-stf-002",
    name: "Lerato Sithole",
    email: "l.sithole@dut.ac.za",
    role: "support_specialist",
    studentOrStaffNumber: "DUT-EMP-4022",
    facultyOrDepartment: "Disability Care Centre — Assistive Technology Officer",
    status: "active",
    createdAt: "2026-08-18",
  },
  {
    id: "usr-stf-003",
    name: "Farzana Cassim",
    email: "f.cassim@dut.ac.za",
    role: "support_specialist",
    studentOrStaffNumber: "DUT-EMP-4055",
    facultyOrDepartment: "Student Counselling & Health Services",
    status: "active",
    createdAt: "2026-08-20",
  },
  {
    id: "usr-stf-004",
    name: "Pieter van Wyk",
    email: "p.vanwyk@dut.ac.za",
    role: "support_specialist",
    studentOrStaffNumber: "DUT-EMP-4081",
    facultyOrDepartment: "Academic Development & Concessions Board",
    status: "active",
    createdAt: "2026-08-25",
  },
  {
    id: "usr-stf-005",
    name: "Kavisha Naidoo",
    email: "k.naidoo@dut.ac.za",
    role: "support_specialist",
    studentOrStaffNumber: "DUT-EMP-4109",
    facultyOrDepartment: "Disability Unit — Steve Biko Library Centre",
    status: "active",
    createdAt: "2026-09-01",
  },
  {
    id: "usr-stf-006",
    name: "Bongani Khumalo",
    email: "b.khumalo@dut.ac.za",
    role: "support_specialist",
    studentOrStaffNumber: "DUT-EMP-4142",
    facultyOrDepartment: "Midlands Student Wellness Building (PMB)",
    status: "active",
    createdAt: "2026-09-02",
  },
  {
    id: "usr-stf-007",
    name: "Amina Seedat",
    email: "a.seedat@dut.ac.za",
    role: "support_specialist",
    studentOrStaffNumber: "DUT-EMP-4168",
    facultyOrDepartment: "Faculty of Health Sciences Concessions Liaison",
    status: "active",
    createdAt: "2026-09-04",
  },
  {
    id: "usr-stf-008",
    name: "Craig Petersen",
    email: "c.petersen@dut.ac.za",
    role: "support_specialist",
    studentOrStaffNumber: "DUT-EMP-4211",
    facultyOrDepartment: "Ritson Campus Academic Support Hub",
    status: "active",
    createdAt: "2026-09-05",
  },
  {
    id: "usr-stf-009",
    name: "Nomvula Zulu",
    email: "n.zulu@dut.ac.za",
    role: "support_specialist",
    studentOrStaffNumber: "DUT-EMP-4235",
    facultyOrDepartment: "Disability Unit — Intake Assessment Specialist",
    status: "active",
    createdAt: "2026-09-08",
  },
  {
    id: "usr-stf-010",
    name: "Tariq Mahomed",
    email: "t.mahomed@dut.ac.za",
    role: "support_specialist",
    studentOrStaffNumber: "DUT-EMP-4279",
    facultyOrDepartment: "Exam Concessions & Invigilation Services",
    status: "active",
    createdAt: "2026-09-10",
  },
];

// 4 Institutional Administrators
const ADMIN_USERS: InstitutionalUser[] = [
  {
    id: "usr-adm-001",
    name: "Prof. S. Govender",
    email: "s.govender@dut.ac.za",
    role: "administrator",
    studentOrStaffNumber: "DUT-ADM-1001",
    facultyOrDepartment: "Directorate for Institutional Systems & Access",
    status: "active",
    createdAt: "2026-08-01",
  },
  {
    id: "usr-adm-002",
    name: "Institutional Admin",
    email: "admin.compass@dut.ac.za",
    role: "administrator",
    studentOrStaffNumber: "DUT-ADM-1010",
    facultyOrDepartment: "Lead Systems Administrator — Core Infrastructure",
    status: "active",
    createdAt: "2026-08-01",
  },
  {
    id: "usr-adm-003",
    name: "Zanele Ndaba",
    email: "z.ndaba@dut.ac.za",
    role: "administrator",
    studentOrStaffNumber: "DUT-ADM-1025",
    facultyOrDepartment: "Academic Registrar & Compliance Auditing",
    status: "active",
    createdAt: "2026-08-10",
  },
  {
    id: "usr-adm-004",
    name: "David Smith",
    email: "d.smith@dut.ac.za",
    role: "administrator",
    studentOrStaffNumber: "DUT-ADM-1044",
    facultyOrDepartment: "DUT Cloud Node & Cybersecurity Operations",
    status: "active",
    createdAt: "2026-08-12",
  },
];

// Total Initial Users: 128 + 10 + 4 = 142
export const INITIAL_USERS: InstitutionalUser[] = [
  ...STUDENT_USERS,
  ...STAFF_USERS,
  ...ADMIN_USERS,
];

// 5 FR05–FR09 Screening Domain Pools
export const INITIAL_ASSESSMENT_POOLS: Record<ScreeningDomainKey, AssessmentPoolItem> = {
  reading: {
    domain: "reading",
    code: "FR05",
    title: "Reading & Lexical Processing Screener",
    shortName: "Reading & Dyslexia",
    description:
      "Assesses visual-lexical processing, word decoding efficiency, line tracking stability, and reading fatigue during academic study.",
    estimatedMinutes: 6,
    questions: [
      {
        id: "read-q1",
        domain: "reading",
        prompt:
          "When reading academic textbooks or lecture slides, do letters or words appear to blur, shift, or require re-reading multiple times?",
        context: "Visual tracking and orthographic stability",
        type: "frequency-scale",
      },
      {
        id: "read-q2",
        domain: "reading",
        prompt:
          "How often do you lose your place on the page or accidentally skip lines when reading dense academic material?",
        context: "Saccadic tracking and line navigation",
        type: "frequency-scale",
      },
      {
        id: "read-q3",
        domain: "reading",
        prompt:
          "Do you experience noticeable physical fatigue, headaches, or eye strain within 15-20 minutes of continuous reading?",
        context: "Visual-cognitive endurance",
        type: "frequency-scale",
      },
      {
        id: "read-q4",
        domain: "reading",
        prompt:
          "How difficult is it for you to pronounce unfamiliar technical terminology or scientific jargon upon first sight?",
        context: "Phonological decoding and rapid naming",
        type: "impact-scale",
      },
      {
        id: "read-q5",
        domain: "reading",
        prompt:
          "During timed tests, do you frequently run out of time primarily because reading and processing the exam questions takes longer than expected?",
        context: "Timed reading speed and processing latency",
        type: "impact-scale",
      },
    ],
  },
  grammar: {
    domain: "grammar",
    code: "FR06",
    title: "Grammar & Syntax Formulation Screener",
    shortName: "Grammar & Syntax",
    description:
      "Screens grammatical structure formulation, inflectional morphology, punctuation consistency, and academic syntax assembly under timed constraints.",
    estimatedMinutes: 5,
    questions: [
      {
        id: "gram-q1",
        domain: "grammar",
        prompt:
          "When drafting essay paragraphs, how frequently do you omit grammatical connector words, auxiliary verbs, or tense inflections?",
        context: "Syntactic structure and grammatical omission",
        type: "frequency-scale",
      },
      {
        id: "gram-q2",
        domain: "grammar",
        prompt:
          "How often do you mix up word order or confuse similar grammatical structures when writing formal laboratory or research reports?",
        context: "Morphosyntactic assembly",
        type: "frequency-scale",
      },
      {
        id: "gram-q3",
        domain: "grammar",
        prompt:
          "Do you struggle to determine correct punctuation boundaries (run-on sentences, comma splices) without automated grammar tools?",
        context: "Syntactic clause delimitation",
        type: "impact-scale",
      },
      {
        id: "gram-q4",
        domain: "grammar",
        prompt:
          "When reviewing your written coursework, is it challenging to spot grammatical agreement errors (subject-verb or singular-plural mismatches)?",
        context: "Error monitoring in syntax",
        type: "impact-scale",
      },
      {
        id: "gram-q5",
        domain: "grammar",
        prompt:
          "How frequently do lecturers or teaching assistants comment that your written explanations are structurally fragmented or hard to follow?",
        context: "Academic discourse coherence",
        type: "frequency-scale",
      },
    ],
  },
  mathematics: {
    domain: "mathematics",
    code: "FR07",
    title: "Mathematics & Quantitative Reasoning Screener",
    shortName: "Mathematics & Dyscalculia",
    description:
      "Evaluates core numerical fluency, arithmetic automaticity, spatial graph comprehension, and algorithmic formula execution.",
    estimatedMinutes: 6,
    questions: [
      {
        id: "math-q1",
        domain: "mathematics",
        prompt:
          "How frequently do you reverse or mix up numbers (e.g., reading 64 as 46, or transposing digits in student IDs or calculations)?",
        context: "Numerical spatial sequencing",
        type: "frequency-scale",
      },
      {
        id: "math-q2",
        domain: "mathematics",
        prompt:
          "Do you struggle to perform basic mental arithmetic (addition, subtraction, multiplication tables) without relying on finger counting or a calculator?",
        context: "Arithmetic automaticity and memory retrieval",
        type: "frequency-scale",
      },
      {
        id: "math-q3",
        domain: "mathematics",
        prompt:
          "How difficult is it for you to quickly interpret visual graphs, coordinate axes, scatter plots, or multi-column data tables?",
        context: "Spatial-quantitative interpretation",
        type: "impact-scale",
      },
      {
        id: "math-q4",
        domain: "mathematics",
        prompt:
          "When solving multi-step mathematical formulas or code algorithms, do you easily lose track of intermediate steps or carrying numbers?",
        context: "Working memory in quantitative operations",
        type: "impact-scale",
      },
      {
        id: "math-q5",
        domain: "mathematics",
        prompt:
          "How often do you experience confusion estimating time durations, budget totals, or measuring scales in practical laboratory settings?",
        context: "Magnitude estimation and spatial numerical scale",
        type: "frequency-scale",
      },
    ],
  },
  memory: {
    domain: "memory",
    code: "FR08",
    title: "Working Memory & Cognitive Recall Screener",
    shortName: "Working Memory",
    description:
      "Assesses active working memory capacity, multi-step instruction retention, mental manipulation of abstract concepts, and cognitive recall latency.",
    estimatedMinutes: 5,
    questions: [
      {
        id: "mem-q1",
        domain: "memory",
        prompt:
          "When given multi-part verbal instructions (e.g., in a laboratory or lecture), do you easily forget subsequent steps while executing the first?",
        context: "Sequential auditory working memory",
        type: "frequency-scale",
      },
      {
        id: "mem-q2",
        domain: "memory",
        prompt:
          "How frequently do you forget information you just read or heard five minutes ago, requiring immediate re-consultation of notes?",
        context: "Short-term cognitive retention buffer",
        type: "frequency-scale",
      },
      {
        id: "mem-q3",
        domain: "memory",
        prompt:
          "Under timed test pressure, do you experience 'mind blanking' where well-studied formulas or key definitions temporarily become inaccessible?",
        context: "Stress-induced retrieval inhibition",
        type: "impact-scale",
      },
      {
        id: "mem-q4",
        domain: "memory",
        prompt:
          "Do you find it difficult to mentally hold numbers or variables in your head while performing a calculation or writing code?",
        context: "Central executive working memory loop",
        type: "impact-scale",
      },
      {
        id: "mem-q5",
        domain: "memory",
        prompt:
          "How often do you lose track of assignment deadlines or academic appointments unless repeatedly prompted by electronic alerts?",
        context: "Prospective memory and temporal tracking",
        type: "frequency-scale",
      },
    ],
  },
  comprehension: {
    domain: "comprehension",
    code: "FR09",
    title: "Comprehension & Text Analysis Screener",
    shortName: "Comprehension",
    description:
      "Measures macro-level academic passage comprehension, inference deduction, technical schema integration, and critical reading synthesis.",
    estimatedMinutes: 6,
    questions: [
      {
        id: "comp-q1",
        domain: "comprehension",
        prompt:
          "When reading long academic papers, can you easily grasp individual sentences but struggle to extract the overarching thesis or argument?",
        context: "Macrostructure comprehension and global synthesis",
        type: "frequency-scale",
      },
      {
        id: "comp-q2",
        domain: "comprehension",
        prompt:
          "How challenging is it for you to deduce unspoken inferences or evaluate an author's implicit assumptions in complex journal literature?",
        context: "Higher-order inferential deduction",
        type: "impact-scale",
      },
      {
        id: "comp-q3",
        domain: "comprehension",
        prompt:
          "Do you find yourself rereading the same academic paragraph three or more times to digest the conceptual relationship between ideas?",
        context: "Conceptual schema integration",
        type: "frequency-scale",
      },
      {
        id: "comp-q4",
        domain: "comprehension",
        prompt:
          "In exam questions containing multi-sentence scenario vignettes, do you struggle to filter extraneous details to identify what is actually asked?",
        context: "Information gating in comprehension",
        type: "impact-scale",
      },
      {
        id: "comp-q5",
        domain: "comprehension",
        prompt:
          "How often do you misinterpret exam questions because complex phrasing or double negatives obscure the intended prompt meaning?",
        context: "Syntactic-semantic ambiguity resolution",
        type: "frequency-scale",
      },
    ],
  },
};

// Initial Scoring Configuration
export const INITIAL_SCORING_CONFIG: ScoringConfig = {
  thresholds: {
    high: 40, // score below or equal to which a domain counts as high priority / difficulty
    moderate: 60, // score below or equal to which a domain counts as moderate difficulty
  },
  weightings: {
    reading: 1,
    grammar: 1,
    mathematics: 1,
    memory: 1,
    comprehension: 1,
  },
};

// Initial 8 Exercises (sum + guides + contacts = 24 Content Library count)
export const INITIAL_EXERCISES: InstitutionalExercise[] = [
  {
    id: "ex-tts-reader",
    title: "Guided Academic Text Reader & TTS Assistant",
    domain: "reading",
    category: "Assistive Tool & Reading",
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
      "Select an academic article or paste coursework notes",
      "Adjust playback speed (0.85x - 1.25x) and select speech voice",
      "Toggle dyslexic font or scotopic tint overlay",
      "Read along with synchronized word-highlighting",
    ],
    completedCount: 6,
    lastCompletedAt: "2026-09-10T14:30:00Z",
    archived: false,
  },
  {
    id: "ex-pomodoro-timer",
    title: "Interval Focus & Ambient White Noise Sprint",
    domain: "memory",
    category: "Executive Strategy",
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
    archived: false,
  },
  {
    id: "ex-peel-essay",
    title: "PEEL Academic Paragraph & Thesis Builder",
    domain: "grammar",
    category: "Written Expression",
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
    ],
    completedCount: 3,
    lastCompletedAt: "2026-09-08T16:45:00Z",
    archived: false,
  },
  {
    id: "ex-math-patterns",
    title: "Spatial Equations & Number Sense Trainer",
    domain: "mathematics",
    category: "Quantitative Reasoning",
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
      "Identify the governing algorithmic rule",
      "Input missing value for instant step-by-step logic",
    ],
    completedCount: 5,
    lastCompletedAt: "2026-09-09T11:20:00Z",
    archived: false,
  },
  {
    id: "ex-word-drill",
    title: "Rapid Phonological & Technical Vocabulary Drill",
    domain: "reading",
    category: "Lexical Processing",
    durationMinutes: 10,
    difficulty: "Beginner",
    interactiveType: "word-drill",
    description:
      "Speed flashcard drill designed to build sight-word recognition of complex academic terms, ICT nomenclature, and multisyllabic vocabulary.",
    objectives: [
      "Build rapid automatic naming speed for scientific terminology",
      "Reduce visual substitution errors in coursework",
      "Practice phonetic syllable chunking",
    ],
    completedCount: 4,
    lastCompletedAt: "2026-09-07T09:00:00Z",
    archived: false,
  },
  {
    id: "ex-syntax-scaffolding",
    title: "Syntax Scaffolding & Sentence Boundary Lab",
    domain: "grammar",
    category: "Grammar & Syntax",
    durationMinutes: 15,
    difficulty: "Intermediate",
    interactiveType: "syntax-lab",
    description:
      "Interactive grammar repair exercises focusing on clause connectors, comma boundaries, and tense consistency in scientific arguments.",
    objectives: [
      "Strengthen sentence boundary recognition",
      "Reduce run-on constructions in technical lab reports",
      "Master active vs. passive voice conventions",
    ],
    completedCount: 2,
    lastCompletedAt: "2026-09-12T16:00:00Z",
    archived: false,
  },
  {
    id: "ex-memory-palace",
    title: "Working Memory Chunker & Dual-N-Back Drill",
    domain: "memory",
    category: "Cognitive Memory",
    durationMinutes: 12,
    difficulty: "Advanced",
    interactiveType: "memory-chunker",
    description:
      "Visual-auditory dual N-back drills and chunking ladders designed to widen the temporary working memory buffer under cognitive load.",
    objectives: [
      "Expand sequential working memory storage capacity",
      "Resist proactive interference during test conditions",
      "Strengthen auditory-verbal recall during lectures",
    ],
    completedCount: 7,
    lastCompletedAt: "2026-09-14T08:30:00Z",
    archived: false,
  },
  {
    id: "ex-macro-schema",
    title: "Macro-Schema Text Analysis & Vignette Filter",
    domain: "comprehension",
    category: "Passage Comprehension",
    durationMinutes: 18,
    difficulty: "Intermediate",
    interactiveType: "macro-schema",
    description:
      "Guided text dissection method that trains students to filter noise from long exam case vignettes and identify central arguments.",
    objectives: [
      "Filter distractors in multi-paragraph exam scenarios",
      "Identify implicit causal links between arguments",
      "Formulate rapid synthesized summary abstracts",
    ],
    completedCount: 5,
    lastCompletedAt: "2026-09-13T15:20:00Z",
    archived: false,
  },
];

// Initial 10 Guides/Articles in supportInfo
export const INITIAL_SUPPORT_INFO: InstitutionalSupportGuide[] = [
  {
    id: "guide-001",
    title: "DUT Examination Concessions & Extra Time Guide (2026)",
    category: "Institutional Policy",
    targetAudience: "All Enrolled Students with Screening Indicators",
    readingMinutes: 8,
    summary:
      "Comprehensive walk-through of application deadlines, medical documentation guidelines, and concession approvals for semester exams.",
    content:
      "Students identified with reading, dyscalculia, or motor writing difficulties are eligible to apply for 15 minutes per hour additional exam writing time. Applications must be lodged with the Disability Unit by Friday of week 8.",
    author: "Dr. N. Dube (Senior Educational Psychologist)",
    publishedAt: "2026-08-10",
    archived: false,
  },
  {
    id: "guide-002",
    title: "Setting Up Assistive Software: Read & Write Gold on DUT PCs",
    category: "Assistive Technology",
    targetAudience: "Students requiring text-to-speech & screen masking",
    readingMinutes: 6,
    summary:
      "Step-by-step setup manual for activating institutional site licenses on campus laboratory computers and personal laptops.",
    content:
      "DUT provides free site licenses for Read & Write Gold and Dragon NaturallySpeaking. Connect with your student credentials to enable phonetic spell-checking, text-to-speech, and PDF highlighters.",
    author: "Lerato Sithole (Assistive Tech Officer)",
    publishedAt: "2026-08-15",
    archived: false,
  },
  {
    id: "guide-003",
    title: "Overcoming Math Anxiety & Digit Transposition in ICT Coding",
    category: "Academic Strategy",
    targetAudience: "Engineering, ICT & Accounting Students",
    readingMinutes: 7,
    summary:
      "Practical cognitive scaffolding techniques to prevent number flipping when transposing coordinate matrices and array indices.",
    content:
      "Spatial grid alignments and color-coded coding editors dramatically reduce the cognitive load of numeric sequencing. Use graph-paper scratch pads during lab tutorials.",
    author: "Academic Development & Concessions Board",
    publishedAt: "2026-08-22",
    archived: false,
  },
  {
    id: "guide-004",
    title: "Understanding Your Screening Battery Report: Indicator Banding",
    category: "Diagnostic Guidance",
    targetAudience: "Undergraduate Students & Faculty Advisors",
    readingMinutes: 5,
    summary:
      "Explains the difference between Typical Range, Mild Variation, Moderate Difficulty, and High-Priority screening indicators.",
    content:
      "Screening scores reflect relative processing speed and endurance, not academic intelligence. High-priority indicators trigger expedited intake review with DUT disability specialists.",
    author: "Disability Care Unit Clinical Panel",
    publishedAt: "2026-08-28",
    archived: false,
  },
  {
    id: "guide-005",
    title: "Quiet Study Venues & Sensory-Friendly Computer Pods",
    category: "Campus Facilities",
    targetAudience: "Neurodivergent & ADHD Students",
    readingMinutes: 4,
    summary:
      "Directory of low-stimulation acoustic booths, quiet testing cubicles, and noise-cancelling zones across Durban and Midlands campuses.",
    content:
      "The Steve Biko Library 2nd Floor and ML Sultan Disability Centre feature sound-damped study pods accessible via student biometric swipe card.",
    author: "Kavisha Naidoo (Steve Biko Hub)",
    publishedAt: "2026-09-01",
    archived: false,
  },
  {
    id: "guide-006",
    title: "Lecture Recording Permission & Smart Audio Notes Protocol",
    category: "Concessions & Policies",
    targetAudience: "Students with Auditory Memory Difficulties",
    readingMinutes: 6,
    summary:
      "Institutional policy granting permission to record classroom lectures for personal study under the POPIA privacy agreement.",
    content:
      "Students with approved working memory accommodations may capture lecture audio. Audio must not be redistributed or uploaded to public repositories.",
    author: "Zanele Ndaba (Academic Registrar Compliance)",
    publishedAt: "2026-09-03",
    archived: false,
  },
  {
    id: "guide-007",
    title: "PEEL Paragraph Strategy for Timed Essay Invigilation",
    category: "Exam Strategy",
    targetAudience: "Arts, Management Sciences & Health Sciences Students",
    readingMinutes: 7,
    summary:
      "How to rapidly structure responses using Point, Evidence, Explanation, Link when writing against strict examination clocks.",
    content:
      "Allocate the first 5 minutes to bulleting the 4 PEEL components before prose formulation. This bypasses structural memory blockage during exams.",
    author: "Academic Development Center",
    publishedAt: "2026-09-05",
    archived: false,
  },
  {
    id: "guide-008",
    title: "Ergonomics and Hand Stamina for Written Invigilated Tests",
    category: "Physical Accommodations",
    targetAudience: "Students with Dysgraphia / Motor Fatigue",
    readingMinutes: 5,
    summary:
      "Pencil grip modifications, stretch routines, and applying for laptop typing concession for lengthy essay-based finals.",
    content:
      "Students experiencing severe carpal fatigue or cramping after 20 minutes can request a disability-monitored laptop concession.",
    author: "Faculty of Health Sciences Concessions Liaison",
    publishedAt: "2026-09-07",
    archived: false,
  },
  {
    id: "guide-009",
    title: "Navigating Neurodiversity: Peer Support & Mentorship Network",
    category: "Student Wellness",
    targetAudience: "First & Second Year Students",
    readingMinutes: 6,
    summary:
      "Weekly peer circles connecting neurodivergent university students across engineering, commerce, and the sciences.",
    content:
      "Meet fellow students who navigate dyslexia, ADHD, and executive dysfunction. Regular peer check-ins foster study accountability.",
    author: "Student Counselling & Health Services",
    publishedAt: "2026-09-10",
    archived: false,
  },
  {
    id: "guide-010",
    title: "Disaster Recovery & Institutional Data Privacy (POPIA) Overview",
    category: "Institutional Governance",
    targetAudience: "Staff & Institutional Administrators",
    readingMinutes: 8,
    summary:
      "Compliance guidelines regarding the safeguarding and encrypted storage of cognitive screening metrics and referral documentation.",
    content:
      "All student screening metrics are classified as confidential health and academic data under South Africa's POPIA act. Unauthorised dissemination is strictly prohibited.",
    author: "Prof. S. Govender (Director of Systems)",
    publishedAt: "2026-09-12",
    archived: false,
  },
];

// Initial 6 Campus Contact Profiles
export const INITIAL_CONTACTS: InstitutionalContact[] = [
  {
    id: "cnt-001",
    campus: "ML Sultan Campus (Durban)",
    building: "Disability Care Centre, Room A1-14",
    phone: "+27 (0)31 373 2489",
    email: "disability.mlsultan@dut.ac.za",
    hours: "Mon - Fri: 08:00 - 16:30",
    specialistInCharge: "Dr. N. Dube (Senior Educational Psychologist)",
    archived: false,
  },
  {
    id: "cnt-002",
    campus: "Steve Biko Campus (Durban)",
    building: "Library Student Services, 2nd Floor, Room S208",
    phone: "+27 (0)31 373 2038",
    email: "disability.stevebiko@dut.ac.za",
    hours: "Mon - Fri: 08:00 - 16:30",
    specialistInCharge: "Kavisha Naidoo (Assistive Tech Hub)",
    archived: false,
  },
  {
    id: "cnt-003",
    campus: "Ritson Campus (Durban)",
    building: "Academic Support Hub, Room R204",
    phone: "+27 (0)31 373 5401",
    email: "disability.ritson@dut.ac.za",
    hours: "Mon - Fri: 08:30 - 16:00",
    specialistInCharge: "Craig Petersen (Concessions Officer)",
    archived: false,
  },
  {
    id: "cnt-004",
    campus: "Brickfield Campus (Durban)",
    building: "Student Services Wing, Ground Floor",
    phone: "+27 (0)31 373 3812",
    email: "disability.brickfield@dut.ac.za",
    hours: "Mon & Wed: 09:00 - 15:30",
    specialistInCharge: "Farzana Cassim (Counselling Services)",
    archived: false,
  },
  {
    id: "cnt-005",
    campus: "Indumiso Campus (Pietermaritzburg)",
    building: "Midlands Student Wellness Building, Room M102",
    phone: "+27 (0)33 845 8820",
    email: "disability.midlands@dut.ac.za",
    hours: "Mon - Fri: 08:00 - 16:00",
    specialistInCharge: "Bongani Khumalo (Midlands Lead)",
    archived: false,
  },
  {
    id: "cnt-006",
    campus: "Riverside Campus (Pietermaritzburg)",
    building: "Main Academic Complex, Room R12",
    phone: "+27 (0)33 845 8911",
    email: "disability.riverside@dut.ac.za",
    hours: "Tue & Thu: 08:30 - 16:00",
    specialistInCharge: "Nomvula Zulu (Intake Assessment Specialist)",
    archived: false,
  },
];

// Initial Audit Logs (for Audit Permissions Modal)
export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: "aud-001",
    timestamp: "2026-09-16 09:42:15",
    actor: "Institutional Admin (DUT-ADM-1010)",
    action: "ROLE_ASSIGNMENT",
    target: "Farzana Cassim (DUT-EMP-4055)",
    status: "SUCCESS",
    details: "Granted Support Specialist role with intake referral privileges.",
  },
  {
    id: "aud-002",
    timestamp: "2026-09-15 14:18:30",
    actor: "Prof. S. Govender (DUT-ADM-1001)",
    action: "INDICATOR_CALIBRATION",
    target: "Scoring Configuration (v2.4.0)",
    status: "INFO",
    details: "Calibrated High-Priority difficulty cutoff to 40% and Moderate cutoff to 60%.",
  },
  {
    id: "aud-003",
    timestamp: "2026-09-14 11:05:00",
    actor: "Institutional Admin (DUT-ADM-1010)",
    action: "QUESTION_BANK_SYNC",
    target: "FR05-FR09 Screening Batteries",
    status: "SUCCESS",
    details: "Synchronised 25 standard Likert indicators across 5 screening domains.",
  },
  {
    id: "aud-004",
    timestamp: "2026-09-12 16:30:22",
    actor: "Zanele Ndaba (DUT-ADM-1025)",
    action: "POPIA_COMPLIANCE_AUDIT",
    target: "Institutional Triage Records",
    status: "SUCCESS",
    details: "Verified data encryption at rest and role-based access isolation.",
  },
  {
    id: "aud-005",
    timestamp: "2026-09-10 08:00:10",
    actor: "David Smith (DUT-ADM-1044)",
    action: "SYSTEM_BACKUP",
    target: "DUT Cloud Node Snapshot",
    status: "SUCCESS",
    details: "Snapshot #DUT-BK-20260910 encrypted and verified (Hash: SHA-256-7f41a).",
  },
  {
    id: "aud-006",
    timestamp: "2026-09-08 13:20:45",
    actor: "Institutional Admin (DUT-ADM-1010)",
    action: "USER_DEACTIVATION",
    target: "Tariq Mahomed (DUT-EMP-4279)",
    status: "WARNING",
    details: "Account temporarily set to inactive during leave of absence. Total enrolled count preserved.",
  },
];
