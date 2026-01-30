"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/header";
import { NotificationProvider } from "@/components/providers/notification-provider";
import CandidateGuard from "@/components/providers/candidate-guard";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  // Hide header for profile-details routes (onboarding experience)
  const isProfileDetailsRoute = pathname?.startsWith("/profile-details");

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <NotificationProvider>
        <Header />
        <div className="bg-gray-50">
          <div
            className={`${
              !isProfileDetailsRoute ? "max-container mx-auto" : ""
            } bg-gray-50 ${!isProfileDetailsRoute ? "px-4 pt-4" : ""} h-full`}
          >
            {isProfileDetailsRoute ? (
              // No CandidateGuard for profile-details - they need to complete their profile first
              children
            ) : (
              <CandidateGuard>{children}</CandidateGuard>
            )}
          </div>
        </div>
      </NotificationProvider>
    </div>
  );
}
