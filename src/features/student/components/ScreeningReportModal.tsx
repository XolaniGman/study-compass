import React from "react";
import { X, Printer, Copy, CheckCircle, GraduationCap, ShieldCheck, FileText, AlertCircle } from "lucide-react";
import { useStudent } from "../context/StudentContext";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { toast } from "sonner";

export function ScreeningReportModal() {
  const { isReportModalOpen, setIsReportModalOpen, latestSession, profile } = useStudent();

  if (!isReportModalOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const reportText = `DURBAN UNIVERSITY OF TECHNOLOGY — DISABILITY UNIT
PRELIMINARY NEURODIVERSITY SCREENING REPORT
Reference: ${latestSession.id}
Date: ${new Date(latestSession.completedAt).toLocaleDateString()}

STUDENT DETAILS:
Name: ${profile.name}
Student ID: ${profile.studentId}
Faculty: ${profile.faculty}
Program: ${profile.program} (${profile.year})
Campus: ${profile.campus}

SCREENING SUMMARY:
Overall Screening Index: ${latestSession.overallIndex}%
Primary Indicator: ${latestSession.primaryConcernDomain || "None flagged"}

DOMAIN BREAKDOWNS:
${Object.values(latestSession.domainResults)
  .map(
    (d) => `• ${d.domainTitle.toUpperCase()}: ${d.score}% (${d.levelLabel})
  Challenges: ${d.challengeAreas.join(", ")}
  Accommodations: ${d.recommendedAccommodations.join("; ")}`
  )
  .join("\n\n")}

DISCLAIMER:
This document represents screening indicators only and does not constitute a formal psycho-educational diagnosis.`;

    navigator.clipboard.writeText(reportText);
    toast.success("Full screening summary copied to clipboard!");
  };

  const domainResultsList = Object.values(latestSession.domainResults);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setIsReportModalOpen(false)}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-2xl z-10 space-y-8 print:border-none print:shadow-none print:p-0">
        {/* Top Control Bar (Hidden during Print) */}
        <div className="flex items-center justify-between border-b border-border/70 pb-4 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Official Screening Certificate &amp; Intake Summary
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={handleCopyText} size="sm" variant="outline" className="text-xs gap-1.5 h-8">
              <Copy className="h-3.5 w-3.5" />
              <span>Copy Text</span>
            </Button>
            <Button onClick={handlePrint} size="sm" className="bg-primary text-primary-foreground text-xs gap-1.5 h-8">
              <Printer className="h-3.5 w-3.5" />
              <span>Print / Save PDF</span>
            </Button>
            <button
              onClick={() => setIsReportModalOpen(false)}
              className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors ml-2"
              title="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Official Report Document Body */}
        <div className="space-y-8 bg-card text-foreground font-sans print:m-0">
          {/* Institutional Header */}
          <div className="border-b-2 border-primary/40 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground">
                <GraduationCap className="h-7 w-7" />
              </div>
              <div>
                <h1 className="font-serif text-2xl font-semibold tracking-tight text-foreground">
                  Durban University of Technology
                </h1>
                <p className="text-xs font-mono uppercase tracking-widest text-primary font-medium">
                  Disability Care Unit &bull; Academic Screening Service
                </p>
              </div>
            </div>

            <div className="text-right text-xs text-muted-foreground font-mono space-y-0.5">
              <div>Ref: {latestSession.id.toUpperCase()}</div>
              <div>Date: {new Date(latestSession.completedAt).toLocaleDateString()}</div>
              <div>Status: Verified Screening</div>
            </div>
          </div>

          {/* Student Profile Metadata Grid */}
          <div className="rounded-2xl border border-border/80 bg-muted/20 p-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground">
                Student Name
              </span>
              <p className="text-sm font-semibold text-foreground">{profile.name}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground">
                Student ID
              </span>
              <p className="text-sm font-mono font-medium text-foreground">{profile.studentId}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground">
                Academic Program
              </span>
              <p className="text-xs font-medium text-foreground">{profile.program}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground">
                Campus
              </span>
              <p className="text-xs font-medium text-foreground">{profile.campus}</p>
            </div>
          </div>

          {/* Overall Indicator Banner */}
          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
                Composite Screening Index
              </span>
              <h3 className="font-serif text-3xl font-light text-foreground">
                {latestSession.overallIndex}% Indicator Index
              </h3>
              <p className="text-xs text-muted-foreground font-light max-w-xl">
                Synthesized from 4 cognitive &amp; academic processing domains evaluated under DUT
                academic benchmarks.
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs font-mono text-muted-foreground block">Evaluated Battery:</span>
              <span className="text-xs font-medium text-foreground">{latestSession.moduleTitle}</span>
            </div>
          </div>

          {/* Domain Breakdown Cards */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-foreground font-semibold">
              Domain Screening Breakdown
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              {domainResultsList.map((res) => (
                <div
                  key={res.domain}
                  className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-sm"
                >
                  <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
                    <div>
                      <h4 className="font-serif text-base font-normal text-foreground">
                        {res.domainTitle}
                      </h4>
                      <span className="text-[11px] font-mono text-muted-foreground">
                        Raw Score: {res.rawScore}/{res.maxScore}
                      </span>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        res.level === "needs-attention"
                          ? "bg-rose-500/10 text-rose-600 border-rose-500/30"
                          : res.level === "moderate"
                          ? "bg-amber-500/10 text-amber-600 border-amber-500/30"
                          : res.level === "mild"
                          ? "bg-blue-500/10 text-blue-600 border-blue-500/30"
                          : "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                      }`}
                    >
                      {res.levelLabel.split(" ")[0]} ({res.score}%)
                    </Badge>
                  </div>

                  <p className="text-xs text-muted-foreground font-light leading-relaxed">
                    {res.summary}
                  </p>

                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
                      Recommended Institutional Accommodations:
                    </span>
                    <ul className="space-y-1">
                      {res.recommendedAccommodations.map((acc, i) => (
                        <li key={i} className="text-xs text-foreground flex items-center gap-1.5">
                          <CheckCircle className="h-3 w-3 text-primary shrink-0" />
                          <span>{acc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Legal / Psychological Disclaimer Notice */}
          <div className="rounded-2xl border border-border/80 bg-muted/40 p-5 space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                Screening Indicator &amp; Legal Notice
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed font-light">
              This screening report is generated for preliminary educational guidance and intake
              referral within the Durban University of Technology Disability Care Unit. It does not
              constitute a formal psycho-educational diagnosis. To formalize official exam concessions
              or medical file annotations, present this report to the DUT Disability Unit coordinator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
