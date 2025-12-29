import AssessmentsPageWrapper from "@/components/assessments/assessments-page-wrapper";
import Footer from "@/components/footer";
import { ASSESSMENTS_DATA } from "@/lib/data/assessments";

export const dynamic = "force-dynamic";

export default function AssesmentPage() {
  return (
    <>
      <AssessmentsPageWrapper assessments={ASSESSMENTS_DATA} />
      <Footer />
    </>
  );
}
