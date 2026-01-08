import { RecruiterJob } from "@/types/job";
import JobDetailsSection from "./job-details-section";
import JobStatus from "./job-status";
import JobSelectedAssessment from "./job-selected-assessment";
import JobAppliedFormField from "./job-applied-form-field";

export default function JobDetails({ job }: { job: RecruiterJob }) {
  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start gap-2">
        <div>
          <div className="text-xl md:text-2xl font-bold text-black">
            {job.title}
          </div>
          <div className="text-xs md:text-sm text-gray-700">
            {job.company_name}
          </div>
        </div>
        <div>
          <JobStatus status={job.status} slug={job.slug} />
        </div>
      </div>
      <div className="space-y-5 mb-24 md:mb-0">
        <JobDetailsSection job={job} />
        <JobSelectedAssessment
          mandateAssessment={job.mandate_assessment || []}
        />
        <JobAppliedFormField customFields={job.custom_fields || []} />
      </div>
    </>
  );
}
