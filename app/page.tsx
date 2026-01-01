import { Metadata } from "next";
import HeroSection from "@/components/anticipation/hero-section";
import WhoIsItForSection from "@/components/anticipation/who-is-it-for-section";
import LaunchFocus from "@/components/anticipation/launch-focus";
import WhySection from "@/components/anticipation/why-section";
import CredibilityStrip from "@/components/anticipation/credibility-strip";
import WaitlistForm from "@/components/anticipation/waitlist-form";

export const metadata: Metadata = {
  title:
    "TechSmartHire – Skill-Based QA Hiring Platform | Early Access & Beta Program",
  description:
    "TechSmartHire is a skill-first hiring platform for QA roles. Get early access to role-based assessments, pre-vetted candidates, and faster hiring through our beta program",
  openGraph: {
    title:
      "TechSmartHire – Skill-Based QA Hiring Platform | Early Access & Beta Program",
    description:
      "TechSmartHire is a skill-first hiring platform for QA roles. Get early access to role-based assessments, pre-vetted candidates, and faster hiring through our beta program",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "TechSmartHire",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TechSmartHire Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "TechSmartHire – Skill-Based QA Hiring Platform | Early Access & Beta Program",
    description:
      "TechSmartHire is a skill-first hiring platform for QA roles. Get early access to role-based assessments, pre-vetted candidates, and faster hiring through our beta program",
    images: ["/og-image.png"],
  },
};

export default function AnticipationPage() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <WhoIsItForSection />
      <LaunchFocus />
      <WhySection />
      <CredibilityStrip />
      <WaitlistForm />
    </div>
  );
}
