import {
  getRecruiterJob,
  getRecruiterJobApplicants,
} from "@/api/jobs/recruiter";
import Breadcrumbs from "@/components/common/breadcrumbs";
import ApplicantCard, {
  ApplicantCardProps,
} from "@/components/jobs/recruiter-jobs/applicants/applicant-card";
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

  const applicants = await getRecruiterJobApplicants({ jobId: id, token });

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

      <div className="space-y-4 mb-25 md:mb-0">
        {applicants.data.map((applicant: ApplicantCardProps) => (
          <ApplicantCard
            key={applicant?.application_id}
            jobId={id}
            first_name={applicant?.first_name || null}
            last_name={applicant?.last_name || null}
            score={applicant?.score || 0}
            skills={applicant?.skills || []}
            email={applicant?.email || null}
            phone={applicant?.phone || null}
            experience={applicant?.experience}
            current_company={applicant?.current_company}
            time_in_current_company={applicant?.time_in_current_company}
            location={applicant?.location}
            current_ctc={applicant?.current_ctc}
            user_id={applicant?.user_id}
            // onAdditionalDetails={() => {}}
            // onViewCustomForm={() => {}}
            // onDownload={() => {}}
          />
        ))}
      </div>
    </>
  );
}
