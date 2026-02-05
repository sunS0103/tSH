import axios from "../axios";

export const getJobFairStatus = async () => {
  const response = await axios.get("/web/job-fair-plan-status");
  return response.data;
};
