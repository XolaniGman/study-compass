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
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { useInstitutional } from "../../../shared";
import type { UserRole } from "../../../shared";
import { UserPlus, ShieldAlert } from "lucide-react";

interface AddUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddUserModal({ open, onOpenChange }: AddUserModalProps) {
  const { addUser, totalUsers } = useInstitutional();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [idNumber, setIdNumber] = useState("");
  const [department, setDepartment] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError("Please fill in both name and institutional email.");
      return;
    }

    const assignedId =
      idNumber.trim() ||
      (role === "student"
        ? `221${Math.floor(10000 + Math.random() * 90000)}`
        : `DUT-EMP-${Math.floor(4000 + Math.random() * 900)}`);

    const assignedDept =
      department.trim() ||
      (role === "student"
        ? "Faculty of Accounting & Informatics"
        : role === "support_specialist"
        ? "DUT Disability Unit & Care Centre"
        : "Institutional Systems & Administration");

    addUser({
      name: name.trim(),
      email: email.trim(),
      role,
      studentOrStaffNumber: assignedId,
      facultyOrDepartment: assignedDept,
      status: "active",
    });

    // Reset form
    setName("");
    setEmail("");
    setRole("student");
    setIdNumber("");
    setDepartment("");
    setError("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-3xl p-6 sm:p-8">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-wider font-semibold">
            <UserPlus className="h-4 w-4" />
            <span>FR01 &bull; Registration &amp; Enrolment</span>
          </div>
          <DialogTitle className="font-serif text-2xl font-normal text-foreground mt-1">
            Add New Enrolled User
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground font-light">
            Enrol a new student, support specialist, or administrator. This will immediately increment
            the <strong>Total Users</strong> metric count.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-destructive/10 p-3 text-xs text-destructive">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs font-medium">
              Full Name *
            </Label>
            <Input
              id="name"
              placeholder="e.g. Sipho Khumalo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl text-xs"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-medium">
              Institutional Email *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="e.g. sipho.khumalo@dut4life.ac.za"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl text-xs"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">System Role</Label>
              <Select value={role} onValueChange={(val) => setRole(val as UserRole)}>
                <SelectTrigger className="rounded-xl text-xs">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="support_specialist">Support Specialist</SelectItem>
                  <SelectItem value="administrator">System Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="idNumber" className="text-xs font-medium">
                Student / Staff ID
              </Label>
              <Input
                id="idNumber"
                placeholder={role === "student" ? "e.g. 22108492" : "e.g. DUT-EMP-4088"}
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                className="rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="department" className="text-xs font-medium">
              Faculty / Department
            </Label>
            <Input
              id="department"
              placeholder="e.g. Faculty of Accounting & Informatics"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="rounded-xl text-xs"
            />
          </div>

          <div className="rounded-2xl bg-muted/40 p-3 text-[11px] text-muted-foreground font-light flex items-center justify-between">
            <span>Current Total Enrolment:</span>
            <strong className="font-mono text-foreground">{totalUsers} Users</strong>
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
              type="submit"
              size="sm"
              className="bg-primary text-primary-foreground rounded-xl text-xs px-4 shadow-sm"
            >
              Enrol User
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
