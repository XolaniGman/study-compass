import React, { useState } from "react";
import {
  HelpCircle,
  Clock,
  Trophy,
  Filter,
  Play,
  CheckCircle,
  RotateCcw,
  Sparkles,
  Zap,
  BookOpen,
} from "lucide-react";
import { useStudent } from "../../context/StudentContext";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";

export function StudentQuizzesTab() {
  const { quizzes, quizAttempts, setActiveQuiz } = useStudent();
  const [selectedDomain, setSelectedDomain] = useState<string>("all");

  const filteredQuizzes =
    selectedDomain === "all"
      ? quizzes
      : quizzes.filter((q) => q.domain === selectedDomain);

  const averageScore =
    quizAttempts.length > 0
      ? Math.round(
          quizAttempts.reduce((sum, att) => sum + att.scorePercent, 0) / quizAttempts.length
        )
      : 0;

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-0.5 rounded-full font-semibold">
                Online Diagnostic Challenges
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                {quizzes.length} Quizzes Available
              </span>
            </div>

            <h2 className="font-serif text-3xl font-light text-foreground">
              Online Quizzes &amp; Skill Challenges
            </h2>

            <p className="text-xs text-muted-foreground font-light leading-relaxed">
              Test your cognitive processing speed, Stroop attention control, reading decoding, and
              spatial math under interactive quiz conditions.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-card border border-border p-4 rounded-2xl shadow-sm">
            <div className="h-12 w-12 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                Average Quiz Score
              </span>
              <p className="text-2xl font-bold font-mono text-foreground">
                {averageScore}%{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  ({quizAttempts.length} Tests)
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Domain Filters */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border/70 pb-4">
        <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 mr-2">
          <Filter className="h-3.5 w-3.5" />
          <span>Domain:</span>
        </span>
        {[
          { id: "all", label: "All Online Quizzes" },
          { id: "reading", label: "Reading & Dyslexia" },
          { id: "math", label: "Mathematics & Dyscalculia" },
          { id: "attention", label: "Attention & Stroop Test" },
          { id: "writing", label: "Writing & Syntax" },
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

      {/* Quizzes Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredQuizzes.map((quiz) => {
          const pastAttempt = quizAttempts.find((a) => a.quizId === quiz.id);

          return (
            <div
              key={quiz.id}
              className="rounded-3xl border border-border bg-card p-6 sm:p-7 space-y-5 shadow-sm transition-all hover:border-primary/40 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className={`text-[10px] ${quiz.badgeColor}`}>
                    {quiz.category}
                  </Badge>
                  <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{quiz.durationMinutes} mins &bull; {quiz.questions.length} Questions</span>
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-xl font-normal text-foreground">
                    {quiz.title}
                  </h3>
                  <p className="text-xs text-muted-foreground font-light mt-1.5 leading-relaxed">
                    {quiz.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                {pastAttempt ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Last Score:</span>
                    <Badge
                      variant="outline"
                      className={`font-mono text-xs ${
                        pastAttempt.scorePercent >= 80
                          ? "text-emerald-600 border-emerald-500/30"
                          : pastAttempt.scorePercent >= 50
                          ? "text-amber-600 border-amber-500/30"
                          : "text-rose-600 border-rose-500/30"
                      }`}
                    >
                      {pastAttempt.scorePercent}% ({pastAttempt.correctCount}/{pastAttempt.totalQuestions})
                    </Badge>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground font-light">Not taken yet</span>
                )}

                <Button
                  onClick={() => setActiveQuiz(quiz)}
                  className="bg-primary text-primary-foreground text-xs gap-2 rounded-xl px-4"
                >
                  <Play className="h-3.5 w-3.5" />
                  <span>{pastAttempt ? "Retake Quiz Online" : "Take Quiz Online"}</span>
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Past Quiz Attempts Table */}
      {quizAttempts.length > 0 && (
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="font-serif text-xl font-normal text-foreground">
              Quiz Attempts &amp; Performance History
            </h3>
            <span className="text-xs font-mono text-muted-foreground">
              {quizAttempts.length} Records Saved
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="border-b border-border bg-muted/40 text-muted-foreground font-mono uppercase tracking-wider">
                <tr>
                  <th className="p-3.5 rounded-l-xl">Date</th>
                  <th className="p-3.5">Quiz Title</th>
                  <th className="p-3.5">Domain</th>
                  <th className="p-3.5">Score</th>
                  <th className="p-3.5">Accuracy</th>
                  <th className="p-3.5 rounded-r-xl text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {quizAttempts.map((att) => {
                  const quiz = quizzes.find((q) => q.id === att.quizId);
                  return (
                    <tr key={att.id} className="hover:bg-muted/20 transition-colors">
                      <td className="p-3.5 font-mono text-foreground">
                        {new Date(att.completedAt).toLocaleDateString()}
                      </td>
                      <td className="p-3.5 text-foreground font-medium">{att.quizTitle}</td>
                      <td className="p-3.5 capitalize text-muted-foreground">{att.domain}</td>
                      <td className="p-3.5">
                        <Badge
                          variant="outline"
                          className={`font-mono text-xs ${
                            att.scorePercent >= 80
                              ? "text-emerald-600 border-emerald-500/30"
                              : att.scorePercent >= 50
                              ? "text-amber-600 border-amber-500/30"
                              : "text-rose-600 border-rose-500/30"
                          }`}
                        >
                          {att.scorePercent}%
                        </Badge>
                      </td>
                      <td className="p-3.5 font-mono text-muted-foreground">
                        {att.correctCount}/{att.totalQuestions}
                      </td>
                      <td className="p-3.5 text-right">
                        <Button
                          onClick={() => {
                            if (quiz) setActiveQuiz(quiz);
                          }}
                          size="sm"
                          variant="ghost"
                          className="text-xs text-primary h-7 px-2.5 gap-1"
                        >
                          <RotateCcw className="h-3 w-3" />
                          <span>Retake</span>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
