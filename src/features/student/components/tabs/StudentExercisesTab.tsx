import React, { useState } from "react";
import {
  Dumbbell,
  Play,
  CheckCircle,
  Flame,
  Sparkles,
  BookOpen,
  Filter,
  Zap,
} from "lucide-react";
import { useStudent } from "../../context/StudentContext";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";

export function StudentExercisesTab() {
  const { exercises, setActiveExercise } = useStudent();
  const [selectedDomain, setSelectedDomain] = useState<string>("all");

  const filteredExercises =
    selectedDomain === "all"
      ? exercises
      : exercises.filter((ex) => ex.domain === selectedDomain);

  const totalCompletions = exercises.reduce((acc, ex) => acc + ex.completedCount, 0);

  return (
    <div className="space-y-8">
      {/* Top Banner & Streak Counter */}
      <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-1 max-w-xl">
            <span className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
              Cognitive &amp; Academic Tooling
            </span>
            <h2 className="font-serif text-3xl font-light text-foreground">
              Study Tools &amp; Daily Practice Routines
            </h2>
            <p className="text-xs text-muted-foreground font-light leading-relaxed">
              Interactive assistive software and practice drills designed to overcome reading
              fatigue, mathematical disorientation, and executive task paralysis.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-card border border-border p-4 rounded-2xl shadow-sm">
            <div className="h-12 w-12 rounded-xl bg-amber-500/15 text-amber-600 flex items-center justify-center">
              <Flame className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                Study Practice Total
              </span>
              <p className="text-2xl font-bold font-mono text-foreground">
                {totalCompletions} <span className="text-xs font-normal text-muted-foreground">Sessions</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Domain Filters */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border/70 pb-4">
        <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 mr-2">
          <Filter className="h-3.5 w-3.5" />
          <span>Filter:</span>
        </span>
        {[
          { id: "all", label: "All Study Tools" },
          { id: "reading", label: "Reading & Dyslexia" },
          { id: "math", label: "Mathematics & Dyscalculia" },
          { id: "writing", label: "Writing & Dysgraphia" },
          { id: "attention", label: "Attention & Executive Focus" },
        ].map((filter) => (
          <button
            key={filter.id}
            onClick={() => setSelectedDomain(filter.id)}
            className={`text-xs px-3.5 py-1.5 rounded-xl border transition-all ${
              selectedDomain === filter.id
                ? "bg-primary text-primary-foreground border-primary font-medium shadow-sm"
                : "bg-muted/40 border-border text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Exercises Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredExercises.map((exercise) => (
          <div
            key={exercise.id}
            className="rounded-3xl border border-border bg-card p-6 sm:p-7 space-y-5 shadow-sm transition-all hover:border-primary/40 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-primary border-primary/30 text-[10px]">
                  {exercise.category}
                </Badge>
                <span className="text-xs font-mono text-muted-foreground">
                  {exercise.durationMinutes} Mins &bull; {exercise.difficulty}
                </span>
              </div>

              <div>
                <h3 className="font-serif text-xl font-normal text-foreground">
                  {exercise.title}
                </h3>
                <p className="text-xs text-muted-foreground font-light mt-1.5 leading-relaxed">
                  {exercise.description}
                </p>
              </div>

              {/* Objectives */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
                  Core Objectives:
                </span>
                <ul className="space-y-1 text-xs text-foreground">
                  {exercise.objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                      <span className="font-light">{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-border/60 flex items-center justify-between">
              <div className="text-xs text-muted-foreground font-light">
                Completed <strong className="text-foreground font-medium">{exercise.completedCount} times</strong>
              </div>

              <Button
                onClick={() => setActiveExercise(exercise)}
                className="bg-primary text-primary-foreground text-xs gap-2 rounded-xl px-4"
              >
                <Play className="h-3.5 w-3.5" />
                <span>Launch Interactive Tool</span>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
