import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { Job, JOB_STATUS } from "./types";

interface JobCardProps extends Job {}

export default function JobCard({
  title,
  status,
  minExperience,
  maxExperience,
  companyName,
  skills,
  location,
}: JobCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case JOB_STATUS.ACTIVE:
        return "bg-primary-50 text-primary-600 border-transparent";
      case JOB_STATUS.IN_REVIEW:
        return "bg-blue-50 text-blue-500 border-transparent";
      case JOB_STATUS.IN_ACTIVE:
        return "bg-yellow-50 text-yellow-600 border-transparent";
      case JOB_STATUS.DRAFT:
        return "bg-gray-100 text-gray-600 border-gray-200";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const visibleSkills = skills.slice(0, 2);
  const remainingSkills = skills.length - 2;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl flex flex-col justify-start items-start w-full hover:shadow-sm transition-shadow">
      {/* Top Section Padding */}
      <div className="p-3 pb-0 w-full flex flex-col gap-4">
        {/* Header: Title + Status */}
        <div className="flex justify-between items-center gap-3">
          <h2
            className="text-lg font-semibold font-sans text-gray-950 line-clamp-1 flex-1"
            title={title}
          >
            {title}
          </h2>
          <div
            className={cn(
              "px-2 py-0.5 rounded-full flex justify-center items-center",
              getStatusColor(status)
            )}
          >
            <span className="text-[10px] italic font-normal font-sans text-center">
              {status}
            </span>
          </div>
        </div>

        {/* Info Rows */}
        <div className="flex flex-col gap-3 w-full">
          {/* Row 1: Exp + Company */}
          <div className="flex justify-between items-start w-full">
            <div className="flex-1 flex flex-col items-start gap-1">
              <span className="text-[10px] uppercase text-gray-900 font-normal font-sans">
                Years of Experience
              </span>
              <span className="text-xs font-normal font-sans text-gray-950">
                {minExperience}-{maxExperience} Years
              </span>
            </div>
            <div className="flex-1 flex flex-col items-start gap-1">
              <span className="text-[10px] uppercase text-gray-900 font-normal font-sans">
                Company Name
              </span>
              <span
                className="text-xs font-normal font-sans text-gray-950 truncate w-full"
                title={companyName}
              >
                {companyName}
              </span>
            </div>
          </div>

          {/* Row 2: Skills */}
          <div className="flex flex-col items-start gap-2 w-full">
            <span className="text-[10px] uppercase text-gray-900 font-normal font-sans">
              Primary Skills
            </span>
            <div className="flex items-center gap-1 flex-wrap">
              {visibleSkills.map((skill) => (
                <div
                  key={skill}
                  className="px-2 py-1 rounded-full border border-gray-300 flex justify-center items-center"
                >
                  <span className="text-[10px] text-gray-950 font-normal font-sans text-center">
                    {skill}
                  </span>
                </div>
              ))}
              {remainingSkills > 0 && (
                <div className="px-2 py-1 rounded-full border border-gray-300 flex justify-center items-center">
                  <span className="text-[10px] text-gray-950 font-normal font-sans text-center">
                    +{remainingSkills}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section (Location + Action) */}
      <div className="p-3 w-full flex flex-col gap-2.5">
        <div className="w-full bg-primary-50/50 rounded-xl px-2 py-1 flex flex-wrap justify-between items-center gap-2">
          {/* Location Pill */}
          <div className="flex items-center gap-0.5">
            <div className="w-3.5 h-3.5 flex items-center justify-center">
              <Icon
                icon="mdi:map-marker"
                className="w-2.5 h-2.5 text-primary-800"
              />
            </div>
            <span className="text-xs text-primary-800 font-normal font-sans">
              {location}
            </span>
          </div>

          {/* Button */}
          <Button
            variant="outline"
            className="h-8 px-3 rounded-lg border border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white flex items-center gap-2 bg-transparent ml-auto sm:ml-0"
          >
            <span className="text-xs sm:text-sm font-normal font-sans">
              View applicants
            </span>
            <Icon icon="mdi:arrow-top-right" className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
