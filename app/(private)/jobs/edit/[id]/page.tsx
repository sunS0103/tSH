import JobForm from "@/components/jobs/recruiter-jobs/shared/job-form";

interface EditJobPageProps {
  params: {
    id: string;
  };
}

export default async function EditJobPage({ params }: EditJobPageProps) {
  const { id } = await params;

  return <JobForm jobId={id} />;
}
