import ApplicantCard, { ApplicantCardProps } from "./applicant-card";

export default function ApplicantsList({
  applicants,
  jobId,
}: {
  applicants: ApplicantCardProps[];
  jobId: string;
}) {
  return (
    <div className="space-y-4 mb-25 md:mb-0">
      {applicants.map((applicant: ApplicantCardProps) => (
        <ApplicantCard
          key={applicant?.application_id}
          jobId={jobId}
          first_name={applicant?.first_name || null}
          last_name={applicant?.last_name || null}
          score={applicant?.score || 0}
          skills={applicant?.skills || []}
          email={applicant?.email || null}
          country_code={applicant?.country_code || null}
          mobile_number={applicant?.mobile_number || null}
          experience={applicant?.experience}
          current_company={applicant?.current_company}
          location={applicant?.location}
          current_ctc={applicant?.current_ctc}
          user_id={applicant?.user_id}
          application_id={applicant?.application_id}
          application_status={applicant?.application_status}
          additionalDetailsStatus={applicant?.additionalDetailsStatus}
          notice_period={applicant?.notice_period}
        />
      ))}
    </div>
  );
}
