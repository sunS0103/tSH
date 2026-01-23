import axios from "./axios";

export const getRecruiterProfile = async () => {
  const response = await axios.get("/recruiter/profile");
  return response.data;
};

export const updateRecruiterProfile = async (data: {
  first_name: string;
  last_name: string;
  gender: string;
  email: string;
  mobile_number: string;
  country_code: string;
  country_id: number;
  city_id: number;
  company_name: string;
  job_category: string;
  platform_role: string;
}) => {
  const response = await axios.put("/recruiter/profile", data);
  return response.data;
};

export const getCandidateProfile = async () => {
  const response = await axios.get("/candidate/profile/basic-details");
  return response.data;
};

export const updateCandidateProfile = async (data: {
  first_name: string;
  last_name: string;
  gender: string;
  email: string;
  mobile_number: string;
  date_of_birth: number;
  account_type: string;
  country_code: string;
  country: string;
  role: string;
}) => {
  const response = await axios.put("/candidate/profile/basic-details", data);
  return response.data;
};

export const getCandidateSocial = async () => {
  const response = await axios.get("/candidate/profile/social");
  return response.data;
};

export const updateCandidateSocial = async (data: {
  headline: string;
  bio: string;
  linkedin_url: string;
  github_url: string;
}) => {
  const response = await axios.put("/candidate/profile/social", data);
  return response.data;
};

export const getCurrentEmploymentDetails = async () => {
  const response = await axios.get("/candidate/profile/employment");
  return response.data;
};

export const updateCurrentEmploymentDetails = async (data: {
  employment_status: string;
  company_name?: string | null;
  designation?: string | null;
  total_years_of_experience?: number | null;
  current_ctc_amount?: number | null;
  current_ctc_currency?: string;
  current_ctc_period_type?: string;
  expected_ctc_amount?: number | null;
  expected_ctc_currency?: string | null;
  expected_ctc_period?: string | null;
  notice_period_type?: string | null;
  is_serving_notice?: boolean;
  last_working_day?: string | null;
  reason?: string | null;
  last_drawn_ctc_amount?: string | null;
  upskilling_activities?: string | null;
  looking_for?: string | null;
  looking_for_internship?: boolean;
  looking_for_full_time?: boolean;
  looking_for_part_time?: boolean;
  looking_for_remote?: boolean;
  duration_months?: string | null;
}) => {
  const response = await axios.put("/candidate/profile/employment", data);
  return response.data;
};

// Separate API calls for each employment status
export const updateEmployedStatus = async (data: {
  company_name: string;
  designation: string;
  total_years_of_experience: number;
  current_ctc_amount: number;
  current_ctc_currency: string;
  current_ctc_period_type: string;
  expected_ctc_amount: number;
  expected_ctc_currency: string;
  expected_ctc_period: string;
  notice_period_type: string;
  is_serving_notice: boolean;
  last_working_day: number | null;
}) => {
  const response = await axios.put("/candidate/profile/employment", {
    employment_status: "Employed",
    ...data,
  });
  return response.data;
};

export const updateStudentFresherStatus = async (data: {
  employment_status: "Student" | "Fresher";
  looking_for_internship: boolean;
  looking_for_full_time: boolean;
  looking_for_part_time: boolean;
  looking_for_remote: boolean;
}) => {
  const response = await axios.put("/candidate/profile/employment", {
    ...data,
  });
  return response.data;
};

export const updateBetweenJobsStatus = async (data: {
  total_years_of_experience: number;
  duration_years: number | null;
  duration_months: number | null;
  last_drawn_ctc_amount: number;
  // duration_description: string;
  reason: string;
  upskilling_activities: string;
  current_ctc_period_type: string;
}) => {
  const response = await axios.put("/candidate/profile/employment", {
    employment_status: "Between Jobs",
    ...data,
  });
  return response.data;
};

export const getLocationAndWorkPreferences = async () => {
  const response = await axios.get("candidate/profile/location");
  return response.data;
};

export const updateLocationAndWorkPreferences = async (data: {
  city_id?: number | null;
  country_id?: number | null;
  preferred_cities?: number[] | null;
  preferred_work_modes?: number[] | null;
  is_citizen_of_work_country?: boolean | null;
  visa_type?: string | null;
  willing_to_relocate?: boolean | null;
  open_to_remote_only?: boolean | null;
  open_to_contract_to_hire?: boolean | null;
}) => {
  const response = await axios.put("/candidate/profile/location", data);
  return response.data;
};

export const getEducation = async () => {
  const response = await axios.get("/candidate/profile/education");
  return response.data;
};

export const updateEducation = async (data: {
  degree_name: string;
  specialization: string;
  university_name: string;
  graduation_year: number | null;
  academic_status: "Completed" | "Final Year" | "Pursuing" | null;
}) => {
  const response = await axios.put("/candidate/profile/education", data);
  return response.data;
};

export const getSkills = async () => {
  const response = await axios.get("/candidate/profile/skills");
  return response.data;
};

export const updateSkills = async (data: {
  primary_skill_category?: number | null;
  primary_skills?: number[] | null;
  secondary_skill?: number[] | null;
  preferred_role?: number[] | null;
  certifications?: string | null;
}) => {
  const response = await axios.put("/candidate/profile/skills", data);
  return response.data;
};
