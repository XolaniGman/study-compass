import React, { useState, useMemo } from "react";
import {
  AlertTriangle,
  Search,
  CheckCircle2,
  Share2,
  Eye,
  FileText,
  ShieldAlert,
  Info,
} from "lucide-react";
import { useSupport } from "../../context/SupportContext";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";

export function FlaggedSupportTab() {
  const {
    flaggedStudents,
    setActiveStudentForBreakdown,
    setActiveStudentForReferral,
    setActiveStudentForNote,
    markFlagReviewed,
  } = useSupport();

  const [searchQuery, setSearchQuery] = useState("");
  const [domainFilter, setDomainFilter] = useState("all");

  const filteredFlagged = useMemo(() => {
    return flaggedStudents.filter((s) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          s.name.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q) ||
          s.department.toLowerCase().includes(q);
        if (!matches) return false;
      }
      if (domainFilter !== "all" && s.primaryDomain !== domainFilter) {
        return false;
      }
      return true;
    });
  }, [flaggedStudents, searchQuery, domainFilter]);

  return (
    <div className="space-y-6">
      {/* Top Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/70 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-rose-600 bg-rose-500/10 px-2.5 py-0.5 rounded-full">
              FR18 Priority Triage Lens
            </span>
            <Badge variant="outline" className="text-xs font-mono border-rose-500/30 text-rose-700 bg-rose-500/10">
              {flaggedStudents.length} High Priority Cases
            </Badge>
          </div>
          <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-light text-foreground">
            Flagged Support Queue
          </h2>
          <p className="text-xs text-muted-foreground font-light mt-0.5">
            Students showing severe difficulty (&le;45%) in 2 or more screening areas or classified as High Priority.
          </p>
        </div>

        <div className="text-xs text-rose-700 font-mono bg-rose-500/10 px-3.5 py-2 rounded-xl border border-rose-500/20 self-start sm:self-auto">
          Active Flagged: <strong className="text-rose-900 font-bold">{flaggedStudents.length}</strong>
        </div>
      </div>

      {/* Metric / Rule Explanatory Banner */}
      <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-medium text-foreground">
              DUT Institutional Screening Protocol (2+ Area Difficulty Rule)
            </p>
            <p className="text-muted-foreground font-light leading-relaxed">
              This lens automatically filters the 128-record dataset to students where <code className="font-mono text-rose-700">flaggedDomainCount &ge; 2</code> or risk is High. Marking a student as reviewed resolves their active flag and immediately decrements the counter.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search high-priority candidate..."
              className="w-full rounded-xl border border-border bg-background pl-9 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <div>
            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <option value="all">All Primary Flagged Domains</option>
              <option value="Reading">Reading Fluency &amp; Comprehension</option>
              <option value="Mathematics">Quantitative &amp; Dyscalculia</option>
              <option value="Writing">Writing &amp; Dysgraphia</option>
              <option value="Attention & Memory">Attention &amp; Working Memory</option>
            </select>
          </div>

          <div className="text-xs text-muted-foreground font-mono flex items-center justify-end">
            Matching cases: {filteredFlagged.length} of {flaggedStudents.length}
          </div>
        </div>
      </div>

      {/* Flagged Table */}
      <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border/80 bg-muted/30 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                <th className="py-3.5 px-5">Student Candidate</th>
                <th className="py-3.5 px-4">Severe Difficulty Areas</th>
                <th className="py-3.5 px-4">Composite Score</th>
                <th className="py-3.5 px-4">Screening Date</th>
                <th className="py-3.5 px-4">Pipeline Status</th>
                <th className="py-3.5 px-5 text-right">Triage Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredFlagged.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground font-light">
                    {flaggedStudents.length === 0
                      ? "All high-priority flagged cases have been successfully reviewed and resolved!"
                      : "No flagged students match the current filter."}
                  </td>
                </tr>
              ) : (
                filteredFlagged.map((s) => (
                  <tr
                    key={s.id}
                    className="transition-colors hover:bg-rose-500/5 group"
                  >
                    {/* Student Info */}
                    <td className="py-3.5 px-5">
                      <div className="font-medium text-foreground text-sm">{s.name}</div>
                      <div className="text-[11px] text-muted-foreground font-mono">
                        {s.id} &bull; {s.campus}
                      </div>
                      <div className="text-[11px] text-muted-foreground/80 truncate max-w-[200px]">
                        {s.department}
                      </div>
                    </td>

                    {/* Flagged Domain Details */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-mono font-bold text-rose-700 bg-rose-500/15 px-2 py-0.5 rounded-md">
                          {s.flaggedDomainCount} Areas &le;45%
                        </span>
                        <span className="text-xs text-foreground font-light">
                          {s.primaryIndicator}
                        </span>
                      </div>
                      <div className="text-[10px] text-muted-foreground font-mono mt-1">
                        Scores: Read {s.domainScores.reading}% &bull; Math {s.domainScores.math}% &bull; Write {s.domainScores.writing}% &bull; Attn {s.domainScores.attention}%
                      </div>
                    </td>

                    {/* Composite Score */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="text-sm font-bold font-mono text-rose-600">
                        {s.compositeScore}%
                      </span>
                    </td>

                    {/* Screening Date */}
                    <td className="py-3.5 px-4 font-mono text-muted-foreground whitespace-nowrap">
                      {s.screeningDate}
                    </td>

                    {/* Pipeline Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <Badge
                        variant="outline"
                        className={`text-[11px] font-mono ${
                          s.status === "Pending Specialist"
                            ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {s.status}
                      </Badge>
                    </td>

                    {/* Triage Actions */}
                    <td className="py-3.5 px-5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setActiveStudentForBreakdown(s)}
                          className="h-8 px-2.5 rounded-lg text-xs gap-1 text-primary hover:bg-primary/10"
                          title="View In-Depth Domain Breakdown"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span className="hidden md:inline">Breakdown</span>
                        </Button>

                        {s.status !== "Pending Specialist" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setActiveStudentForReferral(s)}
                            className="h-8 px-2.5 rounded-lg text-xs gap-1 border-primary/30 text-primary hover:bg-primary/10"
                            title="Record Specialist Referral"
                          >
                            <Share2 className="h-3.5 w-3.5" />
                            <span className="hidden md:inline">Refer</span>
                          </Button>
                        )}

                        {/* Exclusive action: Mark as Reviewed (resolves flag, decrements 34 badge!) */}
                        <Button
                          size="sm"
                          onClick={() => markFlagReviewed(s.id)}
                          className="h-8 px-2.5 rounded-lg text-xs gap-1 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20"
                          title="Mark flag as reviewed and resolved"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Mark Reviewed</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
