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
import type { InstitutionalContact } from "../../../shared";
import { MapPin, Phone, Mail, Clock, UserCheck } from "lucide-react";

interface UpdateContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpdateContactModal({ open, onOpenChange }: UpdateContactModalProps) {
  const { contacts, updateContact } = useInstitutional();

  const [selectedId, setSelectedId] = useState<string>(contacts[0]?.id || "");
  const selectedContact = contacts.find((c) => c.id === selectedId) || contacts[0];

  const [building, setBuilding] = useState(selectedContact?.building || "");
  const [phone, setPhone] = useState(selectedContact?.phone || "");
  const [email, setEmail] = useState(selectedContact?.email || "");
  const [hours, setHours] = useState(selectedContact?.hours || "");
  const [specialist, setSpecialist] = useState(selectedContact?.specialistInCharge || "");

  // When selection changes
  const handleSelectChange = (id: string) => {
    setSelectedId(id);
    const target = contacts.find((c) => c.id === id);
    if (target) {
      setBuilding(target.building);
      setPhone(target.phone);
      setEmail(target.email);
      setHours(target.hours);
      setSpecialist(target.specialistInCharge);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContact) return;

    updateContact({
      ...selectedContact,
      building: building.trim(),
      phone: phone.trim(),
      email: email.trim(),
      hours: hours.trim(),
      specialistInCharge: specialist.trim(),
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-3xl p-6 sm:p-8">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-wider font-semibold">
            <MapPin className="h-4 w-4" />
            <span>FR17 &bull; Campus Directory Maintenance</span>
          </div>
          <DialogTitle className="font-serif text-2xl font-normal text-foreground mt-1">
            Update Campus Contact Profile
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground font-light">
            Modify Disability Unit contact information, office locations, and operating hours across
            DUT campuses. Updates reflect immediately on student appointment and support views.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Select Campus Contact Profile</Label>
            <Select value={selectedId} onValueChange={handleSelectChange}>
              <SelectTrigger className="rounded-xl text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                {contacts.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.campus} {c.archived ? "(Archived)" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="building" className="text-xs font-medium">
              Building &amp; Room Location
            </Label>
            <Input
              id="building"
              value={building}
              onChange={(e) => setBuilding(e.target.value)}
              className="rounded-xl text-xs"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-xs font-medium">
                Telephone Number
              </Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="rounded-xl text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-medium">
                Official Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl text-xs"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="hours" className="text-xs font-medium">
              Operating Consultation Hours
            </Label>
            <Input
              id="hours"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="rounded-xl text-xs"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="specialist" className="text-xs font-medium">
              Lead Specialist / Officer in Charge
            </Label>
            <Input
              id="specialist"
              value={specialist}
              onChange={(e) => setSpecialist(e.target.value)}
              className="rounded-xl text-xs"
            />
          </div>

          <DialogFooter className="pt-2 gap-2">
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
              Update Contact
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
