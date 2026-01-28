"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import JobFormBase from "./job-form-base";
import {
  getRecruiterJob,
  createRecruiterJob,
  updateRecruiterJob,
  saveJobAsDraft,
} from "@/api/jobs/recruiter";
import Breadcrumbs from "@/components/common/breadcrumbs";
import { type JobFormData } from "@/validation/job";
import { Compensation, RecruiterJob } from "@/types/job";
import { getCookie } from "cookies-next/client";

interface JobFormProps {
  jobId?: string;
}

export default function JobForm({ jobId }: JobFormProps) {
  const token = getCookie("token");
  const router = useRouter();
  const isEditMode = !!jobId;
  const [isLoading, setIsLoading] = useState(false);
  const [defaultValues, setDefaultValues] = useState<Partial<JobFormData>>();

  useEffect(() => {
    if (isEditMode && jobId) {
      const fetchJob = async () => {
        try {
          setIsLoading(true);
          const response = await getRecruiterJob({ jobId, token });

          if (response.success && response.data) {
            const job = response.data as RecruiterJob;
            setDefaultValues(transformJobToFormData(job));
          } else {
            toast.error("Failed to load job details");
            router.push("/jobs");
          }
        } catch (error) {
          toast.error(
            (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Failed to load job",
          );
          router.push("/jobs");
        } finally {
          setIsLoading(false);
        }
      };

      fetchJob();
    }
  }, [jobId, isEditMode, router, token]);

  const handleSubmit = async (data: JobFormData) => {
    try {
      const payload = transformFormDataToPayload(data);

      const payloadWithStatus = {
        ...payload,
        status: "in_review",
      };

      if (isEditMode && jobId) {
        const response = await updateRecruiterJob(jobId, payloadWithStatus);
        if (response.success) {
          toast.success("Job updated successfully");
          router.push("/jobs");
        } else {
          toast.error(response.message || "Failed to update job");
        }
      } else {
        const response = await createRecruiterJob(payload);
        if (response.success) {
          toast.success("Job created successfully");
          router.push("/jobs");
        } else {
          toast.error(response.message || "Failed to create job");
        }
      }
    } catch (error) {
      toast.error(
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ||
          (isEditMode ? "Failed to update job" : "Failed to create job"),
      );
    }
  };

  const handleSaveDraft = async (data: JobFormData) => {
    try {
      const payload = transformFormDataToPayload(data);
      const payloadWithStatus = {
        ...payload,
        status: "draft",
      };
      const response = await saveJobAsDraft(jobId || null, payloadWithStatus);

      if (response.success) {
        toast.success("Job saved as draft");
        router.push("/jobs");
      } else {
        toast.error(response.message || "Failed to save draft");
      }
    } catch (error) {
      toast.error(
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to save draft",
      );
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
          routes={[{ label: "Jobs", href: "/jobs" }]}
          currentRoute={{ label: isEditMode ? "Edit Job" : "Create Job" }}
        />
      </div>

      <JobFormBase
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        onSaveDraft={handleSaveDraft}
        isEdit={isEditMode}
      />
    </div>
  );
}

// Skill name to ID mapping (this should ideally come from an API)
const skillNameToIdMap: Record<string, number> = {
  "Selenium Java": 1,
  "Playwright JS/TS": 2,
  Appium: 3,
  "Core Java": 4,
  Python: 5,
  React: 6,
  "Node.js": 7,
  AWS: 8,
  LangChain: 9,
  PostgreSQL: 10,
  MongoDB: 11,
};

// Reverse mapping: skill_id to skill name
const skillIdToNameMap: Record<number, string> = Object.fromEntries(
  Object.entries(skillNameToIdMap).map(([name, id]) => [id, name]),
);

function transformJobToFormData(job: RecruiterJob): Partial<JobFormData> {
  const experienceRange = job.experience_range || "";

  // Map job_serving_location back to job_location_type
  const jobLocationType =
    job.job_serving_location === "in-house project"
      ? "inhouse_project"
      : job.job_serving_location === "client location"
        ? "client_location"
        : "inhouse_project";

  // Get primary skills from skills array - convert all skills to array of skill names
  const primarySkills = job.skills
    ? job.skills
        .map((skill: { skill_id?: number }) => {
          const skillName = skill.skill_id
            ? skillIdToNameMap[skill.skill_id] || ""
            : "";
          return skillName;
        })
        .filter((name: string) => name !== "")
    : [];

  // Transform work_mode back to lowercase array
  const workMode = job.work_mode
    ? job.work_mode.map((mode: string) => mode.toLowerCase())
    : [];

  // Transform custom_fields back to apply_form_fields
  // The API returns all fields (default 5 + custom), but we only store custom fields in apply_form_fields
  // Default fields are: Current Company, Notice Period, Expected CTC, Visa status, About yourself
  const allFields = job.custom_fields || [];
  // Skip the first 5 default fields, only keep custom fields added by recruiter
  const applyFormFields = allFields.length > 5 ? allFields.slice(5) : [];

  return {
    company_name: job.company_name || "",
    job_title: job.title || "",
    job_location_type: jobLocationType,
    country_id: job.country.id || 0,
    city_id: job.city.id || 0,
    compensation: {
      min_amount: (job.compensation as Compensation)?.min_amount || 0,
      max_amount: (job.compensation as Compensation)?.max_amount || 0,
      currency: (job.compensation as Compensation)?.currency || "",
    },
    experience_min: experienceRange,
    notice_period: job.required_notice_period || "",
    work_mode: workMode,
    skills: primarySkills,
    job_description: job.description || "",
    employment_gaps: job.employment_gaps || false,
    contract_to_hire: job.contract_to_hire || false,
    client_name: job.client_name || "",
    conversion_time: job.conversion_time || "",
    mandate_assessment: Array.isArray(job.mandate_assessment)
      ? job.mandate_assessment.map((item) => {
          // Handle both object format {id, title} and string format
          if (typeof item === "string") {
            return { id: item, title: "" };
          }
          return { id: item.id, title: item.title };
        })
      : [],
    assessment_id: job.id || "",
    require_apply_form: applyFormFields.length > 0,
    apply_form_fields: applyFormFields,
  };
}

function transformFormDataToPayload(data: JobFormData) {
  // Parse salary range (e.g., "3.0 to 6.8 LPA" or "3.0-6.8")
  // const salaryMatch = data.compensation.min_amount
  //   .toString()
  //   .match(/(\d+\.?\d*)\s*(?:to|-)\s*(\d+\.?\d*)/i);
  // const salaryMin = salaryMatch
  //   ? parseFloat(salaryMatch[1])
  //   : parseFloat(data.compensation.min_amount.toString()) || 0;
  // const salaryMax = salaryMatch
  //   ? parseFloat(salaryMatch[2])
  //   : parseFloat(data.compensation.max_amount.toString()) || 0;

  // Parse experience range (e.g., "1-2 Years")
  const expMatch = data.experience_min.match(/(\d+)\s*-\s*(\d+)/);
  const experienceMinYears = expMatch
    ? parseFloat(expMatch[1])
    : parseFloat(data.experience_min) || 0;
  const experienceMaxYears = expMatch
    ? parseFloat(expMatch[2])
    : parseFloat(data.experience_min) || 0;

  // Map job_location_type to job_serving_location format
  const jobServingLocation =
    data.job_location_type === "inhouse_project"
      ? "in-house project"
      : "client location";

  // Transform work modes to capitalized array
  const workModes = data.work_mode.map(
    (mode: string) =>
      mode.charAt(0).toUpperCase() + mode.slice(1).toLowerCase(),
  );

  // Transform skills to array with skill_id and is_required
  const skills = Array.isArray(data.skills)
    ? data.skills.map((skillName: string) => ({
        skill_id: skillNameToIdMap[skillName] || 1,
        is_required: true,
      }))
    : [];

  // Transform custom fields (fields added by recruiter beyond the default 5)
  const customFields =
    data.apply_form_fields &&
    Array.isArray(data.apply_form_fields) &&
    data.apply_form_fields.length > 0
      ? data.apply_form_fields.map(
          (field: { title?: string; label?: string; type?: string }) => ({
            title: field.title || field.label || "",
            type: field.type || "text",
          }),
        )
      : [];

  // Combine default fields with custom fields
  const allCustomFields = [...customFields];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload: any = {
    title: data.job_title,
    description: data.job_description,
    company_name: data.company_name,
    city_id: data.city_id,
    country_id: data.country_id, // Default value - should be mapped from location string
    required_notice_period: data.notice_period,
    experience_min_years: experienceMinYears,
    experience_max_years: experienceMaxYears,
    contract_to_hire: data.contract_to_hire,
    job_serving_location: jobServingLocation,
    employment_gaps: data.employment_gaps,
    compensation: {
      min_amount: data.compensation.min_amount,
      max_amount: data.compensation.max_amount,
      currency: data.compensation.currency,
      period: "LPA",
    },
    custom_fields: allCustomFields,
    work_mode: workModes,
    skills: skills,
    mandate_assessment: Array.isArray(data.mandate_assessment)
      ? data.mandate_assessment.map((item) => {
          // Extract only the ID (string) for the payload
          if (typeof item === "string") {
            return item;
          }
          return item.id;
        })
      : [],
  };

  // Add contract to hire specific fields
  if (data.contract_to_hire) {
    payload.client_name = data.client_name || "";
    payload.conversion_time = data.conversion_time || "";
  }

  return payload;
}
