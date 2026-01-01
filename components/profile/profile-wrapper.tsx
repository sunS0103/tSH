"use client";

import { getCookie, setCookie } from "cookies-next/client";
import RecruiterProfile from "./recruiter-profile";
import CandidateProfile from "./candidate-profile";
import {
  getCandidateProfile,
  getCandidateSocial,
  getCurrentEmploymentDetails,
  getEducation,
  getLocationAndWorkPreferences,
  getRecruiterProfile,
  getSkills,
} from "@/api/profile";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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
  date_of_birth: string;
  account_type: string;
  country_code: string;
  country: string;
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
  };
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
  const [candidateProfileData, setCandidateProfileData] = useState<{
    data: ProfileData;
  } | null>(null);
  const [recruiterProfileData, setRecruiterProfileData] =
    useState<RecruiterProfileData | null>(null);
  const [candidateSocialData, setCandidateSocialData] = useState<{
    data: PersonalSocialData | null;
  } | null>(null);
  const [currentEmploymentDetailsData, setCurrentEmploymentDetailsData] =
    useState<{
      data: EmploymentDetailsData[];
    } | null>(null);
  const [locationAndWorkPreferencesData, setLocationAndWorkPreferencesData] =
    useState(null);
  const [educationData, setEducationData] = useState<{
    data: EducationData;
  } | null>(null);
  const [skillsData, setSkillsData] = useState(null);
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
      if (role === "CANDIDATE") {
        await getCandidateProfile()
          .then((response) => {
            if (response.success) {
              setCandidateProfileData(response);
              setCookie("profile_data", JSON.stringify(response.data));
            }
          })
          .catch((error) => {
            toast.error(
              error?.response?.data?.message ||
                "Failed to get candidate profile data"
            );
          });

        await getCandidateSocial()
          .then((response) => {
            if (response.success) {
              setCandidateSocialData(response.data);
              setCookie("candidate_social_data", JSON.stringify(response.data));
            }
          })
          .catch((error) => {
            toast.error(
              error?.response?.data?.message ||
                "Failed to get candidate social data"
            );
          });

        await getCurrentEmploymentDetails()
          .then((response) => {
            if (response.success) {
              setCurrentEmploymentDetailsData(response.data);
              setCookie(
                "current_employment_details_data",
                JSON.stringify(response.data)
              );
            }
          })
          .catch((error) => {
            toast.error(
              error?.response?.data?.message ||
                "Failed to get current employment details data"
            );
          });

        await getLocationAndWorkPreferences()
          .then((response) => {
            if (response.success) {
              setLocationAndWorkPreferencesData(response.data);
              setCookie(
                "location_and_work_preferences_data",
                JSON.stringify(response.data)
              );
            }
          })
          .catch((error) => {
            toast.error(
              error?.response?.data?.message ||
                "Failed to get location and work preferences data"
            );
          });

        await getEducation()
          .then((response) => {
            if (response.success) {
              setEducationData(response.data);
              setCookie("education_data", JSON.stringify(response.data));
            }
          })
          .catch((error) => {
            toast.error(
              error?.response?.data?.message || "Failed to get education data"
            );
          });

        await getSkills()
          .then((response) => {
            if (response.success) {
              setSkillsData(response.data);
              setCookie("skills_data", JSON.stringify(response.data));
            }
          })
          .catch((error) => {
            toast.error(
              error?.response?.data?.message || "Failed to get skills data"
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
    if (!candidateProfileData) {
      return <div>Profile not found</div>;
    }
    return (
      <CandidateProfile
        profileData={candidateProfileData?.data}
        personalSocialData={candidateSocialData as PersonalSocialData | null}
        currentEmployment={
          currentEmploymentDetailsData as EmploymentDetailsData | null
        }
        educationData={educationData as EducationData | null}
        locationAndWorkPreferencesData={
          locationAndWorkPreferencesData as LocationAndWorkPreferencesData | null
        }
        skillsData={skillsData as SkillsData | null}
      />
    );
  } else if (role === "RECRUITER") {
    console.log(recruiterProfileData);
    return (
      <RecruiterProfile
        recruiterProfileData={recruiterProfileData as RecruiterProfileData}
      />
    );
  } else {
    return <div>Profile not found</div>;
  }
}
