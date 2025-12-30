"use client";

import { Play } from "lucide-react";
import CommonVideoSection from "@/components/common/video-section";

const VideoSection = () => {
  return (
    <CommonVideoSection
      badge={{
        text: "Product Demo",
        icon: Play,
      }}
      title={
        <>
          See How Recruiters Hire Smarter
          <br />
          <span className="gradient-text">with TechSmartHire</span>
        </>
      }
      subtitle="Discover our platform's powerful features for finding pre-verified candidates"
      videoSrc="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
      posterSrc="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
      caption="Watch how top companies reduce time-to-hire with skill-based recruiting"
    />
  );
};

export default VideoSection;
