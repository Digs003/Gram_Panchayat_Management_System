"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Plus, Pencil, Trash, Search, ChevronUp, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

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
  email: z.string().email({ message: "Invalid email address." }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }),
  occupation: z.string({ required_error: "Occupation is required." }),
  dob: z.date({ required_error: "Date of birth is required." }),
  qualification: z.string({ required_error: "Qualification is required." }),
});

const initialCitizens = [
  { 
    id: 1, 
    name: "John Doe", 
    email: "john@example.com", 
    phone: "1234567890", 
    occupation: "farmer", 
    dob: new Date("1990-01-01"), 
    age: 35, 
    qualification: "bachelors_degree" 
  },
  { 
    id: 2, 
    name: "Jane Smith", 
    email: "jane@example.com", 
    phone: "9876543210", 
    occupation: "self_employed_village", 
    dob: new Date("1985-05-12"), 
    age: 39, 
    qualification: "masters_degree" 
  },
  { 
    id: 3, 
    name: "Michael Johnson", 
    email: "michael@example.com", 
    phone: "5551234567", 
    occupation: "teacher", 
    dob: new Date("1992-07-22"), 
    age: 32, 
    qualification: "masters_degree" 
  },
  { 
    id: 4, 
    name: "Sarah Williams", 
    email: "sarah@example.com", 
    phone: "7778889999", 
    occupation: "government_employee", 
    dob: new Date("1988-03-15"), 
    age: 37, 
    qualification: "bachelors_degree" 
  },
  { 
    id: 5, 
    name: "Robert Brown", 
    email: "robert@example.com", 
    phone: "3334445555", 
    occupation: "farmer", 
    dob: new Date("1975-11-08"), 
    age: 49, 
    qualification: "class_12_pass" 
  }
];

export default function CitizenTable() {
  const [citizens, setCitizens] = useState(initialCitizens);
  const [filteredCitizens, setFilteredCitizens] = useState(initialCitizens);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCitizen, setEditingCitizen] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  const form = useForm({
    resolver: zodResolver(citizenSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      occupation: "",
      qualification: "",
    },
  });

  // Filter citizens when search term changes
  useEffect(() => {
    const results = citizens.filter(citizen => 
      citizen.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      citizen.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      citizen.phone.includes(searchTerm) ||
      getOccupationLabel(citizen.occupation).toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCitizens(results);
  }, [searchTerm, citizens]);

  // Sort citizens
  useEffect(() => {
    let sortedCitizens = [...filteredCitizens];
    if (sortConfig.key) {
      sortedCitizens.sort((a, b) => {
        if (sortConfig.key === 'occupation') {
          // Sort by occupation label
          const aValue = getOccupationLabel(a[sortConfig.key]).toLowerCase();
          const bValue = getOccupationLabel(b[sortConfig.key]).toLowerCase();
          if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
          if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
          return 0;
        } else if (sortConfig.key === 'qualification') {
          // Sort by qualification label
          const aValue = getQualificationLabel(a[sortConfig.key]).toLowerCase();
          const bValue = getQualificationLabel(b[sortConfig.key]).toLowerCase();
          if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
          if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
          return 0;
        } else if (sortConfig.key === 'dob') {
          // Sort by date
          const aDate = new Date(a[sortConfig.key]);
          const bDate = new Date(b[sortConfig.key]);
          return sortConfig.direction === 'ascending' 
            ? aDate.getTime() - bDate.getTime() 
            : bDate.getTime() - aDate.getTime();
        } else {
          // Standard sort for other fields
          if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
          if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
          return 0;
        }
      });
    }
    setFilteredCitizens(sortedCitizens);
  }, [sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnName) => {
    if (sortConfig.key !== columnName) return null;
    
    return sortConfig.direction === 'ascending' 
      ? <ChevronUp className="inline h-4 w-4 ml-1" /> 
      : <ChevronDown className="inline h-4 w-4 ml-1" />;
  };

  const openAddDialog = () => {
    form.reset({
      name: "",
      email: "",
      phone: "",
      occupation: "",
      qualification: "",
    });
    setEditingCitizen(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (citizen) => {
    form.reset({
      name: citizen.name,
      email: citizen.email,
      phone: citizen.phone,
      occupation: citizen.occupation,
      dob: citizen.dob,
      qualification: citizen.qualification,
    });
    setEditingCitizen(citizen);
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    setCitizens(citizens.filter((citizen) => citizen.id !== id));
  };

  const onSubmit = (data) => {
    // Calculate age from date of birth
    const today = new Date();
    const birthDate = new Date(data.dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (editingCitizen) {
      setCitizens(
        citizens.map((citizen) =>
          citizen.id === editingCitizen.id
            ? { ...data, id: editingCitizen.id, age }
            : citizen
        )
      );
    } else {
      setCitizens([
        ...citizens,
        { ...data, id: citizens.length + 1, age },
      ]);
    }
    setIsDialogOpen(false);
    form.reset();
  };

  const getOccupationLabel = (value) => {
    const occupation = occupations.find(o => o.value === value);
    return occupation ? occupation.label : value;
  };

  const getQualificationLabel = (value) => {
    const qualification = qualifications.find(q => q.value === value);
    return qualification ? qualification.label : value;
  };

  return (
    <div className="p-6 w-full bg-slate-50 min-h-screen">
      <Card className="shadow-sm border-0">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-2xl font-semibold text-slate-800">Citizen Registry</CardTitle>
          <Button onClick={openAddDialog} className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="mr-2 h-4 w-4" /> Add Citizen
          </Button>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <div className="mb-6 relative">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search by name, email, phone, or occupation..." 
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
                  <TableHead 
                    className="font-semibold text-slate-700 cursor-pointer"
                    onClick={() => requestSort('name')}
                  >
                    Name {getSortIcon('name')}
                  </TableHead>
                  <TableHead 
                    className="font-semibold text-slate-700 cursor-pointer"
                    onClick={() => requestSort('email')}
                  >
                    Email {getSortIcon('email')}
                  </TableHead>
                  <TableHead 
                    className="font-semibold text-slate-700 cursor-pointer"
                    onClick={() => requestSort('phone')}
                  >
                    Phone {getSortIcon('phone')}
                  </TableHead>
                  <TableHead 
                    className="font-semibold text-slate-700 cursor-pointer"
                    onClick={() => requestSort('occupation')}
                  >
                    Occupation {getSortIcon('occupation')}
                  </TableHead>
                  <TableHead 
                    className="font-semibold text-slate-700 cursor-pointer"
                    onClick={() => requestSort('dob')}
                  >
                    Date of Birth {getSortIcon('dob')}
                  </TableHead>
                  <TableHead 
                    className="font-semibold text-slate-700 cursor-pointer"
                    onClick={() => requestSort('age')}
                  >
                    Age {getSortIcon('age')}
                  </TableHead>
                  <TableHead 
                    className="font-semibold text-slate-700 cursor-pointer"
                    onClick={() => requestSort('qualification')}
                  >
                    Qualification {getSortIcon('qualification')}
                  </TableHead>
                  <TableHead className="text-right font-semibold text-slate-700">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCitizens.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10 text-slate-500">
                      {searchTerm ? "No citizens found matching your search" : "No citizens available"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCitizens.map((citizen) => (
                    <TableRow key={citizen.id} className="hover:bg-slate-50 transition-colors">
                      <TableCell className="font-medium text-slate-800">{citizen.name}</TableCell>
                      <TableCell className="text-slate-600">{citizen.email}</TableCell>
                      <TableCell className="text-slate-600">{citizen.phone}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium bg-green-100 text-green-800`}>
                          {getOccupationLabel(citizen.occupation)}
                        </span>
                      </TableCell>
                      <TableCell className="text-slate-600">{format(citizen.dob, "MMM d, yyyy")}</TableCell>
                      <TableCell className="text-slate-600">{citizen.age}</TableCell>
                      <TableCell className="text-slate-600">{getQualificationLabel(citizen.qualification)}</TableCell>
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
                            onClick={() => handleDelete(citizen.id)} 
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
              {editingCitizen ? "Edit Citizen Information" : "Register New Citizen"}
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
                      <Input placeholder="Enter full name" {...field} className="border-slate-200" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700">Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email address" {...field} className="border-slate-200" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700">Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Phone number" {...field} className="border-slate-200" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="occupation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700">Occupation</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-slate-200">
                          <SelectValue placeholder="Select occupation" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {occupations.map((occupation) => (
                          <SelectItem key={occupation.value} value={occupation.value}>
                            {occupation.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-slate-700">Date of Birth</FormLabel>
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
                                format(field.value, "MMM d, yyyy")
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
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="qualification"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700">Qualification</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-slate-200">
                            <SelectValue placeholder="Select qualification" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {qualifications.map((qualification) => (
                            <SelectItem key={qualification.value} value={qualification.value}>
                              {qualification.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter className="pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  className="border-slate-200"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
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