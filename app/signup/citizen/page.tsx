"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const formSchema = z
  .object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    gender: z.enum(["male", "female", "other"], {
      required_error: "Please select a gender.",
    }),
    dob: z.date({
      required_error: "Date of birth is required.",
    }),
    age: z.number().min(0).max(120),
    contactNumber: z.string().min(10, {
      message: "Contact number must be at least 10 digits.",
    }),
    occupation: z.string({
      required_error: "Please select an Occupation.",
    }),
    educationalQualifications: z.string({
      required_error: "Please select an Educational Qualification.",
    }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

const occupations = [
  { label: "Farmer", value: "farmer" },
  { label: "Agricultural Laborer", value: "agricultural_laborer" },
  { label: "Fisherman", value: "fisherman" },
  { label: "Livestock Raiser", value: "livestock_raiser" },
  { label: "Dairy Farmer", value: "dairy_farmer" },
  { label: "Poultry Farmer", value: "poultry_farmer" },
  { label: "Beekeeper", value: "beekeeper" },
  { label: "Weaver", value: "weaver" },
  { label: "Handloom Worker", value: "handloom_worker" },
  { label: "Carpenter", value: "carpenter" },
  { label: "Blacksmith", value: "blacksmith" },
  { label: "Potter", value: "potter" },
  { label: "Handicraft Artisan", value: "handicraft_artisan" },
  { label: "Mason", value: "mason" },
  { label: "Electrician", value: "electrician" },
  { label: "Plumber", value: "plumber" },
  { label: "Tailor", value: "tailor" },
  { label: "Barber", value: "barber" },
  { label: "Washerman (Dhobi)", value: "washerman" },
  { label: "Cobbler", value: "cobbler" },
  { label: "Rickshaw Puller", value: "rickshaw_puller" },
  { label: "Auto Driver", value: "auto_driver" },
  { label: "Small Shop Owner", value: "small_shop_owner" },
  { label: "Vegetable Vendor", value: "vegetable_vendor" },
  { label: "Street Food Vendor", value: "street_food_vendor" },
  { label: "Self-Employed (Village Business)", value: "self_employed_village" },
  { label: "Daily Wage Worker", value: "daily_wage_worker" },
  { label: "Construction Worker", value: "construction_worker" },
  { label: "Government Employee", value: "government_employee" },
  { label: "Panchayat Staff", value: "panchayat_staff" },
  { label: "ASHA Worker", value: "asha_worker" },
  { label: "Anganwadi Worker", value: "anganwadi_worker" },
  { label: "Teacher", value: "teacher" },
  { label: "Rural Health Worker", value: "rural_health_worker" },
  { label: "Primary School Teacher", value: "primary_school_teacher" },
  { label: "Folk Performer", value: "folk_performer" },
  { label: "Traditional Healer", value: "traditional_healer" },
  { label: "Temple Priest", value: "temple_priest" },
  { label: "Social Worker", value: "social_worker" },
  { label: "NGO Worker", value: "ngo_worker" },
  { label: "Homemaker", value: "homemaker" },
  { label: "Unemployed", value: "unemployed" },
  { label: "Other", value: "other" },
];

const educationalQualifications = [
  { label: "1st Pass", value: "class_1_pass" },
  { label: "2nd Pass", value: "class_2_pass" },
  { label: "3rd Pass", value: "class_3_pass" },
  { label: "4th Pass", value: "class_4_pass" },
  { label: "5th Pass", value: "class_5_pass" },
  { label: "6th Pass", value: "class_6_pass" },
  { label: "7th Pass", value: "class_7_pass" },
  { label: "8th Pass", value: "class_8_pass" },
  { label: "9th Pass", value: "class_9_pass" },
  { label: "10th Pass (Matriculation)", value: "class_10_pass" },
  { label: "11th Pass", value: "class_11_pass" },
  { label: "12th Pass (Higher Secondary)", value: "class_12_pass" },
  { label: "Diploma", value: "diploma" },
  { label: "Vocational Training", value: "vocational_training" },
  { label: "Bachelor's Degree", value: "bachelors_degree" },
  { label: "Master's Degree", value: "masters_degree" },
  { label: "Doctorate (PhD)", value: "doctorate" },
  { label: "Professional Certification", value: "professional_certification" },
  { label: "No Formal Education", value: "no_formal_education" },
];

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      contactNumber: "",
      age: 0,
      educationalQualifications: "",
      email: "",
      occupation: "",
      password: "",
      confirmPassword: "",
    },
  });
  const router = useRouter();

  // Calculate age when date of birth changes
  const dob = form.watch("dob");
  useEffect(() => {
    if (dob) {
      const today = new Date();
      const birthDate = new Date(dob);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }
      form.setValue("age", age);
    }
  }, [dob, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // console.log(values);
    try {
      const response = await fetch("/api/auth/signup/citizen", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      //const data=await response.json();
      if (response.ok) {
        alert("Registration Successful");
        router.push("/api/auth/signin");
      } else {
        alert("Registration Failed");
      }
    } catch (err) {
      console.error("Registration Error:", err);
    }
  }

  return (
    <div className="inset-0 py-2 bg-blue-100 flex items-center justify-center">
      <Card className="max-w-2xl mx-auto my-8">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-blue-900">
            Citizen Portal Registration
          </CardTitle>
          <CardDescription>
            Enter your personal details to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-row space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="male" />
                          </FormControl>
                          <FormLabel className="font-normal">Male</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="female" />
                          </FormControl>
                          <FormLabel className="font-normal">Female</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="other" />
                          </FormControl>
                          <FormLabel className="font-normal">Other</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of Birth</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number.parseInt(e.target.value) || 0)
                          }
                          value={field.value}
                          disabled
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="contactNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your contact number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="occupation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Occupation</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your occupation" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {occupations.map((occupation) => (
                          <SelectItem
                            key={occupation.value}
                            value={occupation.value}
                          >
                            {occupation.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="educationalQualifications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Educational Qualifications</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your educational qualification" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {educationalQualifications.map((qualification) => (
                          <SelectItem
                            key={qualification.value}
                            value={qualification.value}
                          >
                            {qualification.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          {...field}
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-2 h-6 w-6 p-0"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOffIcon className="h-4 w-4" />
                        ) : (
                          <EyeIcon className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          {...field}
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-2 h-6 w-6 p-0"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOffIcon className="h-4 w-4" />
                        ) : (
                          <EyeIcon className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full bg-indigo-900 text-white">
                Register
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-6">
          <p className="text-sm text-muted-foreground">
            By registering, you can access the Portal to apply for various
            government schemes and services.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
