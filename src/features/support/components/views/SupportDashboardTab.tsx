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
      <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                Semester 2 &bull; Active Triage Session
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                Institutional Cohort: {students.length} Students Evaluated
              </span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-light tracking-tight text-foreground">
              Welcome, {staffProfile.name}
            </h2>

            <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
              Monitoring active learning disability screening batteries and psychometric triage for{" "}
              <strong className="text-foreground font-medium">DUT Student Services</strong>. There are currently{" "}
              <strong className="text-rose-600 font-semibold font-mono">{flaggedStudents.length} high priority</strong>{" "}
              students flagged for multi-domain support and{" "}
              <strong className="text-amber-600 font-semibold font-mono">{pendingReferrals.length} cases</strong>{" "}
              awaiting clinical specialist referral intake.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={() => onSelectTab("flagged")}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs gap-2 rounded-xl shadow-md shadow-rose-600/20"
            >
              <AlertTriangle className="h-4 w-4" />
              <span>Review {flaggedStudents.length} Flagged Cases</span>
            </Button>

            <Button
              onClick={() => onSelectTab("intake")}
              variant="outline"
              className="text-xs gap-2 rounded-xl"
            >
              <CalendarCheck className="h-4 w-4 text-primary" />
              <span>Intake Pipeline ({pendingReferrals.length})</span>
            </Button>

            <Button
              onClick={() => onSelectTab("screening")}
              variant="outline"
              className="text-xs gap-2 rounded-xl"
            >
              <Users className="h-4 w-4" />
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
          className="rounded-2xl border border-primary/40 bg-card p-5 shadow-sm transition-all hover:border-primary cursor-pointer ring-1 ring-primary/20"
        >
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-mono font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-md">
              Active View
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Staff Dashboard
            </h3>
            <p className="mt-1 text-3xl font-bold tracking-tight text-foreground">Overview</p>
            <p className="mt-1 text-xs text-muted-foreground font-light flex items-center gap-1">
              <span>Triage summary &amp; quick router</span>
            </p>
          </div>
        </div>

        {/* Card 2: Student Screening Queue */}
        <div
          onClick={() => onSelectTab("screening")}
          className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/50 hover:shadow-md cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-mono font-medium text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded-md">
              Full Queue
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Student Screening
            </h3>
            <p className="mt-1 text-3xl font-bold tracking-tight text-foreground font-mono">
              {students.length}
            </p>
            <p className="mt-1 text-xs text-muted-foreground font-light flex items-center justify-between">
              <span>Screened student records</span>
              <ArrowRight className="h-3.5 w-3.5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </p>
          </div>
        </div>

        {/* Card 3: Flagged Support Cases */}
        <div
          onClick={() => onSelectTab("flagged")}
          className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:border-rose-500/50 hover:shadow-md cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-mono font-medium text-rose-600 bg-rose-500/10 px-2 py-0.5 rounded-md">
              &ge;2 Areas Flagged
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Flagged Support
            </h3>
            <p className="mt-1 text-3xl font-bold tracking-tight text-rose-600 font-mono">
              {flaggedStudents.length}
            </p>
            <p className="mt-1 text-xs text-muted-foreground font-light flex items-center justify-between">
              <span>High-priority students</span>
              <ArrowRight className="h-3.5 w-3.5 text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </p>
          </div>
        </div>

        {/* Card 4: Intake & Referrals Pipeline */}
        <div
          onClick={() => onSelectTab("intake")}
          className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:border-amber-500/50 hover:shadow-md cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <CalendarCheck className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-mono font-medium text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-md">
              Awaiting Action
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Intake &amp; Referrals
            </h3>
            <p className="mt-1 text-3xl font-bold tracking-tight text-amber-600 font-mono">
              {pendingReferrals.length}
            </p>
            <p className="mt-1 text-xs text-muted-foreground font-light flex items-center justify-between">
              <span>Pending specialist intake</span>
              <ArrowRight className="h-3.5 w-3.5 text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </p>
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
