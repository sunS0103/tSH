import Breadcrumbs from "@/components/common/breadcrumbs";
import JobDetails from "./job-details/job-details";

export default function RecruiterJobDetails({ job }: { job: any }) {
  return (
    <div className="flex flex-col gap-4">
      <Breadcrumbs
        routes={[{ label: "Jobs", href: "/jobs" }]}
        currentRoute={{ label: job.title }}
      />
      <JobDetails job={job} />
    </div>
  );
}
