import Footer from "@/components/footer";
import TalentPoolPage from "@/components/talent-pool/talent-pool-page";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <>
      <TalentPoolPage />
      <Footer />
    </>
  );
}
