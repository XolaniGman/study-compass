import React, { useState } from "react";
import {
  FileBarChart2,
  Printer,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Layers,
} from "lucide-react";
import { useStudent } from "../../context/StudentContext";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";
import { Progress } from "../../../../components/ui/progress";

export function StudentResultsTab() {
  const { latestSession, profile, setIsReportModalOpen, setIsConsultationModalOpen, setActiveAssessmentModuleId, setIsAssessmentModalOpen } =
    useStudent();

  const [expandedDomain, setExpandedDomain] = useState<string>("reading");
  const domainResultsList = Object.values(latestSession.domainResults);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/70 pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
            Diagnostic &amp; Indicator Analysis
          </span>
          <h2 className="font-serif text-3xl font-light text-foreground mt-0.5">
            Neurodiversity Screening Results
          </h2>
          <p className="text-xs text-muted-foreground font-light mt-1">
            Last evaluated on {new Date(latestSession.completedAt).toLocaleDateString()} &bull; Composite Screening Index:{" "}
            <strong className="text-foreground font-medium">{latestSession.overallIndex}%</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsReportModalOpen(true)}
            className="bg-primary text-primary-foreground text-xs gap-2 rounded-xl shadow-sm"
          >
            <Printer className="h-4 w-4" />
            <span>Print Official Report</span>
          </Button>

          <Button
            onClick={() => setIsConsultationModalOpen(true)}
            variant="outline"
            className="text-xs gap-2 rounded-xl"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Apply for Accommodations</span>
          </Button>
        </div>
      </div>

      {/* 4 Domain Visual Comparison Bars */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <h3 className="font-serif text-lg font-normal text-foreground">
            Domain Score Comparison
          </h3>
          <span className="text-xs font-mono text-muted-foreground">
            Benchmarked against DUT Cohort
          </span>
        </div>

        <div className="space-y-5">
          {domainResultsList.map((res) => (
            <div key={res.domain} className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${res.color}`} />
                  <span className="font-medium text-foreground">{res.domainTitle}</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-muted-foreground">{res.score}%</span>
                  <Badge
                    variant="outline"
                    className={`text-[10px] ${
                      res.level === "needs-attention"
                        ? "text-rose-600 border-rose-500/30 bg-rose-500/10"
                        : res.level === "moderate"
                        ? "text-amber-600 border-amber-500/30 bg-amber-500/10"
                        : res.level === "mild"
                        ? "text-blue-600 border-blue-500/30 bg-blue-500/10"
                        : "text-emerald-600 border-emerald-500/30 bg-emerald-500/10"
                    }`}
                  >
                    {res.levelLabel}
                  </Badge>
                </div>
              </div>

              <div className="relative h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${res.color}`}
                  style={{ width: `${res.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Expandable Domain Cards */}
      <div className="space-y-4">
        <div>
          <h3 className="font-serif text-xl font-normal text-foreground">
            Domain Deep-Dives &amp; Clinical Insights
          </h3>
          <p className="text-xs text-muted-foreground font-light mt-0.5">
            Click on any domain to inspect specific cognitive challenges, strengths, and campus
            accommodations.
          </p>
        </div>

        <div className="space-y-3">
          {domainResultsList.map((res) => {
            const isExpanded = expandedDomain === res.domain;

            return (
              <div
                key={res.domain}
                className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm transition-all"
              >
                <button
                  type="button"
                  onClick={() => setExpandedDomain(isExpanded ? "" : res.domain)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-muted/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-3.5 w-3.5 rounded-full ${res.color}`} />
                    <div>
                      <h4 className="font-serif text-lg font-medium text-foreground">
                        {res.domainTitle}
                      </h4>
                      <p className="text-xs text-muted-foreground font-light mt-0.5">
                        {res.summary}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        res.level === "needs-attention"
                          ? "text-rose-600 border-rose-500/30 bg-rose-500/10"
                          : res.level === "moderate"
                          ? "text-amber-600 border-amber-500/30 bg-amber-500/10"
                          : res.level === "mild"
                          ? "text-blue-600 border-blue-500/30 bg-blue-500/10"
                          : "text-emerald-600 border-emerald-500/30 bg-emerald-500/10"
                      }`}
                    >
                      {res.score}% &bull; {res.levelLabel.split(" ")[0]}
                    </Badge>
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="p-6 pt-0 border-t border-border/60 space-y-6 animate-in fade-in duration-200 bg-muted/10">
                    <div className="grid gap-6 md:grid-cols-2 pt-4">
                      {/* Identified Strengths */}
                      <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-3">
                        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Identified Cognitive Strengths</span>
                        </span>
                        <ul className="space-y-2 text-xs text-foreground">
                          {res.primaryStrengths.map((str, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                              <span>{str}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Primary Challenge Observations */}
                      <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-3">
                        <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 flex items-center gap-1.5">
                          <AlertTriangle className="h-4 w-4" />
                          <span>Primary Challenge Observations</span>
                        </span>
                        <ul className="space-y-2 text-xs text-foreground">
                          {res.challengeAreas.map((ch, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                              <span>{ch}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Institutional Accommodations */}
                    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4" />
                          <span>Recommended DUT Institutional Accommodations</span>
                        </span>
                        <button
                          onClick={() => setIsConsultationModalOpen(true)}
                          className="text-xs text-primary font-medium hover:underline"
                        >
                          Request in Consultation &rarr;
                        </button>
                      </div>

                      <div className="grid gap-2 sm:grid-cols-3">
                        {res.recommendedAccommodations.map((acc, i) => (
                          <div
                            key={i}
                            className="rounded-xl border border-border/80 bg-card p-3 text-xs text-foreground font-light leading-relaxed flex items-start gap-2 shadow-sm"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                            <span>{acc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
