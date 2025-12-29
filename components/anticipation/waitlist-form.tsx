"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, User, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const WaitlistForm = () => {
  const [role, setRole] = useState<"candidate" | "recruiter" | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!role || !name || !email) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);

    toast.success("You're on the list! 🎉", {
      description: "We'll notify you when we launch.",
    });
  };

  if (isSubmitted) {
    return (
      <section
        id="waitlist"
        className="py-24 md:py-32 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-linear-to-b from-background via-muted/20 to-background" />

        <div className="container mx-auto relative z-10 px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-lg mx-auto text-center"
          >
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-4">You're on the list!</h2>
            <p className="text-muted-foreground text-lg">
              Thank you for joining. We'll notify you with early access as soon
              as we launch.
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="waitlist" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-b from-background via-muted/20 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto relative z-10 px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Get <span className="gradient-text">Early Access</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Be among the first to experience skill-based hiring.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-lg mx-auto"
        >
          <form
            onSubmit={handleSubmit}
            className="p-8 rounded-3xl bg-card border border-border/50 shadow-card space-y-6"
          >
            {/* Role Selection */}
            <div className="space-y-3">
              <Label className="text-base font-medium">I am a... *</Label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole("candidate")}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
                    role === "candidate"
                      ? "border-primary bg-primary/5 shadow-glow"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <User
                    className={`w-6 h-6 ${
                      role === "candidate"
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                  <span
                    className={`font-medium ${
                      role === "candidate" ? "text-primary" : "text-foreground"
                    }`}
                  >
                    Candidate
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("recruiter")}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
                    role === "recruiter"
                      ? "border-primary bg-primary/5 shadow-glow"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <Briefcase
                    className={`w-6 h-6 ${
                      role === "recruiter"
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                  <span
                    className={`font-medium ${
                      role === "recruiter" ? "text-primary" : "text-foreground"
                    }`}
                  >
                    Recruiter
                  </span>
                </button>
              </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base font-medium">
                Name *
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 rounded-xl"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base font-medium">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-xl"
                required
              />
            </div>

            {/* Company (only for recruiters) */}
            {role === "recruiter" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-2"
              >
                <Label htmlFor="company" className="text-base font-medium">
                  Company Name
                </Label>
                <Input
                  id="company"
                  type="text"
                  placeholder="Your company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="h-12 rounded-xl"
                />
              </motion.div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              className="w-full h-14 text-lg rounded-xl shadow-glow hover:shadow-glow-lg transition-all duration-300"
              disabled={isSubmitting || !role}
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

            <p className="text-center text-sm text-muted-foreground">
              Early users will get priority access and feature previews.
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default WaitlistForm;
