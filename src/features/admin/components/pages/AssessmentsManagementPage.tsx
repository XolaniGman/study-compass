import React, { useState } from "react";
import {
  PlusCircle,
  Sliders,
  Eye,
  Scale,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  BookOpen,
  HelpCircle,
  BarChart3,
  Activity,
  ShieldCheck,
} from "lucide-react";
import { useInstitutional } from "../../../shared/context/InstitutionalContext";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Badge } from "../../../../components/ui/badge";
import { toast } from "sonner";
import type { ScreeningDomainKey, AssessmentPoolItem } from "../../../shared/types";

interface AssessmentsManagementPageProps {
  initialSubtab?: string;
  onNavigateToOverview?: () => void;
  onSubtabChange?: (subtab: string) => void;
}

const DOMAIN_METADATA: Record<
  ScreeningDomainKey,
  { code: string; title: string; shortName: string; description: string; clinicalFocus: string }
> = {
  reading: {
    code: "FR05",
    title: "Reading & Lexical Processing",
    shortName: "Reading & Dyslexia",
    description: "Visual-lexical tracking, word decoding efficiency, and reading stamina.",
    clinicalFocus: "Dyslexia / Phonological Screening",
  },
  grammar: {
    code: "FR06",
    title: "Grammar & Syntax Formulation",
    shortName: "Grammar & Dysgraphia",
    description: "Syntactic sequencing, inflectional morphology, and written sentence construction.",
    clinicalFocus: "Dysgraphia / Written Expression",
  },
  mathematics: {
    code: "FR07",
    title: "Mathematics & Quantitative Reasoning",
    shortName: "Math & Dyscalculia",
    description: "Spatial numbers, arithmetic sequencing, and formula calculation.",
    clinicalFocus: "Dyscalculia / Numerical Cognition",
  },
  memory: {
    code: "FR08",
    title: "Working Memory & Processing Endurance",
    shortName: "Memory & Attention",
    description: "Auditory retention, multi-step instruction holding, and cognitive load.",
    clinicalFocus: "Executive Function / ADHD Indicators",
  },
  comprehension: {
    code: "FR09",
    title: "Text Comprehension & Macrostructure",
    shortName: "Comprehension & Synthesis",
    description: "Inference deduction, implicit meaning, and conceptual integration.",
    clinicalFocus: "Cognitive Processing & Synthesis",
  },
};

export function AssessmentsManagementPage({
  initialSubtab = "create-assessment",
  onNavigateToOverview,
  onSubtabChange,
}: AssessmentsManagementPageProps) {
  const {
    assessmentPools = {} as Record<ScreeningDomainKey, AssessmentPoolItem>,
    addQuestionToPool,
    scoringConfig,
    updateThresholds,
    updateWeightings,
    activeModules,
  } = useInstitutional();

  const [activeSubtab, setActiveSubtab] = useState<string>(initialSubtab);

  React.useEffect(() => {
    if (initialSubtab) {
      setActiveSubtab(initialSubtab);
    }
  }, [initialSubtab]);

  const handleSelectSubtab = (id: string) => {
    setActiveSubtab(id);
    if (onSubtabChange) onSubtabChange(id);
  };

  // Subtabs configuration matching exact reference UI style
  const subTabs = [
    {
      id: "create-assessment",
      label: "Create Assessment",
      icon: <PlusCircle className="h-4 w-4" />,
      badge: "Question Bank",
    },
    {
      id: "edit-indicators",
      label: "Edit Indicators",
      icon: <Sliders className="h-4 w-4" />,
      badge: "Thresholds",
    },
    {
      id: "preview-flow",
      label: "Preview Flow",
      icon: <Eye className="h-4 w-4" />,
      badge: "Student QA",
    },
    {
      id: "set-weightings",
      label: "Set Weightings",
      icon: <Scale className="h-4 w-4" />,
      badge: "Formula",
    },
  ];

  // ================= State for Create Assessment =================
  const [selectedDomain, setSelectedDomain] = useState<ScreeningDomainKey>("reading");
  const [questionPrompt, setQuestionPrompt] = useState("");
  const [questionContext, setQuestionContext] = useState("Academic Study");
  const [questionType, setQuestionType] = useState<
    "frequency-scale" | "impact-scale" | "accuracy-scale"
  >("frequency-scale");

  const handleAddQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionPrompt.trim()) {
      toast.error("Please enter the screening question prompt.");
      return;
    }

    addQuestionToPool(selectedDomain, {
      prompt: questionPrompt.trim(),
      context: questionContext.trim() || "Academic Study",
      type: questionType,
    });

    toast.success(
      `New screening item added to ${DOMAIN_METADATA[selectedDomain].title} question bank!`
    );
    setQuestionPrompt("");
    setQuestionContext("Academic Study");
  };

  // Safe question pool for the selected authoring domain
  const authoringPool = assessmentPools?.[selectedDomain] || {
    domain: selectedDomain,
    code: DOMAIN_METADATA[selectedDomain]?.code || "FR05",
    title: DOMAIN_METADATA[selectedDomain]?.title || "Screening Pool",
    shortName: DOMAIN_METADATA[selectedDomain]?.shortName || "Domain",
    description: "",
    estimatedMinutes: 5,
    questions: [],
  };

  // ================= State for Edit Indicators =================
  const [highThreshold, setHighThreshold] = useState<number>(
    scoringConfig?.thresholds?.high ?? 40
  );
  const [moderateThreshold, setModerateThreshold] = useState<number>(
    scoringConfig?.thresholds?.moderate ?? 60
  );

  const handleSaveThresholds = () => {
    updateThresholds({
      high: highThreshold,
      moderate: moderateThreshold,
    });
    toast.success(
      "Screening indicator thresholds updated live! Student triage queue and classifications re-evaluated."
    );
  };

  const handleResetThresholds = () => {
    setHighThreshold(40);
    setModerateThreshold(60);
    updateThresholds({ high: 40, moderate: 60 });
    toast.info("Thresholds reset to institutional defaults (High: 40%, Moderate: 60%).");
  };

  // ================= State for Weightings =================
  const [weights, setWeights] = useState<Record<ScreeningDomainKey, number>>({
    reading: scoringConfig?.weightings?.reading ?? 1,
    grammar: scoringConfig?.weightings?.grammar ?? 1,
    mathematics: scoringConfig?.weightings?.mathematics ?? 1,
    memory: scoringConfig?.weightings?.memory ?? 1,
    comprehension: scoringConfig?.weightings?.comprehension ?? 1,
  });

  const totalRawWeight =
    (weights.reading || 1) +
    (weights.grammar || 1) +
    (weights.mathematics || 1) +
    (weights.memory || 1) +
    (weights.comprehension || 1);

  const handleSaveWeightings = () => {
    updateWeightings(weights);
    toast.success("Domain weightings committed! Composite scoring algorithm recalculated.");
  };

  const handleEqualizeWeightings = () => {
    const equalized: Record<ScreeningDomainKey, number> = {
      reading: 1,
      grammar: 1,
      mathematics: 1,
      memory: 1,
      comprehension: 1,
    };
    setWeights(equalized);
    updateWeightings(equalized);
    toast.info("All domain weights equalized to balanced 1.0x factor.");
  };

  // ================= State for Preview Flow (Interactive QA) =================
  const [previewDomain, setPreviewDomain] = useState<ScreeningDomainKey>("reading");
  const [previewAnswers, setPreviewAnswers] = useState<Record<string, number>>({});

  // Safe current preview pool with fallback
  const currentPool =
    assessmentPools?.[previewDomain] ||
    assessmentPools?.reading ||
    (Object.values(assessmentPools || {})[0] as AssessmentPoolItem) || {
      domain: previewDomain,
      code: "FR05",
      title: "Reading Screener",
      shortName: "Reading",
      description: "",
      estimatedMinutes: 5,
      questions: [],
    };

  const previewQuestions = currentPool?.questions ?? [];

  const handlePreviewAnswer = (qId: string, val: number) => {
    setPreviewAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const calculatePreviewScore = () => {
    if (!previewQuestions || previewQuestions.length === 0) {
      return { raw: 0, percentage: 0, classification: "Low Risk / Typical", badgeColor: "emerald" };
    }

    let totalScore = 0;
    const maxPossible = previewQuestions.length * 5;

    previewQuestions.forEach((q) => {
      const ans = previewAnswers[q.id] || 3;
      totalScore += ans;
    });

    const percentage = Math.round((totalScore / maxPossible) * 100);

    // High risk: score <= highThreshold (e.g. <= 40)
    // Moderate risk: score <= moderateThreshold (e.g. <= 60)
    // Low risk: score > moderateThreshold (e.g. > 60)
    let classification = "Low Risk / Typical Profile";
    let badgeColor = "emerald";

    if (percentage <= highThreshold) {
      classification = "High Priority / Clinical Indicator";
      badgeColor = "destructive";
    } else if (percentage <= moderateThreshold) {
      classification = "Moderate Variation / Support Indicated";
      badgeColor = "amber";
    }

    return { raw: totalScore, percentage, classification, badgeColor };
  };

  const previewResult = calculatePreviewScore();

  return (
    <div className="space-y-6">
      {/* Horizontal Sub-Tabs Bar — Exactly Matching Reference Screenshot */}
      <div className="flex overflow-x-auto no-scrollbar gap-1.5 pt-1 pb-2 border-b border-border/70">
        {subTabs.map((tab) => {
          const isActive = activeSubtab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleSelectSubtab(tab.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm font-semibold"
                  : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                    isActive ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Sub-Tab 1: Create Assessment (Question Bank Authoring) */}
      {activeSubtab === "create-assessment" && (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-border/60 pb-4">
              <h2 className="font-serif text-2xl font-normal text-foreground">
                Author Psychometric Screening Item
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Add validated self-report screening questions to the 5 diagnostic domain pools
                (FR05–FR09).
              </p>
            </div>

            <form onSubmit={handleAddQuestionSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="domain" className="text-xs font-medium">
                    Screening Battery Domain (FR05–FR09)
                  </Label>
                  <select
                    id="domain"
                    value={selectedDomain}
                    onChange={(e) =>
                      setSelectedDomain(e.target.value as ScreeningDomainKey)
                    }
                    className="w-full h-10 px-3 rounded-xl border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {(Object.keys(DOMAIN_METADATA) as ScreeningDomainKey[]).map((dom) => (
                      <option key={dom} value={dom}>
                        {DOMAIN_METADATA[dom].code}: {DOMAIN_METADATA[dom].title} (
                        {DOMAIN_METADATA[dom].clinicalFocus})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="context" className="text-xs font-medium">
                    Diagnostic Context / Subscale Tag
                  </Label>
                  <Input
                    id="context"
                    placeholder="e.g. Timed reading speed, Orthographic memory"
                    value={questionContext}
                    onChange={(e) => setQuestionContext(e.target.value)}
                    className="rounded-xl h-10 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="prompt" className="text-xs font-medium">
                  Screening Question Prompt <span className="text-destructive">*</span>
                </Label>
                <textarea
                  id="prompt"
                  rows={3}
                  placeholder="e.g. When reading academic textbooks or lecture slides, do letters or words appear to blur, shift, or require re-reading multiple times?"
                  value={questionPrompt}
                  onChange={(e) => setQuestionPrompt(e.target.value)}
                  className="w-full p-3 rounded-xl border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="qtype" className="text-xs font-medium">
                  Scale Format
                </Label>
                <select
                  id="qtype"
                  value={questionType}
                  onChange={(e) =>
                    setQuestionType(
                      e.target.value as
                        | "frequency-scale"
                        | "impact-scale"
                        | "accuracy-scale"
                    )
                  }
                  className="w-full h-10 px-3 rounded-xl border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="frequency-scale">Frequency Scale (Never to Almost Always)</option>
                  <option value="impact-scale">Academic Impact Scale (No Impact to Severe Impact)</option>
                  <option value="accuracy-scale">Accuracy Scale (Always Accurate to Frequently Inaccurate)</option>
                </select>
              </div>

              <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                <div className="text-[11px] text-muted-foreground">
                  Current bank size:{" "}
                  <strong className="font-mono text-foreground">
                    {authoringPool?.questions?.length || 0} items
                  </strong>{" "}
                  in {DOMAIN_METADATA[selectedDomain].shortName}
                </div>

                <Button
                  type="submit"
                  className="rounded-xl text-xs bg-primary text-primary-foreground h-10 px-6 gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Add to Question Bank</span>
                </Button>
              </div>
            </form>
          </div>

          {/* Current Question Pool Inventory */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="font-serif text-lg font-normal text-foreground">
                Domain Item Bank
              </h3>
              <Badge variant="outline" className="font-mono text-xs capitalize">
                {DOMAIN_METADATA[selectedDomain].code}
              </Badge>
            </div>

            <p className="text-xs text-muted-foreground font-light">
              {DOMAIN_METADATA[selectedDomain].description}
            </p>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {(authoringPool?.questions || []).map((q, idx) => (
                <div
                  key={q.id || idx}
                  className="p-3 rounded-2xl bg-muted/40 border border-border/60 space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-semibold text-primary">
                      Item #{idx + 1}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {q.context || "General Indicator"}
                    </span>
                  </div>
                  <p className="text-foreground leading-snug">{q.prompt}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Edit Indicators (Risk Thresholds Tuning) */}
      {activeSubtab === "edit-indicators" && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
              <div>
                <h2 className="font-serif text-2xl font-normal text-foreground">
                  Psychometric Indicator Thresholds (FR11 / FR12)
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Adjust High Priority and Moderate Difficulty cutoff thresholds. Modifications
                  re-evaluate the Support Staff triage queue and Student screening results live!
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetThresholds}
                  className="rounded-xl text-xs h-9 gap-1.5"
                >
                  <RotateCcw className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Reset Defaults</span>
                </Button>

                <Button
                  onClick={handleSaveThresholds}
                  className="rounded-xl text-xs bg-primary text-primary-foreground h-10 px-6 gap-2"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Save Indicator Thresholds</span>
                </Button>
              </div>
            </div>

            {/* Visual 3-Zone Cutoff Indicator */}
            <div className="p-6 rounded-3xl bg-muted/20 border border-border space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">Tri-Band Classification Zones</span>
                <span className="font-mono text-[11px] text-muted-foreground">
                  High: &le;{highThreshold}% &bull; Moderate: &le;{moderateThreshold}% &bull; Typical: &gt;{moderateThreshold}%
                </span>
              </div>

              {/* Progress bar visual */}
              <div className="h-4 w-full rounded-full bg-muted overflow-hidden flex">
                <div
                  style={{ width: `${highThreshold}%` }}
                  className="bg-destructive/80 h-full transition-all"
                  title={`High Priority / Clinical Concern (0% to ${highThreshold}%)`}
                />
                <div
                  style={{ width: `${Math.max(0, moderateThreshold - highThreshold)}%` }}
                  className="bg-amber-500/80 h-full transition-all"
                  title={`Moderate Variation / Support Indicated (${highThreshold + 1}% to ${moderateThreshold}%)`}
                />
                <div
                  style={{ width: `${Math.max(0, 100 - moderateThreshold)}%` }}
                  className="bg-emerald-500/70 h-full transition-all"
                  title={`Typical Profile / Low Risk (${moderateThreshold + 1}% to 100%)`}
                />
              </div>

              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-destructive font-semibold">
                  &bull; High Priority (&le; {highThreshold}%)
                </span>
                <span className="text-amber-600 font-semibold">
                  &bull; Moderate Variation ({highThreshold + 1}% - {moderateThreshold}%)
                </span>
                <span className="text-emerald-600 font-semibold">
                  &bull; Typical / Low Risk (&gt; {moderateThreshold}%)
                </span>
              </div>
            </div>

            {/* Threshold Sliders */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="p-5 rounded-2xl bg-background border border-border space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <span className="font-medium text-foreground block">
                      High Priority Cutoff (FR11)
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Scores at or below this trigger RED triage alerts
                    </span>
                  </div>
                  <strong className="font-mono text-destructive text-lg">
                    {highThreshold}%
                  </strong>
                </div>

                <input
                  type="range"
                  min={20}
                  max={50}
                  value={highThreshold}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setHighThreshold(val);
                    if (val >= moderateThreshold) {
                      setModerateThreshold(val + 10);
                    }
                  }}
                  className="w-full accent-destructive cursor-pointer"
                />
              </div>

              <div className="p-5 rounded-2xl bg-background border border-border space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <span className="font-medium text-foreground block">
                      Moderate Variation Cutoff (FR12)
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Scores at or below this trigger AMBER support flags
                    </span>
                  </div>
                  <strong className="font-mono text-amber-600 text-lg">
                    {moderateThreshold}%
                  </strong>
                </div>

                <input
                  type="range"
                  min={51}
                  max={80}
                  value={moderateThreshold}
                  onChange={(e) => setModerateThreshold(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
              </div>
            </div>

            {/* 5 Domains Application Cards */}
            <div className="space-y-3 pt-2">
              <h4 className="font-serif text-lg font-medium text-foreground">
                Domain Application Matrix (FR05–FR09)
              </h4>
              <div className="grid gap-3 sm:grid-cols-5">
                {(Object.keys(DOMAIN_METADATA) as ScreeningDomainKey[]).map((dom) => (
                  <div
                    key={dom}
                    className="p-3.5 rounded-2xl bg-muted/30 border border-border space-y-1 text-xs"
                  >
                    <div className="font-mono font-semibold text-[11px] text-primary">
                      {DOMAIN_METADATA[dom].code}
                    </div>
                    <div className="font-medium text-foreground truncate">
                      {DOMAIN_METADATA[dom].shortName}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      Active: {assessmentPools?.[dom]?.questions?.length || 5} questions
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 3: Preview Flow (Interactive Student QA Simulation) */}
      {activeSubtab === "preview-flow" && (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
              <div>
                <h2 className="font-serif text-2xl font-normal text-foreground">
                  Student Screening Flow Simulator
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Simulate student screening batteries in real time to verify question pacing,
                  scoring accuracy, and clinical triage flags.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={previewDomain}
                  onChange={(e) => {
                    setPreviewDomain(e.target.value as ScreeningDomainKey);
                    setPreviewAnswers({});
                  }}
                  className="h-9 px-3 rounded-xl border border-input bg-background text-xs text-foreground focus:outline-none font-medium"
                >
                  {(Object.keys(DOMAIN_METADATA) as ScreeningDomainKey[]).map((dom) => (
                    <option key={dom} value={dom}>
                      {DOMAIN_METADATA[dom].code} {DOMAIN_METADATA[dom].shortName}
                    </option>
                  ))}
                </select>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewAnswers({})}
                  className="rounded-xl text-xs h-9 gap-1.5"
                >
                  <RotateCcw className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Reset QA</span>
                </Button>
              </div>
            </div>

            {/* Questions List Simulator */}
            <div className="space-y-4">
              {previewQuestions.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground text-xs">
                  No questions currently loaded for this domain.
                </div>
              ) : (
                previewQuestions.map((q, idx) => {
                  const currentVal = previewAnswers[q.id] || 3;
                  return (
                    <div
                      key={q.id || idx}
                      className="p-5 rounded-2xl bg-muted/20 border border-border/70 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-semibold text-primary">
                          Question {idx + 1} of {previewQuestions.length}
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground">
                          {q.context || "Assessment Item"}
                        </span>
                      </div>

                      <h4 className="text-sm font-medium text-foreground leading-snug">
                        {q.prompt}
                      </h4>

                      {/* Radio Likert Options */}
                      <div className="grid grid-cols-5 gap-1.5 pt-1">
                        {[
                          { label: "Rarely", val: 1 },
                          { label: "Infrequent", val: 2 },
                          { label: "Moderate", val: 3 },
                          { label: "Frequent", val: 4 },
                          { label: "Constant", val: 5 },
                        ].map((opt) => (
                          <button
                            key={opt.val}
                            type="button"
                            onClick={() => handlePreviewAnswer(q.id, opt.val)}
                            className={`p-2 rounded-xl text-center text-xs transition-all flex flex-col items-center gap-1 ${
                              currentVal === opt.val
                                ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                                : "bg-background border border-border hover:bg-muted text-muted-foreground"
                            }`}
                          >
                            <span className="font-mono text-xs">{opt.val}</span>
                            <span className="text-[10px] hidden sm:inline">{opt.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* QA Output & Evaluation Inspector */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <BarChart3 className="h-5 w-5" />
                <h3 className="font-serif text-lg font-normal text-foreground">
                  Simulated Classifier Output
                </h3>
              </div>

              <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-3">
                <div className="text-xs text-muted-foreground">Domain Score:</div>
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-3xl font-medium text-foreground">
                    {previewResult.percentage}%
                  </span>
                  <span className="text-xs font-mono text-muted-foreground">
                    (Raw: {previewResult.raw} pts)
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-[11px] text-muted-foreground">Triage Classification:</div>
                  <div
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium ${
                      previewResult.badgeColor === "destructive"
                        ? "bg-destructive/10 text-destructive border border-destructive/20"
                        : previewResult.badgeColor === "amber"
                        ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                        : "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                    }`}
                  >
                    {previewResult.classification}
                  </div>
                </div>

                <div className="text-[11px] text-muted-foreground font-light pt-1 border-t border-border/60">
                  Cutoffs in effect: High Priority &le; {highThreshold}%, Moderate &le;{" "}
                  {moderateThreshold}%.
                </div>
              </div>

              <div className="text-xs text-muted-foreground leading-relaxed font-light">
                Use this preview simulator to confirm that scoring distributions provide fair,
                clinically sound screening classifications before student deployment.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 4: Set Weightings (Composite Formula Matrix) */}
      {activeSubtab === "set-weightings" && (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
              <div>
                <h2 className="font-serif text-2xl font-normal text-foreground">
                  Domain Composite Weighting Matrix
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Calibrate weighting multipliers across the 5 domains. Weights scale the relative
                  importance of each domain in institutional composite indicators.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEqualizeWeightings}
                  className="rounded-xl text-xs h-9 gap-1.5"
                >
                  <RotateCcw className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Equalize (1.0x)</span>
                </Button>

                <Button
                  onClick={handleSaveWeightings}
                  className="rounded-xl text-xs bg-primary text-primary-foreground h-10 px-6 gap-2"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Save Multipliers</span>
                </Button>
              </div>
            </div>

            {/* Weighting Sliders */}
            <div className="space-y-4">
              {(Object.keys(DOMAIN_METADATA) as ScreeningDomainKey[]).map((dom) => (
                <div
                  key={dom}
                  className="p-4 rounded-2xl border border-border bg-background space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-mono text-muted-foreground mr-2">
                        {DOMAIN_METADATA[dom].code}
                      </span>
                      <span className="font-medium text-foreground">
                        {DOMAIN_METADATA[dom].title}
                      </span>
                    </div>
                    <span className="font-mono font-semibold text-sm text-primary">
                      {weights[dom] || 1}x Factor
                    </span>
                  </div>

                  <input
                    type="range"
                    min={1}
                    max={5}
                    step={1}
                    value={weights[dom] || 1}
                    onChange={(e) =>
                      setWeights({
                        ...weights,
                        [dom]: Number(e.target.value),
                      })
                    }
                    className="w-full accent-primary cursor-pointer"
                  />

                  <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                    <span>1x (Standard)</span>
                    <span>2x</span>
                    <span>3x (Double)</span>
                    <span>4x</span>
                    <span>5x (Critical Focus)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Side Info */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <Scale className="h-5 w-5" />
              <h3 className="font-serif text-lg font-normal text-foreground">
                Formula Mechanics
              </h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed font-light">
              Higher weighting factors increase the influence of specific cognitive domains when
              evaluating institutional accommodations priority.
            </p>
            <div className="p-3.5 rounded-2xl bg-muted/40 border border-border space-y-2 text-xs">
              <div className="font-medium text-foreground">Active Multipliers:</div>
              <div className="text-[11px] font-mono text-muted-foreground space-y-1">
                <div>&bull; Reading (FR05): {weights.reading || 1}x</div>
                <div>&bull; Grammar (FR06): {weights.grammar || 1}x</div>
                <div>&bull; Mathematics (FR07): {weights.mathematics || 1}x</div>
                <div>&bull; Memory (FR08): {weights.memory || 1}x</div>
                <div>&bull; Comprehension (FR09): {weights.comprehension || 1}x</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
