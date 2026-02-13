import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import WelcomePopup from "@/components/WelcomePopup";
import { Toaster } from "sonner";
import Script from "next/script";
import { RouteLoader } from "@/components/route-loader";
import NextAuthSessionProvider from "@/components/providers/session-provider";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "SmartTechHire – Skill-Based QA Hiring Platform",
    template: "%s | SmartTechHire",
  },
  description:
    "SmartTechHire is a skill-first hiring platform for QA roles. Get early access to role-based assessments, pre-vetted candidates, and faster hiring through our beta program",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ),
  keywords: [
    "QA Hiring",
    "Quality Assurance Jobs",
    "Skill-based Hiring",
    "Tech Recruitment",
    "QA Assessment",
    "Beta Access",
  ],
  authors: [{ name: "SmartTechHire Team" }],
  creator: "SmartTechHire",
  publisher: "SmartTechHire",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {process.env.NEXT_PUBLIC_ENV === "production" && (
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WFZ9226R');`}
        </Script>
      )}
      <body className={`${plusJakartaSans.variable} antialiased`} style={{
        backgroundImage: 'url(/artificial-intelligence-landing.svg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
        position: 'relative',
        backgroundColor: 'transparent'
      } as React.CSSProperties}>
        {/* Overlay to ensure content readability */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
          pointerEvents: 'none',
          zIndex: 0
        }} />
        {process.env.NEXT_PUBLIC_ENV === "production" && (
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-WFZ9226R"
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            ></iframe>
          </noscript>
        )}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <NextAuthSessionProvider>
            <RouteLoader />
            <WelcomePopup />
            {/* <Header /> */}
            <main>{children}</main>
            {/* <Footer /> */}
            <Toaster richColors position="bottom-right" />
          <Script
            src="https://checkout.razorpay.com/v1/checkout.js"
            strategy="afterInteractive"
          />
          </NextAuthSessionProvider>
        </div>
      </body>
    </html>
  );
}
