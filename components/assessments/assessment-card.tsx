import Link from "next/link";
import { Icon } from "@iconify/react";

import { Badge } from "@/components/ui/badge";
import { cn, formatDuration } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface Topics {
  id: string;
  value: string;
}

export interface AssessmentCardProps {
  slug: string;
  category: string;
  title: string;
  topics: Topics[];
  duration: number;
  questionCount: number;
  className?: string;
  score: number;
  selectedTab: string;
  is_assessment_complete?: boolean;
}

export default function AssessmentCard({
  slug,
  category,
  title,
  topics,
  duration,
  questionCount,
  className,
  score,
  selectedTab,
}: AssessmentCardProps) {
  const displayedTopics = topics.slice(0, 2);
  const remainingCount = topics.length - 2;

  const undisplayedTopics = topics.slice(2, topics.length);
  const isTaken = selectedTab === "taken";

  const cardContent = (
    <>
      <div className="p-3 w-full">
        <div className="flex items-center justify-end w-full">
          <Badge
            variant="outline"
            className="bg-gray-100 border-none text-black text-xs font-normal px-2 py-1 rounded-full"
          >
            <span className="size-1 bg-gray-400 rounded-full mr-1" />
            {category}
          </Badge>
        </div>

        <h3 className="font-semibold leading-normal text-black text-lg mt-6">
          {title}
        </h3>

        {topics.length > 0 && (
          <div className="flex flex-col gap-2 items-start w-full mt-3">
            <span className="text-black text-xs uppercase font-normal tracking-normal">
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

      <div className="flex flex-col items-start p-3 w-full">
        <div className="bg-primary-50 flex items-center justify-between pl-2 pr-1 py-1 rounded-xl w-full">
          <div className="flex gap-2 items-center">
            <div className="flex gap-1 items-center">
              <Icon
                icon="material-symbols:timer-outline-rounded"
                className="size-4 text-primary-700 shrink-0"
              />
              <span className="text-primary-700 text-xs font-normal whitespace-nowrap">
                {formatDuration(duration)}
              </span>
            </div>

            <div className="flex gap-1 items-center">
              <Icon
                icon="mdi:help-circle-outline"
                className="size-4 text-primary-700 shrink-0"
              />
              <span className="text-primary-700 text-xs font-normal whitespace-nowrap">
                {questionCount} Que
              </span>
            </div>
          </div>

          {isTaken ? (
            <div className="bg-transparent size-8 rounded-lg flex items-center justify-center">
              <span className="text-gray-900 text-xs font-semibold">
                # {score}
              </span>
            </div>
          ) : (
            <div className="bg-transparent border border-primary-500 size-8 rounded-lg flex items-center justify-center group-hover:bg-primary-500 transition-colors">
              <Icon
                icon="mdi:arrow-top-right"
                className="size-5 text-primary-500 group-hover:text-white transition-colors"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );

  if (isTaken) {
    return (
      <div
        className={cn(
          "bg-white border border-gray-200 flex flex-col items-start justify-between rounded-2xl w-full min-h-57",
          className,
        )}
      >
        {cardContent}
      </div>
    );
  }

  return (
    <Link
      href={`/assessments/${slug}`}
      aria-label="Start assessment"
      className={cn(
        "bg-white border border-gray-200 flex flex-col items-start justify-between rounded-2xl w-full group hover:shadow-lg duration-500 min-h-57 h-full",
        className,
      )}
    >
      {cardContent}
    </Link>
  );
}
