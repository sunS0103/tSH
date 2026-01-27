"use client";

import { useState, useRef } from "react";
import HeroSection from "@/components/anticipation/hero-section";
import WhoIsItForSection from "@/components/anticipation/who-is-it-for-section";
import LaunchFocus from "@/components/anticipation/launch-focus";
import WhySection from "@/components/anticipation/why-section";
import CredibilityStrip from "@/components/anticipation/credibility-strip";
import WaitlistForm from "@/components/anticipation/waitlist-form";

export default function AnticipationPage() {
  const [selectedRole, setSelectedRole] = useState<
    "candidate" | "recruiter" | null
  >(null);
  const waitlistRef = useRef<HTMLDivElement>(null);

  const handleRoleSelect = (role: "candidate" | "recruiter") => {
    setSelectedRole(role);
    // Scroll to waitlist form
    setTimeout(() => {
      waitlistRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <WhoIsItForSection onRoleSelect={handleRoleSelect} />
      <LaunchFocus />
      <WhySection />
      <CredibilityStrip />
      <div ref={waitlistRef}>
        <WaitlistForm initialRole={selectedRole} />
      </div>
    </div>
  );
}
