"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next/client";
import RecruiterDashboard from "./recruiter-dashboard";
import CandidateDashboard from "./candidate-dashboard";
import { Loader } from "../ui/loader";
import { getProfileCompletionPercentage } from "@/api/profile";

export default function DashboardWrapper() {
  const router = useRouter();
  const role = getCookie("user_role");
  // Initialize as true for candidates to prevent flash of content
  const [isCheckingProfile, setIsCheckingProfile] = useState(
    role === "CANDIDATE"
  );
  const [isProfileComplete, setIsProfileComplete] = useState<boolean | null>(
    null
  );

  useEffect(() => {
    // Client-side fallback check for profile completion
    const checkProfileCompletion = async () => {
      if (role === "CANDIDATE") {
        try {
          const profileCompletion = await getProfileCompletionPercentage();
          if (
            profileCompletion &&
            profileCompletion.total_percentage !== undefined &&
            profileCompletion.total_percentage < 100
          ) {
            // Redirect to profile page if profile is not 100% complete
            setIsProfileComplete(false);
            router.push("/profile");
            return;
          }
          setIsProfileComplete(true);
        } catch (error) {
          // If API call fails, allow access but log error
          console.error("Error checking profile completion:", error);
          setIsProfileComplete(true);
        } finally {
          setIsCheckingProfile(false);
        }
      } else {
        setIsCheckingProfile(false);
      }
    };

    checkProfileCompletion();
  }, [role, router]);

  if (isCheckingProfile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader />
      </div>
    );
  }

  // Don't render candidate dashboard if profile is incomplete
  if (role === "CANDIDATE" && isProfileComplete === false) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader />
      </div>
    );
  }

  if (role === "RECRUITER") {
    return <RecruiterDashboard />;
  }

  if (role === "CANDIDATE") {
    return <CandidateDashboard />;
  }

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader />
    </div>
  );
}
