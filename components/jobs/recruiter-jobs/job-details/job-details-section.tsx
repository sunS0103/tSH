import { RecruiterJob } from "@/types/job";
import { sanitizeHtml } from "@/lib/utils";
import { cookies } from "next/headers";

interface DetailItemProps {
  label: string;
  value: string | null | undefined;
}
export default async function JobDetailsSection({
  job,
}: {
  job: RecruiterJob;
}) {
  const cookieStore = await cookies();
  const role = cookieStore.get("user_role")?.value;

  // Format salary
  const salaryText = job?.compensation || null;
  // job.compensation?.min_amount && job.compensation?.max_amount
  //   ? `${job.compensation.min_amount} to ${job.compensation.max_amount} ${job.compensation.period || "Per annum"
  //   }`
  //   : null;

  // Format experience
  const experienceText =
    job.experience_min_years >= 0 && job.experience_max_years >= 0
      ? `${job.experience_min_years} - ${job.experience_max_years} Years`
      : "-";

  // Format work modes
  const workModesText =
    job.work_mode && job.work_mode.length > 0 ? job.work_mode.join(", ") : null;

  // Format skills
  // Support both `primary_skills` and `skills` keys

  const primarySkills =
    job.skills && job.skills.length > 0
      ? job.skills.map((skill) => skill?.name).join(", ")
      : null;

  const skills =
    job.skills && job.skills.length > 0
      ? job.skills.map((skill) => skill.skill?.name).join(", ")
      : null;

  const skillsText = role === "CANDIDATE" ? primarySkills : skills || "-";

  // Format job serving location
  const jobWorkType =
    job.job_serving_location === "in-house project"
      ? "Inhouse Project"
      : job.job_serving_location === "client location"
      ? "Client location"
      : job.job_serving_location || null;

  // Build array of detail fields
  const detailFields = [
    { label: "Job Work Type", value: jobWorkType },
    { label: "Country", value: job.country?.name },
    { label: "City", value: job.city?.name },
    { label: "Contract to Hire", value: job.contract_to_hire ? "Yes" : "No" },
    { label: "Employment Gaps", value: job.employment_gaps ? "Yes" : "No" },
    // Conditionally include contract-to-hire fields
    ...(job.contract_to_hire
      ? [
          { label: "Client Name", value: job.client_name },
          {
            label: "Approximate conversion time to full-time.",
            value: job.conversion_time,
          },
        ]
      : []),
    { label: "Salary", value: salaryText },
    { label: "Work Mode", value: workModesText },
    { label: "Years of Experience", value: experienceText },
    { label: "Notice Period", value: job.required_notice_period },
  ];

  return (
    <div className="space-y-3">
      {/* Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 w-full">
        {detailFields.map((field, index) => (
          <DetailItem
            key={index}
            label={field.label}
            value={field.value as string}
          />
        ))}
      </div>

      <div className="flex flex-col gap-1 w-full">
        <p className="text-xs text-gray-900 font-normal">Primary Skill Set</p>
        <p className="text-base text-black font-medium wrap-break-words">
          {skillsText || "-"}
        </p>
      </div>

      {/* Job Description (Full Width) */}
      <div className="flex flex-col gap-1 w-full">
        <p className="text-xs text-gray-900 font-normal">Job Description</p>
        <div className="text-base text-black font-normal leading-normal wrap-break-words">
          <div
            className="prose prose-sm max-w-none [&_ul]:list-disc [&_ul]:ml-4 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:ml-4 [&_ol]:my-2 [&_li]:mb-1 [&_li]:wrap-break-words"
            dangerouslySetInnerHTML={{
              __html: sanitizeHtml(job.description || "-"),
            }}
          />
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value }: DetailItemProps) {
  return (
    <div className="flex flex-col gap-1 flex-1 min-w-0">
      <p className="text-xs text-gray-900 font-normal">{label}</p>
      <p className="text-base text-black font-medium wrap-break-words">
        {value || "-"}
      </p>
    </div>
  );
}
