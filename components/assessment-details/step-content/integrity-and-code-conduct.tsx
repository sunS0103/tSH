"use client";

import { useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface IntegrityAndCodeConductProps {
  isConfirmed: boolean;
  onConfirmChange: (isConfirmed: boolean) => void;
  hasError?: boolean;
}

export default function IntegrityAndCodeConduct({
  isConfirmed,
  onConfirmChange,
  hasError,
}: IntegrityAndCodeConductProps) {
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
          icon="material-symbols:encrypted-outline"
          className="text-primary-500 size-5"
        />
        <h1 className="text-lg md:text-xl font-bold">
          Integrity & Code of Conduct
        </h1>
      </div>
      <p className="text-xs md:text-sm text-gray-600 mb-4 font-medium">
        Our platform ensures a fair, transparent, and secure assessment
        environment.
      </p>

      <hr className="border-gray-200 my-4" />

      {listingSection({
        title: "Proctoring Measures",
        items: [
          "Continuous live video monitoring",
          "No tab switching",
          "No screen recording or remote access tools",
          "No copy/paste",
          "AI-based detection of suspicious eye movements",
          "Strict ID verification with facial match",
          "No second person allowed in frame",
          "No background conversations or external cues",
        ],
        icon: "material-symbols:ar-on-you-outline-rounded",
      })}

      <hr className="border-gray-200 my-4" />

      <div className="flex items-center gap-2">
        <Icon
          icon="material-symbols:assignment-turned-in-outline"
          className="text-primary-500 size-4.5"
        />
        <h3 className="text-sm md:text-base font-semibold text-primary-500">
          Post-Exam Review
        </h3>
      </div>
      <p className="text-xs md:text-sm text-gray-600 mb-4 font-medium">
        Our aim is to maintain an industry-trusted certification standard.
      </p>

      {postExamReviewSection({
        title: "A detailed Proctoring Report is generated, capturing:",
        items: [
          "Violation flags",
          "System alerts",
          "Suspicious behavior markers",
          "Evidence screenshots (if required)",
        ],
      })}

      {postExamReviewSection({
        title: "If misconduct is confirmed after manual audit:",
        items: ["Exam attempt is voided", "No certificate or score issued"],
      })}

      <hr className="border-gray-200 my-4" />

      <div className="flex items-center gap-2">
        <Icon
          icon="material-symbols:visibility-outline"
          className="text-primary-500 size-4.5"
        />
        <h3 className="text-sm md:text-base font-semibold text-primary-500">
          AI Monitoring & Behavior Rules
        </h3>
      </div>
      <p className="text-xs md:text-sm text-gray-600 mb-2 font-medium">
        External monitors are not permitted. You must look straight at the
        screen and avoid repeatedly looking sideways or down.
      </p>
      <p className="text-xs md:text-sm text-gray-600 mb-4 font-medium">
        Our AI proctoring system continuously monitors for unusual behavior.
        Repeated sideways glances, suspicious movements, or mobile phone
        detection are violations and may result in a{" "}
        <span className="font-semibold">penalty deduction of up to 25%</span>{" "}
        from your score, applied during our secondary manual review.
      </p>

      <hr className="border-gray-200 my-4" />

      <div className="flex items-center gap-2">
        <Icon
          icon="material-symbols:shield-person-outline"
          className="text-primary-500 size-4.5"
        />
        <h3 className="text-sm md:text-base font-semibold text-primary-500">
          Random Secondary Review
        </h3>
      </div>
      <p className="text-xs md:text-sm text-gray-600 mb-3 font-medium">
        We follow a strict zero-tolerance policy toward cheating. To ensure
        fairness, selected profiles undergo a random secondary review.
      </p>

      {postExamReviewSection({
        title: "How it works:",
        items: [
          "Certain profiles may be flagged for a 5-minute verification call based on internal review filters",
          "The call covers topics similar (not identical) to correctly answered questions, to verify skill alignment",
        ],
      })}

      {postExamReviewSection({
        title: "If a significant mismatch is found:",
        items: [
          "Your profile will be flagged and permanently removed from recruiter visibility",
          "Platform access may be restricted",
        ],
      })}

      <p className="text-xs md:text-sm text-gray-600 mt-3 font-medium">
        An email will be sent to schedule the call. If there is no response
        within <span className="font-semibold">4 business days</span>, your
        profile will automatically be flagged and removed.
      </p>

      <hr className="border-gray-200 my-4" />

      <div ref={checkboxRef} className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Checkbox
            id="integrity-and-code-conduct"
            checked={isConfirmed}
            onCheckedChange={(checked) => onConfirmChange(Boolean(checked))}
            className="border border-black cursor-pointer"
          />
          <Label
            htmlFor="integrity-and-code-conduct"
            className="inline font-normal cursor-pointer"
          >
            I agree to follow the integrity policy during assessment.
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

const listingSection = ({
  title,
  items,
  icon,
}: {
  title: string;
  items: string[];
  icon: string;
}) => {
  return (
    <div>
      <div className="flex items-center gap-2">
        <Icon icon={icon} className="text-primary-500 size-4.5" />
        <h3 className="text-sm md:text-base font-semibold text-primary-500">
          {title}
        </h3>
      </div>
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

const postExamReviewSection = ({
  title,
  items,
}: {
  title: string;
  items: string[];
}) => {
  return (
    <div className="mt-3">
      <h5 className="text-xs md:text-sm font-semibold">{title}</h5>

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
