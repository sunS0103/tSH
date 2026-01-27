"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import RequestedAssessmentDetailsDialog from "./requested-assessment-details-dialog";

interface RequestedAssessmentCardProps {
  id: string;
  assessmentName: string;
  name: string;
  companyEmail: string;
  skillsToAssess: string;
  phoneNumber: string;
  assessmentCreationPreference: string;
  jobDescription?: string;
  customInstructions?: string;
  className?: string;
}

export default function AssessmentRecruiterRequestedCard({
  assessmentName,
  name,
  companyEmail,
  skillsToAssess,
  phoneNumber,
  assessmentCreationPreference,
  jobDescription,
  customInstructions,
  className,
}: RequestedAssessmentCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setIsDialogOpen(true)}
        className={cn(
          "bg-white border border-gray-200 flex flex-col items-start overflow-hidden rounded-2xl w-full min-h-60 cursor-pointer hover:shadow-lg transition-shadow",
          className,
        )}
      >
        {/* Header with Assessment Name */}
        <div className="bg-primary-50 flex flex-col items-start p-3 w-full">
          <h3 className="font-semibold leading-normal text-primary-500 text-lg text-center">
            {assessmentName}
          </h3>
        </div>

        {/* Details Section */}
        <div className="flex flex-col gap-3 items-start p-3 w-full">
          {/* Row 1: Name and Company Email */}
          <div className="flex items-center relative shrink-0 w-full">
            <div className="flex flex-col gap-1 items-start relative shrink-0 w-1/2 pr-2">
              <p className="text-gray-900 text-xs font-medium text-center">
                Name
              </p>
              <p className="text-black text-xs font-normal w-full">{name}</p>
            </div>
            <div className="flex flex-col gap-1 items-start relative shrink-0 w-1/2 pl-2">
              <p className="text-gray-900 text-xs font-normal text-center">
                Company Email
              </p>
              <p className="text-black text-xs font-normal w-full">
                {companyEmail}
              </p>
            </div>
          </div>

          {/* Row 2: Skills to Assess and Phone Number */}
          <div className="flex items-start relative shrink-0 w-full">
            <div className="flex flex-col gap-1 items-start relative shrink-0 w-1/2 pr-2">
              <p className="text-gray-900 text-xs font-normal text-center">
                Skills to Assess
              </p>
              <p className="text-black text-xs font-normal w-full">
                {skillsToAssess}
              </p>
            </div>
            <div className="flex flex-col gap-1 items-start relative shrink-0 w-1/2 pl-2">
              <p className="text-gray-900 text-xs font-normal text-center">
                Phone Number
              </p>
              <p className="text-black text-xs font-normal w-full">
                {phoneNumber}
              </p>
            </div>
          </div>

          {/* Row 3: Assessment Creation Preference */}
          <div className="flex items-start relative shrink-0 w-full">
            <div className="flex flex-col gap-1 items-start relative shrink-0 w-full pr-2">
              <p className="text-gray-900 text-xs font-normal text-center">
                Assessment Creation Preference
              </p>
              <p className="text-black text-xs font-normal w-full">
                {assessmentCreationPreference}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Details Dialog */}
      <RequestedAssessmentDetailsDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        assessmentName={assessmentName}
        name={name}
        companyEmail={companyEmail}
        skillsToAssess={skillsToAssess}
        phoneNumber={phoneNumber}
        assessmentCreationPreference={assessmentCreationPreference}
        jobDescription={jobDescription}
        customInstructions={customInstructions}
      />
    </>
  );
}
