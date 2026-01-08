import { z } from "zod";

export const jobFormSchema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  job_title: z.string().min(1, "Job title is required"),
  job_location_type: z.enum(["client_location", "inhouse_project"]),

  country_id: z.number().min(1, "Country is required"),
  city_id: z.number().min(1, "City is required"),
  salary_min: z.string().min(1, "Salary is required"),
  experience_min: z.string().min(1, "Minimum experience is required"),
  notice_period: z.string().min(1, "Notice period is required"),
  work_mode: z.array(z.string()).min(1, "Work mode is required"),
  skills: z.array(z.string()).min(1, "Skills are required"),
  job_description: z
    .string()
    .min(1, "Job description is required")
    .refine(
      (val) => {
        // Check for communication details (email, phone, etc.)
        const emailRegex =
          /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
        const phoneRegex =
          /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
        return !emailRegex.test(val) && !phoneRegex.test(val);
      },
      {
        message: "No communication details allowed in job description",
      }
    ),
  employment_gaps: z.boolean(),
  contract_to_hire: z.boolean(),
  // Client location specific fields
  client_name: z.string().optional(),
  conversion_time: z.string().optional(),
  // Assessment fields
  mandate_assessment: z
    .array(z.object({ id: z.string(), title: z.string() }))
    .optional(),
  assessment_id: z.string().optional(),
  // Apply form fields
  require_apply_form: z.boolean(),
  apply_form_fields: z.array(z.any()).optional(),
});

// Export the type to be used in useForm<JobFormData>
export type JobFormData = z.infer<typeof jobFormSchema>;
