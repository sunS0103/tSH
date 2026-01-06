import EditJobForm from "@/components/jobs/recruiter-jobs/edit/edit-job-form";

interface EditJobPageProps {
  params: {
    id: string;
  };
}

export default function EditJobPage({ params }: EditJobPageProps) {
  return <EditJobForm jobId={params.id} />;
}

