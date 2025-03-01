"use client";

import { useState, useEffect } from "react";
import { Check, ChevronsUpDown, Edit, Plus, PieChart, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define the crop types
const cropTypes = [
  { value: "wheat", label: "Wheat" },
  { value: "corn", label: "Corn" },
  { value: "soybean", label: "Soybean" },
  { value: "rice", label: "Rice" },
  { value: "uncultivated", label: "Uncultivated" },
  { value: "other", label: "Other" },
];

// Define the form schema for land holding
const landHoldingSchema = z.object({
  record_id: z.string().min(1, { message: "Plot number is required" }),
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

// Sample data for demonstration
const sampleLandHoldings: LandHolding[] = [
  {
    record_id: "PLT-001",
    land_area: 150.75,
    crop_type: "Wheat",
    valuation: 75000.0,
    yield: 450.25,
    owner_name: "John Smith",
  },
  {
    record_id: "PLT-002",
    land_area: 200.5,
    crop_type: "Corn",
    valuation: 95000.0,
    yield: 600.75,
    owner_name: "Emily Johnson",
  },
  {
    record_id: "PLT-003",
    land_area: 75.25,
    crop_type: "Soybean",
    valuation: 45000.0,
    yield: 225.5,
    owner_name: "Michael Brown",
  },
  {
    record_id: "PLT-004",
    land_area: 300.0,
    crop_type: "Uncultivated",
    valuation: 120000.0,
    yield: 900.0,
    owner_name: "Sarah Davis",
  },
  {
    record_id: "PLT-005",
    land_area: 125.5,
    crop_type: "Uncultivated",
    valuation: 62500.0,
    yield: 375.25,
    owner_name: "Robert Wilson",
  },
  {
    record_id: "PLT-006",
    land_area: 175.75,
    crop_type: "Other",
    valuation: 85000.0,
    yield: 525.5,
    owner_name: "Jennifer Lee",
  },
  {
    record_id: "PLT-007",
    land_area: 250.25,
    crop_type: "Corn",
    valuation: 110000.0,
    yield: 750.75,
    owner_name: "David Martinez",
  },
  {
    record_id: "PLT-008",
    land_area: 100.0,
    crop_type: "Soybean",
    valuation: 55000.0,
    yield: 300.0,
    owner_name: "Lisa Thompson",
  },
  {
    record_id: "PLT-009",
    land_area: 225.5,
    crop_type: "Rice",
    valuation: 105000.0,
    yield: 675.25,
    owner_name: "James Anderson",
  },
  {
    record_id: "PLT-010",
    land_area: 150.25,
    crop_type: "Other",
    valuation: 72500.0,
    yield: 450.75,
    owner_name: "Patricia Garcia",
  },
  {
    record_id: "PLT-011",
    land_area: 180.0,
    crop_type: "Wheat",
    valuation: 85000.0,
    yield: 540.0,
    owner_name: "John Smith",
  },
  {
    record_id: "PLT-012",
    land_area: 120.5,
    crop_type: "Corn",
    valuation: 60000.0,
    yield: 360.0,
    owner_name: "Emily Johnson",
  },
];

// Colors for charts
const COLORS = [
  "#fd7f6f",
  "#ffb55a",
  "#ef6115",
  "#5ad45a",
  "#8bd3c7",
  "#5a9ed4",
];

export default function LandHoldingsTable({
  landHoldings = sampleLandHoldings,
}: {
  landHoldings?: LandHolding[];
}) {
  const [data, setData] = useState<LandHolding[]>(landHoldings);
  const [filteredData, setFilteredData] = useState<LandHolding[]>(landHoldings);

  // Filter states
  const [filteredCropTypes, setFilteredCropTypes] = useState(cropTypes);
  const [selectedCropTypes, setSelectedCropTypes] = useState<string[]>([]);
  const [minLandArea, setMinLandArea] = useState<string>("");
  const [maxLandArea, setMaxLandArea] = useState<string>("");
  const [minValuation, setMinValuation] = useState<string>("");
  const [maxValuation, setMaxValuation] = useState<string>("");
  const [openCropTypePopover, setOpenCropTypePopover] = useState(false);
  const [minTotalLandHolding, setMinTotalLandHolding] = useState<string>("");
  const [maxTotalLandHolding, setMaxTotalLandHolding] = useState<string>("");

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isVisualizationDialogOpen, setIsVisualizationDialogOpen] =
    useState(false);
  const [currentLandHolding, setCurrentLandHolding] =
    useState<LandHolding | null>(null);

  // Form for adding new land holding
  const addForm = useForm<LandHolding>({
    resolver: zodResolver(landHoldingSchema),
    defaultValues: {
      record_id: "",
      land_area: 0,
      crop_type: "",
      valuation: 0,
      yield: 0,
      owner_name: "",
    },
  });

  // Form for editing land holding
  const editForm = useForm<LandHolding>({
    resolver: zodResolver(landHoldingSchema),
    defaultValues: {
      record_id: "",
      land_area: 0,
      crop_type: "",
      valuation: 0,
      yield: 0,
      owner_name: "",
    },
  });

  useEffect(() => {
    setData(landHoldings);
    setFilteredData(landHoldings);
  }, [landHoldings]);

  // Apply filters whenever any filter changes
  useEffect(() => {
    let results = [...data];

    // Filter by crop type
    if (selectedCropTypes.length > 0) {
      results = results.filter((item) =>
        selectedCropTypes.some(
          (type) => item.crop_type.toLowerCase() === type.toLowerCase()
        )
      );
    }

    // Filter by land area range
    if (minLandArea !== "") {
      results = results.filter(
        (item) => item.land_area >= parseFloat(minLandArea)
      );
    }

    if (maxLandArea !== "") {
      results = results.filter(
        (item) => item.land_area <= parseFloat(maxLandArea)
      );
    }

    // Filter by valuation range
    if (minValuation !== "") {
      results = results.filter(
        (item) => item.valuation >= parseFloat(minValuation)
      );
    }

    if (maxValuation !== "") {
      results = results.filter(
        (item) => item.valuation <= parseFloat(maxValuation)
      );
    }

    setFilteredData(results);
  }, [
    selectedCropTypes,
    minLandArea,
    maxLandArea,
    minValuation,
    maxValuation,
    data,
  ]);

  // Toggle crop type selection
  const toggleCropType = (value: string) => {
    setSelectedCropTypes((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCropTypes([]);
    setMinLandArea("");
    setMaxLandArea("");
    setMinValuation("");
    setMaxValuation("");
    setMinTotalLandHolding("");
    setMaxTotalLandHolding("");
  };

  // Handle adding new land holding
  const onAddSubmit = (formData: LandHolding) => {
    // Check if plot number already exists
    if (data.some((item) => item.record_id === formData.record_id)) {
      addForm.setError("record_id", {
        type: "manual",
        message: "Plot number already exists",
      });
      return;
    }

    const newData = [...data, formData];
    setData(newData);
    setIsAddDialogOpen(false);
    addForm.reset();
  };

  // Handle editing land holding
  const onEditSubmit = (formData: LandHolding) => {
    // Check if plot number already exists and is not the current one
    if (
      formData.record_id !== currentLandHolding?.record_id &&
      data.some((item) => item.record_id === formData.record_id)
    ) {
      editForm.setError("record_id", {
        type: "manual",
        message: "Plot number already exists",
      });
      return;
    }

    const newData = data.map((item) =>
      item.record_id === currentLandHolding?.record_id ? formData : item
    );
    setData(newData);
    setIsEditDialogOpen(false);
    setCurrentLandHolding(null);
  };

  // Open edit dialog with current land holding data
  const openEditDialog = (landHolding: LandHolding) => {
    setCurrentLandHolding(landHolding);
    editForm.reset(landHolding);
    setIsEditDialogOpen(true);
  };

  // Generate visualization data
  const generateCropDistributionData = () => {
    const cropCounts: Record<string, number> = {};

    data.forEach((item) => {
      if (cropCounts[item.crop_type]) {
        cropCounts[item.crop_type] += parseFloat(item.land_area.toString());
      } else {
        cropCounts[item.crop_type] = parseFloat(item.land_area.toString());
      }
    });

    return Object.entries(cropCounts).map(([name, value]) => ({
      name,
      value,
    }));
  };

  // Generate owner holdings data
  const generateOwnerHoldingsData = () => {
    const ownerHoldings: Record<
      string,
      { count: number; totalArea: number; totalValue: number }
    > = {};

    data.forEach((item) => {
      if (ownerHoldings[item.owner_name]) {
        ownerHoldings[item.owner_name].count += 1;
        ownerHoldings[item.owner_name].totalArea += parseFloat(
          item.land_area.toString()
        );
        ownerHoldings[item.owner_name].totalValue += parseFloat(
          item.valuation.toString()
        );
      } else {
        ownerHoldings[item.owner_name] = {
          count: 1,
          totalArea: parseFloat(item.land_area.toString()),
          totalValue: parseFloat(item.valuation.toString()),
        };
      }
    });

    return Object.entries(ownerHoldings).map(([name, stats]) => ({
      name,
      count: stats.count,
      totalArea: stats.totalArea,
      totalValue: stats.totalValue,
    }));
  };

  // Filter owner holdings data based on total land holding range
  const filteredOwnerHoldingsData = () => {
    const ownerHoldings = generateOwnerHoldingsData();
    return ownerHoldings.filter((owner) => {
      const minTotal = minTotalLandHolding
        ? parseFloat(minTotalLandHolding)
        : 0;
      const maxTotal = maxTotalLandHolding
        ? parseFloat(maxTotalLandHolding)
        : Infinity;
      return owner.totalArea >= minTotal && owner.totalArea <= maxTotal;
    });
  };

  // Calculate total statistics
  const calculateTotalStats = () => {
    let totalArea = 0;
    let totalValue = 0;
    let totalYield = 0;

    data.forEach((item) => {
      totalArea += parseFloat(item.land_area.toString());
      totalValue += parseFloat(item.valuation.toString());
      totalYield += parseFloat(item.yield.toString());
    });

    return {
      totalArea,
      totalValue,
      totalYield,
      averageArea: totalArea / data.length,
      averageValue: totalValue / data.length,
      averageYield: totalYield / data.length,
    };
  };

  return (
    <div className="p-6 w-full bg-slate-50 min-h-screen">
      <Card className="shadow-sm border-0">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <div>
            <CardTitle className="text-2xl font-semibold text-slate-800">
              Land Holdings Management
            </CardTitle>
            <CardDescription>
              Manage and analyze agricultural land holdings
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsVisualizationDialogOpen(true)}
              className="flex items-center gap-1"
            >
              <PieChart className="h-4 w-4" />
              <span className="hidden sm:inline">View Analytics</span>
            </Button>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Land Holding</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search Filters */}
          <div className="mb-6 space-y-4">
            <h3 className="text-lg font-medium">Search Filters</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Crop Type Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Crop Type</Label>
                <Popover
                  open={openCropTypePopover}
                  onOpenChange={setOpenCropTypePopover}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {selectedCropTypes.length > 0 ? (
                        <>
                          <span>
                            {selectedCropTypes.length > 2
                              ? `${selectedCropTypes.length} selected`
                              : selectedCropTypes.join(", ")}
                          </span>
                        </>
                      ) : (
                        <span>Select crop types</span>
                      )}
                      <ChevronsUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search crop types..."
                        onValueChange={(search) => {
                          const searchValue = search.toLowerCase();
                          setFilteredCropTypes(
                            cropTypes.filter((type) =>
                              type.label.toLowerCase().includes(searchValue)
                            )
                          );
                        }}
                      />
                      <CommandList>
                        <CommandEmpty>No crop type found.</CommandEmpty>
                        <CommandGroup>
                          {filteredCropTypes.map((type) => (
                            <CommandItem
                              key={type.value}
                              onSelect={() => {
                                toggleCropType(type.label);
                              }}
                            >
                              <div className="flex items-center justify-between w-full">
                                <span>{type.label}</span>
                                {selectedCropTypes.includes(type.label) && (
                                  <Check className="h-4 w-4" />
                                )}
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              {/* Land Area Range Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Land Area Range</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    className="border-slate-200"
                    value={minLandArea}
                    onChange={(e) => setMinLandArea(e.target.value)}
                  />
                  <span>to</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    className="border-slate-200"
                    value={maxLandArea}
                    onChange={(e) => setMaxLandArea(e.target.value)}
                  />
                </div>
              </div>

              {/* Valuation Range Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Valuation Range</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    className="border-slate-200"
                    value={minValuation}
                    onChange={(e) => setMinValuation(e.target.value)}
                  />
                  <span>to</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    className="border-slate-200"
                    value={maxValuation}
                    onChange={(e) => setMaxValuation(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Clear Filters Button */}
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={clearFilters}
                className="text-sm"
              >
                Clear Filters
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-md border border-slate-200 overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-semibold text-slate-700">
                    Record ID
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Land Area
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Crop Type
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Valuation
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Yield
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Owner Name
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-10 text-slate-500"
                    >
                      No land holdings found matching your search criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((holding) => (
                    <TableRow
                      key={holding.record_id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <TableCell className="font-medium text-slate-800">
                        {holding.record_id}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {holding.land_area}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {holding.crop_type}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {holding.valuation}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {holding.yield}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {holding.owner_name}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(holding)}
                          className="h-8 px-2 text-slate-700"
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
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
            Showing {filteredData.length} of {data.length} land holdings
          </div>
        </CardContent>
      </Card>

      {/* Add Land Holding Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Land Holding</DialogTitle>
            <DialogDescription>
              Enter the details for the new land holding record.
            </DialogDescription>
          </DialogHeader>
          <Form {...addForm}>
            <form
              onSubmit={addForm.handleSubmit(onAddSubmit)}
              className="space-y-4"
            >
              <FormField
                control={addForm.control}
                name="record_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Record ID</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., PLT-013" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={addForm.control}
                  name="land_area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Land Area</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addForm.control}
                  name="crop_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Crop Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select crop type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {cropTypes.map((type) => (
                            <SelectItem key={type.value} value={type.label}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={addForm.control}
                  name="valuation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valuation</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addForm.control}
                  name="yield"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Yield</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={addForm.control}
                name="owner_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Owner Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full name of the owner" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Add Land Holding</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Land Holding Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Land Holding</DialogTitle>
            <DialogDescription>
              Update the details for this land holding record.
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form
              onSubmit={editForm.handleSubmit(onEditSubmit)}
              className="space-y-4"
            >
              <FormField
                control={editForm.control}
                name="record_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Record ID</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="land_area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Land Area</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="crop_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Crop Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select crop type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {cropTypes.map((type) => (
                            <SelectItem key={type.value} value={type.label}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="valuation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valuation</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="yield"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Yield</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={editForm.control}
                name="owner_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Owner Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Visualization Dialog */}
      <Dialog
        open={isVisualizationDialogOpen}
        onOpenChange={setIsVisualizationDialogOpen}
      >
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Land Holdings Analytics</DialogTitle>
            <DialogDescription>
              Visual representation of land holdings data
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="crop-distribution">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="crop-distribution">
                Crop Distribution
              </TabsTrigger>
              <TabsTrigger value="owner-holdings">Owner Holdings</TabsTrigger>
              <TabsTrigger value="summary-stats">
                Summary Statistics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="crop-distribution" className="space-y-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={generateCropDistributionData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ percent }) => `${(percent * 100).toFixed(2)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {generateCropDistributionData().map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`₹{value} acres`, "Land Area"]}
                    />
                    <Legend
                      layout="vertical"
                      align="right"
                      verticalAlign="middle"
                      wrapperStyle={{ paddingLeft: "20px" }}
                      content={() => (
                        <div>
                          <h4 className="text-lg font-medium mb-2">
                            Crop Types
                          </h4>
                          <ul className="list-none p-0 m-0">
                            {generateCropDistributionData().map(
                              (entry, index) => (
                                <li
                                  key={`item-${index}`}
                                  className="flex items-center mb-1 mr-10"
                                >
                                  <span
                                    className="block w-3 h-3 mr-2"
                                    style={{
                                      backgroundColor:
                                        COLORS[index % COLORS.length],
                                    }}
                                  ></span>
                                  {entry.name}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
              <div className="text-sm text-slate-600">
                <div className="mt-4">
                  <h4 className="text-lg font-medium mb-2">
                    Crop Type Statistics
                  </h4>
                  <div className="rounded-md border border-slate-200 overflow-hidden">
                    <Table>
                      <TableHeader className="bg-slate-50">
                        <TableRow>
                          <TableHead className="font-semibold">
                            Crop Type
                          </TableHead>
                          <TableHead className="font-semibold">
                            Total Land Area (acres)
                          </TableHead>
                          <TableHead className="font-semibold">
                            Total Valuation
                          </TableHead>
                          <TableHead className="font-semibold">
                            Total Yield
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {generateCropDistributionData().map((crop) => {
                          const cropData = data.filter(
                            (item) => item.crop_type === crop.name
                          );

                          const totalValuation = cropData.reduce(
                            (sum, item) =>
                              sum +
                              parseFloat(item.valuation.toString() || "0"), // Ensure conversion to number
                            0
                          );

                          const totalYield = cropData.reduce(
                            (sum, item) =>
                              sum + parseFloat(item.yield.toString() || "0"), // Ensure conversion to number
                            0
                          );

                          return (
                            <TableRow key={crop.name}>
                              <TableCell className="font-medium">
                                {crop.name}
                              </TableCell>
                              <TableCell>{crop.value.toFixed(2)}</TableCell>
                              <TableCell>₹{totalValuation}</TableCell>
                              <TableCell>{totalYield}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="owner-holdings" className="space-y-4">
              <div className="mt-4"></div>
              <h4 className="text-lg font-medium mb-2">
                Land Holdings by Owner
              </h4>
              <div className="rounded-md border border-slate-200 overflow-hidden">
                <div className="rounded-md border border-slate-200 overflow-hidden">
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 mb-2">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium mx-2">
                          Min Holding (acres)
                        </Label>
                        <Input
                          type="number"
                          placeholder="Min"
                          className="border-slate-200 mx-2"
                          value={minTotalLandHolding}
                          onChange={(e) =>
                            setMinTotalLandHolding(e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium mx-2">
                          Max Holding
                        </Label>
                        <Input
                          type="number"
                          placeholder="Max"
                          className="border-slate-200 mx-2"
                          value={maxTotalLandHolding}
                          onChange={(e) =>
                            setMaxTotalLandHolding(e.target.value)
                          }
                        />
                      </div>
                      <Button
                        variant="outline"
                        onClick={clearFilters}
                        className=" mt-8 w-40 bg-black text-white font-semibold text-sm"
                      >
                        Clear Filters
                      </Button>
                    </div>
                  </div>
                  <Table>
                    <TableHeader className="bg-slate-50">
                      <TableRow>
                        <TableHead className="font-semibold">
                          Owner Name
                        </TableHead>
                        <TableHead className="font-semibold">
                          Number of Plots
                        </TableHead>
                        <TableHead className="font-semibold">
                          Total Area (acres)
                        </TableHead>
                        <TableHead className="font-semibold">
                          Total Value
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOwnerHoldingsData().map((owner) => (
                        <TableRow key={owner.name}>
                          <TableCell className="font-medium">
                            {owner.name}
                          </TableCell>
                          <TableCell>{owner.count}</TableCell>
                          <TableCell>{owner.totalArea.toFixed(2)}</TableCell>
                          <TableCell>₹{owner.totalValue.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="summary-stats" className="space-y-4">
              {(() => {
                const stats = calculateTotalStats();
                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">
                          Total Statistics
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <dl className="space-y-2">
                          <div className="flex justify-between">
                            <dt className="font-medium text-slate-600">
                              Total Land Area:
                            </dt>
                            <dd>{stats.totalArea.toFixed(2)} acres</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="font-medium text-slate-600">
                              Total Valuation:
                            </dt>
                            <dd>₹{stats.totalValue.toFixed(2)}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="font-medium text-slate-600">
                              Total Yield:
                            </dt>
                            <dd>{stats.totalYield.toFixed(2)} units</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="font-medium text-slate-600">
                              Number of Plots:
                            </dt>
                            <dd>{data.length}</dd>
                          </div>
                        </dl>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">
                          Average Statistics
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <dl className="space-y-2">
                          <div className="flex justify-between">
                            <dt className="font-medium text-slate-600">
                              Average Land Area:
                            </dt>
                            <dd>{stats.averageArea.toFixed(2)} acres</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="font-medium text-slate-600">
                              Average Valuation:
                            </dt>
                            <dd>₹{stats.averageValue.toFixed(2)}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="font-medium text-slate-600">
                              Average Yield:
                            </dt>
                            <dd>{stats.averageYield.toFixed(2)} units</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="font-medium text-slate-600">
                              Yield per Acre:
                            </dt>
                            <dd>
                              {(stats.totalYield / stats.totalArea).toFixed(2)}{" "}
                              units/acre
                            </dd>
                          </div>
                        </dl>
                      </CardContent>
                    </Card>

                    <Card className="md:col-span-2">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Key Insights</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 list-disc pl-5">
                          <li>
                            {generateCropDistributionData().sort(
                              (a, b) => b.value - a.value
                            )[0]?.name || "N/A"}{" "}
                            is the most cultivated crop, accounting for
                            {generateCropDistributionData().length > 0
                              ? ` ${(
                                  (generateCropDistributionData().sort(
                                    (a, b) => b.value - a.value
                                  )[0]?.value /
                                    stats.totalArea) *
                                  100
                                ).toFixed(1)}%`
                              : " 0%"}{" "}
                            of total land area.
                          </li>
                          <li>
                            {generateOwnerHoldingsData().sort(
                              (a, b) => b.totalArea - a.totalArea
                            )[0]?.name || "N/A"}{" "}
                            owns the largest amount of land (
                            {generateOwnerHoldingsData().sort(
                              (a, b) => b.totalArea - a.totalArea
                            )[0]?.totalArea || "0"}{" "}
                            acres).
                          </li>
                          <li>
                            The average land holding size is{" "}
                            {stats.averageArea.toFixed(2)} acres per plot.
                          </li>
                          <li>
                            The average valuation is ₹
                            {stats.averageValue.toFixed(2)} per plot, or ₹
                            {(stats.totalValue / stats.totalArea).toFixed(2)}{" "}
                            per acre.
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                );
              })()}
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button onClick={() => setIsVisualizationDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
