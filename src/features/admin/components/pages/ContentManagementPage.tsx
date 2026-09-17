import React, { useState } from "react";
import {
  Dumbbell,
  MapPin,
  BookOpen,
  Archive,
  ArrowLeft,
  Plus,
  CheckCircle2,
  Clock,
  ExternalLink,
  RotateCcw,
  Sparkles,
  Phone,
  Mail,
  Building,
  FileText,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { useInstitutional } from "../../../shared/context/InstitutionalContext";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Badge } from "../../../../components/ui/badge";
import { toast } from "sonner";
import type {
  InstitutionalExercise,
  InstitutionalSupportGuide,
  InstitutionalContact,
} from "../../../shared/types";

interface ContentManagementPageProps {
  initialSubtab?: string;
  onNavigateToOverview: () => void;
  onSubtabChange?: (subtab: string) => void;
}

export function ContentManagementPage({
  initialSubtab = "add-exercise",
  onNavigateToOverview,
  onSubtabChange,
}: ContentManagementPageProps) {
  const {
    exercises,
    addExercise,
    toggleArchiveExercise,
    supportInfo,
    addSupportGuide,
    toggleArchiveGuide,
    contacts,
    updateContact,
    toggleArchiveContact,
    contentLibrary,
  } = useInstitutional();

  const [activeSubtab, setActiveSubtab] = useState<string>(initialSubtab);

  React.useEffect(() => {
    if (initialSubtab) {
      setActiveSubtab(initialSubtab);
    }
  }, [initialSubtab]);

  const handleSelectSubtab = (id: string) => {
    setActiveSubtab(id);
    if (onSubtabChange) onSubtabChange(id);
  };

  const activeExercisesCount = exercises.filter((e) => !e.archived).length;
  const activeGuidesCount = supportInfo.filter((s) => !s.archived).length;
  const activeContactsCount = contacts.filter((c) => !c.archived).length;

  // Subtabs configuration matching exact reference UI style
  const subTabs = [
    {
      id: "add-exercise",
      label: "Add Exercise",
      icon: <Dumbbell className="h-4 w-4" />,
      badge: `${activeExercisesCount} Tools`,
    },
    {
      id: "update-contact",
      label: "Update Contact",
      icon: <MapPin className="h-4 w-4" />,
      badge: `${activeContactsCount} Contacts`,
    },
    {
      id: "publish-guide",
      label: "Publish Guide",
      icon: <BookOpen className="h-4 w-4" />,
      badge: `${activeGuidesCount} Guides`,
    },
    {
      id: "archive-resource",
      label: "Archive Resource",
      icon: <Archive className="h-4 w-4" />,
      badge: "Lifecycle",
    },
  ];

  // ================= State for Add Exercise =================
  const [exerciseForm, setExerciseForm] = useState({
    title: "",
    category: "Reading Fluency",
    duration: "10 mins",
    difficulty: "Beginner" as InstitutionalExercise["difficulty"],
    description: "",
    instructions: "",
    tags: "dyslexia, reading",
  });

  const handleAddExerciseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exerciseForm.title.trim() || !exerciseForm.description.trim()) {
      toast.error("Please fill in the title and description.");
      return;
    }

    addExercise({
      title: exerciseForm.title.trim(),
      category: exerciseForm.category,
      duration: exerciseForm.duration,
      difficulty: exerciseForm.difficulty,
      description: exerciseForm.description.trim(),
      instructions: exerciseForm.instructions
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      tags: exerciseForm.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    });

    toast.success(`Exercise "${exerciseForm.title}" published! Content Library updated.`);
    setExerciseForm({
      title: "",
      category: "Reading Fluency",
      duration: "10 mins",
      difficulty: "Beginner",
      description: "",
      instructions: "",
      tags: "dyslexia, reading",
    });
  };

  // ================= State for Update Contact =================
  const [selectedContactId, setSelectedContactId] = useState<string>(
    contacts[0]?.id || "contact-1"
  );
  const activeContact =
    contacts.find((c) => c.id === selectedContactId) || contacts[0];

  const [contactForm, setContactForm] = useState<InstitutionalContact>(
    activeContact || {
      id: "contact-1",
      campus: "Steve Biko Campus",
      name: "Disability Rights Centre",
      role: "Coordinator",
      email: "disability@dut.ac.za",
      phone: "+27 31 373 2555",
      building: "Gate 1, Library Complex",
      office: "Room 102",
      operatingHours: "08:00 - 16:30",
      services: ["Screening", "Accommodations"],
      archived: false,
    }
  );

  React.useEffect(() => {
    if (activeContact) {
      setContactForm(activeContact);
    }
  }, [activeContact]);

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    updateContact(contactForm);
    toast.success(`Campus profile for ${contactForm.campus} updated successfully!`);
  };

  // ================= State for Publish Guide =================
  const [guideForm, setGuideForm] = useState({
    title: "",
    category: "Exam Accommodations",
    summary: "",
    content: "",
    downloadUrl: "/documents/accommodations-guide-2026.pdf",
  });

  const handlePublishGuideSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guideForm.title.trim() || !guideForm.summary.trim()) {
      toast.error("Please provide guide title and summary.");
      return;
    }

    addSupportGuide({
      title: guideForm.title.trim(),
      category: guideForm.category,
      summary: guideForm.summary.trim(),
      content: guideForm.content.trim() || guideForm.summary.trim(),
      downloadUrl: guideForm.downloadUrl,
    });

    toast.success(`Guide "${guideForm.title}" published! Content Library updated.`);
    setGuideForm({
      title: "",
      category: "Exam Accommodations",
      summary: "",
      content: "",
      downloadUrl: "/documents/accommodations-guide-2026.pdf",
    });
  };

  // ================= State for Archive Resource =================
  const [archiveFilter, setArchiveFilter] = useState<"all" | "exercises" | "guides" | "contacts">(
    "all"
  );
  const [archiveStatusFilter, setArchiveStatusFilter] = useState<"all" | "active" | "archived">(
    "all"
  );

  return (
    <div className="space-y-6">
      {/* Horizontal Sub-Tabs Bar — Exactly Matching Reference Screenshot */}
      <div className="flex overflow-x-auto no-scrollbar gap-1.5 pt-1 pb-2 border-b border-border/70">
        {subTabs.map((tab) => {
          const isActive = activeSubtab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleSelectSubtab(tab.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm font-semibold"
                  : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                    isActive ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Sub-Tab 1: Add Exercise Routine */}
      {activeSubtab === "add-exercise" && (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-border/60 pb-4">
              <h2 className="font-serif text-2xl font-normal text-foreground">
                Author Assistive Study Tool Routine
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Published routines are immediately surfaced in the Student Learning Hub under Study
                Tools &amp; Exercises.
              </p>
            </div>

            <form onSubmit={handleAddExerciseSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="ex-title" className="text-xs font-medium">
                    Exercise Routine Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="ex-title"
                    placeholder="e.g. Color-Coded Phonemic Syllable Mapping"
                    value={exerciseForm.title}
                    onChange={(e) =>
                      setExerciseForm({ ...exerciseForm, title: e.target.value })
                    }
                    className="rounded-xl h-10 text-xs"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="ex-cat" className="text-xs font-medium">
                    Target Learning Domain
                  </Label>
                  <select
                    id="ex-cat"
                    value={exerciseForm.category}
                    onChange={(e) =>
                      setExerciseForm({ ...exerciseForm, category: e.target.value })
                    }
                    className="w-full h-10 px-3 rounded-xl border border-input bg-background text-xs text-foreground focus:outline-none"
                  >
                    <option value="Reading Fluency">Reading Fluency (Dyslexia)</option>
                    <option value="Focus & Executive">Focus &amp; Executive Function (ADHD)</option>
                    <option value="Numerical Reasoning">Numerical Reasoning (Dyscalculia)</option>
                    <option value="Motor Writing">Orthographic Writing (Dysgraphia)</option>
                    <option value="Cognitive Processing">Cognitive Processing Speed</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="ex-dur" className="text-xs font-medium">
                    Estimated Duration
                  </Label>
                  <Input
                    id="ex-dur"
                    placeholder="e.g. 10 mins"
                    value={exerciseForm.duration}
                    onChange={(e) =>
                      setExerciseForm({ ...exerciseForm, duration: e.target.value })
                    }
                    className="rounded-xl h-10 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="ex-diff" className="text-xs font-medium">
                    Difficulty Tier
                  </Label>
                  <select
                    id="ex-diff"
                    value={exerciseForm.difficulty}
                    onChange={(e) =>
                      setExerciseForm({
                        ...exerciseForm,
                        difficulty: e.target.value as InstitutionalExercise["difficulty"],
                      })
                    }
                    className="w-full h-10 px-3 rounded-xl border border-input bg-background text-xs text-foreground focus:outline-none"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="ex-desc" className="text-xs font-medium">
                  Objective Summary <span className="text-destructive">*</span>
                </Label>
                <textarea
                  id="ex-desc"
                  rows={2}
                  placeholder="Short pedagogical explanation of how this exercise supports the student..."
                  value={exerciseForm.description}
                  onChange={(e) =>
                    setExerciseForm({ ...exerciseForm, description: e.target.value })
                  }
                  className="w-full p-3 rounded-xl border border-input bg-background text-xs text-foreground focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="ex-inst" className="text-xs font-medium">
                  Step-by-Step Instructions (One per line)
                </Label>
                <textarea
                  id="ex-inst"
                  rows={3}
                  placeholder="Step 1: Highlight difficult terms&#10;Step 2: Break into syllables&#10;Step 3: Read aloud with rhythm"
                  value={exerciseForm.instructions}
                  onChange={(e) =>
                    setExerciseForm({ ...exerciseForm, instructions: e.target.value })
                  }
                  className="w-full p-3 rounded-xl border border-input bg-background text-xs text-foreground focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="ex-tags" className="text-xs font-medium">
                  Assistive Tags (comma-separated)
                </Label>
                <Input
                  id="ex-tags"
                  placeholder="e.g. dyslexia, phonics, color-coding"
                  value={exerciseForm.tags}
                  onChange={(e) =>
                    setExerciseForm({ ...exerciseForm, tags: e.target.value })
                  }
                  className="rounded-xl h-10 text-xs"
                />
              </div>

              <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Increments Content Library count instantly</span>
                </div>

                <Button
                  type="submit"
                  className="rounded-xl text-xs bg-primary text-primary-foreground h-10 px-6 gap-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Publish Routine</span>
                </Button>
              </div>
            </form>
          </div>

          {/* Current Active Exercises */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="font-serif text-lg font-normal text-foreground">
                Current Exercise Library
              </h3>
              <Badge variant="outline" className="font-mono text-xs">
                {activeExercisesCount} Active
              </Badge>
            </div>

            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {exercises
                .filter((e) => !e.archived)
                .map((ex) => (
                  <div
                    key={ex.id}
                    className="p-3 rounded-2xl bg-muted/30 border border-border/60 space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">{ex.title}</span>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {ex.duration}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground line-clamp-2">
                      {ex.description}
                    </p>
                    <div className="flex items-center justify-between pt-1">
                      <Badge variant="secondary" className="text-[10px] font-mono">
                        {ex.category}
                      </Badge>
                      <button
                        onClick={() => {
                          toggleArchiveExercise(ex.id);
                          toast.info(`Exercise "${ex.title}" archived.`);
                        }}
                        className="text-[11px] text-muted-foreground hover:text-destructive"
                      >
                        Archive
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Update Contact Info (Campus Directory) */}
      {activeSubtab === "update-contact" && (
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Campus Selector and Form */}
          <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-border/60 pb-4">
              <h2 className="font-serif text-2xl font-normal text-foreground">
                DUT Disability Unit Campus Directory
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Maintain physical location details, specialist contact numbers, and appointment
                booking hours across all DUT campuses.
              </p>
            </div>

            {/* Campus Selector Pills */}
            <div className="flex flex-wrap gap-2">
              {contacts.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedContactId(c.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    selectedContactId === c.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {c.campus}
                </button>
              ))}
            </div>

            <form onSubmit={handleSaveContact} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="contact-campus" className="text-xs font-medium">
                    Campus Name
                  </Label>
                  <Input
                    id="contact-campus"
                    value={contactForm.campus}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, campus: e.target.value })
                    }
                    className="rounded-xl h-10 text-xs"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="contact-name" className="text-xs font-medium">
                    Lead Coordinator / Centre Name
                  </Label>
                  <Input
                    id="contact-name"
                    value={contactForm.name}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, name: e.target.value })
                    }
                    className="rounded-xl h-10 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="contact-email" className="text-xs font-medium">
                    Official Support Email
                  </Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={contactForm.email}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, email: e.target.value })
                    }
                    className="rounded-xl h-10 text-xs"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="contact-phone" className="text-xs font-medium">
                    Direct Telephone
                  </Label>
                  <Input
                    id="contact-phone"
                    value={contactForm.phone}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, phone: e.target.value })
                    }
                    className="rounded-xl h-10 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="contact-bld" className="text-xs font-medium">
                    Building / Complex
                  </Label>
                  <Input
                    id="contact-bld"
                    value={contactForm.building}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, building: e.target.value })
                    }
                    className="rounded-xl h-10 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="contact-office" className="text-xs font-medium">
                    Room / Office Number
                  </Label>
                  <Input
                    id="contact-office"
                    value={contactForm.office}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, office: e.target.value })
                    }
                    className="rounded-xl h-10 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="contact-hours" className="text-xs font-medium">
                  Operational Consultation Hours
                </Label>
                <Input
                  id="contact-hours"
                  value={contactForm.operatingHours}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, operatingHours: e.target.value })
                  }
                  className="rounded-xl h-10 text-xs"
                />
              </div>

              <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                <div className="text-[11px] text-muted-foreground">
                  Updates propagate live to the Student Support &amp; Bookings directory.
                </div>

                <Button
                  type="submit"
                  className="rounded-xl text-xs bg-primary text-primary-foreground h-10 px-6 gap-2"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Update Campus Contact</span>
                </Button>
              </div>
            </form>
          </div>

          {/* Student Portal Card Preview */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <Building className="h-5 w-5" />
                <h3 className="font-serif text-lg font-normal text-foreground">
                  Student View Preview
                </h3>
              </div>

              <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-3">
                <div>
                  <span className="text-[10px] font-mono text-primary font-semibold uppercase">
                    {contactForm.campus}
                  </span>
                  <h4 className="font-serif text-lg font-medium text-foreground">
                    {contactForm.name}
                  </h4>
                  <p className="text-xs text-muted-foreground">{contactForm.role}</p>
                </div>

                <div className="space-y-1.5 text-xs text-muted-foreground pt-2 border-t border-border/60">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-primary" />
                    <span className="font-mono text-[11px] text-foreground">
                      {contactForm.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-primary" />
                    <span className="font-mono text-[11px] text-foreground">
                      {contactForm.phone}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    <span>
                      {contactForm.building}, {contactForm.office}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{contactForm.operatingHours}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 3: Publish Guide */}
      {activeSubtab === "publish-guide" && (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-border/60 pb-4">
              <h2 className="font-serif text-2xl font-normal text-foreground">
                Publish Institutional Accommodations Guide
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Publish formal policy documents, extra time concessions, and assistive technology
                guides for students and faculty.
              </p>
            </div>

            <form onSubmit={handlePublishGuideSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="guide-title" className="text-xs font-medium">
                    Guide Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="guide-title"
                    placeholder="e.g. Extra Time Examination Concessions Guidelines 2026"
                    value={guideForm.title}
                    onChange={(e) =>
                      setGuideForm({ ...guideForm, title: e.target.value })
                    }
                    className="rounded-xl h-10 text-xs"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="guide-cat" className="text-xs font-medium">
                    Target Accommodations Category
                  </Label>
                  <select
                    id="guide-cat"
                    value={guideForm.category}
                    onChange={(e) =>
                      setGuideForm({ ...guideForm, category: e.target.value })
                    }
                    className="w-full h-10 px-3 rounded-xl border border-input bg-background text-xs text-foreground focus:outline-none"
                  >
                    <option value="Exam Accommodations">Exam Concessions &amp; Extra Time</option>
                    <option value="Assistive Hardware">Assistive Technology &amp; Hardware</option>
                    <option value="Classroom Adjustments">Lecture Recording &amp; Note-Taking</option>
                    <option value="Faculty Guidelines">Lecturer &amp; Faculty Guidelines</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="guide-summary" className="text-xs font-medium">
                  Executive Policy Summary <span className="text-destructive">*</span>
                </Label>
                <textarea
                  id="guide-summary"
                  rows={2}
                  placeholder="Summary of eligibility criteria, turnaround times, and required documentation..."
                  value={guideForm.summary}
                  onChange={(e) =>
                    setGuideForm({ ...guideForm, summary: e.target.value })
                  }
                  className="w-full p-3 rounded-xl border border-input bg-background text-xs text-foreground focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="guide-body" className="text-xs font-medium">
                  Detailed Procedural Content
                </Label>
                <textarea
                  id="guide-body"
                  rows={4}
                  placeholder="Full text of steps, institutional submission deadlines, and appeals process..."
                  value={guideForm.content}
                  onChange={(e) =>
                    setGuideForm({ ...guideForm, content: e.target.value })
                  }
                  className="w-full p-3 rounded-xl border border-input bg-background text-xs text-foreground focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="guide-url" className="text-xs font-medium">
                  Institutional PDF Attachment Link
                </Label>
                <Input
                  id="guide-url"
                  placeholder="/documents/extra-time-policy-2026.pdf"
                  value={guideForm.downloadUrl}
                  onChange={(e) =>
                    setGuideForm({ ...guideForm, downloadUrl: e.target.value })
                  }
                  className="rounded-xl h-10 text-xs font-mono"
                />
              </div>

              <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Instantly increments Content Library count</span>
                </div>

                <Button
                  type="submit"
                  className="rounded-xl text-xs bg-primary text-primary-foreground h-10 px-6 gap-2"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Publish Institutional Guide</span>
                </Button>
              </div>
            </form>
          </div>

          {/* Published Guides List */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="font-serif text-lg font-normal text-foreground">
                Published Guides
              </h3>
              <Badge variant="outline" className="font-mono text-xs">
                {activeGuidesCount} Active
              </Badge>
            </div>

            <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
              {supportInfo
                .filter((s) => !s.archived)
                .map((g) => (
                  <div
                    key={g.id}
                    className="p-3 rounded-2xl bg-muted/40 border border-border/60 space-y-1 text-xs"
                  >
                    <div className="font-medium text-foreground">{g.title}</div>
                    <p className="text-[11px] text-muted-foreground line-clamp-2">
                      {g.summary}
                    </p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] font-mono text-primary">{g.category}</span>
                      <button
                        onClick={() => {
                          toggleArchiveGuide(g.id);
                          toast.info(`Guide "${g.title}" archived.`);
                        }}
                        className="text-[11px] text-muted-foreground hover:text-destructive"
                      >
                        Archive
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 4: Archive Resource (Lifecycle Manager) */}
      {activeSubtab === "archive-resource" && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
              <div>
                <h2 className="font-serif text-2xl font-normal text-foreground">
                  Master Resource Lifecycle &amp; Archiving
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Archiving removes a resource from the student and support portal immediately and
                  decrements the Content Library metric. Items can be restored at any time.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={archiveFilter}
                  onChange={(e) =>
                    setArchiveFilter(
                      e.target.value as "all" | "exercises" | "guides" | "contacts"
                    )
                  }
                  className="h-9 px-3 rounded-xl border border-input bg-background text-xs text-foreground font-medium"
                >
                  <option value="all">All Types</option>
                  <option value="exercises">Exercises Only</option>
                  <option value="guides">Guides Only</option>
                  <option value="contacts">Contacts Only</option>
                </select>

                <select
                  value={archiveStatusFilter}
                  onChange={(e) =>
                    setArchiveStatusFilter(
                      e.target.value as "all" | "active" | "archived"
                    )
                  }
                  className="h-9 px-3 rounded-xl border border-input bg-background text-xs text-foreground font-medium"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active Only</option>
                  <option value="archived">Archived Only</option>
                </select>
              </div>
            </div>

            {/* Combined Resource Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-border text-muted-foreground font-mono">
                    <th className="py-3 px-3 font-medium">Resource Title</th>
                    <th className="py-3 px-3 font-medium">Type</th>
                    <th className="py-3 px-3 font-medium">Category / Detail</th>
                    <th className="py-3 px-3 font-medium">Status</th>
                    <th className="py-3 px-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {/* Exercises */}
                  {(archiveFilter === "all" || archiveFilter === "exercises") &&
                    exercises
                      .filter(
                        (e) =>
                          archiveStatusFilter === "all" ||
                          (archiveStatusFilter === "active" && !e.archived) ||
                          (archiveStatusFilter === "archived" && e.archived)
                      )
                      .map((ex) => (
                        <tr key={ex.id} className="hover:bg-muted/30 transition-colors">
                          <td className="py-3 px-3">
                            <div className="font-medium text-foreground">{ex.title}</div>
                            <div className="text-[11px] text-muted-foreground">{ex.duration}</div>
                          </td>
                          <td className="py-3 px-3">
                            <Badge variant="outline" className="font-mono text-[10px]">
                              Exercise
                            </Badge>
                          </td>
                          <td className="py-3 px-3 text-muted-foreground">{ex.category}</td>
                          <td className="py-3 px-3">
                            <span
                              className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full ${
                                !ex.archived
                                  ? "bg-emerald-500/10 text-emerald-600"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {!ex.archived ? "Active" : "Archived"}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <Button
                              size="sm"
                              variant={ex.archived ? "default" : "outline"}
                              onClick={() => {
                                toggleArchiveExercise(ex.id);
                                toast.success(
                                  `Exercise "${ex.title}" ${
                                    ex.archived ? "restored" : "archived"
                                  }. Content Library recalculated.`
                                );
                              }}
                              className="rounded-xl text-xs h-8 px-3"
                            >
                              {ex.archived ? "Restore" : "Archive"}
                            </Button>
                          </td>
                        </tr>
                      ))}

                  {/* Guides */}
                  {(archiveFilter === "all" || archiveFilter === "guides") &&
                    supportInfo
                      .filter(
                        (g) =>
                          archiveStatusFilter === "all" ||
                          (archiveStatusFilter === "active" && !g.archived) ||
                          (archiveStatusFilter === "archived" && g.archived)
                      )
                      .map((g) => (
                        <tr key={g.id} className="hover:bg-muted/30 transition-colors">
                          <td className="py-3 px-3">
                            <div className="font-medium text-foreground">{g.title}</div>
                            <div className="text-[11px] text-muted-foreground line-clamp-1">
                              {g.summary}
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <Badge variant="outline" className="font-mono text-[10px]">
                              Guide
                            </Badge>
                          </td>
                          <td className="py-3 px-3 text-muted-foreground">{g.category}</td>
                          <td className="py-3 px-3">
                            <span
                              className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full ${
                                !g.archived
                                  ? "bg-emerald-500/10 text-emerald-600"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {!g.archived ? "Active" : "Archived"}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <Button
                              size="sm"
                              variant={g.archived ? "default" : "outline"}
                              onClick={() => {
                                toggleArchiveGuide(g.id);
                                toast.success(
                                  `Guide "${g.title}" ${
                                    g.archived ? "restored" : "archived"
                                  }. Content Library recalculated.`
                                );
                              }}
                              className="rounded-xl text-xs h-8 px-3"
                            >
                              {g.archived ? "Restore" : "Archive"}
                            </Button>
                          </td>
                        </tr>
                      ))}

                  {/* Contacts */}
                  {(archiveFilter === "all" || archiveFilter === "contacts") &&
                    contacts
                      .filter(
                        (c) =>
                          archiveStatusFilter === "all" ||
                          (archiveStatusFilter === "active" && !c.archived) ||
                          (archiveStatusFilter === "archived" && c.archived)
                      )
                      .map((c) => (
                        <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                          <td className="py-3 px-3">
                            <div className="font-medium text-foreground">{c.name}</div>
                            <div className="text-[11px] text-muted-foreground">{c.campus}</div>
                          </td>
                          <td className="py-3 px-3">
                            <Badge variant="outline" className="font-mono text-[10px]">
                              Contact
                            </Badge>
                          </td>
                          <td className="py-3 px-3 text-muted-foreground">{c.email}</td>
                          <td className="py-3 px-3">
                            <span
                              className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full ${
                                !c.archived
                                  ? "bg-emerald-500/10 text-emerald-600"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {!c.archived ? "Active" : "Archived"}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <Button
                              size="sm"
                              variant={c.archived ? "default" : "outline"}
                              onClick={() => {
                                toggleArchiveContact(c.id);
                                toast.success(
                                  `Contact profile "${c.campus}" ${
                                    c.archived ? "restored" : "archived"
                                  }. Content Library recalculated.`
                                );
                              }}
                              className="rounded-xl text-xs h-8 px-3"
                            >
                              {c.archived ? "Restore" : "Archive"}
                            </Button>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
