import type { AdminProfile } from "../types";

interface AdminHeaderProps {
  profile: AdminProfile;
}

export function AdminHeader({ profile }: AdminHeaderProps) {
  return (
    <div className="border-b border-border/70 pb-6 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <span className="text-xs font-semibold tracking-widest uppercase text-primary">
            Administration Portal
          </span>
          <h1 className="mt-1 font-serif text-3xl sm:text-4xl font-light tracking-tight text-foreground">
            {profile.name}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground font-light">
            {profile.role} &bull; System Core: {profile.systemVersion}
          </p>
        </div>
        <div className="text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-lg border border-border/50 self-start sm:self-auto">
          Simulated Admin View
        </div>
      </div>
    </div>
  );
}
