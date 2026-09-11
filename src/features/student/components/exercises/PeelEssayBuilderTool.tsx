import React, { useState } from "react";
import { CheckCircle, Copy, FileText, Sparkles, ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { toast } from "sonner";

interface PeelEssayBuilderToolProps {
  onComplete: () => void;
}

export function PeelEssayBuilderTool({ onComplete }: PeelEssayBuilderToolProps) {
  const [point, setPoint] = useState(
    "Relational database normalization is critical for ensuring data integrity and minimizing insertion anomalies in modern enterprise applications."
  );
  const [evidence, setEvidence] = useState(
    "According to Codd (1970) and subsequent empirical database benchmarks, decomposing tables to Third Normal Form (3NF) reduces redundancy by up to 60% and enforces referential keys across transactions."
  );
  const [explanation, setExplanation] = useState(
    "When non-key attributes are strictly dependent only on the primary key, update operations do not risk partial or contradictory records, directly preventing silent financial or operational data corruption."
  );
  const [link, setLink] = useState(
    "Consequently, engineering robust schema structures at the design stage remains a foundational prerequisite before migrating workloads to cloud-native microservices."
  );

  const fullParagraph = `${point} ${evidence} ${explanation} ${link}`;
  const wordCount = fullParagraph.trim().split(/\s+/).filter(Boolean).length;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullParagraph);
    toast.success("Structured PEEL paragraph copied to clipboard!");
  };

  const handleReset = () => {
    setPoint("");
    setEvidence("");
    setExplanation("");
    setLink("");
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 flex items-center gap-3">
        <Sparkles className="h-5 w-5 text-primary shrink-0" />
        <div className="text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground font-semibold">PEEL Methodology: </strong>
          Structure your thoughts step-by-step into academic-grade paragraphs. Overcomes blank-page
          paralysis and dysgraphic structuring strain.
        </div>
      </div>

      {/* 4 Interactive Input Steps */}
      <div className="space-y-4">
        {/* P - Point */}
        <div className="rounded-xl border border-chart-2/40 bg-card p-4 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-chart-2 flex items-center gap-2">
              <span className="h-5 w-5 rounded-full bg-chart-2/15 flex items-center justify-center text-[10px]">
                P
              </span>
              <span>Point — Topic Sentence / Central Claim</span>
            </label>
            <span className="text-[10px] text-muted-foreground">What is your main idea?</span>
          </div>
          <textarea
            value={point}
            onChange={(e) => setPoint(e.target.value)}
            placeholder="State your main assertion or thesis sub-argument clearly..."
            className="w-full h-16 p-2.5 rounded-lg border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        {/* E - Evidence */}
        <div className="rounded-xl border border-chart-5/40 bg-card p-4 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-chart-5 flex items-center gap-2">
              <span className="h-5 w-5 rounded-full bg-chart-5/15 flex items-center justify-center text-[10px]">
                E
              </span>
              <span>Evidence — Data, Citation, or Code Proof</span>
            </label>
            <span className="text-[10px] text-muted-foreground">Who or what supports this?</span>
          </div>
          <textarea
            value={evidence}
            onChange={(e) => setEvidence(e.target.value)}
            placeholder="Include literature citations, statistical findings, or code benchmarks..."
            className="w-full h-16 p-2.5 rounded-lg border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        {/* E - Explanation */}
        <div className="rounded-xl border border-chart-1/40 bg-card p-4 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-chart-1 flex items-center gap-2">
              <span className="h-5 w-5 rounded-full bg-chart-1/15 flex items-center justify-center text-[10px]">
                E
              </span>
              <span>Explanation — Analysis & Critical Thinking</span>
            </label>
            <span className="text-[10px] text-muted-foreground">Why does this evidence matter?</span>
          </div>
          <textarea
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            placeholder="Unpack the technical significance and mechanism in your own words..."
            className="w-full h-16 p-2.5 rounded-lg border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        {/* L - Link */}
        <div className="rounded-xl border border-chart-3/40 bg-card p-4 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-chart-3 flex items-center gap-2">
              <span className="h-5 w-5 rounded-full bg-chart-3/15 flex items-center justify-center text-[10px]">
                L
              </span>
              <span>Link — Connection back to Assignment Thesis</span>
            </label>
            <span className="text-[10px] text-muted-foreground">Tie back to the big picture</span>
          </div>
          <textarea
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="Conclude with how this point connects to the overarching essay prompt..."
            className="w-full h-16 p-2.5 rounded-lg border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      {/* Unified Output Preview */}
      <div className="rounded-2xl border border-border bg-muted/40 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Assembled Academic Paragraph Preview ({wordCount} Words)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleCopy}
              size="sm"
              variant="outline"
              className="text-xs gap-1.5 h-8"
              disabled={!fullParagraph.trim()}
            >
              <Copy className="h-3.5 w-3.5" />
              <span>Copy Paragraph</span>
            </Button>
            <Button
              onClick={handleReset}
              size="sm"
              variant="ghost"
              className="text-xs text-muted-foreground h-8"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 text-sm leading-relaxed text-foreground font-light shadow-inner">
          {fullParagraph.trim() ? (
            <p>
              <span className="text-chart-2 font-medium">{point} </span>
              <span className="text-chart-5">{evidence} </span>
              <span className="text-chart-1">{explanation} </span>
              <span className="text-chart-3 font-medium">{link}</span>
            </p>
          ) : (
            <span className="text-muted-foreground italic text-xs">
              Fill in the 4 steps above to assemble your paragraph...
            </span>
          )}
        </div>
      </div>

      {/* Complete Button */}
      <div className="flex justify-end">
        <Button
          onClick={onComplete}
          className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 text-xs"
        >
          <CheckCircle className="h-4 w-4" />
          <span>Save Draft & Complete Exercise (+1 Streak)</span>
        </Button>
      </div>
    </div>
  );
}
