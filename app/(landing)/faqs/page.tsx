import { Suspense } from "react";
import FAQsClient from "./FAQsClient";

export const metadata = {
  title: "FAQs - TechSmartHire",
  description:
    "Frequently asked questions for candidates and recruiters on TechSmartHire platform",
};

export default function FAQsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <FAQsClient />
    </Suspense>
  );
}
