import type { ScreeningPillar } from "../types";

const PILLARS: ScreeningPillar[] = [
  {
    title: "Reading & Lexical Processing",
    description:
      "Evaluates reading fluency, phonological decoding patterns, and comprehension pacing across academic literature.",
  },
  {
    title: "Mathematical & Quantitative Fluency",
    description:
      "Tracks spatial number alignment, formula comprehension, and sequential numerical problem-solving speed.",
  },
  {
    title: "Working Memory & Attention",
    description:
      "Measures task-switching stamina, multi-step instruction retention, and sustained focus during academic tasks.",
  },
];

export function DiagnosticPillars() {
  return (
    <section className="py-20 px-6 sm:px-12 lg:px-24 max-w-7xl mx-auto border-t border-border/60">
      <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-5">
          <p className="text-xs font-semibold tracking-widest uppercase text-primary">
            Screening Framework
          </p>
          <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-light text-foreground leading-snug">
            Evidence-Informed Screening Architecture
          </h2>
          <p className="mt-5 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
            Designed specifically for higher education environments, the detector evaluates
            multiple cognitive and academic dimensions without generating diagnostic labels.
          </p>

          <div className="mt-8 space-y-6">
            {PILLARS.map((pillar) => (
              <div key={pillar.title} className="border-l-2 border-primary/40 pl-4">
                <h4 className="text-sm font-semibold text-foreground">{pillar.title}</h4>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-lg aspect-video">
            <video
              src="/assets/showcase.mp4"
              poster="/assets/showcase_ref.jpg"
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-xs text-white/90">
              <span className="font-light">Personalized Learning Assessment Interface</span>
              <span className="font-mono text-[10px] tracking-wider uppercase bg-black/40 px-2 py-0.5 rounded backdrop-blur">
                Simulated Overview
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
