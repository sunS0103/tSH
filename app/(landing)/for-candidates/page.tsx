import type { Metadata } from "next";
import HeroSection from "@/components/candidates/hero-section";
import JobSearchPreview from "@/components/candidates/job-search-preview";
import AssessmentsSection from "@/components/candidates/assessments-section";
import VideoSection from "@/components/candidates/video-section";
import HowItWorksSection from "@/components/candidates/how-it-works-section";
import FinalCTASection from "@/components/candidates/final-cta-section";

export const metadata: Metadata = {
  title: "For Candidates | TechSmartHire - Get Hired for Your Skills",
  description:
    "Show what you actually know. Let recruiters find you based on real skill scores, not keywords. Join 10,000+ candidates getting hired for their skills.",
};

export default function CandidatesPage() {
  return (
    <main className="min-h-screen bg-primary/10 w-full">
      <HeroSection />
      <JobSearchPreview />
      <AssessmentsSection />
      <VideoSection />
      <HowItWorksSection />
      <FinalCTASection />
    </main>
  );
}
