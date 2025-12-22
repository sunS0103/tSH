"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next/client";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { signUp } from "@/api/auth";
import { toast } from "sonner";

interface RegisterFormProps {
  role: "candidate" | "recruiter";
  email: string;
  onComplete?: () => void;
}

// Base schema for candidate
const candidateSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  gender: z.enum(["male", "female"], { message: "Please select gender" }),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  accountType: z.enum(["Student", "Working Professional", "Fresher", "Other"], {
    message: "Please select account type",
  }),
});

// Extended schema for recruiter
const recruiterSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  gender: z.enum(["male", "female"], { message: "Please select gender" }),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  country: z.string().min(1, "Please select country"),
  city: z.string().min(1, "Please select city"),
  companyName: z.string().min(1, "Company name is required"),
  jobCategory: z.string().min(1, "Please select job category"),
  platformRole: z.string().min(1, "Please select role"),
});

export type CandidateFormData = z.infer<typeof candidateSchema>;
export type RecruiterFormData = z.infer<typeof recruiterSchema>;

// Sample data
const countries = [
  { value: "india", label: "India" },
  { value: "usa", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "canada", label: "Canada" },
  { value: "australia", label: "Australia" },
];

const cities: Record<string, { value: string; label: string }[]> = {
  india: [
    { value: "mumbai", label: "Mumbai" },
    { value: "delhi", label: "Delhi" },
    { value: "bangalore", label: "Bangalore" },
    { value: "ahmedabad", label: "Ahmedabad" },
  ],
  usa: [
    { value: "new_york", label: "New York" },
    { value: "los_angeles", label: "Los Angeles" },
    { value: "chicago", label: "Chicago" },
  ],
  uk: [
    { value: "london", label: "London" },
    { value: "manchester", label: "Manchester" },
  ],
  canada: [
    { value: "toronto", label: "Toronto" },
    { value: "vancouver", label: "Vancouver" },
  ],
  australia: [
    { value: "sydney", label: "Sydney" },
    { value: "melbourne", label: "Melbourne" },
  ],
};

const jobCategories = [
  { value: "it", label: "IT & Software" },
  { value: "finance", label: "Finance & Accounting" },
  { value: "marketing", label: "Marketing & Sales" },
  { value: "hr", label: "Human Resources" },
  { value: "operations", label: "Operations" },
];

const platformRoles = [
  { value: "hiring_manager", label: "Hiring Manager" },
  { value: "recruiter", label: "Recruiter" },
  { value: "hr_admin", label: "HR Admin" },
  { value: "team_lead", label: "Team Lead" },
];

export default function RegisterForm({
  role,
  email,
  onComplete,
}: RegisterFormProps) {
  const router = useRouter();
  const isRecruiter = role === "recruiter";
  const schema = isRecruiter ? recruiterSchema : candidateSchema;

  const form = useForm<CandidateFormData | RecruiterFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      gender: undefined,
      phone: "",
      ...(!isRecruiter && {
        dateOfBirth: "",
        accountType: "",
      }),
      ...(isRecruiter && {
        country: "",
        city: "",
        companyName: "",
        jobCategory: "",
        platformRole: "",
      }),
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const selectedCountry = form.watch("country");
  const availableCities = selectedCountry ? cities[selectedCountry] || [] : [];

  const handleSubmit = async (data: CandidateFormData | RecruiterFormData) => {
    if (isRecruiter) {
      await signUp({
        roles: "RECRUITER",
        company_name: (data as RecruiterFormData).companyName,
        first_name: data.firstName,
        last_name: data.lastName,
        gender: data.gender === "male" ? "MALE" : "FEMALE",
        email,
        country_code: "+91",
        mobile_number: data.phone,
        country: "India",
        city: (data as RecruiterFormData).city,
        primary_job_category: (data as RecruiterFormData).jobCategory,
        platform_primary_role: (data as RecruiterFormData).platformRole,
      })
        .then((response) => {
          if (response.success) {
            toast.success("Registration successful!");
            setCookie("token", response.token);
            setCookie("user_email", email);
            setCookie("user_roles", role);
            onComplete?.();
            router.push("/");
          } else {
            toast.error(
              response.message || "Registration failed. Please try again."
            );
          }
        })
        .catch((error) => {
          toast.error(
            error?.response?.data?.message ||
              "An error occurred during registration. Please try again."
          );
        });
    } else {
      await signUp({
        roles: "CANDIDATE",
        first_name: data.firstName,
        last_name: data.lastName,
        gender: data.gender === "male" ? "MALE" : "FEMALE",
        email,
        country_code: "+91",
        mobile_number: data.phone,
        country: "India",
        account_type: ("accountType" in data ? data.accountType : "") as
          | "Fresher"
          | "Working Professional"
          | "Student"
          | "Other",
        date_of_birth:
          "dateOfBirth" in data
            ? format(new Date(data.dateOfBirth), "yyyy-MM-dd")
            : "",
      })
        .then((response) => {
          if (response.success) {
            toast.success(response.message || "Registration successful!");
            setCookie("token", response.token);
            setCookie("user_email", email);
            setCookie("user_roles", role);
            onComplete?.();
            router.push("/");
          } else {
            toast.error(
              response.message || "Registration failed. Please try again."
            );
          }
        })
        .catch((error) => {
          console.log(error);
          toast.error(
            error?.response?.data?.message ||
              "An error occurred during registration. Please try again."
          );
        });
    }
  };

  const handleBack = () => {
    onComplete?.();
    router.push("/authentication");
  };

  return (
    <div className="flex flex-col items-center w-full max-w-105 mx-auto">
      <div className="w-full">
        <h1 className="text-xl font-bold text-black text-left">
          Enter Your Details
        </h1>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="w-full space-y-4 mt-4"
        >
          {/* Company Name - Recruiter Only */}
          {isRecruiter && (
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <Label>Company name</Label>
                  <FormControl>
                    <Input placeholder="Enter company name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* First Name */}
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <Label>First name</Label>
                <FormControl>
                  <Input placeholder="Enter first name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Last Name */}
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <Label>Last name</Label>
                <FormControl>
                  <Input placeholder="Enter last name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Gender */}
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <Label>Gender</Label>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex flex-col gap-2 mt-2"
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="male" id="male" />
                      <Label
                        htmlFor="male"
                        className="font-normal text-gray-500"
                      >
                        Male
                      </Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="female" id="female" />
                      <Label
                        htmlFor="female"
                        className="font-normal text-gray-500"
                      >
                        Female
                      </Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email ID - Disabled */}
          <div className="space-y-2">
            <Label>Email ID</Label>
            <Input
              value={email}
              disabled
              className="bg-gray-50 text-gray-400"
            />
          </div>

          {/* Phone Number */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <Label>Phone Number</Label>
                <FormControl>
                  <div className="flex">
                    <div className="flex items-center gap-1 px-3 border border-r-0 rounded-l-lg bg-white">
                      <span className="text-sm">🇮🇳</span>
                      <span className="text-xs text-gray-600">+91</span>
                    </div>
                    <Input
                      placeholder="99999 99999"
                      className="rounded-l-none"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date of Birth - Candidate only */}
          {!isRecruiter && (
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <Label>Date of Birth</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(new Date(field.value), "dd/MM/yyyy")
                          ) : (
                            <span>dd/mm/yyyy</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={(date) =>
                          field.onChange(date ? date.toISOString() : "")
                        }
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        captionLayout="dropdown"
                        fromYear={1950}
                        toYear={new Date().getFullYear()}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Account Type - Candidate only */}
          {!isRecruiter && (
            <FormField
              control={form.control}
              name="accountType"
              render={({ field }) => (
                <FormItem>
                  <Label>Account Type</Label>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Account Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Student">Student</SelectItem>
                      <SelectItem value="Working Professional">
                        Working Professional
                      </SelectItem>
                      <SelectItem value="Fresher">Fresher</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Recruiter-only fields */}
          {isRecruiter && (
            <>
              {/* Country */}
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <Label>Country</Label>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.value} value={country.value}>
                            {country.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* City */}
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <Label>City</Label>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!selectedCountry}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select City" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableCities.map((city) => (
                          <SelectItem key={city.value} value={city.value}>
                            {city.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Primary Job Posting Category */}
              <FormField
                control={form.control}
                name="jobCategory"
                render={({ field }) => (
                  <FormItem>
                    <Label>Primary Job Posting Category</Label>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {jobCategories.map((category) => (
                          <SelectItem
                            key={category.value}
                            value={category.value}
                          >
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Role using this platform */}
              <FormField
                control={form.control}
                name="platformRole"
                render={({ field }) => (
                  <FormItem>
                    <Label>Role using this platform primarily</Label>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {platformRoles.map((platformRole) => (
                          <SelectItem
                            key={platformRole.value}
                            value={platformRole.value}
                          >
                            {platformRole.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={handleBack}
            >
              Back
            </Button>
            <Button type="submit" className="flex-1">
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
