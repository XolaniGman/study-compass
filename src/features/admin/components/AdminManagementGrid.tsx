import React from "react";
import {
  UserPlus,
  ShieldCheck,
  UserX,
  Download,
  PlusCircle,
  Sliders,
  Eye,
  Scale,
  Dumbbell,
  MapPin,
  BookOpen,
  Archive,
  ArrowRight,
} from "lucide-react";
import { Button } from "../../../components/ui/button";

interface AdminManagementGridProps {
  onAddUser: () => void;
  onAuditPermissions: () => void;
  onDeactivateAccount: () => void;
  onExportDirectory: () => void;
  onCreateAssessment: () => void;
  onEditIndicators: () => void;
  onPreviewFlow: () => void;
  onSetWeightings: () => void;
  onAddExercise: () => void;
  onUpdateContact: () => void;
  onPublishGuide: () => void;
  onArchiveResource: () => void;
  onOpenModulePage?: (tab: string, subtab?: string) => void;
}

export function AdminManagementGrid({
  onAddUser,
  onAuditPermissions,
  onDeactivateAccount,
  onExportDirectory,
  onCreateAssessment,
  onEditIndicators,
  onPreviewFlow,
  onSetWeightings,
  onAddExercise,
  onUpdateContact,
  onPublishGuide,
  onArchiveResource,
  onOpenModulePage,
}: AdminManagementGridProps) {
  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Module Card 1: Manage Users & Permissions */}
      <section className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6 hover:border-primary/40 transition-all">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-primary font-semibold bg-primary/10 px-2.5 py-0.5 rounded-full">
              FR01 &bull; FR03 Roles
            </span>
            <span className="text-xs font-mono text-muted-foreground">Module 1</span>
          </div>

          <div
            onClick={() => onOpenModulePage && onOpenModulePage("users")}
            className="cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl font-normal text-foreground group-hover:text-primary transition-colors">
                Manage Users &amp; Permissions
              </h2>
              <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-xs text-muted-foreground font-light leading-relaxed mt-1">
              Manage student registrations, support specialist roles, and institutional access
              permissions with strict POPIA compliance.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-border/60 grid grid-cols-2 gap-2.5">
          <Button
            onClick={onAddUser}
            size="sm"
            className="rounded-xl text-xs bg-primary text-primary-foreground h-9 gap-1.5 shadow-sm justify-start px-3"
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span>Add New User</span>
          </Button>

          <Button
            onClick={onAuditPermissions}
            variant="outline"
            size="sm"
            className="rounded-xl text-xs h-9 gap-1.5 justify-start px-3"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            <span>Audit Permissions</span>
          </Button>

          <Button
            onClick={onDeactivateAccount}
            variant="outline"
            size="sm"
            className="rounded-xl text-xs h-9 gap-1.5 justify-start px-3"
          >
            <UserX className="h-3.5 w-3.5 text-amber-600" />
            <span>Deactivate Account</span>
          </Button>

          <Button
            onClick={onExportDirectory}
            variant="outline"
            size="sm"
            className="rounded-xl text-xs h-9 gap-1.5 justify-start px-3"
          >
            <Download className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Export Directory</span>
          </Button>
        </div>
      </section>

      {/* Module Card 2: Manage Screening Modules */}
      <section className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6 hover:border-primary/40 transition-all">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-chart-2 font-semibold bg-chart-2/15 px-2.5 py-0.5 rounded-full">
              FR20 &bull; Screening Engine
            </span>
            <span className="text-xs font-mono text-muted-foreground">Module 2</span>
          </div>

          <div
            onClick={() => onOpenModulePage && onOpenModulePage("assessments")}
            className="cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl font-normal text-foreground group-hover:text-chart-2 transition-colors">
                Manage Screening Modules
              </h2>
              <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-xs text-muted-foreground font-light leading-relaxed mt-1">
              Configure question banks, psychometric indicator thresholds, and weighting formulas
              across the 5 screening domains.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-border/60 grid grid-cols-2 gap-2.5">
          <Button
            onClick={onCreateAssessment}
            size="sm"
            className="rounded-xl text-xs bg-primary text-primary-foreground h-9 gap-1.5 shadow-sm justify-start px-3"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Create Assessment</span>
          </Button>

          <Button
            onClick={onEditIndicators}
            variant="outline"
            size="sm"
            className="rounded-xl text-xs h-9 gap-1.5 justify-start px-3"
          >
            <Sliders className="h-3.5 w-3.5 text-chart-2" />
            <span>Edit Indicators</span>
          </Button>

          <Button
            onClick={onPreviewFlow}
            variant="outline"
            size="sm"
            className="rounded-xl text-xs h-9 gap-1.5 justify-start px-3"
          >
            <Eye className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Preview Flow</span>
          </Button>

          <Button
            onClick={onSetWeightings}
            variant="outline"
            size="sm"
            className="rounded-xl text-xs h-9 gap-1.5 justify-start px-3"
          >
            <Scale className="h-3.5 w-3.5 text-chart-5" />
            <span>Set Weightings</span>
          </Button>
        </div>
      </section>

      {/* Module Card 3: Manage Exercises & Support Resources */}
      <section className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6 hover:border-primary/40 transition-all">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-chart-3 font-semibold bg-chart-3/15 px-2.5 py-0.5 rounded-full">
              FR21 &bull; Content Curating
            </span>
            <span className="text-xs font-mono text-muted-foreground">Module 3</span>
          </div>

          <div
            onClick={() => onOpenModulePage && onOpenModulePage("content")}
            className="cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl font-normal text-foreground group-hover:text-chart-3 transition-colors">
                Manage Exercises &amp; Support
              </h2>
              <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-xs text-muted-foreground font-light leading-relaxed mt-1">
              Curate assistive study tools, institutional accommodations guides, and DUT Disability
              Unit campus directory profiles.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-border/60 grid grid-cols-2 gap-2.5">
          <Button
            onClick={onAddExercise}
            size="sm"
            className="rounded-xl text-xs bg-primary text-primary-foreground h-9 gap-1.5 shadow-sm justify-start px-3"
          >
            <Dumbbell className="h-3.5 w-3.5" />
            <span>Add Exercise</span>
          </Button>

          <Button
            onClick={onUpdateContact}
            variant="outline"
            size="sm"
            className="rounded-xl text-xs h-9 gap-1.5 justify-start px-3"
          >
            <MapPin className="h-3.5 w-3.5 text-primary" />
            <span>Update Contact</span>
          </Button>

          <Button
            onClick={onPublishGuide}
            variant="outline"
            size="sm"
            className="rounded-xl text-xs h-9 gap-1.5 justify-start px-3"
          >
            <BookOpen className="h-3.5 w-3.5 text-chart-2" />
            <span>Publish Guide</span>
          </Button>

          <Button
            onClick={onArchiveResource}
            variant="outline"
            size="sm"
            className="rounded-xl text-xs h-9 gap-1.5 justify-start px-3"
          >
            <Archive className="h-3.5 w-3.5 text-amber-600" />
            <span>Archive Resource</span>
          </Button>
        </div>
      </section>
    </div>
  );
}
