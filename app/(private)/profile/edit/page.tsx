"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { CountryCodeDropdown } from "@/components/ui/country-code-dropdown";
import { CountryDropdown } from "@/components/ui/country-dropdown";
import { CityDropdown } from "@/components/ui/city-dropdown";
import { getCountries, getCountryById } from "@/api/seeder";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { getCookie, setCookie } from "cookies-next/client";
import { updateRecruiterProfile } from "@/api/profile";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const editProfileSchema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  gender: z.enum(["Male", "Female"]),
  email: z.string().email("Invalid email address"),
  mobile_number: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\d+$/, "Phone number must contain only numbers")
    .length(10, "Phone number must be exactly 10 digits"),
  country_code: z.string().min(1, "Country code is required"),
  country_id: z.number().min(1, "Country is required"),
  city_id: z.number().min(1, "City is required"),
  job_category: z.string().min(1, "At least one job category is required"),
  platform_role: z.string().min(1, "At least one platform role is required"),
});

type EditProfileFormData = z.infer<typeof editProfileSchema>;

export default function EditProfilePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const cookieValue = getCookie("profile_data");
  const profileData = cookieValue ? JSON.parse(cookieValue as string) : null;
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>(
    profileData?.mobile_details?.dial_code || ""
  );
  const [countries, setCountries] = useState<{ id: number; name: string }[]>(
    []
  );
  const [countryName, setCountryName] = useState<string>("");

  const platformRoleOptions = [
    "Hiring Manager",
    "Recruiter",
    "HR Admin",
    "Team Lead",
  ];
  const jobCategoryOptions = [
    "IT & Software",
    "Finance & Accounting",
    "Marketing & Sales",
    "Human Resources",
    "Operations",
  ];

  const form = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    mode: "onBlur", // Only validate on blur, not on mount
    reValidateMode: "onChange", // Re-validate on change after first validation
    defaultValues: {
      company_name: profileData?.company_name || "",
      first_name: profileData?.first_name || "",
      last_name: profileData?.last_name || "",
      gender: profileData?.gender === "Male" ? "Male" : "Female",
      email: profileData?.email || "",
      mobile_number: profileData?.mobile_details?.mobile_number || "",
      country_code: profileData?.mobile_details?.dial_code || "",
      country_id: (() => {
        // Handle country_id - could be number, string, or object
        let countryId: number | string | object | undefined;
        if (profileData?.country_id) {
          countryId = profileData.country_id;
        } else if (profileData?.country) {
          countryId = profileData.country;
        }

        if (!countryId) return 0;

        // If it's an object, extract the id
        if (typeof countryId === "object") {
          const id = (countryId as { id?: number | string })?.id;
          return id ? Number(id) : 0;
        }

        // If it's a string, convert to number
        if (typeof countryId === "string") {
          const num = Number(countryId);
          return isNaN(num) ? 0 : num;
        }

        // If it's already a number, return it
        return typeof countryId === "number" ? countryId : 0;
      })(),
      city_id: (() => {
        // Handle city_id - could be number, string, or object
        let cityId: number | string | object | undefined;
        if (profileData?.city_id) {
          cityId = profileData.city_id;
        } else if (profileData?.city) {
          cityId = profileData.city;
        }

        if (!cityId) return 0;

        // If it's an object, extract the id
        if (typeof cityId === "object") {
          const id = (cityId as { id?: number | string })?.id;
          return id ? Number(id) : 0;
        }

        // If it's a string, convert to number
        if (typeof cityId === "string") {
          const num = Number(cityId);
          return isNaN(num) ? 0 : num;
        }

        // If it's already a number, return it
        return typeof cityId === "number" ? cityId : 0;
      })(),
      job_category: profileData?.job_category || "",
      platform_role: profileData?.platform_role || "",
    },
  });

  // Watch selected country to get country name for city dropdown
  const selectedCountryId = form.watch("country_id");
  const selectedCountryData = countries.find((c) => c.id === selectedCountryId);

  // Load countries list for getting country name
  useEffect(() => {
    const loadInitialCountries = async () => {
      if (selectedCountryId && countries.length === 0) {
        try {
          const response = await getCountries(1);
          const countriesData = Array.isArray(response)
            ? response
            : response?.data || response?.countries || [];
          setCountries(countriesData);
        } catch (error) {
          console.error("Error loading countries:", error);
        }
      }
    };
    loadInitialCountries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCountryId]);

  // Load country name when country_id changes
  useEffect(() => {
    if (selectedCountryId && selectedCountryId > 0) {
      // First try to get from countries list
      const countryFromList = countries.find((c) => c.id === selectedCountryId);
      if (countryFromList) {
        setCountryName(countryFromList.name);
      } else {
        // If not in list, fetch by ID
        getCountryById(selectedCountryId.toString())
          .then((response) => {
            const countryData = response?.data || response;
            if (countryData?.name) {
              setCountryName(countryData.name);
            }
          })
          .catch((error) => {
            console.error("Error loading country:", error);
            setCountryName("");
          });
      }
    } else {
      setCountryName("");
    }
  }, [selectedCountryId, countries]);

  // Load initial country name if country_id exists in default values
  useEffect(() => {
    const initialCountryId = form.getValues("country_id");
    if (initialCountryId && initialCountryId > 0 && !countryName) {
      getCountryById(initialCountryId.toString())
        .then((response) => {
          const countryData = response?.data || response;
          if (countryData?.name) {
            setCountryName(countryData.name);
          }
        })
        .catch((error) => {
          console.error("Error loading initial country:", error);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync form's country_code with selectedCountryCode on mount
  useEffect(() => {
    const dialCode =
      profileData?.mobile_details?.dial_code || form.getValues("country_code");
    if (dialCode && dialCode !== selectedCountryCode) {
      setSelectedCountryCode(dialCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data: EditProfileFormData) => {
    // Validate before submitting
    const isValid = await form.trigger();
    if (!isValid) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await updateRecruiterProfile({
        first_name: data.first_name,
        last_name: data.last_name,
        gender: data.gender,
        email: data.email,
        mobile_number: data.mobile_number,
        country_code: data.country_code,
        country_id: data.country_id,
        city_id: data.city_id,
        company_name: data.company_name,
        job_category: data.job_category,
        platform_role: data.platform_role,
      });

      if (response?.success && response?.data) {
        setCookie("profile_data", JSON.stringify(response.data));
      }

      toast.success(response?.message || "Profile updated successfully!");
      router.push("/profile");
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to update profile. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/profile");
  };

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList className="sm:gap-1.5">
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link
                href="/profile"
                className="text-gray-700 hover:text-black text-xs"
              >
                Profile
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <span className="text-gray-400">/</span>
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage className="text-gray-900 text-xs font-medium">
              Edit Basic Profile Details
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="bg-white border border-gray-200 rounded-2xl flex flex-col gap-5 w-full max-w-3xl mx-auto mt-2 md:mt-4">
        {/* Header */}
        <div className="bg-primary-50 flex items-center p-4 rounded-t-2xl">
          <h1 className="text-xl font-bold text-black">
            Edit Basic Profile Details
          </h1>
        </div>

        {/* Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 px-4 md:px-6 pb-6"
          >
            {/* Company Name */}
            <FormField
              control={form.control}
              name="company_name"
              render={({ field }) => (
                <FormItem className="w-full md:w-1/2">
                  <Label className="text-sm font-medium">Company name</Label>
                  <FormControl>
                    <Input
                      {...field}
                      className="border-gray-900"
                      placeholder="Enter company name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* First Name and Last Name */}
            <div className="flex flex-col md:flex-row gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <Label className="text-sm font-medium">First Name</Label>
                    <FormControl>
                      <Input
                        {...field}
                        className="border-gray-900"
                        placeholder="Enter First Name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <Label className="text-sm font-medium">Last Name</Label>
                    <FormControl>
                      <Input
                        {...field}
                        className="border-gray-900"
                        placeholder="Enter Last Name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Gender */}
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <Label className="text-base font-medium">Gender</Label>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-col gap-2"
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="Male" id="Male" />
                        <Label
                          htmlFor="Male"
                          className="text-sm font-normal cursor-pointer"
                        >
                          Male
                        </Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="Female" id="Female" />
                        <Label
                          htmlFor="Female"
                          className="text-sm font-normal cursor-pointer"
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

            {/* Email ID and Phone Number */}
            <div className="flex flex-col md:flex-row gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <Label className="text-sm font-medium">Email ID</Label>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        className="h-9 bg-gray-50 border-gray-200"
                        disabled
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mobile_number"
                render={({ field }) => (
                  <FormItem className="flex-1 ">
                    <Label className="text-sm font-medium">Phone Number</Label>
                    <FormControl>
                      <div className="flex border border-gray-900 rounded-md h-9 overflow-hidden">
                        <CountryCodeDropdown
                          value={
                            selectedCountryCode ||
                            form.getValues("country_code")
                          }
                          onValueChange={(dialCode) => {
                            setSelectedCountryCode(dialCode);
                            form.setValue("country_code", dialCode);
                          }}
                          className="rounded-r-none border-r border-gray-200"
                        />
                        <Input
                          {...field}
                          type="tel"
                          placeholder="Enter Phone Number"
                          maxLength={10}
                          className="h-8 border-0 rounded-l-none"
                          onChange={(e) => {
                            const numericValue = e.target.value.replace(
                              /\D/g,
                              ""
                            );
                            e.target.value = numericValue;
                            field.onChange(numericValue);
                          }}
                          onKeyDown={(e) => {
                            if (
                              [8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
                              (e.keyCode === 65 && e.ctrlKey === true) ||
                              (e.keyCode === 67 && e.ctrlKey === true) ||
                              (e.keyCode === 86 && e.ctrlKey === true) ||
                              (e.keyCode === 88 && e.ctrlKey === true) ||
                              (e.keyCode >= 35 && e.keyCode <= 39)
                            ) {
                              return;
                            }
                            if (
                              (e.shiftKey ||
                                e.keyCode < 48 ||
                                e.keyCode > 57) &&
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
            </div>

            {/* Country and City */}
            <div className="flex flex-col md:flex-row gap-4">
              <FormField
                control={form.control}
                name="country_id"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <Label className="text-sm font-medium">Country</Label>
                    <FormControl>
                      <CountryDropdown
                        value={
                          typeof field.value === "number" ? field.value : 0
                        }
                        onValueChange={(countryId) => {
                          // Ensure we always pass a number
                          const newCountryId =
                            typeof countryId === "number" ? countryId : 0;
                          field.onChange(newCountryId);
                          // Reset city when country changes
                          if (newCountryId !== field.value) {
                            form.setValue("city_id", 0);
                          }
                        }}
                        placeholder={
                          typeof profileData?.country === "string"
                            ? profileData.country
                            : undefined
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city_id"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <Label className="text-sm font-medium">City</Label>
                    <FormControl>
                      <CityDropdown
                        value={
                          typeof field.value === "number" ? field.value : 0
                        }
                        onValueChange={(cityId) => {
                          // Ensure we always pass a number
                          field.onChange(
                            typeof cityId === "number" ? cityId : 0
                          );
                        }}
                        countryName={countryName || selectedCountryData?.name}
                        placeholder="Select City"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Primary Job Posting Category and Platform Role */}
            <div className="flex flex-col md:flex-row gap-4">
              <FormField
                control={form.control}
                name="job_category"
                render={({ field }) => {
                  return (
                    <FormItem className="flex-1">
                      <Label className="text-sm font-medium text-black">
                        Primary Job Posting Category
                      </Label>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full border border-gray-900">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {jobCategoryOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="platform_role"
                render={({ field }) => {
                  return (
                    <FormItem className="flex-1">
                      <Label className="text-sm font-medium text-black">
                        Role using this platform primarily
                      </Label>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full border border-gray-900">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            {platformRoleOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="flex-1 h-8 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 h-8 bg-primary-500 hover:bg-primary-600"
              >
                Update
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
