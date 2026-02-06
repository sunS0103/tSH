"use client";

import { cn } from "@/lib/utils";
import Logo from "@/components/logo";

interface LoaderProps {
  className?: string;
  show?: boolean;
}

export function Loader({ className, show = true }: LoaderProps) {
  if (!show) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-100 flex items-center justify-center bg-background/20 backdrop-blur-md",
        className
      )}
    >
      <div className="relative flex flex-col items-center justify-center gap-4">
        <Logo className="w-48 h-auto animate-bounce" />
      </div>
    </div>
  );
}
