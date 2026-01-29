import Breadcrumbs from "@/components/common/breadcrumbs";
import JobDetailsSection from "../recruiter-jobs/job-details/job-details-section";
import AssessmentCard from "@/components/assessments/assessment-card";
import { getCandidateJobFields } from "@/api/jobs/candidate";
import { cookies } from "next/headers";
import { CustomField, RecruiterJob } from "@/types/job";
import JobApplyForm from "./job-details/job-apply-form";
import ContactRecruiterFormDetails from "./job-details/contact-recruiter-form-details";
import AdditionalDetailsForm from "./job-details/additional-details-form";
import AdditionalDetails from "./job-details/additional-details";

interface CandidateJob extends Omit<
  Partial<RecruiterJob>,
  "mandate_assessment" | "custom_fields"
> {
  slug: string;
  title: string;
  company_name: string;
  mandate_assessment: Array<{
    slug: string;
    category: string;
    title: string;
    topics: Array<{ id: string; value: string }>;
    is_assessment_complete: boolean;
    duration: number;
    total_questions: number;
    score: number;
  }>;
  custom_fields: CustomField[];
  customFieldsStatus: "NOT_REQUESTED" | "REQUESTED" | "SUBMITTED";
  additionalDetailsStatus: "NOT_REQUESTED" | "REQUESTED" | "SUBMITTED";
}

export default async function CandidateJobDetails({
  job,
}: {
  job: CandidateJob;
}) {
  console.log({ job });
  console.log(job.mandate_assessment);

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let customFields: CustomField[] | null = null;

  // Try to fetch custom fields, but don't fail if it errors
  // Custom fields are optional and may not be available for all jobs
  if (token && job?.slug) {
    await getCandidateJobFields({
      jobId: job.slug,
      token,
    })
      .then((res) => {
        customFields = res.data;
      })
      .catch((err) => {
        console.error("Failed to fetch custom fields:", err);
        customFields = null;
      });
  }

  const isAssessmentNotCompleted = job.mandate_assessment.some(
    (assessment: { is_assessment_complete: boolean }) =>
      assessment.is_assessment_complete === false,
  );

  return (
    <div>
      <Breadcrumbs
        routes={[{ label: "Jobs", href: "/jobs" }]}
        currentRoute={{ label: job.title }}
      />
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mt-4">
        <div>
          <h1 className="md:text-2xl text-xl font-bold">{job.title}</h1>
          <div className="text-sm text-gray-500">{job.company_name}</div>
        </div>

        <>
          {job?.additionalDetailsStatus !== "NOT_REQUESTED" ? (
            <AdditionalDetailsForm
              additional_details={job.additional_details || []}
              jobId={job.slug}
              additionalDetailsStatus={job.additionalDetailsStatus}
            />
          ) : (
            <JobApplyForm
              isAssessmentNotCompleted={isAssessmentNotCompleted}
              customFields={customFields}
              jobId={job.slug}
              customFieldsStatus={job.customFieldsStatus}
            />
          )}
        </>
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col gap-3 w-full mt-4">
        <JobDetailsSection job={job as RecruiterJob} />

        {job.mandate_assessment.length > 0 && (
          <>
            <hr className="border-gray-200" />

            {isAssessmentNotCompleted ? (
              <p className="text-info-500 text-base md:text-lg font-semibold">
                “Taking this assessment will increase your chances of being
                shortlisted.”
              </p>
            ) : (
              <p className="text-success-600 text-base md:text-lg font-semibold">
                “ 🎉 Congratulations! 🎉 You’ve already completed this
                assessment — you have a high chance of being shortlisted. Apply
                now!”
              </p>
            )}
          </>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 mt-3">
          {job.mandate_assessment.map((assessment) => (
            <AssessmentCard
              key={assessment.slug}
              slug={assessment.slug}
              category={assessment.category}
              title={assessment.title}
              topics={assessment.topics}
              duration={assessment.duration}
              questionCount={assessment.total_questions}
              score={assessment.score}
              selectedTab={assessment?.is_assessment_complete ? "taken" : "all"}
            />
          ))}
        </div>
      </div>

      {job.customFieldsStatus === "SUBMITTED" && (
        <ContactRecruiterFormDetails customFields={customFields || []} />
      )}
      {job.additionalDetailsStatus === "SUBMITTED" && (
        <AdditionalDetails additional_details={job.additional_details || []} />
      )}
    </div>
  );
}
