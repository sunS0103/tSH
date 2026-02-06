import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { type AssessmentTaken } from "@/api/recruiter/talent-pool";

interface TalentScoreSheetProps {
  children: React.ReactNode;
  assessments: AssessmentTaken[];
}

export default function TalentScoreSheet({
  children,
  assessments,
}: TalentScoreSheetProps) {
  // Transform assessment data to include skills
  const assessmentDetails = assessments.map((assessment) => {
    // Get unique skills from skills_assessed
    const skills = assessment.skills_assessed.map((skill) => skill.skill_name);

    return {
      name: assessment.assessment_title,
      score: assessment.score_percentage,
      skills,
      completedAt: assessment.completed_at,
    };
  });

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="text-left w-full hover:opacity-80 transition-opacity">
          {children}
        </button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto w-full max-w-full sm:max-w-2xl md:max-w-3xl sm:rounded-l-2xl">
        <SheetHeader className="px-6 pt-6">
          <SheetTitle className="text-2xl font-bold font-sans text-gray-900">
            Total Score
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-4 px-6 pb-6">
          {assessmentDetails.length > 0 ? (
            assessmentDetails.map((assessment, index) => (
              <div
                key={index}
                className="rounded-2xl border border-gray-100 p-4 flex flex-col gap-4 shadow-sm"
              >
                <div className="flex justify-between items-center w-full border-b border-gray-100 pb-3">
                  <h3 className="text-lg font-semibold text-black font-sans">
                    {assessment.name}
                  </h3>
                  <span className="text-primary-500 font-medium text-sm font-sans">
                    {assessment.score}%
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-gray-900 text-sm font-medium font-sans">
                    Skill Assessed
                  </span>
                  {assessment.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {assessment.skills.map((skill, idx) => (
                        <div
                          key={idx}
                          className="px-3 py-1 rounded-full border border-gray-700 bg-white flex justify-center items-center"
                        >
                          <span className="text-black text-xs font-normal font-sans capitalize">
                            {skill}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-500 text-sm font-sans">
                      No skills assessed
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500 font-sans">
              No assessments available
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
