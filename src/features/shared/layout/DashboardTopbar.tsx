import { Link } from "@tanstack/react-router";
import {
  Menu,
  Search,
  Bell,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";

interface DashboardTopbarProps {
  onOpenMobileMenu: () => void;
}

export function DashboardTopbar({ onOpenMobileMenu }: DashboardTopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border/70 bg-background/80 px-4 sm:px-6 lg:px-8 backdrop-blur-md">
      {/* Left: Mobile menu button */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="p-2 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Toggle navigation sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Center: Search input */}
      <div className="hidden md:flex items-center max-w-md w-full mx-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search students, assessments, support resources..."
            onClick={() => toast("Simulated search: Type any query to filter records")}
            className="w-full pl-9 pr-12 py-1.5 text-xs rounded-xl border border-border bg-card/60 placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-ring focus:bg-card transition-all"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: Actions, Notifications, Term Pill */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Term indicator */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full border border-border/80 bg-muted/40 text-[11px] text-muted-foreground font-mono">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>2026 S2 &bull; DUT Academic Core</span>
        </div>

        {/* Quick Role switch pills on topbar */}
        <div className="hidden sm:flex items-center gap-1 rounded-xl border border-border/80 bg-muted/30 p-1 text-xs">
          <Link
            to="/student"
            activeProps={{ className: "bg-background text-foreground shadow-sm font-semibold" }}
            className="px-2.5 py-1 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
          >
            Student
          </Link>
          <Link
            to="/support"
            activeProps={{ className: "bg-background text-foreground shadow-sm font-semibold" }}
            className="px-2.5 py-1 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
          >
            Staff
          </Link>
          <Link
            to="/admin"
            activeProps={{ className: "bg-background text-foreground shadow-sm font-semibold" }}
            className="px-2.5 py-1 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
          >
            Admin
          </Link>
        </div>

        {/* Notification Bell */}
        <button
          type="button"
          onClick={() =>
            toast("Notifications: 2 pending screening assessments, 1 new support message from DUT.")
          }
          className="relative p-2 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          title="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
        </button>

        {/* Help tooltip */}
        <button
          type="button"
          onClick={() =>
            toast("Study Compass Help: Contact disability@dut.ac.za for technical support.")
          }
          className="p-2 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors hidden sm:flex"
          title="System Guidelines"
        >
          <HelpCircle className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
