import axios from "./axios/index";

export const getAssessmentList = async ({
  page,
  pageSize,
  sortBy,
  sortDirection,
  query,
  technology,
  skills,
}: {
  page: number;
  pageSize: number;
  sortBy: string;
  sortDirection: "asc" | "desc";
  query?: string;
  technology?: string;
  skills?: string[];
}) => {
  const params: Record<string, any> = {
    page,
    pageSize,
    sortBy,
    sortDirection,
  };

  if (query) {
    params.query = query;
  }

  if (technology) {
    params.technology = technology;
  }

  if (skills && skills.length > 0) {
    // Axios will handle multiple params with the same name
    params.skills = skills;
  }

  const response = await axios.get("/assessment/list", {
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

export const getAssessmentBySlug = async (slug: string, token?: string) => {
  const config = token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : {};
  const response = await axios.get(`/assessment/${slug}`, config);
  return response.data;
};

export const getAssessmentsFilter = async () => {
  const response = await axios.get("/assessment/filters");
  return response.data;
};
