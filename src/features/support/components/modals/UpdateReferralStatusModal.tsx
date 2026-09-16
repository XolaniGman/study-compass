import React, { useState } from "react";
import { X, CheckCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { useSupport } from "../../context/SupportContext";
import { Button } from "../../../../components/ui/button";
import type { TriageStatus } from "../../types";

const ACCOMMODATIONS_OPTIONS = [
  "Extra Time (15 min per hour)",
  "Extra Time (30 min per hour)",
  "Screen Reader (Text-to-Speech Software)",
  "Quiet Examination Venue (Reduced Distraction)",
  "Reader and Scribe Support",
  "Large Print Exam Materials (A3 / 18pt font)",
  "Rest Breaks (5 min per hour without penalty)",
  "Digital Audio Recording of Lectures",
];

export function UpdateReferralStatusModal() {
  const {
    activeStudentForStatusUpdate,
    setActiveStudentForStatusUpdate,
    updateReferralStatus,
  } = useSupport();

  const [newStatus, setNewStatus] = useState<TriageStatus>("Referred to Accommodations");
  const [selectedAccommodations, setSelectedAccommodations] = useState<string[]>([
    "Extra Time (15 min per hour)",
    "Quiet Examination Venue (Reduced Distraction)",
  ]);
  const [resolutionNotes, setResolutionNotes] = useState("");

  if (!activeStudentForStatusUpdate) return null;

  const s = activeStudentForStatusUpdate;

  const toggleAccommodation = (acc: string) => {
    setSelectedAccommodations((prev) =>
      prev.includes(acc) ? prev.filter((a) => a !== acc) : [...prev, acc]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateReferralStatus(s.id, newStatus, {
      notes: resolutionNotes.trim() || undefined,
      accommodations: selectedAccommodations,
    });
    setActiveStudentForStatusUpdate(null);
  };

  const isTerminal =
    newStatus === "Referred to Accommodations" || newStatus === "Supported";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border/70 pb-4">
          <div>
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-primary">
              Pipeline State Transition
            </span>
            <h2 className="mt-1 font-serif text-2xl font-light text-foreground">
              Update Referral Status
            </h2>
            <p className="text-xs text-muted-foreground font-light mt-0.5">
              Candidate: <strong className="text-foreground">{s.name}</strong> ({s.id}) &bull;{" "}
              {s.department}
            </p>
          </div>

          <button
            onClick={() => setActiveStudentForStatusUpdate(null)}
            className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              Transition to Pipeline Status
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as TriageStatus)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <option value="Referred to Accommodations">
                Referred to Accommodations (Terminal — Moves to Completed)
              </option>
              <option value="Supported">Supported (Terminal — Active Support Plan)</option>
              <option value="In Review">In Review (Clinical Assessment Underway)</option>
              <option value="Pending Specialist">Pending Specialist (Awaiting Intake)</option>
            </select>
          </div>

          {isTerminal && (
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-3.5 flex items-start gap-3 text-xs text-emerald-800">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Moving this student to <strong>{newStatus}</strong> will complete their referral awaiting period. They will drop out of the <strong>12 Pending</strong> count and appear in Closed/Completed Referrals.
              </span>
            </div>
          )}

          {/* Accommodations checklist */}
          <div>
            <label className="block text-xs font-medium text-foreground mb-2">
              Assign Academic Accommodations &amp; Assistive Provisions
            </label>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {ACCOMMODATIONS_OPTIONS.map((acc) => {
                const checked = selectedAccommodations.includes(acc);
                return (
                  <label
                    key={acc}
                    className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-xs transition-colors cursor-pointer ${
                      checked
                        ? "border-primary/40 bg-primary/5 text-foreground font-medium"
                        : "border-border/60 bg-background/50 text-muted-foreground hover:bg-muted/40"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleAccommodation(acc)}
                      className="rounded border-border text-primary focus:ring-primary"
                    />
                    <span>{acc}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              Clinical Justification &amp; Resolution Notes
            </label>
            <textarea
              rows={3}
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              placeholder="E.g. Approved extra time and quiet venue following neurodiversity assessment."
              className="w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-border/70">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setActiveStudentForStatusUpdate(null)}
              className="text-xs rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-primary text-primary-foreground text-xs rounded-xl gap-1.5"
            >
              <CheckCircle className="h-3.5 w-3.5" />
              <span>Confirm Status Update</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
