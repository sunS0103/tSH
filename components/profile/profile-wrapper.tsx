"use client";

import { getCookie, setCookie } from "cookies-next/client";
import RecruiterProfile from "./recruiter-profile";
import { getRecruiterProfile } from "@/api/profile";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { redirect } from "next/navigation";

interface RecruiterProfileData {
  city: {
    id: number;
    name: string;
  };
  company_name: string;
  country: {
    id: number;
    name: string;
  };
  country_code: string;
  email: string;
  first_name: string;
  gender: string;
  is_verified: boolean;
  job_category: string;
  last_name: string;
  mobile_details: {
    mobile_number: string;
    flag: string;
    dial_code: string;
  };
  platform_role: string;
  preferred_technologies: string[];
  role: "RECRUITER" | "CANDIDATE";
}
export default function ProfilePage() {
  const [recruiterProfileData, setRecruiterProfileData] =
    useState<RecruiterProfileData | null>(null);
  const role = getCookie("user_role") as "CANDIDATE" | "RECRUITER" | undefined;

  useEffect(() => {
    const getProfileData = async () => {
      if (role === "RECRUITER") {
        await getRecruiterProfile()
          .then((response) => {
            if (response.success) {
              setRecruiterProfileData(response.data);
              setCookie("profile_data", JSON.stringify(response.data));
            }
          })
          .catch((error) => {
            toast.error(
              error?.response?.data?.message ||
                "Failed to get recruiter profile data"
            );
          });
      }
    };
    getProfileData();
  }, [role]);

  if (!role) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (role === "CANDIDATE") {
    redirect("/profile-details/edit-account-and-identity");
  }

  if (role === "RECRUITER") {
    return (
      <RecruiterProfile
        recruiterProfileData={recruiterProfileData as RecruiterProfileData}
      />
    );
  } else {
    return <div>Profile not found</div>;
  }
}
