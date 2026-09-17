import React from "react";
import { RotateCcw, Activity } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { useInstitutional } from "../../shared";
import type { AdminProfile } from "../types";

interface AdminHeaderProps {
  profile: AdminProfile;
}

export function AdminHeader({ profile }: AdminHeaderProps) {
  const { resetAllToBaseline } = useInstitutional();

  return (
    <div className="space-y-4 border-b border-border/70 pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary">
              DUT Institutional Portal
            </span>
            <span className="text-muted-foreground font-mono text-xs">&bull;</span>
            <span className="text-xs text-muted-foreground font-mono">
              Systems Administration
            </span>
          </div>

          <h1 className="mt-1 font-serif text-3xl sm:text-4xl font-light tracking-tight text-foreground">
            Institutional Administration Portal
          </h1>

          <p className="mt-1 text-xs sm:text-sm text-muted-foreground font-light">
            {profile.role} &bull; System Core:{" "}
            <strong className="font-mono text-foreground font-medium">
              {profile.systemVersion}
            </strong>{" "}
            &bull; Durban University of Technology
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 text-xs font-mono font-medium">
            <Activity className="h-3.5 w-3.5 animate-pulse" />
            <span>Operational &bull; Config Live</span>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={resetAllToBaseline}
            className="text-xs rounded-xl gap-1.5 h-9"
            title="Reset sandbox data to default institutional baseline"
          >
            <RotateCcw className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Reset Baseline</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
