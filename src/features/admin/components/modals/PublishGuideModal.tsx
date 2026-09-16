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
import { BookOpen, PlusCircle, AlertCircle } from "lucide-react";

interface PublishGuideModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PublishGuideModal({ open, onOpenChange }: PublishGuideModalProps) {
  const { addSupportGuide, contentLibrary } = useInstitutional();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Institutional Policy");
  const [targetAudience, setTargetAudience] = useState("All Enrolled Students");
  const [readingMinutes, setReadingMinutes] = useState("6");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("DUT Disability Care Unit");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim()) {
      setError("Please provide both a guide title and summary.");
      return;
    }

    addSupportGuide({
      title: title.trim(),
      category: category.trim(),
      targetAudience: targetAudience.trim(),
      readingMinutes: parseInt(readingMinutes, 10) || 6,
      summary: summary.trim(),
      content: content.trim() || summary.trim(),
      author: author.trim() || "DUT Disability Unit",
    });

    setTitle("");
    setSummary("");
    setContent("");
    setError("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-3xl p-6 sm:p-8">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-wider font-semibold">
            <BookOpen className="h-4 w-4" />
            <span>FR21 / FR17 &bull; Support Guidance Repository</span>
          </div>
          <DialogTitle className="font-serif text-2xl font-normal text-foreground mt-1">
            Publish Study Guide / Support Article
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground font-light">
            Publish institutional accommodations policies, assistive technology guides, or exam
            concession strategies. Immediately increments the <strong>Content Library</strong> count.
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
            <Label htmlFor="guideTitle" className="text-xs font-medium">
              Guide Title *
            </Label>
            <Input
              id="guideTitle"
              placeholder="e.g. Navigating Extra Time Exam Concessions at DUT"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-xl text-xs"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="rounded-xl text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  <SelectItem value="Institutional Policy">Institutional Policy</SelectItem>
                  <SelectItem value="Assistive Technology">Assistive Technology</SelectItem>
                  <SelectItem value="Exam Strategy">Exam Concessions &amp; Strategy</SelectItem>
                  <SelectItem value="Diagnostic Guidance">Screening Guidance</SelectItem>
                  <SelectItem value="Campus Facilities">Campus Facilities</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="readingMins" className="text-xs font-medium">
                Est. Reading Time (Mins)
              </Label>
              <Input
                id="readingMins"
                type="number"
                min="2"
                max="30"
                value={readingMinutes}
                onChange={(e) => setReadingMinutes(e.target.value)}
                className="rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="audience" className="text-xs font-medium">
                Target Student Cohort
              </Label>
              <Input
                id="audience"
                placeholder="e.g. Students with Reading Difficulties"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="author" className="text-xs font-medium">
                Author / Department
              </Label>
              <Input
                id="author"
                placeholder="e.g. Dr. N. Dube (Disability Unit)"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="summary" className="text-xs font-medium">
              Executive Summary *
            </Label>
            <Textarea
              id="summary"
              rows={2}
              placeholder="Brief summary displayed in resource directory..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="rounded-xl text-xs resize-none"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="content" className="text-xs font-medium">
              Full Guide Content
            </Label>
            <Textarea
              id="content"
              rows={3}
              placeholder="Detailed guidelines, application steps, and concession instructions..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
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
              Publish Guide
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
