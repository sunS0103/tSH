"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import CustomFormSheet from "./custom-form-sheet";
import AdditionalDetailsDialog from "./additional-details-dialog";
import { changeRecruiterJobApplicantsByStatus } from "@/api/jobs/recruiter";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";
import { getScoreInterpretation } from "@/lib/utils";
import TalentScoreSheet from "@/components/talent-pool/talent-score-sheet";

export interface ApplicantCardProps {
  jobId: string;
  user_id: string;
  id?: string;
  application_id?: string;
  application_status?: string;
  first_name?: string | null;
  last_name?: string | null;
  score?: number;
  skills?: {
    id: string;
    name: string;
  }[];
  email?: string | null;
  country_code?: string | null;
  mobile_number?: string | null;
  experience?: string;
  current_company?: string;
  time_in_current_company?: string;
  location?: string;
  current_ctc?: string;
  // customFields?: CustomField[];
  isCustomFieldsPending?: boolean | null;
  additionalDetailsStatus?: "NOT_REQUESTED" | "REQUESTED" | "SUBMITTED";
  onDownload?: () => void;
  onAdditionalDetails?: () => void;
  onViewCustomForm?: () => void;
  notice_period?: string;
  is_invited?: boolean;
  // onThumbUp?: () => void;
  // onHandshake?: () => void;
  // onThumbDown?: () => void;
}

export default function ApplicantCard({
  jobId,
  user_id,
  first_name,
  last_name,
  score,
  skills = [],
  email,
  country_code,
  mobile_number,
  experience,
  current_company,
  location,
  current_ctc,
  // customFields,
  application_id,
  application_status,
  isCustomFieldsPending = false,
  additionalDetailsStatus,
  onDownload,
  onAdditionalDetails,
  onViewCustomForm,
  notice_period,
  is_invited,
}: ApplicantCardProps) {
  const [isCustomFormOpen, setIsCustomFormOpen] = useState(false);
  const [isAdditionalDetailsOpen, setIsAdditionalDetailsOpen] = useState(false);
  const [isHandshakeOpen, setIsHandshakeOpen] = useState(false);

  const router = useRouter();

  // Display first 3 skills, show +N for remaining
  const displayedSkills = skills.slice(0, 3);
  const remainingSkillsCount = skills.length - 3;

  const handleViewCustomForm = () => {
    setIsCustomFormOpen(true);
    onViewCustomForm?.();
  };

  const handleAdditionalDetails = () => {
    setIsAdditionalDetailsOpen(true);
    onAdditionalDetails?.();
  };

  const applicantName = `${first_name || ""} ${last_name || ""}`.trim();

  const onThumbDown = async () => {
    await changeRecruiterJobApplicantsByStatus({
      applicationId: application_id || "",
      status: "THUMBS_DOWN",
    })
      .then((response) => {
        if (response.success) {
          toast.success(
            response.message || "Applicant thumbs down successfully"
          );
        }
        window.location.reload();
      })
      .catch((error) => {
        toast.error(
          error.response.data.message || "Failed to thumbs down applicant"
        );
      });
  };

  const onThumbUp = async () => {
    await changeRecruiterJobApplicantsByStatus({
      applicationId: application_id || "",
      status: "THUMBS_UP",
    })
      .then((response) => {
        if (response.success) {
          toast.success(
            response.message || "Applicant thumbs down successfully"
          );
          window.location.reload();
        }
      })
      .catch((error) => {
        toast.error(
          error.response.data.message || "Failed to thumbs down applicant"
        );
      });
  };

  const handleHandshake = async () => {
    setIsHandshakeOpen(true);
  };

  const onHandshake = async () => {
    await changeRecruiterJobApplicantsByStatus({
      applicationId: application_id || "",
      status: "HANDSHAKE",
    })
      .then((response) => {
        if (response.success) {
          toast.success(response.message || "Applicant handshake successfully");
        }
        window.location.reload();
      })
      .catch((error) => {
        toast.error(
          error.response.data.message || "Failed to handshake applicant"
        );
      });
  };

  return (
    <>
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
              <span className="text-xl font-bold text-gray-900">
                {last_name}
              </span>
            )}
            {is_invited && (
              <span className="text-xs text-lime-600">
                - Invited by recruiter
              </span>
            )}
          </div>

          {/* Desktop: Show all buttons (>= 768px) */}
          <div className="hidden md:flex items-center gap-2">
            {application_status === "THUMBS_UP" && (
              <Icon
                icon="material-symbols:thumb-up-outline"
                className="w-5 h-5 text-primary-500"
              />
            )}
            {application_status === "HANDSHAKE" && (
              <Icon
                icon="material-symbols:handshake-outline"
                className="w-5 h-5 text-primary-500"
              />
            )}

            {!(
              additionalDetailsStatus === "NOT_REQUESTED" &&
              application_status === "HANDSHAKE"
            ) && (
              <Button
                type="button"
                variant="secondary"
                onClick={handleAdditionalDetails}
                disabled={additionalDetailsStatus === "REQUESTED"}
              >
                {additionalDetailsStatus === "REQUESTED"
                  ? "Pending Additional Details"
                  : additionalDetailsStatus === "SUBMITTED"
                  ? "View Additional Details"
                  : "Additional Details"}
              </Button>
            )}

            <Button
              type="button"
              variant="secondary"
              onClick={handleViewCustomForm}
            >
              View Custom Form
            </Button>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            {application_status === "THUMBS_UP" && (
              <Icon
                icon="material-symbols:thumb-up-outline"
                className="w-4 h-4 text-primary-500"
              />
            )}
            {application_status === "HANDSHAKE" && (
              <Icon
                icon="material-symbols:handshake-outline"
                className="w-4 h-4 text-primary-500"
              />
            )}
            {/* Mobile: Show three dots menu (< 768px) */}
            {/* <div className="md:hidden"> */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="More options">
                  <Icon
                    icon="material-symbols:more-vert"
                    className="w-5 h-5 text-gray-900"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {/* <DropdownMenuItem
                  onClick={onDownload}
                  className="cursor-pointer"
                >
                  <Icon
                    icon="material-symbols:download-rounded"
                    className="w-4 h-4 mr-2 text-gray-700"
                  />
                  Download
                </DropdownMenuItem> */}

                {/* {additionalDetailsStatus === "REQUESTED"
                    ? "Pending Additional Details"
                    : additionalDetailsStatus === "SUBMITTED"
                    ? "View Additional Details"
                    : "Additional Details"} */}

                {!(
                  additionalDetailsStatus === "NOT_REQUESTED" &&
                  application_status === "HANDSHAKE"
                ) && (
                  <DropdownMenuItem
                    onClick={handleAdditionalDetails}
                    className="cursor-pointer"
                  >
                    <Icon
                      icon="material-symbols:info-outline-rounded"
                      className="w-4 h-4 mr-2 text-gray-700"
                    />
                    {additionalDetailsStatus === "REQUESTED"
                      ? "Pending Additional Details"
                      : additionalDetailsStatus === "SUBMITTED"
                      ? "View Additional Details"
                      : "Additional Details"}
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={handleViewCustomForm}
                  className="cursor-pointer"
                >
                  <Icon
                    icon="material-symbols:description-outline-rounded"
                    className="w-4 h-4 mr-2 text-gray-700"
                  />
                  View Custom Form
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {/* </div> */}
          </div>
        </div>

        <CustomFormSheet
          jobId={jobId}
          userId={user_id}
          open={isCustomFormOpen}
          onOpenChange={setIsCustomFormOpen}
          applicantName={applicantName}
          applicantData={{
            first_name,
            last_name,
            email,
            country_code,
            mobile_number,
            location,
            current_ctc,
            experience,
            current_company,
            notice_period,
            total_score: score !== undefined ? `${score}%` : undefined,
            application_id: application_id,
            application_status: application_status,
          }}
          isCustomFieldsPending={isCustomFieldsPending}
          onThumbUp={onThumbUp}
          onHandshake={handleHandshake}
          onThumbDown={onThumbDown}
        />

        <AdditionalDetailsDialog
          jobId={jobId}
          open={isAdditionalDetailsOpen}
          onOpenChange={setIsAdditionalDetailsOpen}
          additionalDetailsStatus={additionalDetailsStatus}
          application_status={application_status}
          onSend={() => {
            // Handle send action
          }}
          userId={user_id}
          onThumbUp={onThumbUp}
          onHandshake={handleHandshake}
          onThumbDown={onThumbDown}
        />

        {/* Main Content: Three Columns */}
        <div className="flex flex-col md:flex-row gap-8 px-4">
          {/* Left Column: Score + Skills */}
          <div className="flex flex-col gap-3 md:w-3/10">
            {/* Total Score */}
            <div className="flex flex-col gap-2">
              <TalentScoreSheet assessments={[]}>
                <p className="text-xs font-medium text-gray-900 underline">
                  Total Score
                </p>
              </TalentScoreSheet>

              <div className="flex items-center gap-2">
                <p className="text-lg font-semibold text-primary-500">
                  {score !== undefined ? `${score}%` : "-"}
                </p>
                <span className="text-gray-600 text-sm font-medium font-sans">
                  - {getScoreInterpretation(score || 0)}
                </span>
              </div>
            </div>

            {/* Skill Assessed */}
            <div className="flex flex-col gap-2">
              <p className="text-xs font-medium text-gray-900">
                Skill Assessed
              </p>
              {skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {displayedSkills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="border-gray-700 text-black text-xs font-normal px-2 py-1 rounded-full"
                    >
                      {skill.name}
                    </Badge>
                  ))}
                  {remainingSkillsCount > 0 && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge
                          variant="outline"
                          className="border-gray-700 text-black text-xs font-normal px-2 py-1 rounded-full cursor-pointer"
                        >
                          +{remainingSkillsCount}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent className="bg-white text-black border-gray-200">
                        <ul className="list-disc list-inside">
                          {skills.slice(3).map((skill) => (
                            <li key={skill.id}>{skill.name}</li>
                          ))}
                        </ul>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              ) : (
                "-"
              )}
            </div>
          </div>

          {/* Middle Column: Contact + Professional Details */}
          <div className="flex flex-col sm:justify-between md:justify-evenly sm:flex-row gap-6 md:w-6/10">
            {/* Left side: Contact Info */}
            <div className="flex flex-col gap-4 w-60">
              <div className="flex items-center gap-2">
                <Icon
                  icon="material-symbols:mail-outline-rounded"
                  className="w-4 h-4 text-gray-900 shrink-0"
                />
                {email ? (
                  <span className="text-base font-normal text-gray-900">
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
                {mobile_number ? (
                  <span className="text-base font-normal text-gray-900">
                    {country_code} {mobile_number}
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
                <span className="text-base font-normal text-gray-900">
                  {current_company ?? "-"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Icon
                  icon="material-symbols:timer-outline-rounded"
                  className="w-4 h-4 text-gray-900 shrink-0"
                />
                <span className="text-base font-normal text-gray-900">
                  {notice_period ?? "-"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Icon
                  icon="material-symbols:location-on-outline-rounded"
                  className="w-4 h-4 text-gray-900 shrink-0"
                />
                <span className="text-base font-normal text-gray-900">
                  {location ?? "-"}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Current CTC */}
          <div className="flex flex-col gap-1 flex-1 md:w-1/10">
            <p className="text-xs font-medium text-gray-900 whitespace-nowrap">
              Current CTC
            </p>
            <p className="text-sm font-normal text-gray-900">
              {current_ctc || "-"}
            </p>
          </div>
        </div>
      </div>
      <Dialog open={isHandshakeOpen} onOpenChange={setIsHandshakeOpen}>
        <DialogContent className="max-w-96! text-center p-4">
          <DialogHeader className="text-center">
            <DialogTitle>Confirm Handshake</DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-xs text-gray-700">
            By proceeding, the candidate&apos;s contact details will be revealed
            and 1 credit will be used.
            <br />
            This action confirms mutual interest and cannot be undone.
          </DialogDescription>
          <div className="grid grid-cols-2 gap-2 w-full">
            <DialogClose asChild>
              <Button
                variant="secondary"
                onClick={() => setIsHandshakeOpen(false)}
                className="w-full"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              className="w-full"
              onClick={() => {
                onHandshake();
                setIsHandshakeOpen(false);
                router.refresh();
              }}
            >
              Proceed
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
