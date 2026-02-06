"use client";

import { getCookie } from "cookies-next/client";
import RecruiterJobs from "./recruiter-jobs/listing/recruiter-jobs";
import CandidateJobs from "./candidate-jobs/listing/candidate-jobs";
import { useEffect, useState } from "react";
import JobFair from "./job-fair";
import { getJobFairStatus } from "@/api/jobs/job-fair";

const BetaBanner = () => (
  <div className="max-w-7xl mx-auto px-4 md:px-6 pt-4 mb-6">
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
      <p className="text-amber-800 font-bold text-base text-center">
        🚧 This feature unlocks in March
      </p>
      <p className="text-amber-700 text-sm text-center mt-1">
        We're rolling out features in phases. Stay tuned for the full Jobs experience coming soon.
      </p>
    </div>
  </div>
);

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

  if (jobFairStatus && role === "CANDIDATE") return <JobFair />;

  if (role === "RECRUITER") return (
    <>
      <BetaBanner />
      <RecruiterJobs />
    </>
  );

  if (role === "CANDIDATE") return (
    <>
      <BetaBanner />
      <CandidateJobs />
    </>
  );
}
