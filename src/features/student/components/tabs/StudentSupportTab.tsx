import React from "react";
import {
  CalendarCheck,
  Calendar,
  Clock,
  MapPin,
  User,
  ShieldCheck,
  Phone,
  Mail,
  Plus,
  AlertCircle,
  FileCheck,
} from "lucide-react";
import { useStudent } from "../../context/StudentContext";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";

export function StudentSupportTab() {
  const { consultations, setIsConsultationModalOpen, cancelConsultation, profile } = useStudent();

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/70 pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
            Institutional Support &amp; Accommodations
          </span>
          <h2 className="font-serif text-3xl font-light text-foreground mt-0.5">
            DUT Disability Care Unit
          </h2>
          <p className="text-xs text-muted-foreground font-light mt-1">
            Book appointments with campus educational psychologists, assistive technology officers,
            and submit exam concession applications.
          </p>
        </div>

        <Button
          onClick={() => setIsConsultationModalOpen(true)}
          className="bg-primary text-primary-foreground text-xs gap-2 rounded-xl shadow-sm self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Book Consultation &amp; Accommodations</span>
        </Button>
      </div>

      {/* Active Consultations List */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <h3 className="font-serif text-xl font-normal text-foreground">
            My Appointments &amp; Accommodation Requests
          </h3>
          <span className="text-xs font-mono text-muted-foreground">
            {consultations.filter((c) => c.status !== "cancelled").length} Active
          </span>
        </div>

        {consultations.length === 0 ? (
          <div className="text-center py-10 space-y-3">
            <Calendar className="h-10 w-10 text-muted-foreground mx-auto opacity-50" />
            <p className="text-sm text-muted-foreground">No active appointments booked yet.</p>
            <Button
              onClick={() => setIsConsultationModalOpen(true)}
              size="sm"
              className="bg-primary text-primary-foreground text-xs gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Book an Intake Review</span>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {consultations.map((booking) => (
              <div
                key={booking.id}
                className={`rounded-2xl border p-5 space-y-4 transition-all ${
                  booking.status === "cancelled"
                    ? "bg-muted/20 border-border/50 opacity-60"
                    : "bg-background/80 border-border/80 hover:border-primary/40 shadow-sm"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border/40 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm font-semibold text-foreground">
                      {booking.consultationTypeLabel}
                    </span>
                    <Badge variant="outline" className="text-[10px] font-mono text-primary border-primary/30">
                      {booking.referenceNumber}
                    </Badge>
                  </div>

                  <Badge
                    variant="outline"
                    className={`text-[10px] uppercase font-mono tracking-wider self-start sm:self-auto ${
                      booking.status === "confirmed"
                        ? "text-emerald-600 border-emerald-500/30 bg-emerald-500/10"
                        : booking.status === "scheduled"
                        ? "text-blue-600 border-blue-500/30 bg-blue-500/10"
                        : "text-muted-foreground border-border bg-muted/40"
                    }`}
                  >
                    {booking.status}
                  </Badge>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-primary shrink-0" />
                    <span>
                      <strong className="text-foreground font-medium">{booking.specialistName}</strong> (
                      {booking.specialistTitle.split("&")[0]})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary shrink-0" />
                    <span>
                      {booking.date} &bull; {booking.timeSlot}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary shrink-0" />
                    <span className="truncate">{booking.campus}</span>
                  </div>
                </div>

                {booking.requestedAccommodations.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
                      Requested Accommodations:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {booking.requestedAccommodations.map((acc, i) => (
                        <span
                          key={i}
                          className="text-[11px] bg-muted px-2.5 py-1 rounded-md text-foreground font-light"
                        >
                          {acc}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {booking.studentNotes && (
                  <div className="text-xs text-muted-foreground font-light italic bg-muted/30 p-3 rounded-xl">
                    &ldquo;{booking.studentNotes}&rdquo;
                  </div>
                )}

                {booking.status !== "cancelled" && (
                  <div className="flex justify-end pt-1">
                    <Button
                      onClick={() => cancelConsultation(booking.id)}
                      size="sm"
                      variant="ghost"
                      className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-500/10 h-7"
                    >
                      Cancel Appointment
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DUT Campus Directory & Disability Offices */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-sm">
        <h3 className="font-serif text-xl font-normal text-foreground">
          DUT Disability Unit Campus Contacts
        </h3>

        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              campus: "ML Sultan Campus (Durban)",
              building: "Disability Care Centre, Room A1-14",
              phone: "+27 (0)31 373 2489",
              email: "disability.mlsultan@dut.ac.za",
              hours: "Mon - Fri: 08:00 - 16:30",
            },
            {
              campus: "Steve Biko Campus (Durban)",
              building: "Library Student Services, 2nd Floor",
              phone: "+27 (0)31 373 2038",
              email: "disability.stevebiko@dut.ac.za",
              hours: "Mon - Fri: 08:00 - 16:30",
            },
            {
              campus: "Ritson Campus (Durban)",
              building: "Academic Support Hub, Room R204",
              phone: "+27 (0)31 373 5401",
              email: "disability.ritson@dut.ac.za",
              hours: "Mon - Fri: 08:30 - 16:00",
            },
            {
              campus: "Indumiso Campus (Pietermaritzburg)",
              building: "Midlands Student Wellness Building",
              phone: "+27 (0)33 845 8820",
              email: "disability.midlands@dut.ac.za",
              hours: "Mon - Fri: 08:00 - 16:00",
            },
          ].map((loc, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-border/80 bg-background/50 p-5 space-y-3 hover:border-primary/40 transition-all"
            >
              <h4 className="font-semibold text-sm text-foreground">{loc.campus}</h4>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>{loc.building}</span>
              </p>
              <div className="space-y-1 text-xs text-muted-foreground pt-1 border-t border-border/40">
                <div className="flex items-center gap-1.5">
                  <Phone className="h-3 w-3 text-primary shrink-0" />
                  <span>{loc.phone}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="h-3 w-3 text-primary shrink-0" />
                  <span>{loc.email}</span>
                </div>
                <div className="text-[11px] text-muted-foreground font-mono mt-1">
                  {loc.hours}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
