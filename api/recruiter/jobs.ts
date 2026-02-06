import axios from "../axios"

export const getRecruiterJobs = async (params?: any) => {
  const response = await axios.get("/recruiter/jobs", { params });
  return response.data;
};

export interface InviteCandidatesPayload {
  user_ids: string[];
}

export interface InviteCandidatesResponse {
  success: boolean;
  message: string;
}

export const inviteCandidatesToJob = async (
  jobId: string,
  data: InviteCandidatesPayload
): Promise<InviteCandidatesResponse> => {
  const response = await axios.post(
    `/recruiter/jobs/${jobId}/invite-candidates`,
    data
  );
  return response.data;
};
