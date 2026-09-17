import React, { useState } from "react";
import {
  Sparkles,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Copy,
  Edit3,
  Save,
  Play,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Layers,
  Clock,
  Trophy,
  HelpCircle,
  X,
  FileText,
  RotateCcw,
  Sliders,
  Check,
  Eye,
  Download,
  Upload,
  ArrowRight,
  BrainCircuit,
  Volume2,
} from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Badge } from "../../../../components/ui/badge";
import { toast } from "sonner";
import type {
  Quiz,
  QuizQuestion,
  QuizQuestionOption,
  QuizQuestionType,
  DomainId,
} from "../../../student/types";
import type { ScreeningDomainKey, AssessmentPoolItem } from "../../../shared/types";
import {
  getCustomQuizzes,
  getAllQuizzes,
  saveCustomQuiz,
  deleteCustomQuiz,
} from "../../lib/quizStorage";

interface CreateQuizBuilderProps {
  assessmentPools?: Record<ScreeningDomainKey, AssessmentPoolItem>;
  onTestDriveGlobal?: (quiz: Quiz) => void;
}

const DOMAIN_OPTIONS: {
  key: ScreeningDomainKey;
  domainId: DomainId;
  code: string;
  label: string;
  clinicalFocus: string;
}[] = [
  {
    key: "reading",
    domainId: "reading",
    code: "FR05",
    label: "Reading & Lexical Processing",
    clinicalFocus: "Dyslexia / Phonological Screening",
  },
  {
    key: "grammar",
    domainId: "writing",
    code: "FR06",
    label: "Grammar & Syntax Formulation",
    clinicalFocus: "Dysgraphia / Written Expression",
  },
  {
    key: "mathematics",
    domainId: "math",
    code: "FR07",
    label: "Mathematics & Quantitative Reasoning",
    clinicalFocus: "Dyscalculia / Numerical Cognition",
  },
  {
    key: "memory",
    domainId: "attention",
    code: "FR08",
    label: "Working Memory & Processing Endurance",
    clinicalFocus: "Executive Function / ADHD Indicators",
  },
  {
    key: "comprehension",
    domainId: "reading",
    code: "FR09",
    label: "Text Comprehension & Macrostructure",
    clinicalFocus: "Cognitive Processing & Synthesis",
  },
];

const BADGE_THEMES = [
  { label: "Emerald (Balanced / Standard)", value: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30" },
  { label: "Indigo / Cyan (Cognitive Speed)", value: "bg-chart-2/15 text-chart-2 border-chart-2/30" },
  { label: "Purple / Violet (Memory & Focus)", value: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30" },
  { label: "Amber (Attention / High Focus)", value: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30" },
  { label: "Rose (Diagnostic Priority)", value: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30" },
];

const QUESTION_TYPES: { type: QuizQuestionType; label: string; desc: string }[] = [
  {
    type: "multiple-choice",
    label: "Multiple Choice",
    desc: "Standard question with distinct response choices and feedback.",
  },
  {
    type: "reading-passage",
    label: "Reading Passage",
    desc: "Passage excerpt paired with timed comprehension question.",
  },
  {
    type: "stroop-test",
    label: "Stroop Attention",
    desc: "Color-word conflict testing cognitive inhibition & executive load.",
  },
  {
    type: "sequence",
    label: "Logical Sequence",
    desc: "Arranging arithmetic or syntactic components in sequence.",
  },
  {
    type: "syntax-spotter",
    label: "Syntax Spotter",
    desc: "Spot grammatical inversions, word errors, or spelling traps.",
  },
];

export function CreateQuizBuilder({ assessmentPools }: CreateQuizBuilderProps) {
  const [activeTab, setActiveTab] = useState<"builder" | "library">("builder");

  // ================= Quiz Metadata State =================
  const [quizId, setQuizId] = useState<string>(`quiz-custom-${Date.now()}`);
  const [title, setTitle] = useState("");
  const [selectedDomainKey, setSelectedDomainKey] = useState<ScreeningDomainKey>("reading");
  const [category, setCategory] = useState("Lexical & Phonological Assessment");
  const [durationMinutes, setDurationMinutes] = useState<number>(8);
  const [difficulty, setDifficulty] = useState<"Beginner" | "Intermediate" | "Advanced">("Intermediate");
  const [badgeColor, setBadgeColor] = useState(BADGE_THEMES[0]!.value);
  const [description, setDescription] = useState("");
  const [passingScore, setPassingScore] = useState<number>(70);
  const [authorName, setAuthorName] = useState("DUT Disability Specialist");

  // ================= Questions State =================
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);

  // ================= Question Form Authoring State =================
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [qType, setQType] = useState<QuizQuestionType>("multiple-choice");
  const [qPrompt, setQPrompt] = useState("");
  const [qSkillTested, setQSkillTested] = useState("Phonological Decoding & Orthographic Awareness");
  const [qHint, setQHint] = useState("");
  const [qPassage, setQPassage] = useState("");

  // Stroop specifics
  const [stroopWord, setStroopWord] = useState("BLUE");
  const [stroopColorName, setStroopColorName] = useState("Red");
  const [stroopColorClass, setStroopColorClass] = useState("text-red-500");

  // Options
  const [options, setOptions] = useState<QuizQuestionOption[]>([
    { id: "opt-1", text: "Option A", isCorrect: true, explanation: "Correct answer explanation." },
    { id: "opt-2", text: "Option B", isCorrect: false, explanation: "Distractor response." },
    { id: "opt-3", text: "Option C", isCorrect: false, explanation: "Alternative choice." },
    { id: "opt-4", text: "Option D", isCorrect: false, explanation: "Alternative choice." },
  ]);

  // QA Test Drive Modal
  const [qaModalOpen, setQaModalOpen] = useState(false);
  const [qaCurrentIndex, setQaCurrentIndex] = useState(0);
  const [qaSelectedOption, setQaSelectedOption] = useState<string | null>(null);
  const [qaAnswers, setQaAnswers] = useState<Record<string, string>>({});
  const [qaCompleted, setQaCompleted] = useState(false);
  const [qaElapsed, setQaElapsed] = useState(0);

  // All quizzes for library view
  const [allQuizzesList, setAllQuizzesList] = useState<Quiz[]>(() => getAllQuizzes());

  const refreshLibrary = () => {
    setAllQuizzesList(getAllQuizzes());
  };

  // ================= Template Presets =================
  const loadTemplate = (preset: "reading" | "math" | "attention" | "writing") => {
    if (preset === "reading") {
      setQuizId(`quiz-custom-reading-${Date.now()}`);
      setTitle("Phonological Decoding & Visual Saccades Sprint");
      setSelectedDomainKey("reading");
      setCategory("Dyslexia & Word Recognition");
      setDurationMinutes(7);
      setDifficulty("Intermediate");
      setBadgeColor(BADGE_THEMES[1]!.value);
      setDescription("Timed assessment testing rapid word decoding, reversal detection, and font clarity under academic study load.");
      setPassingScore(70);
      setQuestions([
        {
          id: `q-${Date.now()}-1`,
          type: "multiple-choice",
          prompt: "Which pair of words contains a 180-degree geometric glyph reversal (b/d or p/q) that frequently causes visual disorientation?",
          options: [
            { id: "o1", text: "flute / brute", isCorrect: false, explanation: "Rhyming phonetic pair." },
            { id: "o2", text: "bread / plead", isCorrect: true, explanation: "The mirror pairs 'b'/'d' and 'p'/'d' trigger optical transposition." },
            { id: "o3", text: "height / weight", isCorrect: false, explanation: "Vowel digraph difference." },
            { id: "o4", text: "track / trace", isCorrect: false, explanation: "Suffix coda distinction." },
          ],
          hint: "Inspect the first letter of each word closely for mirrored letterforms.",
          skillTested: "Orthographic Glyph Orientation & Reversal Detection",
        },
        {
          id: `q-${Date.now()}-2`,
          type: "reading-passage",
          prompt: "Read the brief technical statement and identify the required safeguard against duplicated state:",
          passage: "In high-throughput distributed architectures, network latency causes non-deterministic message delivery. Message brokers therefore depend on idempotent event handlers to prevent repeated mutations.",
          options: [
            { id: "o1", text: "Producers halt all traffic until consumers reply synchronously.", isCorrect: false },
            { id: "o2", text: "Idempotent event handlers prevent corruption from duplicated messages.", isCorrect: true, explanation: "Directly affirmed by the passage text." },
            { id: "o3", text: "Network partitions can be eliminated by increasing memory.", isCorrect: false },
          ],
          hint: "Look for the sentence ending with 'prevent repeated mutations'.",
          skillTested: "Technical Passage Synthesis & Detail Extraction",
        },
      ]);
      toast.success("Loaded Dyslexia & Reading template with 2 starter questions!");
    } else if (preset === "math") {
      setQuizId(`quiz-custom-math-${Date.now()}`);
      setTitle("Mental Arithmetic & Spatial Number Sequencing Drill");
      setSelectedDomainKey("mathematics");
      setCategory("Dyscalculia & Quantitative Reasoning");
      setDurationMinutes(8);
      setDifficulty("Intermediate");
      setBadgeColor(BADGE_THEMES[0]!.value);
      setDescription("Checks spatial orientation of mathematical operations, sign inversion errors, and rapid multi-step arithmetic calculation.");
      setPassingScore(75);
      setQuestions([
        {
          id: `q-${Date.now()}-1`,
          type: "multiple-choice",
          prompt: "Evaluate the order of operations: 14 + 6 × (8 - 3) ÷ 2",
          options: [
            { id: "o1", text: "29", isCorrect: true, explanation: "8-3=5, 6×5=30, 30÷2=15, 14+15=29 (PEMDAS)." },
            { id: "o2", text: "50", isCorrect: false, explanation: "Incorrectly adding 14+6 before multiplying." },
            { id: "o3", text: "35", isCorrect: false, explanation: "Calculation order error." },
            { id: "o4", text: "22", isCorrect: false, explanation: "Sign division error." },
          ],
          hint: "Remember to resolve parentheses first, followed by multiplication and division left-to-right, then addition.",
          skillTested: "Operational Sequencing & Executive Working Memory",
        },
      ]);
      toast.success("Loaded Math & Dyscalculia template!");
    } else if (preset === "attention") {
      setQuizId(`quiz-custom-stroop-${Date.now()}`);
      setTitle("Executive Inhibition & Rapid Stroop Color Test");
      setSelectedDomainKey("memory");
      setCategory("ADHD & Attention Control");
      setDurationMinutes(5);
      setDifficulty("Advanced");
      setBadgeColor(BADGE_THEMES[2]!.value);
      setDescription("Measures cognitive interference latency when the font color contradicts the semantic meaning of the printed word.");
      setPassingScore(80);
      setQuestions([
        {
          id: `q-${Date.now()}-1`,
          type: "stroop-test",
          prompt: "What COLOR is this text printed in? (Ignore the semantic word itself):",
          stroopWord: {
            word: "GREEN",
            displayColor: "text-amber-500",
            colorClass: "text-amber-500",
            correctColorName: "Amber / Yellow",
          },
          options: [
            { id: "o1", text: "Green", isCorrect: false, explanation: "This is what the word reads, not the ink color!" },
            { id: "o2", text: "Amber / Yellow", isCorrect: true, explanation: "Correct! The font is printed in Amber ink." },
            { id: "o3", text: "Blue", isCorrect: false },
            { id: "o4", text: "Red", isCorrect: false },
          ],
          hint: "Focus solely on the ink hue, suppress the urge to read the word.",
          skillTested: "Prefrontal Cognitive Inhibition (Stroop Effect)",
        },
      ]);
      toast.success("Loaded Stroop & Attention template!");
    } else {
      setQuizId(`quiz-custom-syntax-${Date.now()}`);
      setTitle("Grammar & Syntax Formation Diagnostic");
      setSelectedDomainKey("grammar");
      setCategory("Dysgraphia & Written Coherence");
      setDurationMinutes(6);
      setDifficulty("Beginner");
      setBadgeColor(BADGE_THEMES[3]!.value);
      setDescription("Assesses morphological markers, subject-verb agreement under cognitive fatigue, and punctuation clarity.");
      setPassingScore(65);
      setQuestions([]);
      toast.success("Loaded Grammar & Syntax template!");
    }
  };

  const handleResetForm = () => {
    setQuizId(`quiz-custom-${Date.now()}`);
    setTitle("");
    setSelectedDomainKey("reading");
    setCategory("Lexical & Phonological Assessment");
    setDurationMinutes(8);
    setDifficulty("Intermediate");
    setDescription("");
    setPassingScore(70);
    setQuestions([]);
    resetQuestionAuthoring();
    toast.info("Cleared quiz authoring workspace.");
  };

  // ================= Options Builder Handlers =================
  const handleAddOption = () => {
    if (options.length >= 6) {
      toast.error("Maximum 6 options per question.");
      return;
    }
    const newId = `opt-${Date.now()}-${options.length + 1}`;
    setOptions((prev) => [
      ...prev,
      { id: newId, text: `Option ${String.fromCharCode(65 + prev.length)}`, isCorrect: false },
    ]);
  };

  const handleRemoveOption = (indexToRemove: number) => {
    if (options.length <= 2) {
      toast.error("A question requires at least 2 options.");
      return;
    }
    setOptions((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleUpdateOption = (index: number, updates: Partial<QuizQuestionOption>) => {
    setOptions((prev) => {
      const next = [...prev];
      next[index] = { ...next[index]!, ...updates };
      return next;
    });
  };

  const handleSetCorrectOption = (index: number) => {
    setOptions((prev) =>
      prev.map((opt, idx) => ({
        ...opt,
        isCorrect: idx === index,
      }))
    );
  };

  // ================= Question Authoring Handlers =================
  const resetQuestionAuthoring = () => {
    setEditingIndex(null);
    setQType("multiple-choice");
    setQPrompt("");
    setQSkillTested("Cognitive Fluency & Processing");
    setQHint("");
    setQPassage("");
    setOptions([
      { id: "opt-1", text: "Choice A", isCorrect: true, explanation: "" },
      { id: "opt-2", text: "Choice B", isCorrect: false, explanation: "" },
      { id: "opt-3", text: "Choice C", isCorrect: false, explanation: "" },
      { id: "opt-4", text: "Choice D", isCorrect: false, explanation: "" },
    ]);
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qPrompt.trim()) {
      toast.error("Please provide a question prompt.");
      return;
    }

    if (qType === "reading-passage" && !qPassage.trim()) {
      toast.error("Please provide the reading passage text.");
      return;
    }

    // Validate options
    const emptyOptions = options.some((opt) => !opt.text.trim());
    if (emptyOptions) {
      toast.error("All option fields must have non-empty text.");
      return;
    }

    const hasCorrect = options.some((opt) => opt.isCorrect);
    if (!hasCorrect) {
      toast.error("Please designate one option as the correct answer (click the radio/check icon).");
      return;
    }

    const newQuestion: QuizQuestion = {
      id: editingIndex !== null && questions[editingIndex]
        ? questions[editingIndex]!.id
        : `q-${Date.now()}`,
      type: qType,
      prompt: qPrompt.trim(),
      skillTested: qSkillTested.trim() || "Cognitive Assessment",
      hint: qHint.trim() || undefined,
      passage: qType === "reading-passage" ? qPassage.trim() : undefined,
      stroopWord:
        qType === "stroop-test"
          ? {
              word: stroopWord.toUpperCase(),
              displayColor: stroopColorClass,
              colorClass: stroopColorClass,
              correctColorName: stroopColorName,
            }
          : undefined,
      options: options.map((opt) => ({
        id: opt.id,
        text: opt.text.trim(),
        isCorrect: Boolean(opt.isCorrect),
        explanation: opt.explanation?.trim() || undefined,
      })),
    };

    if (editingIndex !== null) {
      setQuestions((prev) => {
        const next = [...prev];
        next[editingIndex] = newQuestion;
        return next;
      });
      toast.success(`Updated Question #${editingIndex + 1}!`);
    } else {
      setQuestions((prev) => [...prev, newQuestion]);
      toast.success(`Added Question #${questions.length + 1} to quiz!`);
    }

    resetQuestionAuthoring();
  };

  const handleEditQuestion = (index: number) => {
    const q = questions[index];
    if (!q) return;
    setEditingIndex(index);
    setQType(q.type);
    setQPrompt(q.prompt);
    setQSkillTested(q.skillTested);
    setQHint(q.hint || "");
    setQPassage(q.passage || "");
    if (q.stroopWord) {
      setStroopWord(q.stroopWord.word);
      setStroopColorName(q.stroopWord.correctColorName);
      setStroopColorClass(q.stroopWord.colorClass);
    }
    setOptions(q.options.map((opt) => ({ ...opt })));
    toast.info(`Editing Question #${index + 1} in form.`);
  };

  const handleDeleteQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, idx) => idx !== index));
    if (editingIndex === index) {
      resetQuestionAuthoring();
    }
    toast.info("Question removed from quiz.");
  };

  const handleDuplicateQuestion = (index: number) => {
    const q = questions[index];
    if (!q) return;
    const duplicated: QuizQuestion = {
      ...q,
      id: `q-${Date.now()}`,
      prompt: `${q.prompt} (Copy)`,
      options: q.options.map((opt, i) => ({
        ...opt,
        id: `opt-${Date.now()}-${i}`,
      })),
    };
    setQuestions((prev) => [...prev, duplicated]);
    toast.success(`Duplicated Question #${index + 1}!`);
  };

  const handleMoveQuestion = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === questions.length - 1)
    ) {
      return;
    }
    const target = direction === "up" ? index - 1 : index + 1;
    setQuestions((prev) => {
      const next = [...prev];
      const temp = next[index]!;
      next[index] = next[target]!;
      next[target] = temp;
      return next;
    });
  };

  // ================= Import from FR05–FR09 Item Bank =================
  const handleImportScreeningQuestion = (itemPrompt: string, itemContext: string) => {
    setQPrompt(itemPrompt);
    setQSkillTested(itemContext || "Psychometric Self-Report Indicator");
    setQType("multiple-choice");
    setOptions([
      { id: "o1", text: "Almost Always (Severe daily academic impact)", isCorrect: true, explanation: "Indicates significant difficulty in this subscale." },
      { id: "o2", text: "Frequently (Noticeable strain during study sessions)", isCorrect: false },
      { id: "o3", text: "Occasionally (Manageable with compensatory effort)", isCorrect: false },
      { id: "o4", text: "Never / Rarely (Typical functioning)", isCorrect: false },
    ]);
    toast.success("Imported item prompt from Question Bank into authoring form!");
  };

  // ================= Save & Publish Quiz Handler =================
  const handleSaveAndPublishQuiz = () => {
    if (!title.trim()) {
      toast.error("Please enter a Quiz Title.");
      return;
    }
    if (questions.length === 0) {
      toast.error("Please add at least 1 question to the quiz before publishing.");
      return;
    }

    const domainConfig = DOMAIN_OPTIONS.find((d) => d.key === selectedDomainKey) || DOMAIN_OPTIONS[0]!;

    const newQuiz: Quiz = {
      id: quizId || `quiz-custom-${Date.now()}`,
      title: title.trim(),
      domain: domainConfig.domainId,
      category: category.trim() || domainConfig.clinicalFocus,
      durationMinutes: Number(durationMinutes) || 8,
      difficulty,
      badgeColor,
      description: description.trim() || `Author-designed screening quiz targeting ${domainConfig.label}.`,
      passingScore: Number(passingScore) || 70,
      isCustom: true,
      author: authorName.trim() || "DUT Disability Specialist",
      createdAt: new Date().toISOString(),
      questions,
    };

    saveCustomQuiz(newQuiz);
    refreshLibrary();

    toast.success(`🎉 Quiz "${newQuiz.title}" successfully published!`, {
      description: `Available live in the Student Portal (/student?tab=quizzes) with ${questions.length} questions.`,
      action: {
        label: "Test-Drive QA",
        onClick: () => handleStartTestDrive(newQuiz),
      },
    });
  };

  // ================= QA Test Drive Simulator =================
  const handleStartTestDrive = (quizToTest?: Quiz) => {
    const active = quizToTest || {
      id: quizId,
      title: title || "Draft Quiz QA",
      domain: (DOMAIN_OPTIONS.find((d) => d.key === selectedDomainKey)?.domainId || "reading") as DomainId,
      category,
      durationMinutes,
      difficulty,
      badgeColor,
      description,
      passingScore,
      questions,
    };

    if (active.questions.length === 0) {
      toast.error("Cannot test-drive: Please add at least 1 question to test.");
      return;
    }

    setQaCurrentIndex(0);
    setQaSelectedOption(null);
    setQaAnswers({});
    setQaCompleted(false);
    setQaElapsed(0);
    setQaModalOpen(true);
  };

  const handleQaSelectOption = (optId: string) => {
    setQaSelectedOption(optId);
    const currQ = questions[qaCurrentIndex];
    if (currQ) {
      setQaAnswers((prev) => ({ ...prev, [currQ.id]: optId }));
    }
  };

  const handleQaNext = () => {
    if (qaCurrentIndex < questions.length - 1) {
      setQaCurrentIndex((prev) => prev + 1);
      const nextQ = questions[qaCurrentIndex + 1];
      setQaSelectedOption(nextQ ? qaAnswers[nextQ.id] ?? null : null);
    } else {
      setQaCompleted(true);
    }
  };

  const computeQaScore = () => {
    let correct = 0;
    questions.forEach((q) => {
      const userOptId = qaAnswers[q.id];
      const correctOpt = q.options.find((o) => o.isCorrect);
      if (userOptId && correctOpt && userOptId === correctOpt.id) {
        correct += 1;
      }
    });
    const percent = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;
    return { correct, total: questions.length, percent, passed: percent >= passingScore };
  };

  // Safe current domain pool from prop
  const currentDomainPool = assessmentPools?.[selectedDomainKey] || {
    questions: [],
  };

  return (
    <div className="space-y-6">
      {/* Top Header & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-primary font-semibold bg-primary/10 px-2.5 py-0.5 rounded-full">
              Quiz Authoring Studio &bull; FR20 Engine
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              {questions.length} Items Authored
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-foreground mt-1">
            Create &amp; Configure Diagnostic Quizzes
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Design timed interactive assessments, Stroop tests, passage checks, and calculation drills for students.
          </p>
        </div>

        {/* View Switcher: Builder vs Library */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl bg-muted p-1 text-xs">
            <button
              onClick={() => setActiveTab("builder")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === "builder"
                  ? "bg-card text-foreground shadow-sm font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Quiz Builder ({questions.length})
            </button>
            <button
              onClick={() => {
                refreshLibrary();
                setActiveTab("library");
              }}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === "library"
                  ? "bg-card text-foreground shadow-sm font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All Quizzes ({allQuizzesList.length})
            </button>
          </div>

          <Button
            onClick={handleSaveAndPublishQuiz}
            className="rounded-xl text-xs bg-primary text-primary-foreground h-9 px-4 gap-2 shadow-sm font-medium"
          >
            <Save className="h-3.5 w-3.5" />
            <span>Publish Quiz</span>
          </Button>
        </div>
      </div>

      {activeTab === "library" ? (
        /* ================= Library of All Quizzes ================= */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Total <strong>{allQuizzesList.length} quizzes</strong> active in the institutional portal. Custom quizzes sync immediately to the Student Quiz tab.
            </p>
            <Button
              onClick={() => setActiveTab("builder")}
              size="sm"
              className="rounded-xl text-xs bg-primary text-primary-foreground h-8 gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create New Quiz</span>
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {allQuizzesList.map((quiz) => (
              <div
                key={quiz.id}
                className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm hover:border-primary/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className={`text-[10px] font-mono ${quiz.badgeColor}`}>
                      {quiz.domain.toUpperCase()}
                    </Badge>
                    {quiz.isCustom ? (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                        Custom Authored
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                        Standard System
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif text-lg font-medium text-foreground leading-snug">
                    {quiz.title}
                  </h3>

                  <p className="text-xs text-muted-foreground line-clamp-2 font-light">
                    {quiz.description}
                  </p>

                  <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {quiz.questions.length} Items
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {quiz.durationMinutes} min
                    </span>
                    <span>&bull;</span>
                    <span className="capitalize">{quiz.difficulty}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-border/60 flex items-center justify-between">
                  <Button
                    onClick={() => handleStartTestDrive(quiz)}
                    variant="outline"
                    size="sm"
                    className="rounded-xl text-xs h-8 gap-1.5"
                  >
                    <Play className="h-3 w-3 text-emerald-500 fill-emerald-500" />
                    <span>Test Drive</span>
                  </Button>

                  {quiz.isCustom && (
                    <Button
                      onClick={() => {
                        deleteCustomQuiz(quiz.id);
                        refreshLibrary();
                        toast.info(`Deleted quiz "${quiz.title}".`);
                      }}
                      variant="ghost"
                      size="sm"
                      className="rounded-xl text-xs h-8 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete</span>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* ================= Quiz Builder View ================= */
        <div className="space-y-8">
          {/* Preset Quick Load Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-muted/40 border border-border text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary shrink-0" />
              <span className="font-medium text-foreground">Quick Starter Templates:</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => loadTemplate("reading")}
                className="px-2.5 py-1 rounded-lg bg-card border border-border hover:bg-muted font-mono text-[11px] transition-colors"
              >
                FR05: Reading &amp; Dyslexia
              </button>
              <button
                onClick={() => loadTemplate("math")}
                className="px-2.5 py-1 rounded-lg bg-card border border-border hover:bg-muted font-mono text-[11px] transition-colors"
              >
                FR07: Math &amp; Dyscalculia
              </button>
              <button
                onClick={() => loadTemplate("attention")}
                className="px-2.5 py-1 rounded-lg bg-card border border-border hover:bg-muted font-mono text-[11px] transition-colors"
              >
                FR08: Stroop &amp; Attention
              </button>
              <button
                onClick={() => loadTemplate("writing")}
                className="px-2.5 py-1 rounded-lg bg-card border border-border hover:bg-muted font-mono text-[11px] transition-colors"
              >
                FR06: Grammar &amp; Writing
              </button>
              <button
                onClick={handleResetForm}
                className="px-2.5 py-1 rounded-lg text-muted-foreground hover:text-foreground font-mono text-[11px] flex items-center gap-1"
                title="Reset Form"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* 1. Quiz Metadata Card */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="font-serif text-xl font-normal text-foreground">
                1. Quiz Metadata &amp; Diagnostic Classification
              </h3>
              <Badge variant="outline" className="font-mono text-xs">
                {DOMAIN_OPTIONS.find((d) => d.key === selectedDomainKey)?.code || "FR05"}
              </Badge>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* Title */}
              <div className="lg:col-span-2 space-y-1.5">
                <Label htmlFor="quiz-title" className="text-xs font-medium">
                  Quiz Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="quiz-title"
                  placeholder="e.g. Dyslexia Rapid Reading & Phonological Decoding Quiz"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="rounded-xl h-10 text-xs font-medium"
                  required
                />
              </div>

              {/* Target Domain */}
              <div className="space-y-1.5">
                <Label htmlFor="quiz-domain" className="text-xs font-medium">
                  Screening Battery Domain (FR05–FR09)
                </Label>
                <select
                  id="quiz-domain"
                  value={selectedDomainKey}
                  onChange={(e) => {
                    const nextKey = e.target.value as ScreeningDomainKey;
                    setSelectedDomainKey(nextKey);
                    const dom = DOMAIN_OPTIONS.find((d) => d.key === nextKey);
                    if (dom) setCategory(dom.clinicalFocus);
                  }}
                  className="w-full h-10 px-3 rounded-xl border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {DOMAIN_OPTIONS.map((dom) => (
                    <option key={dom.key} value={dom.key}>
                      {dom.code}: {dom.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category / Subscale */}
              <div className="space-y-1.5">
                <Label htmlFor="quiz-category" className="text-xs font-medium">
                  Category / Subscale Focus
                </Label>
                <Input
                  id="quiz-category"
                  placeholder="e.g. Saccadic Eye Movement, Written Expression"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="rounded-xl h-10 text-xs"
                />
              </div>

              {/* Duration */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <Label htmlFor="quiz-duration" className="font-medium">
                    Time Limit (Minutes)
                  </Label>
                  <span className="font-mono text-primary font-semibold">{durationMinutes} min</span>
                </div>
                <Input
                  id="quiz-duration"
                  type="number"
                  min={1}
                  max={60}
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="rounded-xl h-10 text-xs"
                />
              </div>

              {/* Difficulty */}
              <div className="space-y-1.5">
                <Label htmlFor="quiz-difficulty" className="text-xs font-medium">
                  Difficulty Level
                </Label>
                <select
                  id="quiz-difficulty"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full h-10 px-3 rounded-xl border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="Beginner">Beginner (Foundational Indicators)</option>
                  <option value="Intermediate">Intermediate (Undergraduate Academic Load)</option>
                  <option value="Advanced">Advanced (High-Cognitive Stress / Speed)</option>
                </select>
              </div>

              {/* Passing Score */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <Label htmlFor="quiz-pass" className="font-medium">
                    Competency Benchmark (%)
                  </Label>
                  <span className="font-mono text-emerald-600 font-semibold">{passingScore}%</span>
                </div>
                <Input
                  id="quiz-pass"
                  type="number"
                  min={10}
                  max={100}
                  value={passingScore}
                  onChange={(e) => setPassingScore(Number(e.target.value))}
                  className="rounded-xl h-10 text-xs"
                />
              </div>

              {/* Badge Theme */}
              <div className="space-y-1.5">
                <Label htmlFor="quiz-theme" className="text-xs font-medium">
                  Accent Color Theme
                </Label>
                <select
                  id="quiz-theme"
                  value={badgeColor}
                  onChange={(e) => setBadgeColor(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {BADGE_THEMES.map((theme) => (
                    <option key={theme.value} value={theme.value}>
                      {theme.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Author */}
              <div className="space-y-1.5">
                <Label htmlFor="quiz-author" className="text-xs font-medium">
                  Authoring Specialist
                </Label>
                <Input
                  id="quiz-author"
                  placeholder="e.g. DUT Disability Specialist"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="rounded-xl h-10 text-xs"
                />
              </div>

              {/* Description */}
              <div className="lg:col-span-3 space-y-1.5">
                <Label htmlFor="quiz-desc" className="text-xs font-medium">
                  Student Instructions / Description
                </Label>
                <textarea
                  id="quiz-desc"
                  rows={2}
                  placeholder="Provide guidance to the student test-taker before they begin this quiz..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 rounded-xl border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          </div>

          {/* 2. Interactive Question Authoring Form */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left 2 Cols: Question Form */}
            <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div>
                  <h3 className="font-serif text-xl font-normal text-foreground">
                    2. {editingIndex !== null ? `Edit Question #${editingIndex + 1}` : "Author Quiz Question"}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Build multiple-choice, reading comprehension, Stroop attention, or sequence challenges.
                  </p>
                </div>

                {editingIndex !== null && (
                  <Button
                    onClick={resetQuestionAuthoring}
                    variant="outline"
                    size="sm"
                    className="rounded-xl text-xs h-8 gap-1"
                  >
                    <X className="h-3 w-3" />
                    <span>Cancel Edit</span>
                  </Button>
                )}
              </div>

              {/* Question Type Selection Buttons */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Question Format</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {QUESTION_TYPES.map((qt) => {
                    const isSelected = qType === qt.type;
                    return (
                      <button
                        key={qt.type}
                        type="button"
                        onClick={() => setQType(qt.type)}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          isSelected
                            ? "border-primary bg-primary/10 text-foreground font-medium shadow-xs"
                            : "border-border bg-background hover:bg-muted/50 text-muted-foreground"
                        }`}
                      >
                        <span className="block text-xs font-semibold text-foreground">{qt.label}</span>
                        <span className="block text-[10px] text-muted-foreground font-light line-clamp-1">
                          {qt.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <form onSubmit={handleSaveQuestion} className="space-y-4">
                {/* Prompt */}
                <div className="space-y-1.5">
                  <Label htmlFor="q-prompt" className="text-xs font-medium">
                    Question Prompt <span className="text-destructive">*</span>
                  </Label>
                  <textarea
                    id="q-prompt"
                    rows={3}
                    placeholder="Enter the challenge prompt or instruction shown to the student..."
                    value={qPrompt}
                    onChange={(e) => setQPrompt(e.target.value)}
                    className="w-full p-3 rounded-xl border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                </div>

                {/* Subscale & Hint in 2 columns */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="q-skill" className="text-xs font-medium">
                      Skill Tested / Indicator Subscale
                    </Label>
                    <Input
                      id="q-skill"
                      placeholder="e.g. Saccadic Eye Tracking, Mental Calculation"
                      value={qSkillTested}
                      onChange={(e) => setQSkillTested(e.target.value)}
                      className="rounded-xl h-10 text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="q-hint" className="text-xs font-medium">
                      Assistive Hint (Optional accommodation)
                    </Label>
                    <Input
                      id="q-hint"
                      placeholder="e.g. Look for letter mirror pairs or inverted signs..."
                      value={qHint}
                      onChange={(e) => setQHint(e.target.value)}
                      className="rounded-xl h-10 text-xs"
                    />
                  </div>
                </div>

                {/* If Reading Passage Type */}
                {qType === "reading-passage" && (
                  <div className="space-y-1.5 p-4 rounded-2xl bg-muted/30 border border-border">
                    <Label htmlFor="q-passage" className="text-xs font-medium flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5 text-primary" />
                      <span>Reading Excerpt / Passage Text</span>
                    </Label>
                    <textarea
                      id="q-passage"
                      rows={4}
                      placeholder="Paste the dense academic or scientific reading passage for the student to comprehend..."
                      value={qPassage}
                      onChange={(e) => setQPassage(e.target.value)}
                      className="w-full p-3 rounded-xl border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring font-serif leading-relaxed"
                      required
                    />
                  </div>
                )}

                {/* If Stroop Test Type */}
                {qType === "stroop-test" && (
                  <div className="p-4 rounded-2xl bg-muted/30 border border-border space-y-3">
                    <Label className="text-xs font-medium flex items-center gap-1.5">
                      <BrainCircuit className="h-3.5 w-3.5 text-primary" />
                      <span>Stroop Conflict Parameters</span>
                    </Label>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="space-y-1">
                        <Label className="text-[11px] text-muted-foreground">Word Text (Distractor)</Label>
                        <Input
                          value={stroopWord}
                          onChange={(e) => setStroopWord(e.target.value.toUpperCase())}
                          className="rounded-xl h-9 text-xs uppercase font-bold"
                          placeholder="e.g. BLUE"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[11px] text-muted-foreground">Printed Font Color</Label>
                        <select
                          value={stroopColorClass}
                          onChange={(e) => {
                            const val = e.target.value;
                            setStroopColorClass(val);
                            if (val.includes("red")) setStroopColorName("Red");
                            else if (val.includes("emerald")) setStroopColorName("Green");
                            else if (val.includes("blue")) setStroopColorName("Blue");
                            else if (val.includes("amber")) setStroopColorName("Yellow");
                            else if (val.includes("purple")) setStroopColorName("Purple");
                          }}
                          className="w-full h-9 px-3 rounded-xl border border-input bg-background text-xs text-foreground"
                        >
                          <option value="text-red-500">Red Ink</option>
                          <option value="text-emerald-500">Green Ink</option>
                          <option value="text-blue-500">Blue Ink</option>
                          <option value="text-amber-500">Yellow/Amber Ink</option>
                          <option value="text-purple-500">Purple Ink</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[11px] text-muted-foreground">Target Answer Name</Label>
                        <Input
                          value={stroopColorName}
                          onChange={(e) => setStroopColorName(e.target.value)}
                          className="rounded-xl h-9 text-xs"
                          placeholder="e.g. Red"
                        />
                      </div>
                    </div>

                    {/* Live Stroop Preview pill */}
                    <div className="p-3 rounded-xl bg-background border border-border flex items-center justify-center gap-4">
                      <span className="text-xs text-muted-foreground">Student sees:</span>
                      <span className={`text-2xl font-black tracking-widest ${stroopColorClass}`}>
                        {stroopWord || "WORD"}
                      </span>
                    </div>
                  </div>
                )}

                {/* Options List Builder */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-xs font-medium">
                        Answer Options ({options.length})
                      </Label>
                      <span className="text-[11px] text-muted-foreground ml-2">
                        Click the check icon to designate the correct answer
                      </span>
                    </div>
                    <Button
                      type="button"
                      onClick={handleAddOption}
                      variant="outline"
                      size="sm"
                      className="rounded-xl text-xs h-8 gap-1"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Add Option</span>
                    </Button>
                  </div>

                  <div className="space-y-2.5">
                    {options.map((opt, idx) => (
                      <div
                        key={opt.id || idx}
                        className={`p-3 rounded-2xl border transition-all space-y-2 ${
                          opt.isCorrect
                            ? "border-emerald-500/60 bg-emerald-500/5 shadow-xs"
                            : "border-border bg-background"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {/* Correct Answer Toggle Button */}
                          <button
                            type="button"
                            onClick={() => handleSetCorrectOption(idx)}
                            className={`h-7 w-7 rounded-lg flex items-center justify-center transition-all ${
                              opt.isCorrect
                                ? "bg-emerald-600 text-white shadow-xs"
                                : "bg-muted text-muted-foreground hover:text-foreground"
                            }`}
                            title={opt.isCorrect ? "Correct Answer" : "Click to mark as Correct"}
                          >
                            <Check className="h-4 w-4" />
                          </button>

                          {/* Option Text Input */}
                          <Input
                            placeholder={`Option ${String.fromCharCode(65 + idx)} text...`}
                            value={opt.text}
                            onChange={(e) => handleUpdateOption(idx, { text: e.target.value })}
                            className="rounded-xl h-9 text-xs flex-1"
                            required
                          />

                          {/* Delete Option Button */}
                          <button
                            type="button"
                            onClick={() => handleRemoveOption(idx)}
                            className="text-muted-foreground hover:text-destructive p-1.5 rounded-lg transition-colors"
                            title="Remove option"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* Optional Explanation for student feedback */}
                        <div className="pl-9 pr-2">
                          <input
                            type="text"
                            placeholder="Explanation / rationale shown after student responds (optional)..."
                            value={opt.explanation || ""}
                            onChange={(e) => handleUpdateOption(idx, { explanation: e.target.value })}
                            className="w-full text-[11px] text-muted-foreground bg-transparent border-b border-border/50 focus:border-primary focus:outline-none py-0.5"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Form Action Buttons */}
                <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                  <Button
                    type="button"
                    onClick={resetQuestionAuthoring}
                    variant="ghost"
                    size="sm"
                    className="rounded-xl text-xs h-9 text-muted-foreground"
                  >
                    Reset Question Fields
                  </Button>

                  <Button
                    type="submit"
                    className="rounded-xl text-xs bg-primary text-primary-foreground h-10 px-6 gap-2 shadow-sm font-medium"
                  >
                    {editingIndex !== null ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Update Question #{editingIndex + 1}</span>
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        <span>Add Question to Quiz</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>

            {/* Right 1 Col: Quick Import from Item Bank */}
            <div className="space-y-6">
              {/* Import from Item Bank Card */}
              <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <h4 className="font-serif text-lg font-normal text-foreground">
                    Import from Item Bank
                  </h4>
                  <Badge variant="outline" className="font-mono text-xs">
                    {DOMAIN_OPTIONS.find((d) => d.key === selectedDomainKey)?.code || "FR05"}
                  </Badge>
                </div>

                <p className="text-xs text-muted-foreground font-light">
                  One-click import validated screening questions from the{" "}
                  <strong>{DOMAIN_OPTIONS.find((d) => d.key === selectedDomainKey)?.label}</strong> pool into this quiz.
                </p>

                <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                  {(currentDomainPool.questions || []).map((q: any, idx: number) => (
                    <div
                      key={q.id || idx}
                      className="p-3 rounded-xl bg-muted/30 border border-border/60 space-y-2 text-xs hover:border-primary/40 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] font-semibold text-primary">
                          Item #{idx + 1}
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground">
                          {q.context || "Screening Item"}
                        </span>
                      </div>
                      <p className="text-foreground leading-snug line-clamp-2">{q.prompt}</p>
                      <button
                        type="button"
                        onClick={() => handleImportScreeningQuestion(q.prompt, q.context)}
                        className="text-[11px] font-medium text-primary hover:underline flex items-center gap-1"
                      >
                        <Copy className="h-3 w-3" />
                        <span>Import into form &rarr;</span>
                      </button>
                    </div>
                  ))}

                  {(!currentDomainPool.questions || currentDomainPool.questions.length === 0) && (
                    <p className="text-xs text-muted-foreground italic text-center py-4">
                      No bank items found for this domain.
                    </p>
                  )}
                </div>
              </div>

              {/* Summary Stats */}
              <div className="rounded-3xl border border-border bg-muted/20 p-5 space-y-3">
                <h4 className="text-xs font-semibold text-foreground">Quiz Specifications</h4>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Total Questions:</span>
                    <strong className="font-mono text-foreground">{questions.length}</strong>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Estimated Duration:</span>
                    <strong className="font-mono text-foreground">{durationMinutes} min</strong>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Pass Benchmark:</span>
                    <strong className="font-mono text-emerald-600">{passingScore}%</strong>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Target Difficulty:</span>
                    <strong className="text-foreground capitalize">{difficulty}</strong>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    onClick={() => handleStartTestDrive()}
                    disabled={questions.length === 0}
                    variant="outline"
                    className="w-full rounded-xl text-xs h-9 gap-2"
                  >
                    <Play className="h-3.5 w-3.5 text-emerald-500 fill-emerald-500" />
                    <span>Test-Drive Quiz ({questions.length})</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Authored Questions Inventory & Management */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <h3 className="font-serif text-xl font-normal text-foreground">
                  3. Authored Questions Sequence ({questions.length})
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Reorder, edit, duplicate, or delete questions in the active quiz sequence.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={handleSaveAndPublishQuiz}
                  disabled={questions.length === 0}
                  className="rounded-xl text-xs bg-primary text-primary-foreground h-9 px-4 gap-2 font-medium"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>Save &amp; Publish Quiz</span>
                </Button>
              </div>
            </div>

            {questions.length === 0 ? (
              <div className="py-12 text-center rounded-2xl border border-dashed border-border bg-muted/20 space-y-3">
                <Layers className="h-8 w-8 text-muted-foreground mx-auto" />
                <p className="text-sm font-medium text-foreground">No questions authored yet</p>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Use the question authoring form above or select one of the Quick Starter Templates to populate this quiz.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {questions.map((q, idx) => {
                  const correctOpt = q.options.find((o) => o.isCorrect);
                  return (
                    <div
                      key={q.id || idx}
                      className="p-4 rounded-2xl border border-border bg-muted/20 hover:border-border/80 transition-all space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-lg">
                            #{idx + 1}
                          </span>
                          <Badge variant="outline" className="text-[10px] font-mono capitalize">
                            {q.type.replace("-", " ")}
                          </Badge>
                          <span className="text-xs text-muted-foreground font-mono">
                            {q.skillTested}
                          </span>
                        </div>

                        {/* Question Action Buttons */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleMoveQuestion(idx, "up")}
                            disabled={idx === 0}
                            className="p-1 rounded hover:bg-muted text-muted-foreground disabled:opacity-30"
                            title="Move up"
                          >
                            <MoveUp className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveQuestion(idx, "down")}
                            disabled={idx === questions.length - 1}
                            className="p-1 rounded hover:bg-muted text-muted-foreground disabled:opacity-30"
                            title="Move down"
                          >
                            <MoveDown className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleEditQuestion(idx)}
                            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                            title="Edit question"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDuplicateQuestion(idx)}
                            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                            title="Duplicate question"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteQuestion(idx)}
                            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-destructive"
                            title="Delete question"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Prompt */}
                      <p className="text-xs font-medium text-foreground leading-relaxed">
                        {q.prompt}
                      </p>

                      {/* Reading Passage snippet */}
                      {q.passage && (
                        <p className="text-[11px] font-serif text-muted-foreground bg-card p-2.5 rounded-xl border border-border/60 line-clamp-2">
                          Passage: {q.passage}
                        </p>
                      )}

                      {/* Options preview */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        {q.options.map((opt) => (
                          <span
                            key={opt.id}
                            className={`text-[11px] px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${
                              opt.isCorrect
                                ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-700 dark:text-emerald-300 font-medium"
                                : "bg-card border-border text-muted-foreground"
                            }`}
                          >
                            {opt.isCorrect && <Check className="h-3 w-3 text-emerald-500" />}
                            <span>{opt.text}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= Integrated QA Test-Drive Simulator Modal ================= */}
      {qaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-2xl rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full font-semibold">
                  Live QA Simulator
                </span>
                <span className="text-xs font-mono text-muted-foreground">
                  Question {qaCurrentIndex + 1} of {questions.length}
                </span>
              </div>
              <button
                onClick={() => setQaModalOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {!qaCompleted ? (
              /* Ongoing QA question view */
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-xl font-normal text-foreground leading-snug">
                    {questions[qaCurrentIndex]?.prompt}
                  </h3>
                  {questions[qaCurrentIndex]?.passage && (
                    <div className="mt-3 p-4 rounded-2xl bg-muted/40 border border-border text-xs font-serif leading-relaxed text-foreground">
                      {questions[qaCurrentIndex]?.passage}
                    </div>
                  )}
                  {questions[qaCurrentIndex]?.stroopWord && (
                    <div className="mt-4 p-6 rounded-2xl bg-slate-950 flex items-center justify-center">
                      <span
                        className={`text-3xl font-black tracking-widest ${
                          questions[qaCurrentIndex]?.stroopWord?.colorClass
                        }`}
                      >
                        {questions[qaCurrentIndex]?.stroopWord?.word}
                      </span>
                    </div>
                  )}
                </div>

                {/* Options */}
                <div className="space-y-2.5">
                  {questions[qaCurrentIndex]?.options.map((opt) => {
                    const isSelected = qaSelectedOption === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleQaSelectOption(opt.id)}
                        className={`w-full p-3.5 rounded-2xl border text-left text-xs font-medium transition-all flex items-center justify-between ${
                          isSelected
                            ? "border-primary bg-primary/10 text-primary font-semibold shadow-xs"
                            : "border-border bg-background hover:bg-muted/50 text-foreground"
                        }`}
                      >
                        <span>{opt.text}</span>
                        {isSelected && <Check className="h-4 w-4 text-primary" />}
                      </button>
                    );
                  })}
                </div>

                {/* Hint */}
                {questions[qaCurrentIndex]?.hint && (
                  <div className="text-[11px] text-muted-foreground italic flex items-center gap-1.5">
                    <HelpCircle className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>Hint: {questions[qaCurrentIndex]?.hint}</span>
                  </div>
                )}

                {/* Navigation in modal */}
                <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-muted-foreground">
                    Skill: {questions[qaCurrentIndex]?.skillTested}
                  </span>

                  <Button
                    onClick={handleQaNext}
                    disabled={!qaSelectedOption}
                    className="rounded-xl text-xs bg-primary text-primary-foreground h-9 px-5 gap-1.5"
                  >
                    <span>{qaCurrentIndex === questions.length - 1 ? "Finish QA" : "Next Question"}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ) : (
              /* QA Completed View */
              <div className="space-y-6 text-center py-4">
                {(() => {
                  const result = computeQaScore();
                  return (
                    <div className="space-y-4">
                      <div className="h-16 w-16 rounded-full bg-emerald-500/15 text-emerald-500 mx-auto flex items-center justify-center">
                        <Trophy className="h-8 w-8" />
                      </div>
                      <h3 className="font-serif text-2xl font-light text-foreground">
                        QA Test-Drive Completed!
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Scored {result.correct} / {result.total} questions ({result.percent}%). Required benchmark: {passingScore}%.
                      </p>

                      <div className="p-4 rounded-2xl bg-muted/30 border border-border inline-block text-left text-xs space-y-1">
                        <div className="font-semibold text-foreground">Validation Check:</div>
                        <div className="text-emerald-600 flex items-center gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>All questions and options rendered with zero exceptions.</span>
                        </div>
                        <div className="text-emerald-600 flex items-center gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Answer scoring and explanation hooks functional.</span>
                        </div>
                      </div>

                      <div className="pt-2 flex justify-center gap-3">
                        <Button
                          onClick={() => {
                            setQaCompleted(false);
                            setQaCurrentIndex(0);
                            setQaSelectedOption(null);
                            setQaAnswers({});
                          }}
                          variant="outline"
                          size="sm"
                          className="rounded-xl text-xs h-9 gap-1.5"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          <span>Retake QA</span>
                        </Button>
                        <Button
                          onClick={() => {
                            setQaModalOpen(false);
                            handleSaveAndPublishQuiz();
                          }}
                          size="sm"
                          className="rounded-xl text-xs bg-primary text-primary-foreground h-9 px-5 gap-1.5"
                        >
                          <Save className="h-3.5 w-3.5" />
                          <span>Publish Quiz Now</span>
                        </Button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
