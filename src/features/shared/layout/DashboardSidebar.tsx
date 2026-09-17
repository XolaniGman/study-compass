import React, { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  GraduationCap,
  Sparkles,
  LayoutDashboard,
  ClipboardList,
  FileBarChart2,
  Dumbbell,
  Users,
  Flag,
  CalendarCheck,
  ShieldCheck,
  FolderKanban,
  Sliders,
  ExternalLink,
  Bot,
  Trophy,
  Settings,
  Database,
} from "lucide-react";
import { RoleSwitcher } from "./RoleSwitcher";
import { AiAssistantModal } from "../components/AiAssistantModal";
import type { NavGroup, RoleType } from "./types";
import { useSupport } from "../../support";
import { useInstitutional } from "../context/InstitutionalContext";

interface DashboardSidebarProps {
  onCloseMobile?: () => void;
}

export function DashboardSidebar({ onCloseMobile }: DashboardSidebarProps) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const currentSearch = routerState.location.search as Record<string, string | undefined>;
  const activeTab = currentSearch["tab"] || "overview";

  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const { students, flaggedStudents, pendingReferrals } = useSupport();
  const { totalUsers, activeModules, contentLibrary } = useInstitutional();

  const currentRole: RoleType = currentPath.startsWith("/support")
    ? "support"
    : currentPath.startsWith("/admin")
    ? "admin"
    : "student";

  const studentNavGroups: NavGroup[] = [
    {
      groupTitle: "Student Learning Hub",
      items: [
        {
          id: "student-overview",
          label: "Dashboard Overview",
          to: "/student",
          search: { tab: "overview" },
          icon: <LayoutDashboard className="h-4 w-4" />,
        },
        {
          id: "student-quizzes",
          label: "Online Quizzes & Tests",
          to: "/student",
          search: { tab: "quizzes" },
          icon: <Trophy className="h-4 w-4" />,
          badge: "5 Online",
          badgeVariant: "accent",
        },
        {
          id: "student-assessments",
          label: "Screening Batteries",
          to: "/student",
          search: { tab: "assessments" },
          icon: <ClipboardList className="h-4 w-4" />,
          badge: "4 Ready",
          badgeVariant: "primary",
        },
        {
          id: "student-results",
          label: "My Indicator Results",
          to: "/student",
          search: { tab: "results" },
          icon: <FileBarChart2 className="h-4 w-4" />,
          badge: "Evaluated",
        },
        {
          id: "student-exercises",
          label: "Study Tools & Exercises",
          to: "/student",
          search: { tab: "exercises" },
          icon: <Dumbbell className="h-4 w-4" />,
          badge: "5 Tools",
        },
        {
          id: "student-support",
          label: "DUT Support & Bookings",
          to: "/student",
          search: { tab: "support" },
          icon: <Users className="h-4 w-4" />,
        },
        {
          id: "student-settings",
          label: "Profile & Accessibility",
          to: "/student",
          search: { tab: "settings" },
          icon: <Settings className="h-4 w-4" />,
        },
      ],
    },
    {
      groupTitle: "DUT Support Services",
      items: [
        {
          id: "support-portal",
          label: "Disability Unit Portal",
          to: "/support",
          icon: <Users className="h-4 w-4" />,
        },
        {
          id: "admin-portal",
          label: "System Admin Panel",
          to: "/admin",
          icon: <ShieldCheck className="h-4 w-4" />,
        },
      ],
    },
  ];

  const supportNavGroups: NavGroup[] = [
    {
      groupTitle: "Disability Unit Triage",
      items: [
        {
          id: "support-overview",
          label: "Staff Dashboard",
          to: "/support",
          search: { tab: "dashboard" },
          icon: <LayoutDashboard className="h-4 w-4" />,
        },
        {
          id: "student-queue",
          label: "Student Screening Queue",
          to: "/support",
          search: { tab: "screening" },
          icon: <Users className="h-4 w-4" />,
          badge: `${students.length} Screened`,
          badgeVariant: "secondary",
        },
        {
          id: "flagged-cases",
          label: "Flagged Support Cases",
          to: "/support",
          search: { tab: "flagged" },
          icon: <Flag className="h-4 w-4" />,
          badge: `${flaggedStudents.length} High Priority`,
          badgeVariant: "accent",
        },
        {
          id: "intake-referrals",
          label: "Intake & Referrals",
          to: "/support",
          search: { tab: "intake" },
          icon: <CalendarCheck className="h-4 w-4" />,
          badge: `${pendingReferrals.length} Pending`,
        },
      ],
    },
    {
      groupTitle: "Other Portals",
      items: [
        {
          id: "student-portal",
          label: "Student Portal View",
          to: "/student",
          icon: <GraduationCap className="h-4 w-4" />,
        },
        {
          id: "admin-portal",
          label: "Administrator View",
          to: "/admin",
          icon: <ShieldCheck className="h-4 w-4" />,
        },
      ],
    },
  ];

  const adminNavGroups: NavGroup[] = [
    {
      groupTitle: "Institutional Administration",
      items: [
        {
          id: "admin-overview",
          label: "Dashboard Overview",
          to: "/admin",
          search: { tab: "overview" },
          icon: <LayoutDashboard className="h-4 w-4" />,
        },
        {
          id: "admin-users",
          label: "Users & Permissions",
          to: "/admin",
          search: { tab: "users" },
          icon: <Users className="h-4 w-4" />,
          badge: `${totalUsers} Enrolled`,
        },
        {
          id: "admin-assessments",
          label: "Screening Modules",
          to: "/admin",
          search: { tab: "assessments" },
          icon: <FolderKanban className="h-4 w-4" />,
          badge: `${activeModules} Active`,
        },
        {
          id: "admin-content",
          label: "Exercises & Support",
          to: "/admin",
          search: { tab: "content" },
          icon: <Database className="h-4 w-4" />,
          badge: `${contentLibrary} Items`,
        },
        {
          id: "admin-settings",
          label: "Operations & Backups",
          to: "/admin",
          search: { tab: "maintenance" },
          icon: <Sliders className="h-4 w-4" />,
          badge: "Healthy",
        },
      ],
    },
    {
      groupTitle: "Other Portals",
      items: [
        {
          id: "student-portal",
          label: "Student Portal View",
          to: "/student",
          icon: <GraduationCap className="h-4 w-4" />,
        },
        {
          id: "support-portal",
          label: "Support Staff View",
          to: "/support",
          icon: <Users className="h-4 w-4" />,
        },
      ],
    },
  ];

  const activeNavGroups =
    currentRole === "support"
      ? supportNavGroups
      : currentRole === "admin"
      ? adminNavGroups
      : studentNavGroups;

  const [studentProfile, setStudentProfile] = useState(() => {
    if (typeof window === "undefined") return { name: "Alex Ndlovu", role: "Student (2nd Year)", initials: "AN" };
    try {
      const saved = localStorage.getItem("study_compass_student_state_v3_profile");
      if (saved) {
        const parsed = JSON.parse(saved);
        const name = parsed.name || "Alex Ndlovu";
        const parts = name.trim().split(" ");
        const initials =
          parts.length > 1
            ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
            : name.slice(0, 2).toUpperCase();
        return {
          name,
          role: `Student (${parsed.year || "2nd Year"})`,
          initials,
        };
      }
    } catch {}
    return { name: "Alex Ndlovu", role: "Student (2nd Year)", initials: "AN" };
  });

  React.useEffect(() => {
    const update = () => {
      try {
        const saved = localStorage.getItem("study_compass_student_state_v3_profile");
        if (saved) {
          const parsed = JSON.parse(saved);
          const name = parsed.name || "Alex Ndlovu";
          const parts = name.trim().split(" ");
          const initials =
            parts.length > 1
              ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
              : name.slice(0, 2).toUpperCase();
          setStudentProfile({
            name,
            role: `Student (${parsed.year || "2nd Year"})`,
            initials,
          });
        }
      } catch {}
    };
    window.addEventListener("student-profile-updated", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("student-profile-updated", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  const userProfile =
    currentRole === "support"
      ? {
          name: "Dr. N. Dube",
          role: "Disability Specialist",
          initials: "ND",
        }
      : currentRole === "admin"
      ? {
          name: "Admin Operator",
          role: "System Administrator",
          initials: "AO",
        }
      : studentProfile;

  return (
    <>
      <aside className="flex h-full w-72 flex-col justify-between border-r border-border/70 bg-card/70 backdrop-blur-xl px-4 py-5 select-none overflow-y-auto">
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="flex items-center justify-between px-2">
            <Link
              to="/"
              onClick={onCloseMobile}
              className="flex items-center gap-2.5 group"
            >
              <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-sm shadow-primary/30 transition-transform group-hover:scale-105">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <span className="font-serif text-lg font-medium tracking-tight text-foreground block leading-tight">
                  Study Compass
                </span>
                <span className="text-[10px] tracking-wider uppercase text-muted-foreground font-mono">
                  DUT Screening System
                </span>
              </div>
            </Link>
            <Link
              to="/"
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title="Return to Public Landing Page"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Role Switcher */}
          <div className="px-1">
            <RoleSwitcher />
          </div>

          {/* Navigation Groups */}
          <nav className="space-y-6 px-1">
            {activeNavGroups.map((group) => (
              <div key={group.groupTitle} className="space-y-1.5">
                <div className="px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/80 font-mono">
                  {group.groupTitle}
                </div>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    // Check active state
                    let isActive = false;
                    if (currentRole === "student" && currentPath.startsWith("/student")) {
                      const targetTab = item.search?.["tab"];
                      if (targetTab) {
                        isActive = activeTab === targetTab;
                      } else {
                        isActive = item.to === currentPath && !currentSearch["tab"];
                      }
                    } else if (currentRole === "support" && currentPath.startsWith("/support")) {
                      const targetTab = item.search?.["tab"];
                      const currentSupportTab = currentSearch["tab"] || "dashboard";
                      if (targetTab) {
                        isActive = currentSupportTab === targetTab;
                      } else {
                        isActive = item.to === currentPath && !currentSearch["tab"];
                      }
                    } else if (currentRole === "admin" && currentPath.startsWith("/admin")) {
                      const targetTab = item.search?.["tab"];
                      const currentAdminTab = currentSearch["tab"] || "overview";
                      if (targetTab) {
                        isActive = currentAdminTab === targetTab;
                      } else {
                        isActive = item.to === currentPath && !currentSearch["tab"];
                      }
                    } else {
                      isActive = item.to === currentPath;
                    }

                    return (
                      <Link
                        key={item.id}
                        to={item.to as any}
                        search={item.search as any}
                        onClick={onCloseMobile}
                        className={`group flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all duration-150 ${
                          isActive
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span
                            className={`shrink-0 transition-colors ${
                              isActive
                                ? "text-primary-foreground"
                                : "text-muted-foreground group-hover:text-primary"
                            }`}
                          >
                            {item.icon}
                          </span>
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.badge && (
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono tracking-tight shrink-0 ${
                              isActive
                                ? "bg-white/20 text-white font-semibold"
                                : "bg-muted text-muted-foreground group-hover:bg-accent group-hover:text-accent-foreground"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer: AI Assistant Widget & User Profile */}
        <div className="mt-8 space-y-4 px-1">
          {/* AI Assistant Card with interactive modal launch */}
          <div
            onClick={() => setIsAiModalOpen(true)}
            className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card/50 to-primary/5 p-3.5 shadow-sm cursor-pointer hover:border-primary/40 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-2 text-primary font-medium text-xs">
              <Sparkles className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:scale-110" />
              <span>AI Screening Assistant</span>
            </div>
            <p className="mt-1.5 text-[11px] text-muted-foreground font-light leading-relaxed">
              Screening indicators calibrated for DUT 2026 academic standards.
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsAiModalOpen(true);
              }}
              className="mt-3 w-full flex items-center justify-center gap-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-medium py-2 px-2.5 transition-all shadow-sm cursor-pointer"
            >
              <Bot className="h-3.5 w-3.5" />
              <span>Consult AI Advisor</span>
            </button>
          </div>

          {/* User Profile Bar */}
          <Link
            to="/student"
            search={{ tab: "settings" } as any}
            onClick={onCloseMobile}
            className={`flex items-center justify-between pt-3 border-t border-border/60 p-1.5 rounded-xl transition-colors group cursor-pointer ${
              activeTab === "settings" && currentRole === "student"
                ? "bg-primary/15 border-primary/40"
                : "hover:bg-muted/40"
            }`}
            title="View Student Profile & Settings"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative">
                <div className="h-8 w-8 rounded-full bg-primary/20 text-primary font-semibold text-xs flex items-center justify-center border border-primary/30 group-hover:scale-105 transition-transform">
                  {userProfile.initials}
                </div>
                <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-card" />
              </div>
              <div className="min-w-0 text-left">
                <div className="text-xs font-medium text-foreground truncate">
                  {userProfile.name}
                </div>
                <div className="text-[10px] text-muted-foreground truncate">
                  {userProfile.role}
                </div>
              </div>
            </div>
            <div className="text-[11px] text-muted-foreground group-hover:text-primary p-1 rounded">
              <Settings className="h-3.5 w-3.5" />
            </div>
          </Link>
        </div>
      </aside>

      {/* Interactive Global AI Assistant Modal */}
      <AiAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        initialRole={currentRole}
      />
    </>
  );
}
