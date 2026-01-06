"use client";

import { cn, formatDurationWithSeconds } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { Assessment } from "../step-content-wrapper";

interface AssessmentIntroductionProps {
  className?: string;

  assessment: Assessment;
}

export default function AssessmentIntroduction({
  className,
  assessment,
}: AssessmentIntroductionProps) {
  const cards = [
    ...(assessment.duration && assessment.duration > 0
      ? [
          {
            icon: "lineicons:stopwatch",
            label: "Duration",
            value: formatDurationWithSeconds(assessment.duration || 0),
            bgColor: "bg-info-50",
            borderColor: "border-info-100",
            iconColor: "text-info-500",
            iconBgColor: "bg-info-200",
          },
        ]
      : []),
    ...(assessment.topics.length > 0
      ? [
          {
            icon: "material-symbols-light:menu-book-outline",
            label: "Topics",
            value: assessment.topics.length,
            bgColor: "bg-secondary-50",
            borderColor: "border-secondary-100",
            iconColor: "text-secondary-500",
            iconBgColor: "bg-secondary-200",
          },
        ]
      : []),

    ...(assessment.total_questions && assessment.total_questions > 0
      ? [
          {
            icon: "material-symbols:help-outline",
            label: "Questions",
            value: assessment.total_questions,
            bgColor: "bg-success-50",
            borderColor: "border-success-100",
            iconColor: "text-success-500",
            iconBgColor: "bg-success-200",
          },
        ]
      : []),
    ...(assessment.difficulty_level
      ? [
          {
            icon: "material-symbols:steppers",
            label: "Difficulty Level",
            value: assessment.difficulty_level,
            bgColor: "bg-warning-50",
            borderColor: "border-warning-100",
            iconColor: "text-warning-500",
            iconBgColor: "bg-warning-200",
          },
        ]
      : []),
  ];

  return (
    <div className={cn("space-y-3", className)}>
      {/* Introduction Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center rounded-full">
          <Icon
            icon={"material-symbols:info-outline"}
            className="text-primary-500 size-6"
          />
        </div>
        <h1 className="text-xl font-bold text-gray-900">Introduction</h1>
      </div>

      {/* Information Cards Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Duration Card */}
        {cards.map((card) => (
          <div
            key={card.label}
            className={cn(
              "rounded-xl px-3 py-4 flex items-center gap-3",
              card.bgColor,
              card.borderColor
            )}
          >
            <div className="flex gap-3">
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full",
                  card.iconBgColor
                )}
              >
                <Icon
                  icon={card.icon}
                  className={cn("size-6", card.iconColor)}
                />
              </div>
            </div>
            <div>
              <div className="text-lg md:text-xl font-bold text-gray-900">
                {card.value}
              </div>
              <div className="text-xs font-medium text-gray-500">
                {card.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
