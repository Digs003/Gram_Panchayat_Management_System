"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, set } from "date-fns";
import { CalendarIcon, Plus, Pencil, Trash, Search, Info } from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const schemeStatusOptions = [
  { label: "Active", value: "active" },
  { label: "Pending", value: "pending" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

const schemeSchema = z.object({
  scheme_id: z.number().optional(),
  scheme_name: z
    .string()
    .min(2, { message: "Scheme name must be at least 2 characters." }),
  starting_date: z.date({ required_error: "Starting date is required." }),
  budget: z.string().refine(
    (val) => {
      const num = Number(val);
      return !isNaN(num) && num >= 0;
    },
    { message: "Budget must be a valid number" }
  ),
  description: z.string().optional(),
  status: z.string({ required_error: "Status is required." }),
  application_status: z.string().optional(),
});

export type SchemeType = z.infer<typeof schemeSchema>;

export default function WelfareSchemeManager({
  schemeList,
}: {
  schemeList: SchemeType[];
}) {
  const [schemes, setSchemes] = useState<SchemeType[]>(schemeList);

  const [filteredSchemes, setFilteredSchemes] =
    useState<SchemeType[]>(schemeList);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSchemeId, setSelectedSchemeId] = useState<number | null>(null);

  useEffect(() => {
    setSchemes(schemeList);
    setFilteredSchemes(schemeList);
  }, [schemeList]);

  // Create a form for scheme management
  const schemeForm = useForm<SchemeType>({
    resolver: zodResolver(schemeSchema),
    defaultValues: {
      scheme_name: "",
      starting_date: new Date(),
      budget: "",
      description: "",
      status: "pending",
    },
  });

  // Filter schemes when search term changes
  useEffect(() => {
    const results = schemes.filter(
      (scheme) =>
        scheme.scheme_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scheme.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scheme.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSchemes(results);
  }, [searchTerm, schemes]);

  const openAddDialog = () => {
    schemeForm.reset({
      scheme_name: "",
      starting_date: new Date(),
      budget: "",
      description: "",
      status: "pending",
    });
    setIsEditMode(false);
    setIsDialogOpen(true);
  };

  const openEditDialog = (scheme: SchemeType) => {
    schemeForm.reset({
      scheme_id: scheme.scheme_id,
      scheme_name: scheme.scheme_name,
      starting_date: new Date(scheme.starting_date),
      budget: scheme.budget,
      description: scheme.description || "",
      status: scheme.status,
    });
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (schemeId: number) => {
    setSelectedSchemeId(schemeId);
    setIsDeleteDialogOpen(true);
  };

  const onSubmitScheme = async (data: SchemeType) => {
    if (isEditMode && data.scheme_id) {
      // Update existing scheme

      try {
        const response = await fetch("/api/employees/editscheme", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            scheme_id: data.scheme_id,
            scheme_name: data.scheme_name,
            starting_date: data.starting_date,
            budget: data.budget,
            description: data.description,
            status: data.status,
          }),
        });
        if (!response.ok) {
          alert("Failed to update scheme");
        } else {
          alert("Scheme updated successfully");
          setSchemes(
            schemes.map((scheme) =>
              scheme.scheme_id === data.scheme_id ? data : scheme
            )
          );
        }
      } catch (e) {
        console.error("Error updating scheme", e);
        alert("Failed to update scheme");
      }
    } else {
      // Add new scheme with a new ID
      try {
        const response = await fetch("/api/employees/addscheme", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            scheme_name: data.scheme_name,
            starting_date: data.starting_date,
            budget: data.budget,
            description: data.description,
            status: data.status,
          }),
        });
        if (!response.ok) {
          alert("Failed to add scheme");
        } else {
          alert("Scheme added successfully");
          const newSchemeId =
            Math.max(0, ...schemes.map((s) => s.scheme_id || 0)) + 1;
          setSchemes([...schemes, { ...data, scheme_id: newSchemeId }]);
        }
      } catch (e) {
        console.error("Error adding scheme", e);
        alert("Failed to add scheme");
      }
    }

    setIsDialogOpen(false);
    schemeForm.reset();
  };

  const handleDelete = () => {
    if (selectedSchemeId) {
      setSchemes(
        schemes.filter((scheme) => scheme.scheme_id !== selectedSchemeId)
      );
      setIsDeleteDialogOpen(false);
      setSelectedSchemeId(null);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount);
    return num.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="p-6 w-full bg-slate-50 min-h-screen">
      <Card className="shadow-sm border-0">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-2xl font-semibold text-slate-800">
            Welfare Scheme Management
          </CardTitle>
          <Button
            onClick={openAddDialog}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Scheme
          </Button>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <div className="mb-6 relative">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by scheme name, description or status..."
                className="pl-10 bg-slate-50 border-slate-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {searchTerm && (
              <div className="absolute right-3 top-3">
                <Badge variant="outline" className="bg-slate-100">
                  {filteredSchemes.length} results
                </Badge>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="rounded-md border border-slate-200 overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-semibold text-slate-700">
                    Scheme ID
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Scheme Name
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Starting Date
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Budget
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Status
                  </TableHead>
                  <TableHead className="text-right font-semibold text-slate-700">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSchemes.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-10 text-slate-500"
                    >
                      {searchTerm
                        ? "No schemes found matching your search"
                        : "No schemes available"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSchemes.map((scheme) => (
                    <TableRow
                      key={scheme.scheme_id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <TableCell className="font-medium text-slate-800">
                        {scheme.scheme_id}
                      </TableCell>
                      <TableCell className="font-medium text-slate-800">
                        <div className="flex flex-col">
                          <span>{scheme.scheme_name}</span>
                          {scheme.description && (
                            <span className="text-xs text-slate-500 truncate max-w-xs">
                              {scheme.description.length > 60
                                ? `${scheme.description.substring(0, 60)}...`
                                : scheme.description}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {format(new Date(scheme.starting_date), "dd MMM yyyy")}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {formatCurrency(scheme.budget)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium ${getStatusBadgeClass(
                            scheme.status
                          )}`}
                        >
                          {scheme.status.charAt(0).toUpperCase() +
                            scheme.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(scheme)}
                            className="h-8 p-0 text-blue-600 border-blue-200 hover:bg-blue-50"
                          >
                            <div className="flex flex-row px-2 py-0.5 items-center justify-center">
                              <Pencil className="h-4 w-4" />
                            </div>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDeleteDialog(scheme.scheme_id!)}
                            className="h-8 p-0 text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <div className="flex flex-row px-2 py-0.5 items-center justify-center">
                              <Trash className="h-4 w-4" />
                            </div>
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
            Showing {filteredSchemes.length} of {schemes.length} welfare schemes
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Scheme Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {isEditMode ? "Edit Welfare Scheme" : "Add New Welfare Scheme"}
            </DialogTitle>
          </DialogHeader>
          <Form {...schemeForm}>
            <form
              onSubmit={schemeForm.handleSubmit(onSubmitScheme)}
              className="space-y-4"
            >
              {/* Scheme Name */}
              <FormField
                control={schemeForm.control}
                name="scheme_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700">
                      Scheme Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter scheme name"
                        {...field}
                        className="border-slate-200"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Starting Date */}
              <FormField
                control={schemeForm.control}
                name="starting_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-slate-700">
                      Starting Date
                    </FormLabel>
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

              {/* Budget */}
              <FormField
                control={schemeForm.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700">Budget (₹)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter budget amount"
                        {...field}
                        className="border-slate-200"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={schemeForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700">
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter scheme description"
                        {...field}
                        className="border-slate-200 min-h-24"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status */}
              <FormField
                control={schemeForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700">Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="border-slate-200">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {schemeStatusOptions.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
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
                  {isEditMode ? "Update Scheme" : "Add Scheme"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-slate-800">
              Confirm Deletion
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 flex items-start space-x-4">
            <div className="p-2 bg-red-100 rounded-full">
              <Info className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-slate-800">
                Are you sure you want to delete this welfare scheme? This action
                cannot be undone.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-slate-200"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Scheme
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
