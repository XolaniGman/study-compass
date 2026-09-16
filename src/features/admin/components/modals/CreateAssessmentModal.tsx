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
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Textarea } from "../../../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { useInstitutional } from "../../../shared";
import type { ScreeningDomainKey, AssessmentQuestion } from "../../../shared";
import { PlusCircle, AlertCircle, Sparkles } from "lucide-react";

interface CreateAssessmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateAssessmentModal({ open, onOpenChange }: CreateAssessmentModalProps) {
  const { assessmentPools, addQuestionToPool } = useInstitutional();

  const [domain, setDomain] = useState<ScreeningDomainKey>("reading");
  const [prompt, setPrompt] = useState("");
  const [context, setContext] = useState("");
  const [questionType, setQuestionType] = useState<AssessmentQuestion["type"]>("frequency-scale");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setError("Please input a valid screening indicator question prompt.");
      return;
    }

    addQuestionToPool(domain, {
      prompt: prompt.trim(),
      context: context.trim() || "Psychometric indicator & cognitive stamina assessment",
      type: questionType,
    });

    setPrompt("");
    setContext("");
    setError("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-3xl p-6 sm:p-8">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-wider font-semibold">
            <PlusCircle className="h-4 w-4" />
            <span>FR20 &bull; Screening Battery Management</span>
          </div>
          <DialogTitle className="font-serif text-2xl font-normal text-foreground mt-1">
            Add Question to Assessment Pool
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground font-light">
            Add or calibrate screening questions within the fixed 5-domain psychometric battery
            (FR05–FR09). Questions are immediately incorporated into student screening flows.
          </DialogDescription>
        </DialogHeader>

        {/* FR05-FR09 Scope Guard Notice */}
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-3.5 flex items-start gap-2.5 text-xs">
          <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <p className="text-muted-foreground font-light text-[11px] leading-relaxed">
            <strong className="text-foreground font-medium">Domain Integrity:</strong> Screening
            questions must belong to one of the 5 institutional domains (Reading, Grammar,
            Mathematics, Memory, Comprehension) to preserve classification model validity.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-destructive/10 p-3 text-xs text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Screening Domain (FR05–FR09) *</Label>
            <Select
              value={domain}
              onValueChange={(val) => setDomain(val as ScreeningDomainKey)}
            >
              <SelectTrigger className="rounded-xl text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                <SelectItem value="reading">
                  FR05 &bull; Reading &amp; Lexical Processing ({assessmentPools.reading?.questions.length || 5} Questions)
                </SelectItem>
                <SelectItem value="grammar">
                  FR06 &bull; Grammar &amp; Syntax Formulation ({assessmentPools.grammar?.questions.length || 5} Questions)
                </SelectItem>
                <SelectItem value="mathematics">
                  FR07 &bull; Mathematics &amp; Quantitative Reasoning ({assessmentPools.mathematics?.questions.length || 5} Questions)
                </SelectItem>
                <SelectItem value="memory">
                  FR08 &bull; Working Memory &amp; Cognitive Recall ({assessmentPools.memory?.questions.length || 5} Questions)
                </SelectItem>
                <SelectItem value="comprehension">
                  FR09 &bull; Comprehension &amp; Text Analysis ({assessmentPools.comprehension?.questions.length || 5} Questions)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="prompt" className="text-xs font-medium">
              Student-Facing Question Prompt *
            </Label>
            <Textarea
              id="prompt"
              rows={3}
              placeholder="e.g. When reading continuous academic prose, how often do you experience line-skipping or orthographic visual fatigue?"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="rounded-xl text-xs resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="context" className="text-xs font-medium">
                Cognitive Sub-Indicator Focus
              </Label>
              <Input
                id="context"
                placeholder="e.g. Saccadic tracking stability"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Response Rating Scale</Label>
              <Select
                value={questionType}
                onValueChange={(val) => setQuestionType(val as AssessmentQuestion["type"])}
              >
                <SelectTrigger className="rounded-xl text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  <SelectItem value="frequency-scale">Frequency Scale (0-3 Likert)</SelectItem>
                  <SelectItem value="impact-scale">Academic Impact Scale (0-3)</SelectItem>
                  <SelectItem value="accuracy-scale">Accuracy / Error Scale (0-3)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="pt-3 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-primary text-primary-foreground rounded-xl text-xs px-4 shadow-sm"
            >
              Add to Domain Pool
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
