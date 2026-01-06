import axios from "../axios";

export const getRecruiterJobs = async ({
  page = 1,
  pageSize = 10,
  query,
  sortBy = "created_at",
  sortDirection = "desc",
}: {
  page?: number;
  pageSize?: number;
  query?: string;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
} = {}) => {
  const params: Record<string, any> = {
    page,
    pageSize,
    sortBy,
    sortDirection,
  };

  if (query) {
    params.query = query;
  }

  const response = await axios.get("/recruiter/jobs", { params });
  return response.data;
};

export const getRecruiterJob = async (jobId: string) => {
  const response = await axios.get(`/recruiter/jobs/${jobId}`);
  return response.data;
};

export const createRecruiterJob = async (data: any) => {
  const response = await axios.post("/recruiter/jobs", data);
  return response.data;
};

export const updateRecruiterJob = async (jobId: string, data: any) => {
  const response = await axios.put(`/recruiter/jobs/${jobId}`, data);
  return response.data;
};

export const saveJobAsDraft = async (jobId: string | null, data: any) => {
  if (jobId) {
    return updateRecruiterJob(jobId, { ...data, status: "draft" });
  }
  return createRecruiterJob({ ...data, status: "draft" });
};