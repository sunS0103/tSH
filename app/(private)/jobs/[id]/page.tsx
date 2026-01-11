import JobsDetailsWrapper from "@/components/jobs/jobs-details-wrapper";

export default async function JobDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  return <JobsDetailsWrapper jobId={id} />;
}
