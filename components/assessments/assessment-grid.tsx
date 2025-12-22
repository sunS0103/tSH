import AssessmentCard from "./assessment-card";

interface Assessment {
  icon: string;
  category: string;
  title: string;
  topics: string[];
  duration: string;
  questionCount: number;
  link?: string;
}

interface AssessmentGridProps {
  assessments: Assessment[];
}

export default function AssessmentGrid({ assessments }: AssessmentGridProps) {
  if (assessments.length === 0) {
    return (
      <div className="col-span-full text-center py-12 text-gray-500">
        No assessments found matching your criteria.
      </div>
    );
  }

  return (
    <>
      {assessments.map((assessment, index) => (
        <AssessmentCard
          key={`${assessment.title}-${index}`}
          icon={assessment.icon}
          category={assessment.category}
          title={assessment.title}
          topics={assessment.topics}
          duration={assessment.duration}
          questionCount={assessment.questionCount}
          link={assessment.link || "/assessment"}
        />
      ))}
    </>
  );
}
