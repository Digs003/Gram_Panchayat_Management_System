"use client";

import { LogOut } from "lucide-react";
import React, { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { z } from "zod";
import { getUser } from "@/lib/actions/getUser";
import { useRouter } from "next/navigation";
import EnvironmentalDataTable from "@/components/environmental_info";
import CensusDataTable from "@/components/census_info";
import AssetManagementTable from "@/components/asset_management";
import { getEnvironmentData } from "@/lib/actions/getEnvironmentData";

const handleSignOut = async () => {
  await signOut({ callbackUrl: "/api/auth/signin" });
};

interface SidebarItem {
  id: string;
  label: string;
}

const sidebarItems: SidebarItem[] = [
  { id: "Environmental Data", label: "Environmental Data" },
  { id: "Census Data", label: "Census Data" },
  { id: "Asset Management", label: "Asset Management" },
  { id: "Personal Info", label: "Personal Info" },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const environmentalSchema = z.object({
  year: z
    .number({ required_error: "Year is required" })
    .int({ message: "Year must be an integer" })
    .min(1900, { message: "Year must be 1900 or later" })
    .max(new Date().getFullYear(), { message: "Year cannot be in the future" }),
  air_quality_index: z
    .number({ required_error: "Air Quality Index is required" })
    .min(0, { message: "AQI cannot be negative" })
    .max(500, { message: "AQI cannot exceed 500" }),
  water_quality_index: z
    .number({ required_error: "Water Quality Index is required" })
    .min(0, { message: "WQI cannot be negative" })
    .max(100, { message: "WQI cannot exceed 100" }),
  rainfall: z
    .number({ required_error: "Rainfall is required" })
    .min(0, { message: "Rainfall cannot be negative" }),
  forest_cover: z
    .number({ required_error: "Forest cover is required" })
    .min(0, { message: "Forest cover cannot be negative" }),
});

type EnvironmentalDataType = z.infer<typeof environmentalSchema> & {
  data_id: number;
};

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
  const [environmentalList, setEnvironmentalList] = useState<
    EnvironmentalDataType[]
  >([]);
  useEffect(() => {
    const fetchEnvironmentaldata = async () => {
      try {
        const data = await getEnvironmentData();
        setEnvironmentalList(data.user);
      } catch (e) {
        console.error("Error fetching citizens", e);
      }
    };
    fetchEnvironmentaldata();
  }, []);
  switch (activeItem) {
    case "Environmental Data":
      console.log(environmentalList);
      return <EnvironmentalDataTable environmentalList={environmentalList} />;
    case "Census Data":
      return <CensusDataTable />;
    case "Asset Management":
      return <AssetManagementTable />;
    case "Personal Info":
      return <EnvironmentalDataTable environmentalList={environmentalList} />;
    default:
      return <EnvironmentalDataTable environmentalList={environmentalList} />;
  }
};

// Main page component
export default function Page() {
  const [activeItem, setActiveItem] = useState("Citizen");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  // Check if we're on a mobile device on initial render and window resize
  useEffect(() => {
    const checkUserType = async () => {
      const { user } = await getUser();
      if (user.occupation !== "Panchayat Employee") {
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
