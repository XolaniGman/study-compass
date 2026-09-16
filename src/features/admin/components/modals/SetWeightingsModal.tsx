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
import type { ScreeningDomainKey } from "../../../shared";
import { Scale, PieChart, ShieldCheck } from "lucide-react";

interface SetWeightingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SetWeightingsModal({ open, onOpenChange }: SetWeightingsModalProps) {
  const { scoringConfig, updateWeightings } = useInstitutional();

  const [weights, setWeights] = useState<Record<ScreeningDomainKey, number>>({
    reading: scoringConfig.weightings.reading ?? 1,
    grammar: scoringConfig.weightings.grammar ?? 1,
    mathematics: scoringConfig.weightings.mathematics ?? 1,
    memory: scoringConfig.weightings.memory ?? 1,
    comprehension: scoringConfig.weightings.comprehension ?? 1,
  });

  const totalRawWeight = Object.values(weights).reduce((acc, v) => acc + v, 0);

  const handleSliderChange = (dom: ScreeningDomainKey, val: number) => {
    setWeights((prev) => ({
      ...prev,
      [dom]: val,
    }));
  };

  const handleSave = () => {
    updateWeightings(weights);
    onOpenChange(false);
  };

  const handleEqualize = () => {
    setWeights({
      reading: 1,
      grammar: 1,
      mathematics: 1,
      memory: 1,
      comprehension: 1,
    });
  };

  const DOMAIN_LABELS: Record<ScreeningDomainKey, { name: string; code: string }> = {
    reading: { name: "Reading & Lexical Processing", code: "FR05" },
    grammar: { name: "Grammar & Syntax Formulation", code: "FR06" },
    mathematics: { name: "Mathematics & Quantitative", code: "FR07" },
    memory: { name: "Working Memory & Recall", code: "FR08" },
    comprehension: { name: "Comprehension & Text Analysis", code: "FR09" },
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-3xl p-6 sm:p-8">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-wider font-semibold">
            <Scale className="h-4 w-4" />
            <span>FR11 / FR12 &bull; Composite Weighting Matrix</span>
          </div>
          <DialogTitle className="font-serif text-2xl font-normal text-foreground mt-1">
            Set Domain Scoring Weightings
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground font-light">
            Adjust the relative mathematical weights of the 5 screening domains when computing the
            overall indicative composite score and risk classification.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          {(Object.keys(weights) as ScreeningDomainKey[]).map((dom) => {
            const rawVal = weights[dom];
            const pct =
              totalRawWeight > 0 ? Math.round((rawVal / totalRawWeight) * 100) : 0;
            const meta = DOMAIN_LABELS[dom];

            return (
              <div
                key={dom}
                className="rounded-2xl border border-border/80 bg-background/50 p-3.5 space-y-2 hover:border-primary/40 transition-all text-xs"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono text-[10px] text-primary font-semibold uppercase">
                      {meta.code}
                    </span>
                    <h5 className="font-medium text-foreground">{meta.name}</h5>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-foreground">{pct}%</span>
                    <span className="text-[10px] text-muted-foreground block">
                      Factor: {rawVal.toFixed(1)}x
                    </span>
                  </div>
                </div>

                <Slider
                  value={[rawVal * 10]}
                  min={5} // 0.5x
                  max={30} // 3.0x
                  step={1}
                  onValueChange={(val) => {
                    const newVal = val[0];
                    if (newVal !== undefined) {
                      handleSliderChange(dom, newVal / 10);
                    }
                  }}
                  className="py-1"
                />
              </div>
            );
          })}

          <div className="rounded-2xl border border-border bg-muted/30 p-3.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
              <PieChart className="h-4 w-4 text-primary shrink-0" />
              <span>Total Normalized Distribution:</span>
            </div>
            <strong className="font-mono text-foreground text-sm">100% Normalized</strong>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleEqualize}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Equalize Weights (1.0x each)
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
              Apply Weightings
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
