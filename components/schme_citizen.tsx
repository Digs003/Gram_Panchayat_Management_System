"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import {
  CalendarIcon,
  Info,
  Eye,
  ClipboardList,
  Search,
  ChevronRight,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SchemeType } from "./add_scheme";
import { getURL } from "next/dist/shared/lib/utils";
import { getUser } from "@/lib/actions/getUser";

const applicationSchema = z.object({
  full_name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." }),
  scheme_id: z.number().optional(),
  aadhar_number: z
    .string()
    .length(12, { message: "Aadhaar must be exactly 12 digits." }),
  annual_income: z.number().nonnegative({ message: "Annual income must be a valid number" }),
  household_members: z.number().nonnegative({ message: "Number of household members must be a valid number" }),
  other_schemes: z.string().array().optional(),
  financial_assistance: z.enum(["yes", "no"]),
  reason_for_applying: z
    .string()
    .min(10, { message: "Please provide at least 10 characters." })
    .max(500),
  agree_terms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions.",
  }),
});

type ApplicationFormType = z.infer<typeof applicationSchema>;

export default function CitizenWelfareSchemes({
  schemeList,
}: {
  schemeList: SchemeType[];
}) {
  const [schemes, setSchemes] = useState<SchemeType[]>(schemeList);
  const [filteredSchemes, setFilteredSchemes] =
    useState<SchemeType[]>(schemeList);
  const [searchTerm, setSearchTerm] = useState("");
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState<SchemeType | null>(null);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [applicationId, setApplicationId] = useState("");

  useEffect(() => {
    setSchemes(schemeList);
    setFilteredSchemes(schemeList);
  }, [schemeList]);

  // Create a form for application
  const applicationForm = useForm<ApplicationFormType>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      scheme_id: 0,
      full_name: "",
      aadhar_number: "",
      annual_income: 0,
      household_members: 0,
      financial_assistance: "no",
      reason_for_applying: "",
      agree_terms: false,
    },
  });

  // Filter schemes when search term changes
  useEffect(() => {
    const results = schemes.filter(
      (scheme) =>
        scheme.scheme_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scheme.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        false ||
        scheme.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSchemes(results);
  }, [searchTerm, schemes]);

  const openViewDialog = (scheme: SchemeType) => {
    setSelectedScheme(scheme);
    setIsViewDialogOpen(true);
  };

  const openApplyDialog = async (scheme: SchemeType) => {
    const { user } = await getUser();
    if (scheme.status !== "active") {
      return;
    }
    setSelectedScheme(scheme);
    applicationForm.reset({
      full_name: user.name,
      scheme_id: scheme.scheme_id,
      aadhar_number: user.aadhar_id,
      annual_income: 0,
      household_members: 0,
      financial_assistance: "no",
      reason_for_applying: "",
      agree_terms: false,
    });
    setIsApplyDialogOpen(true);
  };

  const onSubmitApplication = async (data: ApplicationFormType) => {
    console.log("Application data:", {
      ...data,
      scheme_id: selectedScheme?.scheme_id,
      scheme_name: selectedScheme?.scheme_name,
      application_date: new Date(),
    });
    try {
      const response = await fetch("/api/citizens/applyscheme", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scheme_id: selectedScheme?.scheme_id,
          reason: data.reason_for_applying,
          status: "pending",
          date_of_enrollment: new Date(),
          annual_income: data.annual_income,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        alert("Failed to apply for scheme");
      } else {
        alert("Successfully applied for scheme");
        setApplicationId(`APP-${result.enrollment_id}`);
        setIsApplyDialogOpen(false);
        setIsSuccessDialogOpen(true);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to apply for scheme");
    }
    setIsApplyDialogOpen(false);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
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
      <Card className="shadow-sm border-0 mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-slate-800">
            Available Welfare Schemes
          </CardTitle>
          <CardDescription className="text-slate-600">
            Browse and apply for government welfare schemes you may be eligible
            for
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <div className="mb-6 relative">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search welfare schemes..."
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
                    Scheme Name
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Starting Date
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
                      colSpan={4}
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
                        <div className="flex flex-col">
                          <span>{scheme.scheme_name}</span>
                          <span className="text-xs text-slate-500 truncate max-w-md">
                            {(scheme?.description ?? "").length > 100
                              ? `${scheme.description?.substring(0, 100)}...`
                              : scheme.description}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {format(new Date(scheme.starting_date), "dd MMM yyyy")}
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
                            onClick={() => openViewDialog(scheme)}
                            className="h-8 text-blue-600 border-blue-200 hover:bg-blue-50"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          {scheme.application_status === null && (
                            <Button
                              variant={
                                scheme.status === "active"
                                  ? "default"
                                  : "outline"
                              }
                              size="sm"
                              disabled={scheme.status !== "active"}
                              onClick={() => openApplyDialog(scheme)}
                              className={
                                scheme.status === "active"
                                  ? "h-8 bg-indigo-600 hover:bg-indigo-700"
                                  : "h-8 text-slate-400 border-slate-200 bg-slate-50"
                              }
                            >
                              <ClipboardList className="h-4 w-4 mr-1" />
                              Apply
                            </Button>
                          )}
                          {scheme.application_status === "pending" && (
                            <Button
                              variant="default"
                              size="sm"
                              className="h-8  bg-yellow-200 border-yellow-200 hover:bg-yellow-50 text-yellow-800 hover:text-black"
                            >
                              <Info className="h-4 w-4 mr-1" />
                              Pending
                            </Button>
                          )}
                          {scheme.application_status === "accepted" && (
                            <Button
                              variant="default"
                              size="sm"
                              className="h-8  bg-green-300 border-green-200 hover:bg-green-50 hover:text-black"
                            >
                              <Info className="h-4 w-4 mr-1" />
                              Accepted
                            </Button>
                          )}
                          {scheme.application_status === "rejected" && (
                            <Button
                              variant="default"
                              size="sm"
                              className="h-8  bg-red-300 border-red-200 hover:bg-red-50 hover:text-black"
                            >
                              <Info className="h-4 w-4 mr-1" />
                              Rejected
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Scheme Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {selectedScheme?.scheme_name}
            </DialogTitle>
            <Badge
              className={`${getStatusBadgeClass(
                selectedScheme?.status ?? ""
              )} mt-2 w-fit`}
            >
              {(selectedScheme?.status?.charAt(0).toUpperCase() ?? "") +
                (selectedScheme?.status?.slice(1) ?? "")}
            </Badge>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <h3 className="font-medium text-slate-500">Description</h3>
              <p className="mt-1 text-slate-700 text-sm">
                {selectedScheme?.description}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-slate-500">Starting Date</h3>
                <p className="mt-1 text-sm  text-slate-700">
                  {selectedScheme &&
                    format(
                      new Date(selectedScheme.starting_date),
                      "dd MMMM yyyy"
                    )}
                </p>
              </div>
              <div>
                <h3 className=" font-medium text-slate-500">
                  Budget Allocated
                </h3>
                <p className="mt-1 text-sm text-slate-700">
                  {selectedScheme && formatCurrency(selectedScheme.budget)}
                </p>
              </div>
            </div>
          </div>
          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsViewDialogOpen(false)}
              className="border-slate-200"
            >
              Close
            </Button>
            {selectedScheme?.status === "active" && (
              <Button
                type="button"
                onClick={() => {
                  setIsViewDialogOpen(false);
                  openApplyDialog(selectedScheme);
                }}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                Apply Now
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Apply for Scheme Dialog */}
      <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Apply for {selectedScheme?.scheme_name}
            </DialogTitle>
            <DialogDescription>
              Please fill in your details to apply for this scheme. Make sure
              all information is accurate.
            </DialogDescription>
          </DialogHeader>
          <Form {...applicationForm}>
            <form
              onSubmit={applicationForm.handleSubmit(onSubmitApplication)}
              className="space-y-4"
            >
              {/* Personal Information */}
              <div>
                <h3 className="text-md font-medium text-slate-700 mb-2">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={applicationForm.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700">
                          Full Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your full name"
                            {...field}
                            className="border-slate-200 bg-gray-100"
                            readOnly
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={applicationForm.control}
                    name="aadhar_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700">
                          Aadhaar Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="12-digit Aadhaar number"
                            {...field}
                            className="border-slate-200 bg-gray-100"
                            readOnly
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Household Information */}
              <div>
                <h3 className="text-md font-medium text-slate-700 mb-2">
                  Household Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={applicationForm.control}
                    name="annual_income"
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700">
                          Annual Household Income (₹)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter annual income"
                            value={value || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              onChange(val ? parseInt(val, 10) : 0);
                            }}
                            {...fieldProps}
                            className="border-slate-200"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={applicationForm.control}
                    name="household_members"
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700">
                          Number of Household Members
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter number of members"
                            value={value || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              onChange(val ? parseInt(val, 10) : 0);
                            }}
                            {...fieldProps}
                            className="border-slate-200"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={applicationForm.control}
                  name="reason_for_applying"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel className="text-slate-700">
                        Reason for Applying
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Please explain why you are applying for this scheme and how it will benefit you"
                          {...field}
                          className="border-slate-200 min-h-24"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Terms and Conditions */}
              <FormField
                control={applicationForm.control}
                name="agree_terms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-6">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="font-normal text-slate-700">
                        I confirm that all the information provided is true and
                        accurate. I understand that providing false information
                        may result in disqualification and legal action.
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <DialogFooter className="pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsApplyDialogOpen(false)}
                  className="border-slate-200"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  Submit Application
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <div className="py-6 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <DialogTitle className="text-xl font-semibold text-slate-800 mb-2">
              Application Submitted Successfully
            </DialogTitle>
            <DialogDescription className="text-slate-600 mb-4">
              Your application for{" "}
              <span className="font-medium">{selectedScheme?.scheme_name}</span>{" "}
              has been submitted successfully.
            </DialogDescription>

            <div className="bg-blue-50 p-4 rounded-md text-blue-800 text-sm mb-4 w-full">
              <p className="font-medium mb-1">
                Your Application ID:{" "}
                <span className="text-blue-900">{applicationId}</span>
              </p>
              <p>
                Please save this ID for future reference and tracking of your
                application status.
              </p>
            </div>

            <p className="text-slate-600 text-sm">
              Your application will be reviewed by our team. You will be
              notified about the status within 7-10 working days.
            </p>
          </div>
          <DialogFooter>
            <Button
              type="button"
              onClick={() => setIsSuccessDialogOpen(false)}
              className="bg-indigo-600 hover:bg-indigo-700 w-full"
            >
              Return to Schemes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}