"use client";

import { useEffect, useRef } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Icon } from "@iconify/react";
import Link from "next/link";

interface ExamProcessProps {
  isConfirmed: boolean;
  onConfirmChange: (isConfirmed: boolean) => void;
  hasError?: boolean;
}

export default function ExamProcess({
  isConfirmed,
  onConfirmChange,
  hasError,
}: ExamProcessProps) {
  const checkboxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hasError && checkboxRef.current) {
      checkboxRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [hasError]);

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <Icon
          icon="icon-park-twotone:connection-point-two"
          className="text-primary-500 size-5 -rotate-45"
        />
        <h1 className="text-lg md:text-xl font-bold">
          Exam Process / How It Works
        </h1>
      </div>
      <p className="text-xs md:text-sm text-gray-600 mb-4 font-medium md:max-w-lg">
        Our assessment is a fully online, proctored exam designed to test
        practical, real-world capabilities across multiple formats.
      </p>
      <hr className="border-gray-200 my-4" />

      {listingSection({
        title: "Question Types",
        icon: "material-symbols:help-outline",
        items: questionTypes,
      })}

      <hr className="border-gray-200 my-4" />

      {listingSection({
        title: "System Requirements",
        description: "For a smooth exam experience:",
        icon: "material-symbols:computer-outline-rounded",
        items: systemRequirements,
      })}

      <hr className="border-gray-200 my-4" />

      <div ref={checkboxRef} className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Checkbox
            id="exam-process"
            checked={isConfirmed}
            onCheckedChange={(checked) => onConfirmChange(Boolean(checked))}
          />
          <Label htmlFor="exam-process" className="inline cursor-pointer">
            I understand the exam flow and its requirements.
          </Label>
        </div>
        {hasError && (
          <p className="text-sm text-red-500 ml-7">
            Please mark this checkbox to proceed to the next step
          </p>
        )}
      </div>
    </div>
  );
}

const questionTypes = [
  "Multiple-choice questions (MCQ)",
  "Fill-in-the-blanks (evaluated using answer-relevancy algorithms)",
  "Multi-select questions",
  "Coding exercises",
  "Video Interview Round (candidate speaks answers on camera)",
];

const systemRequirements = [
  "Stable high-speed internet connection",
  "Laptop/desktop only (mobile unsupported)",
  "Audio and video enabled in browser",
  "Quiet, well-lit environment",
  "Latest version of Chrome/Edge recommended",
];

const listingSection = ({
  title,
  description,
  icon,
  items,
}: {
  title: string;
  description?: string | undefined;
  icon: string;
  items: string[];
}) => {
  return (
    <div>
      <div className="flex items-center gap-2">
        <Icon icon={icon} className="text-primary-500 size-4.5" />
        <h3 className="text-sm md:text-base font-semibold text-primary-500">
          {title}
        </h3>
      </div>
      {description && (
        <p className="text-xs md:text-sm text-gray-700 font-medium">
          {description}
        </p>
      )}
      <ul className="list-disc list-inside text-gray-600 px-2 mt-2 marker:text-primary-100">
        {items.map((item) => (
          <li
            key={item}
            className="text-xs md:text-sm text-gray-600 font-medium"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};
