import axios from "../axios";

export interface DashboardStatistics {
  active_jobs: number;
  requested_assessments: number;
  shortlisted_candidates: number;
}

export interface DashboardStatisticsResponse {
  success: boolean;
  message: string;
  data: DashboardStatistics;
}

export const getDashboardStatistics =
  async (): Promise<DashboardStatisticsResponse> => {
    const response = await axios.get("/recruiter/dashboard/statistics");
    return response.data;
  };
