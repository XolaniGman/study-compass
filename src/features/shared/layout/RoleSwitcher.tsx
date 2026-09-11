import { Link, useRouterState } from "@tanstack/react-router";
import { GraduationCap, HeartHandshake, Shield, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import type { RoleType } from "./types";

interface RoleOption {
  type: RoleType;
  title: string;
  subtitle: string;
  route: string;
  icon: typeof GraduationCap;
  badge: string;
}

const ROLES: RoleOption[] = [
  {
    type: "student",
    title: "Student Portal",
    subtitle: "Alex Ndlovu (220194821)",
    route: "/student",
    icon: GraduationCap,
    badge: "Student",
  },
  {
    type: "support",
    title: "Disability Unit Staff",
    subtitle: "Dr. N. Dube (Advisor)",
    route: "/support",
    icon: HeartHandshake,
    badge: "DUT Staff",
  },
  {
    type: "admin",
    title: "System Administrator",
    subtitle: "Institutional Admin",
    route: "/admin",
    icon: Shield,
    badge: "Admin",
  },
];

export function RoleSwitcher() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeRole =
    ROLES.find((r) => currentPath.startsWith(r.route)) ?? ROLES[0]!;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const Icon = activeRole.icon;

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-2.5 rounded-xl border border-border/80 bg-card/60 hover:bg-card hover:border-primary/40 transition-all text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-foreground truncate">
                {activeRole.title}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground font-light truncate">
              {activeRole.subtitle}
            </p>
          </div>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform duration-200 shrink-0 ml-2 ${
            isOpen ? "rotate-180 text-primary" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-xl border border-border bg-popover/95 backdrop-blur-md p-1.5 shadow-xl animate-in fade-in-0 zoom-in-95">
          <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Switch Active Role
          </div>
          <div className="space-y-1">
            {ROLES.map((role) => {
              const RoleIcon = role.icon;
              const isSelected = activeRole.type === role.type;
              return (
                <Link
                  key={role.type}
                  to={role.route}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between p-2 rounded-lg text-xs transition-colors ${
                    isSelected
                      ? "bg-primary text-primary-foreground font-medium"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <RoleIcon className="h-4 w-4 shrink-0" />
                    <div className="truncate">
                      <div className="font-medium truncate">{role.title}</div>
                      <div
                        className={`text-[10px] ${
                          isSelected
                            ? "text-primary-foreground/80"
                            : "text-muted-foreground"
                        }`}
                      >
                        {role.subtitle}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {role.badge}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
