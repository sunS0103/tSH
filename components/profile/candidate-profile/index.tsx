"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import ProfileSection from "./profile-section";

interface ProfileData {
  first_name: string;
  last_name: string;
  gender: string;
  email: string;
  mobile_number: string;
  country_code: string;
  country: string;
  date_of_birth: string;
  account_type: string;
}

interface PersonalSocialData {
  headline: string;
  bio: string;
  linkedin_url: string;
  github_url: string;
}

interface EmploymentDetailsData {
  employment_status: string;
  company_name: string | null;
  designation: string | null;
  total_years_of_experience: number | null;
  current_ctc_amount: number | null;
  current_ctc_currency: string;
  current_ctc_period_type: string;
  expected_ctc_amount: number | null;
  expected_ctc_currency: string | null;
  expected_ctc_period: string | null;
  notice_period_type: string | null;
  is_serving_notice: boolean;
  last_working_day: string | null;
  reason?: string | null;
  last_drawn_ctc_amount?: string | null;
  upskilling_activities?: string | null;
  looking_for?: string[] | null;
  looking_for_internship?: boolean;
  looking_for_full_time?: boolean;
  looking_for_part_time?: boolean;
  looking_for_remote?: boolean;
  duration_months?: string | null;
}

export default function CandidateProfile({
  profileData,
  personalSocialData,
  currentEmployment,
}: {
  profileData: ProfileData;
  personalSocialData: PersonalSocialData | null;
  currentEmployment: EmploymentDetailsData | null;
}) {
  const [progress] = useState(10);
  const router = useRouter();

  const personalAndSocialData = [
    { label: "Short Headline", value: personalSocialData?.headline },
    { label: "Describe Yourself", value: personalSocialData?.bio },
    { label: "LinkedIn URL", value: personalSocialData?.linkedin_url },
    { label: "GitHub URL", value: personalSocialData?.github_url },
  ];

  const employmentData = [
    { label: "Current Status", value: currentEmployment?.employment_status },
    { label: "Current Company Name", value: currentEmployment?.company_name },
    { label: "Current Designation", value: currentEmployment?.designation },
    {
      label: "Total Experience",
      value: currentEmployment?.total_years_of_experience,
    },
    { label: "Current CTC", value: currentEmployment?.current_ctc_amount },
    { label: "Expected CTC", value: currentEmployment?.expected_ctc_amount },
    { label: "Notice Period", value: currentEmployment?.notice_period_type },
    {
      label: "Currently Serving Notice?",
      value: currentEmployment?.is_serving_notice ? "Yes" : "No",
    },
    {
      label: "Last Working Day",
      value: currentEmployment?.last_working_day
        ? format(new Date(currentEmployment?.last_working_day), "dd-MM-yyyy")
        : "-",
    },
  ];

  const studentOrFresherData = [
    { label: "Current Status", value: currentEmployment?.employment_status },
    { label: "Looking For", value: currentEmployment?.looking_for?.toString() },
  ];

  const betweenJobData = [
    { label: "Current Status", value: currentEmployment?.employment_status },
    {
      label: "Total Work Experience",
      value: currentEmployment?.total_years_of_experience,
    },
    {
      label: "Duration of Career Break",
      value: currentEmployment?.duration_months,
    },
    {
      label: "Reason for Career Break",
      value: currentEmployment?.reason,
    },
    {
      label: "Upskilling During This Period",
      value: currentEmployment?.upskilling_activities,
    },
    {
      label: "Last Drawn CTC",
      value: currentEmployment?.last_drawn_ctc_amount,
    },
  ];

  const currentEmploymentData =
    currentEmployment?.employment_status === "Employed"
      ? employmentData
      : currentEmployment?.employment_status === "Student" ||
        currentEmployment?.employment_status === "Fresher"
      ? studentOrFresherData
      : currentEmployment?.employment_status === "Between Jobs"
      ? betweenJobData
      : null;

  return (
    <div className="flex flex-col md:flex-row w-full gap-4">
      <div className="max-w-md">
        <div className="bg-warning-50 border border-warning-500 p-4 rounded-2xl">
          <h2 className="font-semibold text-base md:text-lg">
            Complete your profile
          </h2>
          <div className="text-xs mt-2">
            Complete your profile to get more relevant job matches.
          </div>
          <div className="flex items-center gap-2 mt-4">
            <Progress value={progress} />
            <span className="text-xs">{progress}%</span>
          </div>
        </div>
        <div className="mt-4 p-4 border border-gray-200 rounded-2xl divide-y">
          <div className="flex w-full justify-between items-center pb-2">
            <div className="flex gap-2 items-center">
              <Icon
                icon="material-symbols:person-outline-rounded"
                className="size-6 text-primary-500"
              />
              <h3 className="text-lg md:text-xl font-bold">
                Accountant & Identity
              </h3>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() =>
                router.push("/profile-details/edit-account-and-identity")
              }
            >
              <Icon icon="material-symbols:edit-outline-rounded" />
            </Button>
          </div>
          <div className="space-y-3 mt-4">
            <ProfileItem label="First Name" value={profileData?.first_name} />
            <ProfileItem label="Last Name" value={profileData?.last_name} />
            <ProfileItem
              label="Gender"
              value={profileData?.gender === "MALE" ? "Male" : "Female"}
            />
            <ProfileItem label="Email ID" value={profileData?.email} />
            <ProfileItem
              label="Mobile Number"
              value={`${profileData?.country_code} ${profileData?.mobile_number}`}
            />
            <ProfileItem
              label="Date of Birth"
              value={format(new Date(profileData?.date_of_birth), "dd/MM/yyyy")}
            />
            <ProfileItem
              label="Account Type"
              value={profileData?.account_type}
            />
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-4">
        <ProfileSection
          title="Personal & Social"
          icon="material-symbols:id-card-outline-rounded"
          data={personalSocialData ? personalAndSocialData : null} // Set to null to show null state, or provide data array
          nullStateTitle="No personal information added yet"
          nullStateDescription="Add your headline, bio, and profile links to complete your introduction."
          onEdit={() => router.push("/profile-details/edit-personal-social")}
        />

        <ProfileSection
          title="Current Employment Details"
          icon="mingcute:briefcase-2-line"
          data={currentEmploymentData}
          nullStateTitle="Your employment details are missing"
          nullStateDescription="Add your current role, company info, and experience to showcase your career."
          onEdit={() => router.push("/profile-details/edit-employment")}
        />

        <ProfileSection
          title="Location & Work Preferences"
          icon="material-symbols:location-on-outline-rounded"
          data={null}
          nullStateTitle="Work preferences not provided"
          nullStateDescription="Add your location, visa status, and work preferences to get better matches."
          onEdit={() =>
            router.push("/profile-details/edit-location-and-work-preferences")
          }
        />

        <ProfileSection
          title="Education"
          icon="material-symbols:school-outline-rounded"
          data={null}
          nullStateTitle="No education details found"
          nullStateDescription="Include your academic background to strengthen your profile."
          onEdit={() => router.push("/profile-details/edit-education")}
        />

        <ProfileSection
          title="Skills & Domains"
          icon="material-symbols:emoji-objects-outline-rounded"
          data={null}
          nullStateTitle="Skills not added yet"
          nullStateDescription="Add your core skills and domains to highlight your expertise."
          onEdit={() => router.push("/profile-details/edit-skills")}
        />
      </div>
    </div>
  );
}

function ProfileItem({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div>
      <Label className="text-xs text-gray-900">{label}</Label>
      <div className="text-base font-medium">{value}</div>
    </div>
  );
}
