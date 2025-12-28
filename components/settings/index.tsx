"use client";

import { getCookie } from "cookies-next/client";
import CandidateSettings from "./candidate-settings";
import RecruiterSettings from "./recruiter-settings";

export default function Settings() {
  const role = getCookie("user_role");
  if (role === "CANDIDATE") {
    return <CandidateSettings />;
  }
  if (role === "RECRUITER") {
    return <RecruiterSettings />;
  }
}
