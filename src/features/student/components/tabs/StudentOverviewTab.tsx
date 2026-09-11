import React from "react";
import {
  ClipboardList,
  FileBarChart2,
  Dumbbell,
  CalendarCheck,
  ArrowRight,
  Sparkles,
  Play,
  CheckCircle,
  ExternalLink,
  BookOpen,
  Trophy,
} from "lucide-react";
import { useStudent } from "../../context/StudentContext";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";
import { Progress } from "../../../../components/ui/progress";

interface StudentOverviewTabProps {
  onSelectTab: (tab: string) => void;
}

export function StudentOverviewTab({ onSelectTab }: StudentOverviewTabProps) {
  const {
    profile,
    latestSession,
    exercises,
    consultations,
    setActiveExercise,
    setIsAssessmentModalOpen,
    setActiveAssessmentModuleId,
    setIsReportModalOpen,
    setIsConsultationModalOpen,
  } = useStudent();

  const domainResultsList = Object.values(latestSession.domainResults);
  const activeConsultation = consultations.find((c) => c.status === "confirmed" || c.status === "scheduled");
  const totalCompletedExercises = exercises.reduce((acc, ex) => acc + ex.completedCount, 0);

  return (
    <div className="space-y-8">
      {/* Top Banner Card */}
      <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                Semester 2 &bull; Active Screening Profile
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                Last Evaluated: {new Date(latestSession.completedAt).toLocaleDateString()}
              </span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-light tracking-tight text-foreground">
              Welcome back, {profile.name.split(" ")[0]}
            </h2>

            <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
              Your screening indicators have identified key study strengths in{" "}
              <strong className="text-foreground font-medium">Attention &amp; Vigilance</strong> and
              recommended accommodations for{" "}
              <strong className="text-foreground font-medium">Reading &amp; Quantitative Fluency</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={() => onSelectTab("quizzes")}
              className="bg-primary text-primary-foreground text-xs gap-2 rounded-xl shadow-md shadow-primary/20"
            >
              <Trophy className="h-4 w-4" />
              <span>Take Online Quizzes</span>
            </Button>

            <Button
              onClick={() => {
                setActiveAssessmentModuleId("all-comprehensive");
                setIsAssessmentModalOpen(true);
              }}
              variant="outline"
              className="text-xs gap-2 rounded-xl"
            >
              <ClipboardList className="h-4 w-4" />
              <span>Screening Battery</span>
            </Button>

            <Button
              onClick={() => setIsReportModalOpen(true)}
              variant="outline"
              className="text-xs gap-2 rounded-xl"
            >
              <FileBarChart2 className="h-4 w-4" />
              <span>Official Report</span>
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Metrics Strip */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1: Composite Index */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/40">
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-xl bg-chart-2/15 text-chart-2 flex items-center justify-center">
              <FileBarChart2 className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-mono font-medium text-chart-2 bg-chart-2/10 px-2 py-0.5 rounded-md">
              Evaluated
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Screening Index
            </h3>
            <p className="mt-1 text-3xl font-bold tracking-tight text-foreground">
              {latestSession.overallIndex}%
            </p>
            <p className="mt-1 text-xs text-muted-foreground font-light">
              Composite across 4 domains
            </p>
          </div>
        </div>

        {/* Metric 2: Available Modules */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/40">
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <ClipboardList className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-mono font-medium text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md">
              4 Ready
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Screening Batteries
            </h3>
            <p className="mt-1 text-3xl font-bold tracking-tight text-foreground">4</p>
            <p className="mt-1 text-xs text-muted-foreground font-light">
              Adaptive domain modules
            </p>
          </div>
        </div>

        {/* Metric 3: Exercises Completed */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/40">
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-xl bg-chart-3/15 text-chart-3 flex items-center justify-center">
              <Dumbbell className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-mono font-medium text-chart-3 bg-chart-3/10 px-2 py-0.5 rounded-md">
              Streak Active
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Practice Sessions
            </h3>
            <p className="mt-1 text-3xl font-bold tracking-tight text-foreground">
              {totalCompletedExercises}
            </p>
            <p className="mt-1 text-xs text-muted-foreground font-light">
              Completed study routines
            </p>
          </div>
        </div>

        {/* Metric 4: DUT Appointments */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/40">
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-xl bg-chart-1/15 text-chart-1 flex items-center justify-center">
              <CalendarCheck className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-mono font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-md">
              DUT Unit
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Support Bookings
            </h3>
            <p className="mt-1 text-3xl font-bold tracking-tight text-foreground">
              {consultations.filter((c) => c.status !== "cancelled").length}
            </p>
            <p className="mt-1 text-xs text-muted-foreground font-light">
              Active intake consultations
            </p>
          </div>
        </div>
      </div>

      {/* Active Consultation Notification Banner (If exists) */}
      {activeConsultation && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
              <CalendarCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-foreground">
                  Upcoming DUT Consultation Confirmed
                </span>
                <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-500/30">
                  {activeConsultation.referenceNumber}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground font-light mt-0.5">
                {activeConsultation.consultationTypeLabel} &bull; {activeConsultation.specialistName} &bull;{" "}
                {activeConsultation.date} at {activeConsultation.timeSlot}
              </p>
            </div>
          </div>

          <Button
            onClick={() => onSelectTab("support")}
            size="sm"
            variant="outline"
            className="text-xs text-emerald-700 border-emerald-600/30 hover:bg-emerald-500/10 shrink-0"
          >
            <span>Manage Consultation</span>
            <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
          </Button>
        </div>
      )}

      {/* 2-Column Section: Screening Indicators + Recommended Exercises */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left: Screening Indicators */}
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/70 pb-4">
            <div>
              <h3 className="font-serif text-xl font-normal text-foreground">
                My Screening Indicators
              </h3>
              <p className="text-xs text-muted-foreground font-light mt-0.5">
                Preliminary cognitive &amp; academic processing indicators
              </p>
            </div>
            <Button
              onClick={() => onSelectTab("results")}
              variant="ghost"
              size="sm"
              className="text-xs text-primary gap-1"
            >
              <span>Deep Dive</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="space-y-4">
            {domainResultsList.map((res) => (
              <div
                key={res.domain}
                className="rounded-2xl border border-border/80 bg-background/60 p-4 space-y-2.5 transition-all hover:border-primary/40 hover:bg-accent/10"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`h-2.5 w-2.5 rounded-full ${res.color}`} />
                    <span className="text-sm font-medium text-foreground">{res.domainTitle}</span>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-[11px] ${
                      res.level === "needs-attention"
                        ? "text-rose-600 border-rose-500/30 bg-rose-500/10"
                        : res.level === "moderate"
                        ? "text-amber-600 border-amber-500/30 bg-amber-500/10"
                        : res.level === "mild"
                        ? "text-blue-600 border-blue-500/30 bg-blue-500/10"
                        : "text-emerald-600 border-emerald-500/30 bg-emerald-500/10"
                    }`}
                  >
                    {res.levelLabel.split(" ")[0]} ({res.score}%)
                  </Badge>
                </div>

                <Progress value={res.score} className="h-1.5" />

                <div className="flex items-center justify-between text-[11px] text-muted-foreground font-light">
                  <span className="truncate max-w-[240px]">{res.summary}</span>
                  <button
                    onClick={() => {
                      const mod =
                        res.domain === "reading"
                          ? "mod-reading"
                          : res.domain === "math"
                          ? "mod-math"
                          : res.domain === "writing"
                          ? "mod-writing"
                          : "mod-attention";
                      setActiveAssessmentModuleId(mod);
                      setIsAssessmentModalOpen(true);
                    }}
                    className="text-primary hover:underline text-[11px] shrink-0 font-medium ml-2"
                  >
                    Retake Module
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Recommended Exercises & Assistive Tools */}
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/70 pb-4">
            <div>
              <h3 className="font-serif text-xl font-normal text-foreground">
                Study Tools &amp; Exercises
              </h3>
              <p className="text-xs text-muted-foreground font-light mt-0.5">
                Personalized practice routines matched to your indicators
              </p>
            </div>
            <Button
              onClick={() => onSelectTab("exercises")}
              variant="ghost"
              size="sm"
              className="text-xs text-primary gap-1"
            >
              <span>View All ({exercises.length})</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="space-y-3">
            {exercises.slice(0, 3).map((ex) => (
              <div
                key={ex.id}
                className="rounded-2xl border border-border/80 bg-background/60 p-4 space-y-3 transition-all hover:border-primary/40"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">
                        {ex.category}
                      </span>
                      <span className="text-xs text-muted-foreground font-mono">
                        {ex.durationMinutes} mins
                      </span>
                    </div>
                    <h4 className="text-sm font-medium text-foreground mt-1">{ex.title}</h4>
                    <p className="text-xs text-muted-foreground font-light mt-0.5 line-clamp-1">
                      {ex.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-border/40">
                  <span className="text-[11px] text-muted-foreground font-light">
                    Completed {ex.completedCount} times
                  </span>
                  <Button
                    onClick={() => setActiveExercise(ex)}
                    size="sm"
                    className="bg-primary text-primary-foreground text-xs gap-1.5 h-8 px-3 rounded-lg"
                  >
                    <Play className="h-3 w-3" />
                    <span>Launch Tool</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
