import JobForm from "@/components/jobs/recruiter-jobs/shared/job-form";

interface EditJobPageProps {
  params: {
    id: string;
  };
}

export default function EditJobPage({ params }: EditJobPageProps) {
  return <JobForm jobId={params.id} />;
}

