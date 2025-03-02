"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  ComposedChart,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";

import { z } from "zod";
import {
  Wheat,
  Tractor,
  Sprout,
  DollarSign,
  BarChart3,
  PieChartIcon,
  Layers,
  IndianRupee,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

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

// Define the crop types from the provided code
const cropTypes = [
  { value: "wheat", label: "Wheat" },
  { value: "corn", label: "Corn" },
  { value: "soybean", label: "Soybean" },
  { value: "rice", label: "Rice" },
  { value: "uncultivated", label: "Uncultivated" },
  { value: "other", label: "Other" },
];

// Color schemes for charts
const COLORS = {
  crops: ["#fd7f6f", "#ffb55a", "#ef6115", "#5ad45a", "#8bd3c7", "#5a9ed4"],
  yield: ["#16a34a", "#15803d", "#166534", "#14532d", "#052e16"],
  valuation: ["#0ea5e9", "#0284c7", "#0369a1", "#075985", "#0c4a6e"],
};

export default function AgriculturalInfographics({
  landHoldings = [],
}: {
  landHoldings: LandHolding[];
}) {
  const [data, setData] = useState<LandHolding[]>(landHoldings);
  const [selectedCropType, setSelectedCropType] = useState<string | null>(null);
  const [selectedOwner, setSelectedOwner] = useState<string | null>(null);

  useEffect(() => {
    setData(landHoldings);
  }, [landHoldings]);

  // Get unique owners
  const uniqueOwners = Array.from(new Set(data.map((item) => item.owner_name)));

  // Filter data based on selections
  const filteredData = data.filter((item) => {
    if (selectedCropType && item.crop_type !== selectedCropType) return false;
    if (selectedOwner && item.owner_name !== selectedOwner) return false;
    return true;
  });

  // Calculate total statistics
  const calculateTotalStats = () => {
    let totalArea = 0;
    let totalValue = 0;
    let totalYield = 0;
    const processedRecords = new Set<string>();

    filteredData.forEach((item) => {
      if (!processedRecords.has(item.record_id)) {
        processedRecords.add(item.record_id);
        totalArea += parseFloat(item.land_area.toString());
        totalValue += parseFloat(item.valuation.toString());
        totalYield += parseFloat(item.yield.toString());
      }
    });

    const uniqueRecordCount = processedRecords.size;

    return {
      totalArea,
      totalValue,
      totalYield,
      averageArea: uniqueRecordCount ? totalArea / uniqueRecordCount : 0,
      averageValue: uniqueRecordCount ? totalValue / uniqueRecordCount : 0,
      averageYield: uniqueRecordCount ? totalYield / uniqueRecordCount : 0,
      yieldPerAcre: totalArea ? totalYield / totalArea : 0,
      valuePerAcre: totalArea ? totalValue / totalArea : 0,
      plotCount: uniqueRecordCount,
    };
  };

  const stats = calculateTotalStats();

  // Generate crop distribution data
  const generateCropDistributionData = () => {
    const cropAreas: Record<string, number> = {};
    const processedRecords = new Set<string>();

    filteredData.forEach((item) => {
      if (!processedRecords.has(item.record_id)) {
        processedRecords.add(item.record_id);

        if (cropAreas[item.crop_type]) {
          cropAreas[item.crop_type] += parseFloat(item.land_area.toString());
        } else {
          cropAreas[item.crop_type] = parseFloat(item.land_area.toString());
        }
      }
    });

    return Object.entries(cropAreas).map(([name, value]) => ({
      name,
      value,
    }));
  };

  // Generate crop yield data
  const generateCropYieldData = () => {
    const cropYields: Record<string, { totalYield: number; area: number }> = {};
    const processedRecords = new Set<string>();

    filteredData.forEach((item) => {
      if (!processedRecords.has(item.record_id)) {
        processedRecords.add(item.record_id);

        if (cropYields[item.crop_type]) {
          cropYields[item.crop_type].totalYield += parseFloat(
            item.yield.toString()
          );
          cropYields[item.crop_type].area += parseFloat(
            item.land_area.toString()
          );
        } else {
          cropYields[item.crop_type] = {
            totalYield: parseFloat(item.yield.toString()),
            area: parseFloat(item.land_area.toString()),
          };
        }
      }
    });

    return Object.entries(cropYields).map(([name, data]) => ({
      name,
      totalYield: data.totalYield,
      yieldPerAcre: data.area > 0 ? data.totalYield / data.area : 0,
      area: data.area,
    }));
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-md shadow-md">
          <p className="font-medium">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value.toLocaleString()} ${
                entry.unit || ""
              }`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="p-6 w-full bg-slate-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          Agricultural Data Insights
        </h1>
        <p className="text-slate-600">
          Comprehensive visualization of agricultural land holdings and
          productivity
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Wheat className="h-5 w-5 text-amber-600" />
          <Select
            value={selectedCropType || ""}
            onValueChange={(value) => setSelectedCropType(value || null)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by crop" />
            </SelectTrigger>
            <SelectContent>
              {cropTypes.map((crop) => (
                <SelectItem key={crop.value} value={crop.label}>
                  {crop.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-blue-600" />
          <Select
            value={selectedOwner || ""}
            onValueChange={(value) => setSelectedOwner(value || null)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by owner" />
            </SelectTrigger>
            <SelectContent>
              {uniqueOwners.map((owner) => (
                <SelectItem key={owner} value={owner}>
                  {owner}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {(selectedCropType || selectedOwner) && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedCropType(null);
              setSelectedOwner(null);
            }}
            className="ml-2"
          >
            Clear Filters
          </Button>
        )}

        <div className="ml-auto">
          <Badge variant="outline" className="bg-slate-100 text-slate-700">
            {stats.plotCount} Land Plots
          </Badge>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Land Area Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Land Area</CardDescription>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl text-slate-800">
                {stats.totalArea.toLocaleString()}{" "}
                <span className="text-sm font-normal">acres</span>
              </CardTitle>
              <Layers className="h-6 w-6 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500">
              Average {stats.averageArea.toFixed(1)} acres per plot
            </p>
          </CardContent>
        </Card>

        {/* Total Valuation Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Valuation</CardDescription>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl text-slate-800">
                {formatCurrency(stats.totalValue)}
              </CardTitle>
              <IndianRupee className="h-6 w-6 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500">
              {formatCurrency(stats.valuePerAcre)} per acre
            </p>
          </CardContent>
        </Card>

        {/* Total Yield Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Yield</CardDescription>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl text-slate-800">
                {stats.totalYield.toLocaleString()}{" "}
                <span className="text-sm font-normal">units</span>
              </CardTitle>
              <Sprout className="h-6 w-6 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500">
              {stats.yieldPerAcre.toFixed(1)} units per acre
            </p>
          </CardContent>
        </Card>

        {/* Productivity Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Productivity Index</CardDescription>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl text-slate-800">
                {(stats.yieldPerAcre / 5).toFixed(1)}
              </CardTitle>
              <Tractor className="h-6 w-6 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Low</span>
                <span>High</span>
              </div>
              <Progress
                value={(stats.yieldPerAcre / 10) * 100}
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Tabs */}
      <TooltipProvider>
        <Tabs defaultValue="crop-distribution" className="w-full">
          <TabsList className="mb-4 w-full grid grid-cols-2 gap-4">
            <TabsTrigger
              value="crop-distribution"
              className="flex items-center gap-1"
            >
              <PieChartIcon className="h-4 w-4" />
              <span>Crop Distribution</span>
            </TabsTrigger>
            <TabsTrigger
              value="yield-analysis"
              className="flex items-center gap-1"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Yield Analysis</span>
            </TabsTrigger>
          </TabsList>

          {/* Crop Distribution Tab */}
          <TabsContent value="crop-distribution" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Land Area by Crop Type</CardTitle>
                  <CardDescription>
                    Distribution of land area across different crop types
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[320px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={generateCropDistributionData()}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                          outerRadius={130}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {generateCropDistributionData().map(
                            (entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS.crops[index % COLORS.crops.length]}
                              />
                            )
                          )}
                        </Pie>
                        <Tooltip
                          formatter={(value) => [
                            typeof value === "number"
                              ? `${value.toFixed(1)} acres`
                              : value,
                            "Land Area",
                          ]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Crop Type Statistics</CardTitle>
                  <CardDescription>
                    Detailed breakdown of agricultural metrics by crop type
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200">
                          <th className="text-left py-3 px-4 font-semibold text-slate-700">
                            Crop Type
                          </th>
                          <th className="text-right py-3 px-4 font-semibold text-slate-700">
                            Land Area (acres)
                          </th>
                          <th className="text-right py-3 px-4 font-semibold text-slate-700">
                            % of Total
                          </th>
                          <th className="text-right py-3 px-4 font-semibold text-slate-700">
                            Total Yield
                          </th>
                          <th className="text-right py-3 px-4 font-semibold text-slate-700">
                            Yield/Acre
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {generateCropYieldData().map((crop, index) => (
                          <tr
                            key={index}
                            className="border-b border-slate-100 hover:bg-slate-50"
                          >
                            <td className="py-3 px-4 font-medium text-slate-800">
                              {crop.name}
                            </td>
                            <td className="py-3 px-4 text-right text-slate-700">
                              {parseFloat(crop.area.toString()).toFixed(1)}
                            </td>
                            <td className="py-3 px-4 text-right text-slate-700">
                              {stats.totalArea > 0
                                ? ((crop.area / stats.totalArea) * 100).toFixed(
                                    1
                                  )
                                : 0}
                              %
                            </td>
                            <td className="py-3 px-4 text-right text-slate-700">
                              {crop.totalYield.toFixed(1)}
                            </td>
                            <td className="py-3 px-4 text-right text-slate-700">
                              {crop.yieldPerAcre.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Yield Analysis Tab */}
          <TabsContent value="yield-analysis" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Yield by Crop Type</CardTitle>
                  <CardDescription>
                    Comparison of total yield across different crop types
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[320px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={generateCropYieldData()}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar
                          dataKey="totalYield"
                          name="Total Yield"
                          fill="#16a34a"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Yield Efficiency</CardTitle>
                  <CardDescription>
                    Yield per acre for each crop type
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[320px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={generateCropYieldData()}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar
                          dataKey="yieldPerAcre"
                          name="Yield per Acre"
                          fill="#3b82f6"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </TooltipProvider>
    </div>
  );
}
