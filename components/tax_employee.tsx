"use client";

import { useState, useEffect } from "react";
import { Search, Plus } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { taxTypes } from "./tax_allocate";

// Define Zod schema for tax allocation form

type TaxType = {
  tax_id: number;
  tax_type: string;
  amount: number;
  due_date: Date;
  citizen_name: string;
  payment_date: Date;
  name: string;
};

export default function TaxAllocationTable({
  taxList,
}: {
  taxList: TaxType[];
}) {
  // Initial state is empty array instead of props
  const [taxData, setTaxData] = useState<TaxType[]>(taxList);
  const [filteredData, setFilteredData] = useState<TaxType[]>(taxList);
  const [searchTerm, setSearchTerm] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [taxStatus, setTaxStatus] = useState("all");
  // Form state with Zod

  useEffect(() => {
    setTaxData(taxList);
    setFilteredData(taxList);
  }, [taxList]);

  useEffect(() => {
    let results = taxData.filter(
      (tax) =>
        tax.tax_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tax.citizen_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (minAmount !== "") {
      results = results.filter(
        (tax) => tax.amount >= Number.parseFloat(minAmount)
      );
    }
    if (maxAmount !== "") {
      results = results.filter(
        (tax) => tax.amount <= Number.parseFloat(maxAmount)
      );
    }

    if (taxStatus === "pending") {
      results = results.filter((tax) => !tax.payment_date);
    } else if (taxStatus === "paid") {
      results = results.filter((tax) => tax.payment_date);
    }

    setFilteredData(results);
  }, [searchTerm, taxData, minAmount, maxAmount, taxStatus]);

  const getTaxTypeLabel = (taxType: string) => {
    const type = taxTypes.find((type) => type.value === taxType);
    return type ? type.label : taxType;
  };

  return (
    <div className="p-6 w-full bg-slate-50 min-h-screen">
      <Card className="shadow-sm border-0">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-2xl font-semibold text-slate-800 mb-4">
            Tax Payment Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search and Filter Bar */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by tax type or citizen..."
                className="pl-10 bg-slate-50 border-slate-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                placeholder="Min Amount"
                className="bg-slate-50 border-slate-200"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
              />
              <span>-</span>
              <Input
                type="number"
                placeholder="Max Amount"
                className="bg-slate-50 border-slate-200"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
              />
            </div>
            <Select value={taxStatus} onValueChange={setTaxStatus}>
              <SelectTrigger className="bg-slate-50 border-slate-200">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Taxes</SelectItem>
                <SelectItem value="pending">Pending Taxes</SelectItem>
                <SelectItem value="paid">Paid Taxes</SelectItem>
              </SelectContent>
            </Select>
            {searchTerm && (
              <div className="flex items-center justify-end">
                <Badge variant="outline" className="bg-slate-100">
                  {filteredData.length} results
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
                    Tax Type
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Amount (₹)
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Due Date
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Citizen Name
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-10 text-slate-500"
                    >
                      {taxData.length === 0
                        ? "No tax allocations yet. Click 'Allocate New Tax' to get started."
                        : "No tax entries found matching your criteria"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((tax) => (
                    <TableRow
                      key={tax.tax_id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <TableCell className="font-medium text-slate-800">
                        {getTaxTypeLabel(tax.tax_type)}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {tax.amount}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {new Date(tax.due_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {tax.name}
                      </TableCell>
                      <TableCell>
                        {tax.payment_date ? (
                          <Badge className="bg-green-100 text-green-800">
                            Paid
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            Pending
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Count summary */}
          <div className="mt-4 text-sm text-slate-500">
            Showing {filteredData.length} of {taxData.length} tax entries
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
