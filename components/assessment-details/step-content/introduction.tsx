"use client";

import { useEffect, useRef } from "react";
import { cn, formatDurationWithSeconds } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { Assessment } from "../step-content-wrapper";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface AssessmentIntroductionProps {
  className?: string;
  assessment: Assessment;
  isConfirmed: boolean;
  onConfirmChange: (isConfirmed: boolean) => void;
  topics: { id: string; value: string }[];
  sample_question_pdf_link?: string;
  hasError?: boolean;
}

export default function AssessmentIntroduction({
  className,
  assessment,
  isConfirmed,
  onConfirmChange,
  topics,
  sample_question_pdf_link,
  hasError,
}: AssessmentIntroductionProps) {
  const checkboxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hasError && checkboxRef.current) {
      checkboxRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [hasError]);

  const cards = [
    ...(assessment.duration && assessment.duration > 0
      ? [
          {
            icon: "material-symbols:location-on-outline-rounded",
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
    <div>
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

      <div className="flex flex-col mt-8">
        <div>
          <div className="flex gap-2">
            <Icon
              icon="material-symbols:menu-book-outline"
              className="text-primary-500 size-6"
            />
            <h1 className="text-lg font-semibold text-gray-900 mb-4">
              Syllabus and Topics Covered
            </h1>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {topics?.map((item) => (
              <div
                key={item.id}
                className="text-center bg-primary-50 text-primary-500 text-xs px-4 py-3 rounded-lg"
              >
                <span>{item.value}</span>
              </div>
            ))}
          </div>
          {sample_question_pdf_link && (
            <Button
              variant="secondary"
              className="mt-3 group text-xs md:text-sm"
              onClick={() => {
                window.open(
                  sample_question_pdf_link,
                  "_blank",
                  "noopener noreferrer"
                );
              }}
            >
              <Icon
                icon="humbleicons:download-alt"
                className="text-primary-500 size-4.5 group-hover:text-white"
              />
              Download Sample Questions.
            </Button>
          )}
        </div>
        <div ref={checkboxRef} className="flex flex-col gap-2 mt-10">
          <div className="flex items-center gap-2">
            <Checkbox
              id="syllabus-and-topics"
              checked={isConfirmed}
              onCheckedChange={(checked) => onConfirmChange(Boolean(checked))}
              className="border border-black cursor-pointer"
            />
            <Label
              htmlFor="syllabus-and-topics"
              className="inline font-normal cursor-pointer"
            >
              I have reviewed and understood the syllabus.
            </Label>
          </div>
          {hasError && (
            <p className="text-sm text-red-500 ml-7">
              Please mark this checkbox to proceed to the next step
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
