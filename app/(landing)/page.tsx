import { Metadata } from "next";
import AnticipationPage from "./anticipation-page";

export const metadata: Metadata = {
  title:
    "techSmartHire – Skill-Based QA Hiring Platform | Hire by Skills, Not Resumes",
  description:
    "techSmartHire is a skill-first hiring platform for QA roles. Take role-based assessments, showcase your real skills, and connect with recruiters looking for verified talent.",
  openGraph: {
    title:
      "techSmartHire – Skill-Based QA Hiring Platform | Hire by Skills, Not Resumes",
    description:
      "techSmartHire is a skill-first hiring platform for QA roles. Take role-based assessments, showcase your real skills, and connect with recruiters looking for verified talent.",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "techSmartHire",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "techSmartHire Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "techSmartHire – Skill-Based QA Hiring Platform | Hire by Skills, Not Resumes",
    description:
      "techSmartHire is a skill-first hiring platform for QA roles. Take role-based assessments, showcase your real skills, and connect with recruiters looking for verified talent.",
    images: ["/og-image.png"],
  },
};

export default function Page() {
  return <AnticipationPage />;
}
