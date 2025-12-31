"use client";

import { cn } from "@/lib/utils";
import AssessmentIntroduction from "./step-content/introduction";
import SyllabusAndTopics from "./step-content/syllabus-and-topics";
import ExamProcess from "./step-content/exam-process";
import ScoreVisibilityAndPrivacy from "./step-content/score-visibility-and-privacy";
import IntegrityAndCodeConduct from "./step-content/integrity-and-code-conduct";
import FinalStartSection from "./step-content/final-section";

interface Topic {
  id: string;
  value: string;
}

export interface Assessment {
  id: string;
  assessmentId: string;
  title: string;
  slug: string;
  category: string;
  topics: Topic[];
  difficultyLevel?: "Beginner" | "Intermediate" | "Advanced" | "Not Applicable";
  duration?: number; // seconds
  totalQuestions?: number;
  status?: "PUBLISHED" | "SUBSCRIBED";
  job_role_id?: string;
  job_role_name?: string;
}

interface StepContentProps {
  currentStep: number;
  className?: string;
  isCurrentStepConfirmed: boolean;
  onCurrentStepConfirmChange: (isConfirmed: boolean) => void;
  assessment: Assessment;
}

export default function StepContent({
  currentStep,
  className,
  isCurrentStepConfirmed,
  onCurrentStepConfirmChange,
  assessment,
}: StepContentProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {/* Main Content */}
      <div className="bg-white border border-gray-200 rounded-2xl p-3 md:p-4 lg:min-h-96 mb-4">
        {currentStep === 1 && (
          <AssessmentIntroduction assessment={assessment} />
        )}

        {currentStep === 2 && (
          <SyllabusAndTopics
            isConfirmed={isCurrentStepConfirmed}
            onConfirmChange={onCurrentStepConfirmChange}
            topics={assessment.topics}
          />
        )}

        {currentStep === 3 && (
          <ExamProcess
            isConfirmed={isCurrentStepConfirmed}
            onConfirmChange={onCurrentStepConfirmChange}
          />
        )}

        {currentStep === 4 && (
          <ScoreVisibilityAndPrivacy
            isConfirmed={isCurrentStepConfirmed}
            onConfirmChange={onCurrentStepConfirmChange}
          />
        )}

        {currentStep === 5 && (
          <IntegrityAndCodeConduct
            isConfirmed={isCurrentStepConfirmed}
            onConfirmChange={onCurrentStepConfirmChange}
          />
        )}

        {currentStep === 6 && <FinalStartSection />}
      </div>
    </div>
  );
}
