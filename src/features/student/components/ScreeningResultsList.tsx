import type { ScreeningResultItem } from "../types";

interface ScreeningResultsListProps {
  results: ScreeningResultItem[];
}

export function ScreeningResultsList({ results }: ScreeningResultsListProps) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
      <div className="flex items-center justify-between border-b border-border/60 pb-4 mb-6">
        <div>
          <h2 className="font-serif text-xl font-normal text-foreground">
            My Screening Results
          </h2>
          <p className="mt-1 text-xs text-muted-foreground font-light">
            Preliminary indicator metrics across core academic domains.
          </p>
        </div>
        <span className="text-xs font-mono uppercase text-muted-foreground tracking-wider bg-muted px-2.5 py-1 rounded">
          Simulation
        </span>
      </div>

      <ul className="space-y-3">
        {results.map((result) => (
          <li
            key={result.area}
            className="flex items-center justify-between rounded-xl border border-border/80 bg-background/60 p-4 transition-colors hover:bg-accent/20"
          >
            <div>
              <span className="font-medium text-sm text-foreground">{result.area}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className={`h-2 w-2 rounded-full ${result.color}`} />
              <span className="text-xs font-medium text-muted-foreground">{result.status}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
