import React from "react";
import {
  ClipboardList,
  Clock,
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  FileBarChart2,
  BookOpen,
  HelpCircle,
} from "lucide-react";
import { useStudent } from "../../context/StudentContext";
import { ASSESSMENT_MODULES } from "../../data/assessment-modules";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";

export function StudentAssessmentsTab() {
  const {
    setIsAssessmentModalOpen,
    setActiveAssessmentModuleId,
    sessionsHistory,
    latestSession,
    setIsReportModalOpen,
  } = useStudent();

  const handleStart = (moduleId: string | "all-comprehensive") => {
    setActiveAssessmentModuleId(moduleId);
    setIsAssessmentModalOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner: Comprehensive Assessment Battery */}
      <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/15 via-card to-card p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge className="bg-primary text-primary-foreground font-mono text-[10px] tracking-wider uppercase">
                Recommended Full Assessment
              </Badge>
              <span className="text-xs text-muted-foreground font-mono">
                Duration: ~15 mins &bull; 20 Questions
              </span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-light text-foreground">
              Comprehensive 4-Domain Screening Battery
            </h2>

            <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
              Assesses all core neurodiversity domains in a single unified session: Reading &amp;
              Lexical Processing, Quantitative &amp; Spatial Math, Written Expression, and Sustained
              Executive Attention.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={() => handleStart("all-comprehensive")}
              size="lg"
              className="bg-primary text-primary-foreground gap-2 rounded-xl text-xs px-6 shadow-md shadow-primary/20"
            >
              <ClipboardList className="h-4 w-4" />
              <span>Start Full Battery</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 4 Modular Screeners Grid */}
      <div className="space-y-4">
        <div>
          <h3 className="font-serif text-xl font-normal text-foreground">
            Targeted Modular Screeners
          </h3>
          <p className="text-xs text-muted-foreground font-light mt-0.5">
            Take a focused mini-screener if you want to evaluate or update a single domain
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {ASSESSMENT_MODULES.map((mod) => {
            const domainResult = latestSession.domainResults[mod.domain];

            return (
              <div
                key={mod.id}
                className="rounded-3xl border border-border bg-card p-6 space-y-4 shadow-sm transition-all hover:border-primary/40 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono font-medium px-2.5 py-1 rounded-md border ${mod.badgeColor}`}>
                      {mod.shortName}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{mod.estimatedMinutes} mins</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-serif text-lg font-medium text-foreground">
                      {mod.title}
                    </h4>
                    <p className="text-xs text-muted-foreground font-light mt-1 leading-relaxed">
                      {mod.description}
                    </p>
                  </div>

                  <div className="rounded-xl border border-border/70 bg-muted/20 p-3 space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
                      Focus Area:
                    </span>
                    <p className="text-xs text-foreground font-light">{mod.focusArea}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                  {domainResult ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Current Score:</span>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          domainResult.level === "needs-attention"
                            ? "text-rose-600 border-rose-500/30"
                            : domainResult.level === "moderate"
                            ? "text-amber-600 border-amber-500/30"
                            : domainResult.level === "mild"
                            ? "text-blue-600 border-blue-500/30"
                            : "text-emerald-600 border-emerald-500/30"
                        }`}
                      >
                        {domainResult.score}% ({domainResult.levelLabel.split(" ")[0]})
                      </Badge>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">Not yet evaluated</span>
                  )}

                  <Button
                    onClick={() => handleStart(mod.id)}
                    size="sm"
                    className="bg-primary text-primary-foreground text-xs gap-1.5 rounded-lg"
                  >
                    <span>Launch Screener</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Assessment History Table */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-xl font-normal text-foreground">
              Assessment History &amp; Audit Trail
            </h3>
            <p className="text-xs text-muted-foreground font-light mt-0.5">
              Previous evaluation logs and screening session records
            </p>
          </div>
          <Button
            onClick={() => setIsReportModalOpen(true)}
            size="sm"
            variant="outline"
            className="text-xs gap-1.5"
          >
            <FileBarChart2 className="h-3.5 w-3.5" />
            <span>Generate Report</span>
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="border-b border-border bg-muted/40 text-muted-foreground font-mono uppercase tracking-wider">
              <tr>
                <th className="p-3.5 rounded-l-xl">Date &amp; Time</th>
                <th className="p-3.5">Assessment Module</th>
                <th className="p-3.5">Composite Index</th>
                <th className="p-3.5">Primary Indicator</th>
                <th className="p-3.5 rounded-r-xl text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {sessionsHistory.map((sess) => (
                <tr key={sess.id} className="hover:bg-muted/20 transition-colors">
                  <td className="p-3.5 font-mono text-foreground">
                    {new Date(sess.completedAt).toLocaleString()}
                  </td>
                  <td className="p-3.5 text-foreground font-medium">{sess.moduleTitle}</td>
                  <td className="p-3.5">
                    <Badge variant="outline" className="text-primary border-primary/30 font-mono">
                      {sess.overallIndex}%
                    </Badge>
                  </td>
                  <td className="p-3.5 capitalize text-muted-foreground">
                    {sess.primaryConcernDomain
                      ? sess.domainResults[sess.primaryConcernDomain]?.domainTitle
                      : "Balanced Profile"}
                  </td>
                  <td className="p-3.5 text-right">
                    <Button
                      onClick={() => setIsReportModalOpen(true)}
                      size="sm"
                      variant="ghost"
                      className="text-xs text-primary h-7 px-2.5"
                    >
                      View Report
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
