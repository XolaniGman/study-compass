export function AdminNotice() {
  return (
    <div className="rounded-2xl border border-border/80 bg-muted/30 p-6">
      <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
        Administrative Environment Scope
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground font-light">
        This administrative console is a visual design prototype. No backend authentication,
        database records, or live server configurations are modified. All actions trigger
        simulated feedback.
      </p>
    </div>
  );
}
