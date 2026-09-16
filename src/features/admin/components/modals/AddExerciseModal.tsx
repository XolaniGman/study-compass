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
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Textarea } from "../../../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { useInstitutional } from "../../../shared";
import type { InstitutionalExercise } from "../../../shared";
import { Dumbbell, PlusCircle, AlertCircle } from "lucide-react";

interface AddExerciseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddExerciseModal({ open, onOpenChange }: AddExerciseModalProps) {
  const { addExercise, contentLibrary } = useInstitutional();

  const [title, setTitle] = useState("");
  const [domain, setDomain] = useState("reading");
  const [category, setCategory] = useState("Assistive Tool & Strategy");
  const [duration, setDuration] = useState("15");
  const [difficulty, setDifficulty] = useState<InstitutionalExercise["difficulty"]>("Beginner");
  const [description, setDescription] = useState("");
  const [objectivesText, setObjectivesText] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError("Please provide both a title and description for this exercise.");
      return;
    }

    const objectives = objectivesText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    addExercise({
      title: title.trim(),
      domain,
      category: category.trim(),
      durationMinutes: parseInt(duration, 10) || 15,
      difficulty,
      interactiveType: "tts-reader",
      description: description.trim(),
      objectives:
        objectives.length > 0
          ? objectives
          : ["Reinforce cognitive automaticity", "Improve study endurance under timed load"],
      steps: [
        "Review tool instructions and adjust pacing",
        "Engage with interactive cognitive exercise drill",
        "Record session milestone upon completion",
      ],
    });

    // Reset
    setTitle("");
    setDescription("");
    setObjectivesText("");
    setError("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-3xl p-6 sm:p-8">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-wider font-semibold">
            <Dumbbell className="h-4 w-4" />
            <span>FR21 &bull; Assistive Resource Management</span>
          </div>
          <DialogTitle className="font-serif text-2xl font-normal text-foreground mt-1">
            Add Exercise Routine
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground font-light">
            Publish a new assistive tool or cognitive practice routine. This will immediately increment
            the <strong>Content Library</strong> count and become available in the Student Portal.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-destructive/10 p-3 text-xs text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <Label htmlFor="exTitle" className="text-xs font-medium">
              Routine Title *
            </Label>
            <Input
              id="exTitle"
              placeholder="e.g. Saccadic Reading Ruler & Bionic Highlighter"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-xl text-xs"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Target Screening Domain</Label>
              <Select value={domain} onValueChange={setDomain}>
                <SelectTrigger className="rounded-xl text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  <SelectItem value="reading">Reading &amp; Dyslexia</SelectItem>
                  <SelectItem value="grammar">Grammar &amp; Dysgraphia</SelectItem>
                  <SelectItem value="mathematics">Mathematics &amp; Dyscalculia</SelectItem>
                  <SelectItem value="memory">Working Memory &amp; ADHD</SelectItem>
                  <SelectItem value="comprehension">Passage Comprehension</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Difficulty Level</Label>
              <Select
                value={difficulty}
                onValueChange={(val) => setDifficulty(val as InstitutionalExercise["difficulty"])}
              >
                <SelectTrigger className="rounded-xl text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="exCategory" className="text-xs font-medium">
                Category
              </Label>
              <Input
                id="exCategory"
                placeholder="e.g. Assistive Tool & Strategy"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="exDuration" className="text-xs font-medium">
                Duration (Minutes)
              </Label>
              <Input
                id="exDuration"
                type="number"
                min="5"
                max="60"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="exDesc" className="text-xs font-medium">
              Description *
            </Label>
            <Textarea
              id="exDesc"
              rows={2}
              placeholder="Detailed description of the cognitive routine..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-xl text-xs resize-none"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="exObjectives" className="text-xs font-medium">
              Core Objectives (One per line)
            </Label>
            <Textarea
              id="exObjectives"
              rows={2}
              placeholder="e.g. Mitigate visual line skipping&#10;Reinforce phonological decoding speed"
              value={objectivesText}
              onChange={(e) => setObjectivesText(e.target.value)}
              className="rounded-xl text-xs resize-none"
            />
          </div>

          <div className="rounded-2xl bg-muted/40 p-3 text-[11px] text-muted-foreground font-light flex items-center justify-between">
            <span>Current Content Library Total:</span>
            <strong className="font-mono text-foreground">{contentLibrary} Items</strong>
          </div>

          <DialogFooter className="pt-2 gap-2">
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
              type="submit"
              size="sm"
              className="bg-primary text-primary-foreground rounded-xl text-xs px-4 shadow-sm"
            >
              Publish Routine
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
