import { Metadata } from "next";
import AssessmentsClient from "./AssessmentsClient";
import config from "../qa-job-fair/config.json";

export const metadata: Metadata = {
  title: "Assessments - TechSmartHire",
  description:
    "Skill-based QA assessments. Take role-based exams and get shortlisted by top engineering teams.",
  openGraph: {
    title: "Assessments - SmartTechHire",
    description:
      "Skill-based QA assessments. Take role-based exams and get shortlisted by top engineering teams.",
    url: `${process.env.NEXT_PUBLIC_APP_URL || ""}/assessments`,
    siteName: "SmartTechHire",
    locale: "en_US",
    type: "website",
  },
};

export default function AssessmentsPage() {
  return <AssessmentsClient jobs={config.jobs} />;
}
