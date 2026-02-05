"use client";

import { Badge } from "@/components/ui/badge";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { RecruiterJob } from "@/types/job";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CandidateJobCardProps extends Partial<RecruiterJob> {
  slug: string;
}

export default function CandidateJobCard({
  title,
  company_name,
  experience_range,
  work_mode,
  relevant_assessments,
  city,
  country,
  slug,
}: CandidateJobCardProps) {
  const router = useRouter();

  // Format experience range
  const experienceRange = experience_range ? experience_range : "-";

  // Get work mode (take first one if array, or use string directly)
  const workMode = work_mode ? work_mode.join(", ") : "-";

  // Format location
  const location =
    city && country
      ? `${city.name}, ${country.name}`
      : city
      ? city.name
      : country
      ? country.name
      : "-";

  const assessments = relevant_assessments || [];

  const handleCardClick = () => {
    router.push(`/jobs/${slug}`);
  };

  return (
    <div
      className="bg-white border border-gray-200 rounded-2xl flex flex-col justify-between items-start w-full hover:shadow-sm transition-shadow cursor-pointer min-h-52 h-full"
      onClick={handleCardClick}
    >
      {/* Top Section Padding */}
      <div className="p-3 pb-0 w-full flex flex-col gap-4">
        {/* Header: Title */}
        <div className="flex justify-between items-center gap-3">
          <h2
            className="text-lg font-semibold font-sans text-gray-950 line-clamp-1 flex-1"
            title={title}
          >
            {title || "Job Title"}
          </h2>
        </div>

        {/* Info Rows */}
        <div className="flex flex-col gap-3 w-full">
          {/* Row 1: Company + Experience + Work Mode */}
          <div className="flex justify-between items-start w-full gap-2">
            {/* Company Name */}
            <div className="flex-1 flex flex-col items-start gap-1">
              <span className="text-xs uppercase text-slate-900 font-normal font-sans">
                Company Name
              </span>
              <span
                className="text-xs  font-sans text-gray-900 font-medium truncate w-full"
                title={company_name || ""}
              >
                {company_name || "-"}
              </span>
            </div>

            {/* Years of Experience */}
            <div className="flex-1 flex flex-col items-start gap-1">
              <span className="text-xs font-medium uppercase text-gray-900 font-sans">
                Years of Experience
              </span>
              <span className="text-xs font-medium font-sans text-gray-950">
                {experienceRange}
              </span>
            </div>

            {/* Work Mode */}
            <div className="flex-1 flex flex-col items-start gap-1 min-h-[32px]">
              <span className="text-xs uppercase text-gray-900 font-medium font-sans">
                Work Mode
              </span>
              <span className="text-xs font-normal font-sans text-gray-950">
                {workMode}
              </span>
            </div>
          </div>

          {/* Row 2: Relevant Assessments */}
          {assessments.length > 0 && (
            <div className="flex flex-col items-start gap-2 w-full">
              <span className="text-xs font-medium uppercase text-slate-900 font-sans">
                Relevant Assessments
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {assessments.slice(0, 3).map((assessment, index) => {
                  // First assessment gets primary styling, others get gray
                  return (
                    <Link
                      href={`/assessments/${assessment.slug}`}
                      key={assessment.id || index}
                      className={cn(
                        "text-xs font-medium px-3 py-1 rounded-full border-none underline bg-primary-50 transition-all duration-300"
                      )}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Badge
                        key={assessment.id || index}
                        variant="outline"
                        className={cn(
                          "text-xs font-medium italic px-3 py-1 rounded-full border-none underline text-primary-500 transition-all duration-300"
                        )}
                      >
                        {assessment.title || `EXAM-${assessment.id}`}
                      </Badge>
                    </Link>
                  );
                })}

                {assessments.length > 3 && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge
                          variant="outline"
                          className="cursor-pointer text-xs font-medium italic px-3 py-1 rounded-full border-none bg-gray-100 text-slate-900 hover:bg-primary-50 hover:text-primary-500 transition-all duration-300"
                          onClick={(e) => e.stopPropagation()}
                        >
                          +{assessments.length - 3}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent className="bg-white text-black border border-gray-200">
                        <div className="flex flex-col gap-1">
                          {assessments.slice(3).map((assessment, index) => (
                            <span key={index} className="text-xs">
                              {assessment.title || `EXAM-${assessment.id}`}
                            </span>
                          ))}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Section (Location + Action) */}
      <div className="p-3 w-full flex flex-col gap-2.5">
        <div className="w-full bg-primary-50/50 rounded-xl px-2 py-1 flex flex-wrap justify-between items-center gap-2 min-h-10">
          {/* Location Pill */}
          <div className="flex items-center gap-0.5">
            <div className="w-3.5 h-3.5 flex items-center justify-center">
              <Icon
                icon="material-symbols:location-on-outline-rounded"
                className="w-3.5 h-3.5 text-primary-800"
              />
            </div>
            <span className="text-xs text-primary-800 font-normal font-sans">
              {location}
            </span>
          </div>

          {/* Arrow Button */}
          <button
            className="h-8 w-8 rounded-lg border border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white flex items-center justify-center bg-transparent transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
            aria-label="View job details"
          >
            <Icon icon="mdi:arrow-top-right" className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
