export function SupportShowcase() {
  return (
    <section className="py-20 px-6 sm:px-12 lg:px-24 max-w-7xl mx-auto border-t border-border/60">
      <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-7 order-2 lg:order-1">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-lg aspect-video">
            <video
              src="/assets/support.mp4"
              poster="/assets/support_ref.jpg"
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-xs text-white/90">
              <span className="font-light">DUT Disability Unit Collaborative Advisory</span>
              <span className="font-mono text-[10px] tracking-wider uppercase bg-black/40 px-2 py-0.5 rounded backdrop-blur">
                Support Network
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 order-1 lg:order-2">
          <p className="text-xs font-semibold tracking-widest uppercase text-primary">
            Institutional Integration
          </p>
          <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-light text-foreground leading-snug">
            Direct Bridge to DUT Disability Unit Support
          </h2>
          <p className="mt-5 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
            Screening is only the first step. Study Compass bridges student self-insights
            directly into confidential consultations, assistive technology provisions, and
            formal accommodation applications.
          </p>

          <div className="mt-8 space-y-4 text-sm text-muted-foreground font-light">
            <div className="flex items-start gap-3">
              <span className="text-primary font-serif font-bold">—</span>
              <span>Confidential appointment scheduling with qualified learning specialists</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary font-serif font-bold">—</span>
              <span>Assistive reading software, speech-to-text, and audio recording tools</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary font-serif font-bold">—</span>
              <span>Extra time and dedicated assessment venue recommendations</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
