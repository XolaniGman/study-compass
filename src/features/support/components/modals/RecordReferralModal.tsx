import React, { useState } from "react";
import { X, Send, Calendar, AlertCircle } from "lucide-react";
import { useSupport } from "../../context/SupportContext";
import { Button } from "../../../../components/ui/button";

export function RecordReferralModal() {
  const { activeStudentForReferral, setActiveStudentForReferral, recordReferral } =
    useSupport();

  const [specialistType, setSpecialistType] = useState("DUT Neurodiversity Specialist");
  const [priority, setPriority] = useState("High Priority");
  const [notes, setNotes] = useState("");

  if (!activeStudentForReferral) return null;

  const s = activeStudentForReferral;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    recordReferral(s.id, {
      specialistType,
      priority,
      notes: notes.trim() || undefined,
    });
    setActiveStudentForReferral(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border/70 pb-4">
          <div>
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-primary">
              Referral Pipeline Intake
            </span>
            <h2 className="mt-1 font-serif text-2xl font-light text-foreground">
              Record Support Referral
            </h2>
            <p className="text-xs text-muted-foreground font-light mt-0.5">
              Candidate: <strong className="text-foreground">{s.name}</strong> ({s.id}) &bull;{" "}
              {s.department}
            </p>
          </div>

          <button
            onClick={() => setActiveStudentForReferral(null)}
            className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-3.5 flex items-start gap-3 text-xs text-muted-foreground">
            <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              Recording this referral sets the student's status to <strong>Pending Specialist</strong>.
              This student will immediately enter the Intake &amp; Referrals queue and increment the pending badge.
            </span>
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              Referral Destination Unit
            </label>
            <select
              value={specialistType}
              onChange={(e) => setSpecialistType(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <option value="DUT Neurodiversity Specialist">DUT Neurodiversity Specialist</option>
              <option value="Clinical & Educational Psychologist">Clinical &amp; Educational Psychologist</option>
              <option value="Assistive Technology Lab">Assistive Technology &amp; Braille Lab</option>
              <option value="Academic Accommodations Board">DUT Academic Accommodations Board</option>
              <option value="Student Counseling & Health">Student Counseling &amp; Health Centre</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              Referral Urgency Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <option value="Urgent">Urgent (Immediate exam accommodations at risk)</option>
              <option value="High Priority">High Priority (&ge;2 domain indicators flagged)</option>
              <option value="Standard Intake">Standard Intake (General screening review)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              Clinical Justification &amp; Notes
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={`E.g. Student demonstrates ${s.primaryIndicator.toLowerCase()}. Requires diagnostic assessment and extra exam time.`}
              className="w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-border/70">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setActiveStudentForReferral(null)}
              className="text-xs rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-primary text-primary-foreground text-xs rounded-xl gap-1.5"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Submit Referral</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
