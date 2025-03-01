"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Plus,
  Search,
  Eye,
  TrendingUp,
  Users,
  BookOpen,
  Baby,
  Heart,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

// Mock census data
const mockCensusData: CensusDataType[] = [
  {
    census_id: 1,
    year: 2015,
    total_population: 5420,
    male_population: 2760,
    female_population: 2660,
    literacy_rate: 68.75,
    birth_rate: 21.45,
    death_rate: 7.82,
  },
  {
    census_id: 2,
    year: 2017,
    total_population: 5680,
    male_population: 2870,
    female_population: 2810,
    literacy_rate: 72.3,
    birth_rate: 20.18,
    death_rate: 7.65,
  },
  {
    census_id: 3,
    year: 2019,
    total_population: 5920,
    male_population: 2990,
    female_population: 2930,
    literacy_rate: 75.6,
    birth_rate: 19.45,
    death_rate: 7.4,
  },
  {
    census_id: 4,
    year: 2021,
    total_population: 6140,
    male_population: 3080,
    female_population: 3060,
    literacy_rate: 78.2,
    birth_rate: 18.75,
    death_rate: 7.2,
  },
  {
    census_id: 5,
    year: 2023,
    total_population: 6320,
    male_population: 3150,
    female_population: 3170,
    literacy_rate: 81.5,
    birth_rate: 18.1,
    death_rate: 7.05,
  },
];

export default function CensusDataTable() {
  const [censusData, setCensusData] =
    useState<CensusDataType[]>(mockCensusData);
  const [filteredData, setFilteredData] =
    useState<CensusDataType[]>(mockCensusData);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCensusData, setSelectedCensusData] =
    useState<CensusDataType | null>(null);
  const [isStatsDialogOpen, setIsStatsDialogOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(censusSchema),
    defaultValues: {
      year: new Date().getFullYear(),
      total_population: 0,
      male_population: 0,
      female_population: 0,
      literacy_rate: 0,
      birth_rate: 0,
      death_rate: 0,
    },
  });

  useEffect(() => {
    const results = censusData.filter((data) =>
      data.year.toString().includes(searchTerm)
    );
    setFilteredData(results);
  }, [searchTerm, censusData]);

  const onSubmit = async (data) => {
    console.log("Form data:", data);

    // Add the new census entry with a generated ID
    const newCensusEntry = {
      ...data,
      census_id: Math.max(...censusData.map((d) => d.census_id)) + 1,
    };

    setCensusData([...censusData, newCensusEntry]);
    setFilteredData([...censusData, newCensusEntry]);
    setIsDialogOpen(false);
    form.reset();
  };

  const calculateGenderRatio = (male: number, female: number) => {
    return female === 0 ? 0 : (male / female).toFixed(2);
  };

  const openStatsDialog = (data: CensusDataType) => {
    setSelectedCensusData(data);
    setIsStatsDialogOpen(true);
  };

  const renderPopulationDistribution = () => {
    if (!selectedCensusData) return null;

    const malePercentage =
      (selectedCensusData.male_population /
        selectedCensusData.total_population) *
      100;
    const femalePercentage =
      (selectedCensusData.female_population /
        selectedCensusData.total_population) *
      100;

    return (
      <div className="mt-4">
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          Population Distribution
        </h3>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
            <div
              className="bg-blue-500 h-full"
              style={{ width: `${malePercentage}%` }}
            />
          </div>
          <span className="text-xs font-medium text-slate-600 whitespace-nowrap">
            {malePercentage.toFixed(1)}% Male
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
            <div
              className="bg-pink-500 h-full"
              style={{ width: `${femalePercentage}%` }}
            />
          </div>
          <span className="text-xs font-medium text-slate-600 whitespace-nowrap">
            {femalePercentage.toFixed(1)}% Female
          </span>
        </div>
      </div>
    );
  };

  const renderLiteracyProgress = () => {
    if (!selectedCensusData) return null;

    return (
      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-slate-700">Literacy Rate</h3>
          <span
            className={`text-sm font-medium ${
              selectedCensusData.literacy_rate > 75
                ? "text-green-600"
                : "text-amber-600"
            }`}
          >
            {selectedCensusData.literacy_rate.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
          <div
            className="bg-blue-500 h-full"
            style={{ width: `${selectedCensusData.literacy_rate}%` }}
          />
        </div>
      </div>
    );
  };

  const renderVitalRatesComparison = () => {
    if (!selectedCensusData) return null;
    const naturalGrowthRate =
      selectedCensusData.birth_rate - selectedCensusData.death_rate;

    return (
      <div className="mt-6">
        <h3 className="text-sm font-medium text-slate-700 mb-2">Vital Rates</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Baby className="h-4 w-4 text-blue-500" />
              <span className="text-xs font-medium text-slate-700">
                Birth Rate
              </span>
            </div>
            <p className="text-lg font-semibold text-blue-600">
              {selectedCensusData.birth_rate.toFixed(2)}
            </p>
          </div>
          <div className="bg-red-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Heart className="h-4 w-4 text-red-500" />
              <span className="text-xs font-medium text-slate-700">
                Death Rate
              </span>
            </div>
            <p className="text-lg font-semibold text-red-600">
              {selectedCensusData.death_rate.toFixed(2)}
            </p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-xs font-medium text-slate-700">
                Natural Growth
              </span>
            </div>
            <p className="text-lg font-semibold text-green-600">
              {naturalGrowthRate.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 w-full bg-slate-50 min-h-screen">
      <Card className="shadow-sm border-0">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-2xl font-semibold text-slate-800">
            Panchayat Census Data Registry
          </CardTitle>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Census Data
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-6 relative">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by year"
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
                    Total Population
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Male
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Female
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Gender Ratio (M:F)
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Literacy Rate (%)
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Birth Rate
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Death Rate
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
                      colSpan={9}
                      className="text-center py-10 text-slate-500"
                    >
                      {searchTerm
                        ? "No census data found matching your search"
                        : "No census data available"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData
                    .sort((a, b) => b.year - a.year) // Sort by year (newest first)
                    .map((data) => (
                      <TableRow
                        key={data.census_id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <TableCell className="font-medium text-slate-800">
                          {data.year}
                        </TableCell>
                        <TableCell className={`text-slate-600 font-medium`}>
                          {data.total_population.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {data.male_population.toLocaleString()}
                          <span className="text-xs text-slate-400 ml-1">
                            (
                            {(
                              (data.male_population / data.total_population) *
                              100
                            ).toFixed(1)}
                            %)
                          </span>
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {data.female_population.toLocaleString()}
                          <span className="text-xs text-slate-400 ml-1">
                            (
                            {(
                              (data.female_population / data.total_population) *
                              100
                            ).toFixed(1)}
                            %)
                          </span>
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {calculateGenderRatio(
                            data.male_population,
                            data.female_population
                          )}
                        </TableCell>
                        <TableCell className="text-slate-600">
                          <span
                            className={
                              data.literacy_rate > 75
                                ? "text-green-600 font-medium"
                                : "text-slate-600"
                            }
                          >
                            {data.literacy_rate.toFixed(2)}%
                          </span>
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {data.birth_rate.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {data.death_rate.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-500 hover:text-indigo-600"
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
            Showing {filteredData.length} of {censusData.length} census records
          </div>
        </CardContent>
      </Card>

      {/* Add Census Dialog Form */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Add New Census Data
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700">
                      Census Year
                    </FormLabel>
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

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="total_population"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700">
                        Total Population
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Total"
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
                  name="male_population"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700">
                        Male Population
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Male"
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
                  name="female_population"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700">
                        Female Population
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Female"
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

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="literacy_rate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700">
                        Literacy Rate (%)
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
                  name="birth_rate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700">
                        Birth Rate
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
                  name="death_rate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700">
                        Death Rate
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
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  Add Census Data
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Detailed Statistics Dialog */}
      <Dialog open={isStatsDialogOpen} onOpenChange={setIsStatsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          {selectedCensusData && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                  <span className="text-indigo-600">
                    {selectedCensusData.year}
                  </span>{" "}
                  Census Statistics
                </DialogTitle>
                <CardDescription>
                  Detailed analysis and visualization of census data
                </CardDescription>
              </DialogHeader>

              <div className="mt-4">
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid grid-cols-2 mb-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="demographics">Demographics</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="border-0 shadow-sm">
                        <CardContent className="p-4">
                          <div className="flex flex-col">
                            <span className="text-xs text-slate-500 mb-1">
                              Total Population
                            </span>
                            <div className="flex items-center gap-2">
                              <Users className="h-5 w-5 text-indigo-500" />
                              <span className="text-2xl font-bold text-slate-800">
                                {selectedCensusData.total_population.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-0 shadow-sm">
                        <CardContent className="p-4">
                          <div className="flex flex-col">
                            <span className="text-xs text-slate-500 mb-1">
                              Gender Ratio
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-bold text-slate-800">
                                {calculateGenderRatio(
                                  selectedCensusData.male_population,
                                  selectedCensusData.female_population
                                )}
                              </span>
                              <span className="text-xs text-slate-500">
                                males per female
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-0 shadow-sm">
                        <CardContent className="p-4">
                          <div className="flex flex-col">
                            <span className="text-xs text-slate-500 mb-1">
                              Literacy Rate
                            </span>
                            <div className="flex items-center gap-2">
                              <BookOpen className="h-5 w-5 text-indigo-500" />
                              <span
                                className={`text-2xl font-bold ${
                                  selectedCensusData.literacy_rate > 75
                                    ? "text-green-600"
                                    : "text-slate-800"
                                }`}
                              >
                                {selectedCensusData.literacy_rate.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Population Distribution */}
                    {renderPopulationDistribution()}

                    {/* Literacy Rate Progress */}
                    {renderLiteracyProgress()}

                    {/* Vital Rates Comparison */}
                    {renderVitalRatesComparison()}
                  </TabsContent>

                  <TabsContent value="demographics" className="space-y-4">
                    <Card className="border-0 shadow-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">
                          Population Demographics
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Gender Distribution */}
                          <div>
                            <h3 className="text-sm font-medium text-slate-700 mb-3">
                              Gender Distribution
                            </h3>
                            <div className="aspect-square max-w-[200px] mx-auto relative rounded-full overflow-hidden border border-slate-100">
                              <div
                                className="absolute bg-blue-500 h-full"
                                style={{
                                  width: "100%",
                                  clipPath: `polygon(0 0, 50% 0, 50% 100%, 0 100%)`,
                                }}
                              />
                              <div
                                className="absolute bg-pink-500 h-full right-0"
                                style={{
                                  width: "100%",
                                  clipPath: `polygon(50% 0, 100% 0, 100% 100%, 50% 100%)`,
                                }}
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="bg-white rounded-full h-[70%] w-[70%] flex items-center justify-center">
                                  <div className="text-center">
                                    <div className="text-xs text-slate-500">
                                      Gender Ratio
                                    </div>
                                    <div className="text-lg font-bold text-slate-800">
                                      {calculateGenderRatio(
                                        selectedCensusData.male_population,
                                        selectedCensusData.female_population
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-center gap-6 mt-4">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                <span className="text-xs text-slate-600">
                                  Male
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                                <span className="text-xs text-slate-600">
                                  Female
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
