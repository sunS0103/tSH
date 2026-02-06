import AssessmentRecruiterRequestedCard from "./assessment-recruiter-requested-card";

export interface RequestedAssessment {
  id: string;
  assessment_title?: string;
  name?: string;
  company_email?: string;
  skills_to_assess?: string;
  mobile_number?: string;
  assessment_creation_preference?: string;
  job_description?: string;
  custom_instructions?: string;
  // Fallback fields in case API uses different naming
  title?: string;
  candidate_name?: string;
  email?: string;
  skills?: string;
  phone?: string;
  preference?: string;
  jobDescription?: string;
  customInstructions?: string;
}

interface AssessmentRecruiterRequestedGridProps {
  assessments: RequestedAssessment[];
}

export default function AssessmentRecruiterRequestedGrid({
  assessments,
}: AssessmentRecruiterRequestedGridProps) {
  if (assessments.length === 0) {
    return (
      <div className="col-span-full text-center py-12 text-gray-500">
        No requested assessments found matching your criteria.
      </div>
    );
  }

  return (
    <>
      {assessments.map((assessment) => {
        // Handle different possible field names from API
        const assessmentName = assessment.assessment_title || "Assessment name";
        const name = assessment.name || "-";
        const companyEmail = assessment.company_email || "-";
        const skillsToAssess = assessment.skills_to_assess || "-";
        const phoneNumber = assessment.mobile_number || "-";
        const assessmentCreationPreference =
          assessment.assessment_creation_preference || "-";
        const jobDescription = assessment.job_description || "-";
        const customInstructions = assessment.custom_instructions || "-";

        return (
          <AssessmentRecruiterRequestedCard
            key={assessment.id}
            id={assessment.id}
            assessmentName={assessmentName}
            name={name}
            companyEmail={companyEmail}
            skillsToAssess={skillsToAssess}
            phoneNumber={phoneNumber}
            assessmentCreationPreference={assessmentCreationPreference}
            jobDescription={jobDescription}
            customInstructions={customInstructions}
          />
        );
      })}
    </>
  );
}
