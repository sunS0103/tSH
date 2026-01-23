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
  technology?: string[];
  skills?: string[];
}) => {
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

  if (technology && technology.length > 0) {
    // Axios will handle multiple params with the same name
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
  const response = await axios.get(`/candidate/assessment/${slug}`, config);
  return response.data;
};

export const getAssessmentsFilter = async () => {
  const response = await axios.get("/assessment/filters");
  return response.data;
};

export const changeAssessmentStatus = async (
  userAssessmentId: string,
  assessment_status: string
) => {
  const response = await axios.put(
    `/candidate/assessment/${userAssessmentId}/status`,
    {
      assessment_status,
    }
  );
  return response.data;
};

export const getTakenAssessmentsList = async ({
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
  technology?: string[];
  skills?: string[];
}) => {
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

  if (technology && technology.length > 0) {
    // Axios will handle multiple params with the same name
    params.technology = technology;
  }

  if (skills && skills.length > 0) {
    // Axios will handle multiple params with the same name
    params.skills = skills;
  }

  const response = await axios.get("/candidate/assessment/taken", {
    params,
    paramsSerializer: (params) => {
      const searchParams = new URLSearchParams();
      Object.keys(params).forEach((key) => {
        const value = params[key];
        if (Array.isArray(value)) {
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

export const getRequestedAssessmentsList = async ({
  page,
  pageSize,
  sortBy,
  sortDirection,
  query,
}: {
  page: number;
  pageSize: number;
  sortBy: string;
  sortDirection: "asc" | "desc";
  query?: string;
}) => {
  const response = await axios.get("/recruiter/assessment/request", {
    params: {
      page,
      pageSize,
      sortBy,
      sortDirection,
      query,
    },
    paramsSerializer: (params) => {
      const searchParams = new URLSearchParams();
      Object.keys(params).forEach((key) => {
        const value = params[key];
        if (value !== undefined && value !== null && value !== "") {
          searchParams.append(key, value);
        }
      });
      return searchParams.toString();
    },
  });
  return response.data;
};

export const createAssessmentRequest = async (data: {
  assessment_title: string;
  name: string;
  company_email: string;
  skills_to_assess: string;
  country_code: string;
  mobile_number: string;
  job_description: string;
  assessment_creation_preference: string | null;
  custom_instructions?: string;
}) => {
  const response = await axios.post("/recruiter/assessment/request", data);
  return response.data;
};

export interface InviteCandidatesToAssessmentPayload {
  user_ids: string[];
  assessment_slugs: string[];
}

export const inviteCandidatesToAssessment = async (
  data: InviteCandidatesToAssessmentPayload
) => {
  const response = await axios.post(
    "/recruiter/assessment/invite-candidates",
    data
  );
  return response.data;
};
