"use client";

import { useEffect, useState } from "react";
import {
  MailIcon,
  UserIcon,
  BriefcaseIcon,
  GraduationCapIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { educationalQualifications as qualifications } from "@/app/signup/citizen/page";
import { PORs as positions } from "@/app/signup/employee/page";
type personalInfoType = {
  admin_id: number | null;
  citizen_id: number;
  date_of_joining: string;
  email: string | null;
  name: string;
  gender: string;
  dob: string;
  contact_number: string;
  occupation: string;
  age: number;
  educational_qualification: string;
  aadhar_id: string;
  position: string | null;
  member_id: number | null;
  monitor_id: number | null;
};

// This would typically come from an API or database
// const adminData = {
//   admin_id: 1,
//   citizen_id: 10045,
//   date_of_joining: "2022-05-15",
//   email: "admin@example.gov.in",
//   name: "Rajesh Kumar",
//   gender: "Male",
//   dob: "1985-08-22",
//   contact_number: "+91 9876543210",
//   occupation: "Senior Administrator",
//   age: 38,
//   educational_qualification: "Master of Public Administration",
//   aadhar_id: "123456789012",
// };

export default function PersonalProfile({
  personalInfo,
  type,
}: {
  personalInfo: personalInfoType;
  type: string;
}) {
  const [admin, setAdmin] = useState<personalInfoType>(personalInfo);
  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };
  useEffect(() => {
    setAdmin(personalInfo);
  }, [personalInfo]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-IN", options);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };
  const getQualificationLabel = (value) => {
    const qualification = qualifications.find((q) => q.value === value);
    return qualification ? qualification.label : value;
  };
  const getPositionLabel = (value) => {
    const position = positions.find((p) => p.value === value);
    return position ? position.label : value;
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-primary/5 p-6 rounded-lg mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar className="h-24 w-24 border-4 border-primary/10">
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                {getInitials(admin.name)}
              </AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold">{admin.name}</h1>
              <div className="flex flex-col md:flex-row gap-2 mt-2 items-center">
                {type == "Admin" && (
                  <Badge variant="outline" className="px-3 py-1">
                    Admin ID: {admin.admin_id}
                  </Badge>
                )}
                {type == "Employee" && (
                  <Badge variant="outline" className="px-3 py-1">
                    Employee ID: {admin.member_id}
                  </Badge>
                )}
                {type == "Monitor" && (
                  <Badge variant="outline" className="px-3 py-1">
                    Monitor ID: {admin.monitor_id}
                  </Badge>
                )}
                <Badge variant="outline" className="px-3 py-1">
                  Citizen ID: {admin.citizen_id}
                </Badge>
                <Badge className="bg-primary/80 hover:bg-primary px-3 py-1">
                  {admin.occupation || "Administrator"}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>Basic personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-1">
                <span className="text-muted-foreground">Full Name</span>
                <span className="col-span-2 font-medium">{admin.name}</span>
              </div>
              <Separator />

              <div className="grid grid-cols-3 gap-1">
                <span className="text-muted-foreground">Gender</span>
                <span className="col-span-2">
                  {admin.gender
                    ? admin.gender.charAt(0).toUpperCase() +
                      admin.gender.slice(1)
                    : "Not specified"}
                </span>
              </div>
              <Separator />

              <div className="grid grid-cols-3 gap-1">
                <span className="text-muted-foreground">Date of Birth</span>
                <span className="col-span-2">{formatDate(admin.dob)}</span>
              </div>
              <Separator />

              <div className="grid grid-cols-3 gap-1">
                <span className="text-muted-foreground">Age</span>
                <span className="col-span-2">
                  {admin.age || calculateAge(admin.dob)}
                </span>
              </div>
              <Separator />

              <div className="grid grid-cols-3 gap-1">
                <span className="text-muted-foreground">Aadhar ID</span>
                <span className="col-span-2 font-mono">
                  {admin.aadhar_id.replace(/(\d{4})/g, "$1 ").trim()}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MailIcon className="h-5 w-5" />
                Contact Information
              </CardTitle>
              <CardDescription>How to reach the administrator</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {type == "Admin" ||
                (type == "Monitor" && (
                  <>
                    <div className="grid grid-cols-3 gap-1">
                      <span className="text-muted-foreground">Email</span>
                      <span className="col-span-2 break-all">
                        {admin.email}
                      </span>
                    </div>
                    <Separator />
                  </>
                ))}

              <div className="grid grid-cols-3 gap-1">
                <span className="text-muted-foreground">Phone</span>
                <span className="col-span-2 font-mono">
                  {admin.contact_number || "Not provided"}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BriefcaseIcon className="h-5 w-5" />
                Professional Details
              </CardTitle>
              <CardDescription>Work-related information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-1">
                <span className="text-muted-foreground">Occupation</span>
                <span className="col-span-2">
                  {admin.occupation || "Unemployed"}
                </span>
              </div>
              <Separator />

              <div className="grid grid-cols-3 gap-1">
                <span className="text-muted-foreground">Joined On</span>
                <span className="col-span-2">
                  {formatDate(admin.date_of_joining)}
                </span>
              </div>
              <Separator />

              <div className="grid grid-cols-3 gap-1">
                <span className="text-muted-foreground">Service</span>
                <span className="col-span-2">
                  {(() => {
                    const joinDate = new Date(admin.date_of_joining);
                    const today = new Date();
                    const years = today.getFullYear() - joinDate.getFullYear();
                    const months = today.getMonth() - joinDate.getMonth();

                    if (months < 0) {
                      return `${years - 1} years, ${months + 12} months`;
                    }
                    return `${years} years, ${months} months`;
                  })()}
                </span>
              </div>
              {type == "Employee" && (
                <>
                  <Separator />
                  <div className="grid grid-cols-3 gap-1">
                    <span className="text-muted-foreground">Position</span>
                    <span className="col-span-2">
                      {getPositionLabel(admin.position)}
                    </span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCapIcon className="h-5 w-5" />
                Educational Background
              </CardTitle>
              <CardDescription>Academic qualifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-1">
                <span className="text-muted-foreground">Qualification</span>
                <span className="col-span-2">
                  {getQualificationLabel(admin.educational_qualification) ||
                    "Not specified"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
