import React from "react";
import {
  LayoutDashboard,
  ClipboardList,
  FileBarChart2,
  Dumbbell,
  Users,
  Settings,
  Sparkles,
  Printer,
  ShieldCheck,
  Type,
  Trophy,
} from "lucide-react";
import { useStudent } from "../context/StudentContext";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";

interface StudentHeaderProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export function StudentHeader({ activeTab, onSelectTab }: StudentHeaderProps) {
  const { profile, accessibility, updateAccessibility, setIsReportModalOpen, setIsConsultationModalOpen } =
    useStudent();

  const navTabs = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard className="h-4 w-4" /> },
    {
      id: "quizzes",
      label: "Online Quizzes",
      icon: <Trophy className="h-4 w-4" />,
      badge: "5 Online",
    },
    {
      id: "assessments",
      label: "Screening Batteries",
      icon: <ClipboardList className="h-4 w-4" />,
      badge: "4 Ready",
    },
    {
      id: "results",
      label: "Screening Results",
      icon: <FileBarChart2 className="h-4 w-4" />,
      badge: "Evaluated",
    },
    {
      id: "exercises",
      label: "Study Tools & Exercises",
      icon: <Dumbbell className="h-4 w-4" />,
    },
    {
      id: "support",
      label: "DUT Support & Bookings",
      icon: <Users className="h-4 w-4" />,
    },
    {
      id: "settings",
      label: "Profile & Settings",
      icon: <Settings className="h-4 w-4" />,
    },
  ];

  return (
    <div className="space-y-6 border-b border-border/70 pb-6">
      {/* Student Identity & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary">
              Student Portal
            </span>
            <span className="text-muted-foreground font-mono text-xs">&bull;</span>
            <span className="text-xs text-muted-foreground font-mono">{profile.campus}</span>
          </div>

          <h1 className="mt-1 font-serif text-3xl sm:text-4xl font-light tracking-tight text-foreground">
            Welcome, {profile.name}
          </h1>

          <p className="mt-1 text-xs sm:text-sm text-muted-foreground font-light">
            Student ID: <strong className="font-mono text-foreground font-medium">{profile.studentId}</strong> &bull;{" "}
            {profile.program} &bull; {profile.year}
          </p>
        </div>

        {/* Quick Access Actions & Accessibility Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            type="button"
            variant={accessibility.dyslexiaFont ? "default" : "outline"}
            size="sm"
            onClick={() => updateAccessibility({ dyslexiaFont: !accessibility.dyslexiaFont })}
            className="text-xs rounded-xl gap-1.5 h-9"
            title="Toggle Dyslexia-friendly high-legibility font"
          >
            <Type className="h-3.5 w-3.5" />
            <span>{accessibility.dyslexiaFont ? "Dyslexia Font: ON" : "Dyslexia Font"}</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsReportModalOpen(true)}
            className="text-xs rounded-xl gap-1.5 h-9"
          >
            <Printer className="h-3.5 w-3.5 text-primary" />
            <span>Screening Report</span>
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={() => setIsConsultationModalOpen(true)}
            className="bg-primary text-primary-foreground text-xs rounded-xl gap-1.5 h-9"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Book DUT Advisor</span>
          </Button>
        </div>
      </div>

      {/* Navigation Sub-Tabs Bar */}
      <div className="flex overflow-x-auto no-scrollbar gap-1.5 pt-2">
        {navTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
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
    </div>
  );
}
