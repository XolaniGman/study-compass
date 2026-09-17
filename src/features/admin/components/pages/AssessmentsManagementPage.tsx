import React, { useState } from "react";
import {
  PlusCircle,
  Sliders,
  Eye,
  Scale,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  BookOpen,
  HelpCircle,
  BarChart3,
  Activity,
} from "lucide-react";
import { useInstitutional } from "../../../shared/context/InstitutionalContext";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Badge } from "../../../../components/ui/badge";
import { Slider } from "../../../../components/ui/slider";
import { toast } from "sonner";
import type { ScreeningDomainKey } from "../../../shared/types";

interface AssessmentsManagementPageProps {
  initialSubtab?: string;
  onNavigateToOverview: () => void;
  onSubtabChange?: (subtab: string) => void;
}

export function AssessmentsManagementPage({
  initialSubtab = "create-assessment",
  onNavigateToOverview,
  onSubtabChange,
}: AssessmentsManagementPageProps) {
  const {
    assessmentPools,
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
      badge: "100% Total",
    },
  ];

  // ================= State for Create Assessment =================
  const [selectedDomain, setSelectedDomain] = useState<ScreeningDomainKey>("dyslexia");
  const [questionText, setQuestionText] = useState("");
  const [questionCode, setQuestionCode] = useState("");
  const [reverseScored, setReverseScored] = useState(false);
  const [subscale, setSubscale] = useState("Phonological Processing");

  const handleAddQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) {
      toast.error("Please enter the screening prompt text.");
      return;
    }

    const code =
      questionCode.trim() ||
      `${selectedDomain.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-3)}`;

    addQuestionToPool(selectedDomain, {
      code,
      prompt: questionText.trim(),
      type: "likert_5",
      options: [
        { label: "Never / Rarely", value: 1 },
        { label: "Occasionally", value: 2 },
        { label: "Sometimes", value: 3 },
        { label: "Frequently", value: 4 },
        { label: "Almost Always", value: 5 },
      ],
      reverseScored,
      subscale: subscale.trim() || "General Indicator",
    });

    toast.success(`New indicator ${code} added to ${selectedDomain} question bank!`);
    setQuestionText("");
    setQuestionCode("");
  };

  // ================= State for Edit Indicators =================
  const [thresholdsState, setThresholdsState] = useState(scoringConfig.thresholds);

  const handleSaveThresholds = () => {
    updateThresholds(thresholdsState);
    toast.success(
      "Screening indicator thresholds updated live! Student triage queue and classifications re-evaluated."
    );
  };

  // ================= State for Weightings =================
  const [weightingsState, setWeightingsState] = useState(scoringConfig.weightings);

  const totalWeight =
    weightingsState.dyslexia +
    weightingsState.adhd +
    weightingsState.dyscalculia +
    weightingsState.dysgraphia +
    weightingsState.processingSpeed;

  const handleAutoNormalize = () => {
    if (totalWeight === 0) return;
    const factor = 100 / totalWeight;
    setWeightingsState({
      dyslexia: Math.round(weightingsState.dyslexia * factor),
      adhd: Math.round(weightingsState.adhd * factor),
      dyscalculia: Math.round(weightingsState.dyscalculia * factor),
      dysgraphia: Math.round(weightingsState.dysgraphia * factor),
      processingSpeed:
        100 -
        (Math.round(weightingsState.dyslexia * factor) +
          Math.round(weightingsState.adhd * factor) +
          Math.round(weightingsState.dyscalculia * factor) +
          Math.round(weightingsState.dysgraphia * factor)),
    });
    toast.info("Domain weights normalized to exactly 100%.");
  };

  const handleSaveWeightings = () => {
    if (totalWeight !== 100) {
      toast.error(`Weights must sum to exactly 100% (currently ${totalWeight}%).`);
      return;
    }
    updateWeightings(weightingsState);
    toast.success("Domain weightings formula committed! Composite index recalculation live.");
  };

  // ================= State for Preview Flow (Interactive QA) =================
  const [previewDomain, setPreviewDomain] = useState<ScreeningDomainKey>("dyslexia");
  const [previewAnswers, setPreviewAnswers] = useState<Record<string, number>>({});
  const [previewCompleted, setPreviewCompleted] = useState(false);

  const currentPool = assessmentPools[previewDomain] || assessmentPools.dyslexia;

  const handlePreviewAnswer = (qId: string, val: number) => {
    setPreviewAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const calculatePreviewScore = () => {
    const questions = currentPool.questions;
    if (questions.length === 0) return { raw: 0, percentage: 0, classification: "Low" };

    let totalScore = 0;
    let maxPossible = questions.length * 5;

    questions.forEach((q) => {
      const ans = previewAnswers[q.id] || 3;
      totalScore += q.reverseScored ? 6 - ans : ans;
    });

    const pct = Math.round((totalScore / maxPossible) * 100);
    const domainThreshold = thresholdsState[previewDomain];

    let classification = "Low Risk";
    if (pct >= domainThreshold.high) {
      classification = "High Risk / Clinical Priority";
    } else if (pct >= domainThreshold.moderate) {
      classification = "Moderate Risk / Support Indicated";
    }

    return { raw: totalScore, percentage: pct, classification };
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
                Author Psychometric Screening Question
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
                    Screening Domain (FR05–FR09)
                  </Label>
                  <select
                    id="domain"
                    value={selectedDomain}
                    onChange={(e) =>
                      setSelectedDomain(e.target.value as ScreeningDomainKey)
                    }
                    className="w-full h-10 px-3 rounded-xl border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="dyslexia">FR05: Reading &amp; Phonological (Dyslexia)</option>
                    <option value="adhd">FR06: Attention &amp; Executive Function (ADHD)</option>
                    <option value="dyscalculia">FR07: Mathematical &amp; Numerical (Dyscalculia)</option>
                    <option value="dysgraphia">FR08: Orthographic &amp; Motor Writing (Dysgraphia)</option>
                    <option value="processingSpeed">FR09: Cognitive Processing Speed</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="code" className="text-xs font-medium">
                    Item Code (Optional)
                  </Label>
                  <Input
                    id="code"
                    placeholder="e.g. DYS-06 or NUM-05"
                    value={questionCode}
                    onChange={(e) => setQuestionCode(e.target.value)}
                    className="rounded-xl h-10 text-xs font-mono"
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
                  placeholder="e.g. Do you frequently need to re-read academic paragraphs multiple times to grasp their meaning?"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  className="w-full p-3 rounded-xl border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="subscale" className="text-xs font-medium">
                    Psychometric Sub-scale Tag
                  </Label>
                  <Input
                    id="subscale"
                    placeholder="e.g. Working Memory or Orthographic Decoding"
                    value={subscale}
                    onChange={(e) => setSubscale(e.target.value)}
                    className="rounded-xl h-10 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Response Metric Format</Label>
                  <div className="h-10 px-3 rounded-xl border border-border bg-muted/30 flex items-center text-xs text-muted-foreground">
                    Standard 5-Point Likert Scale (1 = Never to 5 = Always)
                  </div>
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-foreground">
                  <input
                    type="checkbox"
                    checked={reverseScored}
                    onChange={(e) => setReverseScored(e.target.checked)}
                    className="rounded border-input text-primary focus:ring-primary h-4 w-4"
                  />
                  <span>Reverse Scored Item (5 indicates high competence, 1 indicates severe difficulty)</span>
                </label>
              </div>

              <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                <div className="text-[11px] text-muted-foreground">
                  Current pool size:{" "}
                  <strong className="font-mono text-foreground">
                    {assessmentPools[selectedDomain]?.questions.length || 0} questions
                  </strong>
                </div>

                <Button
                  type="submit"
                  className="rounded-xl text-xs bg-primary text-primary-foreground h-10 px-6 gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Add to Screening Bank</span>
                </Button>
              </div>
            </form>
          </div>

          {/* Current Question Pool Inventory */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="font-serif text-lg font-normal text-foreground">
                Domain Item Pool
              </h3>
              <Badge variant="outline" className="font-mono text-xs capitalize">
                {selectedDomain}
              </Badge>
            </div>

            <p className="text-xs text-muted-foreground font-light">
              Active questions administered to students during institutional screening batteries.
            </p>

            <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
              {assessmentPools[selectedDomain]?.questions.map((q, idx) => (
                <div
                  key={q.id}
                  className="p-3 rounded-2xl bg-muted/40 border border-border/60 space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-semibold text-primary">
                      {q.code || `Q${idx + 1}`}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {q.subscale}
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
                  Psychometric Indicator Thresholds
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Adjust High Risk and Moderate Risk cutoff thresholds across the 5 domains.
                  Modifications update the Support Staff screening triage queue in real time!
                </p>
              </div>

              <Button
                onClick={handleSaveThresholds}
                className="rounded-xl text-xs bg-primary text-primary-foreground h-10 px-6 gap-2"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Save All Thresholds</span>
              </Button>
            </div>

            {/* Threshold Sliders for each domain */}
            <div className="grid gap-6 md:grid-cols-2">
              {(
                [
                  {
                    key: "dyslexia",
                    code: "FR05",
                    title: "Reading & Phonological (Dyslexia)",
                    desc: "Decoding speed, phonemic analysis, comprehension",
                  },
                  {
                    key: "adhd",
                    code: "FR06",
                    title: "Attention & Executive Function (ADHD)",
                    desc: "Focus maintenance, working memory, task inhibition",
                  },
                  {
                    key: "dyscalculia",
                    code: "FR07",
                    title: "Mathematical & Numerical (Dyscalculia)",
                    desc: "Symbolic quantity, arithmetic memory, sequencing",
                  },
                  {
                    key: "dysgraphia",
                    code: "FR08",
                    title: "Orthographic & Fine Motor (Dysgraphia)",
                    desc: "Spelling retrieval, handwriting speed, spatial spacing",
                  },
                  {
                    key: "processingSpeed",
                    code: "FR09",
                    title: "Cognitive Processing Speed",
                    desc: "Visual scanning, rapid lexical retrieval, mental pace",
                  },
                ] as const
              ).map((d) => {
                const t = thresholdsState[d.key];
                return (
                  <div
                    key={d.key}
                    className="p-5 rounded-3xl border border-border bg-muted/20 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[11px] font-mono text-primary font-semibold">
                          {d.code} Domain
                        </div>
                        <h4 className="font-serif text-lg font-medium text-foreground">
                          {d.title}
                        </h4>
                        <p className="text-[11px] text-muted-foreground">{d.desc}</p>
                      </div>
                    </div>

                    {/* Visual 3-Zone Bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px] font-mono text-muted-foreground">
                        <span>Low (&lt;{t.moderate}%)</span>
                        <span className="text-amber-600 font-medium">
                          Moderate ({t.moderate}% - {t.high - 1}%)
                        </span>
                        <span className="text-destructive font-semibold">
                          High (&ge;{t.high}%)
                        </span>
                      </div>
                      <div className="h-3 w-full rounded-full bg-muted overflow-hidden flex">
                        <div
                          style={{ width: `${t.moderate}%` }}
                          className="bg-emerald-500/60 h-full"
                          title="Low Risk Zone"
                        />
                        <div
                          style={{ width: `${t.high - t.moderate}%` }}
                          className="bg-amber-500/70 h-full"
                          title="Moderate Risk Zone"
                        />
                        <div
                          style={{ width: `${100 - t.high}%` }}
                          className="bg-destructive/80 h-full"
                          title="High Risk Clinical Priority"
                        />
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="grid gap-3 sm:grid-cols-2 pt-2">
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Moderate Cutoff:</span>
                          <strong className="font-mono text-amber-600">{t.moderate}%</strong>
                        </div>
                        <input
                          type="range"
                          min={30}
                          max={65}
                          value={t.moderate}
                          onChange={(e) =>
                            setThresholdsState({
                              ...thresholdsState,
                              [d.key]: {
                                ...t,
                                moderate: Number(e.target.value),
                              },
                            })
                          }
                          className="w-full accent-amber-600 cursor-pointer"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">High Risk Cutoff:</span>
                          <strong className="font-mono text-destructive">{t.high}%</strong>
                        </div>
                        <input
                          type="range"
                          min={66}
                          max={90}
                          value={t.high}
                          onChange={(e) =>
                            setThresholdsState({
                              ...thresholdsState,
                              [d.key]: {
                                ...t,
                                high: Number(e.target.value),
                              },
                            })
                          }
                          className="w-full accent-destructive cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
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
                  Simulate the student screening battery in real time to verify test experience,
                  question pacing, and scoring accuracy.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={previewDomain}
                  onChange={(e) => {
                    setPreviewDomain(e.target.value as ScreeningDomainKey);
                    setPreviewAnswers({});
                    setPreviewCompleted(false);
                  }}
                  className="h-9 px-3 rounded-xl border border-input bg-background text-xs text-foreground focus:outline-none font-medium"
                >
                  <option value="dyslexia">FR05 Dyslexia Battery</option>
                  <option value="adhd">FR06 ADHD Battery</option>
                  <option value="dyscalculia">FR07 Dyscalculia Battery</option>
                  <option value="dysgraphia">FR08 Dysgraphia Battery</option>
                  <option value="processingSpeed">FR09 Processing Speed</option>
                </select>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setPreviewAnswers({});
                    setPreviewCompleted(false);
                  }}
                  className="rounded-xl text-xs h-9 gap-1.5"
                >
                  <RotateCcw className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Reset QA</span>
                </Button>
              </div>
            </div>

            {/* Questions List Simulator */}
            <div className="space-y-6">
              {currentPool.questions.map((q, idx) => {
                const currentVal = previewAnswers[q.id] || 3;
                return (
                  <div
                    key={q.id}
                    className="p-5 rounded-2xl bg-muted/20 border border-border/70 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-semibold text-primary">
                        Question {idx + 1} of {currentPool.questions.length}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {q.code} &bull; {q.subscale}
                      </span>
                    </div>

                    <h4 className="text-sm font-medium text-foreground leading-snug">
                      {q.prompt}
                    </h4>

                    {/* Radio Likert Options */}
                    <div className="grid grid-cols-5 gap-1.5 pt-1">
                      {[
                        { label: "Never", val: 1 },
                        { label: "Rarely", val: 2 },
                        { label: "Sometimes", val: 3 },
                        { label: "Frequently", val: 4 },
                        { label: "Always", val: 5 },
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
              })}
            </div>
          </div>

          {/* QA Output & Evaluation Inspector */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <BarChart3 className="h-5 w-5" />
                <h3 className="font-serif text-lg font-normal text-foreground">
                  Simulated Evaluation Result
                </h3>
              </div>

              <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-3">
                <div className="text-xs text-muted-foreground">Computed Score:</div>
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-3xl font-medium text-foreground">
                    {previewResult.percentage}%
                  </span>
                  <span className="text-xs font-mono text-muted-foreground">
                    (Raw: {previewResult.raw} pts)
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-[11px] text-muted-foreground">Diagnostic Flag:</div>
                  <div
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium ${
                      previewResult.percentage >= thresholdsState[previewDomain].high
                        ? "bg-destructive/10 text-destructive border border-destructive/20"
                        : previewResult.percentage >= thresholdsState[previewDomain].moderate
                        ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                        : "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                    }`}
                  >
                    {previewResult.classification}
                  </div>
                </div>

                <div className="text-[11px] text-muted-foreground font-light pt-1 border-t border-border/60">
                  Evaluated against active threshold: High &ge; {thresholdsState[previewDomain].high}%,
                  Moderate &ge; {thresholdsState[previewDomain].moderate}%.
                </div>
              </div>

              <div className="text-xs text-muted-foreground leading-relaxed font-light">
                Use this preview to confirm that the question weightings and scoring scales provide
                fair, clinically sound screening classifications before student deployment.
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
                  Composite Screening Weighting Matrix
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Define the percentage weight each domain contributes to the overall institutional
                  triage index. Weights must equal exactly 100%.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAutoNormalize}
                  className="rounded-xl text-xs h-9 gap-1.5"
                >
                  <RotateCcw className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Auto-Normalize (100%)</span>
                </Button>

                <Button
                  onClick={handleSaveWeightings}
                  className="rounded-xl text-xs bg-primary text-primary-foreground h-10 px-6 gap-2"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Save Matrix</span>
                </Button>
              </div>
            </div>

            {/* Total Balance Bar */}
            <div className="p-4 rounded-2xl bg-muted/30 border border-border space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">Cumulative Distribution</span>
                <span
                  className={`font-mono font-semibold px-2 py-0.5 rounded-md ${
                    totalWeight === 100
                      ? "bg-emerald-500/15 text-emerald-600"
                      : "bg-destructive/15 text-destructive"
                  }`}
                >
                  Total: {totalWeight}% {totalWeight === 100 ? "✓ Balanced" : "⚠ Must Equal 100%"}
                </span>
              </div>

              {/* Segmented Bar */}
              <div className="h-3.5 w-full rounded-full bg-muted overflow-hidden flex">
                <div
                  style={{ width: `${weightingsState.dyslexia}%` }}
                  className="bg-primary h-full transition-all"
                  title={`Dyslexia: ${weightingsState.dyslexia}%`}
                />
                <div
                  style={{ width: `${weightingsState.adhd}%` }}
                  className="bg-chart-2 h-full transition-all"
                  title={`ADHD: ${weightingsState.adhd}%`}
                />
                <div
                  style={{ width: `${weightingsState.dyscalculia}%` }}
                  className="bg-chart-3 h-full transition-all"
                  title={`Dyscalculia: ${weightingsState.dyscalculia}%`}
                />
                <div
                  style={{ width: `${weightingsState.dysgraphia}%` }}
                  className="bg-chart-4 h-full transition-all"
                  title={`Dysgraphia: ${weightingsState.dysgraphia}%`}
                />
                <div
                  style={{ width: `${weightingsState.processingSpeed}%` }}
                  className="bg-chart-5 h-full transition-all"
                  title={`Processing Speed: ${weightingsState.processingSpeed}%`}
                />
              </div>
            </div>

            {/* Weighting Sliders */}
            <div className="space-y-4">
              {(
                [
                  {
                    key: "dyslexia",
                    code: "FR05",
                    label: "Reading & Phonological (Dyslexia)",
                    color: "text-primary",
                  },
                  {
                    key: "adhd",
                    code: "FR06",
                    label: "Attention & Executive Function (ADHD)",
                    color: "text-chart-2",
                  },
                  {
                    key: "dyscalculia",
                    code: "FR07",
                    label: "Mathematical & Numerical (Dyscalculia)",
                    color: "text-chart-3",
                  },
                  {
                    key: "dysgraphia",
                    code: "FR08",
                    label: "Orthographic & Motor Writing (Dysgraphia)",
                    color: "text-chart-4",
                  },
                  {
                    key: "processingSpeed",
                    code: "FR09",
                    label: "Cognitive Processing Speed",
                    color: "text-chart-5",
                  },
                ] as const
              ).map((item) => (
                <div
                  key={item.key}
                  className="p-4 rounded-2xl border border-border bg-background space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-mono text-muted-foreground mr-2">{item.code}</span>
                      <span className="font-medium text-foreground">{item.label}</span>
                    </div>
                    <span className={`font-mono font-semibold text-sm ${item.color}`}>
                      {weightingsState[item.key]}%
                    </span>
                  </div>

                  <input
                    type="range"
                    min={5}
                    max={50}
                    value={weightingsState[item.key]}
                    onChange={(e) =>
                      setWeightingsState({
                        ...weightingsState,
                        [item.key]: Number(e.target.value),
                      })
                    }
                    className="w-full accent-primary cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Side Info */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <Scale className="h-5 w-5" />
              <h3 className="font-serif text-lg font-normal text-foreground">
                Weighting Rationale
              </h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed font-light">
              Composite weighting balances reading fluency, attention span, math difficulty,
              writing velocity, and working memory into a single institutional indicator score.
            </p>
            <div className="p-3.5 rounded-2xl bg-muted/40 border border-border space-y-2 text-xs">
              <div className="font-medium text-foreground">Active Formula:</div>
              <div className="text-[11px] font-mono text-muted-foreground space-y-1">
                <div>&bull; Dyslexia: {weightingsState.dyslexia}%</div>
                <div>&bull; ADHD: {weightingsState.adhd}%</div>
                <div>&bull; Dyscalculia: {weightingsState.dyscalculia}%</div>
                <div>&bull; Dysgraphia: {weightingsState.dysgraphia}%</div>
                <div>&bull; Processing: {weightingsState.processingSpeed}%</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
