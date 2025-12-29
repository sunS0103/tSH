import Hero from "@/components/home/hero";
import TrustStrip from "@/components/home/trust-strip";
import HowItWorks from "@/components/home/how-it-works";
import VideoTeasers from "@/components/home/video-teasers";
import CTASection from "@/components/home/cta-section";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <HowItWorks />
      <VideoTeasers />
      <CTASection />
    </>
  );
}
