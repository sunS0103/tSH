"use client";

import { getCookie } from "cookies-next/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import RequestAssessmentForm from "@/components/assessments/request-assessment-form";

export default function RequestAssessmentPage() {
  const router = useRouter();
  const role = getCookie("user_role");

  useEffect(() => {
    if (role !== "RECRUITER") {
      router.push("/jobs");
    }
  }, [role, router]);

  if (role !== "RECRUITER") {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-50 flex items-center justify-center p-6 overflow-auto z-50">
      <div className="bg-white rounded-2xl w-full max-w-[700px] shadow-sm my-auto">
        <div className="bg-primary-50 px-6 py-4 rounded-t-2xl">
          <h1 className="text-xl font-bold text-gray-950">
            Request Assessment
          </h1>
        </div>
        <div className="px-6 py-4">
          <RequestAssessmentForm />
        </div>
      </div>
    </div>
  );
}

