"use client";

import { cn } from "@/lib/utils";
import AssessmentIntroduction from "./step-content/introduction";
import SyllabusAndTopics from "./step-content/syllabus-and-topics";
import ExamProcess from "./step-content/exam-process";
import ScoreVisibilityAndPrivacy from "./step-content/score-visibility-and-privacy";
import IntegrityAndCodeConduct from "./step-content/integrity-and-code-conduct";
import FinalStartSection from "./step-content/final-section";
import { Payment } from "./step-content/payment-cards";

interface Topic {
  id: string;
  value: string;
}

export interface Assessment {
  id: string;
  assessment_id: string;
  title: string;
  slug: string;
  category: string;
  topics: Topic[];
  difficulty_level?:
    | "Beginner"
    | "Intermediate"
    | "Advanced"
    | "Not Applicable";
  duration?: number; // seconds
  total_questions?: number;
  status?: "PUBLISHED" | "SUBSCRIBED";
  job_role_id?: string;
  job_role_name?: string;
  user_assessment_id?: string;
  payment: {
    initial_paid: boolean;
    initial_payment_status: "PAID";
    package_type: "BASIC" | "PREMIUM" | "PLATINUM";
    purchase_status: "ACTIVE" | "INACTIVE";
    purchased_at: number;
  };
  candidate_status?:
    | "ON_GOING"
    | "INVITED"
    | "LATER"
    | "COMPLETED"
    | "ENROLLED"
    | "PENDING";
  is_free_plan_available: boolean;
  sample_question_pdf_link?: string;
}

interface StepContentProps {
  currentStep: number;
  className?: string;
  isCurrentStepConfirmed: boolean;
  onCurrentStepConfirmChange: (isConfirmed: boolean) => void;
  assessment: Assessment;
  onUserAssessmentIdChange?: ({
    id,
    payment,
  }: {
    id: string;
    payment: Payment;
  }) => void;
  assessmentPayment?: Payment | null;
}

export default function StepContent({
  currentStep,
  className,
  isCurrentStepConfirmed,
  onCurrentStepConfirmChange,
  assessment,
  onUserAssessmentIdChange,
  assessmentPayment,
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
            sample_question_pdf_link={assessment.sample_question_pdf_link}
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

        {currentStep === 6 && (
          <FinalStartSection
            assessment_id={assessment.assessment_id}
            payment={assessmentPayment || assessment.payment}
            onUserAssessmentIdChange={onUserAssessmentIdChange}
            candidate_status={assessment.candidate_status}
            is_free_plan_available={assessment.is_free_plan_available}
          />
        )}
      </div>
    </div>
  );
}
