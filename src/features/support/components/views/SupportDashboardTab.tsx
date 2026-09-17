import React from "react";
import {
  LayoutDashboard,
  Users,
  AlertTriangle,
  CalendarCheck,
  ArrowRight,
  ShieldCheck,
  Activity,
  FileBarChart2,
  FileText,
  Clock,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import { useSupport } from "../../context/SupportContext";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";
import { Progress } from "../../../../components/ui/progress";

interface SupportDashboardTabProps {
  onSelectTab: (tab: string) => void;
}

export function SupportDashboardTab({ onSelectTab }: SupportDashboardTabProps) {
  const {
    staffProfile,
    students,
    flaggedStudents,
    pendingReferrals,
    completedReferrals,
    recentActivity,
    setActiveStudentForBreakdown,
  } = useSupport();

  // Compute domain prevalence
  const readingIssues = students.filter((s) => s.domainScores.reading <= 45).length;
  const mathIssues = students.filter((s) => s.domainScores.math <= 45).length;
  const writingIssues = students.filter((s) => s.domainScores.writing <= 45).length;
  const attentionIssues = students.filter((s) => s.domainScores.attention <= 45).length;

  return (
    <div className="space-y-8">
      {/* Top Banner Card */}
      <div className="relative group overflow-hidden rounded-3xl border border-primary/30 shadow-md min-h-[220px]">
        {/* Background Image */}
        <img
          src="/assets/cards/staff_banner_bg.jpg"
          alt="Graduating students"
          className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        {/* Dark on left for text legibility, clearer on right to show the image */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/35 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 p-6 sm:p-8">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-0.5 rounded-full backdrop-blur-sm shadow-xs">
                Semester 2 &bull; Active Triage Session
              </span>
              <span className="text-xs text-slate-300 font-mono">
                Institutional Cohort: {students.length} Students Evaluated
              </span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-light tracking-tight text-white drop-shadow-xs">
              Welcome, {staffProfile.name}
            </h2>

            <p className="text-xs sm:text-sm text-slate-200 font-light leading-relaxed">
              Monitoring active learning disability screening batteries and psychometric triage for{" "}
              <strong className="text-white font-medium">DUT Student Services</strong>. There are currently{" "}
              <strong className="text-rose-300 font-semibold font-mono">{flaggedStudents.length} high priority</strong>{" "}
              students flagged for multi-domain support and{" "}
              <strong className="text-amber-300 font-semibold font-mono">{pendingReferrals.length} cases</strong>{" "}
              awaiting clinical specialist referral intake.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={() => onSelectTab("flagged")}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs gap-2 rounded-xl shadow-md shadow-rose-600/30"
            >
              <AlertTriangle className="h-4 w-4" />
              <span>Review {flaggedStudents.length} Flagged Cases</span>
            </Button>

            <Button
              onClick={() => onSelectTab("intake")}
              variant="outline"
              className="text-xs gap-2 rounded-xl bg-slate-900/80 border-slate-700 text-white hover:bg-slate-800 hover:text-white backdrop-blur-sm"
            >
              <CalendarCheck className="h-4 w-4 text-amber-400" />
              <span>Intake Pipeline ({pendingReferrals.length})</span>
            </Button>

            <Button
              onClick={() => onSelectTab("screening")}
              variant="outline"
              className="text-xs gap-2 rounded-xl bg-slate-900/80 border-slate-700 text-white hover:bg-slate-800 hover:text-white backdrop-blur-sm"
            >
              <Users className="h-4 w-4 text-sky-400" />
              <span>All Screened ({students.length})</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 4 Nav Summary Cards (Doubling as router cards into the 4 pages) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Staff Dashboard / Overview */}
        <div
          onClick={() => onSelectTab("dashboard")}
          className="relative group overflow-hidden rounded-2xl border border-primary/60 ring-1 ring-primary/30 shadow-md min-h-[170px] cursor-pointer"
        >
          <img
            src="/assets/cards/staff_card_overview.jpg"
            alt="Staff Dashboard Overview"
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30 pointer-events-none" />

          <div className="relative z-10 flex flex-col justify-between h-full p-5">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-xl bg-black/60 text-emerald-300 flex items-center justify-center backdrop-blur-md border border-white/20 shadow-xs">
                <LayoutDashboard className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-mono font-semibold text-emerald-300 bg-black/60 border border-emerald-500/40 px-2.5 py-0.5 rounded-md backdrop-blur-md shadow-xs">
                Active View
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider drop-shadow-xs">
                Staff Dashboard
              </h3>
              <p className="mt-1 text-3xl font-bold tracking-tight text-white drop-shadow-sm">Overview</p>
              <p className="mt-1 text-xs text-slate-300 font-light flex items-center gap-1">
                <span>Triage summary &amp; quick router</span>
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Student Screening Queue */}
        <div
          onClick={() => onSelectTab("screening")}
          className="relative group overflow-hidden rounded-2xl border border-border/80 shadow-md min-h-[170px] cursor-pointer transition-all hover:border-sky-500/60"
        >
          <img
            src="/assets/cards/staff_card_screening.jpg"
            alt="Student Screening Queue"
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30 pointer-events-none" />

          <div className="relative z-10 flex flex-col justify-between h-full p-5">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-xl bg-black/60 text-sky-300 flex items-center justify-center backdrop-blur-md border border-white/20 shadow-xs">
                <Users className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-mono font-semibold text-sky-300 bg-black/60 border border-sky-500/40 px-2.5 py-0.5 rounded-md backdrop-blur-md shadow-xs">
                Full Queue
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider drop-shadow-xs">
                Student Screening
              </h3>
              <p className="mt-1 text-3xl font-bold tracking-tight text-white font-mono drop-shadow-sm">
                {students.length}
              </p>
              <p className="mt-1 text-xs text-slate-300 font-light flex items-center justify-between">
                <span>Screened student records</span>
                <ArrowRight className="h-3.5 w-3.5 text-sky-300 opacity-0 group-hover:opacity-100 transition-opacity" />
              </p>
            </div>
          </div>
        </div>

        {/* Card 3: Flagged Support Cases */}
        <div
          onClick={() => onSelectTab("flagged")}
          className="relative group overflow-hidden rounded-2xl border border-border/80 shadow-md min-h-[170px] cursor-pointer transition-all hover:border-rose-500/60"
        >
          <img
            src="/assets/cards/staff_card_flagged.jpg"
            alt="Flagged Support Cases"
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30 pointer-events-none" />

          <div className="relative z-10 flex flex-col justify-between h-full p-5">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-xl bg-black/60 text-rose-300 flex items-center justify-center backdrop-blur-md border border-white/20 shadow-xs">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-mono font-semibold text-rose-300 bg-black/60 border border-rose-500/40 px-2.5 py-0.5 rounded-md backdrop-blur-md shadow-xs">
                &ge;2 Areas Flagged
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider drop-shadow-xs">
                Flagged Support
              </h3>
              <p className="mt-1 text-3xl font-bold tracking-tight text-rose-300 font-mono drop-shadow-sm">
                {flaggedStudents.length}
              </p>
              <p className="mt-1 text-xs text-slate-300 font-light flex items-center justify-between">
                <span>High-priority students</span>
                <ArrowRight className="h-3.5 w-3.5 text-rose-300 opacity-0 group-hover:opacity-100 transition-opacity" />
              </p>
            </div>
          </div>
        </div>

        {/* Card 4: Intake & Referrals Pipeline */}
        <div
          onClick={() => onSelectTab("intake")}
          className="relative group overflow-hidden rounded-2xl border border-border/80 shadow-md min-h-[170px] cursor-pointer transition-all hover:border-amber-500/60"
        >
          <img
            src="/assets/cards/staff_card_intake.jpg"
            alt="Intake and Referrals"
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30 pointer-events-none" />

          <div className="relative z-10 flex flex-col justify-between h-full p-5">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-xl bg-black/60 text-amber-300 flex items-center justify-center backdrop-blur-md border border-white/20 shadow-xs">
                <CalendarCheck className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-mono font-semibold text-amber-300 bg-black/60 border border-amber-500/40 px-2.5 py-0.5 rounded-md backdrop-blur-md shadow-xs">
                Awaiting Action
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider drop-shadow-xs">
                Intake &amp; Referrals
              </h3>
              <p className="mt-1 text-3xl font-bold tracking-tight text-amber-300 font-mono drop-shadow-sm">
                {pendingReferrals.length}
              </p>
              <p className="mt-1 text-xs text-slate-300 font-light flex items-center justify-between">
                <span>Pending specialist intake</span>
                <ArrowRight className="h-3.5 w-3.5 text-amber-300 opacity-0 group-hover:opacity-100 transition-opacity" />
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Section: Screening Domain Distribution + Recent Activity Log */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left: Screening Domain Indicators Distribution */}
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/70 pb-4">
            <div>
              <h3 className="font-serif text-xl font-normal text-foreground">
                Screening Area Prevalence
              </h3>
              <p className="text-xs text-muted-foreground font-light mt-0.5">
                Students demonstrating severe difficulty (&le;45%) across screening domains
              </p>
            </div>
            <Button
              onClick={() => onSelectTab("screening")}
              variant="ghost"
              size="sm"
              className="text-xs text-primary gap-1"
            >
              <span>Explore Table</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="space-y-4">
            {/* Reading */}
            <div className="rounded-2xl border border-border/80 bg-background/60 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  Reading Fluency &amp; Comprehension
                </span>
                <Badge variant="outline" className="text-xs font-mono text-rose-600 border-rose-500/30">
                  {readingIssues} students ({Math.round((readingIssues / students.length) * 100)}%)
                </Badge>
              </div>
              <Progress value={(readingIssues / students.length) * 100} className="h-2" />
            </div>

            {/* Mathematics */}
            <div className="rounded-2xl border border-border/80 bg-background/60 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  Quantitative &amp; Mathematical Dyscalculia
                </span>
                <Badge variant="outline" className="text-xs font-mono text-amber-600 border-amber-500/30">
                  {mathIssues} students ({Math.round((mathIssues / students.length) * 100)}%)
                </Badge>
              </div>
              <Progress value={(mathIssues / students.length) * 100} className="h-2" />
            </div>

            {/* Writing */}
            <div className="rounded-2xl border border-border/80 bg-background/60 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  Writing &amp; Orthographic Dysgraphia
                </span>
                <Badge variant="outline" className="text-xs font-mono text-blue-600 border-blue-500/30">
                  {writingIssues} students ({Math.round((writingIssues / students.length) * 100)}%)
                </Badge>
              </div>
              <Progress value={(writingIssues / students.length) * 100} className="h-2" />
            </div>

            {/* Attention */}
            <div className="rounded-2xl border border-border/80 bg-background/60 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  Attention, Pacing &amp; Working Memory
                </span>
                <Badge variant="outline" className="text-xs font-mono text-purple-600 border-purple-500/30">
                  {attentionIssues} students ({Math.round((attentionIssues / students.length) * 100)}%)
                </Badge>
              </div>
              <Progress value={(attentionIssues / students.length) * 100} className="h-2" />
            </div>
          </div>
        </div>

        {/* Right: Recent Triage Activity Feed (purely local-state, updates in real-time) */}
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/70 pb-4">
            <div>
              <h3 className="font-serif text-xl font-normal text-foreground">
                Recent Triage Activity
              </h3>
              <p className="text-xs text-muted-foreground font-light mt-0.5">
                Last 3&ndash;5 referrals, reviews, or clinical notes recorded this session
              </p>
            </div>
            <Badge variant="secondary" className="text-[10px] font-mono">
              Live Session
            </Badge>
          </div>

          <div className="space-y-3">
            {recentActivity.map((act) => {
              const student = students.find((s) => s.id === act.studentId);
              return (
                <div
                  key={act.id}
                  className="rounded-2xl border border-border/80 bg-background/60 p-4 space-y-2 transition-all hover:border-primary/40"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span className="text-xs font-medium text-foreground font-mono">
                        {act.studentName} ({act.studentId})
                      </span>
                    </div>
                    <span className="text-[11px] text-muted-foreground font-mono">
                      {act.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-foreground/90 font-light pl-4">
                    {act.description}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-border/40 pl-4">
                    {act.badgeText && (
                      <Badge variant="outline" className="text-[10px] font-mono">
                        {act.badgeText}
                      </Badge>
                    )}

                    {student && (
                      <button
                        onClick={() => setActiveStudentForBreakdown(student)}
                        className="text-xs text-primary hover:underline font-medium ml-auto"
                      >
                        View Breakdown &rarr;
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
