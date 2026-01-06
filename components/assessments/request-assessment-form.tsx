"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CountryCodeDropdown } from "@/components/ui/country-code-dropdown";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { createAssessmentRequest } from "@/api/assessments";
import {
  requestAssessmentSchema,
  RequestAssessmentFormData,
} from "@/validation/request-assessment";
import { toast } from "sonner";

export default function RequestAssessmentForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RequestAssessmentFormData>({
    resolver: zodResolver(requestAssessmentSchema),
    defaultValues: {
      assessment_title: "",
      name: "",
      company_email: "",
      skills_to_assess: "",
      country_code: "+91",
      mobile_number: "",
      job_description: "",
      assessment_creation_preference: undefined,
      custom_instructions: "",
    },
  });

  const onSubmit = async (data: RequestAssessmentFormData) => {
    setIsSubmitting(true);
    try {
      // Transform data to match API expectations (convert undefined to null)
      const apiData = {
        ...data,
        assessment_creation_preference:
          data.assessment_creation_preference ?? null,
      };
      await createAssessmentRequest(apiData);
      toast.success("Assessment request submitted successfully!");
      router.push("/assessments");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error submitting assessment request:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to submit assessment request. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col h-full"
      >
        {/* Form Fields */}
        <div className="bg-white flex flex-col gap-4 items-start pb-6 pt-4 px-6 flex-1">
          {/* Row 1: Assessment Title and Company Email */}
          <div className="flex flex-col md:flex-row gap-4 items-center relative shrink-0 w-full md:w-1/2">
            <FormField
              control={form.control}
              name="assessment_title"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2 grow items-start relative w-full md:w-1/2">
                  <Label className="text-sm font-medium text-black">
                    Assessment Title
                  </Label>
                  <FormControl>
                    <Input
                      placeholder="Enter Title"
                      className="h-8 text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Row 2: Name and Company Email (duplicate) */}
          <div className="flex flex-col md:flex-row gap-4 items-center relative shrink-0 w-full">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2 grow items-start relative w-full md:w-1/2">
                  <Label className="text-sm font-medium text-black">Name</Label>
                  <FormControl>
                    <Input
                      placeholder="Enter Name"
                      className="h-8 text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="company_email"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2 grow items-start relative w-full md:w-1/2">
                  <Label className="text-sm font-medium text-black">
                    Company Email
                  </Label>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Select Company Email"
                      className="h-8 text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Row 3: Skills to Assess and Phone Number */}
          <div className="flex flex-col md:flex-row gap-4 items-center relative shrink-0 w-full">
            <FormField
              control={form.control}
              name="skills_to_assess"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2 grow items-start relative w-full md:w-1/2">
                  <Label className="text-sm font-medium text-black">
                    Skills to Assess
                  </Label>
                  <FormControl>
                    <Input
                      placeholder="Enter Skills"
                      className="h-8 text-sm"
                      {...field}
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
                <FormItem className="flex flex-col gap-2 grow items-start relative w-full md:w-1/2">
                  <Label className="text-sm font-medium text-black">
                    Phone Number
                  </Label>
                  <FormControl>
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden w-full h-8">
                      <FormField
                        control={form.control}
                        name="country_code"
                        render={({ field: countryField }) => (
                          <CountryCodeDropdown
                            value={countryField.value}
                            onValueChange={(dialCode) => {
                              countryField.onChange(dialCode);
                            }}
                            className="rounded-r-none border-r border-gray-200 h-8"
                          />
                        )}
                      />
                      <Input
                        type="tel"
                        placeholder="88888 88888"
                        className="h-8 border-0 rounded-none text-sm flex-1"
                        maxLength={10}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country_code"
              render={() => (
                <FormItem className="hidden">
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Job Description */}
          <FormField
            control={form.control}
            name="job_description"
            render={({ field }) => {
              const charCount = field.value?.length || 0;
              return (
                <FormItem className="flex flex-col gap-2 items-start relative shrink-0 w-full">
                  <Label className="text-sm font-medium text-black">
                    Job Description
                  </Label>
                  <FormControl>
                    <div className="relative pb-1 w-full h-full">
                      <Textarea
                        placeholder="Enter Job Description..."
                        className="h-full text-xs resize-none max-h-25 min-h-25"
                        maxLength={500}
                        rows={5}
                        {...field}
                      />
                      <span className="absolute -bottom-5 right-0 text-xs text-gray-600">
                        {charCount} / 500
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          {/* Assessment Creation Preference */}
          <FormField
            control={form.control}
            name="assessment_creation_preference"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2 items-start relative shrink-0 w-full">
                <Label className="text-sm font-medium text-black">
                  Assessment Creation Preference
                </Label>
                <FormControl>
                  <RadioGroup
                    value={field.value || undefined}
                    onValueChange={field.onChange}
                    className="flex flex-col gap-2"
                  >
                    <div className="flex gap-3 items-start">
                      <RadioGroupItem
                        value="Recruiter Create"
                        id="preference-own"
                      />
                      <Label
                        htmlFor="preference-own"
                        className="text-sm font-normal text-gray-800 cursor-pointer"
                      >
                        Recruiter will create their own questions
                      </Label>
                    </div>
                    <div className="flex gap-3 items-start">
                      <RadioGroupItem
                        value="Collaborate"
                        id="preference-collaborate"
                      />
                      <Label
                        htmlFor="preference-collaborate"
                        className="text-sm font-normal text-gray-800 cursor-pointer"
                      >
                        Collaborate with TechSmartHire for creation
                      </Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Custom Instructions */}
          <FormField
            control={form.control}
            name="custom_instructions"
            render={({ field }) => {
              const charCount = field.value?.length || 0;
              return (
                <FormItem className="flex flex-col gap-2 items-start relative shrink-0 w-full">
                  <Label className="text-sm font-medium text-black">
                    Custom Instructions
                  </Label>
                  <FormControl>
                    <div className="relative pb-1 w-full h-full">
                      <Textarea
                        placeholder="Please detail on your requirement"
                        className="h-full text-xs resize-none max-h-25 min-h-25"
                        maxLength={500}
                        rows={5}
                        {...field}
                      />
                      <span className="absolute -bottom-5 right-0 text-xs text-gray-600">
                        {charCount} / 500
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 items-start justify-end pb-6 pt-3 px-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="h-8 border-primary-500 text-primary-500"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-8 bg-primary-500 text-white px-5"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
