import NoDataFound from "../common/no-data-found";
import AssessmentRecruiterCard from "./assessment-recruiter-card";

interface Topics {
  id: string;
  value: string;
}

interface Assessment {
  id: string;
  title: string;
  slug: string;
  category: string;
  difficulty_level: "Beginner" | "Intermediate" | "Advanced" | "Not Applicable";
  duration: number; // seconds
  total_questions: number;
  status: "PUBLISHED" | "SUBSCRIBED";
  job_role_id: string;
  job_role_name: string;
  topics: Topics[];
  technology?: string; // Technology name for icon
}

interface AssessmentRecruiterGridProps {
  assessments: Assessment[];
}

export default function AssessmentRecruiterGrid({
  assessments,
}: AssessmentRecruiterGridProps) {
  if (assessments.length === 0) {
    return (
      <div className="col-span-full text-center py-12 text-gray-500">
        <NoDataFound note="No assessments found matching your criteria." />
      </div>
    );
  }

  return (
    <>
      {assessments.map((assessment, index) => (
        <AssessmentRecruiterCard
          key={`${assessment.id}-${index}`}
          category={assessment.category}
          title={assessment.title}
          topics={assessment.topics}
          duration={assessment.duration}
          questionCount={assessment.total_questions}
          // slug={assessment.slug}
          technology={assessment.technology || assessment.job_role_name}
        />
      ))}
    </>
  );
}
