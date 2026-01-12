"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import CustomFormSheet from "./custom-form-sheet";
import AdditionalDetailsDialog from "./additional-details-dialog";
import { CustomField } from "@/types/job";

export interface ApplicantCardProps {
  jobId: string;
  user_id: string;
  id?: string;
  application_id?: string;
  first_name?: string | null;
  last_name?: string | null;
  score?: number;
  skills?: string[];
  email?: string | null;
  phone?: string | null;
  experience?: string;
  current_company?: string;
  time_in_current_company?: string;
  location?: string;
  current_ctc?: string;
  customFields?: CustomField[];
  onDownload?: () => void;
  onAdditionalDetails?: () => void;
  onViewCustomForm?: () => void;
  onThumbUp?: () => void;
  onHandshake?: () => void;
  onThumbDown?: () => void;
}

export default function ApplicantCard({
  jobId,
  user_id,
  first_name = "",
  last_name = "",
  score,
  skills = [],
  email,
  phone,
  experience,
  current_company,
  time_in_current_company,
  location,
  current_ctc,
  customFields = [],
  onDownload,
  onAdditionalDetails,
  onViewCustomForm,
  onThumbUp,
  onHandshake,
  onThumbDown,
}: ApplicantCardProps) {
  const [isCustomFormOpen, setIsCustomFormOpen] = useState(false);
  const [isAdditionalDetailsOpen, setIsAdditionalDetailsOpen] = useState(false);

  // Display first 10 skills, show +N for remaining
  const displayedSkills = skills.slice(0, 10);
  const remainingSkillsCount = skills.length - 10;

  const handleViewCustomForm = () => {
    setIsCustomFormOpen(true);
    onViewCustomForm?.();
  };

  const handleAdditionalDetails = () => {
    setIsAdditionalDetailsOpen(true);
    onAdditionalDetails?.();
  };

  const applicantName = `${first_name || ""} ${last_name || ""}`.trim();

  return (
    <div className="bg-white border border-gray-200 rounded-2xl flex flex-col gap-3 pb-4">
      {/* Header: Name + Action Buttons */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-1">
          <span className="text-xl font-bold text-gray-900 flex items-center">
            {first_name ? (
              first_name
            ) : (
              <span className="w-20 h-7 bg-gray-200 rounded" />
            )}
          </span>

          {last_name && (
            <span className="text-xl font-bold text-gray-900">{last_name}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="icon"
            onClick={onDownload}
            aria-label="Download"
            className="group"
          >
            <Icon
              icon="material-symbols:download-rounded"
              className="w-4 h-4 text-primary-500 group-hover:text-white"
            />
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleAdditionalDetails}
          >
            Additional Details
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleViewCustomForm}
          >
            View Custom Form
          </Button>
        </div>
      </div>

      <CustomFormSheet
        open={isCustomFormOpen}
        onOpenChange={setIsCustomFormOpen}
        applicantName={applicantName}
        applicantData={{
          first_name,
          last_name,
          email,
          phone,
          location,
          current_ctc,
          experience,
          current_company,
          notice_period: time_in_current_company,
          total_score: score !== undefined ? `${score}%` : undefined,
        }}
        customFields={customFields}
        onThumbUp={onThumbUp}
        onHandshake={onHandshake}
        onThumbDown={onThumbDown}
      />

      <AdditionalDetailsDialog
        jobId={jobId}
        open={isAdditionalDetailsOpen}
        onOpenChange={setIsAdditionalDetailsOpen}
        onSend={() => {
          // Handle send action
          //   console.log("Additional details fields:", fields);
        }}
        userId={user_id}
      />

      {/* Main Content: Three Columns */}
      <div className="flex flex-col md:flex-row gap-8 px-4">
        {/* Left Column: Score + Skills */}
        <div className="flex flex-col gap-3 md:w-2/5">
          {/* Total Score */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-gray-900 underline">
              Total Score
            </p>
            <p className="text-lg font-semibold text-primary-500">
              {score !== undefined ? `${score}%` : "-"}
            </p>
          </div>

          {/* Skill Assessed */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-gray-900">Skill Assessed</p>
            <div className="flex flex-wrap gap-2">
              {displayedSkills.map((skill, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="border-gray-700 text-black text-xs font-normal px-2 py-1 rounded-full"
                >
                  {skill}
                </Badge>
              ))}
              {remainingSkillsCount > 0 && (
                <Badge
                  variant="outline"
                  className="border-gray-700 text-black text-xs font-normal px-2 py-1 rounded-full"
                >
                  +{remainingSkillsCount}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Middle Column: Contact + Professional Details */}
        <div className="flex flex-col sm:flex-row gap-6 md:w-2/5">
          {/* Left side: Contact Info */}
          <div className="flex flex-col gap-4 w-60">
            <div className="flex items-center gap-2">
              <Icon
                icon="material-symbols:mail-outline-rounded"
                className="w-4 h-4 text-gray-900 shrink-0"
              />
              {email ? (
                <span className="text-base font-normal text-gray-900 truncate">
                  {email}
                </span>
              ) : (
                <span className="w-20 h-6 bg-gray-200 rounded" />
              )}
            </div>
            <div className="flex items-center gap-2">
              <Icon
                icon="material-symbols:call-outline-rounded"
                className="w-4 h-4 text-gray-900 shrink-0"
              />
              {phone ? (
                <span className="text-base font-normal text-gray-900 truncate">
                  {phone}
                </span>
              ) : (
                <span className="w-20 h-6 bg-gray-200 rounded" />
              )}
            </div>
          </div>

          {/* Right side: Professional Details */}
          <div className="flex flex-col gap-4 w-60">
            <div className="flex items-center gap-2">
              <Icon
                icon="material-symbols:badge-outline-rounded"
                className="w-4 h-4 text-gray-900 shrink-0"
              />
              <span className="text-base font-normal text-gray-900">
                {experience ?? "-"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Icon
                icon="material-symbols:corporate-fare-rounded"
                className="w-4 h-4 text-gray-900 shrink-0"
              />
              <span className="text-base font-normal text-gray-900 truncate">
                {current_company ?? "-"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Icon
                icon="material-symbols:timer-outline-rounded"
                className="w-4 h-4 text-gray-900 shrink-0"
              />
              <span className="text-base font-normal text-gray-900">
                {time_in_current_company ?? "-"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Icon
                icon="material-symbols:location-on-outline-rounded"
                className="w-4 h-4 text-gray-900 shrink-0"
              />
              <span className="text-base font-normal text-gray-900 truncate">
                {location ?? "-"}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Current CTC */}
        <div className="flex flex-col gap-1 flex-1 md:w-1/">
          <p className="text-xs font-medium text-gray-900 whitespace-nowrap">
            Current CTC
          </p>
          <p className="text-sm font-normal text-gray-900">
            {current_ctc || "-"}
          </p>
        </div>
      </div>
    </div>
  );
}
