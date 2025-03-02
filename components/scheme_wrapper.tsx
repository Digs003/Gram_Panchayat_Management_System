"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WelfareEmployee from "./scheme_employee";
import WelfareSchemeManager from "./add_scheme";
import { SchemeType } from "./add_scheme";
import { ApplicationType } from "./scheme_employee";

// Define citizen type based on TaxAllocator props

export default function WelfareSchemeWrapper({
  schemeList,
  applicationList,
}: {
  schemeList: SchemeType[];
  applicationList: ApplicationType[];
}) {
  // State to track the active tab
  const [activeTab, setActiveTab] = useState("allocation-table");

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6 ml-4 text-slate-800">
        Welfare Scheme Portal
      </h1>

      <Tabs
        defaultValue="allocation-table"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-2">
          <TabsTrigger value="allocation-table" className="text-base">
            Manage Schemes
          </TabsTrigger>
          <TabsTrigger value="allocator" className="text-base">
            Scheme Applications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="allocation-table" className="mt-0">
          <WelfareSchemeManager schemeList={schemeList} />
        </TabsContent>

        <TabsContent value="allocator" className="mt-0">
          <WelfareEmployee
            schemeList={schemeList}
            applicationList={applicationList}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
