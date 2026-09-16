import React, { useState } from "react";
import {
  CalendarCheck,
  CheckCircle,
  ArrowRight,
  Eye,
  FileText,
  Clock,
  ShieldCheck,
  Building,
} from "lucide-react";
import { useSupport } from "../../context/SupportContext";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";

export function IntakeReferralsTab() {
  const {
    pendingReferrals,
    completedReferrals,
    setActiveStudentForBreakdown,
    setActiveStudentForStatusUpdate,
    setActiveStudentForNote,
  } = useSupport();

  const [pipelineSection, setPipelineSection] = useState<"pending" | "completed">("pending");

  return (
    <div className="space-y-6">
      {/* Top Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/70 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-600 bg-amber-500/10 px-2.5 py-0.5 rounded-full">
              FR19 Clinical Intake Pipeline
            </span>
            <Badge variant="outline" className="text-xs font-mono border-amber-500/30 text-amber-700 bg-amber-500/10">
              {pendingReferrals.length} Pending Specialist Intake
            </Badge>
          </div>
          <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-light text-foreground">
            Intake &amp; Referrals Pipeline
          </h2>
          <p className="text-xs text-muted-foreground font-light mt-0.5">
            Manage awaiting specialist consultations, assistive accommodation allocations, and closed cases.
          </p>
        </div>

        {/* Section Toggle: Active Pending vs Closed/Completed History */}
        <div className="flex items-center rounded-xl bg-muted/60 p-1 border border-border/60 self-start sm:self-auto">
          <button
            onClick={() => setPipelineSection("pending")}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
              pipelineSection === "pending"
                ? "bg-card text-foreground shadow-sm font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Clock className="h-3.5 w-3.5 text-amber-600" />
            <span>Active Pending</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-amber-500/15 text-amber-700">
              {pendingReferrals.length}
            </span>
          </button>

          <button
            onClick={() => setPipelineSection("completed")}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
              pipelineSection === "completed"
                ? "bg-card text-foreground shadow-sm font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
            <span>Completed / Accommodations</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-emerald-500/15 text-emerald-700">
              {completedReferrals.length}
            </span>
          </button>
        </div>
      </div>

      {/* Explanatory Notice */}
      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 sm:p-5 flex items-start gap-3.5 text-xs">
        <Building className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-medium text-foreground">
            Awaiting Specialist Allocation &bull; Truthful Pipeline Counter
          </p>
          <p className="text-muted-foreground font-light leading-relaxed">
            The <code className="font-mono text-amber-700 font-semibold">{pendingReferrals.length} Pending</code> badge strictly reflects candidates awaiting clinical allocation. Once you click <strong>Update Status</strong> and assign accommodations (moving to terminal state <code className="font-mono text-emerald-700 font-semibold">Referred to Accommodations</code>), the candidate moves into the Completed section and the pending badge decrements immediately.
          </p>
        </div>
      </div>

      {/* View 1: Active Pending Queue */}
      {pipelineSection === "pending" && (
        <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border/80 bg-muted/30 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                  <th className="py-3.5 px-5">Student</th>
                  <th className="py-3.5 px-4">Referred For (Flagged Area)</th>
                  <th className="py-3.5 px-4">Referral Date</th>
                  <th className="py-3.5 px-4">Current Status</th>
                  <th className="py-3.5 px-5 text-right">Pipeline Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {pendingReferrals.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-muted-foreground font-light">
                      No student referrals currently pending specialist review.
                    </td>
                  </tr>
                ) : (
                  pendingReferrals.map((s) => (
                    <tr
                      key={s.id}
                      className="transition-colors hover:bg-amber-500/5 group"
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

                      {/* Referred For */}
                      <td className="py-3.5 px-4">
                        <div className="text-foreground text-xs font-medium">
                          {s.primaryIndicator}
                        </div>
                        <div className="text-[11px] text-muted-foreground font-light mt-0.5">
                          Composite Score: <strong className="font-mono text-foreground">{s.compositeScore}%</strong> &bull; {s.primaryDomain}
                        </div>
                      </td>

                      {/* Referral Date */}
                      <td className="py-3.5 px-4 font-mono text-muted-foreground whitespace-nowrap">
                        {s.referralDate || s.screeningDate}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <Badge
                          variant="outline"
                          className="text-[11px] font-mono bg-amber-500/15 text-amber-700 border-amber-500/30 font-semibold"
                        >
                          {s.status}
                        </Badge>
                      </td>

                      {/* Pipeline Action */}
                      <td className="py-3.5 px-5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setActiveStudentForBreakdown(s)}
                            className="h-8 px-2.5 rounded-lg text-xs gap-1 text-primary hover:bg-primary/10"
                            title="View Screening Breakdown"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span className="hidden md:inline">Breakdown</span>
                          </Button>

                          <Button
                            size="sm"
                            onClick={() => setActiveStudentForStatusUpdate(s)}
                            className="h-8 px-3 rounded-lg text-xs gap-1.5 bg-primary text-primary-foreground shadow-sm font-medium"
                            title="Transition Status to Accommodations"
                          >
                            <ArrowRight className="h-3.5 w-3.5" />
                            <span>Update Status</span>
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
      )}

      {/* View 2: Closed / Completed Referrals Section */}
      {pipelineSection === "completed" && (
        <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm space-y-4 p-6">
          <div>
            <h3 className="font-serif text-xl font-normal text-foreground">
              Closed &amp; Active Accommodation Referrals ({completedReferrals.length})
            </h3>
            <p className="text-xs text-muted-foreground font-light mt-0.5">
              Historical record of students who have completed specialist intake and have active accommodation plans.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border/80 bg-muted/30 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Faculty</th>
                  <th className="py-3 px-4">Terminal Status</th>
                  <th className="py-3 px-4">Assigned Accommodations</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {completedReferrals.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-muted-foreground font-light">
                      No completed referrals recorded yet.
                    </td>
                  </tr>
                ) : (
                  completedReferrals.map((s) => (
                    <tr key={s.id} className="transition-colors hover:bg-muted/30">
                      <td className="py-3 px-4">
                        <div className="font-medium text-foreground">{s.name}</div>
                        <div className="text-[11px] text-muted-foreground font-mono">{s.id}</div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{s.department}</td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <Badge
                          variant="outline"
                          className="text-[11px] font-mono bg-emerald-500/15 text-emerald-700 border-emerald-500/30 font-semibold"
                        >
                          {s.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {s.assignedAccommodations?.map((acc, i) => (
                            <span
                              key={i}
                              className="text-[10px] bg-muted text-foreground px-2 py-0.5 rounded-md font-mono"
                            >
                              {acc}
                            </span>
                          )) || <span className="text-muted-foreground italic">Extra Time (Standard)</span>}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setActiveStudentForBreakdown(s)}
                          className="h-8 px-2 text-xs text-primary"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
