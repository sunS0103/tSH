"use client";

import { getCountryById, getSkills, getWorkModes } from "@/api/seeder";
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
import TiptapEditor from "@/components/ui/tiptap-editor";
import { WorkModeMultiSelect } from "@/components/ui/work-mode-multi-select";
import { jobFormSchema, type JobFormData } from "@/validation/job";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ApplyFormAccordion from "./apply-form-accordion";
import AssessmentAccordion from "./assessment-accordion";
import SkillsSelect from "./skills-select";
import { CountryDropdown } from "@/components/ui/country-dropdown";
import { CityDropdown } from "@/components/ui/city-dropdown";
import { Skill } from "@/types/job";

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
  { label: "Selenium Java", value: 1 },
  { label: "Playwright JS/TS", value: 2 },
  { label: "Appium", value: 3 },
  { label: "Core Java", value: 4 },
  { label: "Python", value: 5 },
  { label: "React", value: 6 },
  { label: "Node.js", value: 7 },
  { label: "AWS", value: 8 },
  { label: "LangChain", value: 9 },
  { label: "PostgreSQL", value: 10 },
  { label: "MongoDB", value: 11 },
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

  const [countryName, setCountryName] = useState<string>("");
  const [skills, setSkills] = useState<Skill[]>([]);

  // Note: `as any` is used here due to a type incompatibility between
  // react-hook-form's resolver types and zodResolver. This is a known issue
  // and doesn't affect runtime behavior. The form is still fully type-safe.

  const form = useForm<JobFormData>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      company_name: defaultValues?.company_name || "",
      job_title: defaultValues?.job_title || "",
      job_location_type: defaultValues?.job_location_type || "inhouse_project",
      country_id: defaultValues?.country_id || 0,
      city_id: defaultValues?.city_id || 0,
      compensation: defaultValues?.compensation
        ? {
            min_amount:
              typeof defaultValues.compensation.min_amount === "string"
                ? Number(defaultValues.compensation.min_amount)
                : defaultValues.compensation.min_amount || 0,
            max_amount:
              typeof defaultValues.compensation.max_amount === "string"
                ? Number(defaultValues.compensation.max_amount)
                : defaultValues.compensation.max_amount || 0,
            currency: defaultValues.compensation.currency || "INR",
          }
        : {
            min_amount: 0,
            max_amount: 0,
            currency: "INR",
          },
      experience_min: defaultValues?.experience_min || "",
      notice_period: defaultValues?.notice_period || "",
      work_mode: defaultValues?.work_mode || [],
      skills: Array.isArray(defaultValues?.skills) ? defaultValues.skills : [],
      job_description: defaultValues?.job_description || "",
      employment_gaps: defaultValues?.employment_gaps ?? false,
      contract_to_hire: defaultValues?.contract_to_hire ?? false,
      client_name: defaultValues?.client_name || "",
      conversion_time: defaultValues?.conversion_time || "",
      mandate_assessment: defaultValues?.mandate_assessment ?? [],
      assessment_id: defaultValues?.assessment_id || "",
      require_apply_form: defaultValues?.require_apply_form ?? false,
      apply_form_fields: defaultValues?.apply_form_fields || [],
    },
  });

  const contractToHire = form.watch("contract_to_hire");

  const fetchSkills = async () => {
    try {
      const response = await getSkills();
      setSkills(response.data || []);
    } catch (error) {
      console.error("Error fetching skills:", error);
      setSkills([]);
    }
  };

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

    fetchSkills();
  }, []);

  const handleSubmit = async (data: JobFormData) => {
    await onSubmit(data);
  };

  const handleSaveDraft = async () => {
    const data = form.getValues();
    await onSaveDraft(data);
  };

  const countryId = form.watch("country_id");

  useEffect(() => {
    if (countryId && countryId > 0) {
      getCountryById(countryId.toString())
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
    } else {
      setCountryName("");
      // Reset city when country is cleared
      if (form.getValues("city_id") > 0) {
        form.setValue("city_id", 0);
      }
    }
  }, [countryId, form]);

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

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-20 sm:py-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
                control={form.control}
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
                control={form.control}
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
                control={form.control}
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
                control={form.control}
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
                  control={form.control}
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
                  control={form.control}
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

            <div className="flex flex-col md:flex-row gap-4">
              <FormField
                control={form.control}
                name="country_id"
                render={({ field }) => (
                  <FormItem className="w-full md:w-1/2">
                    <Label className="text-sm font-medium text-black">
                      Current Country
                    </Label>
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
                  <FormItem className="w-full md:w-1/2">
                    <Label className="text-sm font-medium text-black">
                      Current City
                    </Label>
                    <FormControl>
                      <CityDropdown
                        value={
                          typeof field.value === "number" ? field.value : 0
                        }
                        countryName={countryName}
                        onValueChange={(cityId) => {
                          // Ensure we always pass a number
                          field.onChange(
                            typeof cityId === "number" ? cityId : 0
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Salary Range and Years of Experience */}
            <FormLabel>Salary Range (in CTC)</FormLabel>

            <div className="flex flex-row items-center gap-4">
              {/* Salary Range */}
              <FormField
                control={form.control}
                name="compensation.min_amount"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter Minimum Salary"
                        type="number"
                        value={field.value?.toString() || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(
                            value === "" ? undefined : Number(value)
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormLabel>to</FormLabel>
              <FormField
                control={form.control}
                name="compensation.max_amount"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter Maximum Salary"
                        type="number"
                        value={field.value?.toString() || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(
                            value === "" ? undefined : Number(value)
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="compensation.currency"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                          <SelectItem value="INR">INR</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="CAD">CAD</SelectItem>
                          <SelectItem value="AED">AED</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Notice Period and Work Mode */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Years of Experience */}
              <FormField
                control={form.control}
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

              <FormField
                control={form.control}
                name="notice_period"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notice Period</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
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
                control={form.control}
                name="work_mode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Work Mode</FormLabel>
                    <FormControl>
                      <WorkModeMultiSelect
                        value={
                          Array.isArray(field.value) &&
                          workModeOptions.length > 0
                            ? field.value
                                .map((v) => {
                                  // If value is a string, find the matching ID
                                  if (typeof v === "string") {
                                    const mode = workModeOptions.find(
                                      (m) =>
                                        m.name.toLowerCase() === v.toLowerCase()
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
              <SkillsSelect form={form} skills={skills} />
            </div>

            {/* Job Description */}
            <FormField
              control={form.control}
              name="job_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Description</FormLabel>
                  <FormControl>
                    <TiptapEditor
                      value={field.value || ""}
                      onChange={field.onChange}
                      placeholder="Enter job description..."
                      // className="h-50"
                      minHeight="200px"
                      maxHeight="200px"
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-sm text-warning-700 mt-1">
                    Warning: &quot;No communication details allowed in job
                    description.&quot;
                  </p>
                </FormItem>
              )}
            />

            {/* Assessment Accordion */}
            <AssessmentAccordion form={form} />

            {/* Apply Form Accordion */}
            <ApplyFormAccordion form={form} />

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
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                {isLoading ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
