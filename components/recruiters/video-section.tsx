"use client";

import { Play } from "lucide-react";
import CommonVideoSection from "@/components/common/video-section";

const VideoSection = () => {
  return (
    <CommonVideoSection
      title={
        <span className="inline-flex items-center gap-3">
          <Play className="w-8 h-8 text-primary" fill="currentColor" />
          More Than Just Profiles - See It In Action
        </span>
      }
      subtitle="Watch how top companies reduce time-to-hire by 70% with skill-based recruiting"
      videoSrc="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
      posterSrc="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
      caption="Watch how top companies reduce time-to-hire by 70% with skill-based recruiting"
    />
  );
};

export default VideoSection;
