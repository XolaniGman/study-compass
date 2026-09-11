import React, { useState, useEffect } from "react";
import { X, Volume2, ArrowRight, ArrowLeft, CheckCircle2, Sparkles, ClipboardCheck } from "lucide-react";
import { useStudent } from "../context/StudentContext";
import { ASSESSMENT_MODULES, LIKERT_OPTIONS } from "../data/assessment-modules";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Progress } from "../../../components/ui/progress";

export function AssessmentRunnerModal() {
  const {
    isAssessmentModalOpen,
    setIsAssessmentModalOpen,
    activeAssessmentModuleId,
    submitAssessment,
    latestSession,
    setIsReportModalOpen,
  } = useStudent();

  // Gather questions for active module or all modules
  const activeQuestions =
    activeAssessmentModuleId === "all-comprehensive"
      ? ASSESSMENT_MODULES.flatMap((m) => m.questions)
      : ASSESSMENT_MODULES.find((m) => m.id === activeAssessmentModuleId)?.questions || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  useEffect(() => {
    if (isAssessmentModalOpen) {
      setCurrentIndex(0);
      // Pre-fill existing answers from latest session
      setAnswers(latestSession.answers || {});
    }
  }, [isAssessmentModalOpen, latestSession]);

  const currentQuestion = activeQuestions[currentIndex];
  if (!isAssessmentModalOpen || activeQuestions.length === 0 || !currentQuestion) return null;

  const selectedValue = answers[currentQuestion.id];
  const isAnswered = typeof selectedValue === "number";

  const totalQuestions = activeQuestions.length;
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  const handleSelectOption = (value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  const handleReadAloud = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(
        `${currentQuestion.prompt}. Context: ${currentQuestion.context}`
      );
      u.rate = 0.95;
      window.speechSynthesis.speak(u);
    }
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  };

  const handleSubmit = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    submitAssessment(answers, activeAssessmentModuleId);
    setIsAssessmentModalOpen(false);
  };

  const moduleTitle =
    activeAssessmentModuleId === "all-comprehensive"
      ? "Comprehensive 4-Domain Screening Battery"
      : ASSESSMENT_MODULES.find((m) => m.id === activeAssessmentModuleId)?.title || "Assessment";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setIsAssessmentModalOpen(false)}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-border bg-card shadow-2xl z-10">
        {/* Header with Progress Bar */}
        <div className="border-b border-border/70 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono font-semibold uppercase tracking-widest text-primary">
                Screening in Progress &bull; Question {currentIndex + 1} of {totalQuestions}
              </span>
              <h2 className="text-lg font-serif font-medium text-foreground mt-0.5">
                {moduleTitle}
              </h2>
            </div>
            <button
              onClick={() => setIsAssessmentModalOpen(false)}
              className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              title="Close assessment"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-mono text-muted-foreground">
              <span>Progress</span>
              <span>{progressPercent}% Complete</span>
            </div>
            <Progress value={progressPercent} className="h-1.5" />
          </div>
        </div>

        {/* Question Prompt Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-primary border-primary/30 uppercase text-[10px]">
                {currentQuestion.domain} indicator
              </Badge>
              <button
                type="button"
                onClick={handleReadAloud}
                className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors bg-primary/10 px-2.5 py-1 rounded-lg"
                title="Read question aloud"
              >
                <Volume2 className="h-3.5 w-3.5" />
                <span>Read Aloud</span>
              </button>
            </div>

            <h3 className="text-lg sm:text-xl font-normal text-foreground leading-relaxed">
              {currentQuestion.prompt}
            </h3>

            <p className="text-xs text-muted-foreground font-light italic">
              Diagnostic Context: {currentQuestion.context}
            </p>
          </div>

          {/* Likert Response Options */}
          <div className="space-y-2.5">
            {LIKERT_OPTIONS.map((opt) => {
              const isSelected = selectedValue === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelectOption(opt.value)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                    isSelected
                      ? "bg-primary/10 border-primary text-primary shadow-sm"
                      : "bg-card border-border text-foreground hover:bg-muted/50 hover:border-primary/40"
                  }`}
                >
                  <div>
                    <div className="font-medium text-sm">{opt.label}</div>
                    <div className="text-xs text-muted-foreground font-light mt-0.5">
                      {opt.description}
                    </div>
                  </div>
                  <div
                    className={`h-5 w-5 rounded-full border flex items-center justify-center transition-colors shrink-0 ml-3 ${
                      isSelected ? "bg-primary border-primary text-primary-foreground" : "border-border"
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="h-3.5 w-3.5" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="border-t border-border/70 bg-muted/20 p-5 flex items-center justify-between">
          <Button
            type="button"
            onClick={handleBack}
            disabled={currentIndex === 0}
            variant="ghost"
            size="sm"
            className="text-xs gap-1.5 text-muted-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Previous</span>
          </Button>

          <Button
            type="button"
            onClick={handleNext}
            disabled={!isAnswered}
            size="sm"
            className="bg-primary text-primary-foreground text-xs gap-1.5 px-5"
          >
            <span>{currentIndex < totalQuestions - 1 ? "Next Question" : "Submit & Evaluate"}</span>
            {currentIndex < totalQuestions - 1 ? (
              <ArrowRight className="h-3.5 w-3.5" />
            ) : (
              <ClipboardCheck className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
