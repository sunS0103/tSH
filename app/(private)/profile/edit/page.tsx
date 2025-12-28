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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { CountryCodeDropdown } from "@/components/ui/country-code-dropdown";
import { CountryDropdown } from "@/components/ui/country-dropdown";
import { CityDropdown } from "@/components/ui/city-dropdown";
import { getCountries } from "@/api/seeder";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
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
  job_category: z
    .array(z.string())
    .min(1, "At least one job category is required"),
  platform_role: z
    .array(z.string())
    .min(1, "At least one platform role is required"),
});

type EditProfileFormData = z.infer<typeof editProfileSchema>;

export default function EditProfilePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("");
  const [countries, setCountries] = useState<{ id: number; name: string }[]>(
    []
  );

  const cookieValue = getCookie("profile_data");
  const profileData = cookieValue ? JSON.parse(cookieValue as string) : null;

  const form = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      company_name: profileData?.company_name || "",
      first_name: profileData?.first_name || "",
      last_name: profileData?.last_name || "",
      gender: profileData?.gender || "",
      email: profileData?.email || "",
      mobile_number: profileData?.mobile_number || "",
      country_code: profileData?.country_code || "",
      country_id: profileData?.country_id || 0,
      city_id: profileData?.city_id || 0,
      job_category: Array.isArray(profileData?.job_category)
        ? profileData.job_category
        : profileData?.job_category
        ? [profileData.job_category]
        : [],
      platform_role: Array.isArray(profileData?.platform_role)
        ? profileData.platform_role
        : profileData?.platform_role
        ? [profileData.platform_role]
        : [],
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

  // Initialize country code from profile data (only once on mount)
  useEffect(() => {
    if (profileData?.country_code && !selectedCountryCode) {
      setSelectedCountryCode(profileData.country_code);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data: EditProfileFormData) => {
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
                <FormItem>
                  <Label className="text-sm font-medium">Company name</Label>
                  <FormControl>
                    <Input {...field} className="h-8" />
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
                      <Input {...field} className="h-8" />
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
                      <Input {...field} className="h-8" />
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
                        <RadioGroupItem value="Male" id="male" />
                        <Label
                          htmlFor="male"
                          className="text-sm font-normal cursor-pointer"
                        >
                          Male
                        </Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="Female" id="female" />
                        <Label
                          htmlFor="female"
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
                        className="h-8 bg-gray-50 border-gray-200"
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
                  <FormItem className="flex-1">
                    <Label className="text-sm font-medium">Phone Number</Label>
                    <FormControl>
                      <div className="flex border border-gray-200 rounded-md h-8 overflow-hidden">
                        <CountryCodeDropdown
                          value={selectedCountryCode}
                          onValueChange={(dialCode) => {
                            setSelectedCountryCode(dialCode);
                            form.setValue("country_code", dialCode);
                          }}
                          className="rounded-r-none border-r border-gray-200"
                        />
                        <Input
                          {...field}
                          type="tel"
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
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder={profileData?.country}
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
                        value={field.value}
                        onValueChange={field.onChange}
                        countryName={selectedCountryData?.name}
                        placeholder={profileData?.city}
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
                  const jobCategoryOptions = ["Tech", "Engineering", "Design"];

                  const getSelectedLabel = () => {
                    const selected = jobCategoryOptions.filter((option) =>
                      (field.value || []).includes(option)
                    );
                    if (selected.length === 0) return "Select category";
                    return selected.join(", ");
                  };

                  return (
                    <FormItem className="flex-1">
                      <Label className="text-sm font-medium text-black">
                        Primary Job Posting Category
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "min-h-8 h-auto w-full justify-between border-gray-900 bg-white text-left font-normal py-2",
                              "hover:bg-white"
                            )}
                          >
                            <span className="flex-1 text-wrap wrap-break-word pr-2">
                              {getSelectedLabel()}
                            </span>
                            <Icon
                              icon="material-symbols:keyboard-arrow-down-rounded"
                              className="h-4 w-4 shrink-0 opacity-50"
                            />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-[254px] p-0 bg-white border border-gray-200 rounded-2xl shadow-[0px_0px_25px_0px_rgba(0,0,0,0.15)]"
                          align="start"
                        >
                          <div className="flex flex-col">
                            {jobCategoryOptions.map((option, index) => (
                              <div
                                key={option}
                                className={cn(
                                  "flex items-center gap-4 px-6 py-4 border-b border-gray-200 last:border-b-0 cursor-pointer hover:bg-gray-50",
                                  index === 0 && "rounded-t-2xl",
                                  index === jobCategoryOptions.length - 1 &&
                                    "rounded-b-2xl"
                                )}
                                onClick={() => {
                                  const currentValue = field.value || [];
                                  const isSelected =
                                    currentValue.includes(option);
                                  if (isSelected) {
                                    field.onChange(
                                      currentValue.filter(
                                        (val) => val !== option
                                      )
                                    );
                                  } else {
                                    field.onChange([...currentValue, option]);
                                  }
                                }}
                              >
                                <Checkbox
                                  checked={(field.value || []).includes(option)}
                                  onCheckedChange={(checked) => {
                                    const currentValue = field.value || [];
                                    if (checked) {
                                      field.onChange([...currentValue, option]);
                                    } else {
                                      field.onChange(
                                        currentValue.filter(
                                          (val) => val !== option
                                        )
                                      );
                                    }
                                  }}
                                  className="size-5"
                                />
                                <Label className="text-base font-normal text-black cursor-pointer flex-1">
                                  {option}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="platform_role"
                render={({ field }) => {
                  const platformRoleOptions = [
                    "Hiring Manager for a project",
                    "HR Manager",
                    "Recruiter",
                  ];

                  const getSelectedLabel = () => {
                    const selected = platformRoleOptions.filter((option) =>
                      (field.value || []).includes(option)
                    );
                    if (selected.length === 0) return "Select role";
                    return selected.join(", ");
                  };

                  return (
                    <FormItem className="flex-1">
                      <Label className="text-sm font-medium text-black">
                        Role using this platform primarily
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "min-h-8 h-auto w-full justify-between border-gray-900 bg-white text-left font-normal py-2",
                              "hover:bg-white"
                            )}
                          >
                            <span className="flex-1 text-wrap wrap-break-word pr-2">
                              {getSelectedLabel()}
                            </span>
                            <Icon
                              icon="material-symbols:keyboard-arrow-down-rounded"
                              className="h-4 w-4 shrink-0 opacity-50"
                            />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-[254px] p-0 bg-white border border-gray-200 rounded-2xl shadow-[0px_0px_25px_0px_rgba(0,0,0,0.15)]"
                          align="start"
                        >
                          <div className="flex flex-col">
                            {platformRoleOptions.map((option, index) => (
                              <div
                                key={option}
                                className={cn(
                                  "flex items-center gap-4 px-6 py-4 border-b border-gray-200 last:border-b-0 cursor-pointer hover:bg-gray-50",
                                  index === 0 && "rounded-t-2xl",
                                  index === platformRoleOptions.length - 1 &&
                                    "rounded-b-2xl"
                                )}
                                onClick={() => {
                                  const currentValue = field.value || [];
                                  const isSelected =
                                    currentValue.includes(option);
                                  if (isSelected) {
                                    field.onChange(
                                      currentValue.filter(
                                        (val) => val !== option
                                      )
                                    );
                                  } else {
                                    field.onChange([...currentValue, option]);
                                  }
                                }}
                              >
                                <Checkbox
                                  checked={(field.value || []).includes(option)}
                                  onCheckedChange={(checked) => {
                                    const currentValue = field.value || [];
                                    if (checked) {
                                      field.onChange([...currentValue, option]);
                                    } else {
                                      field.onChange(
                                        currentValue.filter(
                                          (val) => val !== option
                                        )
                                      );
                                    }
                                  }}
                                  className="size-5"
                                />
                                <Label className="text-base font-normal text-black cursor-pointer flex-1">
                                  {option}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
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
