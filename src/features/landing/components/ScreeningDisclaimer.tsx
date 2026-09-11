import { Link } from "@tanstack/react-router";

export function ScreeningDisclaimer() {
  return (
    <section className="py-16 px-6 sm:px-12 lg:px-24 max-w-5xl mx-auto">
      <div className="rounded-2xl border border-border/80 bg-muted/30 p-8 sm:p-10 text-center">
        <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
          Screening &amp; Assessment Ethics
        </p>
        <h3 className="mt-3 font-serif text-xl sm:text-2xl font-light text-foreground">
          Important Screening Disclaimer
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground max-w-2xl mx-auto font-light">
          This system provides screening indicators only and does not replace professional or
          clinical psychological assessment. All dashboards, indicator categories, and
          exercises within this application are simulated for institutional demonstration.
        </p>
        <div className="mt-6">
          <Link
            to="/student"
            className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-2.5 text-xs font-medium uppercase tracking-wider text-primary-foreground shadow transition-colors hover:bg-primary/90"
          >
            Begin Student Screening
          </Link>
        </div>
      </div>
    </section>
  );
}
