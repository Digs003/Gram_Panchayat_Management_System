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
import { Card } from "./ui/card";

// Vaccination Record Interface
export interface VaccinationRecord {
  vaccine_id: number;
  vaccine_type: string;
  date_administered: string; // ISO date string
  dose_number: number;
  citizen_aadhar: number;
}

export const VACCINE_TYPES = [
  "COVID-19 (Pfizer)",
  "COVID-19 (Moderna)",
  "COVID-19 (Johnson & Johnson)",
  "Influenza",
  "Hepatitis B",
  "Tetanus",
  "MMR (Measles, Mumps, Rubella)",
  "Polio",
  "HPV",
  "Pneumococcal",
];

// View Vaccination Dialog Component
interface ViewVaccinationDialogProps {
  vaccination: VaccinationRecord;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewVaccinationDialog({
  vaccination,
  open,
  onOpenChange,
}: ViewVaccinationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Vaccination Details</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 items-center gap-4 border-b pb-2">
            <span className="font-medium text-muted-foreground">
              Vaccine ID:
            </span>
            <span>{vaccination.vaccine_id}</span>
          </div>

          <div className="grid grid-cols-2 items-center gap-4 border-b pb-2">
            <span className="font-medium text-muted-foreground">
              Vaccine Type:
            </span>
            <span>{vaccination.vaccine_type}</span>
          </div>

          <div className="grid grid-cols-2 items-center gap-4 border-b pb-2">
            <span className="font-medium text-muted-foreground">
              Date Administered:
            </span>
            <span>
              {format(new Date(vaccination.date_administered), "MMMM d, yyyy")}
            </span>
          </div>

          <div className="grid grid-cols-2 items-center gap-4 border-b pb-2">
            <span className="font-medium text-muted-foreground">
              Dose Number:
            </span>
            <span>{vaccination.dose_number}</span>
          </div>

          <div className="grid grid-cols-2 items-center gap-4 border-b pb-2">
            <span className="font-medium text-muted-foreground">
              Citizen Aadhar:
            </span>
            <span>{vaccination.citizen_aadhar}</span>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Add Vaccination Dialog Component
interface AddVaccinationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddVaccination: (
    vaccination: Omit<VaccinationRecord, "vaccine_id">
  ) => void;
}

export function AddVaccinationDialog({
  open,
  onOpenChange,
  onAddVaccination,
}: AddVaccinationDialogProps) {
  const [vaccineType, setVaccineType] = useState<string>("");
  const [dateAdministered, setDateAdministered] = useState<Date | undefined>(
    new Date()
  );
  const [doseNumber, setDoseNumber] = useState<string>("1");
  const [citizenAadhar, setCitizenAadhar] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    // Validate form
    const newErrors: Record<string, string> = {};

    if (!vaccineType) {
      newErrors.vaccineType = "Vaccine type is required";
    }

    if (!dateAdministered) {
      newErrors.dateAdministered = "Administration date is required";
    }

    if (!doseNumber || isNaN(Number(doseNumber)) || Number(doseNumber) < 1) {
      newErrors.doseNumber = "Valid dose number is required";
    }

    if (!citizenAadhar || !/^\d{12}$/.test(citizenAadhar)) {
      newErrors.citizenAadhar = "Valid 12-digit Citizen Aadhar is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onAddVaccination({
        vaccine_type: vaccineType,
        date_administered: dateAdministered!.toISOString(),
        dose_number: Number(doseNumber),
        citizen_aadhar: Number(citizenAadhar),
      });

      // Reset form
      setVaccineType("");
      setDateAdministered(new Date());
      setDoseNumber("1");
      setCitizenAadhar("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Vaccination Record</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="vaccine-type">Vaccine Type</Label>
            <Select value={vaccineType} onValueChange={setVaccineType}>
              <SelectTrigger id="vaccine-type">
                <SelectValue placeholder="Select vaccine type" />
              </SelectTrigger>
              <SelectContent>
                {VACCINE_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.vaccineType && (
              <p className="text-sm text-red-500">{errors.vaccineType}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="date-administered">Date Administered</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date-administered"
                  variant="outline"
                  className={`w-full justify-start text-left font-normal ${
                    !dateAdministered && "text-muted-foreground"
                  }`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateAdministered
                    ? format(dateAdministered, "PPP")
                    : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dateAdministered}
                  onSelect={setDateAdministered}
                  initialFocus
                  disabled={(date) => date > new Date()}
                />
              </PopoverContent>
            </Popover>
            {errors.dateAdministered && (
              <p className="text-sm text-red-500">{errors.dateAdministered}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="dose-number">Dose Number</Label>
            <Input
              id="dose-number"
              type="number"
              min="1"
              value={doseNumber}
              onChange={(e) => setDoseNumber(e.target.value)}
              placeholder="Enter dose number"
            />
            {errors.doseNumber && (
              <p className="text-sm text-red-500">{errors.doseNumber}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="citizen-id">Citizen Aadhar</Label>
            <Input
              id="citizen-id"
              type="number"
              min="1"
              value={citizenAadhar}
              onChange={(e) => setCitizenAadhar(e.target.value)}
              placeholder="Enter Citizen Aadhar"
            />
            {errors.citizenAadhar && (
              <p className="text-sm text-red-500">{errors.citizenAadhar}</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add Vaccination</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Vaccination Table Component
interface VaccinationTableProps {
  vaccinations: VaccinationRecord[];
  adminMode: boolean;
  onAddVaccination?: (
    vaccination: Omit<VaccinationRecord, "vaccine_id">
  ) => void;
}

export function VaccinationTable({
  vaccinations,
  adminMode,
  onAddVaccination,
}: VaccinationTableProps) {
  const [viewVaccination, setViewVaccination] =
    useState<VaccinationRecord | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <Card className="p-6 m-4">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Vaccination Records</h2>
          {adminMode && (
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Vaccination
            </Button>
          )}
        </div>

        {vaccinations.length === 0 ? (
          <div className="text-center p-6 border rounded-md bg-muted/50">
            <p className="text-muted-foreground">
              No vaccination records found
            </p>
          </div>
        ) : (
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vaccine Type</TableHead>
                  <TableHead>Date Administered</TableHead>
                  <TableHead>Dose Number</TableHead>
                  {adminMode && <TableHead>Citizen Aadhar</TableHead>}
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vaccinations.map((vaccination) => (
                  <TableRow key={vaccination.vaccine_id}>
                    <TableCell>{vaccination.vaccine_type}</TableCell>
                    <TableCell>
                      {format(
                        new Date(vaccination.date_administered),
                        "MMM d, yyyy"
                      )}
                    </TableCell>
                    <TableCell>{vaccination.dose_number}</TableCell>
                    {adminMode && (
                      <TableCell>{vaccination.citizen_aadhar}</TableCell>
                    )}
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewVaccination(vaccination)}
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

        {viewVaccination && (
          <ViewVaccinationDialog
            vaccination={viewVaccination}
            open={!!viewVaccination}
            onOpenChange={(open) => !open && setViewVaccination(null)}
          />
        )}

        {adminMode && onAddVaccination && (
          <AddVaccinationDialog
            open={isAddDialogOpen}
            onOpenChange={setIsAddDialogOpen}
            onAddVaccination={(newVaccination) => {
              onAddVaccination(newVaccination);
              setIsAddDialogOpen(false);
            }}
          />
        )}
      </div>
    </Card>
  );
}
