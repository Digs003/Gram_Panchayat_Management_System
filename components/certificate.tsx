"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { CalendarIcon, Eye, Plus } from "lucide-react";

// Certificate Interface
export interface Certificate {
  certificate_id: number;
  certificate_type: string;
  issue_date: string; // ISO date string
  validity_period: string; // ISO date string
  citizen_id?: number;
}

export const CERTIFICATE_TYPES = [
  "Birth Certificate",
  "Marriage Certificate",
  "Death Certificate",
  "Citizenship Certificate",
  "Residence Certificate",
  "Tax Clearance Certificate",
];

// View Certificate Dialog Component
interface ViewCertificateDialogProps {
  certificate: Certificate;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewCertificateDialog({
  certificate,
  open,
  onOpenChange,
}: ViewCertificateDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Certificate Details</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 items-center gap-4 border-b pb-2">
            <span className="font-medium text-muted-foreground">
              Certificate ID:
            </span>
            <span>{certificate.certificate_id}</span>
          </div>

          <div className="grid grid-cols-2 items-center gap-4 border-b pb-2">
            <span className="font-medium text-muted-foreground">
              Certificate Type:
            </span>
            <span>{certificate.certificate_type}</span>
          </div>

          <div className="grid grid-cols-2 items-center gap-4 border-b pb-2">
            <span className="font-medium text-muted-foreground">
              Issue Date:
            </span>
            <span>
              {format(new Date(certificate.issue_date), "MMMM d, yyyy")}
            </span>
          </div>

          <div className="grid grid-cols-2 items-center gap-4 border-b pb-2">
            <span className="font-medium text-muted-foreground">
              Valid Until:
            </span>
            <span>
              {format(new Date(certificate.validity_period), "MMMM d, yyyy")}
            </span>
          </div>

          {certificate.citizen_id !== undefined && (
            <div className="grid grid-cols-2 items-center gap-4 border-b pb-2">
              <span className="font-medium text-muted-foreground">
                Citizen ID:
              </span>
              <span>{certificate.citizen_id}</span>
            </div>
          )}

          <div className="grid grid-cols-2 items-center gap-4">
            <span className="font-medium text-muted-foreground">Status:</span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                new Date(certificate.validity_period) > new Date()
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {new Date(certificate.validity_period) > new Date()
                ? "Valid"
                : "Expired"}
            </span>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Add Certificate Dialog Component
interface AddCertificateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableCertificateTypes: string[];
  onAddCertificate: (certificate: Omit<Certificate, "certificate_id">) => void;
}

export function AddCertificateDialog({
  open,
  onOpenChange,
  availableCertificateTypes,
  onAddCertificate,
}: AddCertificateDialogProps) {
  const [certificateType, setCertificateType] = useState<string>("");
  const [issueDate, setIssueDate] = useState<Date | undefined>(new Date());
  const [validityPeriod, setValidityPeriod] = useState<Date | undefined>(
    new Date(new Date().setFullYear(new Date().getFullYear() + 5))
  );
  const [citizenId, setCitizenId] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    // Validate form
    const newErrors: Record<string, string> = {};

    if (!certificateType) {
      newErrors.certificateType = "Certificate type is required";
    }

    if (!issueDate) {
      newErrors.issueDate = "Issue date is required";
    }

    if (!validityPeriod) {
      newErrors.validityPeriod = "Validity period is required";
    } else if (issueDate && validityPeriod < issueDate) {
      newErrors.validityPeriod = "Validity period must be after issue date";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onAddCertificate({
        certificate_type: certificateType,
        issue_date: issueDate!.toISOString(),
        validity_period: validityPeriod!.toISOString(),
        citizen_id: citizenId ? Number.parseInt(citizenId) : undefined,
      });

      // Reset form
      setCertificateType("");
      setIssueDate(new Date());
      setValidityPeriod(
        new Date(new Date().setFullYear(new Date().getFullYear() + 5))
      );
      setCitizenId("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Certificate</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="certificate-type">Certificate Type</Label>
            <Select value={certificateType} onValueChange={setCertificateType}>
              <SelectTrigger id="certificate-type">
                <SelectValue placeholder="Select certificate type" />
              </SelectTrigger>
              <SelectContent>
                {availableCertificateTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.certificateType && (
              <p className="text-sm text-red-500">{errors.certificateType}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="issue-date">Issue Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="issue-date"
                  variant="outline"
                  className={`w-full justify-start text-left font-normal ${
                    !issueDate && "text-muted-foreground"
                  }`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {issueDate ? format(issueDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={issueDate}
                  onSelect={setIssueDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.issueDate && (
              <p className="text-sm text-red-500">{errors.issueDate}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="validity-period">Validity Period</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="validity-period"
                  variant="outline"
                  className={`w-full justify-start text-left font-normal ${
                    !validityPeriod && "text-muted-foreground"
                  }`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {validityPeriod
                    ? format(validityPeriod, "PPP")
                    : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={validityPeriod}
                  onSelect={setValidityPeriod}
                  initialFocus
                  disabled={(date) =>
                    date <
                    new Date(new Date().setDate(new Date().getDate() - 1))
                  }
                />
              </PopoverContent>
            </Popover>
            {errors.validityPeriod && (
              <p className="text-sm text-red-500">{errors.validityPeriod}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="citizen-id">Citizen ID (Optional)</Label>
            <Input
              id="citizen-id"
              type="number"
              value={citizenId}
              onChange={(e) => setCitizenId(e.target.value)}
              placeholder="Enter citizen ID"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add Certificate</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Certificate Table Component
interface CertificateTableProps {
  certificates: Certificate[];
  usermode: boolean;
  onAddCertificate?: (certificate: Omit<Certificate, "certificate_id">) => void;
}

export function CertificateTable({
  certificates,
  usermode,
  onAddCertificate,
}: CertificateTableProps) {
  const [viewCertificate, setViewCertificate] = useState<Certificate | null>(
    null
  );
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Get list of certificate types that are already in use
  const existingTypes = certificates.map((cert) => cert.certificate_type);

  // Available certificate types for adding new certificates
  const availableTypes = CERTIFICATE_TYPES.filter(
    (type) => !existingTypes.includes(type)
  );

  return (
    <Card className="p-6 m-4">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Certificates</h2>
          {usermode && (
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              disabled={availableTypes.length === 0}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Certificate
            </Button>
          )}
        </div>

        {certificates.length === 0 ? (
          <div className="text-center p-6 border rounded-md bg-muted/50">
            <p className="text-muted-foreground">No certificates found</p>
          </div>
        ) : (
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Certificate ID</TableHead>
                  <TableHead>Certificate Type</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Validity Period</TableHead>
                  {!usermode && <TableHead>Citizen ID</TableHead>}
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {certificates.map((certificate) => (
                  <TableRow key={certificate.certificate_id}>
                    <TableCell className="font-medium">
                      {certificate.certificate_id}
                    </TableCell>
                    <TableCell>{certificate.certificate_type}</TableCell>
                    <TableCell>
                      {format(new Date(certificate.issue_date), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      {format(
                        new Date(certificate.validity_period),
                        "MMM d, yyyy"
                      )}
                    </TableCell>
                    {!usermode && (
                      <TableCell>{certificate.citizen_id}</TableCell>
                    )}
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewCertificate(certificate)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {viewCertificate && (
          <ViewCertificateDialog
            certificate={viewCertificate}
            open={!!viewCertificate}
            onOpenChange={(open) => !open && setViewCertificate(null)}
          />
        )}

        {usermode && (
          <AddCertificateDialog
            open={isAddDialogOpen}
            onOpenChange={setIsAddDialogOpen}
            availableCertificateTypes={availableTypes}
            onAddCertificate={(newCertificate) => {
              if (onAddCertificate) {
                onAddCertificate(newCertificate);
                setIsAddDialogOpen(false);
              }
            }}
          />
        )}
      </div>
    </Card>
  );
}
