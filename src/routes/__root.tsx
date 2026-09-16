import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { GraduationCap } from "lucide-react";
import { DashboardLayout } from "../features/shared";
import { SupportProvider } from "../features/support";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Learning Disability Detector and Classifier System | Study Compass" },
      {
        name: "description",
        content:
          "A screening and support tool that helps university students identify possible learning difficulties early and connects them to appropriate support.",
      },
      { name: "author", content: "DUT" },
      {
        property: "og:title",
        content: "Learning Disability Detector and Classifier System",
      },
      {
        property: "og:description",
        content:
          "A screening and support tool that helps university students identify possible learning difficulties early and connects them to appropriate support.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md transition-colors">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8 lg:px-12">
        <Link to="/" className="flex items-center gap-2.5 text-foreground group">
          <GraduationCap className="h-6 w-6 text-primary transition-transform group-hover:scale-105" aria-hidden="true" />
          <span className="font-serif text-xl font-light tracking-wide text-foreground">
            Study Compass
          </span>
        </Link>
        <nav className="flex items-center gap-1.5 sm:gap-2 text-xs font-medium uppercase tracking-wider">
          <NavLink to="/student">Student</NavLink>
          <NavLink to="/support">Support Staff</NavLink>
          <NavLink to="/admin">Administrator</NavLink>
        </nav>
      </div>
    </header>
  );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      activeProps={{ className: "bg-primary text-primary-foreground font-semibold" }}
      className="rounded-lg px-3.5 py-1.5 text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground"
    >
      {children}
    </Link>
  );
}

function LandingFooter() {
  return (
    <footer className="border-t border-border/60 bg-card py-10">
      <div className="mx-auto max-w-7xl px-6 text-center sm:px-8 lg:px-12">
        <p className="font-serif text-base text-foreground font-light">
          Learning Disability Detector &amp; Classifier System
        </p>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground max-w-xl mx-auto font-light">
          This system provides screening indicators only and does not replace professional
          assessment. Built in collaboration with the Durban University of Technology Disability Unit.
        </p>
      </div>
    </footer>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const routerState = useRouterState();
  const isLanding = routerState.location.pathname === "/";

  return (
    <QueryClientProvider client={queryClient}>
      {isLanding ? (
        <div className="flex min-h-screen flex-col bg-background">
          <LandingHeader />
          <main className="flex-1">
            <Outlet />
          </main>
          <LandingFooter />
        </div>
      ) : (
        <SupportProvider>
          <DashboardLayout>
            <Outlet />
          </DashboardLayout>
        </SupportProvider>
      )}
      <Toaster position="bottom-right" richColors />
    </QueryClientProvider>
  );
}
