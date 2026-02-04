"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Loader2,
  CheckCircle2,
  Building2,
  User,
  Mail,
  Phone,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getContact, getImports } from "@/api/waitlist";
import ReCAPTCHA from "react-google-recaptcha";

// List of disallowed free email providers
const FREE_EMAIL_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "aol.com",
  "icloud.com",
  "mail.com",
  "protonmail.com",
  "yandex.com",
  "live.com",
  "msn.com",
  "me.com",
  "mac.com",
];

// Zod schema for recruiter form
const recruiterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .refine((email) => {
      const domain = email.toLowerCase().split("@")[1];
      return !FREE_EMAIL_DOMAINS.includes(domain);
    }, "Please use your company email address (no gmail, yahoo, etc.)"),
  company: z.string().min(2, "Company name must be at least 2 characters"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[0-9]+$/, "Phone number should contain only digits"),
});

type RecruiterFormValues = z.infer<typeof recruiterSchema>;

interface RecruiterFormProps {}

const RecruiterForm: React.FC<RecruiterFormProps> = () => {
  const [submitted, setSubmitted] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [recaptchaError, setRecaptchaError] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RecruiterFormValues>({
    resolver: zodResolver(recruiterSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      phone: "",
    },
  });

  const onSubmit = async (values: RecruiterFormValues) => {
    setRecaptchaError(null);

    if (!recaptchaToken) {
      setRecaptchaError("Please complete the reCAPTCHA challenge.");
      return;
    }

    try {
      try {
        const response = await getContact(values.email);
        const listIds = response.listIds || [];
        if (listIds.includes(24)) {
          toast.info("You're already subscribed with this email address!");
          reset({ name: "", email: "", company: "", phone: "" });
          resetRecaptcha();
          return;
        }
      } catch (error: any) {
        if (error.response?.status !== 404 && error.response?.status !== 400) {
          throw error;
        }
      }

      const importBody = {
        jsonBody: [
          {
            email: values.email,
            attributes: {
              SMS: values.phone.replace(/\D/g, ""), // Phone number without special characters
              FIRSTNAME: values.name,
              COMPANY_NAME: values.company,
            },
          },
        ],
        listIds: [24],
        recaptchaToken: recaptchaToken,
      };

      await getImports({ data: importBody });
      toast.success("You're on the list!");
      setSubmitted(true);
      reset({
        name: "",
        email: "",
        company: "",
        phone: "",
      });
    } catch (error: any) {
      console.error("Recruiter Registration Error:", error);
      toast.error(
        error.response?.data?.message || "Failed to submit your information.",
      );
    }
  };

  const resetRecaptcha = () => {
    recaptchaRef.current?.reset();
    setRecaptchaToken(null);
    setRecaptchaError(null);
  };

  if (submitted) {
    return (
      <div className="p-8 rounded-2xl bg-white border-2 border-emerald-300 shadow-xl text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-100 flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>

        <h3 className="text-2xl font-bold mb-4 text-slate-900">
          Thank You for Your Interest!
        </h3>

        <div className="space-y-4 text-left">
          <p className="text-slate-700">
            We've received your request to participate in the February QA Job
            Fair. One of our representatives will be in touch within 24 hours to
            discuss:
          </p>
          <ul className="space-y-2 text-slate-700 ml-4">
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 mt-1">•</span>
              Your hiring needs and open positions
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 mt-1">•</span>
              Candidate assessment criteria
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 mt-1">•</span>
              Job fair participation details
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 mt-1">•</span>
              Timeline and next steps
            </li>
          </ul>
          <div className="mt-6 p-4 rounded-xl bg-slate-50 border-2 border-slate-200">
            <p className="text-slate-700 font-medium">
              Need immediate assistance?
            </p>
            <p className="text-slate-600">
              Email us at{" "}
              <a
                href="mailto:info@techsmarthire.com"
                className="text-emerald-600 hover:underline font-medium"
              >
                info@techsmarthire.com
              </a>
            </p>
          </div>
        </div>

        <Button
          onClick={() => {
            setSubmitted(false);
            resetRecaptcha();
          }}
          variant="outline"
          className="mt-6 w-full cursor-pointer"
        >
          Register Another Email
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-4 md:p-8 rounded-2xl bg-white border-2 border-slate-200 shadow-lg space-y-6"
    >
      {/* NAME FIELD */}
      <div className="space-y-2">
        <Label
          htmlFor="recruiter-name"
          className="text-slate-700 font-semibold"
        >
          Your Name <span className="text-red-500 ms-1">*</span>
        </Label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            {...register("name")}
            id="recruiter-name"
            placeholder="Your full name"
            className={`h-12 pl-12 rounded-xl ${
              errors.name
                ? "border-red-400 focus-visible:ring-red-400"
                : "border-slate-300 focus-visible:ring-emerald-500"
            }`}
          />
        </div>
        {errors.name && (
          <p className="text-xs text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* EMAIL FIELD */}
      <div className="space-y-2">
        <Label
          htmlFor="recruiter-email"
          className="text-slate-700 font-semibold"
        >
          Work Email <span className="text-red-500 ms-1">*</span>
        </Label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            {...register("email")}
            id="recruiter-email"
            type="email"
            placeholder="your@company.com"
            className={`h-12 pl-12 rounded-xl ${
              errors.email
                ? "border-red-400 focus-visible:ring-red-400"
                : "border-slate-300 focus-visible:ring-emerald-500"
            }`}
          />
        </div>
        {errors.email && (
          <p className="text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* COMPANY FIELD */}
      <div className="space-y-2">
        <Label
          htmlFor="recruiter-company"
          className="text-slate-700 font-semibold"
        >
          Company Name <span className="text-red-500 ms-1">*</span>
        </Label>
        <div className="relative">
          <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            {...register("company")}
            id="recruiter-company"
            placeholder="Your company"
            className={`h-12 pl-12 rounded-xl ${
              errors.company
                ? "border-red-400 focus-visible:ring-red-400"
                : "border-slate-300 focus-visible:ring-emerald-500"
            }`}
          />
        </div>
        {errors.company && (
          <p className="text-xs text-red-500">{errors.company.message}</p>
        )}
      </div>

      {/* PHONE FIELD */}
      <div className="space-y-2">
        <Label
          htmlFor="recruiter-phone"
          className="text-slate-700 font-semibold"
        >
          Phone Number <span className="text-red-500 ms-1">*</span>
        </Label>
        <div className="relative">
          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            {...register("phone")}
            id="recruiter-phone"
            type="tel"
            placeholder="1234567890"
            className={`h-12 pl-12 rounded-xl ${
              errors.phone
                ? "border-red-400 focus-visible:ring-red-400"
                : "border-slate-300 focus-visible:ring-emerald-500"
            }`}
          />
        </div>
        {errors.phone && (
          <p className="text-xs text-red-500">{errors.phone.message}</p>
        )}
        <p className="text-xs text-slate-500">
          Enter digits only (e.g., 1234567890)
        </p>
      </div>

      {/* reCAPTCHA */}
      <div className="flex justify-start">
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
          onChange={(token: string | null) => {
            setRecaptchaToken(token);
            setRecaptchaError(null);
          }}
          onExpired={() => {
            setRecaptchaToken(null);
            setRecaptchaError(
              "reCAPTCHA expired. Please complete the challenge again.",
            );
          }}
          onErrored={() => {
            setRecaptchaToken(null);
            setRecaptchaError("reCAPTCHA error. Please try again.");
          }}
          theme="light"
          size="normal"
        />
      </div>
      {recaptchaError && (
        <p className="text-xs text-red-500 text-center">{recaptchaError}</p>
      )}

      <Button
        type="submit"
        size="lg"
        className="w-full cursor-pointer h-14 text-lg rounded-xl bg-linear-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 transition-all"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 w-5 h-5 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <span>Submit Information</span>
            <ArrowRight className="ml-2 w-5 h-5" />
          </>
        )}
      </Button>
    </form>
  );
};

export default RecruiterForm;
