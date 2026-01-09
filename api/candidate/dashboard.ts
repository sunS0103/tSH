import axios from "../axios";

export interface CandidateDashboardStatistics {
  applied_jobs: number;
  average_score: number;
  recruiters_shortlisted_you: number;
}

export interface CandidateDashboardStatisticsResponse {
  message: string;
  data: CandidateDashboardStatistics;
}

export const getCandidateDashboardStatistics =
  async (): Promise<CandidateDashboardStatisticsResponse> => {
    const response = await axios.get("/candidate/dashboard/statistics");
    return response.data;
  };

export interface CandidateAppliedJob {
  id: string;
  title: string;
  company_name: string;
  experience_min_years: number;
  experience_max_years: number;
  work_mode: string;
  location: string;
  relevant_assessments: string[];
}

export interface CandidateAppliedJobsResponse {
  message: string;
  data: CandidateAppliedJob[];
  meta?: {
    pagination?: {
      total: number;
      page: number;
      pageSize: number;
    };
  };
}

export const getCandidateAppliedJobs = async ({
  page = 1,
  pageSize = 10,
}: {
  page?: number;
  pageSize?: number;
}): Promise<CandidateAppliedJobsResponse> => {
  const response = await axios.get("/candidate/jobs/applied", {
    params: {
      page,
      pageSize,
    },
  });
  return response.data;
};
