import React, { useState } from "react";
import { X, Calendar, Clock, MapPin, User, CheckCircle2, ShieldCheck, FileCheck } from "lucide-react";
import { useStudent } from "../context/StudentContext";
import { Button } from "../../../components/ui/button";

const CONSULTATION_TYPES = [
  {
    id: "screening-review",
    label: "Screening Indicator Review & Intake Consultation",
    duration: "45 mins",
    desc: "Comprehensive review of your preliminary screening report with a disability specialist.",
  },
  {
    id: "exam-accommodations",
    label: "Exam Accommodations Formal Application",
    duration: "30 mins",
    desc: "Application for extra time (15-20 min/hr), separate venue, or digital writing support.",
  },
  {
    id: "assistive-tech",
    label: "Assistive Technology & Software Training",
    duration: "60 mins",
    desc: "Hands-on session with screen readers, speech-to-text dictation, and dyslexia overlays.",
  },
  {
    id: "formal-referral",
    label: "Psycho-Educational Assessment Referral",
    duration: "45 mins",
    desc: "Referral pathway to registered educational psychologists for formal diagnostic testing.",
  },
  {
    id: "counseling",
    label: "Academic Strategy & Neurodiversity Counseling",
    duration: "30 mins",
    desc: "One-on-one session for lecture focus, task-chunking, and anxiety management.",
  },
];

const CAMPUSES = [
  "ML Sultan Campus — Disability Care Centre (Room A1-14)",
  "Steve Biko Campus — Library Student Services (2nd Floor)",
  "Ritson Campus — Academic Support Hub",
  "Indumiso Campus — Midlands Student Wellness",
];

const SPECIALISTS = [
  { name: "Dr. N. Dube", title: "Senior Educational Psychologist & Unit Lead" },
  { name: "Ms. P. Govender", title: "Assistive Technology & Accommodations Officer" },
  { name: "Mr. K. Sithole", title: "Disability Rights & Academic Advisor" },
];

const ACCOMMODATIONS_OPTIONS = [
  "15 min/hr Exam Extra Time",
  "20 min/hr Exam Extra Time",
  "Separate Low-Distraction Exam Venue",
  "Disability Monitored PC for Typed Exam Responses",
  "Screen Reader & Text-to-Speech Software",
  "Permission to Audio Record Lectures",
  "Enlarged Exam Print Font / Tinted Paper",
];

export function ConsultationBookingModal() {
  const { isConsultationModalOpen, setIsConsultationModalOpen, bookConsultation, profile, latestSession } =
    useStudent();

  const [consultationType, setConsultationType] = useState<string>("screening-review");
  const [campus, setCampus] = useState<string>(CAMPUSES[0] ?? "");
  const [specialist, setSpecialist] = useState(SPECIALISTS[0]!);
  const [date, setDate] = useState<string>("2026-09-22");
  const [timeSlot, setTimeSlot] = useState<string>("10:00 AM - 10:45 AM");
  const [notes, setNotes] = useState<string>(
    "Requesting review of my recent screening indicators (Reading and Math difficulty flags) for semester 2 exam accommodation submission."
  );
  const [selectedAccommodations, setSelectedAccommodations] = useState<string[]>([
    "15 min/hr Exam Extra Time",
    "Disability Monitored PC for Typed Exam Responses",
  ]);

  if (!isConsultationModalOpen) return null;

  const toggleAccommodation = (item: string) => {
    if (selectedAccommodations.includes(item)) {
      setSelectedAccommodations(selectedAccommodations.filter((a) => a !== item));
    } else {
      setSelectedAccommodations([...selectedAccommodations, item]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const typeObj = CONSULTATION_TYPES.find((c) => c.id === consultationType);
    bookConsultation({
      consultationType: consultationType as any,
      consultationTypeLabel: typeObj?.label || "Screening Review",
      campus,
      specialistName: specialist.name,
      specialistTitle: specialist.title,
      date,
      timeSlot,
      studentNotes: notes,
      requestedAccommodations: selectedAccommodations,
    });
    setIsConsultationModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setIsConsultationModalOpen(false)}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl z-10 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border/70 pb-4">
          <div>
            <span className="text-[11px] font-mono font-semibold uppercase tracking-widest text-primary">
              DUT Disability Unit
            </span>
            <h2 className="font-serif text-2xl font-light text-foreground mt-0.5">
              Book Support Consultation &amp; Accommodations
            </h2>
            <p className="text-xs text-muted-foreground font-light mt-1">
              Connect with an official DUT disability advisor to review your screening report or
              apply for institutional accommodations.
            </p>
          </div>
          <button
            onClick={() => setIsConsultationModalOpen(false)}
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            title="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Consultation Type */}
          <div className="space-y-2.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-foreground block">
              1. Select Consultation Service
            </label>
            <div className="space-y-2">
              {CONSULTATION_TYPES.map((type) => {
                const isSelected = consultationType === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setConsultationType(type.id)}
                    className={`w-full p-3.5 rounded-xl border text-left text-xs transition-all flex items-start justify-between ${
                      isSelected
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-card border-border text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-sm">{type.label}</div>
                      <div className="text-xs text-muted-foreground font-light mt-0.5">
                        {type.desc}
                      </div>
                    </div>
                    <span className="text-[11px] font-mono bg-muted/60 px-2 py-0.5 rounded text-muted-foreground shrink-0 ml-2">
                      {type.duration}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Campus & Specialist */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-foreground block">
                2. Campus Location
              </label>
              <select
                value={campus}
                onChange={(e) => setCampus(e.target.value)}
                className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {CAMPUSES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-foreground block">
                3. Preferred Specialist
              </label>
              <select
                value={specialist.name}
                onChange={(e) => {
                  const sp = SPECIALISTS.find((s) => s.name === e.target.value);
                  if (sp) setSpecialist(sp);
                }}
                className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {SPECIALISTS.map((s) => (
                  <option key={s.name} value={s.name}>
                    {s.name} ({s.title.split("&")[0]})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 3. Date & Time */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-foreground block">
                4. Appointment Date
              </label>
              <input
                type="date"
                value={date}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-foreground block">
                5. Available Time Slot
              </label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="09:00 AM - 09:45 AM">09:00 AM - 09:45 AM</option>
                <option value="10:00 AM - 10:45 AM">10:00 AM - 10:45 AM</option>
                <option value="11:30 AM - 12:15 PM">11:30 AM - 12:15 PM</option>
                <option value="02:00 PM - 02:45 PM">02:00 PM - 02:45 PM</option>
                <option value="03:30 PM - 04:15 PM">03:30 PM - 04:15 PM</option>
              </select>
            </div>
          </div>

          {/* 4. Requested Accommodations Checkboxes */}
          <div className="space-y-2.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-foreground block">
              6. Requested Accommodations (Optional)
            </label>
            <div className="grid gap-2 sm:grid-cols-2">
              {ACCOMMODATIONS_OPTIONS.map((item) => {
                const checked = selectedAccommodations.includes(item);
                return (
                  <button
                    type="button"
                    key={item}
                    onClick={() => toggleAccommodation(item)}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                      checked
                        ? "bg-primary/10 border-primary text-primary font-medium"
                        : "bg-muted/30 border-border text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <span>{item}</span>
                    <div
                      className={`h-4 w-4 rounded border flex items-center justify-center transition-colors shrink-0 ml-2 ${
                        checked ? "bg-primary border-primary text-primary-foreground" : "border-border"
                      }`}
                    >
                      {checked && <CheckCircle2 className="h-3 w-3" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Student Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-foreground block">
              7. Additional Notes / Coursework Context
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Describe any specific modules or upcoming exam deadlines..."
            />
          </div>

          {/* Screening Attach Notice */}
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3.5 flex items-center gap-3">
            <FileCheck className="h-5 w-5 text-emerald-600 shrink-0" />
            <div className="text-xs text-muted-foreground leading-relaxed">
              Your latest screening profile (Overall Index: {latestSession.overallIndex}%) will be
              automatically attached to this appointment request.
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsConsultationModalOpen(false)}
              className="text-xs text-muted-foreground"
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" className="bg-primary text-primary-foreground text-xs px-6">
              Confirm &amp; Book Appointment
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
