import React, { useState, useEffect } from "react";
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

const SLIDE_DURATION_MS = 7000;

const BANNER_SLIDES = [
  "/assets/cards/student_banner_bg.jpg",
  "/assets/hero_ref.jpg",
  "/assets/showcase_ref.jpg",
  "/assets/support_ref.jpg",
];

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

  const [activeSlide, setActiveSlide] = useState(0);

  // Rotate the banner photos (skipped for reduced-motion users; window is unavailable during SSR)
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % BANNER_SLIDES.length);
    }, SLIDE_DURATION_MS);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Banner Card */}
      <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-slate-950 shadow-md min-h-[220px]">
        {/* Animated background: the photos cross-fade, and each drifts like the other banners */}
        {BANNER_SLIDES.map((src, index) => (
          <div
            key={src}
            className="admin-metric-bg absolute inset-0 pointer-events-none transition-opacity duration-[1500ms] ease-in-out"
            style={{
              backgroundImage: `url("${src}")`,
              backgroundSize: "140% auto",
              animationDelay: `-${index * 7}s`,
              opacity: index === activeSlide ? 1 : 0,
            }}
            aria-hidden="true"
          />
        ))}
        <div
          className="admin-metric-sweep absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-emerald-200/10 to-transparent pointer-events-none"
          aria-hidden="true"
        />
        {/* Dark on left for text legibility, clearer on right to show the image */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/75 to-slate-950/30 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 p-6 sm:p-8">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-0.5 rounded-full backdrop-blur-sm shadow-xs">
                Semester 2 &bull; Active Screening Profile
              </span>
              <span className="text-xs text-slate-300 font-mono">
                Last Evaluated: {new Date(latestSession.completedAt).toLocaleDateString()}
              </span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-light tracking-tight text-white drop-shadow-xs">
              Welcome back, {profile.name.split(" ")[0]}
            </h2>

            <p className="text-xs sm:text-sm text-slate-200 font-light leading-relaxed">
              Your screening indicators have identified key study strengths in{" "}
              <strong className="text-white font-medium">Attention &amp; Vigilance</strong> and
              recommended accommodations for{" "}
              <strong className="text-white font-medium">Reading &amp; Quantitative Fluency</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={() => onSelectTab("quizzes")}
              className="bg-primary text-primary-foreground text-xs gap-2 rounded-xl shadow-md shadow-primary/30"
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
              className="text-xs gap-2 rounded-xl bg-slate-900/80 border-slate-700 text-white hover:bg-slate-800 backdrop-blur-sm"
            >
              <ClipboardList className="h-4 w-4 text-emerald-400" />
              <span>Screening Battery</span>
            </Button>

            <Button
              onClick={() => setIsReportModalOpen(true)}
              variant="outline"
              className="text-xs gap-2 rounded-xl bg-slate-900/80 border-slate-700 text-white hover:bg-slate-800 backdrop-blur-sm"
            >
              <FileBarChart2 className="h-4 w-4 text-sky-400" />
              <span>Official Report</span>
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Metrics Strip with Clear, Vivid Background Images */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1: Composite Index */}
        <div className="relative group overflow-hidden rounded-2xl border border-border/80 shadow-md min-h-[170px]">
          <img
            src="/assets/cards/metric_screening_index.jpg"
            alt="Cognitive Brain Index"
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          {/* Bottom-up dark gradient scrim so image is clearly visible while text is crisp */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30 pointer-events-none" />

          <div className="relative z-10 flex flex-col justify-between h-full p-5">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-xl bg-black/60 text-sky-300 flex items-center justify-center backdrop-blur-md border border-white/20 shadow-xs">
                <FileBarChart2 className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-mono font-semibold text-sky-300 bg-black/60 border border-sky-500/40 px-2.5 py-0.5 rounded-md backdrop-blur-md shadow-xs">
                Evaluated
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider drop-shadow-xs">
                Screening Index
              </h3>
              <p className="mt-1 text-3xl font-bold tracking-tight text-white font-mono drop-shadow-sm">
                {latestSession.overallIndex}%
              </p>
              <p className="mt-1 text-xs text-slate-300 font-light">
                Composite across 4 domains
              </p>
            </div>
          </div>
        </div>

        {/* Metric 2: Available Modules */}
        <div className="relative group overflow-hidden rounded-2xl border border-border/80 shadow-md min-h-[170px]">
          <img
            src="/assets/cards/metric_screening_batteries.jpg"
            alt="Screening Batteries"
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30 pointer-events-none" />

          <div className="relative z-10 flex flex-col justify-between h-full p-5">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-xl bg-black/60 text-emerald-300 flex items-center justify-center backdrop-blur-md border border-white/20 shadow-xs">
                <ClipboardList className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-mono font-semibold text-emerald-300 bg-black/60 border border-emerald-500/40 px-2.5 py-0.5 rounded-md backdrop-blur-md shadow-xs">
                4 Ready
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider drop-shadow-xs">
                Screening Batteries
              </h3>
              <p className="mt-1 text-3xl font-bold tracking-tight text-white font-mono drop-shadow-sm">
                4
              </p>
              <p className="mt-1 text-xs text-slate-300 font-light">
                Adaptive domain modules
              </p>
            </div>
          </div>
        </div>

        {/* Metric 3: Exercises Completed */}
        <div className="relative group overflow-hidden rounded-2xl border border-border/80 shadow-md min-h-[170px]">
          <img
            src="/assets/cards/metric_practice_sessions.jpg"
            alt="Practice Sessions Desk"
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30 pointer-events-none" />

          <div className="relative z-10 flex flex-col justify-between h-full p-5">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-xl bg-black/60 text-amber-300 flex items-center justify-center backdrop-blur-md border border-white/20 shadow-xs">
                <Dumbbell className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-mono font-semibold text-amber-300 bg-black/60 border border-amber-500/40 px-2.5 py-0.5 rounded-md backdrop-blur-md shadow-xs">
                Streak Active
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider drop-shadow-xs">
                Practice Sessions
              </h3>
              <p className="mt-1 text-3xl font-bold tracking-tight text-white font-mono drop-shadow-sm">
                {totalCompletedExercises}
              </p>
              <p className="mt-1 text-xs text-slate-300 font-light">
                Completed study routines
              </p>
            </div>
          </div>
        </div>

        {/* Metric 4: DUT Appointments */}
        <div className="relative group overflow-hidden rounded-2xl border border-border/80 shadow-md min-h-[170px]">
          <img
            src="/assets/cards/metric_support_bookings.jpg"
            alt="DUT Support Consultation"
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30 pointer-events-none" />

          <div className="relative z-10 flex flex-col justify-between h-full p-5">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-xl bg-black/60 text-emerald-300 flex items-center justify-center backdrop-blur-md border border-white/20 shadow-xs">
                <CalendarCheck className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-mono font-semibold text-emerald-300 bg-black/60 border border-emerald-500/40 px-2.5 py-0.5 rounded-md backdrop-blur-md shadow-xs">
                DUT Unit
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider drop-shadow-xs">
                Support Bookings
              </h3>
              <p className="mt-1 text-3xl font-bold tracking-tight text-white font-mono drop-shadow-sm">
                {consultations.filter((c) => c.status !== "cancelled").length}
              </p>
              <p className="mt-1 text-xs text-slate-300 font-light">
                Active intake consultations
              </p>
            </div>
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
