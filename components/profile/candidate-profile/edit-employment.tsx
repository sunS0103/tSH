"use client";

import React from "react";
import { getCookie } from "cookies-next/client";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import EmployedForm from "./edit-employment/employed-form";
import StudentFresherForm from "./edit-employment/student-fresher-form";
import BetweenJobsForm from "./edit-employment/between-jobs-form";

const employmentStatusOptions = [
  { label: "Employed", value: "Employed" },
  { label: "Student", value: "Student" },
  { label: "Fresher", value: "Fresher" },
  { label: "Between Jobs", value: "Between Jobs" },
];

export default function EditEmployment({
  currentEmploymentData,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  currentEmploymentData: any;
}) {
  const router = useRouter();
  const employmentData = currentEmploymentData;

  const [employmentStatus, setEmploymentStatus] = React.useState<
    "Employed" | "Student" | "Fresher" | "Between Jobs"
  >(employmentData?.employment_status || "Employed");

  const handleCancel = () => {
    // Check if user is in onboarding flow or editing from profile
    const isOnboarding = window.location.pathname.includes("/profile-details/");
    router.push(
      isOnboarding ? "/profile-details/edit-personal-social" : "/profile",
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl w-full mt-4 overflow-hidden">
      {/* Header */}
      <div className="bg-primary-50 py-4 px-6">
        <h1 className="text-xl font-bold text-black">
          Edit Current Employment Details
        </h1>
      </div>

      {/* Form */}
      <div className="p-6">
        {/* Employment Status Selector */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="w-full md:w-1/2">
            <Label className="text-sm font-medium text-black">
              Current Status <span className="text-destructive">*</span>
            </Label>
            <Select
              onValueChange={(value) =>
                setEmploymentStatus(
                  value as "Employed" | "Student" | "Fresher" | "Between Jobs",
                )
              }
              value={employmentStatus}
            >
              <SelectTrigger className="h-8 border-gray-900 w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {employmentStatusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Render appropriate form based on status */}
        {employmentStatus === "Employed" && (
          <EmployedForm
            defaultValues={
              employmentData?.employment_status === "Employed"
                ? {
                    company_name: employmentData?.company_name,
                    designation: employmentData?.designation,
                    total_years_of_experience:
                      employmentData?.total_years_of_experience,
                    current_ctc_amount: employmentData?.current_ctc_amount,
                    current_ctc_period_type:
                      employmentData?.current_ctc_period_type,
                    current_ctc_currency: employmentData?.current_ctc_currency,
                    expected_ctc_currency:
                      employmentData?.expected_ctc_currency,
                    expected_ctc_amount: employmentData?.expected_ctc_amount,
                    expected_ctc_period: employmentData?.expected_ctc_period,
                    notice_period_type: employmentData?.notice_period_type,
                    is_serving_notice: employmentData?.is_serving_notice,
                    ...(employmentData?.is_serving_notice && {
                      last_working_day: employmentData?.last_working_day,
                    }),
                  }
                : undefined
            }
            onCancel={handleCancel}
          />
        )}

        {employmentStatus === "Student" && (
          <StudentFresherForm
            defaultValues={{
              employment_status: "Student",
              looking_for_internship:
                employmentData?.looking_for_internship || false,
              looking_for_full_time:
                employmentData?.looking_for_full_time || false,
              looking_for_part_time:
                employmentData?.looking_for_part_time || false,
              looking_for_remote: employmentData?.looking_for_remote || false,
            }}
            onCancel={handleCancel}
          />
        )}

        {employmentStatus === "Fresher" && (
          <StudentFresherForm
            defaultValues={{
              employment_status: "Fresher",
              looking_for_internship:
                employmentData?.looking_for_internship || false,
              looking_for_full_time:
                employmentData?.looking_for_full_time || false,
              looking_for_part_time:
                employmentData?.looking_for_part_time || false,
              looking_for_remote: employmentData?.looking_for_remote || false,
            }}
            onCancel={handleCancel}
          />
        )}

        {employmentStatus === "Between Jobs" && (
          <BetweenJobsForm
            defaultValues={
              employmentData?.employment_status === "Between Jobs"
                ? {
                    total_years_of_experience:
                      employmentData?.total_years_of_experience,
                    duration_months: employmentData?.duration_months,
                    last_drawn_ctc_amount:
                      employmentData?.last_drawn_ctc_amount,
                    // duration_description: employmentData?.duration_description,
                    reason: employmentData?.reason,
                    duration_years: employmentData?.duration_years,
                    upskilling_activities:
                      employmentData?.upskilling_activities,
                  }
                : undefined
            }
            onCancel={handleCancel}
          />
        )}
      </div>
    </div>
  );
}
