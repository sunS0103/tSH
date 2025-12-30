"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2, User, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { joinWaitlistAction } from "@/actions/waitlist";
import { waitlistSchema, WaitlistValues } from "@/validation/waitlist";

const WaitlistForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

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
      role: "candidate",
    },
  });

  const currentRole = watch("role");

  const onSubmit = async (values: WaitlistValues) => {
    try {
      const result = await joinWaitlistAction(values);

      if (result.success) {
        if (result.isExisting) {
          toast.info("You're already subscribed!");
        } else {
          toast.success("You're on the list!");
        }
        reset();
        setIsSubmitted(true);
      } else {
        toast.error(result.error || "Subscription Failed");
      }
    } catch (error) {
      toast.error("Network Error");
    }
  };

  return (
    <section id="waitlist" className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-background via-muted/20 to-background" />
      <div className="container mx-auto relative z-10 px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Get <span className="text-primary">Early Access</span>
          </h2>
          <p className="text-lg text-subtle max-w-xl mx-auto">
            Be among the first to experience skill-based hiring.
          </p>
        </div>

        <div className="max-w-lg mx-auto">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-8 rounded-3xl bg-card border border-border/50 shadow-xl space-y-6"
          >
            {/* ROLE SELECTION */}
            <div className="space-y-3">
              <Label className="text-base font-medium overflow-hidden">
                I am a... * {process.env.NEXT_PUBLIC_BREVO_API_KEY} - Hitali
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

            {/* CONDITIONAL COMPANY FIELD */}
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
                "Join the Waitlist"
              )}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default WaitlistForm;
