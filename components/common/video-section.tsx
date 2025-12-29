"use client";

import { motion } from "framer-motion";
import { Play, Volume2, VolumeX, LucideIcon } from "lucide-react";
import { useState, useRef, useEffect, ReactNode } from "react";

interface VideoSectionProps {
  title: ReactNode;
  subtitle: string;
  badge?: {
    text: string;
    icon: LucideIcon;
  };
  videoSrc: string;
  posterSrc: string;
  caption?: string;
}

const CommonVideoSection = ({
  title,
  subtitle,
  badge,
  videoSrc,
  posterSrc,
  caption,
}: VideoSectionProps) => {
  const [isHovered, setIsHovered] = useState(false);
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
      // Check if duration is valid and non-zero to avoid division by zero
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;

      setCurrentTime(current);

      if (total > 0) {
        const progressValue = (current / total) * 100;
        setProgress(progressValue);
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

  /* Check if video metadata is already loaded on mount */
  useEffect(() => {
    if (videoRef.current && videoRef.current.readyState >= 1) {
      setDuration(videoRef.current.duration);
    }
  }, []);

  const formatTime = (time: number) => {
    if (!time || isNaN(time) || !isFinite(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <section className="py-24 relative overflow-hidden bg-white">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          {badge && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6">
              <badge.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{badge.text}</span>
            </div>
          )}

          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          <p className="text-muted-foreground text-lg">{subtitle}</p>
        </motion.div>

        {/* Video container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div
            className="relative aspect-video rounded-3xl overflow-hidden cursor-pointer group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Video content */}
            <div className="absolute inset-0 bg-black group">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                poster={posterSrc}
                onClick={togglePlay}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
              >
                <source src={videoSrc} type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Center Play Button Overlay */}
              {!isPlaying && (
                <div
                  className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer"
                  onClick={togglePlay}
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-16 h-16 rounded-full border border-white text-primary-foreground flex items-center justify-center shadow-lg backdrop-blur-sm hover:scale-110 transition-transform"
                  >
                    <Play className="w-6 h-6 ml-1" fill="currentColor" />
                  </motion.div>
                </div>
              )}

              {/* Custom Bottom Controls */}
              <div
                className="absolute bottom-0 left-0 right-0 p-6 bg-linear-to-t from-foreground/60 to-transparent transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="peer flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/20 cursor-pointer text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                    onClick={togglePlay}
                  >
                    {!isPlaying ? (
                      <Play className="w-5 h-5" fill="currentColor" />
                    ) : (
                      <div className="w-4 h-4 bg-current rounded-xs" />
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div
                    className="flex-1 h-1.5 bg-primary-foreground/30 rounded-full overflow-hidden cursor-pointer relative"
                    onClick={handleProgressClick}
                  >
                    <div
                      className="absolute top-0 left-0 h-full bg-primary-foreground rounded-full transition-all duration-100"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleMute}
                      className="text-primary-foreground/80 hover:text-primary-foreground"
                    >
                      {isMuted ? (
                        <VolumeX className="w-5 h-5" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </button>
                    <span className="text-sm text-primary-foreground/80 font-mono min-w-[80px] text-right">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {caption && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center text-muted-foreground mt-6 text-sm"
          >
            {caption}
          </motion.p>
        )}
      </div>
    </section>
  );
};

export default CommonVideoSection;
