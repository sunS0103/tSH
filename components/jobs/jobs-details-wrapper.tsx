import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import CandidateJobDetails from "./candidate-jobs";
import { getRecruiterJob } from "@/api/jobs/recruiter";
import { getCandidateJob } from "@/api/jobs/candidate";
import RecruiterJobDetails from "./recruiter-jobs";

export default async function JobsDetailsWrapper({ jobId }: { jobId: string }) {
  if (!jobId) {
    notFound();
  }

  const cookieStore = await cookies();
  const role = cookieStore.get("user_role")?.value;
  const token = cookieStore.get("token")?.value;

  let jobData = null;

  try {
    if (role === "RECRUITER") {
      const data = await getRecruiterJob({ jobId, token });
      if (data.success && data.data) {
        jobData = { type: "recruiter", data: data.data };
      }
    } else if (role === "CANDIDATE") {
      // For candidate, token might be required
      if (!token) {
        console.error("Token is required for candidate job details");
        notFound();
      }
      const data = await getCandidateJob({ jobId, token });
      if (data.success && data.data) {
        jobData = { type: "candidate", data: data.data };
      }
    }
  } catch (error) {
    const axiosError = error as {
      response?: { data?: unknown; status?: number };
      message?: string;
    };
    console.error("Error fetching job details:", {
      jobId,
      role,
      hasToken: !!token,
      error: axiosError.response?.data || axiosError.message,
      status: axiosError.response?.status,
    });
    notFound();
  }

  if (!jobData) {
    notFound();
  }

  if (jobData.type === "recruiter") {
    return <RecruiterJobDetails job={jobData.data} />;
  }

  return <CandidateJobDetails job={jobData.data} />;
}
