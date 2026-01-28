import Link from "next/link";
import { Icon } from "@iconify/react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface Topics {
  id: string;
  value: string;
}

export interface AssessmentRecruiterCardProps {
  slug: string;
  category: string;
  title: string;
  topics: Topics[];
  duration: number;
  questionCount: number;
  className?: string;
  technology?: string; // Technology name for icon selection
}

// Format duration for recruiter view: "HH:MM" or "MM:SS"
function formatDurationRecruiter(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "00:00";

  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);

  const pad = (n: number) => n.toString().padStart(2, "0");

  // Show hours only if they exist, format as "HH:MM"
  return hrs > 0 ? `${pad(hrs)}:${pad(mins)}` : `${pad(mins)}:00`; // For minutes, show as "MM:00"
}

export default function AssessmentRecruiterCard({
  slug,
  category,
  title,
  topics,
  duration,
  questionCount,
  className,
}: AssessmentRecruiterCardProps) {
  const displayedTopics = topics.slice(0, 3);
  const remainingCount = topics.length - 3;
  const undisplayedTopics = topics.slice(3, topics.length);

  const cardContent = (
    <>
      <div className="p-3 w-full">
        <div className="flex items-center justify-end w-full mb-6 gap-4">
          {/* Category Pill */}
          <Badge
            variant="outline"
            className="bg-gray-100 border-none text-black text-xs font-normal px-2 py-1 rounded-full"
          >
            <span className="size-1 bg-gray-400 rounded-full mr-1" />
            {category}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="font-semibold leading-normal text-black text-lg mb-3">
          {title}
        </h3>

        {/* Topics Section */}
        {topics.length > 0 && (
          <div className="flex flex-col gap-2 items-start w-full">
            <span className="text-slate-700 text-xs uppercase font-normal tracking-normal">
              Topics
            </span>
            <div className="flex gap-1 items-center flex-wrap">
              {displayedTopics.map((topic, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="border-gray-300 text-slate-900 text-xs font-medium px-2 py-1 rounded-full"
                >
                  {topic.value}
                </Badge>
              ))}
              {remainingCount > 0 && (
                <Tooltip>
                  <TooltipTrigger>
                    <Badge
                      variant="outline"
                      className="border-gray-300 text-black text-xs font-normal px-2 py-1 rounded-full"
                    >
                      +{remainingCount}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent
                    className="max-w-80 bg-white border border-gray-200"
                    side="bottom"
                  >
                    {undisplayedTopics.length > 0 && (
                      <ul>
                        {undisplayedTopics.map((item) => {
                          return (
                            <li
                              className="text-gray-800 text-xs font-normal whitespace-normal list-disc list-inside"
                              key={item.id}
                            >
                              {item.value}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Section with Duration, Questions, and Action Button */}
      <div className="flex flex-col items-start p-3 w-full">
        <div className="bg-primary-50 flex items-center justify-between pl-2 pr-1 py-1 rounded-xl w-full">
          <div className="flex gap-2 items-center">
            {/* Duration */}
            <div className="flex gap-1 items-center">
              <Icon
                icon="material-symbols:timer-outline-rounded"
                className="size-3.5 text-primary-700 shrink-0"
              />
              <span className="text-primary-700 text-xs font-normal whitespace-nowrap">
                {formatDurationRecruiter(duration)}
              </span>
            </div>

            {/* Question Count */}
            <div className="flex gap-1 items-center">
              <Icon
                icon="mdi:help-circle-outline"
                className="size-3.5 text-primary-700 shrink-0"
              />
              <span className="text-primary-700 text-xs font-normal whitespace-nowrap">
                {questionCount} Que
              </span>
            </div>
          </div>

          {/* Action Button */}
          <div className="bg-transparent border border-primary-500 size-8 rounded-lg flex items-center justify-center group-hover:bg-primary-500 transition-colors">
            <Icon
              icon="mdi:arrow-top-right"
              className="size-5 text-primary-500 group-hover:text-white transition-colors"
            />
          </div>
        </div>
      </div>
    </>
  );

  return (
    <Link
      href={`/assessment/${slug}`}
      aria-label="View assessment"
      target="_blank"
      className={cn(
        "bg-white border border-gray-200 flex flex-col items-start justify-between rounded-2xl w-full group hover:shadow-lg duration-500",
        className,
      )}
    >
      {cardContent}
    </Link>
  );
}
