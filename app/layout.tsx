import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Toaster } from "sonner";
import Script from "next/script";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title:
    "TechSmartHire – Skill-Based QA Hiring Platform | Early Access & Beta Program",
  description:
    "TechSmartHire is a skill-first hiring platform for QA roles. Get early access to role-based assessments, pre-vetted candidates, and faster hiring through our beta program",
  metadataBase: new URL("https://techsmarthire.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {true && (
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WFZ9226R');`}
        </Script>
      )}
      <body className={`${plusJakartaSans.variable} antialiased`}>
        {true && (
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-WFZ9226R"
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            ></iframe>
          </noscript>
        )}
        <Header />
        <main>{children}</main>
        <Footer />
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}
