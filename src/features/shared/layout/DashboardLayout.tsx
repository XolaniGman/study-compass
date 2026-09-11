import { useState, type ReactNode } from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardTopbar } from "./DashboardTopbar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      {/* Desktop Persistent Left Sidebar */}
      <div className="hidden lg:flex shrink-0 h-screen sticky top-0 z-40">
        <DashboardSidebar />
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Slide-in Sidebar */}
          <div className="relative flex w-72 max-w-[85vw] flex-col bg-background shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            <DashboardSidebar onCloseMobile={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        <DashboardTopbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />
        <main className="flex-1 pb-16 pt-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
