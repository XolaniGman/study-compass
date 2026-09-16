import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../../../components/ui/dialog";
import { Button } from "../../../../components/ui/button";
import { Label } from "../../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { useInstitutional } from "../../../shared";
import { Download, ShieldCheck, FileSpreadsheet } from "lucide-react";

interface ExportUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExportUserModal({ open, onOpenChange }: ExportUserModalProps) {
  const { totalUsers, exportUserDirectory } = useInstitutional();
  const [format, setFormat] = useState("csv");
  const [scope, setScope] = useState("all");
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      exportUserDirectory();
      setIsExporting(false);
      onOpenChange(false);
    }, 400);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-3xl p-6 sm:p-8">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-wider font-semibold">
            <Download className="h-4 w-4" />
            <span>Simulated Directory Export</span>
          </div>
          <DialogTitle className="font-serif text-2xl font-normal text-foreground mt-1">
            Export User Directory
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground font-light">
            Generate an encrypted export snapshot of enrolled students, specialists, and access
            privileges. Compliant with POPIA Section 14 anonymisation.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Export File Format</Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger className="rounded-xl text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                <SelectItem value="csv">Comma-Separated Values (.csv)</SelectItem>
                <SelectItem value="json">Encrypted JSON Schema (.json)</SelectItem>
                <SelectItem value="audit-pdf">Institutional Audit Dossier (.pdf)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Cohort Scope</Label>
            <Select value={scope} onValueChange={setScope}>
              <SelectTrigger className="rounded-xl text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                <SelectItem value="all">All Enrolled Accounts ({totalUsers} records)</SelectItem>
                <SelectItem value="active-only">Active Only (Excludes Inactive)</SelectItem>
                <SelectItem value="staff-only">Staff Specialists &amp; Administrators Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-2xl bg-muted/30 border border-border/70 p-4 space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2 text-emerald-600 font-medium">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>DUT Data Protection &amp; POPIA Compliance Enabled</span>
            </div>
            <p className="font-light text-[11px] leading-relaxed">
              Export simulation applies cryptographic token masking to personal identifiers, contact
              telephone records, and residential addresses.
            </p>
          </div>
        </div>

        <DialogFooter className="pt-3 gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="rounded-xl text-xs"
          >
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            disabled={isExporting}
            size="sm"
            className="bg-primary text-primary-foreground rounded-xl text-xs px-4 shadow-sm gap-1.5"
          >
            <FileSpreadsheet className="h-3.5 w-3.5" />
            <span>{isExporting ? "Generating Snapshot..." : "Generate Export"}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
