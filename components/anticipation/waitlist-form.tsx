"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  CheckCircle2,
  User,
  Briefcase,
  ArrowRight,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getContact, getImports } from "@/api/waitlist";
import { waitlistSchema, WaitlistValues } from "@/validation/waitlist";
import ReCAPTCHA from "react-google-recaptcha";
import Link from "next/link";

interface WaitlistFormProps {
  initialRole?: "candidate" | "recruiter" | null;
}

const WaitlistForm: React.FC<WaitlistFormProps> = ({ initialRole = null }) => {
  const [submitted, setSubmitted] = useState(false);
  const [submittedRole, setSubmittedRole] = useState<"candidate" | "recruiter">(
    "candidate",
  );
  const [isAlreadySubscribed, setIsAlreadySubscribed] = useState(false);
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
  } = useForm<WaitlistValues>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      phone: "",
      role: initialRole || "candidate",
    },
  });

  const currentRole = watch("role");

  // Update role when initialRole changes
  useEffect(() => {
    if (initialRole) {
      setValue("role", initialRole, { shouldValidate: true });
    }
  }, [initialRole, setValue]);

  const onSubmit = async (values: WaitlistValues) => {
    setSubmittedRole(values.role);
    setRecaptchaError(null);

    // Check if reCAPTCHA token exists
    if (!recaptchaToken) {
      setRecaptchaError("Please complete the reCAPTCHA challenge.");
      return;
    }

    try {
      try {
        const response = await getContact(values.email);
        const listIds = response.listIds || [];
        if (
          (currentRole === "candidate" && listIds.includes(23)) ||
          (currentRole === "recruiter" && listIds.includes(24))
        ) {
          toast.info(
            response.message ||
              "You're already subscribed with this email address!",
          );
          setSubmitted(true);
          setSubmittedRole(currentRole);
          setIsAlreadySubscribed(true);
          reset({
            name: "",
            email: "",
            company: "",
            phone: "",
            role: currentRole,
          });
          resetRecaptcha();
          return;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (error.response?.status !== 404 && error.response?.status !== 400) {
          throw error;
        }
      }

      const listId = values.role === "candidate" ? 23 : 24;
      const attributes: any = {
        FIRSTNAME: values.name,
        COMPANY_NAME: listId === 23 ? "" : values.company,
      };

      // Add phone number for recruiters only
      if (listId === 24 && values.phone) {
        attributes.SMS = values.phone.replace(/\D/g, ""); // Phone number without special characters
      }

      const importBody = {
        jsonBody: [
          {
            email: values.email,
            attributes: attributes,
          },
        ],
        listIds: [listId],
        recaptchaToken: recaptchaToken,
      };

      // 3. Import contact
      await getImports({ data: importBody });
      toast.success("You're on the list!");
      setSubmitted(true);
      reset({
        name: "",
        email: "",
        company: "",
        phone: "",
        role: currentRole,
      });
      setIsAlreadySubscribed(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Waitlist Error:", error);
      toast.error(
        error.response?.data?.message || "Failed to join the waitlist.",
      );
    }
  };

  const resetRecaptcha = () => {
    recaptchaRef.current?.reset();
    setRecaptchaToken(null);
    setRecaptchaError(null);
  };

  const recruiterHeader =
    "Join the waitlist for updates or request Pilot Access to start hiring.";
  const candidateHeader =
    "Sign up now to get exclusive early-bird access to our upcoming Pilot Job Fair and Beta features of the platform for FREE.";

  const recruiterSuccessTitle = "You're on the list!";
  const recruiterSuccessTitleAlreadySubscribed = "You're already on the list!";
  const candidateSuccessTitle = "Welcome to the techSmartHire Insider List!";
  const candidateSuccessTitleAlreadySubscribed = "You're already on the list!";

  if (submitted) {
    return (
      <section
        id="waitlist"
        className="py-24 md:py-32 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-linear-to-b from-background via-muted/20 to-background" />
        <div className="container mx-auto relative z-10 px-4 md:px-6">
          <div className="max-w-lg mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 rounded-3xl bg-card border border-border/50 shadow-xl text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center"
              >
                <CheckCircle2 className="w-10 h-10 text-primary" />
              </motion.div>

              <h3 className="text-2xl font-bold mb-4">
                {submittedRole === "recruiter"
                  ? isAlreadySubscribed
                    ? recruiterSuccessTitleAlreadySubscribed
                    : recruiterSuccessTitle
                  : isAlreadySubscribed
                    ? candidateSuccessTitleAlreadySubscribed
                    : candidateSuccessTitle}
              </h3>

              {submittedRole === "recruiter" ? (
                <div className="space-y-6 text-left">
                  <p className="text-subtle text-center">
                    We'll keep you posted on our Beta progress.
                  </p>

                  {/* Divider */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-xs font-semibold text-subtle">
                      Need QA Talent Now?
                    </span>
                    <div className="flex-1 h-px bg-border" />
                  </div>

                  {/* February Job Fair CTA */}
                  <div className="p-5 rounded-xl bg-linear-to-br from-primary/5 to-primary/10 border-2 border-primary/20">
                    <h4 className="text-base font-bold text-foreground mb-2">
                      Join February QA Job Fair 🎯
                    </h4>
                    <p className="text-sm text-subtle mb-3">
                      Access <strong>pre-vetted QA candidates</strong> with
                      verified skills through our AI-proctored assessments.
                    </p>
                    <p className="text-xs text-subtle mb-4">
                      Skill-first hiring • No resume screening • Feb 5-27
                    </p>
                    <Link
                      href="/qa-job-fair-feb"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all w-full justify-center"
                    >
                      <span>Explore Job Fair for Recruiters</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                  {/* Contact Option */}
                  <div className="p-4 rounded-lg bg-muted/50 text-center">
                    <p className="text-xs text-subtle">
                      Need immediate hiring support?{" "}
                      <a
                        href="mailto:info@techsmarthire.com?subject=Pilot Program"
                        className="text-primary hover:underline font-medium"
                      >
                        Contact us
                      </a>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 text-left">
                  <p className="text-subtle text-center">
                    You're in line for early platform access. We'll notify you
                    when we launch!
                  </p>

                  {/* Divider */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-xs font-semibold text-subtle">
                      Don't Wait
                    </span>
                    <div className="flex-1 h-px bg-border" />
                  </div>

                  {/* CTA Box */}
                  <div className="p-5 rounded-xl bg-linear-to-br from-primary/5 to-primary/10 border-2 border-primary/20">
                    <h4 className="text-base font-bold text-foreground mb-2">
                      Get Hired in February! 🚀
                    </h4>
                    <p className="text-sm text-subtle mb-3">
                      Join our <strong>QA Job Fair</strong> — get shortlisted by
                      top companies based on skills, not resumes.
                    </p>
                    <p className="text-xs text-subtle mb-4">
                      22 Positions • 7 Companies • Feb 5-27
                    </p>
                    <Link
                      href="/qa-job-fair-feb"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all w-full justify-center"
                    >
                      <span>View Job Fair Details</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )}

              <Button
                onClick={() => {
                  setSubmitted(false);
                  setIsAlreadySubscribed(false);
                  resetRecaptcha();
                }}
                variant="outline"
                className="mt-6 w-full"
              >
                Register Another Email
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="waitlist" className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-background via-muted/20 to-background" />
      <div className="container mx-auto relative z-10 px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 mx-auto max-w-3xl">
            {currentRole === "recruiter" ? (
              <>
                {recruiterHeader.split(" ").slice(0, 3).join(" ")}{" "}
                <span className="text-primary">
                  {recruiterHeader.split(" ").slice(3).join(" ")}
                </span>
              </>
            ) : (
              <>
                {candidateHeader.split(" ").slice(0, 4).join(" ")}{" "}
                <span className="text-primary">
                  {candidateHeader.split(" ").slice(4).join(" ")}
                </span>
              </>
            )}
          </h2>
        </div>

        <div className="max-w-lg mx-auto">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-8 rounded-3xl bg-card border border-border/50 shadow-xl space-y-6"
          >
            {/* ROLE SELECTION */}
            <div className="space-y-3">
              <Label className="text-base font-medium overflow-hidden">
                I am a... *
              </Label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() =>
                    setValue("role", "candidate", { shouldValidate: true })
                  }
                  className={`p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
                    currentRole === "candidate"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <User
                    className={`w-6 h-6 ${
                      currentRole === "candidate"
                        ? "text-primary"
                        : "text-subtle"
                    }`}
                  />
                  <span
                    className={`font-medium ${
                      currentRole === "candidate"
                        ? "text-primary"
                        : "text-foreground"
                    }`}
                  >
                    Candidate
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setValue("role", "recruiter", { shouldValidate: true })
                  }
                  className={`p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
                    currentRole === "recruiter"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <Briefcase
                    className={`w-6 h-6 ${
                      currentRole === "recruiter"
                        ? "text-primary"
                        : "text-subtle"
                    }`}
                  />
                  <span
                    className={`font-medium ${
                      currentRole === "recruiter"
                        ? "text-primary"
                        : "text-foreground"
                    }`}
                  >
                    Recruiter
                  </span>
                </button>
              </div>
              {errors.role && (
                <p className="text-xs text-destructive mt-1">
                  {errors.role.message}
                </p>
              )}
            </div>

            {/* NAME FIELD */}
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                {...register("name")}
                id="name"
                placeholder="Your full name"
                className={`h-12 rounded-xl ${
                  errors.name
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }`}
              />
              {errors.name && (
                <p className="text-xs text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* EMAIL FIELD */}
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                {...register("email")}
                id="email"
                type="email"
                placeholder="your@email.com"
                className={`h-12 rounded-xl ${
                  errors.email
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }`}
              />
              {errors.email && (
                <p className="text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <AnimatePresence mode="wait">
              {currentRole === "recruiter" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-6 overflow-hidden"
                >
                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name *</Label>
                    <Input
                      {...register("company")}
                      id="company"
                      placeholder="Your company"
                      className={`h-12 rounded-xl ${
                        errors.company
                          ? "border-destructive focus-visible:ring-destructive"
                          : ""
                      }`}
                    />
                    {errors.company && (
                      <p className="text-xs text-destructive">
                        {errors.company.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      {...register("phone")}
                      id="phone"
                      type="tel"
                      placeholder="1234567890"
                      className={`h-12 rounded-xl ${
                        errors.phone
                          ? "border-destructive focus-visible:ring-destructive"
                          : ""
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-xs text-destructive">
                        {errors.phone.message}
                      </p>
                    )}
                    <p className="text-xs text-subtle">
                      Enter digits only (e.g., 1234567890)
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* reCAPTCHA */}
            <div className="flex">
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
              <p className="text-xs text-destructive text-center">
                {recaptchaError}
              </p>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full h-14 text-lg rounded-xl transition-all"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                  Joining...
                </>
              ) : (
                "Join Waitlist"
              )}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default WaitlistForm;
