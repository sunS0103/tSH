import axios from "../axios";

export interface CandidateDashboardStatistics {
  applied_jobs: number;
  average_score: number;
  recruiter_shortlisted_you: number;
}

export interface CandidateDashboardStatisticsResponse {
  success: boolean;
  message: string;
  greeting: string;
  applied_jobs: number;
  average_score: number;
  recruiter_shortlisted_you: number;
}

export const getCandidateDashboardStatistics =
  async (): Promise<CandidateDashboardStatisticsResponse> => {
    const response = await axios.get("/candidate/dashboard");
    return response.data;
  };

export interface CandidateAppliedJob {
  id: string;
  slug: string;
  title: string;
  company_name: string;
  experience_range: string;
  work_mode: string[];
  location: string;
  city?: {
    id: number;
    name: string;
  };
  country?: {
    id: number;
    name: string;
  };
  relevant_assessments: {
    id: string;
    assessment_id?: string;
    title: string;
    slug: string;
  }[];
  compensation: string;
  is_applied: boolean;
  created_at: string;
  updated_at: string;
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
  const response = await axios.get("/candidate/jobs?applied_only=true", {
    params: {
      page,
      pageSize,
    },
  });
  return response.data;
};
