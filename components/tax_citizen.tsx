"use client";

import { useState, useEffect, use } from "react";
import { IndianRupee, Search } from "lucide-react";

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

type TaxType = {
  tax_id: number;
  tax_type: string;
  amount: number;
  due_date: Date;
  payment_date: Date | null;
};

export default function TaxTable({ taxList }: { taxList: TaxType[] }) {
  const [taxData, setTaxData] = useState<TaxType[]>(taxList);
  const [filteredData, setFilteredData] = useState<TaxType[]>(taxList);
  const [searchTerm, setSearchTerm] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [taxStatus, setTaxStatus] = useState("all");
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedTax, setSelectedTax] = useState<TaxType | null>(null);
  const [confirmationText, setConfirmationText] = useState("");

  useEffect(() => {
    setTaxData(taxList);
    setFilteredData(taxList);
  }, [taxList]);

  useEffect(() => {
    let results = taxData.filter((tax) =>
      tax.tax_type.toLowerCase().includes(searchTerm.toLowerCase())
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
      results = results.filter((tax) => tax.payment_date === null);
    } else if (taxStatus === "paid") {
      results = results.filter((tax) => tax.payment_date !== null);
    }
    setFilteredData(results);
  }, [searchTerm, taxData, minAmount, maxAmount, taxStatus]);

  const handlePayment = (tax: TaxType) => {
    setSelectedTax(tax);
    setIsPaymentDialogOpen(true);
  };

  const confirmPayment = async () => {
    if (confirmationText.toLowerCase() === "confirm" && selectedTax) {
      try {
        const response = await fetch(`/api/citizens/paytax`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tax_id: selectedTax.tax_id,
            payment_date: new Date(),
          }),
        });
        if (!response.ok) {
          alert("Failed to pay tax. Please try again later.");
        } else {
          alert("Tax paid successfully");
          const updatedTaxData = taxData.map((tax) =>
            tax.tax_id === selectedTax.tax_id
              ? { ...tax, payment_date: new Date() }
              : tax
          );
          setTaxData(updatedTaxData);
        }
      } catch (e) {
        console.error(e);
        alert("Failed to pay tax. Please try again later.");
      }
      setIsPaymentDialogOpen(false);
      setConfirmationText("");
    }
  };
  const getTaxLabel = (taxType: string) => {
    const tax = taxTypes.find((t) => t.value === taxType);
    return tax ? tax.label : taxType;
  };

  return (
    <div className="p-6 w-full bg-slate-50 min-h-screen">
      <Card className="shadow-sm border-0">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-2xl font-semibold text-slate-800">
            Tax Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search and Filter Bar */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by tax type..."
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
                    Payment Date
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Status
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-10 text-slate-500"
                    >
                      No tax entries found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((tax) => (
                    <TableRow
                      key={tax.tax_id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <TableCell className="font-medium text-slate-800">
                        {getTaxLabel(tax.tax_type)}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {tax.amount}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {new Date(tax.due_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {tax.payment_date
                          ? new Date(tax.payment_date).toLocaleDateString()
                          : "N/A"}
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
                      <TableCell>
                        <Button
                          onClick={() => handlePayment(tax)}
                          disabled={tax.payment_date !== null}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <IndianRupee className="mr-1" />
                          <span>Pay</span>
                        </Button>
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

      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Tax Payment
            </DialogTitle>
          </DialogHeader>
          {selectedTax && (
            <div className="space-y-4">
              <div className="bg-slate-100 p-4 rounded-md">
                <h3 className="text-lg font-semibold mb-2">Tax Bill</h3>
                <p>
                  <strong>Tax Type:</strong> {selectedTax.tax_type}
                </p>
                <p>
                  <strong>Amount Due:</strong> ₹{selectedTax.amount}
                </p>
                <p>
                  <strong>Due Date:</strong>{" "}
                  {new Date(selectedTax.due_date).toLocaleDateString()}
                </p>
              </div>
              <div className="space-y-2">
                <Label>Type &apos;confirm&apos; to proceed with payment:</Label>
                <Input
                  id="confirmation"
                  value={confirmationText}
                  onChange={(e) => setConfirmationText(e.target.value)}
                  className="border-slate-200"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              onClick={() => setIsPaymentDialogOpen(false)}
              variant="outline"
              className="border-slate-200"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmPayment}
              disabled={confirmationText.toLowerCase() !== "confirm"}
              className="bg-green-600 hover:bg-green-700"
            >
              Confirm Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
