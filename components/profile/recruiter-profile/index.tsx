"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { getCookie } from "cookies-next/client";
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

export default function RecruiterProfile() {
  const router = useRouter();

  // TODO: Replace with actual data from API
  const profileData = {
    firstName: "Darshan",
    lastName: "Joshi",
    gender: "Male",
    companyName: "Techplazza",
    country: "India",
    city: "Surat",
    email: getCookie("user_email") as string,
    phone: "+91 99999 99999",
    primaryJobCategory: "Tech",
    platformRole: "Hiring Manager for a project",
  };

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
          <ProfileDetail label="First Name" value={profileData.firstName} />
          <ProfileDetail label="Last Name" value={profileData.lastName} />
        </div>

        {/* Row 2: Gender, Company name */}
        <div className="flex flex-col md:flex-row gap-2">
          <ProfileDetail label="Gender" value={profileData.gender} />
          <ProfileDetail label="Company name" value={profileData.companyName} />
        </div>

        {/* Row 3: Country, City */}
        <div className="flex flex-col md:flex-row gap-2">
          <ProfileDetail label="Country" value={profileData.country} />
          <ProfileDetail label="City" value={profileData.city} />
        </div>

        {/* Row 4: Email ID, Phone Number */}
        <div className="flex flex-col md:flex-row gap-2">
          <ProfileDetail label="Email ID" value={profileData.email} />
          <ProfileDetail label="Phone Number" value={profileData.phone} />
        </div>

        {/* Row 5: Primary Job Posting Category */}
        <div className="flex flex-col md:flex-row gap-2">
          <ProfileDetail
            label="Primary Job Posting Category"
            value={profileData.primaryJobCategory}
          />
        </div>

        {/* Row 6: Role using this platform primarily */}
        <div className="flex flex-col md:flex-row gap-2">
          <ProfileDetail
            label="Role using this platform primarily"
            value={profileData.platformRole}
          />
        </div>
      </div>
    </div>
  );
}
