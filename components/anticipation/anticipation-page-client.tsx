"use client";

import { useState } from "react";
import HeroSection from "@/components/anticipation/hero-section";
import WhoIsItForSection from "@/components/anticipation/who-is-it-for-section";
import LaunchFocus from "@/components/anticipation/launch-focus";
import WhySection from "@/components/anticipation/why-section";
import CredibilityStrip from "@/components/anticipation/credibility-strip";
import WaitlistForm from "@/components/anticipation/waitlist-form";

export default function AnticipationPageClient() {
  const [formRole, setFormRole] = useState<"candidate" | "recruiter" | null>(
    null,
  );

  const handleRoleSelect = (role: "candidate" | "recruiter") => {
    setFormRole(role);
    const element = document.getElementById("waitlist");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <WhoIsItForSection onRoleSelect={handleRoleSelect} />
      <LaunchFocus />
      <WhySection />
      <CredibilityStrip />
      <WaitlistForm initialRole={formRole} />
    </div>
  );
}
