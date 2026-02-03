import axios from "./axios";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  country_code: string;
  user_type: "candidate" | "recruiter";
  company?: string;
  message: string;
  recaptcha_token: string;
}

export const submitContactForm = async (data: ContactFormData) => {
  const response = await axios.post("/contact/submit", data);
  return response.data;
};
