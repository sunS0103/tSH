import Link from "next/link";
import { Icon } from "@iconify/react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface AssessmentCardProps {
  icon?: string;
  category: string;
  title: string;
  topics: string[];
  duration: string;
  questionCount: number;
  className?: string;
  link: string;
}

export default function AssessmentCard({
  icon,
  category,
  title,
  topics,
  duration,
  questionCount,
  className,
  link,
}: AssessmentCardProps) {
  const displayedTopics = topics.slice(0, 2);
  const remainingCount = topics.length - 2;

  return (
    <Link
      href={link}
      aria-label="Start assessment"
      className={cn(
        "bg-white border border-gray-200 flex flex-col items-start rounded-2xl w-full group hover:shadow-lg duration-500",
        className
      )}
    >
      <div className="p-3 w-full">
        <div className="flex items-center justify-between w-full">
          <div className="bg-gray-100 group-hover:bg-primary-500 transition-colors flex items-center justify-center rounded-lg size-8">
            {icon ? (
              <Icon
                icon={icon}
                className="size-5 text-black group-hover:text-white transition-colors"
              />
            ) : (
              <></>
            )}
          </div>

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

        <div className="flex flex-col gap-2 items-start w-full mt-3">
          <span className="text-black text-xs uppercase font-normal tracking-normal">
            Topics
          </span>
          <div className="flex gap-1 items-center flex-wrap">
            {displayedTopics.map((topic, index) => (
              <Badge
                key={index}
                variant="outline"
                className="border-gray-300 text-black text-xs font-normal px-2 py-1 rounded-full"
              >
                {topic}
              </Badge>
            ))}
            {remainingCount > 0 && (
              <Badge
                variant="outline"
                className="border-gray-300 text-black text-xs font-normal px-2 py-1 rounded-full"
              >
                +{remainingCount}
              </Badge>
            )}
          </div>
        </div>
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
                {duration}
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

          <div className="bg-transparent border border-primary-500 size-8 rounded-lg flex items-center justify-center group-hover:bg-primary-500 transition-colors">
            <Icon
              icon="mdi:arrow-top-right"
              className="size-5 text-primary-500 group-hover:text-white transition-colors"
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
