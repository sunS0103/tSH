"use client";

import { useEffect, useRef } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Icon } from "@iconify/react";

interface ScoreVisibilityAndPrivacyProps {
  isConfirmed: boolean;
  onConfirmChange: (isConfirmed: boolean) => void;
  hasError?: boolean;
}

export default function ScoreVisibilityAndPrivacy({
  isConfirmed,
  onConfirmChange,
  hasError,
}: ScoreVisibilityAndPrivacyProps) {
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
        <Icon icon="iconamoon:eye" className="text-primary-500 size-5" />
        <h1 className="text-lg md:text-xl font-bold">
          Score Visibility & Privacy
        </h1>
      </div>
      <p className="text-xs md:text-sm text-gray-600 mb-4 font-medium">
        Your score is a signal, not a judgment. you remain in full control of
        your own identity visibility.
      </p>

      <hr className="border-gray-200 my-4" />

      <div className="flex items-center gap-2">
        <Icon
          icon="material-symbols:person-shield-outline-rounded"
          className="text-primary-500 size-4.5 text-bold"
        />
        <h3 className="text-sm md:text-base font-semibold text-primary-500">
          Profile Privacy
        </h3>
      </div>

      <p className="text-black font-semibold text-xs md:text-sm mt-3 mb-2">
        name, photo, email, and location stay 100% Private Until
      </p>

      <ul className="list-disc list-inside text-gray-600 px-2 mt-2 marker:text-primary-100">
        <li className="text-xs md:text-sm text-gray-600 font-medium">
          You approve a recruiter&apos;s unmask request.
        </li>
        <li className="text-xs md:text-sm text-gray-600 font-medium">
          You directly apply to a job and choose to share your profile.
        </li>
      </ul>

      <hr className="border-gray-200 my-4" />

      <div className="flex items-center gap-2">
        <Icon
          icon="material-symbols:workspace-premium-outline"
          className="text-primary-500 size-4.5"
        />
        <h3 className="text-sm md:text-base font-semibold text-primary-500">
          How do recruiters interpret my score?
        </h3>
      </div>
      <p className="text-xs md:text-sm text-gray-600 mt-2 mb-4 font-medium">
        Your score is not judged in isolation. It is evaluated in the context of
        the hiring market and the specific role requirement.
      </p>

      <p className="text-xs md:text-sm text-black font-semibold mb-3">
        Recruiters interpret scores based on several factors, including:
      </p>

      <div className="space-y-4">
        <div>
          <h5 className="text-xs md:text-sm font-semibold text-gray-800">
            Skill demand and availability
          </h5>
          <p className="text-xs md:text-sm text-gray-600 font-medium mt-1">
            Some skills have a larger talent pool, while others have fewer
            specialists. Recruiters consider how your score compares within that
            skill landscape.
          </p>
        </div>

        <div>
          <h5 className="text-xs md:text-sm font-semibold text-gray-800">
            Geographical hiring trends
          </h5>
          <p className="text-xs md:text-sm text-gray-600 font-medium mt-1">
            A score that stands out in one city or region may be viewed
            differently in another, depending on local competition and hiring
            demand.
          </p>
        </div>

        <div>
          <h5 className="text-xs md:text-sm font-semibold text-gray-800">
            Role complexity and expectations
          </h5>
          <p className="text-xs md:text-sm text-gray-600 font-medium mt-1">
            Different roles require different depth of expertise. Recruiters
            align your score with the expectations of the role they are hiring
            for.
          </p>
        </div>
      </div>

      <div className="mt-4 p-3 bg-primary-50 rounded-lg border border-primary-100">
        <p className="text-xs md:text-sm text-gray-700 font-medium">
          <span className="mr-1">👉</span>
          Your score is a strong indicator of your capability, and recruiters
          evaluate it thoughtfully in relation to market context, not as a
          standalone number.
        </p>
      </div>

      <hr className="border-gray-200 my-4" />

      <div ref={checkboxRef} className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Checkbox
            id="score-visibility-and-privacy"
            checked={isConfirmed}
            onCheckedChange={(checked) => onConfirmChange(Boolean(checked))}
            className="border border-black cursor-pointer"
          />
          <Label
            htmlFor="score-visibility-and-privacy"
            className="inline font-normal cursor-pointer"
          >
            I understand how my results will be used and shared.
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
