import React, { useState } from "react";
import {
  User,
  Sliders,
  Sparkles,
  Save,
  RotateCcw,
  CheckCircle,
  Eye,
  Type,
  Volume2,
} from "lucide-react";
import { useStudent } from "../../context/StudentContext";
import { Button } from "../../../../components/ui/button";
import { Switch } from "../../../../components/ui/switch";
import { toast } from "sonner";

export function StudentSettingsTab() {
  const {
    profile,
    updateProfile,
    accessibility,
    updateAccessibility,
    resetAllToDefault,
  } = useStudent();

  const [formData, setFormData] = useState(profile);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="border-b border-border/70 pb-6">
        <span className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
          Preferences &amp; Customization
        </span>
        <h2 className="font-serif text-3xl font-light text-foreground mt-0.5">
          Student Profile &amp; Accessibility Settings
        </h2>
        <p className="text-xs text-muted-foreground font-light mt-1">
          Customize your student academic profile and calibrate system-wide neurodivergent
          accessibility preferences.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Profile Settings Form */}
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center gap-2 border-b border-border/60 pb-3">
            <User className="h-5 w-5 text-primary" />
            <h3 className="font-serif text-xl font-normal text-foreground">
              Student Academic Profile
            </h3>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
                  DUT Student Number
                </label>
                <input
                  type="text"
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Faculty
              </label>
              <input
                type="text"
                value={formData.faculty}
                onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
                className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
                  Degree / Diploma Program
                </label>
                <input
                  type="text"
                  value={formData.program}
                  onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
                  Academic Year
                </label>
                <input
                  type="text"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Registered Campus
              </label>
              <input
                type="text"
                value={formData.campus}
                onChange={(e) => setFormData({ ...formData, campus: e.target.value })}
                className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" size="sm" className="bg-primary text-primary-foreground text-xs gap-1.5 px-5">
                <Save className="h-3.5 w-3.5" />
                <span>Save Profile Changes</span>
              </Button>
            </div>
          </form>
        </div>

        {/* Global Accessibility Settings */}
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-border/60 pb-3">
              <Sliders className="h-5 w-5 text-primary" />
              <h3 className="font-serif text-xl font-normal text-foreground">
                Accessibility Preferences
              </h3>
            </div>

            <div className="space-y-5">
              {/* Dyslexia font toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-foreground">
                    Dyslexia-Friendly Typography
                  </div>
                  <p className="text-xs text-muted-foreground font-light mt-0.5">
                    Increases letter bottom-weighting to mitigate character rotation and reversal
                  </p>
                </div>
                <Switch
                  checked={accessibility.dyslexiaFont}
                  onCheckedChange={(checked) => {
                    updateAccessibility({ dyslexiaFont: checked });
                    toast.success(`Dyslexia typography ${checked ? "enabled" : "disabled"}`);
                  }}
                />
              </div>

              {/* Bionic reading toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-foreground">Bionic Saccade Highlighting</div>
                  <p className="text-xs text-muted-foreground font-light mt-0.5">
                    Emphasizes initial syllables to guide rapid visual fixation
                  </p>
                </div>
                <Switch
                  checked={accessibility.bionicReading}
                  onCheckedChange={(checked) => {
                    updateAccessibility({ bionicReading: checked });
                    toast.success(`Bionic reading ${checked ? "enabled" : "disabled"}`);
                  }}
                />
              </div>

              {/* Sound effects toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-foreground">Audio &amp; Speech Feedback</div>
                  <p className="text-xs text-muted-foreground font-light mt-0.5">
                    Enables interactive audio chimes and questions read-aloud capabilities
                  </p>
                </div>
                <Switch
                  checked={accessibility.soundEffects}
                  onCheckedChange={(checked) => {
                    updateAccessibility({ soundEffects: checked });
                    toast.success(`Audio feedback ${checked ? "enabled" : "disabled"}`);
                  }}
                />
              </div>

              {/* High Contrast toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-foreground">Enhanced UI Contrast</div>
                  <p className="text-xs text-muted-foreground font-light mt-0.5">
                    Enforces solid border delimiters and heightened color ratio
                  </p>
                </div>
                <Switch
                  checked={accessibility.highContrast}
                  onCheckedChange={(checked) => {
                    updateAccessibility({ highContrast: checked });
                    toast.success(`High contrast mode ${checked ? "enabled" : "disabled"}`);
                  }}
                />
              </div>
            </div>
          </div>

          {/* Reset Action */}
          <div className="pt-6 border-t border-border/60 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Restore default DUT student demonstration data:
            </span>
            <Button
              onClick={resetAllToDefault}
              variant="outline"
              size="sm"
              className="text-xs text-rose-600 border-rose-500/30 hover:bg-rose-500/10 gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset State</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
