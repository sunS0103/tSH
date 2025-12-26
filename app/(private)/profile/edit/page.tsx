"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { getCookie } from "cookies-next/client";

const editProfileSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  gender: z.enum(["male", "female"]),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\d+$/, "Phone number must contain only numbers")
    .length(10, "Phone number must be exactly 10 digits"),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  primaryJobCategory: z.string().min(1, "Primary job category is required"),
  platformRole: z.string().min(1, "Platform role is required"),
});

type EditProfileFormData = z.infer<typeof editProfileSchema>;

export default function EditProfilePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      companyName: "Techplazza",
      firstName: "Darshan",
      lastName: "Joshi",
      gender: "male",
      email: getCookie("user_email") as string,
      phone: "99999 9999",
      country: "India",
      city: "Surat",
      primaryJobCategory: "Tech",
      platformRole: "Hiring Manager for a project",
    },
  });

  const gender = watch("gender");

  const onSubmit = async (data: EditProfileFormData) => {
    setIsSubmitting(true);
    try {
      toast.success("Profile updated successfully!");
      router.push("/profile");
    } catch {
      toast.error("Failed to update profile. Please try again.");
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
                href="/assessments"
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
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 px-4 md:px-6 pb-6"
        >
          {/* Company Name */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="companyName" className="text-sm font-medium">
              Company name
            </Label>
            <Input
              id="companyName"
              {...register("companyName")}
              className="h-8"
              aria-invalid={errors.companyName ? "true" : "false"}
            />
            {errors.companyName && (
              <p className="text-xs text-destructive">
                {errors.companyName.message}
              </p>
            )}
          </div>

          {/* First Name and Last Name */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex flex-col gap-2 flex-1">
              <Label htmlFor="firstName" className="text-sm font-medium">
                First Name
              </Label>
              <Input
                id="firstName"
                {...register("firstName")}
                className="h-8"
                aria-invalid={errors.firstName ? "true" : "false"}
              />
              {errors.firstName && (
                <p className="text-xs text-destructive">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <Label htmlFor="lastName" className="text-sm font-medium">
                Last Name
              </Label>
              <Input
                id="lastName"
                {...register("lastName")}
                className="h-8"
                aria-invalid={errors.lastName ? "true" : "false"}
              />
              {errors.lastName && (
                <p className="text-xs text-destructive">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* Gender */}
          <div className="flex flex-col gap-2">
            <Label className="text-base font-medium">Gender</Label>
            <RadioGroup
              value={gender}
              onValueChange={(value) =>
                setValue("gender", value as "male" | "female")
              }
              className="flex flex-col gap-2"
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem value="male" id="male" />
                <Label
                  htmlFor="male"
                  className="text-sm font-normal cursor-pointer"
                >
                  Male
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="female" id="female" />
                <Label
                  htmlFor="female"
                  className="text-sm font-normal cursor-pointer"
                >
                  Female
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Email ID and Phone Number */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex flex-col gap-2 flex-1">
              <Label htmlFor="email" className="text-sm font-medium">
                Email ID
              </Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                className="h-8 bg-gray-50 border-gray-200"
                disabled
                aria-invalid={errors.email ? "true" : "false"}
              />
              {errors.email && (
                <p className="text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone Number
              </Label>
              <div className="flex border border-gray-200 rounded-md h-8 overflow-hidden">
                <div className="flex items-center gap-1 px-3 border-r border-gray-200 bg-white">
                  <span className="text-xs">🇮🇳</span>
                  <span className="text-xs">+91</span>
                </div>
                <Input
                  id="phone"
                  type="tel"
                  maxLength={10}
                  {...register("phone", {
                    onChange: (e) => {
                      // Remove any non-numeric characters
                      const numericValue = e.target.value.replace(/\D/g, "");
                      e.target.value = numericValue;
                      setValue("phone", numericValue, { shouldValidate: true });
                    },
                  })}
                  className="h-8 border-0 rounded-l-none"
                  aria-invalid={errors.phone ? "true" : "false"}
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
              {errors.phone && (
                <p className="text-xs text-destructive">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>

          {/* Country and City */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex flex-col gap-2 flex-1">
              <Label htmlFor="country" className="text-sm font-medium">
                Country
              </Label>
              <Select
                value={watch("country")}
                onValueChange={(value) => setValue("country", value)}
              >
                <SelectTrigger id="country" className="h-8 w-full">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="India">India</SelectItem>
                  <SelectItem value="USA">USA</SelectItem>
                  <SelectItem value="UK">UK</SelectItem>
                </SelectContent>
              </Select>
              {errors.country && (
                <p className="text-xs text-destructive">
                  {errors.country.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <Label htmlFor="city" className="text-sm font-medium">
                City
              </Label>
              <Select
                value={watch("city")}
                onValueChange={(value) => setValue("city", value)}
              >
                <SelectTrigger id="city" className="h-8 w-full">
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Surat">Surat</SelectItem>
                  <SelectItem value="Mumbai">Mumbai</SelectItem>
                  <SelectItem value="Delhi">Delhi</SelectItem>
                </SelectContent>
              </Select>
              {errors.city && (
                <p className="text-xs text-destructive">
                  {errors.city.message}
                </p>
              )}
            </div>
          </div>

          {/* Primary Job Posting Category and Platform Role */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex flex-col gap-2 flex-1">
              <Label
                htmlFor="primaryJobCategory"
                className="text-sm font-medium"
              >
                Primary Job Posting Category
              </Label>
              <Select
                value={watch("primaryJobCategory")}
                onValueChange={(value) => setValue("primaryJobCategory", value)}
              >
                <SelectTrigger id="primaryJobCategory" className="h-8 w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tech">Tech</SelectItem>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                </SelectContent>
              </Select>
              {errors.primaryJobCategory && (
                <p className="text-xs text-destructive">
                  {errors.primaryJobCategory.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <Label htmlFor="platformRole" className="text-sm font-medium">
                Role using this platform primarily
              </Label>
              <Select
                value={watch("platformRole")}
                onValueChange={(value) => setValue("platformRole", value)}
              >
                <SelectTrigger id="platformRole" className="h-8 w-full">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hiring Manager for a project">
                    Hiring Manager for a project
                  </SelectItem>
                  <SelectItem value="HR Manager">HR Manager</SelectItem>
                  <SelectItem value="Recruiter">Recruiter</SelectItem>
                </SelectContent>
              </Select>
              {errors.platformRole && (
                <p className="text-xs text-destructive">
                  {errors.platformRole.message}
                </p>
              )}
            </div>
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
              {isSubmitting ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
