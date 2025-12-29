import { z } from "zod";

export const waitlistSchema = z
  .object({
    role: z.enum(["candidate", "recruiter"], {
      required_error: "Please select your role",
    }),
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    company: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Conditional validation: If role is recruiter, company name becomes mandatory
    if (
      data.role === "recruiter" &&
      (!data.company || data.company.trim().length < 2)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Company name is required for recruiters",
        path: ["company"], // Points the error specifically to the company input
      });
    }
  });

// Export the type to be used in useForm<WaitlistValues>
export type WaitlistValues = z.infer<typeof waitlistSchema>;