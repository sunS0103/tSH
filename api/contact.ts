import axios from "./axios";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  countryCode: string;
  userType: "candidate" | "recruiter";
  company?: string;
  message: string;
  recaptchaToken: string;
}

export const submitContactForm = async (data: ContactFormData) => {
  const response = await axios.post("/contact/submit", data);
  return response.data;
};
