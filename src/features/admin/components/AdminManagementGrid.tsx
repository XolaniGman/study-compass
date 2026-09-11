import { SimulatedButton } from "../../shared";
import type { AdminManagementSectionItem } from "../types";

interface AdminManagementGridProps {
  sections: AdminManagementSectionItem[];
}

export function AdminManagementGrid({ sections }: AdminManagementGridProps) {
  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {sections.map((section) => (
        <section
          key={section.id}
          className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm flex flex-col justify-between"
        >
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Module &bull; {section.id}
            </span>
            <h2 className="mt-3 font-serif text-xl font-normal text-foreground">
              {section.title}
            </h2>
            <p className="mt-2 text-xs text-muted-foreground font-light leading-relaxed">
              {section.description}
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-border/60 flex flex-wrap gap-2">
            {section.actions.map((action) => (
              <SimulatedButton
                key={action}
                label={action}
                toastMessage={`Simulated action: ${action}`}
                variant="outline"
                size="sm"
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
