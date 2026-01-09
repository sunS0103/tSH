import axios from "../axios"

export const getRecruiterJobs = async () => {
  const response = await axios.get("/recruiter/jobs");
  return response.data;
};
