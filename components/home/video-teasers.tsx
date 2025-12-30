"use client";

import { motion } from "framer-motion";
import { Play, Volume2, VolumeX } from "lucide-react";
import { useState, useRef } from "react";

interface VideoCardProps {
  badge: string;
  title: string;
  bgColor: string;
  textColor: string;
  videoSrc: string;
}

function VideoCard({
  badge,
  title,
  bgColor,
  textColor,
  videoSrc,
}: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      setCurrentTime(current);
      if (total > 0) {
        setProgress((current / total) * 100);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const progressBar = e.currentTarget;
      const clickPosition =
        e.clientX - progressBar.getBoundingClientRect().left;
      const progressBarWidth = progressBar.clientWidth;
      const clickPercentage = clickPosition / progressBarWidth;
      const newTime = clickPercentage * videoRef.current.duration;
      videoRef.current.currentTime = newTime;
      setProgress(clickPercentage * 100);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time) || !isFinite(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="group cursor-pointer">
      <div className="relative aspect-video rounded-3xl overflow-hidden bg-linear-to-b from-gray-300 to-gray-400 shadow-lg hover:shadow-xl transition-shadow duration-300">
        {/* Video Element */}
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onClick={togglePlay}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>

        {/* Play Button Overlay - Show when not playing */}
        {!isPlaying && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-linear-to-b from-gray-300/80 to-gray-400/80"
            onClick={togglePlay}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300"
            >
              <Play
                className={`w-6 h-6 ml-1 ${textColor}`}
                fill="currentColor"
              />
            </motion.div>
          </div>
        )}

        {/* Bottom Content - Show when not playing */}
        {!isPlaying && (
          <div className="absolute bottom-0 left-0 right-0 p-6 pointer-events-none">
            <span
              className={`${bgColor} text-white text-[10px] px-2.5 py-1 rounded uppercase font-bold tracking-wider mb-2 inline-block`}
            >
              {badge}
            </span>
            <h4 className="text-white font-bold text-lg">{title}</h4>
          </div>
        )}

        {/* Video Controls - Show when playing */}
        {isPlaying && (
          <div
            className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="text-white hover:text-white/80"
              >
                {isPlaying ? (
                  <div className="w-4 h-4 bg-white rounded-sm" />
                ) : (
                  <Play className="w-5 h-5" fill="currentColor" />
                )}
              </button>

              {/* Progress Bar */}
              <div
                className="flex-1 h-1.5 bg-white/30 rounded-full overflow-hidden cursor-pointer"
                onClick={handleProgressClick}
              >
                <div
                  className="h-full bg-white rounded-full transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Mute */}
              <button
                onClick={toggleMute}
                className="text-white hover:text-white/80"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>

              {/* Time */}
              <span className="text-sm text-white/80 font-mono min-w-[70px] text-right">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VideoTeasers() {
  const videos = [
    {
      badge: "Demo",
      title: "The Candidate Experience",
      bgColor: "bg-primary",
      textColor: "text-primary",
      videoSrc:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      caption: '"Found a role in 3 days using my Python score." — Sarah K.',
    },
    {
      badge: "Product Tour",
      title: "The Recruiter Workflow",
      bgColor: "bg-secondary",
      textColor: "text-secondary",
      videoSrc:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      caption:
        '"Reduced our time-to-hire by 60%." — Talent Acquisition, TechCorp',
    },
  ];

  return (
    <section className="py-24 px-6 bg-card">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            See the Platform in Action
          </h2>
          <p className="text-subtle max-w-xl">
            Watch how we bridge the gap between talented individuals and the
            world&apos;s leading tech companies.
          </p>
        </div>

        {/* Video Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {videos.map((video, index) => (
            <motion.div
              key={video.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <VideoCard {...video} />
              <p className="text-sm text-subtle text-center font-medium italic mt-4">
                {video.caption}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
