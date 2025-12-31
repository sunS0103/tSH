"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";

interface ProfileDetailProps {
  label: string;
  value: string;
}

function ProfileDetail({ label, value }: ProfileDetailProps) {
  return (
    <div className="flex flex-col gap-1 flex-1">
      <p className="text-xs text-gray-700 font-normal">{label}</p>
      <p className="text-base text-black font-medium">{value}</p>
    </div>
  );
}

export default function RecruiterProfile({
  recruiterProfileData,
}: {
  recruiterProfileData: {
    city: string;
    company_name: string;
    country: string;
    country_code: string;
    email: string;
    first_name: string;
    gender: string;
    is_verified: boolean;
    job_category: string;
    last_name: string;
    mobile_details: {
      mobile_number: string;
      flag_code: string;
      dial_code: string;
    };
    platform_role: string;
    preferred_technologies: string[];
    role: "RECRUITER" | "CANDIDATE";
  };
}) {
  const router = useRouter();

  const profileData = recruiterProfileData;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl flex flex-col gap-5 w-full max-w-3xl mx-auto mt-4">
      {/* Header with Title and Edit Button */}
      <div className="bg-primary-50 flex items-center justify-between p-3 md:p-4 rounded-t-2xl">
        <div className="flex items-center gap-2">
          <div className="size-6 flex items-center justify-center">
            <Icon
              icon="material-symbols:person-outline-rounded"
              className="size-6 text-primary-500"
            />
          </div>
          <h1 className="text-lg md:text-xl font-bold text-black">
            Basic Profile Details
          </h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/profile/edit")}
          className="size-5"
        >
          <Icon
            icon="material-symbols:edit-outline-rounded"
            className="size-5"
          />
        </Button>
      </div>

      {/* Profile Details */}
      <div className="flex flex-col gap-3 px-3 md:px-4 pb-4">
        {/* Row 1: First Name, Last Name */}
        <div className="flex flex-col md:flex-row gap-2">
          <ProfileDetail label="First Name" value={profileData?.first_name} />
          <ProfileDetail label="Last Name" value={profileData?.last_name} />
        </div>

        {/* Row 2: Gender, Company name */}
        <div className="flex flex-col md:flex-row gap-2">
          <ProfileDetail label="Gender" value={profileData?.gender} />
          <ProfileDetail
            label="Company name"
            value={profileData?.company_name}
          />
        </div>

        {/* Row 3: Country, City */}
        <div className="flex flex-col md:flex-row gap-2">
          <ProfileDetail label="Country" value={profileData?.country} />
          <ProfileDetail label="City" value={profileData?.city} />
        </div>

        {/* Row 4: Email ID, Phone Number */}
        <div className="flex flex-col md:flex-row gap-2">
          <ProfileDetail label="Email ID" value={profileData?.email} />
          <ProfileDetail
            label="Phone Number"
            value={`${profileData?.mobile_details?.dial_code} ${profileData?.mobile_details?.mobile_number}`}
          />
        </div>

        {/* Row 5: Primary Job Posting Category */}
        <div className="flex flex-col md:flex-row gap-2">
          <ProfileDetail
            label="Primary Job Posting Category"
            value={profileData?.job_category}
          />
        </div>

        {/* Row 6: Role using this platform primarily */}
        <div className="flex flex-col md:flex-row gap-2">
          <ProfileDetail
            label="Role using this platform primarily"
            value={profileData?.platform_role}
          />
        </div>
      </div>
    </div>
  );
}
