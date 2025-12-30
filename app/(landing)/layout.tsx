import { Metadata } from "next";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "TechSmartHire - Skill-First Hiring Platform",
  description:
    "TechSmartHire connects candidates and recruiters based on real skills, avoiding resume spam and blind screening.",
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
