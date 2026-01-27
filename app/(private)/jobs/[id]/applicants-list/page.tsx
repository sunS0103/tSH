import {
  getRecruiterJob,
  getRecruiterJobApplicants,
} from "@/api/jobs/recruiter";
import Breadcrumbs from "@/components/common/breadcrumbs";
import ApplicantCard, {
  ApplicantCardProps,
} from "@/components/jobs/recruiter-jobs/applicants/applicant-card";
import ApplicantsWrapper from "@/components/jobs/recruiter-jobs/applicants/applicants-wrapper";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

export default async function ApplicantsListPage({
  params,
}: {
  params: { id: string };
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const role = cookieStore.get("user_role")?.value;

  if (role !== "RECRUITER") {
    notFound();
  }

  const { id } = await params;

  const data = await getRecruiterJob({ jobId: id, token });

  return (
    <>
      <div>
        <Breadcrumbs
          routes={[
            { label: "Jobs", href: "/jobs" },
            { label: data?.data?.title, href: `/jobs/${id}/applicants-list` },
          ]}
          currentRoute={{ label: "Applicants List" }}
        />
      </div>

      <ApplicantsWrapper jobId={id} />
    </>
  );
}
