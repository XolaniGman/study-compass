import React from "react";
import { ShieldCheck, Info } from "lucide-react";

export function SupportPopiaNotice() {
  return (
    <div className="rounded-2xl border border-border/80 bg-muted/30 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div className="space-y-1.5 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary font-mono">
              DUT Confidentiality &amp; POPIA Compliance Protocol
            </span>
            <span className="text-[10px] bg-primary/10 text-primary font-mono px-2 py-0.5 rounded-full">
              Act No. 4 of 2013 Compliant
            </span>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground font-light">
            Student screening records, psychometric indicators, and triage classifications are strictly confidential and governed by the South African Protection of Personal Information Act (POPIA). All composite indices represent probabilistic screening indicators for academic support and do not constitute formal psychiatric or clinical diagnoses.
          </p>
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground/80 font-mono pt-1">
            <Info className="h-3 w-3 text-primary" />
            <span>Accessible only by authorized Durban University of Technology Disability Unit staff.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
