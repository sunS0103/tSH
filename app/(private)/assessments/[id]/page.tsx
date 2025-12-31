import AssessmentWrapper from "@/components/assessment-details/assessment-wrapper";
import AssessmentDetailsHeader from "@/components/assessment-details/assessment-details-header";
import { getAssessmentBySlug } from "@/api/assessments";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface AssessmentDetailPageProps {
  params: { id: string };
}

export default async function Page({ params }: AssessmentDetailPageProps) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const assessment = await getAssessmentBySlug(id, token);

  if (!assessment) {
    notFound();
  }

  return (
    <>
      <AssessmentDetailsHeader
        assessmentTitle={assessment.data.title}
        assessmentDescription={assessment.data.assessment_description}
      />
      <AssessmentWrapper assessment={assessment.data} />
    </>
  );
}
