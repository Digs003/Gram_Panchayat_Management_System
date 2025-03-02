"use client";

import { LogOut } from "lucide-react";
import React, { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { z } from "zod";
import EnvironmentalDataTable from "@/components/environmental_info";
import CensusDataTable from "@/components/census_info";
import AssetManagementTable from "@/components/asset_management";
import { getEnvironmentData } from "@/lib/actions/getEnvironmentData";
import { getCensusData } from "@/lib/actions/getCensusData";
import { getAssetData } from "@/lib/actions/getAssetData";
import TaxTable from "@/components/tax_citizen";
import { getTaxData } from "@/lib/actions/getTaxData";
import PersonalProfile from "@/components/personal_info";
import { getUser } from "@/lib/actions/getUser";
import LandHoldingsTable from "@/components/agri_info";
import { getAgriData } from "@/lib/actions/getAgriData";
import CitizenWelfareSchemes from "@/components/schme_citizen";
import { SchemeType } from "@/components/add_scheme";
import { getAllSchemes } from "@/lib/actions/getAllSchemes";
import { CertificateTable } from "@/components/certificate";
import { getCertificates } from "@/lib/actions/getCertificates";
import {
  VaccinationRecord,
  VaccinationTable,
} from "@/components/vaccination_table";
import { getVaccinations } from "@/lib/actions/getVaccinations";

const handleSignOut = async () => {
  await signOut({ callbackUrl: "/api/auth/signin" });
};

interface SidebarItem {
  id: string;
  label: string;
}

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const landHoldingSchema = z.object({
  record_id: z.string().min(0, { message: "Plot number is required" }),
  land_area: z.coerce
    .number()
    .positive({ message: "Land area must be positive" }),
  crop_type: z.string().min(1, { message: "Crop type is required" }),
  valuation: z.coerce
    .number()
    .positive({ message: "Valuation must be positive" }),
  yield: z.coerce.number().positive({ message: "Yield must be positive" }),
  owner_name: z.string().min(1, { message: "Owner name is required" }),
});

// Define the LandHolding type
type LandHolding = z.infer<typeof landHoldingSchema>;

const sidebarItems: SidebarItem[] = [
  { id: "Tax Details", label: "Tax Details" },
  { id: "Agricultural Land", label: "Agricultural Land" },
  { id: "Welfare Schemes", label: "Welfare Schemes" },
  { id: "Certificates", label: "Certificates" },
  { id: "Vaccinations", label: "Vaccinations" },
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const censusSchema = z.object({
  year: z
    .number({ required_error: "Year is required" })
    .int({ message: "Year must be an integer" })
    .min(1900, { message: "Year must be 1900 or later" })
    .max(new Date().getFullYear(), { message: "Year cannot be in the future" }),
  total_population: z
    .number({ required_error: "Total population is required" })
    .int({ message: "Population must be an integer" })
    .min(0, { message: "Population cannot be negative" }),
  male_population: z
    .number({ required_error: "Male population is required" })
    .int({ message: "Population must be an integer" })
    .min(0, { message: "Population cannot be negative" }),
  female_population: z
    .number({ required_error: "Female population is required" })
    .int({ message: "Population must be an integer" })
    .min(0, { message: "Population cannot be negative" }),
  literacy_rate: z
    .number({ required_error: "Literacy rate is required" })
    .min(0, { message: "Rate cannot be negative" })
    .max(100, { message: "Rate cannot exceed 100%" }),
  birth_rate: z
    .number({ required_error: "Birth rate is required" })
    .min(0, { message: "Rate cannot be negative" }),
  death_rate: z
    .number({ required_error: "Death rate is required" })
    .min(0, { message: "Rate cannot be negative" }),
});

type CensusDataType = z.infer<typeof censusSchema> & {
  census_id: number;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const assetSchema = z.object({
  asset_name: z.string().min(1, { message: "Asset name is required" }).max(100),
  quantity: z
    .number()
    .int()
    .min(0, { message: "Quantity must be 0 or greater" }),
  locality: z.string().min(1, { message: "Locality is required" }).max(100),
  installation_year: z
    .number()
    .int()
    .min(1900, { message: "Year must be 1900 or later" })
    .max(new Date().getFullYear()),
  amount_spent: z
    .number()
    .min(0, { message: "Amount spent must be 0 or greater" }),
});

type AssetType = z.infer<typeof assetSchema> & {
  asset_id: number;
};

type TaxType = {
  tax_id: number;
  tax_type: string;
  amount: number;
  due_date: Date;
  payment_date: Date | null;
};

type CertificateType = {
  certificate_id: number;
  certificate_type: string;
  issue_date: string;
  validity_period: string;
  citizen_id?: number;
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
          <h1 className="text-xl font-bold">Citizen Options</h1>
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
  const [censusList, setCensusList] = useState<CensusDataType[]>([]);
  const [assetList, setAssetList] = useState<AssetType[]>([]);
  const [taxList, setTaxList] = useState<TaxType[]>([]);
  const [personalInfo, setPersonalInfo] = useState<personalInfoType>();
  const [agriData, setAgriData] = useState<LandHolding[]>([]);
  const [schemeList, setSchemeList] = useState<SchemeType[]>([]);
  const [certificateList, setCertificateList] = useState<CertificateType[]>([]);
  const [vaccinationList, setVaccinationList] = useState<VaccinationRecord[]>(
    []
  );

  useEffect(() => {
    const fetchEnvironmentaldata = async () => {
      try {
        const data = await getEnvironmentData();
        setEnvironmentalList(data.user);
      } catch (e) {
        console.error("Error fetching citizens", e);
      }
    };
    const fetchCensusData = async () => {
      try {
        const data = await getCensusData();
        setCensusList(data.user);
      } catch (e) {
        console.error("Error fetching citizens", e);
      }
    };
    const fetchAssetData = async () => {
      try {
        const data = await getAssetData();
        setAssetList(data.user);
      } catch (e) {
        console.error("Error fetching citizens", e);
      }
    };
    const fetchTaxData = async () => {
      try {
        const data = await getTaxData();
        setTaxList(data.user);
      } catch (e) {
        console.error("Error fetching citizens", e);
      }
    };
    const fetchPersonalInfo = async () => {
      try {
        const data = await getUser();
        setPersonalInfo(data.user);
      } catch (e) {
        console.error("Error fetching citizens", e);
      }
    };
    const fetchAgriData = async () => {
      try {
        const data = await getAgriData();
        setAgriData(data.user);
      } catch (e) {
        console.error("Error fetching citizens", e);
      }
    };
    const fetchWelfareSchemes = async () => {
      try {
        const data = await getAllSchemes();
        setSchemeList(data.user);
      } catch (e) {
        console.error("Error fetching welfare schemes", e);
      }
    };
    const fetchCertificates = async () => {
      try {
        const data = await getCertificates();
        setCertificateList(data.user);
      } catch (e) {
        console.error("Error fetching certificates", e);
      }
    };
    const fetchVaccinations = async () => {
      try {
        const data = await getVaccinations();
        setVaccinationList(data.user);
      } catch (e) {
        console.error("Error fetching certificates", e);
      }
    };
    fetchVaccinations();
    fetchCertificates();
    fetchWelfareSchemes();
    fetchAgriData();
    fetchPersonalInfo();
    fetchTaxData();
    fetchAssetData();
    fetchCensusData();
    fetchEnvironmentaldata();
  }, []);
  const handleAddCertificate = async (
    newCertificate: Omit<CertificateType, "certificate_id">
  ) => {
    try {
      const response = await fetch("/api/citizens/addCertificate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCertificate),
      });
      if (!response.ok) {
        alert("Failed to add certificate");
      } else {
        alert("Certificate added successfully");
        const responseData = await response.json();
        const newCertificateWithId = {
          ...newCertificate,
          certificate_id: responseData.certificate_id, // Generate a random ID for demo
        };
        setCertificateList([...certificateList, newCertificateWithId]);
      }
    } catch (e) {
      console.error("Error adding certificate", e);
      alert("Failed to add certificate");
    }
  };
  switch (activeItem) {
    case "Tax Details":
      return <TaxTable taxList={taxList} />;
    case "Agricultural Land":
      return <LandHoldingsTable landHoldings={agriData} citizen={true} />;
    case "Welfare Schemes":
      return <CitizenWelfareSchemes schemeList={schemeList} />;
    case "Environmental Data":
      console.log(environmentalList);
      return (
        <EnvironmentalDataTable
          environmentalList={environmentalList}
          addOption={false}
        />
      );
    case "Vaccinations":
      return (
        <VaccinationTable vaccinations={vaccinationList} adminMode={false} />
      );
    case "Certificates":
      return (
        <CertificateTable
          certificates={certificateList}
          usermode={true}
          onAddCertificate={handleAddCertificate}
        />
      );
    case "Census Data":
      return <CensusDataTable censusList={censusList} addOption={false} />;
    case "Asset Management":
      return <AssetManagementTable assetList={assetList} addOption={false} />;
    case "Personal Info":
      return personalInfo ? (
        <PersonalProfile personalInfo={personalInfo} type={"Citizen"} />
      ) : (
        <div>Loading...</div>
      );

    default:
      return <TaxTable taxList={taxList} />;
  }
};

// Main page component
export default function Page() {
  const [activeItem, setActiveItem] = useState("Citizen");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isMobile, setIsMobile] = useState(false);
  //const router = useRouter();

  // Check if we're on a mobile device on initial render and window resize
  useEffect(() => {
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
