"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  CheckCircle2,
  User,
  Briefcase,
  Mail,
  Phone,
  MessageSquare,
  Building2,
  Send,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CountryCodeDropdown } from "@/components/ui/country-code-dropdown";
import ReCAPTCHA from "react-google-recaptcha";
import { useRouter } from "next/navigation";
import { submitContactForm } from "@/api/contact";
import { toast } from "sonner";

const contactSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    countryCode: z.string().min(1, "Please select a country code"),
    phone: z
      .string()
      .min(7, "Phone number must be at least 7 digits")
      .regex(/^[0-9]+$/, "Phone number must contain only digits"),
    userType: z.enum(["candidate", "recruiter"], {
      message: "Please select whether you are a candidate or recruiter",
    }),
    company: z.string().optional(),
    message: z.string().min(10, "Message must be at least 10 characters"),
  })
  .superRefine((data, ctx) => {
    if (
      data.userType === "recruiter" &&
      (!data.company || data.company.trim().length < 2)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Company name is required for recruiters",
        path: ["company"],
      });
    }
  });

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactClient() {
  const router = useRouter();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [recaptchaError, setRecaptchaError] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      countryCode: "+91",
      phone: "",
      userType: undefined,
      company: "",
      message: "",
    },
  });

  const userType = watch("userType");

  const onSubmit = async (values: ContactFormValues) => {
    setRecaptchaError(null);

    if (!recaptchaToken) {
      setRecaptchaError("Please complete the reCAPTCHA challenge.");
      return;
    }

    try {
      await submitContactForm({
        name: values.name,
        email: values.email,
        phone: values.phone,
        country_code: values.countryCode,
        user_type: values.userType,
        company: values.company,
        message: values.message,
        recaptcha_token: recaptchaToken,
      });

      // Show success dialog
      setShowSuccessDialog(true);

      // Reset form
      reset();
      resetRecaptcha();
    } catch (error: unknown) {
      console.error("Contact form error:", error);
      resetRecaptcha();
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to submit your enquiry. Please try again.";
      toast.error(errorMessage);
    }
  };

  const resetRecaptcha = () => {
    recaptchaRef.current?.reset();
    setRecaptchaToken(null);
    setRecaptchaError(null);
  };

  const handleCancel = () => {
    reset();
    resetRecaptcha();
    router.push("/");
  };

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-purple-600 via-violet-600 to-purple-700 text-white py-16 mt-16 md:mt-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-size-[64px_64px]"></div>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Contact Us
            </h1>

            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              Have questions or need assistance? We&apos;re here to help you
              with your hiring journey.
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16">
        <div className="max-w-2xl mx-auto px-6">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6"
          >
            {/* User Type Selection */}
            <div className="space-y-3">
              <Label className="text-base font-medium">
                I am a... <span className="text-destructive">*</span>
              </Label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() =>
                    setValue("userType", "candidate", { shouldValidate: true })
                  }
                  className={`p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
                    userType === "candidate"
                      ? "border-primary bg-primary/5"
                      : "border-slate-200 hover:border-primary/50"
                  }`}
                >
                  <User
                    className={`w-6 h-6 ${
                      userType === "candidate"
                        ? "text-primary"
                        : "text-slate-500"
                    }`}
                  />
                  <span
                    className={`font-medium ${
                      userType === "candidate"
                        ? "text-primary"
                        : "text-slate-700"
                    }`}
                  >
                    Candidate
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setValue("userType", "recruiter", { shouldValidate: true })
                  }
                  className={`p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
                    userType === "recruiter"
                      ? "border-primary bg-primary/5"
                      : "border-slate-200 hover:border-primary/50"
                  }`}
                >
                  <Briefcase
                    className={`w-6 h-6 ${
                      userType === "recruiter"
                        ? "text-primary"
                        : "text-slate-500"
                    }`}
                  />
                  <span
                    className={`font-medium ${
                      userType === "recruiter"
                        ? "text-primary"
                        : "text-slate-700"
                    }`}
                  >
                    Recruiter
                  </span>
                </button>
              </div>
              {errors.userType && (
                <p className="text-xs text-destructive">
                  {errors.userType.message}
                </p>
              )}
            </div>

            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Full Name <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  {...register("name")}
                  id="name"
                  placeholder="Enter your full name"
                  className={`h-12 pl-10 rounded-xl ${
                    errors.name
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }`}
                />
              </div>
              {errors.name && (
                <p className="text-xs text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">
                Email Address <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  {...register("email")}
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  className={`h-12 pl-10 rounded-xl ${
                    errors.email
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone Number Field with Country Code */}
            <div className="space-y-2">
              <Label htmlFor="phone">
                Phone Number <span className="text-destructive">*</span>
              </Label>
              <div className="flex gap-2">
                <div className="flex items-center border border-slate-300 rounded-xl h-12 px-1">
                  <CountryCodeDropdown
                    value={watch("countryCode")}
                    onValueChange={(dialCode) =>
                      setValue("countryCode", dialCode, {
                        shouldValidate: true,
                      })
                    }
                    className="h-10 border-0"
                  />
                  <span className="text-sm text-slate-600 pr-2">
                    {watch("countryCode")}
                  </span>
                </div>
                <div className="relative flex-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    {...register("phone")}
                    id="phone"
                    type="tel"
                    placeholder="1234567890"
                    className={`h-12 pl-10 rounded-xl ${
                      errors.phone
                        ? "border-destructive focus-visible:ring-destructive"
                        : ""
                    }`}
                  />
                </div>
              </div>
              {errors.phone && (
                <p className="text-xs text-destructive">
                  {errors.phone.message}
                </p>
              )}
              {errors.countryCode && (
                <p className="text-xs text-destructive">
                  {errors.countryCode.message}
                </p>
              )}
            </div>

            {/* Conditional Fields Based on User Type */}
            <AnimatePresence mode="wait">
              {userType === "recruiter" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 overflow-hidden"
                >
                  <Label htmlFor="company">
                    Company Name <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      {...register("company")}
                      id="company"
                      placeholder="Enter your company name"
                      className={`h-12 pl-10 rounded-xl ${
                        errors.company
                          ? "border-destructive focus-visible:ring-destructive"
                          : ""
                      }`}
                    />
                  </div>
                  {errors.company && (
                    <p className="text-xs text-destructive">
                      {errors.company.message}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Message Field - Always visible when user type is selected */}
            <AnimatePresence mode="wait">
              {userType && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 overflow-hidden"
                >
                  <Label htmlFor="message">
                    Message <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <Textarea
                      {...register("message")}
                      id="message"
                      placeholder={
                        userType === "candidate"
                          ? "Tell us about your query or how we can help you..."
                          : "Tell us about your hiring needs or how we can assist you..."
                      }
                      className={`min-h-32 pl-10 rounded-xl resize-none ${
                        errors.message
                          ? "border-destructive focus-visible:ring-destructive"
                          : ""
                      }`}
                    />
                  </div>
                  {errors.message && (
                    <p className="text-xs text-destructive">
                      {errors.message.message}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* reCAPTCHA */}
            <div className="flex justify-center">
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
                    "reCAPTCHA expired. Please complete the challenge again."
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
              <p className="text-xs text-destructive text-center">
                {recaptchaError}
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="flex-1 h-14 text-lg rounded-xl"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                <X className="mr-2 w-5 h-5" />
                Cancel
              </Button>
              <Button
                type="submit"
                size="lg"
                className="flex-1 h-14 text-lg rounded-xl bg-linear-to-r from-purple-600 via-violet-600 to-purple-700 hover:from-purple-700 hover:via-violet-700 hover:to-purple-800"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 w-5 h-5" />
                    Submit
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center"
            >
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </motion.div>
            <DialogTitle className="text-2xl font-bold text-center">
              Thank You!
            </DialogTitle>
            <DialogDescription className="text-center text-base mt-2">
              Your enquiry has been received. We will get back to you within 24
              hours.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6">
            <Button
              onClick={handleSuccessDialogClose}
              className="w-full h-12 text-lg rounded-xl bg-linear-to-r from-purple-600 via-violet-600 to-purple-700 hover:from-purple-700 hover:via-violet-700 hover:to-purple-800"
            >
              Back to Home
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
