"use client";

import { getCookie } from "cookies-next/client";
import RecruiterJobs from "./recruiter-jobs/listing/recruiter-jobs";
import CandidateJobs from "./candidate-jobs/listing/candidate-jobs";
import { useEffect, useState } from "react";
import JobFair from "./job-fair";
import { getJobFairStatus } from "@/api/jobs/job-fair";

export default function JobsWrapper() {
  const [jobFairStatus, setJobFairStatus] = useState<boolean>(true);

  useEffect(() => {
    const fetchJobFairStatus = async () => {
      const res = await getJobFairStatus();
      setJobFairStatus(res.data?.job_fair_plan_status || false);
    };
    fetchJobFairStatus();
  }, []);

  const role = getCookie("user_role");

  if (jobFairStatus) return <JobFair />;

  if (role === "RECRUITER") return <RecruiterJobs />;

  if (role === "CANDIDATE") return <CandidateJobs />;
}
