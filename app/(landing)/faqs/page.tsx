import FAQsClient from "./FAQsClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "FAQs - TechSmartHire",
  description:
    "Frequently asked questions for candidates and recruiters on TechSmartHire platform",
};

export default function FAQsPage() {
  return <FAQsClient />;
}
