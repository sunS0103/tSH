import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Icon } from "@iconify/react";

interface ScoreVisibilityAndPrivacyProps {
  isConfirmed: boolean;
  onConfirmChange: (isConfirmed: boolean) => void;
}

export default function ScoreVisibilityAndPrivacy({
  isConfirmed,
  onConfirmChange,
}: ScoreVisibilityAndPrivacyProps) {
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
          No Fixed Benchmark
        </h3>
      </div>
      <p className="text-xs md:text-sm text-gray-600 mb-4 font-medium">
        Performance is evaluated relative to market context.
      </p>

      {listingSection({
        title: "Skill Competitiveness",
        items: [
          "Highly saturated skills (e.g., Java + Selenium) require stronger scores.",
          "Niche skills (e.g., Playwright + API) may attract recruiters even with moderate scoring.",
        ],
      })}

      {listingSection({
        title: "Geographical Competitiveness",
        items: [
          "A 50% score may be excellent in a Tier-2 city.",
          "The same score may be average in a highly competitive metro.",
        ],
      })}

      {listingSection({
        title: "Recruiters interpret your score based on:",
        items: [
          "City-wise hiring demand",
          "Skill supply-demand balance",
          "Role complexity",
        ],
      })}

      <hr className="border-gray-200 my-4" />

      <div className="flex items-center gap-2">
        <Checkbox
          id="score-visibility-and-privacy"
          checked={isConfirmed}
          onCheckedChange={(checked) => onConfirmChange(Boolean(checked))}
        />
        <Label
          htmlFor="score-visibility-and-privacy"
          className="inline font-normal"
        >
          I understand how my results will be used and shared.
        </Label>
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
