"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import JobFormBase from "../shared/job-form-base";
import {
  getRecruiterJob,
  updateRecruiterJob,
  saveJobAsDraft,
} from "@/api/jobs/recruiter";
import Breadcrumbs from "@/components/common/breadcrumbs";
import { type JobFormData } from "@/validation/job";

interface EditJobFormProps {
  jobId: string;
}

export default function EditJobForm({ jobId }: EditJobFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [defaultValues, setDefaultValues] = useState<Partial<JobFormData>>();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setIsLoading(true);
        const response = await getRecruiterJob(jobId);

        if (response.success && response.data) {
          const job = response.data;
          setDefaultValues(transformJobToFormData(job));
        } else {
          toast.error("Failed to load job details");
          router.push("/jobs");
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to load job");
        router.push("/jobs");
      } finally {
        setIsLoading(false);
      }
    };

    if (jobId) {
      fetchJob();
    }
  }, [jobId, router]);

  const handleSubmit = async (data: JobFormData) => {
    try {
      const payload = transformFormDataToPayload(data);
      const response = await updateRecruiterJob(jobId, payload);

      if (response.success) {
        toast.success("Job updated successfully");
        router.push("/jobs");
      } else {
        toast.error(response.message || "Failed to update job");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update job");
    }
  };

  const handleSaveDraft = async (data: JobFormData) => {
    try {
      const payload = transformFormDataToPayload(data);
      const response = await saveJobAsDraft(jobId, payload);

      if (response.success) {
        toast.success("Job saved as draft");
        router.push("/jobs");
      } else {
        toast.error(response.message || "Failed to save draft");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to save draft");
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <Breadcrumbs
          routes={[{ label: "Dashboard", href: "/dashboard" }]}
          currentRoute={{ label: "Edit Job" }}
        />
      </div>
      <JobFormBase
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        onSaveDraft={handleSaveDraft}
        isEdit={true}
      />
    </div>
  );
}

// Skill name to ID mapping (this should ideally come from an API)
const skillNameToIdMap: Record<string, number> = {
  "React": 1,
  "Node.js": 2,
  "Python": 3,
  "Java": 4,
  "JavaScript": 5,
  "TypeScript": 6,
  "Angular": 7,
  "Vue.js": 8,
  "AWS": 9,
  "Docker": 10,
  "Kubernetes": 11,
  "PostgreSQL": 12,
  "MongoDB": 13,
  "MySQL": 14,
  "Machine Learning": 15,
  "Data Science": 16,
  "DevOps": 17,
  "Selenium": 18,
  "Playwright": 19,
  "LangChain": 20,
};

// Reverse mapping: skill_id to skill name
const skillIdToNameMap: Record<number, string> = Object.fromEntries(
  Object.entries(skillNameToIdMap).map(([name, id]) => [id, name])
);

function transformJobToFormData(job: any): Partial<JobFormData> {
  // Parse experience range from API response
  const experienceMinYears = job.experience_min_years || 0;
  const experienceMaxYears = job.experience_max_years || 0;
  const experienceMin = experienceMinYears && experienceMaxYears
    ? `${experienceMinYears}-${experienceMaxYears} Years`
    : "";

  // Parse salary from compensation object
  const salaryMin = job.compensation?.min_amount || 0;
  const salaryMax = job.compensation?.max_amount || 0;
  const salaryStr = salaryMin && salaryMax
    ? `${salaryMin} to ${salaryMax} ${job.compensation?.period || "LPA"}`
    : "";

  // Map job_serving_location back to job_location_type
  const jobLocationType = job.job_serving_location === "in-house project"
    ? "inhouse_project"
    : job.job_serving_location === "client location"
    ? "client_location"
    : "inhouse_project";

  // Get primary skill from skills array
  const primarySkillId = job.skills?.[0]?.skill_id;
  const primarySkill = primarySkillId ? skillIdToNameMap[primarySkillId] || "" : "";

  // Transform work_modes back to lowercase array
  const workMode = job.work_modes
    ? job.work_modes.map((mode: string) => mode.toLowerCase())
    : [];

  // Transform custom_fields back to apply_form_fields
  const applyFormFields = job.custom_fields || [];

  return {
    company_name: job.company_name || "",
    job_title: job.title || "",
    job_location_type: jobLocationType,
    location: job.location || "", // Location as string
    region: job.region || "",
    salary_min: salaryStr,
    experience_min: experienceMin,
    notice_period: job.required_notice_period || "",
    work_mode: workMode,
    primary_skills: primarySkill,
    job_description: job.description || "",
    employment_gaps: job.employment_gaps || false,
    contract_to_hire: job.contract_to_hire || false,
    client_name: job.client_name || "",
    conversion_time: job.conversion_time || "",
    require_assessment: job.require_assessment || false,
    assessment_id: job.assessment_id || "",
    require_apply_form: applyFormFields.length > 0,
    apply_form_fields: applyFormFields,
  };
}

function transformFormDataToPayload(data: JobFormData) {
  // Parse salary range (e.g., "3.0 to 6.8 LPA" or "3.0-6.8")
  const salaryMatch = data.salary_min.match(/(\d+\.?\d*)\s*(?:to|-)\s*(\d+\.?\d*)/i);
  const salaryMin = salaryMatch ? parseFloat(salaryMatch[1]) : parseFloat(data.salary_min) || 0;
  const salaryMax = salaryMatch ? parseFloat(salaryMatch[2]) : parseFloat(data.salary_min) || 0;

  // Parse experience range (e.g., "1-2 Years")
  const expMatch = data.experience_min.match(/(\d+)\s*-\s*(\d+)/);
  const experienceMinYears = expMatch ? parseFloat(expMatch[1]) : parseFloat(data.experience_min) || 0;
  const experienceMaxYears = expMatch ? parseFloat(expMatch[2]) : parseFloat(data.experience_min) || 0;

  // Map job_location_type to job_serving_location format
  const jobServingLocation = data.job_location_type === "inhouse_project" 
    ? "in-house project" 
    : "client location";

  // Transform work modes to capitalized array
  const workModes = data.work_mode.map((mode: string) => 
    mode.charAt(0).toUpperCase() + mode.slice(1).toLowerCase()
  );

  // Transform skills to array with skill_id and is_required
  const skillId = skillNameToIdMap[data.primary_skills] || 1;
  const skills = [{ skill_id: skillId, is_required: true }];

  // Transform custom fields
  const customFields = data.require_apply_form && data.apply_form_fields
    ? data.apply_form_fields.map((field: any) => ({
        title: field.title || field.label || "",
        type: field.type || "text",
        value: field.value || "",
      }))
    : [];

  const payload: any = {
    title: data.job_title,
    description: data.job_description,
    company_name: data.company_name,
    city_id: 1, // Default value - should be mapped from location string
    country_id: 65, // Default value - should be mapped from location string
    required_notice_period: data.notice_period,
    experience_min_years: experienceMinYears,
    experience_max_years: experienceMaxYears,
    contract_to_hire: data.contract_to_hire,
    job_serving_location: jobServingLocation,
    employment_gaps: data.employment_gaps,
    region: data.region,
    compensation: {
      min_amount: salaryMin,
      max_amount: salaryMax,
      currency: "INR",
      period: "LPA",
    },
    custom_fields: customFields,
    work_modes: workModes,
    skills: skills,
  };

  // Add client location specific fields
  if (data.job_location_type === "client_location") {
    payload.client_name = data.client_name;
    payload.conversion_time = data.conversion_time;
  }

  return payload;
}

