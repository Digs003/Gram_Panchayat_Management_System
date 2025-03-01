"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import {
  CalendarIcon,
  Plus,
  Pencil,
  Trash,
  Search,
  ChevronUp,
  ChevronDown,
  ReceiptIndianRupee,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { educationalQualifications as qualifications } from "@/app/signup/citizen/page";

const occupations = [
  { label: "Farmer", value: "farmer" },
  { label: "Agricultural Laborer", value: "agricultural_laborer" },
  { label: "Fisherman", value: "fisherman" },
  { label: "Livestock Raiser", value: "livestock_raiser" },
  { label: "Dairy Farmer", value: "dairy_farmer" },
  { label: "Poultry Farmer", value: "poultry_farmer" },
  { label: "Beekeeper", value: "beekeeper" },
  { label: "Weaver", value: "weaver" },
  { label: "Handloom Worker", value: "handloom_worker" },
  { label: "Carpenter", value: "carpenter" },
  { label: "Blacksmith", value: "blacksmith" },
  { label: "Potter", value: "potter" },
  { label: "Handicraft Artisan", value: "handicraft_artisan" },
  { label: "Mason", value: "mason" },
  { label: "Electrician", value: "electrician" },
  { label: "Plumber", value: "plumber" },
  { label: "Tailor", value: "tailor" },
  { label: "Barber", value: "barber" },
  { label: "Washerman (Dhobi)", value: "washerman" },
  { label: "Cobbler", value: "cobbler" },
  { label: "Rickshaw Puller", value: "rickshaw_puller" },
  { label: "Auto Driver", value: "auto_driver" },
  { label: "Small Shop Owner", value: "small_shop_owner" },
  { label: "Vegetable Vendor", value: "vegetable_vendor" },
  { label: "Street Food Vendor", value: "street_food_vendor" },
  { label: "Self-Employed (Village Business)", value: "self_employed_village" },
  { label: "Daily Wage Worker", value: "daily_wage_worker" },
  { label: "Construction Worker", value: "construction_worker" },
  { label: "Government Employee", value: "government_employee" },
  { label: "Panchayat Staff", value: "panchayat_staff" },
  { label: "ASHA Worker", value: "asha_worker" },
  { label: "Anganwadi Worker", value: "anganwadi_worker" },
  { label: "Teacher", value: "teacher" },
  { label: "Rural Health Worker", value: "rural_health_worker" },
  { label: "Primary School Teacher", value: "primary_school_teacher" },
  { label: "Folk Performer", value: "folk_performer" },
  { label: "Traditional Healer", value: "traditional_healer" },
  { label: "Temple Priest", value: "temple_priest" },
  { label: "Social Worker", value: "social_worker" },
  { label: "NGO Worker", value: "ngo_worker" },
  { label: "Homemaker", value: "homemaker" },
  { label: "Unemployed", value: "unemployed" },
  { label: "Other", value: "other" },
];

export const taxTypes = [
  { label: "Income Tax", value: "income_tax" },
  { label: "Sales Tax", value: "sales_tax" },
  { label: "Property Tax", value: "property_tax" },
  { label: "Vehicle Tax", value: "vehicle_tax" },
  { label: "Water Tax", value: "water_tax" },
  { label: "Sanitation Tax", value: "sanitation_tax" },
  { label: "Toll Tax", value: "toll_tax" },
  { label: "Other", value: "other" },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const citizenSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  age: z.number(),
  aadhar_id: z
    .string()
    .length(12, { message: "Aadhaar must be exactly 12 digits." }),
  contact_number: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits." }),
  occupation: z.string({ required_error: "Occupation is required." }),
  dob: z.date({ required_error: "Date of birth is required." }),
  educational_qualification: z.string({
    required_error: "Qualification is required.",
  }),
});

const taxAllocationSchema = z.object({
  tax_type: z.string().min(1, { message: "Tax type is required" }),
  amount: z.string().refine(
    (val) => {
      const num = Number(val);
      return !isNaN(num) && num > 0;
    },
    { message: "Amount must be a number greater than 0" }
  ),
  due_date: z.date({ required_error: "Due date is required" }),
  citizen_id: z.string().min(1, { message: "Citizen ID is required" }),
  citizen_name: z.string().min(1, { message: "Citizen name is required" }),
});

type citizentype = z.infer<typeof citizenSchema>;
type TaxAllocationFormType = z.infer<typeof taxAllocationSchema>;

export default function TaxAllocator({
  citizenList,
}: {
  citizenList: citizentype[];
  addOption: boolean;
}) {
  const [citizens, setCitizens] = useState(citizenList);
  const [filteredCitizens, setFilteredCitizens] = useState(citizenList);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCitizen, setSelectedCitizen] = useState<citizentype | null>(
    null
  );

  // Create a form for tax allocation
  const taxForm = useForm<TaxAllocationFormType>({
    resolver: zodResolver(taxAllocationSchema),
    defaultValues: {
      tax_type: "",
      amount: "",
      due_date: new Date(),
      citizen_id: "",
      citizen_name: "",
    },
  });

  useEffect(() => {
    setCitizens(citizenList);
    setFilteredCitizens(citizenList);
  }, [citizenList]);

  // Filter citizens when search term changes
  useEffect(() => {
    const results = citizens.filter(
      (citizen) =>
        citizen.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        citizen.aadhar_id.includes(searchTerm) ||
        citizen.contact_number.includes(searchTerm) ||
        getOccupationLabel(citizen.occupation)
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
    setFilteredCitizens(results);
  }, [searchTerm, citizens]);

  const allocateTax = (citizen: citizentype) => {
    setSelectedCitizen(citizen);
    // Reset form with current citizen info
    taxForm.reset({
      tax_type: "",
      amount: "",
      due_date: new Date(),
      citizen_id: citizen.aadhar_id,
      citizen_name: citizen.name,
    });
    setIsDialogOpen(true);
  };

  const onSubmitTax = async (data: TaxAllocationFormType) => {
    console.log("Tax allocation data:", {
      ...data,
      amount: Number(data.amount),
      citizen: selectedCitizen,
    });
    try {
      const res = await fetch("/api/employees/allocatetax", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tax_type: data.tax_type,
          due_date: data.due_date,
          amount: Number(data.amount),
          aadhar_id: selectedCitizen?.aadhar_id,
        }),
      });
      if (res.ok) {
        alert("Tax allocated successfully");
      } else {
        alert("Failed to allocate tax");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to allocate tax");
    }
    setIsDialogOpen(false);
    taxForm.reset();
  };

  const getOccupationLabel = (value: string) => {
    const occupation = occupations.find((o) => o.value === value);
    return occupation ? occupation.label : value;
  };

  return (
    <div className="p-6 w-full bg-slate-50 min-h-screen">
      <Card className="shadow-sm border-0">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-2xl font-semibold text-slate-800 mb-4">
            Tax Allocation Portal
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <div className="mb-6 relative">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by name, aadhar, phone number or occupation..."
                className="pl-10 bg-slate-50 border-slate-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {searchTerm && (
              <div className="absolute right-3 top-3">
                <Badge variant="outline" className="bg-slate-100">
                  {filteredCitizens.length} results
                </Badge>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="rounded-md border border-slate-200 overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-semibold text-slate-700 cursor-pointer">
                    Name
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 cursor-pointer">
                    Aadhar
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 cursor-pointer">
                    Phone
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 cursor-pointer">
                    Occupation
                  </TableHead>
                  <TableHead className="text-right font-semibold text-slate-700">
                    Tax
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCitizens.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-10 text-slate-500"
                    >
                      {searchTerm
                        ? "No citizens found matching your search"
                        : "No citizens available"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCitizens.map((citizen) => (
                    <TableRow
                      key={citizen.aadhar_id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <TableCell className="font-medium text-slate-800">
                        {citizen.name}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {citizen.aadhar_id}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {citizen.contact_number}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium bg-green-100 text-green-800">
                          {getOccupationLabel(citizen.occupation)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => allocateTax(citizen)}
                          className="h-8 p-0 text-blue-600 border-blue-200 hover:bg-blue-50"
                        >
                          <div className="flex flex-row px-2 py-0.5 items-center justify-center">
                            <ReceiptIndianRupee className="h-4 w-4 mr-2" />
                            <div className="text-sm">Allocate Tax</div>
                          </div>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Count summary */}
          <div className="mt-4 text-sm text-slate-500">
            Showing {filteredCitizens.length} of {citizens.length} citizens
          </div>
        </CardContent>
      </Card>

      {/* Tax Allocation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Allocate Tax to {selectedCitizen?.name}
            </DialogTitle>
          </DialogHeader>
          <Form {...taxForm}>
            <form
              onSubmit={taxForm.handleSubmit(onSubmitTax)}
              className="space-y-4"
            >
              {/* Hidden fields for citizen ID and name */}
              <input type="hidden" {...taxForm.register("citizen_id")} />
              <input type="hidden" {...taxForm.register("citizen_name")} />

              {/* Tax Type */}
              <FormField
                control={taxForm.control}
                name="tax_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700">Tax Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="border-slate-200">
                          <SelectValue placeholder="Select tax type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {taxTypes.map((tax) => (
                          <SelectItem key={tax.value} value={tax.value}>
                            {tax.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Due Date */}
              <FormField
                control={taxForm.control}
                name="due_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-slate-700">Due Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal border-slate-200",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Amount */}
              <FormField
                control={taxForm.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700">Amount (₹)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter amount"
                        {...field}
                        className="border-slate-200"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="border-slate-200"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  Confirm Tax Allocation
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
