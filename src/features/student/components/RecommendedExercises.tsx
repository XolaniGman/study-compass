import type { RecommendedExerciseItem } from "../types";

interface RecommendedExercisesProps {
  exercises: RecommendedExerciseItem[];
}

export function RecommendedExercises({ exercises }: RecommendedExercisesProps) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
      <div className="flex items-center justify-between border-b border-border/60 pb-4 mb-6">
        <div>
          <h2 className="font-serif text-xl font-normal text-foreground">
            Recommended Exercises
          </h2>
          <p className="mt-1 text-xs text-muted-foreground font-light">
            Targeted strategies and practice routines matched to your indicators.
          </p>
        </div>
        <span className="text-xs font-mono uppercase text-muted-foreground tracking-wider bg-muted px-2.5 py-1 rounded">
          Personalized
        </span>
      </div>

      <ul className="space-y-3">
        {exercises.map((exercise) => (
          <li
            key={exercise.id}
            className="rounded-xl border border-border/80 bg-background/60 p-4 transition-colors hover:bg-accent/20"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm text-foreground">{exercise.title}</span>
              <span className="text-[11px] font-mono uppercase text-primary/80 bg-primary/10 px-2 py-0.5 rounded">
                {exercise.category}
              </span>
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground font-light">{exercise.schedule}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
