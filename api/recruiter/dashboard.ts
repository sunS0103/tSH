import axios from "../axios";

export interface DashboardStatistics {
  active_jobs: number;
  requested_assessment: number;
  shortlisted_candidate: number;
}

export interface DashboardStatisticsResponse {
  success: boolean;
  message: string;
  greeting: string;
  active_jobs: number;
  requested_assessment: number;
  shortlisted_candidate: number;
}

export const getDashboardStatistics =
  async (): Promise<DashboardStatisticsResponse> => {
    const response = await axios.get("/recruiter/dashboard");
    return response.data;
  };
