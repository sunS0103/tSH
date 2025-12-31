import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "00:00";

  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const pad = (n: number) => n.toString().padStart(2, "0");

  // Show hours only if they exist
  return hrs > 0
    ? `${pad(hrs)}:${pad(mins)}:${pad(secs)}`
    : `${pad(mins)}:${pad(secs)}`;
}

/**
 * Converts seconds to a human-readable duration string
 * @param seconds - Duration in seconds
 * @returns Formatted string like "15 minutes", "1 hour", "1 hour 30 minutes", "10 mins"
 */
export function formatDurationWithSeconds(seconds: number): string {
  if (!seconds || seconds <= 0) {
    return "0 min";
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const parts: string[] = [];

  if (hours > 0) {
    parts.push(`${hours} ${hours === 1 ? "hr" : "hrs"}`);
  }

  if (minutes > 0) {
    parts.push(`${minutes} mins`);
  }

  // If less than a minute, show seconds
  if (hours === 0 && minutes === 0) {
    if (remainingSeconds > 0) {
      return `${remainingSeconds} ${
        remainingSeconds === 1 ? "second" : "seconds"
      }`;
    }
  }

  return parts.join(" ") || "0 mins";
}
