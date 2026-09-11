import React from "react";
import { X, Dumbbell, Sparkles, CheckCircle } from "lucide-react";
import { useStudent } from "../context/StudentContext";
import { TtsReaderTool } from "./exercises/TtsReaderTool";
import { PomodoroFocusTool } from "./exercises/PomodoroFocusTool";
import { PeelEssayBuilderTool } from "./exercises/PeelEssayBuilderTool";
import { MathPatternsTool } from "./exercises/MathPatternsTool";
import { WordDrillTool } from "./exercises/WordDrillTool";
import { Badge } from "../../../components/ui/badge";

export function InteractiveExerciseModal() {
  const { activeExercise, setActiveExercise, recordExerciseCompletion } = useStudent();

  if (!activeExercise) return null;

  const handleComplete = () => {
    recordExerciseCompletion(activeExercise.id);
  };

  const renderTool = () => {
    switch (activeExercise.interactiveType) {
      case "tts-reader":
        return <TtsReaderTool onComplete={handleComplete} />;
      case "pomodoro":
        return <PomodoroFocusTool onComplete={handleComplete} />;
      case "peel-essay":
        return <PeelEssayBuilderTool onComplete={handleComplete} />;
      case "math-patterns":
        return <MathPatternsTool onComplete={handleComplete} />;
      case "word-drill":
        return <WordDrillTool onComplete={handleComplete} />;
      default:
        return <TtsReaderTool onComplete={handleComplete} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setActiveExercise(null)}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl z-10 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border/70 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-primary border-primary/30 text-xs">
                {activeExercise.category}
              </Badge>
              <span className="text-xs text-muted-foreground font-mono">
                {activeExercise.schedule}
              </span>
            </div>
            <h2 className="font-serif text-2xl font-light tracking-tight text-foreground">
              {activeExercise.title}
            </h2>
            <p className="text-xs text-muted-foreground font-light leading-relaxed max-w-xl">
              {activeExercise.description}
            </p>
          </div>

          <button
            onClick={() => setActiveExercise(null)}
            className="p-2 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            title="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Dynamic Interactive Exercise Body */}
        <div className="py-2">{renderTool()}</div>
      </div>
    </div>
  );
}
