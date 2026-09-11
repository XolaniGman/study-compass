import React from "react";
import { useStudent } from "../context/StudentContext";
import { Badge } from "../../../components/ui/badge";

export function ScreeningResultsList() {
  const { latestSession, setIsReportModalOpen } = useStudent();
  const results = Object.values(latestSession.domainResults);

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
        <button
          onClick={() => setIsReportModalOpen(true)}
          className="text-xs font-mono uppercase text-primary tracking-wider hover:underline"
        >
          View Full Report
        </button>
      </div>

      <ul className="space-y-3">
        {results.map((result) => (
          <li
            key={result.domain}
            className="flex items-center justify-between rounded-xl border border-border/80 bg-background/60 p-4 transition-colors hover:bg-accent/20"
          >
            <div>
              <span className="font-medium text-sm text-foreground">{result.domainTitle}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className={`h-2 w-2 rounded-full ${result.color}`} />
              <Badge
                variant="outline"
                className={`text-xs ${
                  result.level === "needs-attention"
                    ? "text-rose-600 border-rose-500/30"
                    : result.level === "moderate"
                    ? "text-amber-600 border-amber-500/30"
                    : result.level === "mild"
                    ? "text-blue-600 border-blue-500/30"
                    : "text-emerald-600 border-emerald-500/30"
                }`}
              >
                {result.levelLabel} ({result.score}%)
              </Badge>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
