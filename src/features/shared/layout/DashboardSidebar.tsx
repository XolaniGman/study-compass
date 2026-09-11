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
} from "lucide-react";
import { toast } from "sonner";
import { RoleSwitcher } from "./RoleSwitcher";
import type { NavGroup, RoleType } from "./types";

interface DashboardSidebarProps {
  onCloseMobile?: () => void;
}

export function DashboardSidebar({ onCloseMobile }: DashboardSidebarProps) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

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
          icon: <LayoutDashboard className="h-4 w-4" />,
        },
        {
          id: "student-assessments",
          label: "Screening Assessments",
          to: "/student",
          icon: <ClipboardList className="h-4 w-4" />,
          badge: "3 Ready",
          badgeVariant: "primary",
        },
        {
          id: "student-results",
          label: "My Indicator Results",
          to: "/student",
          icon: <FileBarChart2 className="h-4 w-4" />,
          badge: "4 Areas",
        },
        {
          id: "student-exercises",
          label: "Recommended Exercises",
          to: "/student",
          icon: <Dumbbell className="h-4 w-4" />,
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
          icon: <LayoutDashboard className="h-4 w-4" />,
        },
        {
          id: "student-queue",
          label: "Student Screening Queue",
          to: "/support",
          icon: <Users className="h-4 w-4" />,
          badge: "128 Screened",
          badgeVariant: "secondary",
        },
        {
          id: "flagged-cases",
          label: "Flagged Support Cases",
          to: "/support",
          icon: <Flag className="h-4 w-4" />,
          badge: "34 High Priority",
          badgeVariant: "accent",
        },
        {
          id: "intake-referrals",
          label: "Intake & Referrals",
          to: "/support",
          icon: <CalendarCheck className="h-4 w-4" />,
          badge: "12 Pending",
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
      groupTitle: "System Operations",
      items: [
        {
          id: "admin-overview",
          label: "Administrator Dashboard",
          to: "/admin",
          icon: <LayoutDashboard className="h-4 w-4" />,
        },
        {
          id: "admin-users",
          label: "Manage Users & Access",
          to: "/admin",
          icon: <Users className="h-4 w-4" />,
          badge: "142 Active",
        },
        {
          id: "admin-assessments",
          label: "Screening Modules",
          to: "/admin",
          icon: <FolderKanban className="h-4 w-4" />,
          badge: "8 Configured",
        },
        {
          id: "admin-settings",
          label: "Operations & Backups",
          to: "/admin",
          icon: <Sliders className="h-4 w-4" />,
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
      : {
          name: "Alex Ndlovu",
          role: "Student (2nd Year)",
          initials: "AN",
        };

  return (
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
                  const isActive =
                    item.to === currentPath ||
                    (item.to !== "/" && currentPath.startsWith(item.to) && item.id.includes(currentRole));

                  return (
                    <Link
                      key={item.id}
                      to={item.to}
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
        {/* Shopeers-inspired AI Assistant Card */}
        <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card/50 to-primary/5 p-3.5 shadow-sm">
          <div className="flex items-center gap-2 text-primary font-medium text-xs">
            <Sparkles className="h-3.5 w-3.5 shrink-0" />
            <span>AI Screening Assistant</span>
          </div>
          <p className="mt-1.5 text-[11px] text-muted-foreground font-light leading-relaxed">
            Screening indicators calibrated for DUT 2026 academic standards.
          </p>
          <button
            type="button"
            onClick={() =>
              toast("AI Assistant: Neurodiversity screening models active and synchronized with DUT Disability Unit.")
            }
            className="mt-3 w-full flex items-center justify-center gap-1.5 rounded-lg bg-primary/15 hover:bg-primary/25 text-primary text-xs font-medium py-1.5 px-2.5 transition-colors"
          >
            <Bot className="h-3.5 w-3.5" />
            <span>Consult Assistant</span>
          </button>
        </div>

        {/* User Profile Bar */}
        <div className="flex items-center justify-between pt-3 border-t border-border/60">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative">
              <div className="h-8 w-8 rounded-full bg-primary/20 text-primary font-semibold text-xs flex items-center justify-center border border-primary/30">
                {userProfile.initials}
              </div>
              <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-card" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-medium text-foreground truncate">
                {userProfile.name}
              </div>
              <div className="text-[10px] text-muted-foreground truncate">
                {userProfile.role}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => toast("Simulated user menu: Alex Ndlovu")}
            className="text-[11px] text-muted-foreground hover:text-foreground p-1 rounded hover:bg-muted"
            title="Profile Settings"
          >
            •••
          </button>
        </div>
      </div>
    </aside>
  );
}
