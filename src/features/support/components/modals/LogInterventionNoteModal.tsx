import React, { useState } from "react";
import { X, FileText, Check } from "lucide-react";
import { useSupport } from "../../context/SupportContext";
import { Button } from "../../../../components/ui/button";
import type { InterventionNote } from "../../types";

export function LogInterventionNoteModal() {
  const { activeStudentForNote, setActiveStudentForNote, logInterventionNote } =
    useSupport();

  const [category, setCategory] =
    useState<InterventionNote["category"]>("Consultation");
  const [noteText, setNoteText] = useState("");

  if (!activeStudentForNote) return null;

  const s = activeStudentForNote;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    logInterventionNote(s.id, noteText.trim(), category);
    setActiveStudentForNote(null);
    setNoteText("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border/70 pb-4">
          <div>
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-primary">
              Clinical Case Notes
            </span>
            <h2 className="mt-1 font-serif text-2xl font-light text-foreground">
              Log Intervention Note
            </h2>
            <p className="text-xs text-muted-foreground font-light mt-0.5">
              Student: <strong className="text-foreground">{s.name}</strong> ({s.id})
            </p>
          </div>

          <button
            onClick={() => setActiveStudentForNote(null)}
            className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              Note Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <option value="Consultation">Clinical Consultation / Interview</option>
              <option value="Academic Advice">Academic Strategy &amp; Study Advice</option>
              <option value="Accommodations Review">Accommodations &amp; Exam Review</option>
              <option value="Clinical Observation">Triage Observation &amp; Screening Note</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              Intervention Details &amp; Observations
            </label>
            <textarea
              required
              rows={4}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Record observations, student reported challenges, or recommended interventions..."
              className="w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-border/70">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setActiveStudentForNote(null)}
              className="text-xs rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={!noteText.trim()}
              className="bg-primary text-primary-foreground text-xs rounded-xl gap-1.5"
            >
              <Check className="h-3.5 w-3.5" />
              <span>Save Note</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
