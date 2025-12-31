import { z } from "zod";

export const waitlistSchema = z
  .object({
    role: z.enum(["candidate", "recruiter"], {
      message: "Please select your role",
    }),
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    company: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // 1. If role is recruiter, company name becomes mandatory
    if (
      data.role === "recruiter" &&
      (!data.company || data.company.trim().length < 2)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Company name is required for recruiters",
        path: ["company"],
      });
    }
    if (data.role === "recruiter" && data.email) {
      const publicDomains = [
        "gmail.com",
        "yahoo.com",
        "hotmail.com",
        "outlook.com",
        "icloud.com",
        "aol.com",
        "protonmail.com",
        "mail.com",
        "zoho.com",
        "yandex.com",
        "live.com",
      ];
      const emailDomain = data.email.split("@")[1]?.toLowerCase();

      if (emailDomain && publicDomains.includes(emailDomain)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Please use your work email address (e.g. name@company.com)",
          path: ["email"],
        });
      }
    }
  });

// Export the type to be used in useForm<WaitlistValues>
export type WaitlistValues = z.infer<typeof waitlistSchema>;