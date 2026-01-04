"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2, User, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getContact, getImports } from "@/api/waitlist";
import { waitlistSchema, WaitlistValues } from "@/validation/waitlist";

interface WaitlistFormProps {
  initialRole?: "candidate" | "recruiter" | null;
}

const WaitlistForm: React.FC<WaitlistFormProps> = ({ initialRole = null }) => {
  const [submitted, setSubmitted] = useState(false);
  const [submittedRole, setSubmittedRole] = useState<"candidate" | "recruiter">(
    "candidate"
  );

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
    try {
      try {
        const response = await getContact(values.email);
        toast.info(
          response.message ||
            "You're already subscribed with this email address!"
        );
        reset({ name: "", email: "", company: "", role: currentRole });
        return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (error.response?.status !== 404 && error.response?.status !== 400) {
          throw error;
        }
      }

      const listId = values.role === "candidate" ? 23 : 24;
      const importBody = {
        jsonBody: [
          {
            email: values.email,
            attributes: {
              FIRSTNAME: values.name,
              COMPANY_NAME: listId === 23 ? "" : values.company,
            },
          },
        ],
        listIds: [listId],
      };

      // 3. Import contact
      await getImports({ data: importBody });
      toast.success("You're on the list!");
      setSubmitted(true);
      reset({
        name: "",
        email: "",
        company: "",
        role: currentRole,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Waitlist Error:", error);
      toast.error(
        error.response?.data?.message || "Failed to join the waitlist."
      );
    }
  };

  const recruiterHeader =
    "Join the waitlist for updates or request Pilot Access to start hiring.";
  const candidateHeader =
    "Sign up now to get exclusive early-bird access to our upcoming Pilot Job Fair and Beta features of the platform for FREE.";

  const recruiterSuccessTitle = "You're on the list!";
  const candidateSuccessTitle = "Welcome to the TechSmartHire Insider List!";

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
                  ? recruiterSuccessTitle
                  : candidateSuccessTitle}
              </h3>

              {submittedRole === "recruiter" ? (
                <div className="space-y-4 text-left">
                  <p className="text-subtle">
                    We'll keep you posted on our Beta progress. Need to hire QA
                    talent this month? Send a brief note to{" "}
                    <a
                      href="mailto:info@techsmarthire.com?subject=Pilot Program"
                      className="text-primary hover:underline font-medium"
                    >
                      info@techsmarthire.com
                    </a>{" "}
                    with the subject line 'Pilot Program' and our team will get
                    back to you within 24 hours to discuss your hiring needs.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 text-left">
                  <p className="text-subtle">
                    You’re now in line for early access. While we prepare the
                    platform, here is the list of the top 4 skills our
                    recruiters are looking for in the{" "}
                    <b>upcoming Pilot Job fair program</b>.
                  </p>
                  <div className="bg-muted/50 rounded-xl p-4 space-y-2">
                    <p className="font-semibold text-sm text-subtle uppercase tracking-wide">
                      Top Skills in Demand
                    </p>
                    <ul className="space-y-1">
                      {[
                        "Selenium Java",
                        "Playwright Javascript",
                        "Playwright Java",
                        "API Testing",
                      ].map((skill, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-foreground font-medium"
                        >
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <Button
                onClick={() => setSubmitted(false)}
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
                  className="space-y-2 overflow-hidden"
                >
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
                </motion.div>
              )}
            </AnimatePresence>

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
