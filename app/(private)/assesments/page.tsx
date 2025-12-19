import AssessmentsPageWrapper from "@/components/assesments/assessments-page-wrapper";
import Footer from "@/components/footer";
import { ASSESSMENTS_DATA } from "@/lib/data/assessments";

export default function AssesmentPage() {
  return (
    <>
      <AssessmentsPageWrapper assessments={ASSESSMENTS_DATA} />
      <Footer />
    </>
  );
}
