import React, { useState } from "react";
import {
  UserPlus,
  ShieldCheck,
  UserX,
  Download,
  ArrowLeft,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Shield,
  FileSpreadsheet,
  FileJson,
  Lock,
  UserCheck,
  Building2,
  Mail,
  GraduationCap,
} from "lucide-react";
import { useInstitutional } from "../../../shared/context/InstitutionalContext";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Badge } from "../../../../components/ui/badge";
import { toast } from "sonner";
import type { InstitutionalUser } from "../../../shared/types";

interface UsersManagementPageProps {
  initialSubtab?: string;
  onNavigateToOverview: () => void;
  onSubtabChange?: (subtab: string) => void;
}

export function UsersManagementPage({
  initialSubtab = "add-user",
  onNavigateToOverview,
  onSubtabChange,
}: UsersManagementPageProps) {
  const {
    users,
    addUser,
    toggleUserStatus,
    exportUserDirectory,
    auditLogs,
    totalUsers,
    usersAddedToday,
  } = useInstitutional();

  const [activeSubtab, setActiveSubtab] = useState<string>(initialSubtab);

  // Sync if prop changes
  React.useEffect(() => {
    if (initialSubtab) {
      setActiveSubtab(initialSubtab);
    }
  }, [initialSubtab]);

  const handleSelectSubtab = (id: string) => {
    setActiveSubtab(id);
    if (onSubtabChange) onSubtabChange(id);
  };

  // Add User Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    identifier: "",
    role: "student" as InstitutionalUser["role"],
    campus: "Steve Biko Campus",
    department: "Information Technology",
    accessibilityFlag: false,
    initialNotes: "",
  });

  // Deactivate Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  // Export State
  const [exportCohort, setExportCohort] = useState<string>("all");
  const [exportFormat, setExportFormat] = useState<"csv" | "json">("csv");
  const [anonymizeData, setAnonymizeData] = useState(false);

  // Subtabs configuration matching exact reference UI style
  const subTabs = [
    {
      id: "add-user",
      label: "Add New User",
      icon: <UserPlus className="h-4 w-4" />,
      badge: "+Enrol",
    },
    {
      id: "audit-permissions",
      label: "Audit Permissions",
      icon: <ShieldCheck className="h-4 w-4" />,
      badge: "POPIA Log",
    },
    {
      id: "deactivate-account",
      label: "Deactivate Account",
      icon: <UserX className="h-4 w-4" />,
      badge: `${totalUsers} Total`,
    },
    {
      id: "export-directory",
      label: "Export Directory",
      icon: <Download className="h-4 w-4" />,
      badge: "CSV/JSON",
    },
  ];

  // Handle Form Submit
  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.identifier.trim()) {
      toast.error("Please fill in all mandatory fields (Name, Email, Student/Staff ID).");
      return;
    }

    addUser({
      name: formData.name.trim(),
      email: formData.email.trim(),
      role: formData.role,
      campus: formData.campus,
      department: formData.department,
      identifier: formData.identifier.trim(),
      status: "active",
    });

    toast.success(`User ${formData.name} enrolled successfully! Total users updated.`);
    setFormData({
      name: "",
      email: "",
      identifier: "",
      role: "student",
      campus: "Steve Biko Campus",
      department: "Information Technology",
      accessibilityFlag: false,
      initialNotes: "",
    });
  };

  // Filtered users for Deactivate/Manage accounts
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.identifier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const activeCount = users.filter((u) => u.status === "active").length;
  const inactiveCount = users.filter((u) => u.status === "inactive").length;

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/70">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={onNavigateToOverview}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Overview</span>
            </button>
            <span className="text-muted-foreground/60 text-xs">&bull;</span>
            <span className="text-[11px] font-mono uppercase tracking-wider text-primary font-semibold bg-primary/10 px-2.5 py-0.5 rounded-full">
              FR01 &bull; FR03 Roles &bull; Module 1
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-light tracking-tight text-foreground">
            Manage Users &amp; Permissions
          </h1>

          <p className="mt-1 text-xs sm:text-sm text-muted-foreground font-light max-w-2xl">
            Manage student registrations, support specialist roles, and institutional access
            permissions with strict POPIA compliance.
          </p>
        </div>

        {/* Live Metrics Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl border border-primary/20 bg-primary/5 text-primary text-xs font-mono font-medium">
            Total Users: <strong>{totalUsers}</strong>
          </div>
          <div className="px-3 py-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 text-xs font-mono font-medium">
            +{usersAddedToday} today
          </div>
          <div className="px-3 py-1.5 rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-600 text-xs font-mono font-medium flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5" />
            <span>POPIA S14</span>
          </div>
        </div>
      </div>

      {/* Horizontal Sub-Tabs Bar — Exactly Matching Reference Screenshot */}
      <div className="flex overflow-x-auto no-scrollbar gap-1.5 pt-1 pb-2 border-b border-border/70">
        {subTabs.map((tab) => {
          const isActive = activeSubtab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleSelectSubtab(tab.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm font-semibold"
                  : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                    isActive ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Sub-Tab Content: Add New User */}
      {activeSubtab === "add-user" && (
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Enrolment Form */}
          <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-border/60 pb-4">
              <h2 className="font-serif text-2xl font-normal text-foreground">
                Institutional User Enrolment
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Register a student, support specialist, or institutional administrator into the DUT
                Learning Disability Support Compass.
              </p>
            </div>

            <form onSubmit={handleAddUserSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="fullname" className="text-xs font-medium">
                    Full Legal Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="fullname"
                    placeholder="e.g. Nomvula Dlamini"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="rounded-xl h-10 text-xs"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="identifier" className="text-xs font-medium">
                    DUT Student / Staff ID <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="identifier"
                    placeholder="e.g. 22108942 or DUT-EMP-401"
                    value={formData.identifier}
                    onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                    className="rounded-xl h-10 text-xs font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-medium">
                    DUT Email Address <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="e.g. nomvula.d@dut4life.ac.za"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="rounded-xl h-10 text-xs"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="role" className="text-xs font-medium">
                    Institutional Role &amp; Access Tier
                  </Label>
                  <select
                    id="role"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        role: e.target.value as InstitutionalUser["role"],
                      })
                    }
                    className="w-full h-10 px-3 rounded-xl border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="student">Student (Self-Screening &amp; Exercises)</option>
                    <option value="support_specialist">
                      Support Specialist (Triage &amp; Clinical Queue)
                    </option>
                    <option value="institutional_admin">
                      Institutional Admin (Full Governance &amp; Engines)
                    </option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="campus" className="text-xs font-medium">
                    Campus Location
                  </Label>
                  <select
                    id="campus"
                    value={formData.campus}
                    onChange={(e) => setFormData({ ...formData, campus: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="Steve Biko Campus">Steve Biko Campus (Durban)</option>
                    <option value="ML Sultan Campus">ML Sultan Campus (Durban)</option>
                    <option value="Ritson Campus">Ritson Campus (Durban)</option>
                    <option value="Brickfield Campus">Brickfield Campus (Durban)</option>
                    <option value="Indumiso Campus">Indumiso Campus (PMB)</option>
                    <option value="Riverside Campus">Riverside Campus (PMB)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="dept" className="text-xs font-medium">
                    Department / Academic Faculty
                  </Label>
                  <Input
                    id="dept"
                    placeholder="e.g. Faculty of Accounting & Informatics"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="rounded-xl h-10 text-xs"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-foreground">
                  <input
                    type="checkbox"
                    checked={formData.accessibilityFlag}
                    onChange={(e) =>
                      setFormData({ ...formData, accessibilityFlag: e.target.checked })
                    }
                    className="rounded border-input text-primary focus:ring-primary h-4 w-4"
                  />
                  <span>Flag initial accessibility accommodation requirement (POPIA Section 14)</span>
                </label>
              </div>

              <div className="pt-4 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Updates Total Users count dynamically upon registration</span>
                </div>

                <Button
                  type="submit"
                  className="w-full sm:w-auto rounded-xl text-xs bg-primary text-primary-foreground h-10 px-6 gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Register &amp; Enrol User</span>
                </Button>
              </div>
            </form>
          </div>

          {/* Side Info & Recent Enrolments */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <ShieldCheck className="h-5 w-5" />
                <h3 className="font-serif text-lg font-normal text-foreground">
                  POPIA Compliance Note
                </h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed font-light">
                South African Protection of Personal Information Act (Act 4 of 2013). All student
                special health records and psychometric assessment scores are encrypted at rest with
                role-gated access restricted to authorized DUT Disability Unit specialists.
              </p>
              <div className="p-3 rounded-2xl bg-muted/50 border border-border text-[11px] space-y-1">
                <div className="font-medium text-foreground">Active Roster Count</div>
                <div className="text-muted-foreground">
                  Currently <strong className="font-mono text-foreground">{totalUsers}</strong>{" "}
                  students &amp; personnel registered in the institutional repository.
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-3">
              <h3 className="font-serif text-lg font-normal text-foreground">
                Recently Enrolled
              </h3>
              <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
                {users.slice(0, 5).map((u) => (
                  <div
                    key={u.id}
                    className="p-2.5 rounded-2xl bg-muted/40 border border-border/60 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-medium text-foreground">{u.name}</div>
                      <div className="text-[11px] font-mono text-muted-foreground">
                        {u.identifier} &bull; {u.campus}
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-[10px] font-mono capitalize rounded-md"
                    >
                      {u.role.replace("_", " ")}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab Content: Audit Permissions */}
      {activeSubtab === "audit-permissions" && (
        <div className="space-y-6">
          {/* RBAC Overview Matrix */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-medium text-primary uppercase">
                  Role: Student
                </span>
                <GraduationCap className="h-4 w-4 text-primary" />
              </div>
              <h3 className="font-serif text-xl text-foreground">Self-Screening Scope</h3>
              <ul className="text-xs text-muted-foreground space-y-1.5 font-light">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                  <span>Access self-administered screening batteries</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                  <span>View personal psychometric indicator results</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                  <span>Engage in assistive study tools &amp; routines</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                  <span>Book consultations with DUT Disability Unit</span>
                </li>
              </ul>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-medium text-chart-2 uppercase">
                  Role: Support Staff
                </span>
                <UserCheck className="h-4 w-4 text-chart-2" />
              </div>
              <h3 className="font-serif text-xl text-foreground">Clinical Triage Scope</h3>
              <ul className="text-xs text-muted-foreground space-y-1.5 font-light">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                  <span>Review student screening intake queue</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                  <span>Assess high/moderate risk indicator flags</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                  <span>Assign formal academic accommodations</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                  <span>Manage campus Disability Unit directory</span>
                </li>
              </ul>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-medium text-chart-5 uppercase">
                  Role: Institutional Admin
                </span>
                <Lock className="h-4 w-4 text-chart-5" />
              </div>
              <h3 className="font-serif text-xl text-foreground">System Governance</h3>
              <ul className="text-xs text-muted-foreground space-y-1.5 font-light">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                  <span>Enrol and deactivate user authorizations</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                  <span>Configure screening engine thresholds &amp; weights</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                  <span>Curate study tools &amp; institutional guides</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                  <span>Inspect POPIA audit trail &amp; system backups</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
              <div>
                <h2 className="font-serif text-2xl font-normal text-foreground">
                  Security &amp; Permission Audit Log Trail
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Immutable audit records captured in accordance with POPIA S14 statutory standards.
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={exportUserDirectory}
                className="rounded-xl text-xs gap-1.5 h-9"
              >
                <Download className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Export Audit CSV</span>
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-border text-muted-foreground font-mono">
                    <th className="py-3 px-3 font-medium">Timestamp</th>
                    <th className="py-3 px-3 font-medium">Administrator</th>
                    <th className="py-3 px-3 font-medium">Action</th>
                    <th className="py-3 px-3 font-medium">Target Entity</th>
                    <th className="py-3 px-3 font-medium">IP Address</th>
                    <th className="py-3 px-3 font-medium">POPIA Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-3 font-mono text-muted-foreground">{log.timestamp}</td>
                      <td className="py-3 px-3 font-medium text-foreground">{log.admin}</td>
                      <td className="py-3 px-3">
                        <Badge
                          variant="outline"
                          className="font-mono text-[10px] uppercase rounded-md"
                        >
                          {log.action}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-muted-foreground">{log.target}</td>
                      <td className="py-3 px-3 font-mono text-muted-foreground">{log.ip}</td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-mono text-[11px]">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Compliant</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab Content: Deactivate Account */}
      {activeSubtab === "deactivate-account" && (
        <div className="space-y-6">
          {/* Institutional Preservation Policy Callout */}
          <div className="rounded-3xl border border-amber-500/30 bg-amber-500/10 p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-serif text-lg font-medium text-foreground">
                  Institutional Record Integrity Policy
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                  Deactivating an account suspends login privileges and revokes session tokens
                  immediately. In accordance with university academic regulations, total institutional
                  registration counts (<strong>142</strong>) are preserved for historical audit trails.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="text-center px-3 py-1.5 rounded-xl bg-background border border-border">
                <div className="text-[10px] font-mono text-muted-foreground">Active</div>
                <div className="font-serif text-lg font-medium text-emerald-600">{activeCount}</div>
              </div>
              <div className="text-center px-3 py-1.5 rounded-xl bg-background border border-border">
                <div className="text-[10px] font-mono text-muted-foreground">Deactivated</div>
                <div className="font-serif text-lg font-medium text-amber-600">{inactiveCount}</div>
              </div>
            </div>
          </div>

          {/* Search and User Accounts Table */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by student name, ID, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 rounded-xl h-10 text-xs"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="h-10 px-3 rounded-xl border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="all">All Roles ({users.length})</option>
                  <option value="student">Students</option>
                  <option value="support_specialist">Support Specialists</option>
                  <option value="institutional_admin">Admins</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-border text-muted-foreground font-mono">
                    <th className="py-3 px-3 font-medium">User Profile</th>
                    <th className="py-3 px-3 font-medium">DUT Identifier</th>
                    <th className="py-3 px-3 font-medium">Role</th>
                    <th className="py-3 px-3 font-medium">Campus</th>
                    <th className="py-3 px-3 font-medium">Account Status</th>
                    <th className="py-3 px-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredUsers.map((u) => {
                    const isActive = u.status === "active";
                    return (
                      <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-3">
                          <div className="font-medium text-foreground">{u.name}</div>
                          <div className="text-[11px] text-muted-foreground">{u.email}</div>
                        </td>
                        <td className="py-3 px-3 font-mono text-muted-foreground">
                          {u.identifier}
                        </td>
                        <td className="py-3 px-3">
                          <Badge
                            variant="outline"
                            className="text-[10px] font-mono capitalize rounded-md"
                          >
                            {u.role.replace("_", " ")}
                          </Badge>
                        </td>
                        <td className="py-3 px-3 text-muted-foreground">{u.campus}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium ${
                              isActive
                                ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                                : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                isActive ? "bg-emerald-600" : "bg-amber-600"
                              }`}
                            />
                            {isActive ? "Active" : "Deactivated"}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <Button
                            size="sm"
                            variant={isActive ? "outline" : "default"}
                            onClick={() => {
                              toggleUserStatus(u.id);
                              toast.success(
                                `Account ${u.name} ${isActive ? "deactivated" : "reactivated"}. Total count preserved.`
                              );
                            }}
                            className={`rounded-xl text-xs h-8 px-3 ${
                              isActive
                                ? "text-amber-600 hover:text-amber-700 hover:bg-amber-500/10 border-amber-500/30"
                                : "bg-emerald-600 text-white hover:bg-emerald-700"
                            }`}
                          >
                            {isActive ? "Deactivate" : "Reactivate"}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab Content: Export Directory */}
      {activeSubtab === "export-directory" && (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-border/60 pb-4">
              <h2 className="font-serif text-2xl font-normal text-foreground">
                Institutional Directory Export Suite
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Generate and download verified user directories formatted for university audit,
                Disability Unit intake, or governmental reporting.
              </p>
            </div>

            <div className="space-y-6">
              {/* Cohort Selector */}
              <div className="space-y-2">
                <Label className="text-xs font-medium">Select Cohort to Export</Label>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {[
                    { id: "all", label: "All Enrolled Users", count: totalUsers },
                    {
                      id: "student",
                      label: "Students Only",
                      count: users.filter((u) => u.role === "student").length,
                    },
                    {
                      id: "support_specialist",
                      label: "Support Staff & Clinicians",
                      count: users.filter((u) => u.role === "support_specialist").length,
                    },
                    {
                      id: "active",
                      label: "Active Accounts Only",
                      count: activeCount,
                    },
                  ].map((cohort) => (
                    <button
                      key={cohort.id}
                      type="button"
                      onClick={() => setExportCohort(cohort.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                        exportCohort === cohort.id
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "border-border bg-background hover:bg-muted/40"
                      }`}
                    >
                      <div>
                        <div className="text-xs font-medium text-foreground">{cohort.label}</div>
                        <div className="text-[10px] font-mono text-muted-foreground">
                          {cohort.count} Records Included
                        </div>
                      </div>
                      <div
                        className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                          exportCohort === cohort.id
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-muted-foreground/40"
                        }`}
                      >
                        {exportCohort === cohort.id && (
                          <span className="h-2 w-2 rounded-full bg-white" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Format Selector */}
              <div className="space-y-2">
                <Label className="text-xs font-medium">Export File Format</Label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setExportFormat("csv")}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                      exportFormat === "csv"
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border bg-background hover:bg-muted/40"
                    }`}
                  >
                    <FileSpreadsheet className="h-6 w-6 text-emerald-600 shrink-0" />
                    <div>
                      <div className="text-xs font-medium text-foreground">
                        CSV Spreadsheet (.csv)
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        Ideal for Excel, institutional SIS, and departmental audits.
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setExportFormat("json")}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                      exportFormat === "json"
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border bg-background hover:bg-muted/40"
                    }`}
                  >
                    <FileJson className="h-6 w-6 text-chart-2 shrink-0" />
                    <div>
                      <div className="text-xs font-medium text-foreground">
                        JSON Dataset (.json)
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        Standard machine-readable structured JSON format.
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Anonymization Checkbox */}
              <div className="p-4 rounded-2xl bg-muted/40 border border-border/70 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-foreground">
                  <input
                    type="checkbox"
                    checked={anonymizeData}
                    onChange={(e) => setAnonymizeData(e.target.checked)}
                    className="rounded border-input text-primary focus:ring-primary h-4 w-4"
                  />
                  <span>Apply POPIA Anonymization Mask (Replace names &amp; emails with hash codes)</span>
                </label>
                <p className="text-[11px] text-muted-foreground font-light pl-6">
                  Recommended for institutional research submissions and external academic accreditations.
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                <div className="text-xs text-muted-foreground font-mono">
                  Ready to export:{" "}
                  <strong>
                    {exportCohort === "all"
                      ? totalUsers
                      : users.filter((u) => u.role === exportCohort || u.status === exportCohort)
                          .length}
                  </strong>{" "}
                  rows
                </div>

                <Button
                  onClick={exportUserDirectory}
                  className="rounded-xl text-xs bg-primary text-primary-foreground h-10 px-6 gap-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Generate &amp; Download Directory</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Side Explanatory Card */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <Shield className="h-5 w-5" />
                <h3 className="font-serif text-lg font-normal text-foreground">
                  Statutory Export Security
                </h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed font-light">
                All downloaded extracts carry a cryptographic timestamp signature. In accordance
                with Durban University of Technology Information Governance Policies, exported
                spreadsheets containing student identifiers must be stored in encrypted institutional
                storage.
              </p>
              <div className="p-3.5 rounded-2xl bg-muted/50 border border-border space-y-2 text-xs">
                <div className="font-medium text-foreground">Export Summary:</div>
                <div className="text-[11px] text-muted-foreground font-mono space-y-1">
                  <div>&bull; Total Enrolled: {totalUsers}</div>
                  <div>&bull; Format: {exportFormat.toUpperCase()}</div>
                  <div>&bull; Watermark: POPIA S14 DUT Admin</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
