import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Eye,
  Share2,
  FileText,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import { useSupport } from "../../context/SupportContext";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";
import type { TriageStudentRecord } from "../../types";

export function StudentScreeningTab() {
  const {
    students,
    setActiveStudentForBreakdown,
    setActiveStudentForReferral,
    setActiveStudentForNote,
  } = useSupport();

  const [searchQuery, setSearchQuery] = useState("");
  const [domainFilter, setDomainFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Filtered dataset
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          s.name.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q) ||
          s.department.toLowerCase().includes(q) ||
          s.faculty.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      // Domain filter
      if (domainFilter !== "all" && s.primaryDomain !== domainFilter) {
        return false;
      }

      // Risk filter
      if (riskFilter !== "all" && s.riskLevel !== riskFilter) {
        return false;
      }

      // Status filter
      if (statusFilter !== "all" && s.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [students, searchQuery, domainFilter, riskFilter, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / pageSize) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredStudents.slice(start, start + pageSize);
  }, [filteredStudents, currentPage, pageSize]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setDomainFilter("all");
    setRiskFilter("all");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  const getRiskBadgeClass = (risk: string) => {
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

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Pending Specialist":
        return "bg-amber-500/15 text-amber-700 border-amber-500/30 font-semibold";
      case "Referred to Accommodations":
      case "Supported":
        return "bg-emerald-500/15 text-emerald-700 border-emerald-500/30 font-semibold";
      case "In Review":
        return "bg-blue-500/15 text-blue-700 border-blue-500/30";
      default:
        return "bg-muted text-muted-foreground border-border/80";
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/70 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-primary">
              Institutional Screening Register
            </span>
            <Badge variant="outline" className="text-xs font-mono">
              {students.length} Total Screened
            </Badge>
          </div>
          <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-light text-foreground">
            Student Screening Queue
          </h2>
          <p className="text-xs text-muted-foreground font-light mt-0.5">
            Comprehensive register of all student screening submissions across DUT faculties.
          </p>
        </div>

        <div className="text-xs text-muted-foreground font-mono bg-muted/40 px-3 py-1.5 rounded-xl border border-border/60 self-start sm:self-auto">
          Showing {filteredStudents.length} of {students.length} students
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search student name, ID, department..."
              className="w-full rounded-xl border border-border bg-background pl-9 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          {/* Primary Domain Filter */}
          <div>
            <select
              value={domainFilter}
              onChange={(e) => {
                setDomainFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <option value="all">All Screening Domains</option>
              <option value="Reading">Reading Fluency &amp; Comprehension</option>
              <option value="Mathematics">Quantitative &amp; Math</option>
              <option value="Writing">Writing &amp; Orthographic</option>
              <option value="Attention & Memory">Attention &amp; Working Memory</option>
            </select>
          </div>

          {/* Risk Level Filter */}
          <div>
            <select
              value={riskFilter}
              onChange={(e) => {
                setRiskFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <option value="all">All Risk Classifications</option>
              <option value="High">High Priority Risk (&ge;2 areas)</option>
              <option value="Moderate">Moderate Risk</option>
              <option value="Mild">Mild Risk</option>
              <option value="Low">Low Risk / Typical</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <option value="all">All Pipeline Statuses</option>
              <option value="Screened">Screened (Initial)</option>
              <option value="Pending Specialist">Pending Specialist</option>
              <option value="In Review">In Review</option>
              <option value="Referred to Accommodations">Referred to Accommodations</option>
              <option value="Supported">Supported</option>
            </select>

            {(searchQuery || domainFilter !== "all" || riskFilter !== "all" || statusFilter !== "all") && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                className="text-xs h-9 px-2.5 rounded-xl shrink-0"
                title="Reset Filters"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Student Table */}
      <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border/80 bg-muted/30 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                <th className="py-3.5 px-5">Student</th>
                <th className="py-3.5 px-4">Screening Date</th>
                <th className="py-3.5 px-4">Composite Score</th>
                <th className="py-3.5 px-4">Flagged Indicator</th>
                <th className="py-3.5 px-4">Risk Level</th>
                <th className="py-3.5 px-4">Status / Pipeline</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground font-light">
                    No student screening records match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((s) => (
                  <tr
                    key={s.id}
                    className="transition-colors hover:bg-accent/20 group"
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

                    {/* Screening Date */}
                    <td className="py-3.5 px-4 font-mono text-muted-foreground whitespace-nowrap">
                      {s.screeningDate}
                    </td>

                    {/* Composite Score */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-bold text-foreground text-sm font-mono">
                        {s.compositeScore}%
                      </div>
                      <div className="text-[10px] text-muted-foreground font-light">
                        Battery average
                      </div>
                    </td>

                    {/* Flagged Indicator & Flagged Domain Count */}
                    <td className="py-3.5 px-4 max-w-[240px]">
                      <div className="text-foreground text-xs font-normal line-clamp-1">
                        {s.primaryIndicator}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {s.flaggedDomainCount >= 2 ? (
                          <span className="text-[10px] font-mono text-rose-600 bg-rose-500/10 px-1.5 py-0.2 rounded font-medium">
                            {s.flaggedDomainCount} domains &le;45%
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-muted-foreground">
                            {s.primaryDomain}
                          </span>
                        )}
                        {s.referralNotes.length > 0 && (
                          <span className="text-[10px] text-muted-foreground font-mono">
                            &bull; {s.referralNotes.length} note(s)
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Risk Level */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <Badge
                        variant="outline"
                        className={`text-[11px] font-mono ${getRiskBadgeClass(s.riskLevel)}`}
                      >
                        {s.riskLevel}
                      </Badge>
                    </td>

                    {/* Pipeline Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <Badge
                        variant="outline"
                        className={`text-[11px] font-mono ${getStatusBadgeClass(s.status)}`}
                      >
                        {s.status}
                      </Badge>
                    </td>

                    {/* Actions */}
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
                          <span className="hidden sm:inline">Breakdown</span>
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
                            <span className="hidden sm:inline">Refer</span>
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setActiveStudentForNote(s)}
                          className="h-8 px-2 rounded-lg text-xs text-muted-foreground hover:text-foreground"
                          title="Log Clinical / Intervention Note"
                        >
                          <FileText className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-border/70 p-4 bg-muted/20">
          <div className="text-xs text-muted-foreground font-light">
            Showing <strong className="font-mono text-foreground font-medium">{(currentPage - 1) * pageSize + 1}</strong> to{" "}
            <strong className="font-mono text-foreground font-medium">
              {Math.min(currentPage * pageSize, filteredStudents.length)}
            </strong>{" "}
            of <strong className="font-mono text-foreground font-medium">{filteredStudents.length}</strong> filtered results
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="h-8 px-2.5 rounded-xl text-xs gap-1"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Previous</span>
            </Button>

            <span className="text-xs font-mono px-2 text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="h-8 px-2.5 rounded-xl text-xs gap-1"
            >
              <span>Next</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
