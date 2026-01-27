import { Metadata } from "next";
import AnticipationPageClient from "@/components/anticipation/anticipation-page-client";

export const metadata: Metadata = {
  title: "TechSmartHire - Hire by Real Skills, Not Resumes",
  description:
    "Join the early access list for TechSmartHire - a new hiring platform that connects candidates and recruiters based on real skills, not keyword-stuffed resumes.",
};

export default function AnticipationPage() {
  return <AnticipationPageClient />;
}
