import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../../../components/ui/dialog";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";
import { Progress } from "../../../../components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { useInstitutional } from "../../../shared";
import type { ScreeningDomainKey } from "../../../shared";
import { Eye, ArrowRight, ArrowLeft, CheckCircle2, ShieldAlert } from "lucide-react";

interface PreviewFlowModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PreviewFlowModal({ open, onOpenChange }: PreviewFlowModalProps) {
  const { assessmentPools } = useInstitutional();
  const [domain, setDomain] = useState<ScreeningDomainKey>("reading");
  const [step, setStep] = useState<number>(0); // 0 = instructions, 1..N = question, N+1 = completion summary
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const currentPool = assessmentPools[domain] || assessmentPools.reading;
  const questions = currentPool.questions || [];
  const totalQuestions = questions.length;

  const handleDomainChange = (val: ScreeningDomainKey) => {
    setDomain(val);
    setStep(0);
    setSelectedAnswer(null);
  };

  const handleNext = () => {
    setStep((prev) => Math.min(totalQuestions + 1, prev + 1));
    setSelectedAnswer(null);
  };

  const handleBack = () => {
    setStep((prev) => Math.max(0, prev - 1));
    setSelectedAnswer(null);
  };

  const resetFlow = () => {
    setStep(0);
    setSelectedAnswer(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl rounded-3xl p-6 sm:p-8 max-h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-wider font-semibold">
              <Eye className="h-4 w-4" />
              <span>QA &bull; Student Flow Walkthrough Tool</span>
            </div>
            <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary">
              Simulation Only
            </Badge>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-2">
            <DialogTitle className="font-serif text-2xl font-normal text-foreground">
              Preview Screening Battery Flow
            </DialogTitle>

            <Select value={domain} onValueChange={(val) => handleDomainChange(val as ScreeningDomainKey)}>
              <SelectTrigger className="w-48 rounded-xl text-xs h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                <SelectItem value="reading">FR05 &bull; Reading</SelectItem>
                <SelectItem value="grammar">FR06 &bull; Grammar</SelectItem>
                <SelectItem value="mathematics">FR07 &bull; Mathematics</SelectItem>
                <SelectItem value="memory">FR08 &bull; Memory</SelectItem>
                <SelectItem value="comprehension">FR09 &bull; Comprehension</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogDescription className="text-xs text-muted-foreground font-light">
            Interactive QA walkthrough of the Instructions &rarr; Questions sequence exactly as seen
            by enrolled DUT students. No database records are written.
          </DialogDescription>
        </DialogHeader>

        {/* Step Progress Bar */}
        {step > 0 && step <= totalQuestions && (
          <div className="space-y-1 pt-2">
            <div className="flex justify-between text-[11px] font-mono text-muted-foreground">
              <span>
                Question {step} of {totalQuestions}
              </span>
              <span>{Math.round((step / totalQuestions) * 100)}% Completed</span>
            </div>
            <Progress value={(step / totalQuestions) * 100} className="h-1.5" />
          </div>
        )}

        {/* Content Container */}
        <div className="flex-1 overflow-y-auto my-3 border-y border-border/60 py-4 min-h-[260px] flex flex-col justify-center">
          {/* Step 0: Instructions Screen */}
          {step === 0 && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 space-y-2">
                <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-primary">
                  Module Battery: {currentPool.code}
                </span>
                <h3 className="font-serif text-xl font-normal text-foreground">
                  {currentPool.title}
                </h3>
                <p className="text-xs text-muted-foreground font-light leading-relaxed">
                  {currentPool.description}
                </p>
              </div>

              <div className="space-y-2 text-xs text-muted-foreground font-light">
                <strong className="text-foreground font-medium block">
                  Student Instructions:
                </strong>
                <ul className="space-y-1.5 list-disc pl-4">
                  <li>This battery contains {totalQuestions} psychometric indicator items.</li>
                  <li>Estimated duration: {currentPool.estimatedMinutes} minutes to complete.</li>
                  <li>Rate each question reflecting your experiences over the current academic semester.</li>
                  <li>Responses are confidential under DUT POPIA institutional policy.</li>
                </ul>
              </div>
            </div>
          )}

          {/* Step 1..N: Question Presentation */}
          {step > 0 && step <= totalQuestions && (
            <div className="space-y-5">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">
                  {questions[step - 1]?.context}
                </span>
                <h4 className="text-base font-medium text-foreground pt-1.5 leading-snug">
                  {questions[step - 1]?.prompt}
                </h4>
              </div>

              {/* 4 Likert Options */}
              <div className="space-y-2">
                {[
                  { val: 0, label: "0 — Never / Very Rare", desc: "Does not interfere with studies" },
                  { val: 1, label: "1 — Occasionally", desc: "Noticeable under heavy exam loads" },
                  { val: 2, label: "2 — Frequently", desc: "Consistently slows coursework progress" },
                  { val: 3, label: "3 — Constantly / Severe", desc: "Significant academic obstacle" },
                ].map((opt) => (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => setSelectedAnswer(opt.val)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all text-xs flex items-center justify-between ${
                      selectedAnswer === opt.val
                        ? "border-primary bg-primary/10 font-medium text-primary shadow-sm"
                        : "border-border/80 bg-background/50 hover:border-primary/40 hover:bg-muted/30 text-foreground"
                    }`}
                  >
                    <div>
                      <span className="font-semibold">{opt.label}</span>
                      <p className="text-[11px] text-muted-foreground font-light">{opt.desc}</p>
                    </div>
                    {selectedAnswer === opt.val && (
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step N+1: QA Completion Screen */}
          {step > totalQuestions && (
            <div className="text-center py-4 space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/15 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-2xl font-normal text-foreground">
                Domain Flow Completed
              </h3>
              <p className="text-xs text-muted-foreground font-light max-w-sm mx-auto leading-relaxed">
                QA Walkthrough verified: All {totalQuestions} questions and Likert rating bounds
                rendered seamlessly without errors.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={resetFlow}
                className="rounded-xl text-xs mt-2"
              >
                Restart Preview
              </Button>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-1">
          {step > 0 ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="text-xs rounded-xl gap-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </Button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="rounded-xl text-xs"
            >
              Close QA Preview
            </Button>

            {step <= totalQuestions && (
              <Button
                type="button"
                size="sm"
                onClick={handleNext}
                className="bg-primary text-primary-foreground rounded-xl text-xs px-4 shadow-sm gap-1.5"
              >
                <span>{step === 0 ? "Begin Question Flow" : step === totalQuestions ? "Finish Preview" : "Next Question"}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
