import { RecruiterJob } from "@/types/job";
import axios from "../axios";

export const getRecruiterJobs = async ({
  page = 1,
  pageSize = 10,
  query,
  sortBy = "created_at",
  sortDirection = "desc",
  work_mode,
  status,
  primary_skills,
  years_of_experience,
}: {
  page?: number;
  pageSize?: number;
  query?: string;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  work_mode?: string[];
  status?: string[];
  primary_skills?: string[];
  years_of_experience?: string[];
} = {}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const params: Record<string, any> = {
    page,
    pageSize,
    sortBy,
    sortDirection,
  };

  if (query) {
    params.query = query;
  }

  if (work_mode && work_mode.length > 0) {
    params.work_mode = work_mode;
  }
  if (status && status.length > 0) {
    params.status = status;
  }
  if (primary_skills && primary_skills.length > 0) {
    params.primary_skills = primary_skills;
  }
  if (years_of_experience && years_of_experience.length > 0) {
    params.years_of_experience = years_of_experience;
  }

  const response = await axios.get("/recruiter/jobs", {
    params,
    paramsSerializer: (params) => {
      const searchParams = new URLSearchParams();
      Object.keys(params).forEach((key) => {
        const value = params[key];
        if (Array.isArray(value)) {
          // For arrays (like skills), add each value as a separate param
          value.forEach((item) => {
            searchParams.append(key, item);
          });
        } else if (value !== undefined && value !== null && value !== "") {
          searchParams.append(key, value);
        }
      });
      return searchParams.toString();
    },
  });
  return response.data;
};

export const getRecruiterJob = async ({
  jobId,
  token,
}: {
  jobId: string;
  token?: string;
}) => {
  const config = token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : {};

  const response = await axios.get(`/recruiter/jobs/${jobId}`, config);
  return response.data;
};

export const createRecruiterJob = async (data: RecruiterJob) => {
  const response = await axios.post("/recruiter/jobs", data);
  return response.data;
};

export const updateRecruiterJob = async (jobId: string, data: RecruiterJob) => {
  const response = await axios.put(`/recruiter/jobs/${jobId}`, data);
  return response.data;
};

export const saveJobAsDraft = async (
  jobId: string | null,
  data: RecruiterJob
) => {
  if (jobId) {
    return updateRecruiterJob(jobId, { ...data, status: "draft" });
  }
  return createRecruiterJob({ ...data, status: "draft" });
};

export const getRecruiterJobsFilters = async () => {
  const response = await axios.get("/recruiter/jobs/filters");
  return response.data;
};
