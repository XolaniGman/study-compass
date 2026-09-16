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
import { Badge } from "../../../../components/ui/badge";
import { Input } from "../../../../components/ui/input";
import { useInstitutional } from "../../../shared";
import { Archive, RotateCcw, Search, Dumbbell, BookOpen, MapPin, AlertCircle } from "lucide-react";

interface ArchiveResourceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ArchiveResourceModal({ open, onOpenChange }: ArchiveResourceModalProps) {
  const {
    exercises,
    supportInfo,
    contacts,
    toggleArchiveExercise,
    toggleArchiveGuide,
    toggleArchiveContact,
    contentLibrary,
  } = useInstitutional();

  const [tab, setTab] = useState<"all" | "exercises" | "guides" | "contacts">("all");
  const [search, setSearch] = useState("");

  // Build unified items list
  const unifiedItems = [
    ...exercises.map((e) => ({
      id: e.id,
      title: e.title,
      category: e.category,
      type: "exercise" as const,
      archived: e.archived,
      onToggle: () => toggleArchiveExercise(e.id),
      icon: <Dumbbell className="h-3.5 w-3.5 text-primary" />,
    })),
    ...supportInfo.map((g) => ({
      id: g.id,
      title: g.title,
      category: g.category,
      type: "guide" as const,
      archived: g.archived,
      onToggle: () => toggleArchiveGuide(g.id),
      icon: <BookOpen className="h-3.5 w-3.5 text-chart-2" />,
    })),
    ...contacts.map((c) => ({
      id: c.id,
      title: c.campus,
      category: c.building,
      type: "contact" as const,
      archived: c.archived,
      onToggle: () => toggleArchiveContact(c.id),
      icon: <MapPin className="h-3.5 w-3.5 text-chart-3" />,
    })),
  ];

  const filteredItems = unifiedItems.filter((item) => {
    const matchesTab = tab === "all" || item.type === tab.slice(0, -1);
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl rounded-3xl p-6 sm:p-8 max-h-[85vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-wider font-semibold">
            <Archive className="h-4 w-4" />
            <span>FR21 &bull; Resource Lifecycle Management</span>
          </div>
          <DialogTitle className="font-serif text-2xl font-normal text-foreground mt-1">
            Archive / Restore Content Resources
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground font-light">
            Archiving soft-deactivates an exercise, study guide, or campus directory. Archived items
            are immediately subtracted from the <strong>Content Library</strong> metric count and hidden
            from the student views.
          </DialogDescription>
        </DialogHeader>

        {/* Content count callout */}
        <div className="rounded-2xl border border-border/80 bg-muted/40 p-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <AlertCircle className="h-4 w-4 text-primary shrink-0" />
            <span>Active Content Library Count:</span>
          </div>
          <strong className="font-mono text-foreground text-sm">
            {contentLibrary} Active Items
          </strong>
        </div>

        {/* Search & Tabs Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search resource title or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 text-xs rounded-xl h-9"
            />
          </div>

          <div className="flex items-center gap-1 self-start sm:self-auto">
            {[
              { id: "all", label: "All" },
              { id: "exercises", label: "Exercises" },
              { id: "guides", label: "Guides" },
              { id: "contacts", label: "Contacts" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id as any)}
                className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all font-mono ${
                  tab === t.id
                    ? "bg-primary text-primary-foreground border-primary font-semibold"
                    : "bg-muted/40 border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Resource List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 pt-2 my-2 border-y border-border/60 py-3">
          {filteredItems.length === 0 ? (
            <div className="text-center py-8 text-xs text-muted-foreground font-light">
              No matching resources found.
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className={`rounded-2xl border p-3.5 flex items-center justify-between gap-3 transition-all text-xs ${
                  item.archived
                    ? "bg-muted/20 border-border/40 opacity-70"
                    : "bg-background/60 border-border/80 hover:border-primary/40"
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="h-8 w-8 rounded-xl bg-muted flex items-center justify-center shrink-0 mt-0.5">
                    {item.icon}
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground truncate">{item.title}</span>
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-mono ${
                          item.archived
                            ? "text-amber-600 border-amber-500/30 bg-amber-500/10"
                            : "text-emerald-600 border-emerald-500/30 bg-emerald-500/10"
                        }`}
                      >
                        {item.archived ? "Archived" : "Active"}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground font-light truncate">
                      {item.category} &bull;{" "}
                      <span className="capitalize font-mono">{item.type}</span>
                    </p>
                  </div>
                </div>

                <Button
                  onClick={item.onToggle}
                  variant={item.archived ? "default" : "outline"}
                  size="sm"
                  className={`rounded-xl text-xs h-8 shrink-0 ${
                    item.archived
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : "text-amber-600 hover:text-amber-700 hover:bg-amber-500/10 border-amber-500/30"
                  }`}
                >
                  {item.archived ? (
                    <>
                      <RotateCcw className="h-3.5 w-3.5 mr-1" />
                      <span>Restore</span>
                    </>
                  ) : (
                    <>
                      <Archive className="h-3.5 w-3.5 mr-1" />
                      <span>Archive</span>
                    </>
                  )}
                </Button>
              </div>
            ))
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-1">
          <span className="text-[11px] font-mono text-muted-foreground">
            Showing {filteredItems.length} resources ({unifiedItems.filter((i) => i.archived).length} archived)
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="rounded-xl text-xs"
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
