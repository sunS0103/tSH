import CreditsOverview from "@/components/credits/credits-overview";
import CreditsPackages from "@/components/credits/credits-packages";
import Footer from "@/components/footer";

export default function CreditsPage() {
  return (
    <>
      <div className="flex flex-col md:flex-row gap-6 pb-6">
        <CreditsOverview />

        <div className="w-full overflow-x-hidden">
          <h2
            className="text-2xl font-bold"
            style={{
              background: "linear-gradient(180deg, #5245E5 0%, #9134EA 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Plans & Pricing
          </h2>
          <CreditsPackages />
        </div>
      </div>
      <Footer />
    </>
  );
}
