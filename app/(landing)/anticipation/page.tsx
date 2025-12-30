import { Metadata } from "next";
import HeroSection from "@/components/anticipation/hero-section";
import WhoIsItForSection from "@/components/anticipation/who-is-it-for-section";
import WhySection from "@/components/anticipation/why-section";
import CredibilityStrip from "@/components/anticipation/credibility-strip";
import WaitlistForm from "@/components/anticipation/waitlist-form";

export const metadata: Metadata = {
  title: "TechSmartHire - Hire by Real Skills, Not Resumes",
  description:
    "Join the early access list for TechSmartHire - a new hiring platform that connects candidates and recruiters based on real skills, not keyword-stuffed resumes.",
};

export default function AnticipationPage() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <WhoIsItForSection />
      <WhySection />
      <CredibilityStrip />
      <WaitlistForm />
    </div>
  );
}
