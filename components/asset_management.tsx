"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Search, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
import { Badge } from "@/components/ui/badge";
import { getUser } from "@/lib/actions/getUser";

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

export default function AssetManagementTable({
  assetList,
  addOption,
}: {
  assetList: AssetType[];
  addOption: boolean;
}) {
  const [assetData, setAssetData] = useState<AssetType[]>(assetList);
  const [filteredData, setFilteredData] = useState<AssetType[]>(assetList);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<AssetType | null>(null);
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      asset_name: "",
      quantity: 0,
      locality: "",
      installation_year: new Date().getFullYear(),
      amount_spent: 0,
    },
  });

  useEffect(() => {
    setAssetData(assetList);
    setFilteredData(assetList);
  }, [assetList]);

  // Filter asset data when search term changes
  useEffect(() => {
    const results = assetData.filter(
      (asset) =>
        asset.asset_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.locality.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(results);
  }, [searchTerm, assetData]);

  const onSubmit = async (data: z.infer<typeof assetSchema>) => {
    try {
      const { user } = await getUser();
      const response = await fetch("/api/employees/addasset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          asset_name: data.asset_name,
          quantity: data.quantity,
          locality: data.locality,
          installation_year: data.installation_year,
          amount_spent: data.amount_spent,
          aadhar_id: user.aadhar_id,
        }),
      });

      if (!response.ok) {
        alert("Failed to add asset");
      } else {
        alert("Asset added successfully");
        const newAsset = {
          ...data,
          asset_id: Math.max(...assetData.map((a) => a.asset_id)) + 1,
        };
        setAssetData([...assetData, newAsset]);
        setFilteredData([...assetData, newAsset]);
      }
    } catch (error) {
      console.error("Failed to add census data", error);
    }

    // Add the new asset entry with a generated ID

    setIsDialogOpen(false);
    form.reset();
  };

  // Function to open the invoice dialog
  const openInvoiceDialog = (asset: AssetType) => {
    setSelectedAsset(asset);
    setIsInvoiceDialogOpen(true);
  };

  // Function to render the simple invoice bill
  const renderInvoiceBill = () => {
    if (!selectedAsset) return null;

    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Invoice
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span className="font-semibold">Invoice No:</span>
            <span>
              INV-{selectedAsset.asset_id.toString().padStart(4, "0")}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Date:</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
          <div className="border-t border-gray-200 my-4"></div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Asset Name:</span>
              <span>{selectedAsset.asset_name}</span>
            </div>
            <div className="flex justify-between">
              <span>Quantity:</span>
              <span>{selectedAsset.quantity}</span>
            </div>
            <div className="flex justify-between">
              <span>Locality:</span>
              <span>{selectedAsset.locality}</span>
            </div>
            <div className="flex justify-between">
              <span>Installation Year:</span>
              <span>{selectedAsset.installation_year}</span>
            </div>
          </div>
          <div className="border-t border-gray-200 my-4"></div>
          <div className="flex justify-between text-lg font-semibold">
            <span>Total Amount:</span>
            <span>₹{selectedAsset.amount_spent}</span>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-6 w-full bg-slate-50 min-h-screen">
      <Card className="shadow-sm border-0">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-2xl font-semibold text-slate-800">
            Asset Management
          </CardTitle>
          {addOption && (
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Asset
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <div className="mb-6 relative">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by asset name or locality..."
                className="pl-10 bg-slate-50 border-slate-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {searchTerm && (
              <div className="absolute right-3 top-3">
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
                    Asset Name
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Quantity
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Locality
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Installation Year
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Amount Spent (₹)
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 w-10">
                    Invoice
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
                      {searchTerm
                        ? "No assets found matching your search"
                        : "No assets available"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((asset) => (
                    <TableRow
                      key={asset.asset_id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <TableCell className="font-medium text-slate-800">
                        {asset.asset_name}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {asset.quantity}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {asset.locality}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {asset.installation_year}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {asset.amount_spent}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-500 hover:text-blue-600"
                          onClick={() => openInvoiceDialog(asset)}
                        >
                          <FileText className="h-4 w-4" />
                          <span className="sr-only">View invoice</span>
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
            Showing {filteredData.length} of {assetData.length} assets
          </div>
        </CardContent>
      </Card>

      {/* Add Asset Dialog Form */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Add New Asset
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="asset_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700">Asset Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter asset name"
                        {...field}
                        className="border-slate-200"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700">Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter quantity"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          className="border-slate-200"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="installation_year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700">
                        Installation Year
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter year"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          className="border-slate-200"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="locality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700">Locality</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter locality"
                        {...field}
                        className="border-slate-200"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount_spent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700">
                      Amount Spent (₹)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Enter amount"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="border-slate-200"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="border-slate-200"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Add Asset
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Invoice Dialog */}
      <Dialog open={isInvoiceDialogOpen} onOpenChange={setIsInvoiceDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Asset Invoice
            </DialogTitle>
          </DialogHeader>
          {renderInvoiceBill()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
