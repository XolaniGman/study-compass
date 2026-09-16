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
import { Badge } from "../../../../components/ui/badge";
import { Input } from "../../../../components/ui/input";
import { useInstitutional } from "../../../shared";
import { UserX, Search, AlertCircle } from "lucide-react";

interface DeactivateUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeactivateUserModal({ open, onOpenChange }: DeactivateUserModalProps) {
  const { users, toggleUserStatus, totalUsers } = useInstitutional();
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter((u) => {
    return (
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.studentOrStaffNumber.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl rounded-3xl p-6 sm:p-8 max-h-[85vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-wider font-semibold">
            <UserX className="h-4 w-4" />
            <span>FR03 &bull; Account Status &amp; Enrolment Management</span>
          </div>
          <DialogTitle className="font-serif text-2xl font-normal text-foreground mt-1">
            Deactivate / Reactivate User Account
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground font-light">
            Toggle account active state. Per institutional policy, deactivation suspends user login
            and assessment access while retaining enrolment history — <strong>Total Users</strong> count
            remains unchanged.
          </DialogDescription>
        </DialogHeader>

        {/* Informational banner confirming architectural rule */}
        <div className="rounded-2xl border border-border/80 bg-muted/40 p-3.5 flex items-start gap-3 text-xs text-muted-foreground">
          <AlertCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-medium text-foreground">
              Total Users Enrolment Status: {totalUsers} Accounts
            </span>
            <p className="font-light">
              All enrolled students and staff specialists remain part of institutional metrics
              regardless of operational status.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative pt-1">
          <Search className="absolute left-3 top-3.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search by student name, staff ID, or faculty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs rounded-xl h-9"
          />
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 pt-2 my-2 border-y border-border/60 py-3">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-xs text-muted-foreground font-light">
              No matching enrolled users found.
            </div>
          ) : (
            filteredUsers.slice(0, 30).map((user) => {
              const isActive = user.status === "active";
              return (
                <div
                  key={user.id}
                  className="rounded-2xl border border-border/80 bg-background/50 p-3.5 flex items-center justify-between gap-3 hover:border-primary/40 transition-all text-xs"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground truncate">{user.name}</span>
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-mono ${
                          isActive
                            ? "text-emerald-600 border-emerald-500/30 bg-emerald-500/10"
                            : "text-rose-600 border-rose-500/30 bg-rose-500/10"
                        }`}
                      >
                        {isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>

                    <div className="text-[11px] text-muted-foreground font-light truncate">
                      <span className="font-mono text-foreground font-medium">
                        {user.studentOrStaffNumber}
                      </span>{" "}
                      &bull; {user.role.replace("_", " ")} &bull; {user.facultyOrDepartment}
                    </div>
                  </div>

                  <Button
                    onClick={() => toggleUserStatus(user.id)}
                    variant={isActive ? "outline" : "default"}
                    size="sm"
                    className={`rounded-xl text-xs h-8 shrink-0 ${
                      isActive
                        ? "text-rose-600 hover:text-rose-700 hover:bg-rose-500/10 border-rose-500/20"
                        : "bg-emerald-600 text-white hover:bg-emerald-700"
                    }`}
                  >
                    {isActive ? "Deactivate" : "Reactivate"}
                  </Button>
                </div>
              );
            })
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-1">
          <span className="text-[11px] font-mono text-muted-foreground">
            Showing {Math.min(30, filteredUsers.length)} of {filteredUsers.length} enrolled users
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="rounded-xl text-xs"
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
