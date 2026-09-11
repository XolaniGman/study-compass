import { Link } from "@tanstack/react-router";
import type { PortalCardItem } from "../types";

const PORTALS: PortalCardItem[] = [
  {
    id: "student",
    numberRoman: "Portal I",
    title: "Student",
    description:
      "Explore available screening assessments, sample indicators, personalized recommended exercises, and DUT support contacts.",
    route: "/student",
    ctaText: "Enter Student Dashboard",
  },
  {
    id: "support",
    numberRoman: "Portal II",
    title: "DUT Disability Unit / Staff",
    description:
      "Review screened student indicators, flagged support cases, pending referrals, and simulated case management workflows.",
    route: "/support",
    ctaText: "Enter Support Dashboard",
  },
  {
    id: "admin",
    numberRoman: "Portal III",
    title: "System Administrator",
    description:
      "Manage system users, configure screening questionnaires, curate exercise resources, and inspect high-level platform health.",
    route: "/admin",
    ctaText: "Enter Admin Dashboard",
  },
];

export function PortalCards() {
  return (
    <section
      id="roles"
      aria-label="Portal Selection"
      className="py-24 px-6 sm:px-12 lg:px-24 max-w-7xl mx-auto"
    >
      <div className="border-b border-border/80 pb-8 mb-12">
        <p className="text-xs font-semibold tracking-widest uppercase text-primary">
          System Portals
        </p>
        <h2 className="mt-2 font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-foreground">
          Select Your Designated Role
        </h2>
        <p className="mt-3 max-w-2xl text-base text-muted-foreground font-light leading-relaxed">
          Enter the simulated role portal to experience the interface tailored to students,
          disability support officers, and system administration.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {PORTALS.map((portal) => (
          <Link
            key={portal.id}
            to={portal.route}
            className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-8 transition-all duration-300 hover:border-primary/50 hover:shadow-lg"
          >
            <div>
              <span className="text-xs font-mono font-medium tracking-wider text-muted-foreground uppercase">
                {portal.numberRoman}
              </span>
              <h3 className="mt-4 font-serif text-2xl font-normal text-foreground group-hover:text-primary transition-colors">
                {portal.title}
              </h3>
              <p className="mt-4 text-sm text-muted-foreground font-light leading-relaxed">
                {portal.description}
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-border/60 flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wide text-foreground group-hover:text-primary transition-colors">
                {portal.ctaText}
              </span>
              <span className="text-base font-light text-primary transition-transform duration-300 group-hover:translate-x-1">
                &rarr;
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
