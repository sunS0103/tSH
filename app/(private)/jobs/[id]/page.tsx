import JobsDetailsWrapper from "@/components/jobs/jobs-details-wrapper";
// import { getRecruiterJob } from "@/api/jobs/recruiter";
// import Breadcrumbs from "@/components/common/breadcrumbs";
// import JobDetails from "@/components/jobs/recruiter-jobs/job-details/job-details";
// import { cookies } from "next/headers";
// import { notFound } from "next/navigation";

// export default async function JobDetailsPage({
//   params,
// }: {
//   params: { id: string };
// }) {
//   const { id } = await params;

//   const cookieStore = await cookies();
//   const token = cookieStore.get("token")?.value;

//   const job = await getRecruiterJob({ jobId: id, token });

//   if (!job) {
//     notFound();
//   }

//   const title = job.data.title || "Job Details";

//   return (
//     <div className="flex flex-col gap-4">
//       <Breadcrumbs
//         routes={[{ label: "Jobs", href: "/jobs" }]}
//         currentRoute={{ label: title }}
//       />
//       <JobDetails job={job.data} />
//     </div>
//   );
// }

export default async function JobDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  return <JobsDetailsWrapper jobId={id} />;
}
