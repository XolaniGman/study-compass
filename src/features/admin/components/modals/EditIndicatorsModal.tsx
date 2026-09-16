import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../../../components/ui/dialog";
import { Button } from "../../../../components/ui/button";
import { Label } from "../../../../components/ui/label";
import { Slider } from "../../../../components/ui/slider";
import { useInstitutional } from "../../../shared";
import { Sliders, ShieldCheck, AlertTriangle, ArrowRight } from "lucide-react";

interface EditIndicatorsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditIndicatorsModal({ open, onOpenChange }: EditIndicatorsModalProps) {
  const { scoringConfig, updateThresholds } = useInstitutional();

  const [highThreshold, setHighThreshold] = useState(
    scoringConfig.thresholds.high || 40
  );
  const [moderateThreshold, setModerateThreshold] = useState(
    scoringConfig.thresholds.moderate || 60
  );

  const handleSave = () => {
    updateThresholds({
      high: highThreshold,
      moderate: moderateThreshold,
    });
    onOpenChange(false);
  };

  const handleReset = () => {
    setHighThreshold(40);
    setModerateThreshold(60);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-3xl p-6 sm:p-8">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-wider font-semibold">
            <Sliders className="h-4 w-4" />
            <span>FR11 / FR12 &bull; Scoring Calibration Engine</span>
          </div>
          <DialogTitle className="font-serif text-2xl font-normal text-foreground mt-1">
            Edit Indicator Risk Thresholds
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground font-light">
            Calibrate cognitive difficulty cutoffs. This updates the shared institutional config: the
            Staff Triage Dashboard recalculates <strong>High Priority flags</strong> in real time, and
            student screening results recalculate accordingly.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {/* High Priority Cutoff */}
          <div className="space-y-3 rounded-2xl border border-rose-500/30 bg-rose-500/5 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-rose-500" />
                  <Label className="text-xs font-semibold text-foreground">
                    High-Priority / Needs Attention Cutoff
                  </Label>
                </div>
                <p className="text-[11px] text-muted-foreground font-light mt-0.5">
                  Domain scores &le; this percentage trigger urgent Disability Unit specialist intake flags.
                </p>
              </div>
              <span className="text-base font-mono font-bold text-rose-600 bg-rose-500/10 px-2.5 py-1 rounded-xl">
                {highThreshold}%
              </span>
            </div>

            <Slider
              value={[highThreshold]}
              min={20}
              max={60}
              step={1}
              onValueChange={(val) => {
                const newVal = val[0];
                if (newVal !== undefined) {
                  setHighThreshold(newVal);
                  if (newVal >= moderateThreshold) {
                    setModerateThreshold(Math.min(90, newVal + 10));
                  }
                }
              }}
              className="py-1"
            />

            <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
              <span>Strict (20%)</span>
              <span>Baseline (40%)</span>
              <span>Sensitive (60%)</span>
            </div>
          </div>

          {/* Moderate Cutoff */}
          <div className="space-y-3 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  <Label className="text-xs font-semibold text-foreground">
                    Moderate Difficulty Indicator Cutoff
                  </Label>
                </div>
                <p className="text-[11px] text-muted-foreground font-light mt-0.5">
                  Scores between High and Moderate recommend targeted study tools &amp; peer coaching.
                </p>
              </div>
              <span className="text-base font-mono font-bold text-amber-600 bg-amber-500/10 px-2.5 py-1 rounded-xl">
                {moderateThreshold}%
              </span>
            </div>

            <Slider
              value={[moderateThreshold]}
              min={highThreshold + 5}
              max={85}
              step={1}
              onValueChange={(val) => {
                const newVal = val[0];
                if (newVal !== undefined) {
                  setModerateThreshold(newVal);
                }
              }}
              className="py-1"
            />

            <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
              <span>Lower Bound ({highThreshold + 5}%)</span>
              <span>Baseline (60%)</span>
              <span>Upper Bound (85%)</span>
            </div>
          </div>

          {/* Cross-Module Link Notice */}
          <div className="rounded-2xl border border-border bg-card p-3.5 space-y-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-2 text-foreground font-medium text-[11px]">
              <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
              <span>Cross-Module Shared Config Active</span>
            </div>
            <p className="font-light text-[11px] leading-relaxed">
              Modifying these thresholds immediately updates the Staff Dashboard Flagged Support tally
              (e.g. shifts the 34 High Priority cohort) and aligns the Student screening report.
            </p>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Reset to Baseline (40% / 60%)
          </Button>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSave}
              className="bg-primary text-primary-foreground rounded-xl text-xs px-4 shadow-sm"
            >
              Save Calibration
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
