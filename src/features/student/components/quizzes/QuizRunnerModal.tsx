import React, { useState, useEffect } from "react";
import {
  X,
  Volume2,
  Clock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Sparkles,
  HelpCircle,
  Trophy,
  RotateCcw,
  BookOpen,
  Check,
} from "lucide-react";
import { useStudent } from "../../context/StudentContext";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";
import { Progress } from "../../../../components/ui/progress";

export function QuizRunnerModal() {
  const { activeQuiz, setActiveQuiz, submitQuizAttempt } = useStudent();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [showHint, setShowHint] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    if (activeQuiz) {
      setCurrentIndex(0);
      setSelectedOptionId(null);
      setUserAnswers({});
      setShowHint(false);
      setIsCompleted(false);
      setSecondsElapsed(0);
    }
  }, [activeQuiz]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (activeQuiz && !isCompleted) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeQuiz, isCompleted]);

  if (!activeQuiz) return null;

  const currentQuestion = activeQuiz.questions[currentIndex] ?? activeQuiz.questions[0]!;
  const totalQuestions = activeQuiz.questions.length;
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  const handleSelectOption = (optionId: string) => {
    setSelectedOptionId(optionId);
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));
  };

  const handleReadAloud = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const textToRead = `${currentQuestion.prompt}. ${
        currentQuestion.passage ? `Passage: ${currentQuestion.passage}` : ""
      }`;
      const u = new SpeechSynthesisUtterance(textToRead);
      u.rate = 0.95;
      window.speechSynthesis.speak(u);
    }
  };

  const handleNext = () => {
    setShowHint(false);
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((i) => i + 1);
      const nextQ = activeQuiz.questions[currentIndex + 1];
      setSelectedOptionId(nextQ ? userAnswers[nextQ.id] ?? null : null);
    } else {
      finishQuiz();
    }
  };

  const handleBack = () => {
    setShowHint(false);
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      const prevQ = activeQuiz.questions[currentIndex - 1];
      setSelectedOptionId(prevQ ? userAnswers[prevQ.id] ?? null : null);
    }
  };

  const finishQuiz = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    // Calculate score
    let correct = 0;
    activeQuiz.questions.forEach((q) => {
      const selected = userAnswers[q.id];
      const correctOpt = q.options.find((o) => o.isCorrect);
      if (selected && correctOpt && selected === correctOpt.id) {
        correct++;
      }
    });

    const percent = Math.round((correct / totalQuestions) * 100);

    submitQuizAttempt({
      quizId: activeQuiz.id,
      quizTitle: activeQuiz.title,
      domain: activeQuiz.domain,
      scorePercent: percent,
      correctCount: correct,
      totalQuestions,
      timeSpentSeconds: secondsElapsed,
      answers: userAnswers,
    });

    setIsCompleted(true);
  };

  // Format time
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // Compute stats for completed screen
  const calculateStats = () => {
    let correct = 0;
    activeQuiz.questions.forEach((q) => {
      const selected = userAnswers[q.id];
      const correctOpt = q.options.find((o) => o.isCorrect);
      if (selected && correctOpt && selected === correctOpt.id) {
        correct++;
      }
    });
    const percent = Math.round((correct / totalQuestions) * 100);
    return { correct, percent };
  };

  const { correct: totalCorrect, percent: finalScore } = calculateStats();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setActiveQuiz(null)}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl border border-border bg-card shadow-2xl z-10 space-y-6 p-6 sm:p-8">
        {!isCompleted ? (
          <>
            {/* Header */}
            <div className="flex items-start justify-between border-b border-border/70 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-primary border-primary/30 text-[10px]">
                    {activeQuiz.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>Time: {formatTime(secondsElapsed)}</span>
                  </span>
                </div>

                <h2 className="font-serif text-2xl font-light text-foreground">
                  {activeQuiz.title}
                </h2>
              </div>

              <button
                onClick={() => setActiveQuiz(null)}
                className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                title="Close quiz"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-mono text-muted-foreground">
                <span>
                  Question {currentIndex + 1} of {totalQuestions}
                </span>
                <span>{progressPercent}% Completed</span>
              </div>
              <Progress value={progressPercent} className="h-1.5" />
            </div>

            {/* Active Question Body */}
            <div className="space-y-5 py-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  Skill Focus: {currentQuestion.skillTested}
                </span>

                <button
                  type="button"
                  onClick={handleReadAloud}
                  className="inline-flex items-center gap-1.5 text-xs text-primary bg-primary/10 hover:bg-primary/20 px-2.5 py-1 rounded-lg transition-colors"
                >
                  <Volume2 className="h-3.5 w-3.5" />
                  <span>Read Aloud</span>
                </button>
              </div>

              {/* Reading Passage if applicable */}
              {currentQuestion.passage && (
                <div className="rounded-2xl border border-border bg-muted/30 p-4 text-xs sm:text-sm leading-relaxed text-foreground font-light shadow-inner">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-primary block mb-1">
                    Reading Passage:
                  </span>
                  <p>{currentQuestion.passage}</p>
                </div>
              )}

              {/* Stroop Word if applicable */}
              {currentQuestion.stroopWord && (
                <div className="rounded-2xl border border-border bg-muted/40 p-6 text-center space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
                    Stroop Stimulus Word:
                  </span>
                  <div
                    className="font-mono text-4xl sm:text-5xl font-extrabold tracking-widest uppercase select-none"
                    style={{ color: currentQuestion.stroopWord.displayColor }}
                  >
                    {currentQuestion.stroopWord.word}
                  </div>
                </div>
              )}

              <h3 className="text-base sm:text-lg font-normal text-foreground leading-relaxed">
                {currentQuestion.prompt}
              </h3>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQuestion.options.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectOption(opt.id)}
                      className={`w-full p-4 rounded-2xl border text-left text-xs transition-all flex items-start justify-between ${
                        isSelected
                          ? "bg-primary/10 border-primary text-primary shadow-sm"
                          : "bg-background border-border text-foreground hover:bg-muted/50 hover:border-primary/40"
                      }`}
                    >
                      <div className="leading-relaxed">{opt.text}</div>
                      <div
                        className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ml-3 mt-0.5 ${
                          isSelected ? "bg-primary border-primary text-primary-foreground" : "border-border"
                        }`}
                      >
                        {isSelected && <Check className="h-2.5 w-2.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Hint Toggle */}
              {currentQuestion.hint && (
                <div className="pt-1">
                  {!showHint ? (
                    <button
                      type="button"
                      onClick={() => setShowHint(true)}
                      className="text-xs text-primary hover:underline flex items-center gap-1.5"
                    >
                      <HelpCircle className="h-3.5 w-3.5" />
                      <span>Need a hint?</span>
                    </button>
                  ) : (
                    <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-900 leading-relaxed animate-in fade-in">
                      <strong>Strategy Hint: </strong>
                      {currentQuestion.hint}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer Navigation */}
            <div className="flex items-center justify-between border-t border-border/70 pt-4">
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
                disabled={!selectedOptionId}
                size="sm"
                className="bg-primary text-primary-foreground text-xs gap-1.5 px-5"
              >
                <span>{currentIndex < totalQuestions - 1 ? "Next Question" : "Submit & Grade"}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </>
        ) : (
          /* Completed Scorecard & Question Review */
          <div className="space-y-6">
            <div className="text-center space-y-3 py-4">
              <div className="h-16 w-16 rounded-3xl bg-primary/10 text-primary mx-auto flex items-center justify-center shadow-inner">
                <Trophy className="h-8 w-8 text-primary" />
              </div>

              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
                  Quiz Completed
                </span>
                <h2 className="font-serif text-3xl font-light text-foreground mt-0.5">
                  {activeQuiz.title}
                </h2>
              </div>

              <div className="flex items-center justify-center gap-6 pt-2">
                <div className="rounded-2xl border border-border bg-card p-4 min-w-[120px]">
                  <span className="text-[10px] font-mono uppercase text-muted-foreground block">
                    Score
                  </span>
                  <span className="text-3xl font-bold font-mono text-foreground">
                    {finalScore}%
                  </span>
                </div>

                <div className="rounded-2xl border border-border bg-card p-4 min-w-[120px]">
                  <span className="text-[10px] font-mono uppercase text-muted-foreground block">
                    Accuracy
                  </span>
                  <span className="text-2xl font-bold font-mono text-emerald-600">
                    {totalCorrect}/{totalQuestions}
                  </span>
                </div>

                <div className="rounded-2xl border border-border bg-card p-4 min-w-[120px]">
                  <span className="text-[10px] font-mono uppercase text-muted-foreground block">
                    Time Spent
                  </span>
                  <span className="text-2xl font-bold font-mono text-foreground">
                    {formatTime(secondsElapsed)}
                  </span>
                </div>
              </div>
            </div>

            {/* Cognitive Indicator Feedback */}
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                Screening Indicator Analysis
              </span>
              <p className="text-xs text-muted-foreground font-light leading-relaxed">
                {finalScore >= 80
                  ? `High proficiency observed in ${activeQuiz.domain} processing. Cognitive speed and accuracy are well within typical expectations.`
                  : finalScore >= 50
                  ? `Moderate difficulty patterns observed in ${activeQuiz.domain}. Targeted practice with our interactive exercises is recommended to reinforce automaticity.`
                  : `Elevated friction detected in ${activeQuiz.domain} under timed test conditions. Consider booking a DUT Disability Unit intake session to explore exam accommodations.`}
              </p>
            </div>

            {/* Question by Question Review */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-mono uppercase tracking-widest text-foreground font-semibold">
                Detailed Answer &amp; Explanation Review
              </h3>

              <div className="space-y-3">
                {activeQuiz.questions.map((q, idx) => {
                  const userChoiceId = userAnswers[q.id];
                  const userChoice = q.options.find((o) => o.id === userChoiceId);
                  const correctOption = q.options.find((o) => o.isCorrect);
                  const isUserCorrect = userChoice?.isCorrect;

                  return (
                    <div
                      key={q.id}
                      className={`rounded-2xl border p-4 space-y-2.5 transition-all ${
                        isUserCorrect
                          ? "bg-emerald-50/40 border-emerald-200 dark:bg-emerald-950/20"
                          : "bg-rose-50/40 border-rose-200 dark:bg-rose-950/20"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-semibold text-foreground">
                          {idx + 1}. {q.prompt}
                        </span>
                        {isUserCorrect ? (
                          <Badge variant="outline" className="text-emerald-600 border-emerald-500/30 text-[10px]">
                            Correct
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-rose-600 border-rose-500/30 text-[10px]">
                            Incorrect
                          </Badge>
                        )}
                      </div>

                      <div className="text-xs space-y-1 text-muted-foreground">
                        <div>
                          Your answer:{" "}
                          <strong className={isUserCorrect ? "text-emerald-700" : "text-rose-700"}>
                            {userChoice?.text ?? "No answer"}
                          </strong>
                        </div>
                        {!isUserCorrect && (
                          <div>
                            Correct answer:{" "}
                            <strong className="text-emerald-700 font-medium">
                              {correctOption?.text}
                            </strong>
                          </div>
                        )}
                      </div>

                      {correctOption?.explanation && (
                        <div className="text-[11px] text-muted-foreground font-light bg-card/60 p-2.5 rounded-lg border border-border/50">
                          <strong>Explanation: </strong>
                          {correctOption.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between border-t border-border/70 pt-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setCurrentIndex(0);
                  setSelectedOptionId(null);
                  setUserAnswers({});
                  setIsCompleted(false);
                  setSecondsElapsed(0);
                }}
                className="text-xs gap-1.5"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Retake Quiz</span>
              </Button>

              <Button
                type="button"
                size="sm"
                onClick={() => setActiveQuiz(null)}
                className="bg-primary text-primary-foreground text-xs px-6"
              >
                Done &amp; Close
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
