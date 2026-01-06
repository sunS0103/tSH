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