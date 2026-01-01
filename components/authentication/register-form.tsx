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
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CountryCodeDropdown } from "../ui/country-code-dropdown";
import { cn } from "@/lib/utils";
import { CalendarIcon, Search } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { signUp } from "@/api/auth";
import { toast } from "sonner";
import { useState, useRef, useEffect } from "react";
import { getCountries, getCities } from "@/api/seeder";
import { Icon } from "@iconify/react";

interface RegisterFormProps {
  role: "CANDIDATE" | "RECRUITER";
  email: string;
}

// Base schema for candidate
const candidateSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  gender: z.enum(["Male", "Female"], { message: "Please select gender" }),
  country_code: z.string().min(1, "Country code is required"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\d+$/, "Phone number must contain only numbers")
    .length(10, "Phone number must be exactly 10 digits"),
  date_of_birth: z.string().optional(),
  accountType: z.enum(["Student", "Working Professional", "Fresher", "Other"], {
    message: "Please select account type",
  }),
});

// Extended schema for recruiter
const recruiterSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  gender: z.enum(["Male", "Female"], { message: "Please select gender" }),
  country_code: z.string().min(1, "Country code is required"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\d+$/, "Phone number must contain only numbers")
    .length(10, "Phone number must be exactly 10 digits"),
  country_id: z.number().min(1, "Please select country").nullable(),
  city_id: z.number().min(1, "Please select city").nullable(),
  companyName: z.string().min(1, "Company name is required"),
  jobCategory: z.string().min(1, "Please select job category"),
  platformRole: z.string().min(1, "Please select role"),
});

export type CandidateFormData = z.infer<typeof candidateSchema>;
export type RecruiterFormData = z.infer<typeof recruiterSchema>;

interface Country {
  id: number;
  name: string;
}

interface City {
  id: number;
  name: string;
}

interface CountryCode {
  id: number;
  name: string;
  currency: string;
  dial_code: string;
  flag: string;
  is_active: boolean;
}

const jobCategories = [
  { value: "IT & Software", label: "IT & Software" },
  { value: "Finance & Accounting", label: "Finance & Accounting" },
  { value: "Marketing & Sales", label: "Marketing & Sales" },
  { value: "Human Resources", label: "Human Resources" },
  { value: "Operations", label: "Operations" },
];

const platformRoles = [
  { value: "Hiring Manager", label: "Hiring Manager" },
  { value: "Recruiter", label: "Recruiter" },
  { value: "HR Admin", label: "HR Admin" },
  { value: "Team Lead", label: "Team Lead" },
];

export default function RegisterForm({ role, email }: RegisterFormProps) {
  const router = useRouter();
  const isRecruiter = role === "RECRUITER";
  const schema = isRecruiter ? recruiterSchema : candidateSchema;
  const [selectedCountryCode, setSelectedCountryCode] = useState<CountryCode>({
    id: 65,
    name: "India",
    flag: "https://flagcdn.com/in.svg",
    dial_code: "+91",
    currency: "INR",
    is_active: true,
  });

  // Countries state
  const [countries, setCountries] = useState<Country[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [hasMoreCountries, setHasMoreCountries] = useState(true);
  const [countryPage, setCountryPage] = useState(1);
  const [countrySearchQuery, setCountrySearchQuery] = useState("");
  const [countryOpen, setCountryOpen] = useState(false);
  const countryScrollRef = useRef<HTMLDivElement>(null);
  const countryDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const countryLoadedPagesRef = useRef<Set<number>>(new Set());

  // Cities state
  const [cities, setCities] = useState<City[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [hasMoreCities, setHasMoreCities] = useState(true);
  const [cityPage, setCityPage] = useState(1);
  const [citySearchQuery, setCitySearchQuery] = useState("");
  const [cityOpen, setCityOpen] = useState(false);
  const cityScrollRef = useRef<HTMLDivElement>(null);
  const cityDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const cityLoadedPagesRef = useRef<Set<number>>(new Set());

  const form = useForm<CandidateFormData | RecruiterFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      gender: undefined,
      country_code: "+91",
      phone: "",
      ...(!isRecruiter && {
        date_of_birth: "",
        accountType: "",
      }),
      ...(isRecruiter && {
        country_id: null as unknown as number,
        city_id: null as unknown as number,
        companyName: "",
        jobCategory: "",
        platformRole: "",
      }),
    },
  });

  const selectedCountry = form.watch("country_id");
  const selectedCountryData = countries.find((c) => c.id === selectedCountry);

  // Load countries
  const loadCountries = async (pageNum: number, query?: string) => {
    // For page 1 with different query, always reload
    if (pageNum === 1 && query !== countrySearchQuery) {
      // Allow reload - clear loaded pages
      countryLoadedPagesRef.current.clear();
    } else if (loadingCountries || countryLoadedPagesRef.current.has(pageNum)) {
      // Already loading or page already loaded, skip
      return;
    }

    setLoadingCountries(true);
    try {
      const response = await getCountries(pageNum, query);

      const countriesData = Array.isArray(response)
        ? response
        : response?.data || response?.countries || [];

      // If page 1, replace countries; otherwise append (merge with previous data)
      if (pageNum === 1) {
        setCountries(countriesData);
        setCountrySearchQuery(query || "");
        countryLoadedPagesRef.current.clear();
        countryLoadedPagesRef.current.add(1);
      } else {
        // For page 2, 3, etc., always append to previous data
        setCountries((prev) => [...prev, ...countriesData]);
        countryLoadedPagesRef.current.add(pageNum);
      }

      setCountryPage(pageNum);

      if (response?.pagination) {
        setHasMoreCountries(
          response.pagination.currentPage < response.pagination.totalPages
        );
      } else {
        setHasMoreCountries(countriesData.length === 10);
      }
    } catch (error) {
      console.error("Error loading countries:", error);
      setHasMoreCountries(false);
    } finally {
      setLoadingCountries(false);
    }
  };

  // Load cities
  const loadCities = async (pageNum: number, query?: string) => {
    if (!selectedCountryData?.name) return;

    // For page 1 with different query, always reload
    if (pageNum === 1 && query !== citySearchQuery) {
      // Allow reload - clear loaded pages
      cityLoadedPagesRef.current.clear();
    } else if (loadingCities || cityLoadedPagesRef.current.has(pageNum)) {
      // Already loading or page already loaded, skip
      return;
    }

    setLoadingCities(true);
    try {
      const response = await getCities(
        selectedCountryData.name,
        pageNum,
        query
      );

      const citiesData = Array.isArray(response)
        ? response
        : response?.data || response?.cities || [];

      // If page 1, replace cities; otherwise append (merge with previous data)
      if (pageNum === 1) {
        setCities(citiesData);
        setCitySearchQuery(query || "");
        cityLoadedPagesRef.current.clear();
        cityLoadedPagesRef.current.add(1);
      } else {
        // For page 2, 3, etc., always append to previous data
        setCities((prev) => [...prev, ...citiesData]);
        cityLoadedPagesRef.current.add(pageNum);
      }

      setCityPage(pageNum);

      if (response?.pagination) {
        setHasMoreCities(
          response.pagination.currentPage < response.pagination.totalPages
        );
      } else {
        setHasMoreCities(citiesData.length === 10);
      }
    } catch (error) {
      console.error("Error loading cities:", error);
      setHasMoreCities(false);
    } finally {
      setLoadingCities(false);
    }
  };

  // Country search handler
  const handleCountrySearch = (value: string) => {
    setCountrySearchQuery(value);
    if (countryDebounceRef.current) {
      clearTimeout(countryDebounceRef.current);
    }
    countryDebounceRef.current = setTimeout(() => {
      countryLoadedPagesRef.current.clear();
      setCountryPage(1);
      setCountries([]);
      const query = value.trim() || undefined;
      loadCountries(1, query);
    }, 500);
  };

  // City search handler
  const handleCitySearch = (value: string) => {
    setCitySearchQuery(value);
    if (cityDebounceRef.current) {
      clearTimeout(cityDebounceRef.current);
    }
    cityDebounceRef.current = setTimeout(() => {
      cityLoadedPagesRef.current.clear();
      setCityPage(1);
      setCities([]);
      const query = value.trim() || undefined;
      loadCities(1, query);
    }, 500);
  };

  // Country scroll handler
  const handleCountryScroll = () => {
    const container = countryScrollRef.current;
    if (!container || loadingCountries || !hasMoreCountries) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    if (scrollTop + clientHeight >= scrollHeight * 0.8) {
      // Use the current page state to calculate next page
      const nextPage = countryPage + 1;

      if (!countryLoadedPagesRef.current.has(nextPage) && !loadingCountries) {
        const query = countrySearchQuery.trim() || undefined;
        loadCountries(nextPage, query);
      }
    }
  };

  // City scroll handler
  const handleCityScroll = () => {
    const container = cityScrollRef.current;
    if (!container || loadingCities || !hasMoreCities || !selectedCountryData)
      return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    if (scrollTop + clientHeight >= scrollHeight * 0.8) {
      // Use the current page state to calculate next page
      const nextPage = cityPage + 1;

      if (!cityLoadedPagesRef.current.has(nextPage) && !loadingCities) {
        const query = citySearchQuery.trim() || undefined;
        loadCities(nextPage, query);
      }
    }
  };

  // Load cities when country changes
  useEffect(() => {
    if (selectedCountryData?.name) {
      cityLoadedPagesRef.current.clear();
      cityLoadedPagesRef.current.add(1);
      setCityPage(1);
      setCities([]);
      setCitySearchQuery("");
      setHasMoreCities(true);
      loadCities(1);
    } else {
      setCities([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCountryData?.name]);

  // Initialize countries when dropdown opens
  useEffect(() => {
    if (countryOpen && countries.length === 0 && !loadingCountries) {
      countryLoadedPagesRef.current.clear();
      setCountryPage(1);
      setCountrySearchQuery("");
      loadCountries(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryOpen]);

  // Initialize cities when dropdown opens
  useEffect(() => {
    if (
      cityOpen &&
      cities.length === 0 &&
      selectedCountryData?.name &&
      !loadingCities
    ) {
      cityLoadedPagesRef.current.clear();
      setCityPage(1);
      setCitySearchQuery("");
      loadCities(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityOpen, selectedCountryData?.name]);

  // Cleanup timers
  useEffect(() => {
    return () => {
      if (countryDebounceRef.current) {
        clearTimeout(countryDebounceRef.current);
      }
      if (cityDebounceRef.current) {
        clearTimeout(cityDebounceRef.current);
      }
    };
  }, []);

  const handleSubmit = async (data: CandidateFormData | RecruiterFormData) => {
    if (isRecruiter) {
      await signUp({
        role: "RECRUITER",
        first_name: data.firstName,
        last_name: data.lastName,
        email,
        country_code: selectedCountryCode.dial_code,
        mobile_number: data.phone,
        gender: data.gender === "Male" ? "Male" : "Female",
        country_id: selectedCountryData ? selectedCountryData.id : undefined,
        city_id: (data as RecruiterFormData).city_id ?? undefined,
        company_name: (data as RecruiterFormData).companyName,
        job_category: (data as RecruiterFormData).jobCategory,
        platform_role: (data as RecruiterFormData).platformRole,
      })
        .then((response) => {
          if (response.success) {
            toast.success("Registration successful!");
            setCookie("token", response.token);
            setCookie("user_email", email);
            setCookie("user_role", role);
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
        role: "CANDIDATE",
        first_name: data.firstName,
        last_name: data.lastName,
        gender: data.gender === "Male" ? "Male" : "Female",
        email,
        country_code: selectedCountryCode.dial_code,
        country_id: selectedCountryCode?.id,
        mobile_number: data.phone,
        account_type: ("accountType" in data ? data.accountType : "") as
          | "Fresher"
          | "Working Professional"
          | "Student"
          | "Other",
        date_of_birth: (() => {
          const dob = (data as CandidateFormData).date_of_birth;
          if (!dob) return undefined;
          const date = new Date(dob);
          const timestamp =
            date.getTime() - date.getTimezoneOffset() * 60 * 1000;
          return timestamp.toString();
        })(),
      })
        .then((response) => {
          if (response.success) {
            toast.success(response.message || "Registration successful!");
            setCookie("token", response.token);
            setCookie("user_email", email);
            setCookie("user_role", role);
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
    }
  };

  const handleBack = () => {
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
                    <Input placeholder="Enter Company Name" {...field} />
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
                  <Input placeholder="Enter First Name" {...field} />
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
                  <Input placeholder="Enter Last Name" {...field} />
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
                      <RadioGroupItem value="Male" id="Male" />
                      <Label
                        htmlFor="Male"
                        className="font-normal text-gray-800"
                      >
                        Male
                      </Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="Female" id="Female" />
                      <Label
                        htmlFor="Female"
                        className="font-normal text-gray-800"
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
              className="bg-gray-200 text-gray-800"
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
                  <div className="flex border border-black rounded-lg">
                    <CountryCodeDropdown
                      value={selectedCountryCode.dial_code}
                      onValueChange={() => {
                        setSelectedCountryCode(selectedCountryCode);
                      }}
                      className="rounded-r-none border-r border-black"
                    />
                    <Input
                      type="tel"
                      maxLength={10}
                      placeholder="99999 99999"
                      className="border-0 rounded-none"
                      {...field}
                      onChange={(e) => {
                        // Remove any non-numeric characters
                        const numericValue = e.target.value.replace(/\D/g, "");
                        e.target.value = numericValue;
                        field.onChange(numericValue);
                      }}
                      onKeyDown={(e) => {
                        // Allow: backspace, delete, tab, escape, enter
                        if (
                          [8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
                          // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                          (e.keyCode === 65 && e.ctrlKey === true) ||
                          (e.keyCode === 67 && e.ctrlKey === true) ||
                          (e.keyCode === 86 && e.ctrlKey === true) ||
                          (e.keyCode === 88 && e.ctrlKey === true) ||
                          // Allow: home, end, left, right
                          (e.keyCode >= 35 && e.keyCode <= 39)
                        ) {
                          return;
                        }
                        // Ensure that it is a number and stop the keypress
                        if (
                          (e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
                          (e.keyCode < 96 || e.keyCode > 105)
                        ) {
                          e.preventDefault();
                        }
                      }}
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
              name="date_of_birth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="gap-1">
                    Date of Birth
                    <span className="text-[10px] text-gray-500">
                      - optional
                    </span>
                  </FormLabel>
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
                            format(new Date(field.value), "MM-dd-yyyy")
                          ) : (
                            <span>Pick a date</span>
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
                name="country_id"
                render={({ field }) => (
                  <FormItem>
                    <Label>Country</Label>
                    <Popover open={countryOpen} onOpenChange={setCountryOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full justify-between"
                            disabled={loadingCountries}
                          >
                            {selectedCountryData ? (
                              selectedCountryData.name
                            ) : (
                              <span className="text-muted-foreground">
                                Select Country
                              </span>
                            )}
                            <Icon
                              icon="material-symbols:keyboard-arrow-down-rounded"
                              className="ml-2 h-4 w-4 shrink-0 opacity-50"
                            />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-80 p-0"
                        align="start"
                        onOpenAutoFocus={(e) => e.preventDefault()}
                      >
                        {/* Search Input */}
                        <div className="p-2 border-b">
                          <div className="relative">
                            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              type="text"
                              placeholder="Search country..."
                              value={countrySearchQuery}
                              onChange={(e) =>
                                handleCountrySearch(e.target.value)
                              }
                              className="pl-8 h-9"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </div>
                        <div
                          ref={countryScrollRef}
                          onScroll={handleCountryScroll}
                          className="max-h-[300px] overflow-y-auto scrollbar-hide"
                        >
                          {countries.map((country) => (
                            <button
                              key={country.id}
                              type="button"
                              onClick={() => {
                                field.onChange(country.id);
                                setCountryOpen(false);
                                setCountrySearchQuery("");
                              }}
                              className={cn(
                                "w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-100 transition-colors",
                                field.value === country.id && "bg-gray-100"
                              )}
                            >
                              <span className="flex-1 text-sm font-medium">
                                {country.name}
                              </span>
                            </button>
                          ))}

                          {!hasMoreCountries && countries.length > 0 && (
                            <div className="px-4 py-2 text-xs text-gray-400 text-center">
                              No more countries
                            </div>
                          )}
                          {countries.length === 0 && (
                            <div className="px-4 py-2 text-xs text-gray-400 text-center">
                              No countries found
                            </div>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* City */}
              <FormField
                control={form.control}
                name="city_id"
                render={({ field }) => {
                  const selectedCityData = cities.find(
                    (c) => c.id === field.value
                  );

                  return (
                    <FormItem>
                      <Label>City</Label>
                      <Popover open={cityOpen} onOpenChange={setCityOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              type="button"
                              variant="outline"
                              className="w-full justify-between"
                              disabled={!selectedCountryData || loadingCities}
                            >
                              {selectedCityData ? (
                                selectedCityData.name
                              ) : (
                                <span className="text-muted-foreground">
                                  {!selectedCountryData
                                    ? "Select Country First"
                                    : "Select City"}
                                </span>
                              )}
                              <Icon
                                icon="material-symbols:keyboard-arrow-down-rounded"
                                className="ml-2 h-4 w-4 shrink-0 opacity-50"
                              />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-80 p-0"
                          align="start"
                          onOpenAutoFocus={(e) => e.preventDefault()}
                        >
                          {/* Search Input */}
                          <div className="p-2 border-b">
                            <div className="relative">
                              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input
                                type="text"
                                placeholder="Search city..."
                                value={citySearchQuery}
                                onChange={(e) =>
                                  handleCitySearch(e.target.value)
                                }
                                className="pl-8 h-9"
                                onClick={(e) => e.stopPropagation()}
                                disabled={!selectedCountryData}
                              />
                            </div>
                          </div>
                          <div
                            ref={cityScrollRef}
                            onScroll={handleCityScroll}
                            className="max-h-[300px] overflow-y-auto scrollbar-hide"
                          >
                            {cities.map((city) => (
                              <button
                                key={city.id}
                                type="button"
                                onClick={() => {
                                  field.onChange(city.id);
                                  setCityOpen(false);
                                  setCitySearchQuery("");
                                }}
                                className={cn(
                                  "w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-100 transition-colors",
                                  field.value === city.id && "bg-gray-100"
                                )}
                              >
                                <span className="flex-1 text-sm font-medium">
                                  {city.name}
                                </span>
                              </button>
                            ))}

                            {!hasMoreCities && cities.length > 0 && (
                              <div className="px-4 py-2 text-xs text-gray-400 text-center">
                                No more cities
                              </div>
                            )}
                            {cities.length === 0 && (
                              <div className="px-4 py-2 text-xs text-gray-400 text-center">
                                No cities found
                              </div>
                            )}
                          </div>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  );
                }}
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
