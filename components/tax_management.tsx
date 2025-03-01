"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TaxAllocationTable from "./tax_employee";
import TaxAllocator from "./tax_allocate";

// Define citizen type based on TaxAllocator props
type CitizenType = {
  name: string;
  age: number;
  aadhar_id: string;
  contact_number: string;
  occupation: string;
  dob: Date;
  educational_qualification: string;
};
type TaxType = {
  tax_id: number;
  tax_type: string;
  amount: number;
  due_date: Date;
  citizen_name: string;
  payment_date: Date;
  name: string;
};

interface TaxManagementWrapperProps {
  citizenList?: CitizenType[];
  taxList?: TaxType[];
}

export default function TaxManagementWrapper({
  citizenList = [],
  taxList = [],
}: TaxManagementWrapperProps) {
  // State to track the active tab
  const [activeTab, setActiveTab] = useState("allocation-table");

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6 ml-4 text-slate-800">
        Tax Management Portal
      </h1>

      <Tabs
        defaultValue="allocation-table"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-2">
          <TabsTrigger value="allocation-table" className="text-base">
            View All Tax
          </TabsTrigger>
          <TabsTrigger value="allocator" className="text-base">
            Impose Tax
          </TabsTrigger>
        </TabsList>

        <TabsContent value="allocation-table" className="mt-0">
          <TaxAllocationTable taxList={taxList} />
        </TabsContent>

        <TabsContent value="allocator" className="mt-0">
          <TaxAllocator citizenList={citizenList} addOption={true} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
