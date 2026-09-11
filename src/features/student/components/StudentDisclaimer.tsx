export function StudentDisclaimer() {
  return (
    <div className="rounded-2xl border border-border/80 bg-muted/30 p-6">
      <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
        Important Screening Notice
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground font-light">
        The results displayed above represent screening indicators only and do not constitute a
        formal psycho-educational diagnosis. If you would like formal accommodations or
        individualized guidance, please book an appointment with the DUT Disability Unit.
      </p>
    </div>
  );
}
