import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
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
  title: "Tech Smart Hire",
  description: "Tech Smart Hire",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${plusJakartaSans.variable} antialiased`}>
        <NextAuthSessionProvider>
          <RouteLoader />
          <main>{children}</main>
          <Toaster richColors position="bottom-right" />
          <Script
            src="https://checkout.razorpay.com/v1/checkout.js"
            strategy="afterInteractive"
          />
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
