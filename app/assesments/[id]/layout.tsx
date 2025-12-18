import AssessmentDetailsHeader from "@/components/assessment-details/assessment-details-header";
import { getAssessmentBySlug } from "@/lib/data/assessments";
import { notFound } from "next/navigation";

interface AssessmentDetailPageProps {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}

export default async function Layout({
  params,
  children,
}: AssessmentDetailPageProps) {
  const { id } = await params;
  const assessment = getAssessmentBySlug(id);

  if (!assessment) {
    notFound();
  }

  return (
    <>
      <AssessmentDetailsHeader assessmentTitle={assessment.title} />
      {children}
    </>
  );
}
