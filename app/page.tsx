import { Metadata } from "next";
import AnticipationPage from "./(landing)/anticipation-page";

export const metadata: Metadata = {
  title: "techSmartHire – Skill-Based QA Hiring Platform",
  description:
    "techSmartHire is a skill-first hiring platform for QA roles. Get early access to role-based assessments, pre-vetted candidates, and faster hiring through our beta program",
};

export default function Page() {
  return <AnticipationPage />;
}
