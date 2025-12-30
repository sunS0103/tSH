"use client";

import { Play } from "lucide-react";
import CommonVideoSection from "@/components/common/video-section";

const VideoSection = () => {
  return (
    <CommonVideoSection
      title={
        <span className="inline-flex items-center gap-3">
          <Play className="w-8 h-8 text-primary" fill="currentColor" />
          See How Candidates Get Hired on TechSmartHire
        </span>
      }
      subtitle="Watch a 60-second overview of the candidate journey"
      videoSrc="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
      posterSrc="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop"
    />
  );
};

export default VideoSection;
