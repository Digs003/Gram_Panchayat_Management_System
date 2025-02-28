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

const qualifications = [
  { label: "1st Pass", value: "class_1_pass" },
  { label: "2nd Pass", value: "class_2_pass" },
  { label: "3rd Pass", value: "class_3_pass" },
  { label: "4th Pass", value: "class_4_pass" },
  { label: "5th Pass", value: "class_5_pass" },
  { label: "6th Pass", value: "class_6_pass" },
  { label: "7th Pass", value: "class_7_pass" },
  { label: "8th Pass", value: "class_8_pass" },
  { label: "9th Pass", value: "class_9_pass" },
  { label: "10th Pass (Matriculation)", value: "class_10_pass" },
  { label: "11th Pass", value: "class_11_pass" },
  { label: "12th Pass (Higher Secondary)", value: "class_12_pass" },
  { label: "Diploma", value: "diploma" },
  { label: "Vocational Training", value: "vocational_training" },
  { label: "Bachelor's Degree", value: "bachelors_degree" },
  { label: "Master's Degree", value: "masters_degree" },
  { label: "Doctorate (PhD)", value: "doctorate" },
  { label: "Professional Certification", value: "professional_certification" },
  { label: "No Formal Education", value: "no_formal_education" },
];

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

// const initialCitizens = [
//   {
//     id: 1,
//     name: "John Doe",
//     email: "john@example.com",
//     phone: "1234567890",
//     occupation: "farmer",
//     dob: new Date("1990-01-01"),
//     age: 35,
//     educational_qualification: "bachelors_degree"
//   },
//   {
//     id: 2,
//     name: "Jane Smith",
//     email: "jane@example.com",
//     phone: "9876543210",
//     occupation: "self_employed_village",
//     dob: new Date("1985-05-12"),
//     age: 39,
//     educational_qualification: "masters_degree"
//   },
//   {
//     id: 3,
//     name: "Michael Johnson",
//     email: "michael@example.com",
//     phone: "5551234567",
//     occupation: "teacher",
//     dob: new Date("1992-07-22"),
//     age: 32,
//     educational_qualification: "masters_degree"
//   },
//   {
//     id: 4,
//     name: "Sarah Williams",
//     email: "sarah@example.com",
//     phone: "7778889999",
//     occupation: "government_employee",
//     dob: new Date("1988-03-15"),
//     age: 37,
//     educational_qualification: "bachelors_degree"
//   },
//   {
//     id: 5,
//     name: "Robert Brown",
//     email: "robert@example.com",
//     phone: "3334445555",
//     occupation: "farmer",
//     dob: new Date("1975-11-08"),
//     age: 49,
//     educational_qualification: "class_12_pass"
//   }
// ];

type citizentype = z.infer<typeof citizenSchema>;

export default function CitizenTable({
  citizenList,
}: {
  citizenList: citizentype[];
}) {
  const [citizens, setCitizens] = useState(citizenList);
  const [filteredCitizens, setFilteredCitizens] = useState(citizenList);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const [editingCitizen, setEditingCitizen] = useState<citizentype | null>(
    null
  );

  const form = useForm({
    resolver: zodResolver(citizenSchema),
    defaultValues: {
      name: "",
      aadhar_id: "",
      contact_number: "",
      dob: new Date(),
      age: 0,
      educational_qualification: "",
      occupation: "",
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

  const redirect = () => {
    router.push("/signup/citizen");
  };

  const handleEdit = (citizen) => {
    form.reset({
      name: citizen.name,
      age: citizen.age,
      dob: new Date(citizen.dob),
      aadhar_id: citizen.aadhar_id,
      occupation: citizen.occupation,
      contact_number: citizen.contact_number,
      educational_qualification: citizen.educational_qualification,
    });
    setEditingCitizen(citizen);
    setIsDialogOpen(true);
  };

  const handleDelete = async (aadhar_id) => {
    try {
      const response = await fetch(`/api/citizens/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          aadhar_id: aadhar_id,
        }),
      });
      if (!response.ok) {
        alert("Failed to delete citizen. Please try again.");
      }
    } catch (e) {
      console.error("Error deleting citizen:", e);
    }
    setCitizens(citizens.filter((citizen) => citizen.aadhar_id !== aadhar_id));
  };

  const onSubmit = async (data) => {
    console.log("Form data:", data);

    if (editingCitizen) {
      try {
        const response = await fetch(`/api/citizens/update`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.name,
            aadhar_id: data.aadhar_id, // Ensure it's included
            contact_number: data.contact_number,
            educational_qualification: data.educational_qualification,
          }),
        });
        if (!response.ok) {
          alert("Failed to update citizen. Please try again.");
        }
      } catch (e) {
        console.error("Error updating citizen:", e);
      }
      setCitizens(
        citizens.map((citizen) =>
          citizen.aadhar_id === editingCitizen.aadhar_id ? { ...data } : citizen
        )
      );
    } else {
      setCitizens([...citizens, { ...data, id: citizens.length + 1, age }]);
    }
    setIsDialogOpen(false);
    form.reset();
  };

  const getOccupationLabel = (value) => {
    const occupation = occupations.find((o) => o.value === value);
    return occupation ? occupation.label : value;
  };

  const getQualificationLabel = (value) => {
    const qualification = qualifications.find((q) => q.value === value);
    return qualification ? qualification.label : value;
  };

  return (
    <div className="p-6 w-full bg-slate-50 min-h-screen">
      <Card className="shadow-sm border-0">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-2xl font-semibold text-slate-800">
            Citizen Registry
          </CardTitle>
          <Button
            onClick={redirect}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Citizen
          </Button>
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
                  <TableHead className="font-semibold text-slate-700 cursor-pointer">
                    Date of Birth
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 cursor-pointer">
                    Age
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 cursor-pointer">
                    Qualification
                  </TableHead>
                  <TableHead className="text-right font-semibold text-slate-700">
                    Actions
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
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium bg-green-100 text-green-800`}
                        >
                          {getOccupationLabel(citizen.occupation)}
                        </span>
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {format(citizen.dob, "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {citizen.age}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {getQualificationLabel(
                          citizen.educational_qualification
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex space-x-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(citizen)}
                            className="h-8 w-8 p-0 text-blue-600 border-blue-200 hover:bg-blue-50"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(citizen.aadhar_id)}
                            className="h-8 w-8 p-0 text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
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

      {/* Dialog Form */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {editingCitizen
                ? "Edit Citizen Information"
                : "Register New Citizen"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700">Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter full name"
                        {...field}
                        className="border-slate-200"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="aadhar_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700">
                        Aadhar Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Aadhar Number"
                          {...field}
                          className="border-slate-200"
                          disabled
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contact_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700">
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Phone number"
                          {...field}
                          className="border-slate-200"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="educational_qualification"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700">
                      Qualification
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="border-slate-200">
                          <SelectValue placeholder="Select qualification" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {qualifications.map((qualification) => (
                          <SelectItem
                            key={qualification.value}
                            value={qualification.value}
                          >
                            {qualification.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                  onClick={() => {
                    console.log("Submit button clicked");
                    console.log("Form state error", form.formState.errors);
                    form.handleSubmit(onSubmit);
                  }}
                >
                  {editingCitizen ? "Save Changes" : "Add Citizen"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
