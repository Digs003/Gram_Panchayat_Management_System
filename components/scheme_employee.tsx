"use client";

import React, { useState, useEffect, use } from "react";
import { format, set } from "date-fns";
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Eye,
  ArrowUpDown,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SchemeType } from "./add_scheme";

// Mock schemes data (from your existing code)
// const schemes = [
//   {
//     scheme_id: 1,
//     scheme_name: "Rural Employment Guarantee",
//     starting_date: new Date(2023, 3, 15),
//     budget: "50000000",
//     description:
//       "Provides 100 days of guaranteed wage employment to rural households.",
//     status: "active",
//   },
//   {
//     scheme_id: 2,
//     scheme_name: "Village Health Initiative",
//     starting_date: new Date(2023, 6, 1),
//     budget: "25000000",
//     description: "Comprehensive healthcare program for rural areas.",
//     status: "active",
//   },
//   {
//     scheme_id: 3,
//     scheme_name: "Agricultural Subsidy Program",
//     starting_date: new Date(2023, 1, 10),
//     budget: "35000000",
//     description: "Subsidies for farmers for seeds, fertilizers and equipment.",
//     status: "completed",
//   },
//   {
//     scheme_id: 4,
//     scheme_name: "Women Entrepreneurship Development",
//     starting_date: new Date(2023, 8, 5),
//     budget: "15000000",
//     description: "Support for women to start small businesses.",
//     status: "active",
//   },
//   {
//     scheme_id: 5,
//     scheme_name: "Rural Housing Improvement",
//     starting_date: new Date(2023, 2, 20),
//     budget: "40000000",
//     description: "Financial assistance for construction of houses.",
//     status: "pending",
//   },
// ];

// Mock applications data
export type ApplicationType = {
  enrollment_id: string;
  date_of_enrollment: Date;
  name: string;
  aadhar_id: string;
  dob: Date;
  scheme_id: number;
  scheme_name: string;
  annual_income: string;
  status: string;
  reason: string;
};

// const mockApplications: ApplicationType[] = [
//   {
//     enrollment_id: "APP12345",
//     date_of_enrollment: new Date(2023, 10, 5),
//     name: "Rahul Kumar",
//     aadhar_id: "123456789012",
//     dob: new Date(1988, 4, 15),
//     scheme_id: 1,
//     scheme_name: "Rural Employment Guarantee",
//     annual_income: "120000",
//     status: "pending",
//     reason:
//       "I need employment opportunities to support my family of 5.",
//   },
//   {
//     enrollment_id: "APP23456",
//     date_of_enrollment: new Date(2023, 10, 7),
//     name: "Priya Singh",
//     aadhar_id: "234567890123",
//     dob: new Date(1995, 7, 22),
//     scheme_id: 2,
//     scheme_name: "Village Health Initiative",
//     annual_income: "85000",
//     status: "pending",
//     reason: "My family needs better healthcare access.",
//   },
//   {
//     enrollment_id: "APP34567",
//     date_of_enrollment: new Date(2023, 10, 10),
//     name: "Amit Patel",
//     aadhar_id: "345678901234",
//     dob: new Date(1975, 1, 10),
//     scheme_id: 4,
//     scheme_name: "Women Entrepreneurship Development",
//     annual_income: "95000",
//     status: "approved",
//     reason: "Looking to start a small tailoring business.",
//   },
//   {
//     enrollment_id: "APP45678",
//     date_of_enrollment: new Date(2023, 10, 12),
//     name: "Sunita Devi",
//     aadhar_id: "456789012345",
//     dob: new Date(1982, 9, 5),
//     scheme_id: 1,
//     scheme_name: "Rural Employment Guarantee",
//     annual_income: "70000",
//     status: "rejected",
//     reason: "Need stable employment to support my family.",
//   },
//   {
//     enrollment_id: "APP56789",
//     date_of_enrollment: new Date(2023, 10, 15),
//     name: "Ravi Sharma",
//     aadhar_id: "567890123456",
//     dob: new Date(1991, 5, 18),
//     scheme_id: 5,
//     scheme_name: "Rural Housing Improvement",
//     annual_income: "110000",
//     status: "pending",
//     reason: "My house needs urgent repairs and renovation.",
//   },
//   {
//     enrollment_id: "APP67890",
//     date_of_enrollment: new Date(2023, 10, 18),
//     name: "Deepak Verma",
//     aadhar_id: "678901234567",
//     dob: new Date(1970, 11, 30),
//     scheme_id: 3,
//     scheme_name: "Agricultural Subsidy Program",
//     annual_income: "130000",
//     status: "pending",
//     reason: "I am a farmer and need support for better yields.",
//   },
// ];

export default function WelfareEmployee({
  schemeList,
  applicationList,
}: {
  schemeList: SchemeType[];
  applicationList: ApplicationType[];
}) {
  const [applications, setApplications] = useState(applicationList);
  const [filteredApplications, setFilteredApplications] =
    useState(applicationList);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSchemeFilter, setSelectedSchemeFilter] = useState("all");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("all");
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] =
    useState<ApplicationType | null>(null);
  const [actionType, setActionType] = useState("");

  useEffect(() => {
    setApplications(applicationList);
    setFilteredApplications(applicationList);
  }, [applicationList]);

  // Apply filters when search term or filters change
  useEffect(() => {
    let results = applications;

    // Filter by search term (name or Aadhaar)
    if (searchTerm) {
      results = results.filter(
        (app) =>
          app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.aadhar_id.includes(searchTerm)
      );
    }

    // Filter by scheme
    if (selectedSchemeFilter !== "all") {
      results = results.filter(
        (app) => app.scheme_id === parseInt(selectedSchemeFilter)
      );
    }

    // Filter by status
    if (selectedStatusFilter !== "all") {
      results = results.filter((app) => app.status === selectedStatusFilter);
    }

    setFilteredApplications(results);
  }, [searchTerm, selectedSchemeFilter, selectedStatusFilter, applications]);

  // Calculate age from date of birth
  const calculateAge = (dob) => {
    const today = new Date();
    const dobDate = new Date(dob);
    let age = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < dobDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const openViewDialog = (application: ApplicationType) => {
    setSelectedApplication(application);
    setIsViewDialogOpen(true);
  };

  const openConfirmDialog = (application: ApplicationType, action) => {
    setSelectedApplication(application);
    setActionType(action);
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmAction = () => {
    // Update application status based on action
    if (!selectedApplication) return;
    const updatedApplications = applications.map((app) => {
      if (app.enrollment_id === selectedApplication?.enrollment_id) {
        return {
          ...app,
          status: actionType === "approve" ? "approved" : "rejected",
        };
      }
      return app;
    });

    setApplications(updatedApplications);
    setIsConfirmDialogOpen(false);
  };

  return (
    <div className="p-6 w-full bg-slate-50 min-h-screen">
      <Card className="shadow-sm border-0 mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-slate-800">
            Citizen Applications Management
          </CardTitle>
          <CardDescription className="text-slate-600">
            Review and process applications for welfare schemes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters Section */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by name or Aadhaar..."
                className="pl-10 bg-slate-50 border-slate-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select
              value={selectedSchemeFilter}
              onValueChange={setSelectedSchemeFilter}
            >
              <SelectTrigger className="bg-slate-50 border-slate-200">
                <SelectValue placeholder="Filter by scheme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Schemes</SelectItem>
                {schemeList.map((scheme) => (
                  <SelectItem
                    key={scheme.scheme_id}
                    value={scheme.scheme_id?.toString() || ""}
                  >
                    {scheme.scheme_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedStatusFilter}
              onValueChange={setSelectedStatusFilter}
            >
              <SelectTrigger className="bg-slate-50 border-slate-200">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Applications Table */}
          <div className="rounded-md border border-slate-200 overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-semibold text-slate-700">
                    Citizen Name
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Aadhaar
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    DoB & Age
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Scheme
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
                {filteredApplications.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-10 text-slate-500"
                    >
                      No applications found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredApplications.map((application) => (
                    <TableRow
                      key={application.enrollment_id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <TableCell className="font-medium text-slate-800">
                        {application.name}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {application.aadhar_id}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {format(new Date(application.dob), "dd MMM yyyy")}
                        <span className="ml-1 text-xs text-slate-500">
                          ({calculateAge(application.dob)} years)
                        </span>
                      </TableCell>
                      <TableCell className="text-slate-600">
                        <div className="flex flex-col">
                          <span>{application.scheme_name}</span>
                          <span className="text-xs text-slate-500">
                            ID: {application.scheme_id}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium ${getStatusBadgeClass(
                            application.status
                          )}`}
                        >
                          {application.status.charAt(0).toUpperCase() +
                            application.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openViewDialog(application)}
                            className="h-8 text-blue-600 border-blue-200 hover:bg-blue-50"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                          </Button>

                          {application.status === "pending" && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  openConfirmDialog(application, "approve")
                                }
                                className="h-8 text-green-600 border-green-200 hover:bg-green-50"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  openConfirmDialog(application, "reject")
                                }
                                className="h-8 text-red-600 border-red-200 hover:bg-red-50"
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                              </Button>
                            </>
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

      {/* View Application Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Application Details
            </DialogTitle>
            <Badge
              className={`${getStatusBadgeClass(
                selectedApplication?.status
              )} mt-2 w-fit`}
            >
              {selectedApplication?.status &&
                selectedApplication.status.charAt(0).toUpperCase() +
                  selectedApplication.status.slice(1)}
            </Badge>
          </DialogHeader>

          {selectedApplication && (
            <ScrollArea className="max-h-[600px] pr-4">
              <div className="py-4 space-y-6">
                <div>
                  <h3 className="text-md font-medium text-slate-700 mb-2">
                    Application Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-slate-500">
                        Application ID
                      </p>
                      <p className="text-slate-700">
                        {selectedApplication.enrollment_id}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-slate-500">
                        Submission Date
                      </p>
                      <p className="text-slate-700">
                        {format(
                          new Date(selectedApplication.date_of_enrollment),
                          "dd MMM yyyy"
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-md font-medium text-slate-700 mb-2">
                    Citizen Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-slate-500">Full Name</p>
                      <p className="text-slate-700">
                        {selectedApplication.name}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-slate-500">
                        Aadhaar Number
                      </p>
                      <p className="text-slate-700">
                        {selectedApplication.aadhar_id}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-slate-500">
                        Date of Birth
                      </p>
                      <p className="text-slate-700">
                        {format(
                          new Date(selectedApplication.dob),
                          "dd MMM yyyy"
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-slate-500">Age</p>
                      <p className="text-slate-700">
                        {calculateAge(selectedApplication.dob)} years
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-slate-500">
                        Annual Income
                      </p>
                      <p className="text-slate-700">
                        ₹
                        {parseInt(
                          selectedApplication.annual_income
                        ).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-md font-medium text-slate-700 mb-2">
                    Scheme Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-slate-500">Scheme Name</p>
                      <p className="text-slate-700">
                        {selectedApplication.scheme_name}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-slate-500">Scheme ID</p>
                      <p className="text-slate-700">
                        {selectedApplication.scheme_id}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}

          <DialogFooter className="pt-4 space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsViewDialogOpen(false)}
              className="border-slate-200"
            >
              Close
            </Button>

            {selectedApplication?.status === "pending" && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsViewDialogOpen(false);
                    openConfirmDialog(selectedApplication, "reject");
                  }}
                  className="border-red-200 text-red-600 hover:bg-red-50"
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Reject
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setIsViewDialogOpen(false);
                    openConfirmDialog(selectedApplication, "approve");
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Action Dialog */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {actionType === "approve"
                ? "Approve Application"
                : "Reject Application"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "approve"
                ? "Are you sure you want to approve this application? This will grant the citizen access to the scheme benefits."
                : "Are you sure you want to reject this application? The citizen will be notified of this decision."}
            </DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="py-4">
              <div className="bg-slate-50 p-4 rounded-md border border-slate-100 text-sm">
                <p className="mb-1">
                  <span className="font-medium text-slate-700">Applicant:</span>{" "}
                  <span className="text-slate-800">
                    {selectedApplication.name}
                  </span>
                </p>
                <p className="mb-1">
                  <span className="font-medium text-slate-700">Aadhaar:</span>{" "}
                  <span className="text-slate-800">
                    {selectedApplication.aadhar_id}
                  </span>
                </p>
                <p>
                  <span className="font-medium text-slate-700">Scheme:</span>{" "}
                  <span className="text-slate-800">
                    {selectedApplication.scheme_name}
                  </span>
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsConfirmDialogOpen(false)}
              className="border-slate-200"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirmAction}
              className={
                actionType === "approve"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }
            >
              {actionType === "approve"
                ? "Approve Application"
                : "Reject Application"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
