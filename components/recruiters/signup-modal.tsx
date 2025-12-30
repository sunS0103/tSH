"use client";

import {
  X,
  Mail,
  Lock,
  User,
  Building2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SignupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type?: "recruiter" | "candidate";
}

const SignupModal = ({
  open,
  onOpenChange,
  type = "recruiter",
}: SignupModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden border-border/50 bg-card">
        <div className="relative">
          {/* Header gradient */}
          <div className="h-24 bg-linear-to-br from-primary via-primary/80 to-accent relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent)]" />
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-xl" />
          </div>

          {/* Content */}
          <div className="px-6 pb-6 -mt-8 relative">
            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl bg-card border border-border/50 shadow-lg flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>

            <DialogHeader className="text-left mb-6">
              <DialogTitle className="text-xl font-bold">
                {type === "recruiter"
                  ? "Create Recruiter Account"
                  : "Join TechSmartHire"}
              </DialogTitle>
              <p className="text-muted-foreground text-sm mt-1">
                {type === "recruiter"
                  ? "Unlock candidate profiles and start hiring smarter."
                  : "Get skill-verified and let recruiters find you."}
              </p>
            </DialogHeader>

            <form className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/80">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Enter your full name"
                    className="pl-10 h-11 bg-primary/10 border-border/50 focus:border-primary"
                  />
                </div>
              </div>

              {type === "recruiter" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80">
                    Company
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Enter company name"
                      className="pl-10 h-11 bg-primary/10 border-border/50 focus:border-primary"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/80">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="you@company.com"
                    className="pl-10 h-11 bg-primary/10 border-border/50 focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/80">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Create a strong password"
                    className="pl-10 h-11 bg-primary/10 border-border/50 focus:border-primary"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 mt-2"
                variant="default"
              >
                Create Account
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have an account?{" "}
              <button className="text-primary hover:underline font-medium">
                Sign in
              </button>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignupModal;
