import React, { useState } from "react";
import { CheckCircle2, XCircle, Volume2, RotateCcw, ArrowRight, Zap } from "lucide-react";
import { Button } from "../../../../components/ui/button";

interface WordDrillToolProps {
  onComplete: () => void;
}

interface WordCard {
  id: string;
  term: string;
  phonetic: string;
  definition: string;
  options: { label: string; isCorrect: boolean }[];
}

const CARDS: WordCard[] = [
  {
    id: "w1",
    term: "Polymorphism",
    phonetic: "/ˌpɒl.iˈmɔː.fɪ.zəm/",
    definition: "The ability of different object classes to respond to the same method call with specialized behavior.",
    options: [
      { label: "Same interface, multiple underlying forms", isCorrect: true },
      { label: "Storing multiple duplicate data copies in memory", isCorrect: false },
      { label: "Compressing binary packets over network sockets", isCorrect: false },
    ],
  },
  {
    id: "w2",
    term: "Asynchronous",
    phonetic: "/eɪˈsɪŋ.krə.nəs/",
    definition: "Operations that execute independently of the main program flow without blocking runtime threads.",
    options: [
      { label: "Executes in parallel without blocking execution", isCorrect: true },
      { label: "Strict sequential step-by-step processing", isCorrect: false },
      { label: "Encrypting credentials before network transmission", isCorrect: false },
    ],
  },
  {
    id: "w3",
    term: "Idempotency",
    phonetic: "/ˌaɪ.dɛmˈpoʊ.tən.si/",
    definition: "An operation that produces the exact same result regardless of whether it is applied once or multiple times.",
    options: [
      { label: "Executing repeatedly gives the same consistent outcome", isCorrect: true },
      { label: "A function that mutates global state variables", isCorrect: false },
      { label: "Generating random cryptographically secure keys", isCorrect: false },
    ],
  },
  {
    id: "w4",
    term: "Heuristic",
    phonetic: "/hjʊəˈrɪs.tɪk/",
    definition: "A practical problem-solving technique or shortcut that produces an optimal-enough solution for complex tasks.",
    options: [
      { label: "A practical rule of thumb or discovery shortcut", isCorrect: true },
      { label: "A mathematically guaranteed brute-force solution", isCorrect: false },
      { label: "A hardware component for cache coherence", isCorrect: false },
    ],
  },
];

export function WordDrillTool({ onComplete }: WordDrillToolProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);

  const card = CARDS[currentIdx] ?? CARDS[0]!;
  const isSelected = selectedIdx !== null;
  const isCorrect = isSelected && Boolean(card.options[selectedIdx]?.isCorrect);

  const handleSpeak = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
    }
  };

  const handleSelect = (idx: number) => {
    if (isSelected) return;
    setSelectedIdx(idx);
    if (card.options[idx]?.isCorrect) {
      setCorrectCount((c) => c + 1);
    }
  };

  const handleNext = () => {
    setSelectedIdx(null);
    if (currentIdx < CARDS.length - 1) {
      setCurrentIdx((i) => i + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/70 pb-3">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-amber-500" />
          <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Card {currentIdx + 1} of {CARDS.length}
          </span>
        </div>
        <span className="text-xs font-mono text-muted-foreground bg-muted px-2.5 py-1 rounded">
          Accuracy: {correctCount}/{CARDS.length}
        </span>
      </div>

      {/* Big Word Presentation Box */}
      <div className="rounded-3xl border border-border bg-gradient-to-br from-card via-card to-primary/5 p-8 text-center space-y-3 shadow-sm">
        <div className="flex items-center justify-center gap-3">
          <h2 className="font-mono text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            {card.term}
          </h2>
          <button
            type="button"
            onClick={() => handleSpeak(card.term)}
            className="p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            title="Listen to pronunciation"
          >
            <Volume2 className="h-5 w-5" />
          </button>
        </div>

        <p className="text-sm font-mono text-muted-foreground">{card.phonetic}</p>
        <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
          {card.definition}
        </p>
      </div>

      {/* Rapid Multiple Choice */}
      <div className="space-y-2.5">
        <span className="text-xs font-medium text-muted-foreground block">
          Select the core conceptual meaning:
        </span>
        {card.options.map((opt, idx) => {
          const isThisSelected = selectedIdx === idx;
          let style = "bg-card border-border hover:border-primary/40 text-foreground";
          if (isSelected) {
            if (opt.isCorrect) {
              style = "bg-emerald-500/15 border-emerald-500 text-emerald-800 font-medium";
            } else if (isThisSelected && !opt.isCorrect) {
              style = "bg-rose-500/15 border-rose-500 text-rose-800 font-medium";
            } else {
              style = "bg-muted/30 border-border/40 text-muted-foreground opacity-50";
            }
          }

          return (
            <button
              key={idx}
              disabled={isSelected}
              onClick={() => handleSelect(idx)}
              className={`w-full p-4 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${style}`}
            >
              <span>{opt.label}</span>
              {isSelected && opt.isCorrect && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
              {isSelected && isThisSelected && !opt.isCorrect && (
                <XCircle className="h-4 w-4 text-rose-600" />
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Controls */}
      <div className="flex items-center justify-between pt-2">
        <Button
          onClick={() => {
            setCurrentIdx(0);
            setSelectedIdx(null);
            setCorrectCount(0);
          }}
          variant="ghost"
          size="sm"
          className="text-xs text-muted-foreground"
        >
          <RotateCcw className="h-3.5 w-3.5 mr-1" />
          <span>Reset Cards</span>
        </Button>

        {isSelected && (
          <Button
            onClick={handleNext}
            className="bg-primary text-primary-foreground gap-2 text-xs"
          >
            <span>{currentIdx < CARDS.length - 1 ? "Next Card" : "Finish Drill"}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
