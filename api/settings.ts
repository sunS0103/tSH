import axios from "./axios";

export const getCandidateSettings = async () => {
  const response = await axios.get("/candidate/profile/notification");
  return response.data;
};

export const updateCandidateSettings = async (data: {
  allow_email_contact: boolean;
  allow_phone_contact: boolean;
  receive_job_alerts: boolean;
  receive_assessment_updates: boolean;
}) => {
  const response = await axios.put("/candidate/profile/notification", data);
  return response.data;
};
