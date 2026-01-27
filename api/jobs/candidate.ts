import axios from "../axios/index";

export const getCandidateJobs = async ({
  page = 1,
  pageSize = 10,
  query,
  sortBy = "created_at",
  sortDirection = "desc",
  work_mode,
  primary_skills,
  assessments,
  applied_only,
}: {
  page?: number;
  pageSize?: number;
  query?: string;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  work_mode?: string[];
  primary_skills?: string[];
  assessments?: string[];
  applied_only?: number;
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

  if (work_mode && work_mode.length > 0) {
    params.work_mode = work_mode;
  }

  if (primary_skills && primary_skills.length > 0) {
    params.primary_skills = primary_skills;
  }

  if (assessments && assessments.length > 0) {
    params.assessments = assessments;
  }
  if (applied_only) {
    params.applied_only = applied_only;
  }

  const response = await axios.get("/candidate/jobs", {
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

export const getCandidateJobsFilters = async () => {
  const response = await axios.get("/candidate/jobs/filters");
  return response.data;
};

export const getCandidateJob = async ({
  jobId,
  token,
}: {
  jobId: string;
  token?: string;
}) => {
  if (!jobId) {
    throw new Error("Job ID is required");
  }

  const config: {
    headers?: {
      Authorization: string;
    };
  } = {};

  if (token) {
    config.headers = {
      Authorization: `Bearer ${token}`,
    };
  }

  try {
    const response = await axios.get(`/candidate/jobs/${jobId}`, config);
    return response.data;
  } catch (error) {
    const axiosError = error as {
      response?: { data?: unknown; status?: number };
      message?: string;
    };
    console.error("Error in getCandidateJob:", {
      jobId,
      hasToken: !!token,
      endpoint: `/candidate/jobs/${jobId}`,
      error: axiosError.response?.data || axiosError.message,
      status: axiosError.response?.status,
    });
    throw error;
  }
};

export const getCandidateJobFields = async ({
  jobId,
  token,
}: {
  jobId: string;
  token?: string;
}) => {
  if (!jobId) {
    throw new Error("Job ID is required");
  }

  const config: {
    headers?: {
      Authorization: string;
    };
  } = {};

  if (token) {
    config.headers = {
      Authorization: `Bearer ${token}`,
    };
  }

  const response = await axios.get(
    `/candidate/jobs/${jobId}/custom-fields`,
    config
  );
  return response.data;
};

export const applyToJob = async ({
  jobId,
  payload,
}: {
  jobId: string;
  payload: {
    profile_fields: Array<{ title: string; value: string }>;
    custom_fields: Array<{ job_custom_field_id: number; value: string }>;
  };
}) => {
  const response = await axios.post(`/candidate/jobs/${jobId}/custom-fields`, {
    custom_fields: payload?.custom_fields,
    profile_fields: payload?.profile_fields,
  });
  return response.data;
};

export const getCandidateJobAdditionalDetails = async ({
  jobId,
}: {
  jobId: string;
  token?: string;
}) => {
  const response = await axios.get(
    `/candidate/jobs/${jobId}/additional-details`
  );
  return response.data;
};

export const sendCandidateJobAdditionalDetails = async ({
  jobId,
  additionalDetails,
}: {
  jobId: string;
  additionalDetails: Array<{ title: string; value: string }>;
}) => {
  const response = await axios.post(
    `/candidate/jobs/${jobId}/additional-details`,
    {
      additional_details: additionalDetails,
    }
  );
  return response.data;
};
