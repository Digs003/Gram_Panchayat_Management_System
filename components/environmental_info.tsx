"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Plus,
  Search,
  Eye,
  Droplets,
  Wind,
  Cloud,
  TreesIcon,
  TreeDeciduous,
  DropletIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
import { Progress } from "@/components/ui/progress";
import { getURL } from "next/dist/shared/lib/utils";
import { getUser } from "@/lib/actions/getUser";

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

// // Mock environmental data
// const mockEnvironmentalData: EnvironmentalDataType[] = [
//   {
//     data_id: 1,
//     year: 2019,
//     air_quality_index: 85.4,
//     water_quality_index: 72.3,
//     rainfall: 1250.75,
//     forest_cover: 3450.25,
//   },
//   {
//     data_id: 2,
//     year: 2020,
//     air_quality_index: 78.2,
//     water_quality_index: 75.6,
//     rainfall: 1320.5,
//     forest_cover: 3420.1,
//   },
//   {
//     data_id: 3,
//     year: 2021,
//     air_quality_index: 72.5,
//     water_quality_index: 78.9,
//     rainfall: 1280.25,
//     forest_cover: 3400.75,
//   },
//   {
//     data_id: 4,
//     year: 2022,
//     air_quality_index: 68.3,
//     water_quality_index: 82.4,
//     rainfall: 1350.6,
//     forest_cover: 3380.3,
//   },
//   {
//     data_id: 5,
//     year: 2023,
//     air_quality_index: 65.1,
//     water_quality_index: 84.7,
//     rainfall: 1380.9,
//     forest_cover: 3360.5,
//   },
// ];

export default function EnvironmentalDataTable({
  environmentalList,
  addOption,
}: {
  environmentalList: EnvironmentalDataType[];
  addOption: boolean;
}) {
  const [environmentalData, setEnvironmentalData] =
    useState<EnvironmentalDataType[]>(environmentalList);
  const [filteredData, setFilteredData] =
    useState<EnvironmentalDataType[]>(environmentalList);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedData, setSelectedData] =
    useState<EnvironmentalDataType | null>(null);
  const [isStatsDialogOpen, setIsStatsDialogOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(environmentalSchema),
    defaultValues: {
      year: new Date().getFullYear(),
      air_quality_index: 0,
      water_quality_index: 0,
      rainfall: 0,
      forest_cover: 0,
    },
  });

  useEffect(() => {
    setEnvironmentalData(environmentalList);
    setFilteredData(environmentalList);
  }, [environmentalList]);

  useEffect(() => {
    const results = environmentalData.filter((data) =>
      data.year.toString().includes(searchTerm)
    );
    setFilteredData(results);
  }, [searchTerm, environmentalData]);

  const onSubmit = async (data) => {
    //console.log("Form data:", data);
    try {
      const { user } = await getUser();

      const response = await fetch("/api/employees/addenvdata", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          year: data.year,
          air_quality_index: data.air_quality_index,
          water_quality_index: data.water_quality_index,
          rainfall: data.rainfall,
          forest_cover: data.forest_cover,
          aadhar_id: user.aadhar_id,
        }),
      });
      if (!response.ok) {
        alert("Failed to update environmental data");
      } else {
        alert("Environmental data added successfully");
        const newEntry = {
          ...data,
          data_id: Math.max(...environmentalData.map((d) => d.data_id)) + 1,
        };

        setEnvironmentalData([...environmentalData, newEntry]);
        setFilteredData([...environmentalData, newEntry]);
      }
    } catch (e) {
      console.error(e);
    }
    // Add the new environmental entry with a generated ID

    setIsDialogOpen(false);
    form.reset();
  };

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

  const openStatsDialog = (data: EnvironmentalDataType) => {
    setSelectedData(data);
    setIsStatsDialogOpen(true);
  };

  const renderAirQualityIndicator = () => {
    if (!selectedData) return null;

    const aqi = selectedData.air_quality_index;
    const percentage = (aqi / 500) * 100; // AQI max is 500
    const colorClass = getAirQualityClass(aqi);
    const category = getAirQualityCategory(aqi);

    return (
      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-slate-700">
            Air Quality Index
          </h3>
          <span className={`text-sm font-medium ${colorClass}`}>
            {aqi} - {category}
          </span>
        </div>
        <Progress value={percentage} className="h-2" />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>0 (Good)</span>
          <span>250</span>
          <span>500 (Hazardous)</span>
        </div>
      </div>
    );
  };

  // Function to render the water quality indicator
  const renderWaterQualityIndicator = () => {
    if (!selectedData) return null;

    const wqi = selectedData.water_quality_index;
    const percentage = wqi; // WQI is already 0-100
    const colorClass = getWaterQualityClass(wqi);
    const category = getWaterQualityCategory(wqi);

    return (
      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-slate-700">
            Water Quality Index
          </h3>
          <span className={`text-sm font-medium ${colorClass}`}>
            {wqi} - {category}
          </span>
        </div>
        <Progress value={percentage} className="h-2" />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>0 (Poor)</span>
          <span>50</span>
          <span>100 (Excellent)</span>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 w-full bg-slate-50 min-h-screen">
      <Card className="shadow-sm border-0">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-2xl font-semibold text-slate-800">
            Environmental Data Registry
          </CardTitle>
          {addOption && (
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Environmental Data
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <div className="mb-6 relative">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by year or quality index..."
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
                    Year
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Air Quality Index
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Water Quality Index
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Rainfall (mm)
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Forest Cover (hectares)
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 w-10">
                    Details
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
                        ? "No environmental data found matching your search"
                        : "No environmental data available"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData
                    .sort((a, b) => b.year - a.year) // Sort by year (newest first)
                    .map((data) => (
                      <TableRow
                        key={data.data_id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <TableCell className="font-medium text-slate-800">
                          {data.year}
                        </TableCell>
                        <TableCell
                          className={`font-medium ${getAirQualityClass(
                            data.air_quality_index
                          )}`}
                        >
                          {data.air_quality_index}
                          <span className="text-xs text-slate-500 ml-1">
                            ({getAirQualityCategory(data.air_quality_index)})
                          </span>
                        </TableCell>
                        <TableCell
                          className={`font-medium ${getWaterQualityClass(
                            data.water_quality_index
                          )}`}
                        >
                          {data.water_quality_index}
                          <span className="text-xs text-slate-500 ml-1">
                            ({getWaterQualityCategory(data.water_quality_index)}
                            )
                          </span>
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {data.rainfall}
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {data.forest_cover}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-500 hover:text-green-600"
                            onClick={() => openStatsDialog(data)}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View details</span>
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
            Showing {filteredData.length} of {environmentalData.length}{" "}
            environmental records
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Add New Environmental Data
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700">Year</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter year"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
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
                  name="air_quality_index"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700">
                        Air Quality Index
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
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
                  name="water_quality_index"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700">
                        Water Quality Index
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
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

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="rainfall"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700">
                        Rainfall (mm)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
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
                  name="forest_cover"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700">
                        Forest Cover (hectares)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
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

              <DialogFooter className="pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="border-slate-200"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700"
                >
                  Add Environmental Data
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isStatsDialogOpen} onOpenChange={setIsStatsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          {selectedData && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                  <span className="text-green-600">{selectedData.year}</span>{" "}
                  Environmental Statistics
                </DialogTitle>
                <CardDescription>
                  Detailed analysis and visualization of environmental data
                </CardDescription>
              </DialogHeader>

              <div className="mt-4">
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      <Card className="border-0 shadow-sm">
                        <CardContent className="p-4">
                          <div className="flex flex-col">
                            <span className="text-xs text-slate-500 mb-1">
                              Air Quality
                            </span>
                            <div className="flex items-center gap-2">
                              <Wind className="h-5 w-5 text-red-500" />
                              <span
                                className={`text-2xl font-bold ${getAirQualityClass(
                                  selectedData.air_quality_index
                                )}`}
                              >
                                {selectedData.air_quality_index}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-0 shadow-sm">
                        <CardContent className="p-4">
                          <div className="flex flex-col">
                            <span className="text-xs text-slate-500 mb-1">
                              Water Quality
                            </span>
                            <div className="flex items-center gap-2">
                              <Droplets className="h-5 w-5 text-blue-500" />
                              <span
                                className={`text-2xl font-bold ${getWaterQualityClass(
                                  selectedData.water_quality_index
                                )}`}
                              >
                                {selectedData.water_quality_index}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-0 shadow-sm">
                        <CardContent className="p-4">
                          <div className="flex flex-col">
                            <span className="text-xs text-slate-500 mb-1">
                              Rainfall
                            </span>
                            <div className="flex items-center gap-2">
                              <DropletIcon className="h-5 w-5 text-blue-500" />
                              <span className="text-xl font-bold text-slate-800">
                                {selectedData.rainfall}
                              </span>
                              <span className="text-xs text-slate-500">mm</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-0 shadow-sm">
                        <CardContent className="p-4">
                          <div className="flex flex-col">
                            <span className="text-xs text-slate-500 mb-1">
                              Forest Cover
                            </span>
                            <div className="flex items-center gap-2">
                              <TreeDeciduous className="h-5 w-5 text-green-500" />
                              <span className="text-xl font-bold text-slate-800">
                                {selectedData.forest_cover}
                              </span>
                              <span className="text-xs text-slate-500">ha</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {renderAirQualityIndicator()}
                    {renderWaterQualityIndicator()}
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
