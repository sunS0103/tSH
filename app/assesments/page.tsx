import AssessmentsPageWrapper from "@/components/assesments/assessments-page-wrapper";
import { ASSESSMENTS_DATA } from "@/lib/data/assessments";

export default function AssesmentPage() {
  return <AssessmentsPageWrapper assessments={ASSESSMENTS_DATA} />;
}
