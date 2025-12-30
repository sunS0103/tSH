import HeroSection from "@/components/recruiters/hero-section";
import TalentPoolPreview from "@/components/recruiters/talent-pool-preview";
import VideoSection from "@/components/recruiters/video-section";
import WhyRecruitersLoveIt from "@/components/recruiters/why-recruiters-love-it";
import PricingTeaser from "@/components/recruiters/pricing-teaser";

export const metadata = {
  title: "Hire Skill-Verified Candidates | TechSmartHire for Recruiters",
  description:
    "Stop screening resumes blindly. Discover candidates ranked by real skills and assessment scores. Hire faster with TechSmartHire's pre-verified talent pool.",
};

export default function RecruitersPage() {
  return (
    <main className="min-h-screen bg-primary/10 w-full">
      <HeroSection />
      <TalentPoolPreview />
      <VideoSection />
      <WhyRecruitersLoveIt />
      <PricingTeaser />
    </main>
  );
}
