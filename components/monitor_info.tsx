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

import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { educationalQualifications as qualifications } from "@/app/signup/citizen/page";

const monitorSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  aadhar_id: z
    .string()
    .length(12, { message: "Aadhaar must be exactly 12 digits." }),
  contact_number: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits." }),
  email:
    z.string().email({ message: "Please enter a valid email address." }) ||
    z.string().nullable(),
  dob: z.date({ required_error: "Date of birth is required." }),
  date_of_joining: z.date({ required_error: "Date of joining is required." }),
  salary: z
    .number({ required_error: "Salary is required" })
    .min(0, { message: "Salary cannot be negative" }),
  educational_qualification: z.string({
    required_error: "Qualification is required.",
  }),
});

type monitorType = z.infer<typeof monitorSchema>;

export default function MonitorTable({
  monitorList,
}: {
  monitorList: monitorType[];
}) {
  const [monitors, setMonitors] = useState(monitorList);
  const [filteredMonitors, setFilteredMonitors] = useState(monitorList);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const [editingMonitor, setEditingMonitor] = useState<monitorType | null>(
    null
  );

  const form = useForm({
    resolver: zodResolver(monitorSchema),
    defaultValues: {
      name: "",
      aadhar_id: "",
      contact_number: "",
      dob: new Date(),
      date_of_joining: new Date(),
      salary: 0,
      educational_qualification: "",
      email: "",
    },
  });

  useEffect(() => {
    setMonitors(monitorList);
    setFilteredMonitors(monitorList);
  }, [monitorList]);

  // Filter monitors when search term changes
  useEffect(() => {
    const results = monitors.filter(
      (monitor) =>
        monitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        monitor.aadhar_id.includes(searchTerm) ||
        monitor.contact_number.includes(searchTerm)
    );
    setFilteredMonitors(results);
    console.log(monitorList);
  }, [searchTerm, monitors]);

  const redirect = () => {
    router.push("/signup/monitor");
  };

  const handleEdit = (monitor) => {
    console.log("Edit monitor with aadhar_id:", monitor.aadhar_id);
    form.reset({
      name: monitor.name,
      aadhar_id: monitor.aadhar_id,
      contact_number: monitor.contact_number,
      email: monitor.email,
      dob: new Date(monitor.dob),
      date_of_joining: new Date(monitor.date_of_joining),
      salary: monitor.salary,
      educational_qualification: monitor.educational_qualification,
    });
    setEditingMonitor(monitor);
    setIsDialogOpen(true);
  };

  const handleDelete = async (aadhar_id) => {
    console.log("Delete monitor with aadhar_id:", aadhar_id);
    try {
      const response = await fetch(`/api/citizens/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          aadhar_id: aadhar_id,
        }),
      });
      if (!response.ok) {
        alert("Failed to delete monitor. Please try again.");
      }
    } catch (e) {
      console.error("Error deleting employee:", e);
    }
    setMonitors(monitors.filter((monitor) => monitor.aadhar_id !== aadhar_id));
  };

  const onSubmit = async (data) => {
    console.log("Form data:", data);
    if (editingMonitor) {
      try {
        const response = await fetch(`/api/monitors/update`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.name,
            aadhar_id: data.aadhar_id,
            contact_number: data.contact_number,
            salary: data.salary,
            educational_qualification: data.educational_qualification,
          }),
        });
        if (!response.ok) {
          alert("Failed to update monitor. Please try again.");
        } else {
          alert("Monitor updated successfully");
          setMonitors(
            monitors.map((monitor) =>
              monitor.aadhar_id === editingMonitor.aadhar_id
                ? { ...monitor, ...data }
                : monitor
            )
          );
        }
      } catch (e) {
        console.error("Error updating monitor:", e);
      }
    } else {
      setMonitors([...monitors, { ...data }]);
    }
    setIsDialogOpen(false);
    form.reset();
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
            Panchayat monitor Registry
          </CardTitle>
          <Button
            onClick={redirect}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="mr-2 h-4 w-4" /> Add monitor
          </Button>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <div className="mb-6 relative">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by name, aadhar, phone number or position..."
                className="pl-10 bg-slate-50 border-slate-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {searchTerm && (
              <div className="absolute right-3 top-3">
                <Badge variant="outline" className="bg-slate-100">
                  {filteredMonitors.length} results
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
                    Email
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 cursor-pointer">
                    Date of Birth
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 cursor-pointer">
                    Join Date
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 cursor-pointer">
                    Salary (₹)
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
                {filteredMonitors.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center py-10 text-slate-500"
                    >
                      {searchTerm
                        ? "No monitors found matching your search"
                        : "No monitors available"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMonitors.map((monitor) => (
                    <TableRow
                      key={monitor.aadhar_id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <TableCell className="font-medium text-slate-800">
                        {monitor.name}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {monitor.aadhar_id}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {monitor.contact_number}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium bg-blue-100 text-blue-800`}
                        >
                          {monitor.email || "N/A"}
                        </span>
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {format(new Date(monitor.dob), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {format(
                          new Date(monitor.date_of_joining),
                          "MMM d, yyyy"
                        )}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {monitor.salary.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {getQualificationLabel(
                          monitor.educational_qualification
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex space-x-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(monitor)}
                            className="h-8 w-8 p-0 text-blue-600 border-blue-200 hover:bg-blue-50"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(monitor.aadhar_id)}
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
            Showing {filteredMonitors?.length} of {monitors?.length} monitors
          </div>
        </CardContent>
      </Card>

      {/* Dialog Form */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {editingMonitor
                ? "Edit monitor Information"
                : "Register New monitor"}
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
                name="salary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700">Salary (₹)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter salary"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="border-slate-200"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="educational_qualification"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700">
                      Educational Qualification
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
                >
                  {editingMonitor ? "Save Changes" : "Add monitor"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
