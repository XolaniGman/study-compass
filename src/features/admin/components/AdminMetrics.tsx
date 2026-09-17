import React from "react";
import { Users2, ShieldCheck, Database, Server } from "lucide-react";
import { useInstitutional } from "../../shared";

interface MetricCardProps {
  icon: React.ReactNode;
  badge: string;
  title: string;
  value: React.ReactNode;
  caption: string;
  /** Tailwind text/border colour classes for the icon and badge accent */
  accentClass: string;
  /** Offsets each card's drift so the four cards show different parts of the image */
  animationDelay: string;
}

function MetricCard({ icon, badge, title, value, caption, accentClass, animationDelay }: MetricCardProps) {
  return (
    <div className="relative group overflow-hidden rounded-2xl border border-border/80 bg-slate-950 shadow-md min-h-[170px] hover:shadow-lg hover:border-primary/50 transition-all">
      {/* Animated background: slow pan + zoom across the tech image */}
      <div
        className="admin-metric-bg absolute inset-0 pointer-events-none"
        style={{ animationDelay }}
        aria-hidden="true"
      />
      {/* Light sweep for a subtle "live" shimmer */}
      <div
        className="admin-metric-sweep absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-cyan-300/10 to-transparent skew-x-12 pointer-events-none"
        style={{ animationDelay }}
        aria-hidden="true"
      />
      {/* Bottom-up scrim keeps text crisp */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20 pointer-events-none" />

      <div className="relative z-10 flex flex-col justify-between h-full p-5">
        <div className="flex items-center justify-between">
          <div
            className={`h-10 w-10 rounded-xl bg-black/60 flex items-center justify-center backdrop-blur-md border border-white/20 shadow-xs ${accentClass}`}
          >
            {icon}
          </div>
          <span
            className={`text-[10px] font-mono font-semibold bg-black/60 border px-2.5 py-0.5 rounded-md backdrop-blur-md shadow-xs ${accentClass}`}
          >
            {badge}
          </span>
        </div>
        <div className="mt-4">
          <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider drop-shadow-xs">
            {title}
          </h3>
          <p className="mt-1 text-3xl font-bold tracking-tight text-white font-mono drop-shadow-sm">
            {value}
          </p>
          <p className="mt-1 text-xs text-slate-300 font-light">{caption}</p>
        </div>
      </div>
    </div>
  );
}

export function AdminMetrics() {
  const { totalUsers, usersAddedToday, activeModules, contentLibrary, systemUptime } =
    useInstitutional();

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {/* Metric 1: Total Users */}
      <MetricCard
        icon={<Users2 className="h-5 w-5" />}
        badge={`+${usersAddedToday} today`}
        title="Total Users"
        value={totalUsers}
        caption="Enrolled students & staff specialists"
        accentClass="text-emerald-300 border-emerald-500/40"
        animationDelay="0s"
      />

      {/* Metric 2: Active Modules */}
      <MetricCard
        icon={<ShieldCheck className="h-5 w-5" />}
        badge="Operational"
        title="Active Modules"
        value={activeModules}
        caption="3 System Modules + 5 Screening Domains"
        accentClass="text-sky-300 border-sky-500/40"
        animationDelay="-7s"
      />

      {/* Metric 3: Content Library */}
      <MetricCard
        icon={<Database className="h-5 w-5" />}
        badge="Curated"
        title="Content Library"
        value={contentLibrary}
        caption="Active exercises, guides & contact profiles"
        accentClass="text-teal-300 border-teal-500/40"
        animationDelay="-14s"
      />

      {/* Metric 4: System Uptime */}
      <MetricCard
        icon={<Server className="h-5 w-5" />}
        badge="Healthy"
        title="System Uptime"
        value={systemUptime}
        caption="DUT Cloud Node • Zero degradation"
        accentClass="text-emerald-300 border-emerald-500/40"
        animationDelay="-21s"
      />
    </div>
  );
}
