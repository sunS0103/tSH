"use client";

import { getWorkModes } from "@/api/seeder";
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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { WorkModeMultiSelect } from "@/components/ui/work-mode-multi-select";
import { jobFormSchema, type JobFormData } from "@/validation/job";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ApplyFormAccordion from "./apply-form-accordion";
import AssessmentAccordion from "./assessment-accordion";

interface JobFormBaseProps {
  defaultValues?: Partial<JobFormData>;
  onSubmit: (data: JobFormData) => Promise<void>;
  onSaveDraft: (data: JobFormData) => Promise<void>;
  isLoading?: boolean;
  isEdit?: boolean;
}

const noticePeriodOptions = [
  { label: "Immediate", value: "Immediate" },
  { label: "15 days", value: "15 days" },
  { label: "30 days", value: "30 days" },
  { label: "30-45 days", value: "30-45 days" },
  { label: "45 days", value: "45 days" },
  { label: "60 days", value: "60 days" },
  { label: "90 days", value: "90 days" },
];

const experienceOptions = [
  { label: "0-1 Years", value: "0-1 Years" },
  { label: "1-2 Years", value: "1-2 Years" },
  { label: "2-3 Years", value: "2-3 Years" },
  { label: "3-5 Years", value: "3-5 Years" },
  { label: "5-7 Years", value: "5-7 Years" },
  { label: "7-10 Years", value: "7-10 Years" },
  { label: "10+ Years", value: "10+ Years" },
];

const primarySkillsOptions = [
  { label: "React", value: "React" },
  { label: "Node.js", value: "Node.js" },
  { label: "Python", value: "Python" },
  { label: "Java", value: "Java" },
  { label: "JavaScript", value: "JavaScript" },
  { label: "TypeScript", value: "TypeScript" },
  { label: "Angular", value: "Angular" },
  { label: "Vue.js", value: "Vue.js" },
  { label: "AWS", value: "AWS" },
  { label: "Docker", value: "Docker" },
  { label: "Kubernetes", value: "Kubernetes" },
  { label: "PostgreSQL", value: "PostgreSQL" },
  { label: "MongoDB", value: "MongoDB" },
  { label: "MySQL", value: "MySQL" },
  { label: "Machine Learning", value: "Machine Learning" },
  { label: "Data Science", value: "Data Science" },
  { label: "DevOps", value: "DevOps" },
  { label: "Selenium", value: "Selenium" },
  { label: "Playwright", value: "Playwright" },
  { label: "LangChain", value: "LangChain" },
];

export default function JobFormBase({
  defaultValues,
  onSubmit,
  onSaveDraft,
  isLoading = false,
  isEdit = false,
}: JobFormBaseProps) {
  const [workModeOptions, setWorkModeOptions] = useState<
    { id: number; name: string }[]
  >([]);

  const form = useForm<JobFormData>({
    resolver: zodResolver(jobFormSchema) as any,
    defaultValues: {
      company_name: defaultValues?.company_name || "",
      job_title: defaultValues?.job_title || "",
      job_location_type: defaultValues?.job_location_type || "inhouse_project",
      location: defaultValues?.location || "",
      region: defaultValues?.region || "",
      salary_min: defaultValues?.salary_min || "",
      experience_min: defaultValues?.experience_min || "",
      notice_period: defaultValues?.notice_period || "",
      work_mode: defaultValues?.work_mode || [],
      primary_skills: defaultValues?.primary_skills || "",
      job_description: defaultValues?.job_description || "",
      employment_gaps: defaultValues?.employment_gaps ?? false,
      contract_to_hire: defaultValues?.contract_to_hire ?? false,
      client_name: defaultValues?.client_name || "",
      conversion_time: defaultValues?.conversion_time || "",
      require_assessment: defaultValues?.require_assessment ?? false,
      assessment_id: defaultValues?.assessment_id || "",
      require_apply_form: defaultValues?.require_apply_form ?? false,
      apply_form_fields: defaultValues?.apply_form_fields || [],
    },
  });

  const jobLocationType = form.watch("job_location_type");
  const requireAssessment = form.watch("require_assessment");
  const requireApplyForm = form.watch("require_apply_form");
  const contractToHire = form.watch("contract_to_hire");

  // Fetch work modes
  useEffect(() => {
    getWorkModes()
      .then((response) => {
        setWorkModeOptions(
          response?.modes
            ?.filter((item: { id: number; name: string }) => item.id != null)
            ?.map((item: { id: number; name: string }) => ({
              id: item.id,
              name: item.name,
            })) || []
        );
      })
      .catch((error) => {
        console.error("Error fetching work modes:", error);
      });
  }, []);

  const handleSubmit = async (data: JobFormData) => {
    await onSubmit(data);
  };

  const handleSaveDraft = async () => {
    const data = form.getValues();
    await onSaveDraft(data);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-4 pb-20 sm:py-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Title Section */}
            <div className="bg-primary-50 rounded-t-2xl px-4 sm:px-6 py-4">
              <h1 className="text-lg sm:text-xl font-bold text-gray-950">
                {isEdit ? "Edit Job" : "Create Job"}
              </h1>
            </div>

            {/* Form Fields */}
            <div className="bg-white rounded-b-2xl px-4 sm:px-6 py-4 space-y-4">
              {/* Company Name and Job Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control as any}
                  name="company_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter company name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control as any}
                  name="job_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter job title" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Job Location Type */}
              <FormField
                control={form.control}
                name="job_location_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Where will this Job be served?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-col space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="client_location"
                            id="client_location"
                            className="cursor-pointer"
                          />
                          <Label 
                            htmlFor="client_location"
                            className="cursor-pointer"
                          >
                            Client location
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="inhouse_project"
                            id="inhouse_project"
                            className="cursor-pointer"
                          />
                          <Label 
                            htmlFor="inhouse_project"
                            className="cursor-pointer"
                          >
                            Inhouse Project
                          </Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Employment Gaps and Contract to Hire Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control as any}
                  name="employment_gaps"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between space-y-0">
                      <FormLabel className="flex-1">Employment Gaps</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control as any}
                  name="contract_to_hire"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between space-y-0">
                      <FormLabel className="flex-1">Contract to Hire</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Contract to Hire Additional Fields */}
              {contractToHire && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control as any}
                    name="client_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client Name </FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter client name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control as any}
                    name="conversion_time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Approximate conversion time to full-time.
                        </FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., 3 months" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Location and Region */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control as any}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter location" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control as any}
                  name="region"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Region</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter region" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Salary Range and Years of Experience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Salary Range */}
                <FormField
                  control={form.control as any}
                  name="salary_min"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Salary Range</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g., 3.0 to 6.8 LPA"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Years of Experience */}
                <FormField
                  control={form.control as any}
                  name="experience_min"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years of Experience</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select experience range" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="w-full">
                          {experienceOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Notice Period and Work Mode */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control as any}
                  name="notice_period"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notice Period</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select notice period" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="w-full">
                          {noticePeriodOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control as any}
                  name="work_mode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Work Mode</FormLabel>
                      <FormControl>
                        <WorkModeMultiSelect
                          value={
                            Array.isArray(field.value) && workModeOptions.length > 0
                              ? field.value
                                  .map((v) => {
                                    // If value is a string, find the matching ID
                                    if (typeof v === "string") {
                                      const mode = workModeOptions.find(
                                        (m) =>
                                          m.name.toLowerCase() ===
                                          v.toLowerCase()
                                      );
                                      return mode?.id;
                                    }
                                    return typeof v === "number" ? v : null;
                                  })
                                  .filter((id): id is number => id !== null)
                              : []
                          }
                          onValueChange={(modeIds: number[]) => {
                            // Convert IDs to names for the form
                            const modeNames = modeIds
                              .map((id) => {
                                const mode = workModeOptions.find(
                                  (m) => m.id === id
                                );
                                return mode?.name.toLowerCase() || "";
                              })
                              .filter((name) => name !== "");
                            field.onChange(modeNames);
                          }}
                          options={workModeOptions}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Primary Skill Set */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control as any}
                  name="primary_skills"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Skill Set</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select primary skill" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {primarySkillsOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Job Description */}
              <FormField
                control={form.control}
                name="job_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter job description..."
                        className="min-h-[200px]"
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-sm text-warning-700 mt-1">
                      Warning: "No communication details allowed in job
                      description."
                    </p>
                  </FormItem>
                )}
              />

              {/* Assessment Accordion */}
              <AssessmentAccordion
                form={form}
                requireAssessment={requireAssessment}
              />

              {/* Apply Form Accordion */}
              <ApplyFormAccordion
                form={form}
                requireApplyForm={requireApplyForm}
              />

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSaveDraft}
                  disabled={isLoading}
                  className="w-full sm:w-auto"
                >
                  Save as draft
                </Button>
                <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                  {isLoading ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

