import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

export default function JobFair() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center p-6  relative">
      <div className="max-w-2xl w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
        {/* Text Content */}
        <div className="space-y-4">
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900">
            Job Fair Coming Soon
          </h1>
          <p className="text-lg text-slate-900 leading-relaxed max-w-md mx-auto">
            We're putting the finishing touches on a new way to connect. Full
            launch scheduled for{" "}
            <span className="text-gray-900 font-medium">March</span>.
          </p>
        </div>

        {/* Minimal Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200 text-gray-600 text-sm font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
          </span>
          Early Access Active
        </div>
      </div>
    </div>
  );
}
