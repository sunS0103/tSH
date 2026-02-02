import { cn, getScoreInterpretation } from "@/lib/utils";
import TalentScoreSheet from "./talent-score-sheet";
import TalentAboutModal from "./talent-about-modal";
import InviteDialog, { InviteMode } from "./invite-dialog";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { type AssessmentTaken } from "@/api/recruiter/talent-pool";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

export interface TalentCardProps {
  id: string;
  role: string;
  expertise: string;
  location_code: string; // e.g. D.C 8852
  totalScore: number;
  skillsAssessed: string[];
  experience: string | number | null; // e.g. 4-5 Years
  company: string;
  availability: string;
  location: string; // e.g. Mumbai, MH
  assessmentTaken: { title: string; slug: string }[];
  assessments?: AssessmentTaken[]; // Full assessment details for the score sheet
  about: string;
  isSelected?: boolean;
  onSelect?: (checked: boolean) => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export default function TalentCard({
  id,
  role,
  expertise,
  location_code,
  totalScore,
  skillsAssessed,
  experience,
  company,
  availability,
  location,
  assessmentTaken,
  assessments,
  about,
  isSelected,
  onSelect,
  isFavorite,
  onToggleFavorite,
}: TalentCardProps) {
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteMode, setInviteMode] = useState<InviteMode>("job");

  const onInviteToJob = () => {
    setInviteMode("job");
    setShowInviteDialog(true);
  };

  const onRequestAssessment = () => {
    setInviteMode("assessment");
    setShowInviteDialog(true);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl w-full flex flex-col items-start gap-3 pb-4">
      {/* Header */}
      <div className="w-full flex md:flex-row flex-col justify-between items-start md:items-center px-4 py-3 border-b border-gray-200 gap-4">
        <div className="flex justify-between items-start w-full md:w-auto">
          <div className="flex justify-start items-start gap-2">
            <div className="relative w-5 h-6 flex items-start justify-center py-1">
              <Checkbox
                checked={isSelected}
                onCheckedChange={onSelect}
                className="w-5 h-5 border-gray-600 rounded data-[state=checked]:bg-white data-[state=checked]:text-black data-[state=checked]:border-black"
              />
            </div>
            <div className="flex flex-col items-start gap-1">
              <h1
                className="text-black text-xl font-bold font-sans line-clamp-1"
                title={expertise}
              >
                {expertise}
              </h1>
              <p className="text-left text-gray-600 text-xs font-normal font-sans uppercase">
                ID: {id?.substring(0, 4)}
              </p>
            </div>
          </div>

          {/* Mobile Actions (Visible <= md) */}
          <div className="flex md:hidden justify-end items-center gap-2">
            <Button
              variant="outline"
              className="w-8 h-8 rounded-lg border border-primary-500 p-0 flex items-center justify-center hover:bg-primary-50 bg-white"
              onClick={onToggleFavorite}
            >
              <Icon
                icon={
                  isFavorite ? "mdi:cards-heart" : "mdi:cards-heart-outline"
                }
                className={cn(
                  "w-4.5 h-4.5",
                  isFavorite ? "text-primary-500" : "text-primary-500"
                )}
              />
            </Button>
            <Button
              variant="outline"
              className="w-8 h-8 rounded-lg border border-primary-500 p-0 flex items-center justify-center hover:bg-primary-50 bg-white"
              onClick={() => onInviteToJob()}
            >
              <Icon
                icon="majesticons:briefcase-line"
                className="w-4.5 h-4.5 text-primary-500"
              />
            </Button>
            <button
              className="text-primary-500 text-xs font-medium hover:underline transition-all"
              onClick={() => onRequestAssessment()}
            >
              Request Assessment
            </button>
          </div>
        </div>

        {/* Desktop Actions (Hidden on mobile) */}
        <div className="hidden md:flex justify-start items-center gap-3">
          <Button
            variant="outline"
            className="w-8 h-8 rounded-lg border border-primary-500 p-0 flex items-center justify-center hover:bg-primary-50 bg-white"
            onClick={onToggleFavorite}
          >
            <Icon
              icon={isFavorite ? "mdi:cards-heart" : "mdi:cards-heart-outline"}
              className={cn(
                "w-4.5 h-4.5",
                isFavorite ? "text-primary-500" : "text-primary-500"
              )}
            />
          </Button>

          <Button
            variant="outline"
            className="h-8 px-3 rounded-lg border border-primary-500 flex items-center justify-center gap-2 hover:bg-primary-50 bg-white"
            onClick={() => onInviteToJob()}
          >
            <Icon
              icon="majesticons:briefcase-line"
              className="w-4.5 h-4.5 text-primary-500"
            />
            <span className="text-center text-primary-500 text-sm font-normal font-sans">
              Invite to Job
            </span>
          </Button>

          <button
            className="text-primary-500 text-sm font-medium hover:underline transition-all"
            onClick={() => onRequestAssessment()}
          >
            Request Assessment
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="w-full px-4 flex flex-col xl:flex-row items-start gap-6 xl:gap-8">
        {/* Left Column: Score & Skills */}
        <div className="flex flex-col items-start gap-3 xl:max-w-xs w-full shrink-0">
          <div className="w-full flex flex-col items-start gap-2">
            <div className="flex flex-col items-start gap-2 ">
              <TalentScoreSheet assessments={assessments || []}>
                <span className="text-gray-900 text-xs font-medium underline font-sans cursor-pointer">
                  Total Score
                </span>
              </TalentScoreSheet>
              <div className="flex items-center gap-2">
                <span className="text-primary-500 text-lg font-semibold font-sans">
                  {totalScore}%
                </span>
                <span className="text-gray-600 text-sm font-medium font-sans">
                  - {getScoreInterpretation(totalScore)}
                </span>
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col items-start gap-2">
            <span className="text-gray-900 text-xs font-medium font-sans">
              Skill Assessed
            </span>
            <div className="flex w-full flex-wrap gap-2 content-center items-center">
              {skillsAssessed.slice(0, 3).map((skill, index) => (
                <div
                  key={index}
                  className="px-2 py-1 rounded-full border border-gray-600 flex justify-center items-center gap-2"
                >
                  <span className="text-center text-black text-xs font-medium font-sans capitalize">
                    {skill}
                  </span>
                </div>
              ))}
              {skillsAssessed.length > 3 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="px-2 py-1 rounded-full border border-gray-600 flex justify-center items-center gap-2 cursor-pointer hover:bg-gray-100 transition-colors">
                        <span className="text-center text-slate-700 text-xs font-medium font-sans capitalize">
                          +{skillsAssessed.length - 3}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-white border">
                      <div className="flex flex-col gap-1 p-1">
                        {skillsAssessed.slice(3).map((skill, index) => (
                          <span
                            key={index}
                            className="text-xs text-gray-700 capitalize"
                          >
                            • {skill}
                          </span>
                        ))}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
        </div>

        {/* Middle Column: Details (Responsive Grid on Mobile, Column on Desktop) */}
        <div className="w-full xl:w-52 grid grid-cols-2 xl:flex xl:flex-col xl:justify-center items-start gap-x-4 gap-y-4 shrink-0">
          {experience && (
            <div className="flex justify-start items-center gap-2">
              <Icon
                icon="mdi:card-account-details-outline"
                className="w-4.5 h-4.5 text-gray-900"
              />
              <span className="text-center text-gray-900 text-base font-normal font-sans">
                {experience} years
              </span>
            </div>
          )}
          {company && (
            <div className="flex justify-start items-center gap-2 min-w-0">
              <Icon
                icon="mdi:office-building-outline"
                className="w-4.5 h-4.5 text-gray-900 shrink-0"
              />
              <span className="text-gray-900 text-base font-normal font-sans truncate">
                {company}
              </span>
            </div>
          )}
          {availability && (
            <div className="flex justify-start items-center gap-2">
              <Icon
                icon="mdi:timer-outline"
                className="w-4.5 h-4.5 text-gray-900"
              />
              <span className="text-center text-gray-900 text-base font-normal font-sans">
                {availability}
              </span>
            </div>
          )}
          {location && (
            <div className="flex justify-start items-start gap-2">
              <Icon
                icon="mdi:map-marker-outline"
                className="w-4.5 h-4.5 text-gray-900 mt-0.5"
              />
              <span className="text-gray-900 text-base font-normal font-sans">
                {location}
              </span>
            </div>
          )}
        </div>

        {/* Right Column: Assessments & About */}
        <div className="flex-1 flex flex-col justify-start items-start gap-3 w-full min-w-0">
          <div className="flex flex-col justify-start items-start gap-2 w-full">
            <span className="text-gray-900 text-xs font-medium font-sans">
              Assessment Taken
            </span>
            <div className="flex justify-start items-center gap-2 flex-wrap">
              {assessments?.map((assessment, index) => (
                <Link
                  key={index}
                  href={`/assessment/${assessment.assessment_slug}`}
                  target="_blank"
                  className="h-6 px-3 py-1 rounded-full border border-primary-500 bg-primary-50 flex flex-col justify-center items-start gap-2.5 transition-colors cursor-pointer"
                >
                  <span
                    className="text-center text-xs italic font-medium font-sans text-primary-500 underline transition-colors max-w-52 truncate"
                    title={assessment.assessment_title}
                  >
                    {assessment.assessment_title}
                  </span>
                </Link>
              ))}
            </div>
          </div>
          <div className="w-full flex flex-col justify-start items-start gap-1">
            <span className="text-gray-900 text-xs font-medium font-sans">
              About
            </span>
            <div className="self-stretch">
              <span className="text-gray-800 text-sm font-normal font-sans leading-relaxed">
                {about.length <= 200 ? about : `${about.substring(0, 200)}... `}
              </span>
              {about.length > 200 && (
                <TalentAboutModal
                  about={about}
                  trigger={
                    <span className="text-primary-500 text-sm cursor-pointer font-normal underline ml-1 hover:text-primary-600 font-sans ">
                      Learn More
                    </span>
                  }
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <InviteDialog
        open={showInviteDialog}
        onOpenChange={setShowInviteDialog}
        mode={inviteMode}
        candidateIds={[id]}
      />
    </div>
  );
}
