"use client";

import { updateEducation } from "@/api/profile";
import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { getCookie } from "cookies-next/client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

interface EditEducationFormData {
  degree_name: string;
  specialization: string;
  university_name: string;
  graduation_year: number | null;
  academic_status: "Completed" | "Final Year" | "Pursuing" | null;
}

export default function EditEducation() {
  const router = useRouter();

  const educationSchema = z
    .object({
      degree_name: z.string().min(1, "Degree name is required"),
      specialization: z.string().min(1, "Specialization is required"),
      university_name: z.string().min(1, "University name is required"),
      graduation_year: z.union([
        z
          .number()
          .min(1, "Graduation year must be at least 1")
          .max(2100, "Graduation year cannot be greater than 2100"),
        z.null(),
      ]),
      academic_status: z
        .enum(["Completed", "Final Year", "Pursuing"])
        .nullable(),
    })
    .refine((data) => data.graduation_year !== null, {
      message: "Graduation year is required",
      path: ["graduation_year"],
    })
    .refine((data) => data.academic_status !== null, {
      message: "Academic status is required",
      path: ["academic_status"],
    });

  const cookieValue = getCookie("education_data");
  const educationData = cookieValue ? JSON.parse(cookieValue as string) : null;

  const form = useForm<EditEducationFormData>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      degree_name: educationData?.degree_name || "",
      specialization: educationData?.specialization || "",
      university_name: educationData?.university_name || "",
      graduation_year: educationData?.graduation_year || null,
      academic_status: educationData?.academic_status || null,
    },
  });

  const onSubmit = async (data: EditEducationFormData) => {
    try {
      const response = await updateEducation(data);
      if (response.success) {
        toast.success(response.message || "Education updated successfully");
        // Navigate to next section in onboarding flow
        router.push("/profile-details/edit-skills");
      } else {
        toast.error(response.message || "Failed to update education");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response.data.message || "Failed to update education");
    }
  };

  const highestTypeOptions = [
    { label: "B.E", value: "B.E" },
    { label: "B.Tech", value: "B.Tech" },
    { label: "B.Sc", value: "B.Sc" },
    { label: "M.Tech", value: "M.Tech" },
    { label: "M.Sc", value: "M.Sc" },
    { label: "MCA", value: "MCA" },
    { label: "Diploma", value: "Diploma" },
    { label: "Other", value: "Other" },
  ];

  const academicStatusOptions = [
    { label: "Completed", value: "Completed" },
    { label: "Final Year", value: "Final Year" },
    { label: "Pursuing", value: "Pursuing" },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-3xl mx-auto mt-4 overflow-hidden">
      <div className="bg-primary-50 py-4 px-6">
        <h1 className="text-xl font-bold text-black">Edit Education</h1>
      </div>

      <div className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex flex-col md:flex-row gap-4">
              <FormField
                control={form.control}
                name="degree_name"
                render={({ field }) => (
                  <FormItem className="w-full md:w-1/2">
                    <FormLabel>Highest Degree</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="h-8 border-gray-900 w-full">
                          <SelectValue placeholder="Select highest degree" />
                        </SelectTrigger>
                        <SelectContent>
                          {highestTypeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="specialization"
                render={({ field }) => (
                  <FormItem className="w-full md:w-1/2">
                    <FormLabel>Specialization</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter specialization"
                        className="border-gray-900 w-full"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <FormField
                control={form.control}
                name="university_name"
                render={({ field }) => (
                  <FormItem className="w-full md:w-1/2">
                    <FormLabel>University Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter university name"
                        className="border-gray-900 w-full"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="graduation_year"
                render={({ field }) => (
                  <FormItem className="w-full md:w-1/2">
                    <FormLabel>Graduation Year</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        maxLength={10}
                        placeholder="Enter graduation year"
                        className="border-gray-900 w-full"
                        value={field.value || ""}
                        onChange={(e) => {
                          // Remove any non-numeric characters
                          const numericValue = e.target.value.replace(
                            /\D/g,
                            ""
                          );
                          e.target.value = numericValue;
                          // Set to null if empty, otherwise convert to number
                          field.onChange(
                            numericValue === "" ? null : Number(numericValue)
                          );
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
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="academic_status"
              render={({ field }) => (
                <FormItem className="w-full md:w-1/2">
                  <FormLabel>Academic Status</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(
                          value as "Completed" | "Final Year" | "Pursuing"
                        );
                      }}
                      value={field.value || undefined}
                    >
                      <SelectTrigger className="h-8 border-gray-900 w-full">
                        <SelectValue placeholder="Select academic status" />
                      </SelectTrigger>
                      <SelectContent>
                        {academicStatusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 justify-end pt-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  const isOnboarding = window.location.pathname.includes("/profile-details/");
                  router.push(isOnboarding ? "/profile-details/edit-employment" : "/profile");
                }}
                className="h-8 px-4 "
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-8 px-4"
                disabled={form.formState.isSubmitting}
              >
                Update
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
