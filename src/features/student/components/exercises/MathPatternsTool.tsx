import React, { useState } from "react";
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Lightbulb, CheckCircle } from "lucide-react";
import { Button } from "../../../../components/ui/button";

interface MathPatternsToolProps {
  onComplete: () => void;
}

interface MathProblem {
  id: number;
  type: "sequence" | "spatial-arithmetic" | "magnitude";
  prompt: string;
  sequence?: string[];
  options: { label: string; value: number | string; isCorrect: boolean }[];
  hint: string;
  explanation: string;
}

const PROBLEMS: MathProblem[] = [
  {
    id: 1,
    type: "sequence",
    prompt: "Identify the missing value in this exponential doubling sequence:",
    sequence: ["4", "16", "64", "256", "?"],
    options: [
      { label: "512", value: 512, isCorrect: false },
      { label: "1,024", value: 1024, isCorrect: true },
      { label: "1,240", value: 1240, isCorrect: false },
      { label: "768", value: 768, isCorrect: false },
    ],
    hint: "Notice that each term is multiplied by 4 (4 × 4 = 16, 16 × 4 = 64).",
    explanation: "256 × 4 = 1,024. Common digit-reversal error is choosing 1,240 or 512.",
  },
  {
    id: 2,
    type: "spatial-arithmetic",
    prompt: "Calculate the total storage array after decomposing 3 racks of 8 servers with 4 TB drives each:",
    options: [
      { label: "72 TB", value: 72, isCorrect: false },
      { label: "96 TB", value: 96, isCorrect: true },
      { label: "84 TB", value: 84, isCorrect: false },
      { label: "112 TB", value: 112, isCorrect: false },
    ],
    hint: "Break into two steps: First compute 3 × 8 = 24 servers, then multiply by 4 TB.",
    explanation: "24 servers × 4 TB = 96 TB. Step-by-step chunking prevents memory overflow.",
  },
  {
    id: 3,
    type: "sequence",
    prompt: "Determine the next Fibonacci computational step:",
    sequence: ["5", "8", "13", "21", "34", "?"],
    options: [
      { label: "45", value: 45, isCorrect: false },
      { label: "55", value: 55, isCorrect: true },
      { label: "53", value: 53, isCorrect: false },
      { label: "68", value: 68, isCorrect: false },
    ],
    hint: "Each number is the sum of the two preceding numbers (21 + 34).",
    explanation: "21 + 34 = 55.",
  },
  {
    id: 4,
    type: "magnitude",
    prompt: "Which data transmission bandwidth provides the highest throughput?",
    options: [
      { label: "0.85 Gbps", value: "0.85 Gbps", isCorrect: false },
      { label: "950 Mbps", value: "950 Mbps", isCorrect: true },
      { label: "75,000 Kbps", value: "75,000 Kbps", isCorrect: false },
      { label: "450 MB/s (approx 3.6 Gbps)", value: "3.6 Gbps", isCorrect: false },
    ],
    hint: "Convert all to Megabits: 0.85 Gbps = 850 Mbps; 950 Mbps = 950 Mbps; 75,000 Kbps = 75 Mbps.",
    explanation: "950 Mbps exceeds 0.85 Gbps (850 Mbps) and 75,000 Kbps (75 Mbps).",
  },
];

export function MathPatternsTool({ onComplete }: MathPatternsToolProps) {
  const [currentProblemIdx, setCurrentProblemIdx] = useState(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [solvedCount, setSolvedCount] = useState(0);

  const problem = PROBLEMS[currentProblemIdx] ?? PROBLEMS[0]!;
  const isSelected = selectedOptionIdx !== null;
  const isCorrect = isSelected && Boolean(problem.options[selectedOptionIdx]?.isCorrect);

  const handleSelectOption = (index: number) => {
    if (isSelected) return;
    setSelectedOptionIdx(index);
    if (problem.options[index]?.isCorrect) {
      setSolvedCount((c) => c + 1);
    }
  };

  const handleNext = () => {
    setSelectedOptionIdx(null);
    setShowHint(false);
    if (currentProblemIdx < PROBLEMS.length - 1) {
      setCurrentProblemIdx((i) => i + 1);
    } else {
      onComplete();
    }
  };

  const handleRestart = () => {
    setCurrentProblemIdx(0);
    setSelectedOptionIdx(null);
    setShowHint(false);
    setSolvedCount(0);
  };

  return (
    <div className="space-y-6">
      {/* Header & Progress */}
      <div className="flex items-center justify-between border-b border-border/70 pb-3">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-primary">
            Pattern Drill {currentProblemIdx + 1} of {PROBLEMS.length}
          </span>
          <h3 className="text-sm font-semibold text-foreground mt-0.5">
            Spatial Equations &amp; Number Sense
          </h3>
        </div>
        <span className="text-xs font-mono text-muted-foreground bg-muted px-2.5 py-1 rounded">
          Score: {solvedCount}/{PROBLEMS.length}
        </span>
      </div>

      {/* Problem Prompt Container */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-sm">
        <p className="text-sm font-medium text-foreground">{problem.prompt}</p>

        {problem.sequence && (
          <div className="flex flex-wrap items-center justify-center gap-3 py-4">
            {problem.sequence.map((term, i) => (
              <div
                key={i}
                className={`h-14 min-w-14 px-3 rounded-2xl flex items-center justify-center font-mono text-lg font-bold border transition-all ${
                  term === "?"
                    ? "bg-primary/10 border-primary text-primary animate-pulse"
                    : "bg-muted/60 border-border text-foreground"
                }`}
              >
                {term}
              </div>
            ))}
          </div>
        )}

        {/* Options */}
        <div className="grid gap-2.5 sm:grid-cols-2 pt-2">
          {problem.options.map((opt, idx) => {
            const isThisSelected = selectedOptionIdx === idx;
            let btnStyle = "bg-background border-border text-foreground hover:bg-muted/50";

            if (isSelected) {
              if (opt.isCorrect) {
                btnStyle = "bg-emerald-500/15 border-emerald-500 text-emerald-700 font-semibold";
              } else if (isThisSelected && !opt.isCorrect) {
                btnStyle = "bg-rose-500/15 border-rose-500 text-rose-700 font-semibold";
              } else {
                btnStyle = "bg-muted/30 border-border/40 text-muted-foreground opacity-50";
              }
            }

            return (
              <button
                key={idx}
                disabled={isSelected}
                onClick={() => handleSelectOption(idx)}
                className={`p-3.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${btnStyle}`}
              >
                <span className="font-mono text-sm">{opt.label}</span>
                {isSelected && opt.isCorrect && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                {isSelected && isThisSelected && !opt.isCorrect && (
                  <XCircle className="h-4 w-4 text-rose-600" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Explanation / Hint Box */}
      {isSelected && (
        <div
          className={`rounded-xl border p-4 space-y-1.5 animate-in fade-in duration-200 ${
            isCorrect
              ? "bg-emerald-50/70 border-emerald-200 text-emerald-900"
              : "bg-rose-50/70 border-rose-200 text-rose-900"
          }`}
        >
          <div className="text-xs font-bold flex items-center gap-1.5">
            {isCorrect ? "Correct Solution!" : "Not Quite"}
          </div>
          <p className="text-xs leading-relaxed font-light">{problem.explanation}</p>
        </div>
      )}

      {!isSelected && (
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            className="text-xs text-primary hover:underline flex items-center gap-1"
          >
            <Lightbulb className="h-3.5 w-3.5" />
            <span>{showHint ? "Hide Strategy Hint" : "Show Strategy Hint"}</span>
          </button>
        </div>
      )}

      {showHint && !isSelected && (
        <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3.5 text-xs text-amber-900 leading-relaxed">
          {problem.hint}
        </div>
      )}

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-2">
        <Button onClick={handleRestart} variant="ghost" size="sm" className="text-xs text-muted-foreground">
          <RotateCcw className="h-3.5 w-3.5 mr-1" />
          <span>Restart Drill</span>
        </Button>

        {isSelected && (
          <Button
            onClick={handleNext}
            className="bg-primary text-primary-foreground gap-2 text-xs"
          >
            <span>{currentProblemIdx < PROBLEMS.length - 1 ? "Next Problem" : "Finish Drill"}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
