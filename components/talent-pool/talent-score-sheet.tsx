import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

interface AssessmentDetail {
  name: string;
  score: number;
  skills: string[];
}

// Mock data for the sheet content since accurate per-talent data isn't in the main props yet
const MOCK_ASSESSMENT_DETAILS: AssessmentDetail[] = [
  {
    name: "Assessment Name 1",
    score: 45,
    skills: [
      "Python",
      "Python",
      "Python",
      "Python",
      "Machine Learning",
      "Machine Learning",
      "Machine Learning",
      "Machine Learning",
      "Python",
      "Python",
      "Python",
      "Machine Learning",
    ],
  },
  {
    name: "Assessment Name 2",
    score: 45,
    skills: [
      "Python",
      "Python",
      "Python",
      "Python",
      "Machine Learning",
      "Machine Learning",
      "Machine Learning",
      "Machine Learning",
      "Python",
      "Python",
      "Python",
      "Machine Learning",
    ],
  },
  {
    name: "Assessment Name 3",
    score: 45,
    skills: [
      "Python",
      "Python",
      "Python",
      "Python",
      "Machine Learning",
      "Machine Learning",
      "Machine Learning",
      "Machine Learning",
      "Python",
      "Python",
      "Python",
      "Machine Learning",
    ],
  },
];

interface TalentScoreSheetProps {
  children: React.ReactNode;
}

export default function TalentScoreSheet({ children }: TalentScoreSheetProps) {
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

        <div className="flex flex-col gap-4 px-6">
          {MOCK_ASSESSMENT_DETAILS.map((assessment, index) => (
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
                <div className="flex flex-wrap gap-2">
                  {assessment.skills.map((skill, idx) => (
                    <div
                      key={idx}
                      className="px-3 py-1 rounded-full border border-gray-700 bg-white"
                    >
                      <span className="text-black text-xs font-normal font-sans">
                        {skill}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
