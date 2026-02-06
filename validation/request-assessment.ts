import { z } from "zod";

export const requestAssessmentSchema = z.object({
  assessment_title: z.string().min(1, "Assessment title is required"),
  name: z.string().min(1, "Name is required"),
  company_email: z.string().email("Please enter a valid email address"),
  skills_to_assess: z.string().min(1, "Skills to assess is required"),
  country_code: z.string().min(1, "Country code is required"),
  mobile_number: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\d+$/, "Phone number must contain only numbers"),
  job_description: z.string().min(1, "Job description is required"),
  assessment_creation_preference: z.enum(
    ["Recruiter Create", "Collaborate"],
    {
      error: () => ({
        message: "Please select an assessment creation preference",
      }),
    }
  ),
  custom_instructions: z.string().min(1, "Custom instructions are required"),
});

export type RequestAssessmentFormData = z.infer<typeof requestAssessmentSchema>;
