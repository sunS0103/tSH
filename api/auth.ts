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
  country_id,
  city_id,
  company_name,
  job_category,
  platform_role,
}: {
  first_name: string;
  last_name: string;
  email: string;
  country_code: string;
  mobile_number: string;
  gender: "Male" | "Female";
  role: "CANDIDATE" | "RECRUITER";
  account_type?: "Fresher" | "Working Professional" | "Student" | "Other";
  date_of_birth?: string;
  country_id?: number | null;
  city_id?: number;
  company_name?: string;
  job_category?: string;
  platform_role?: string;
}) => {
  const response = await axios.post("/auth/sign-up", {
    first_name,
    last_name,
    email,
    country_code,
    mobile_number,
    gender,
    role,
    ...(role === "RECRUITER" && {
      country_id,
      city_id,
      company_name,
      job_category,
      platform_role,
    }),
    ...(role === "CANDIDATE" && {
      account_type,
      date_of_birth,
      country_id,
    }),
  });
  return response.data;
};
