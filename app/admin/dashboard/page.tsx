"use client";

import CitizenTable from "@/components/citizen_info";
import { LogOut } from "lucide-react";
import React, { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { getUser } from "@/lib/actions/getUser";
import { getEmployee } from "@/lib/actions/getEmployee";
import { useRouter } from "next/navigation";
import { getCitizen } from "@/lib/actions/getCitizen";
import { z } from "zod";
import EmployeeTable from "@/components/employee_info";
import MonitorTable from "@/components/monitor_info";
import { getMonitor } from "@/lib/actions/getMonitor";

const handleSignOut = async () => {
  await signOut({ callbackUrl: "/api/auth/signin" });
};

interface SidebarItem {
  id: string;
  label: string;
}

const sidebarItems: SidebarItem[] = [
  { id: "Citizen", label: "Citizen" },
  { id: "Panchayat Employee", label: "Panchayat Employee" },
  { id: "Government Monitors", label: "Government Monitors" },
  { id: "Personal Info", label: "Personal Info" },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const citizenSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  aadhar_id: z.string().email({ message: "Invalid email address." }),
  age: z.number(),
  contact_number: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits." }),
  occupation: z.string({ required_error: "Occupation is required." }),
  dob: z.date({ required_error: "Date of birth is required." }),
  educational_qualification: z.string({
    required_error: "Qualification is required.",
  }),
});

type citizentype = z.infer<typeof citizenSchema>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const employeeSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  aadhar_id: z
    .string()
    .length(12, { message: "Aadhaar must be exactly 12 digits." }),
  contact_number: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits." }),
  position: z.string({ required_error: "Position is required." }),
  dob: z.date({ required_error: "Date of birth is required." }),
  date_of_joining: z.date({ required_error: "Date of joining is required." }),
  salary: z
    .number({ required_error: "Salary is required" })
    .min(0, { message: "Salary cannot be negative" }),
  educational_qualification: z.string({
    required_error: "Qualification is required.",
  }),
});

type employeeType = z.infer<typeof employeeSchema>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

const Sidebar = ({
  activeItem,
  setActiveItem,
  isOpen,
  setIsOpen,
}: {
  activeItem: string;
  setActiveItem: (id: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-30 w-64 bg-white h-screen border-r border-gray-200 shadow-lg md:shadow-none transform ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } transition-transform duration-300 ease-in-out md:translate-x-0 h-full`}
      >
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h1 className="text-xl font-bold">Admin Options</h1>
          <button
            className="md:hidden text-gray-600"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>
        </div>
        <nav className="mt-6">
          <ul className="space-y-2 px-2">
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setActiveItem(item.id);
                    if (window.innerWidth < 768) {
                      setIsOpen(false);
                    }
                  }}
                  className={`flex items-center w-full p-3 rounded-md transition-colors ${
                    activeItem === item.id
                      ? "bg-indigo-900 text-white"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
          <button
            onClick={handleSignOut}
            className="flex items-center w-full p-3 rounded-md transition-colors hover:bg-gray-100 text-gray-700"
          >
            <LogOut size={24} className="mr-2" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

// Header component for mobile
const Header = ({ setIsOpen }: { setIsOpen: (isOpen: boolean) => void }) => {
  return (
    <header className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center shadow-sm">
      <button
        className="te</svg>xt-gray-600 mr-4"
        onClick={() => setIsOpen(true)}
      >
        ☰
      </button>
      <h1 className="text-lg font-bold text-blue-600">MyApp</h1>
    </header>
  );
};

// Main content component
const Content = ({ activeItem }: { activeItem: string }) => {
  const [citizens, setCitizens] = useState<citizentype[]>([]);
  const [employees, setEmployees] = useState<employeeType[]>([]);
  const [monitors, setMonitors] = useState<monitorType[]>([]);
  useEffect(() => {
    const fetchCitizens = async () => {
      try {
        const data = await getCitizen();
        console.log(data.user);
        setCitizens(data.user);
      } catch (e) {
        console.error("Error fetching citizens", e);
      }
    };
    const fetchEmployees = async () => {
      try {
        const data = await getEmployee();
        console.log(data.user);
        setEmployees(data.user);
      } catch (e) {
        console.error("Error fetching employees", e);
      }
    };
    const fetchMonitors = async () => {
      try {
        const data = await getMonitor();
        console.log(data.user);
        setMonitors(data.user);
      } catch (e) {
        console.error("Error fetching monitors", e);
      }
    };
    fetchMonitors();
    fetchEmployees();
    fetchCitizens();
  }, []);
  switch (activeItem) {
    case "Citizen":
      return <CitizenTable citizenList={citizens} addOption={true} />;
    case "Panchayat Employee":
      return <EmployeeTable employeeList={employees} />;
    case "Government Monitors":
      return <MonitorTable monitorList={monitors} />;
    case "Personal Info":
      return <CitizenTable citizenList={citizens} addOption={true} />;
    default:
      return <CitizenTable citizenList={citizens} addOption={true} />;
  }
};

// Main page component
export default function Page() {
  const [activeItem, setActiveItem] = useState("Citizen");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [, setIsMobile] = useState(false);
  const router = useRouter();

  // Check if we're on a mobile device on initial render and window resize
  useEffect(() => {
    const checkUserType = async () => {
      const { user } = await getUser();
      if (!user) {
        router.push("/");
      }
      if (user.occupation !== "System Administrator") {
        router.push("/");
      }
    };
    checkUserType();
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false);
      }
    };

    // Check on initial render
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile);

    // Clean up event listener
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header setIsOpen={setIsSidebarOpen} />
      <div className="flex min-h-screen pt-0 md:pt-0">
        <Sidebar
          activeItem={activeItem}
          setActiveItem={setActiveItem}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />
        <main className="flex-1 overflow-y-auto">
          <Content activeItem={activeItem} />
        </main>
      </div>
    </div>
  );
}
