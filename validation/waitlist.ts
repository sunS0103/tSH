import { z } from "zod";

export const waitlistSchema = z
  .object({
    role: z.enum(["candidate", "recruiter"], {
      message: "Please select your role",
    }),
    name: z.string().min(2, "Enter at least 2 characters"),
    email: z.string().email("Enter a valid email"),
    company: z.string().optional(),
    phone: z.string().optional(),
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
    // 2. If role is recruiter, phone number becomes mandatory
    if (
      data.role === "recruiter" &&
      (!data.phone || data.phone.trim().length < 10)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Phone number is required for recruiters (min 10 digits)",
        path: ["phone"],
      });
    }
    // 3. Validate phone number format (only digits)
    if (data.role === "recruiter" && data.phone) {
      const digitsOnly = data.phone.replace(/\D/g, "");
      if (digitsOnly.length < 10) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Phone number must be at least 10 digits",
          path: ["phone"],
        });
      }
    }
    // 4. Company email validation
    // 4. Company email validation
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