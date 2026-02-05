"use client";

import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import ProfileSection from "./profile-section";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getProfileCompletionPercentage } from "@/api/profile";

interface ProfileData {
  first_name: string;
  last_name: string;
  gender: string;
  email: string;
  mobile_details: {
    mobile_number: string;
    flag: string;
    dial_code: string;
  };
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
  duration_description?: string | null;
  duration_years?: number | null;
}

interface EducationData {
  degree_name: string;
  specialization: string;
  university_name: string;
  graduation_year: number | null;
  academic_status: "Completed" | "Final Year" | "Pursuing" | null;
}

interface SkillsData {
  primary_skill_category: {
    id: number;
    name: string;
  };
  primary_skills: {
    id: number;
    name: string;
    category_name: string;
  }[];
  secondary_skills: {
    id: number;
    name: string;
    category_name: string;
  }[];
  preferred_roles: {
    id: number;
    name: string;
  }[];
  certifications: string;
}

interface LocationAndWorkPreferencesData {
  current_city: {
    id: number;
    name: string;
  };
  current_country: {
    id: number;
    name: string;
  } | null;
  state: string | null;
  preferred_cities: {
    id: number;
    name: string;
  }[];
  preferred_work_modes: {
    id: number;
    name: string;
  }[];
  is_citizen_of_work_country: boolean;
  citizenship_country: string;
  visa_type: string;
  willing_to_relocate: boolean;
  open_to_remote_only: boolean;
  open_to_contract_to_hire: boolean;
}

export default function CandidateProfile({
  profileData,
  personalSocialData,
  currentEmployment,
  educationData,
  locationAndWorkPreferencesData,
  skillsData,
}: {
  profileData: ProfileData;
  personalSocialData: PersonalSocialData | null;
  currentEmployment: EmploymentDetailsData | null;
  educationData: EducationData | null;
  locationAndWorkPreferencesData: LocationAndWorkPreferencesData | null;
  skillsData: SkillsData | null;
}) {
  const router = useRouter();
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const fetchProfileCompletionPercentage = async () => {
      const profileCompletionPercentage =
        await getProfileCompletionPercentage();
      setProgress(profileCompletionPercentage.total_percentage);
    };
    fetchProfileCompletionPercentage();
  }, []);

  // Calculate profile completion percentage
  // const calculateProgress = (): number => {
  //   let progress = 0;

  //   // Account & Identity: 10%

  //   if (
  //     profileData?.email &&
  //     profileData?.first_name &&
  //     profileData?.last_name
  //   ) {
  //     progress += 10;
  //   }

  //   if (
  //     profileData?.email &&
  //     profileData?.gender &&
  //     profileData?.account_type
  //   ) {
  //     progress += 10;
  //   }

  //   // Skills & Domains: 10%
  //   if (skillsData?.primary_skill_category?.id) {
  //     progress += 10;
  //   }

  //   // Personal & Social: 20%
  //   if (personalSocialData?.headline) {
  //     progress += 20;
  //   }

  //   // Current Employment Details: 20%
  //   if (currentEmployment?.employment_status) {
  //     progress += 20;
  //   }

  //   // Location & Work Preferences: 20%
  //   if (locationAndWorkPreferencesData?.current_city?.id) {
  //     progress += 20;
  //   }

  //   // Education: 20%
  //   if (educationData?.academic_status) {
  //     progress += 10;
  //   }

  //   return progress;
  // };

  // const progress = calculateProgress();

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
    ...(currentEmployment?.is_serving_notice
      ? [
          {
            label: "Last Working Day",
            value: currentEmployment?.last_working_day
              ? (() => {
                  const date = new Date(currentEmployment?.last_working_day);
                  const timestamp =
                    date.getTime() - date.getTimezoneOffset() * 60 * 1000;
                  return format(timestamp, "MM-dd-yyyy");
                })()
              : "-",
          },
        ]
      : []),
  ];

  const studentOrFresherData = [
    { label: "Current Status", value: currentEmployment?.employment_status },
    {
      label: "Looking For",
      value: currentEmployment?.looking_for?.map((item) => item).join(", "),
    },
  ];

  const betweenJobData = [
    { label: "Current Status", value: currentEmployment?.employment_status },
    {
      label: "Total Work Experience",
      value: currentEmployment?.total_years_of_experience,
    },
    {
      label: "Duration of Career Break",
      value: `${currentEmployment?.duration_years} years ${currentEmployment?.duration_months} months`,
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
      value: `${currentEmployment?.last_drawn_ctc_amount}`,
      // (${currentEmployment?.current_ctc_period_type})
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

  const educationDetails = [
    { label: "Highest Degree", value: educationData?.degree_name },
    { label: "Specialization", value: educationData?.specialization },
    { label: "University Name", value: educationData?.university_name },
    { label: "Year of Graduation", value: educationData?.graduation_year },
    { label: "Current Academic Status", value: educationData?.academic_status },
  ];

  const locationAndWorkPreferences = [
    {
      label: "Current Country",
      value: locationAndWorkPreferencesData?.current_country?.name,
    },
    {
      label: "Current City",
      value: locationAndWorkPreferencesData?.current_city?.name,
    },
    {
      label: "Preferred Work Locations",
      value: `${locationAndWorkPreferencesData?.preferred_cities
        .map((city) => city.name)
        .join(", ")}(${locationAndWorkPreferencesData?.preferred_work_modes
        ?.map((mode) => mode.name)
        .join(", ")})`,
    },
    {
      label:
        "Are you a citizen or permanent resident of the country where you prefer to work?",
      value: locationAndWorkPreferencesData?.is_citizen_of_work_country
        ? "Yes"
        : "No",
    },
    ...(locationAndWorkPreferencesData?.is_citizen_of_work_country
      ? [
          {
            label: "What type of visa do you currently hold",
            value: locationAndWorkPreferencesData?.visa_type,
          },
          {
            label: "Willing to relocate within your authorized work country?",
            value: locationAndWorkPreferencesData?.willing_to_relocate
              ? "Yes"
              : "No",
          },
          {
            label: "Open to remote-only roles?",
            value: locationAndWorkPreferencesData?.open_to_remote_only
              ? "Yes"
              : "No",
          },
          {
            label: "Are you open to Contract to Hire positions?",
            value: locationAndWorkPreferencesData?.open_to_contract_to_hire
              ? "Yes"
              : "No",
          },
        ]
      : []),
  ];

  const skillsAndDomainsData = [
    {
      label: "Primary Skills Category",
      value: skillsData?.primary_skill_category?.name,
    },
    {
      label: "Primary Skills",
      value: skillsData?.primary_skills.map((skill) => skill.name).join(", "),
    },
    {
      label: "Secondary Skills",
      value: skillsData?.secondary_skills.map((skill) => skill.name).join(", "),
    },
    {
      label: "Preferred Roles",
      value: skillsData?.preferred_roles.map((role) => role.name).join(", "),
    },
    { label: "Certifications", value: skillsData?.certifications },
  ];

  return (
    <div className="flex flex-col md:flex-row w-full gap-4 mb-20 md:mb-0">
      <div className="md:max-w-md md:sticky md:top-20.5 md:self-start">
        {progress < 100 && (
          <div className="bg-warning-50 border border-warning-500 p-4 rounded-2xl mb-4">
            <h2 className="font-semibold text-base md:text-lg">
              Complete your profile
            </h2>
            <div className="text-xs mt-2">
              Complete your profile to get more relevant job matches.
            </div>
            <div className="flex items-center gap-2 my-4">
              <Progress value={progress} />
              <span className="text-xs">{progress}%</span>
            </div>
            <div className="text-xs text-gray-900 font-medium">
              Note: You need to complete your profile 100% to access the
              dashboard, jobs, and assessments.
            </div>
          </div>
        )}
        <div className="p-4 border border-gray-200 rounded-2xl divide-y">
          <div className="flex w-full justify-between items-center pb-2">
            <div className="flex gap-2 items-center">
              <Icon
                icon="material-symbols:person-outline-rounded"
                className="size-6 text-primary-500"
              />
              <h3 className="text-lg md:text-xl font-bold">
                Account & Identity
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
              value={
                (profileData?.gender === "Male" && "Male") ||
                (profileData?.gender === "Female" && "Female") ||
                "-"
              }
            />
            <ProfileItem label="Email ID" value={profileData?.email} />

            <div>
              <Label className="text-xs text-gray-900">Mobile Number</Label>
              {profileData?.mobile_details?.mobile_number ? (
                <div className="text-base font-medium flex items-center gap-1">
                  <Image
                    src={
                      profileData?.mobile_details?.flag ??
                      "https://flagcdn.com/in.svg"
                    }
                    alt="Flag"
                    width={16}
                    height={16}
                    className="rounded-full w-4 h-4"
                  />
                  <span>{profileData?.mobile_details?.dial_code}</span>
                  <span>{profileData?.mobile_details?.mobile_number}</span>
                </div>
              ) : (
                <div className="text-base font-medium">-</div>
              )}
            </div>

            <ProfileItem
              label="Date of Birth"
              value={
                profileData?.date_of_birth
                  ? format(profileData?.date_of_birth, "MM-dd-yyyy")
                  : "-"
              }
            />
            <ProfileItem
              label="Account Type"
              value={profileData?.account_type}
            />
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-4 mb-4">
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
          data={
            locationAndWorkPreferencesData?.current_city?.name
              ? locationAndWorkPreferences
              : null
          }
          nullStateTitle="Work preferences not provided"
          nullStateDescription="Add your location, visa status, and work preferences to get better matches."
          onEdit={() =>
            router.push("/profile-details/edit-location-and-work-preferences")
          }
        />

        <ProfileSection
          title="Education"
          icon="material-symbols:school-outline-rounded"
          data={educationData?.academic_status ? educationDetails : null}
          nullStateTitle="No education details found"
          nullStateDescription="Include your academic background to strengthen your profile."
          onEdit={() => router.push("/profile-details/edit-education")}
        />

        <ProfileSection
          title="Skills & Domains"
          icon="material-symbols:emoji-objects-outline-rounded"
          data={
            skillsData?.primary_skill_category?.name
              ? skillsAndDomainsData
              : null
          }
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
