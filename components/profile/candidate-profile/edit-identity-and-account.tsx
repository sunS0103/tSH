"use client";

import { updateCandidateProfile } from "@/api/profile";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CountryCodeDropdown } from "@/components/ui/country-code-dropdown";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { getCookie, setCookie } from "cookies-next/client";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { useRouter } from "next/navigation";

interface CountryCode {
  id: number;
  name: string;
  currency: string;
  dial_code: string;
  flag: string;
  is_active: boolean;
}

export default function EditIdentityAndAccount() {
  const cookieValue = getCookie("profile_data");

  const router = useRouter();

  const profileData = cookieValue ? JSON.parse(cookieValue as string) : null;
  const initialDialCode = profileData?.mobile_details?.dial_code || "+91";
  const [selectedCountryCode, setSelectedCountryCode] =
    useState<string>(initialDialCode);
  const [selectedCountryName, setSelectedCountryName] = useState<string>(
    profileData?.country || ""
  );

  const editAccountSchema = z.object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    gender: z.enum(["Male", "Female"], { message: "Please select gender" }),
    email: z.string().email("Invalid email address"),
    dial_code: z.string().min(1, "Dial code is required"),
    mobile_number: z
      .string()
      .min(1, "Phone number is required")
      .regex(/^\d+$/, "Phone number must contain only numbers")
      .length(10, "Phone number must be exactly 10 digits"),
    date_of_birth: z.string().optional(),
    account_type: z.enum(
      ["Student", "Working Professional", "Fresher", "Other"],
      {
        message: "Please select account type",
      }
    ),
  });

  const form = useForm<z.infer<typeof editAccountSchema>>({
    resolver: zodResolver(editAccountSchema),
    defaultValues: {
      first_name: profileData?.first_name,
      last_name: profileData?.last_name,
      gender: profileData?.gender === "Male" ? "Male" : "Female",
      email: profileData?.email,
      dial_code: profileData?.mobile_details?.dial_code || "+91",
      mobile_number: profileData?.mobile_details?.mobile_number || "",
      date_of_birth: profileData?.date_of_birth
        ? (() => {
            try {
              // Handle both timestamp (number) and date string
              const dateValue = profileData.date_of_birth;
              const date =
                typeof dateValue === "number"
                  ? new Date(dateValue)
                  : new Date(dateValue);
              if (!isNaN(date.getTime())) {
                return format(date, "MM-dd-yyyy");
              }
            } catch {
              // Invalid date, return empty string
            }
            return "";
          })()
        : "",
      account_type: profileData?.account_type,
      // countryCode: profileData?.dial_code,
      // country: profileData?.country,
    },
  });

  // Watch form's dial_code to sync with CountryCodeDropdown
  const formDialCode = form.watch("dial_code");

  // Sync form's dial_code with selectedCountryCode on mount
  useEffect(() => {
    if (formDialCode && formDialCode !== selectedCountryCode) {
      setSelectedCountryCode(formDialCode);
    }
  }, [formDialCode, selectedCountryCode]);

  const handleSubmit = async (data: z.infer<typeof editAccountSchema>) => {
    const role = getCookie("user_role");

    // Parse date_of_birth - handle both MM-dd-yyyy format and ISO string
    let dateOfBirthTimestamp: number;
    try {
      const dateStr = data.date_of_birth ?? "";
      if (
        typeof dateStr === "string" &&
        dateStr.includes("-") &&
        dateStr.split("-").length === 3
      ) {
        const [month, day, year] = dateStr.split("-");
        const date = new Date(
          parseInt(year),
          parseInt(month) - 1,
          parseInt(day)
        );
        dateOfBirthTimestamp = date.getTime();
      } else {
        // Assume it's an ISO string or other format
        dateOfBirthTimestamp = new Date(dateStr).getTime();
      }
    } catch {
      toast.error("Invalid date format");
      return;
    }

    await updateCandidateProfile({
      first_name: data.first_name,
      last_name: data.last_name,
      gender: data.gender,
      email: data.email,
      mobile_number: data.mobile_number,
      date_of_birth: dateOfBirthTimestamp,
      account_type: data.account_type,
      country_code: selectedCountryCode,
      country: selectedCountryName,
      // country_code: selectedCountryCode.dial_code,
      role: role === "CANDIDATE" ? "CANDIDATE" : "RECRUITER",
    })
      .then((response) => {
        if (response.success) {
          toast.success(response.message);
          setCookie(
            "profile_data",
            JSON.stringify({
              first_name: data.first_name,
              last_name: data.last_name,
              gender: data.gender,
              email: data.email,
              mobile_number: data.mobile_number,
              date_of_birth: dateOfBirthTimestamp,
              account_type: data.account_type,
              dial_code: selectedCountryCode,
              country: selectedCountryName,
              role: role === "CANDIDATE" ? "CANDIDATE" : "RECRUITER",
            })
          );
          router.push("/profile");
        }
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-3xl mx-auto mt-4">
      <div className="bg-primary-50 py-3 md:py-4 px-4 md:px-6 rounded-t-2xl">
        <h1 className="text-lg md:text-xl font-bold">
          Edit Account and Identity
        </h1>
      </div>
      <div className="p-4 md:p-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="w-full space-y-4 mt-4"
          >
            {/* First Name */}
            <div className="flex flex-col md:flex-row gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <Label>First name</Label>
                    <FormControl>
                      <Input
                        placeholder="Enter first name"
                        {...field}
                        className="border-black"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Last Name */}
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <Label>Last name</Label>
                    <FormControl>
                      <Input
                        placeholder="Enter last name"
                        {...field}
                        className="border-black"
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
                          className="font-normal text-gray-500"
                        >
                          Male
                        </Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="Female" id="Female" />
                        <Label
                          htmlFor="Female"
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

            <div className="flex flex-col md:flex-row gap-4 w-full">
              {/* Email ID - Disabled */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full md:w-1/2">
                    <Label>Email ID</Label>
                    <FormControl>
                      <Input placeholder="Enter email" {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone Number */}
              <FormField
                control={form.control}
                name="mobile_number"
                render={({ field }) => (
                  <FormItem className="w-full md:w-1/2">
                    <Label>Phone Number</Label>
                    <FormControl>
                      <div className="flex border border-black rounded-lg">
                        <CountryCodeDropdown
                          value={formDialCode || selectedCountryCode}
                          onValueChange={(dialCode, country) => {
                            setSelectedCountryCode(country.dial_code);
                            setSelectedCountryName(country.name);
                            form.setValue("dial_code", dialCode);
                          }}
                          className="rounded-r-none border-r border-black"
                        />
                        <Input
                          type="tel"
                          maxLength={10}
                          placeholder="99999 99999"
                          className="border-0 rounded-none"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => {
                            // Remove any non-numeric characters
                            const numericValue = e.target.value.replace(
                              /\D/g,
                              ""
                            );
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

            <div className="flex flex-col md:flex-row gap-4 w-full">
              {/* Date of Birth - Candidate only */}
              <FormField
                control={form.control}
                name="date_of_birth"
                render={({ field }) => (
                  <FormItem className="w-full md:w-1/2">
                    <Label>
                      Date of Birth{" "}
                      <span className="text-[10px] text-gray-500">
                        - optional
                      </span>
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl className="border border-black">
                          <Button
                            type="button"
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              (() => {
                                try {
                                  const date = new Date(field.value);
                                  if (!isNaN(date.getTime())) {
                                    return format(date, "MM-dd-yyyy");
                                  }
                                } catch {
                                  // Invalid date, show placeholder
                                }
                                return <span>Pick a date</span>;
                              })()
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
                          onSelect={(date) => {
                            if (date) {
                              // Format as MM-dd-yyyy string for consistency
                              field.onChange(format(date, "MM-dd-yyyy"));
                            } else {
                              field.onChange("");
                            }
                          }}
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

              {/* Account Type - Candidate only */}
              <FormField
                control={form.control}
                name="account_type"
                render={({ field }) => (
                  <FormItem className="w-full md:w-1/2">
                    <Label>Account Type</Label>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full border border-black">
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
            </div>
            {/* Buttons */}
            <div className="flex gap-3 pt-2 justify-end">
              <Button
                type="button"
                variant="secondary"
                className="w-fit"
                onClick={() => router.push("/profile")}
              >
                Cancel
              </Button>
              <Button type="submit" className="w-fit">
                Update
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
