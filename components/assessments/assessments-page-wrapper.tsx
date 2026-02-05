"use client";

import { getCookie } from "cookies-next/client";
import { useState, useEffect } from "react";
import AssessmentCandidate from "./assessments-cadidate";
import AssessmentRecruiter from "./assessment-recruiter";

export default function AssessmentsPageWrapper() {
  const [role, setRole] = useState<string | undefined>(undefined);
  const [mounted, setMounted] = useState(false);

  // Initialize role on client side only to prevent hydration mismatch
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const userRole = getCookie("user_role");
    setRole(userRole as string | undefined);
  }, []);

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  if (role === "CANDIDATE") {
    return <AssessmentCandidate />;
  }

  if (role === "RECRUITER") {
    return <AssessmentRecruiter />;
  }

  // Default fallback (shouldn't happen in normal flow)
  return null;
}
