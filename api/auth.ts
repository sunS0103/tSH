import axios from "./axios";

export const sendOtp = async (email: string) => {
  const response = await axios.post("/auth/send-otp", {
    email,
  });
  return response.data;
};

export const verifyOtp = async (
  email: string,
  otp: string,
  role: "CANDIDATE" | "RECRUITER"
) => {
  const response = await axios.post("auth/verify-otp", {
    email,
    otp,
    role,
  });
  return response.data;
};

export const signUp = async ({
  first_name,
  last_name,
  email,
  country_code,
  mobile_number,
  gender,
  role,
  account_type,
  date_of_birth,
  country,
  city,
  company_name,
  primary_job_category,
  platform_primary_role,
}: {
  first_name: string;
  last_name: string;
  email: string;
  country_code: string;
  mobile_number: string;
  gender: "MALE" | "FEMALE";
  role: "CANDIDATE" | "RECRUITER";
  account_type?: "Fresher" | "Working Professional" | "Student" | "Other";
  date_of_birth?: string;
  country:
    | "India"
    | "United States"
    | "United Kingdom"
    | "Canada"
    | "Australia";
  city?: string;
  company_name?: string;
  primary_job_category?: string;
  platform_primary_role?: string;
}) => {
  const response = await axios.post("/auth/sign-up", {
    first_name,
    last_name,
    email,
    country_code,
    mobile_number,
    gender,
    role,
    country,
    ...(role === "RECRUITER" && {
      company_name,
      primary_job_category,
      platform_primary_role,
      city,
    }),
    ...(role === "CANDIDATE" && {
      account_type,
      date_of_birth,
    }),
  });
  return response.data;
};
