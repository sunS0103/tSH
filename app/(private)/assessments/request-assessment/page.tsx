"use client";

import { getCookie } from "cookies-next/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import RequestAssessmentForm from "@/components/assessments/request-assessment-form";
import Breadcrumbs from "@/components/common/breadcrumbs";

export default function RequestedAssessmentPage() {
  const router = useRouter();
  const role = getCookie("user_role");

  useEffect(() => {
    if (role !== "RECRUITER") {
      router.push("/assessments");
    }
  }, [role, router]);

  if (role !== "RECRUITER") {
    return null;
  }

  const routes = [{ label: "Assessments", href: "/assessments" }];

  return (
    <div className="">
      <Breadcrumbs
        routes={routes}
        currentRoute={{
          label: "Request Assessment",
        }}
      />
      <div className="flex flex-col h-full max-w-2xl mx-auto mt-6">
        <div className="bg-primary-50 flex flex-col items-start px-6 py-4 rounded-tl-2xl rounded-tr-2xl">
          <h1 className="font-bold leading-normal text-black text-xl">
            Request Assessment
          </h1>
        </div>

        <div className="bg-white border border-gray-200 rounded-bl-2xl rounded-br-2xl flex-1 overflow-hidden">
          <RequestAssessmentForm />
        </div>
      </div>
    </div>
  );
}
