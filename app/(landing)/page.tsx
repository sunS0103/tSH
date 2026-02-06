import { Metadata } from "next";
import AnticipationPage from "./anticipation-page";

export const metadata: Metadata = {
  title:
    "techSmartHire – Skill-Based QA Hiring Platform | Early Access & Beta Program",
  description:
    "techSmartHire is a skill-first hiring platform for QA roles. Get early access to role-based assessments, pre-vetted candidates, and faster hiring through our beta program",
  openGraph: {
    title:
      "techSmartHire – Skill-Based QA Hiring Platform | Early Access & Beta Program",
    description:
      "techSmartHire is a skill-first hiring platform for QA roles. Get early access to role-based assessments, pre-vetted candidates, and faster hiring through our beta program",
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
      "techSmartHire – Skill-Based QA Hiring Platform | Early Access & Beta Program",
    description:
      "techSmartHire is a skill-first hiring platform for QA roles. Get early access to role-based assessments, pre-vetted candidates, and faster hiring through our beta program",
    images: ["/og-image.png"],
  },
};

export default function Page() {
  return <AnticipationPage />;
}
