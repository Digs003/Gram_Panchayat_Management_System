"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
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
  Area,
  ComposedChart,
} from "recharts";
import { z } from "zod";
import {
  Droplets,
  Wind,
  TreeDeciduous,
  DropletIcon,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  Calendar,
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
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Using the same schema from the provided code
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

// Helper functions from the original component
const getAirQualityClass = (aqi: number) => {
  if (aqi <= 50) return "text-green-600";
  if (aqi <= 100) return "text-yellow-600";
  if (aqi <= 150) return "text-amber-600";
  if (aqi <= 200) return "text-orange-600";
  if (aqi <= 300) return "text-red-600";
  return "text-purple-600";
};

const getAirQualityCategory = (aqi: number) => {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy for Sensitive Groups";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very Unhealthy";
  return "Hazardous";
};

const getWaterQualityClass = (wqi: number) => {
  if (wqi >= 90) return "text-green-600";
  if (wqi >= 70) return "text-blue-600";
  if (wqi >= 50) return "text-yellow-600";
  if (wqi >= 25) return "text-orange-600";
  return "text-red-600";
};

const getWaterQualityCategory = (wqi: number) => {
  if (wqi >= 90) return "Excellent";
  if (wqi >= 70) return "Good";
  if (wqi >= 50) return "Fair";
  if (wqi >= 25) return "Poor";
  return "Very Poor";
};

// Color schemes for charts
const COLORS = {
  air: ["#10b981", "#eab308", "#f59e0b", "#f97316", "#ef4444", "#a855f7"],
  water: ["#ef4444", "#f97316", "#eab308", "#3b82f6", "#10b981"],
  rainfall: ["#0ea5e9", "#0284c7", "#0369a1", "#075985", "#0c4a6e"],
  forest: ["#16a34a", "#15803d", "#166534", "#14532d", "#052e16"],
};

export default function EnvironmentalInfographics({
  environmentalList = [],
}: {
  environmentalList: EnvironmentalDataType[];
}) {
  const [data, setData] = useState<EnvironmentalDataType[]>(environmentalList);
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [yearRange, setYearRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 0,
  });
  const [trendData, setTrendData] = useState<any[]>([]);

  useEffect(() => {
    if (environmentalList.length > 0) {
      setData(environmentalList);

      // Find min and max years
      const years = environmentalList.map((item) => item.year);
      const minYear = Math.min(...years);
      const maxYear = Math.max(...years);
      setYearRange({ min: minYear, max: maxYear });

      // Set default selected year to the most recent
      setSelectedYear(maxYear);

      // Prepare trend data (sorted by year)
      const sortedData = [...environmentalList].sort((a, b) => a.year - b.year);
      setTrendData(sortedData);
    }
  }, [environmentalList]);

  // Filter data based on year selection
  const filteredData =
    yearFilter === "all"
      ? data
      : data.filter((item) => item.year === Number.parseInt(yearFilter));

  // Get the most recent year's data for summary cards
  const latestData = selectedYear
    ? data.find((item) => item.year === selectedYear)
    : data.sort((a, b) => b.year - a.year)[0];

  // Calculate year-over-year changes for the selected year
  const calculateYearOverYearChange = (metric: keyof EnvironmentalDataType) => {
    if (!selectedYear || selectedYear === yearRange.min) return null;

    const currentYearData = data.find((item) => item.year === selectedYear);
    const previousYearData = data.find(
      (item) => item.year === selectedYear - 1
    );

    if (!currentYearData || !previousYearData) return null;

    const currentValue = currentYearData[metric] as number;
    const previousValue = previousYearData[metric] as number;

    const change = currentValue - previousValue;
    const percentChange = (change / previousValue) * 100;

    return {
      change,
      percentChange: Number.parseFloat(percentChange.toFixed(1)),
      increased: change > 0,
    };
  };

  // Prepare data for the pie chart (distribution of latest year)
  const preparePieChartData = () => {
    if (!latestData) return [];

    return [
      {
        name: "Air Quality",
        value: latestData.air_quality_index,
        color: "#ef4444",
      },
      {
        name: "Water Quality",
        value: latestData.water_quality_index,
        color: "#3b82f6",
      },
      {
        name: "Rainfall (mm)",
        value: latestData.rainfall / 10,
        color: "#0ea5e9",
      }, // Scaled for better visualization
      {
        name: "Forest Cover (ha)",
        value: latestData.forest_cover / 1000,
        color: "#16a34a",
      }, // Scaled for better visualization
    ];
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-md shadow-md">
          <p className="font-medium">{`Year: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 w-full bg-slate-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          Environmental Data Insights
        </h1>
        <p className="text-slate-600">
          Comprehensive visualization of environmental metrics over time
        </p>
      </div>

      {/* Year filter and controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-slate-500" />
          <Select
            value={selectedYear?.toString() || ""}
            onValueChange={(value) => setSelectedYear(Number.parseInt(value))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              {data
                .map((item) => item.year)
                .filter((year, index, self) => self.indexOf(year) === index)
                .sort((a, b) => b - a)
                .map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <TooltipProvider>
            <UITooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Select a year to view detailed metrics</p>
              </TooltipContent>
            </UITooltip>
          </TooltipProvider>
        </div>

        <div>
          <Badge variant="outline" className="bg-slate-100 text-slate-700">
            {data.length} Years of Data
          </Badge>
        </div>
      </div>

      {/* Summary Cards */}
      {latestData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Air Quality Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Air Quality Index</CardDescription>
              <div className="flex items-center justify-between">
                <CardTitle
                  className={`text-2xl ${getAirQualityClass(
                    latestData.air_quality_index
                  )}`}
                >
                  {latestData.air_quality_index}
                </CardTitle>
                <Wind
                  className={`h-6 w-6 ${getAirQualityClass(
                    latestData.air_quality_index
                  )}`}
                />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500">
                {getAirQualityCategory(latestData.air_quality_index)}
              </p>

              {calculateYearOverYearChange("air_quality_index") && (
                <div className="flex items-center mt-2">
                  {calculateYearOverYearChange("air_quality_index")
                    ?.increased ? (
                    <ArrowUpRight className="h-4 w-4 text-red-500" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-green-500" />
                  )}
                  <span
                    className={
                      calculateYearOverYearChange("air_quality_index")
                        ?.increased
                        ? "text-red-500"
                        : "text-green-500"
                    }
                  >
                    {Math.abs(
                      calculateYearOverYearChange("air_quality_index")
                        ?.percentChange || 0
                    )}
                    % from previous year
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Water Quality Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Water Quality Index</CardDescription>
              <div className="flex items-center justify-between">
                <CardTitle
                  className={`text-2xl ${getWaterQualityClass(
                    latestData.water_quality_index
                  )}`}
                >
                  {latestData.water_quality_index}
                </CardTitle>
                <Droplets
                  className={`h-6 w-6 ${getWaterQualityClass(
                    latestData.water_quality_index
                  )}`}
                />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500">
                {getWaterQualityCategory(latestData.water_quality_index)}
              </p>

              {calculateYearOverYearChange("water_quality_index") && (
                <div className="flex items-center mt-2">
                  {calculateYearOverYearChange("water_quality_index")
                    ?.increased ? (
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-500" />
                  )}
                  <span
                    className={
                      calculateYearOverYearChange("water_quality_index")
                        ?.increased
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    {Math.abs(
                      calculateYearOverYearChange("water_quality_index")
                        ?.percentChange || 0
                    )}
                    % from previous year
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Rainfall Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Annual Rainfall</CardDescription>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl text-blue-600">
                  {latestData.rainfall}{" "}
                  <span className="text-sm font-normal">mm</span>
                </CardTitle>
                <DropletIcon className="h-6 w-6 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500">Total precipitation</p>

              {calculateYearOverYearChange("rainfall") && (
                <div className="flex items-center mt-2">
                  {calculateYearOverYearChange("rainfall")?.increased ? (
                    <ArrowUpRight className="h-4 w-4 text-blue-500" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-amber-500" />
                  )}
                  <span className="text-slate-600">
                    {Math.abs(
                      calculateYearOverYearChange("rainfall")?.percentChange ||
                        0
                    )}
                    % from previous year
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Forest Cover Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Forest Coverage</CardDescription>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl text-green-600">
                  {latestData.forest_cover}{" "}
                  <span className="text-sm font-normal">ha</span>
                </CardTitle>
                <TreeDeciduous className="h-6 w-6 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500">Total forest area</p>

              {calculateYearOverYearChange("forest_cover") && (
                <div className="flex items-center mt-2">
                  {calculateYearOverYearChange("forest_cover")?.increased ? (
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-500" />
                  )}
                  <span
                    className={
                      calculateYearOverYearChange("forest_cover")?.increased
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    {Math.abs(
                      calculateYearOverYearChange("forest_cover")
                        ?.percentChange || 0
                    )}
                    % from previous year
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts Tabs */}
      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="mb-4 w-full grid grid-cols-2 gap-6">
          <TabsTrigger value="trends">Trends Over Time</TabsTrigger>
          <TabsTrigger value="comparison">Metric Comparison</TabsTrigger>
        </TabsList>

        {/* Trends Tab - Line Charts */}
        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Air & Water Quality Trends</CardTitle>
              <CardDescription>
                Historical trends of air and water quality indices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={trendData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis
                      yAxisId="left"
                      orientation="left"
                      domain={[0, 500]}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      domain={[0, 100]}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="air_quality_index"
                      name="Air Quality Index"
                      stroke="#ef4444"
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="water_quality_index"
                      name="Water Quality Index"
                      stroke="#3b82f6"
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter className="text-sm text-slate-500">
              Lower Air Quality Index (AQI) indicates better air quality, while
              higher Water Quality Index (WQI) indicates better water quality.
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rainfall & Forest Cover Trends</CardTitle>
              <CardDescription>
                Historical trends of rainfall and forest coverage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={trendData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="rainfall"
                      name="Rainfall (mm)"
                      fill="#0ea5e9"
                      stroke="#0ea5e9"
                      fillOpacity={0.3}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="forest_cover"
                      name="Forest Cover (ha)"
                      stroke="#16a34a"
                      strokeWidth={2}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Comparison Tab - Bar Charts */}
        <TabsContent value="comparison" className="space-y-6">
          <div className="w-full grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Air Quality Index Comparison</CardTitle>
                <CardDescription>
                  Comparing air quality across years
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={data.sort((a, b) => a.year - b.year)}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis domain={[0, 500]} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar
                        dataKey="air_quality_index"
                        name="Air Quality Index"
                        fill="#ef4444"
                        radius={[4, 4, 0, 0]}
                      >
                        {data.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              COLORS.air[
                                Math.min(
                                  Math.floor(entry.air_quality_index / 100),
                                  5
                                )
                              ]
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
              <CardFooter className="text-sm text-slate-500">
                Lower values indicate better air quality. Colors represent
                quality categories.
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Water Quality & Rainfall Comparison</CardTitle>
                <CardDescription>
                  Comparing water quality and rainfall across years
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={data.sort((a, b) => a.year - b.year)}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis
                        yAxisId="left"
                        orientation="left"
                        domain={[0, 150]}
                      />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar
                        yAxisId="left"
                        dataKey="water_quality_index"
                        name="Water Quality Index"
                        fill="#3b82f6"
                        radius={[4, 4, 0, 0]}
                      >
                        {data.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              COLORS.water[
                                Math.min(
                                  Math.floor(entry.water_quality_index / 20),
                                  4
                                )
                              ]
                            }
                          />
                        ))}
                      </Bar>
                      <Bar
                        yAxisId="right"
                        dataKey="rainfall"
                        name="Rainfall (mm)"
                        fill="#0ea5e9"
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
    </div>
  );
}
