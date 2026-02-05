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
            // Redirect to profile-details onboarding if profile is not 100% complete
            setIsProfileComplete(false);
            router.push("/profile-details/edit-account-and-identity");
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

  const BetaBanner = () => (
    <div className="max-w-7xl mx-auto px-4 md:px-6 pt-4 mb-6">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-amber-800 font-semibold text-sm text-center">
          🚧 TechSmartHire is currently in Beta
        </p>
        <p className="text-amber-700 text-xs text-center mt-1">
          We're rolling out features in phases. Join our programs now and enjoy early-bird advantage with higher profile visibility and ranking in the Talent Pool.
        </p>
      </div>
    </div>
  );

  if (role === "RECRUITER") {
    return (
      <>
        <BetaBanner />
        <RecruiterDashboard />
      </>
    );
  }

  if (role === "CANDIDATE") {
    return (
      <>
        <BetaBanner />
        <CandidateDashboard />
      </>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader />
    </div>
  );
}
