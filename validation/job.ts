import { z } from "zod";

export const jobFormSchema = z
  .object({
    company_name: z.string().min(1, "Company name is required"),
    job_title: z.string().min(1, "Job title is required"),
    job_location_type: z.enum(["client_location", "inhouse_project"]),
    location: z.string().min(1, "Location is required"),
    region: z.string().min(1, "Region is required"),
    salary_min: z.string().min(1, "Salary is required"),
    experience_min: z.string().min(1, "Minimum experience is required"),
    notice_period: z.string().min(1, "Notice period is required"),
    work_mode: z.array(z.string()).min(1, "Work mode is required"),
    primary_skills: z.string().min(1, "Primary skills are required"),
    job_description: z
      .string()
      .min(1, "Job description is required")
      .refine(
        (val) => {
          // Check for communication details (email, phone, etc.)
          const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
          const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
          return !emailRegex.test(val) && !phoneRegex.test(val);
        },
        {
          message: "No communication details allowed in job description",
        }
      ),
    employment_gaps: z.boolean().default(false),
    contract_to_hire: z.boolean().default(false),
    // Client location specific fields
    client_name: z.string().optional(),
    conversion_time: z.string().optional(),
    // Assessment fields
    require_assessment: z.boolean().default(false),
    assessment_id: z.string().optional(),
    // Apply form fields
    require_apply_form: z.boolean().default(false),
    apply_form_fields: z.array(z.any()).optional(),
  })
  .refine(
    (data) => {
      if (data.job_location_type === "client_location") {
        return data.client_name && data.conversion_time;
      }
      return true;
    },
    {
      message: "Client name and conversion time are required for client location",
      path: ["client_name"],
    }
  )
  .refine(
    (data) => {
      if (data.require_assessment) {
        return data.assessment_id;
      }
      return true;
    },
    {
      message: "Please select an assessment",
      path: ["assessment_id"],
    }
  );

// Export the type to be used in useForm<JobFormData>
export type JobFormData = z.infer<typeof jobFormSchema>;

