"use client";
import { getCookie } from "cookies-next/client";
import RecruiterJobs from "./recruiter-jobs/listing/recruiter-jobs";
import CandidateJobs from "./candidate-jobs/listing/candidate-jobs";

export default function JobsWrapper() {
  const role = getCookie("user_role");

  if (role === "RECRUITER") return <RecruiterJobs />;

  if (role === "CANDIDATE") return <CandidateJobs />;
}
