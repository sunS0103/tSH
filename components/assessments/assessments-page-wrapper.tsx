"use client";

import { getCookie } from "cookies-next/client";
import AssessmentCandidate from "./assessments-cadidate";
import AssessmentRecruiter from "./assessment-recruiter";

export default function AssessmentsPageWrapper() {
  const role = getCookie("user_role");

  if (role === "CANDIDATE") {
    return <AssessmentCandidate />;
  }

  if (role === "RECRUITER") {
    return <AssessmentRecruiter />;
  }
}
