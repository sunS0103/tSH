"use client";

import { getCookie } from "cookies-next/client";
import RecruiterDashboard from "./recruiter-dashboard";
import CandidateDashboard from "./candidate-dashboard";
import { Loader } from "../ui/loader";

export default function DashboardWrapper() {
  const role = getCookie("user_role");

  if (role === "RECRUITER") {
    return <RecruiterDashboard />;
  }

  if (role === "CANDIDATE") {
    return <CandidateDashboard />;
  }

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader/>
    </div>
  );
}
