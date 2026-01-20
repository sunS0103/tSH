"use client";

import { Icon } from "@iconify/react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface RequestedAssessmentDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assessmentName: string;
  name: string;
  companyEmail: string;
  skillsToAssess: string;
  phoneNumber: string;
  assessmentCreationPreference: string;
  jobDescription?: string;
  customInstructions?: string;
}

export default function RequestedAssessmentDetailsDialog({
  open,
  onOpenChange,
  assessmentName,
  name,
  companyEmail,
  skillsToAssess,
  phoneNumber,
  assessmentCreationPreference,
  jobDescription,
  customInstructions,
}: RequestedAssessmentDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="p-0 gap-0 rounded-2xl border-gray-200 max-w-200!"
        showCloseButton={false}
      >
        {/* Header with Title and Close Button */}
        <div className="border-b border-gray-200 flex items-center justify-between px-6 py-4">
          <DialogTitle className="font-semibold leading-normal text-black text-lg m-0">
            {assessmentName}
          </DialogTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="flex items-center justify-center size-4.5 hover:opacity-70 transition-opacity"
            aria-label="Close dialog"
          >
            <Icon icon="mdi:close" className="size-4.5 text-black" />
          </button>
        </div>

        {/* Details Section */}
        <div className="flex flex-col gap-3 items-start px-6 py-6">
          {/* Row 1: Name and Company Email */}
          <div className="flex gap-2 items-center relative shrink-0 w-full">
            <div className="basis-0 flex flex-col gap-1 grow items-start relative shrink-0">
              <p className="text-gray-900 text-xs font-normal text-center">
                Name
              </p>
              <p className="font-medium leading-normal text-black text-base text-center">
                {name}
              </p>
            </div>
            <div className="basis-0 flex flex-col gap-1 grow items-start relative shrink-0">
              <p className="text-gray-900 text-xs font-normal text-center">
                Company Email
              </p>
              <p className="font-medium leading-normal text-black text-base text-center">
                {companyEmail}
              </p>
            </div>
          </div>

          {/* Row 2: Skills to Assess and Phone Number */}
          <div className="flex gap-2 items-start relative shrink-0 w-full">
            <div className="basis-0 flex flex-col gap-1 grow items-start relative shrink-0">
              <p className="text-gray-900 text-xs font-normal text-center">
                Skills to Assess
              </p>
              <p className="font-medium leading-normal text-black text-base w-full">
                {skillsToAssess}
              </p>
            </div>
            <div className="basis-0 flex flex-col gap-1 grow items-start relative shrink-0">
              <p className="text-gray-900 text-xs font-normal text-center">
                Phone Number
              </p>
              <p className="font-medium leading-normal text-black text-base text-center">
                {phoneNumber}
              </p>
            </div>
          </div>

          {/* Row 3: Assessment Creation Preference */}
          <div className="flex gap-2 items-center relative shrink-0 w-full">
            <div className="basis-0 flex flex-col gap-1 grow items-start relative shrink-0">
              <p className="text-gray-900 text-xs font-normal text-center">
                Assessment Creation Preference
              </p>
              <p className="font-medium leading-normal text-black text-base text-center">
                {assessmentCreationPreference === "Recruiter Create" && "Recruiter will create their own questions" || assessmentCreationPreference === "Collaborate" && "Collaborate with TechSmartHire for creation" || "-"}
              </p>
            </div>
          </div>

          {/* Row 4: Job Description */}
          {jobDescription && (
            <div className="flex gap-2 items-center relative shrink-0 w-full">
              <div className="basis-0 flex flex-col gap-1 grow items-start relative shrink-0">
                <p className="text-gray-900 text-xs font-normal text-center">
                  Job Description
                </p>
                <p className="font-medium leading-normal text-black text-base w-full">
                  {jobDescription}
                </p>
              </div>
            </div>
          )}

          {/* Row 5: Custom Instructions */}
          {customInstructions && (
            <div className="flex gap-2 items-center relative shrink-0 w-full">
              <div className="basis-0 flex flex-col gap-1 grow items-start relative shrink-0">
                <p className="text-gray-900 text-xs font-normal text-center">
                  Custom Instructions
                </p>
                <p className="font-medium leading-normal text-black text-base w-full">
                  {customInstructions}
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
