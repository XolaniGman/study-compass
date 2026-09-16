import React from "react";
import {
  X,
  User,
  Calendar,
  AlertTriangle,
  FileText,
  CheckCircle2,
  Share2,
  Clock,
  ShieldAlert,
} from "lucide-react";
import { useSupport } from "../../context/SupportContext";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";
import { Progress } from "../../../../components/ui/progress";

export function StudentBreakdownModal() {
  const {
    activeStudentForBreakdown,
    setActiveStudentForBreakdown,
    setActiveStudentForReferral,
    setActiveStudentForNote,
    markFlagReviewed,
  } = useSupport();

  if (!activeStudentForBreakdown) return null;

  const s = activeStudentForBreakdown;

  const getDomainColor = (score: number) => {
    if (score <= 45) return "text-rose-600 bg-rose-500/10 border-rose-500/30";
    if (score <= 65) return "text-amber-600 bg-amber-500/10 border-amber-500/30";
    if (score <= 80) return "text-blue-600 bg-blue-500/10 border-blue-500/30";
    return "text-emerald-600 bg-emerald-500/10 border-emerald-500/30";
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "High":
        return "bg-rose-500/15 text-rose-700 border-rose-500/30";
      case "Moderate":
        return "bg-amber-500/15 text-amber-700 border-amber-500/30";
      case "Mild":
        return "bg-blue-500/15 text-blue-700 border-blue-500/30";
      default:
        return "bg-emerald-500/15 text-emerald-700 border-emerald-500/30";
    }
  };

  const domains = [
    { name: "Reading Fluency & Comprehension", score: s.domainScores.reading, key: "reading" },
    { name: "Quantitative & Mathematical Alignment", score: s.domainScores.math, key: "math" },
    { name: "Writing & Orthographic Processing", score: s.domainScores.writing, key: "writing" },
    { name: "Attention, Pacing & Working Memory", score: s.domainScores.attention, key: "attention" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border/70 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                Screening Breakdown &bull; {s.campus}
              </span>
              <Badge variant="outline" className={`text-xs font-mono ${getRiskBadge(s.riskLevel)}`}>
                {s.riskLevel} Priority Risk
              </Badge>
            </div>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-light text-foreground">
              {s.name}
            </h2>

            <p className="text-xs sm:text-sm text-muted-foreground font-light mt-0.5">
              ID: <strong className="font-mono text-foreground font-medium">{s.id}</strong> &bull;{" "}
              {s.department} &bull; {s.year} &bull; {s.email}
            </p>
          </div>

          <button
            onClick={() => setActiveStudentForBreakdown(null)}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Screening Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-2xl border border-border/80 bg-background/60 p-3.5 text-center">
            <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground">
              Composite Index
            </span>
            <p className="text-2xl font-bold text-foreground mt-1">{s.compositeScore}%</p>
          </div>
          <div className="rounded-2xl border border-border/80 bg-background/60 p-3.5 text-center">
            <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground">
              Flagged Domains
            </span>
            <p className="text-2xl font-bold text-rose-600 mt-1">{s.flaggedDomainCount} / 4</p>
          </div>
          <div className="rounded-2xl border border-border/80 bg-background/60 p-3.5 text-center">
            <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground">
              Screening Date
            </span>
            <p className="text-sm font-semibold font-mono text-foreground mt-2">{s.screeningDate}</p>
          </div>
          <div className="rounded-2xl border border-border/80 bg-background/60 p-3.5 text-center">
            <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground">
              Current Status
            </span>
            <p className="text-xs font-semibold text-primary mt-2 truncate">{s.status}</p>
          </div>
        </div>

        {/* Domain Scores Breakdown */}
        <div className="space-y-4">
          <h3 className="font-serif text-lg font-normal text-foreground">
            Domain-Specific Assessment Scores
          </h3>

          <div className="space-y-3">
            {domains.map((d) => (
              <div
                key={d.key}
                className="rounded-2xl border border-border/70 bg-background/50 p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{d.name}</span>
                    {d.score <= 45 && (
                      <span className="text-[10px] font-mono text-rose-600 bg-rose-500/10 px-2 py-0.5 rounded">
                        Below Difficulty Threshold (&le;45%)
                      </span>
                    )}
                  </div>
                  <Badge variant="outline" className={`text-xs font-mono ${getDomainColor(d.score)}`}>
                    {d.score}%
                  </Badge>
                </div>
                <Progress value={d.score} className="h-2" />
              </div>
            ))}
          </div>
        </div>

        {/* Clinical Indicator & Accommodations */}
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 space-y-2">
          <div className="flex items-center gap-2 text-primary font-medium text-xs">
            <ShieldAlert className="h-4 w-4" />
            <span>Primary Screening Indicator</span>
          </div>
          <p className="text-sm text-foreground font-light">{s.primaryIndicator}</p>
          {s.assignedAccommodations && s.assignedAccommodations.length > 0 && (
            <div className="pt-2 border-t border-primary/10">
              <span className="text-xs text-muted-foreground block mb-1.5 font-mono">
                Assigned Accommodations:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {s.assignedAccommodations.map((acc, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs font-normal">
                    {acc}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Historical Clinical Notes */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-normal text-foreground">
              Clinical &amp; Case Notes ({s.referralNotes.length})
            </h3>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setActiveStudentForBreakdown(null);
                setActiveStudentForNote(s);
              }}
              className="text-xs rounded-xl h-8 gap-1.5"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Add Note</span>
            </Button>
          </div>

          {s.referralNotes.length === 0 ? (
            <p className="text-xs text-muted-foreground font-light italic">
              No notes logged for this student yet.
            </p>
          ) : (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {s.referralNotes.map((note) => (
                <div
                  key={note.id}
                  className="rounded-xl border border-border/70 bg-background/60 p-3 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between text-muted-foreground font-mono text-[11px]">
                    <span>
                      {note.author} &bull; {note.category}
                    </span>
                    <span>{note.date}</span>
                  </div>
                  <p className="text-foreground font-light leading-relaxed">{note.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveStudentForBreakdown(null)}
            className="text-xs rounded-xl"
          >
            Close
          </Button>

          <div className="flex flex-wrap items-center gap-2">
            {!s.flagReviewed && (s.riskLevel === "High" || s.flaggedDomainCount >= 2) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  markFlagReviewed(s.id);
                  setActiveStudentForBreakdown(null);
                }}
                className="text-xs rounded-xl text-emerald-700 border-emerald-500/30 hover:bg-emerald-500/10 gap-1.5"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Mark Flag as Reviewed</span>
              </Button>
            )}

            {s.status !== "Pending Specialist" && (
              <Button
                size="sm"
                onClick={() => {
                  setActiveStudentForBreakdown(null);
                  setActiveStudentForReferral(s);
                }}
                className="bg-primary text-primary-foreground text-xs rounded-xl gap-1.5"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>Record Referral</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
