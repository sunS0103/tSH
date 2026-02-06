import { Icon } from "@iconify/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function ScoreInterpretationPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors group">
          <Icon 
            icon="mdi:information-outline" 
            className="size-5 group-hover:scale-110 transition-transform" 
          />
          <span className="text-sm font-medium">Score Interpretation</span>
        </button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[400px] p-0 border-gray-200 shadow-xl" 
        align="start"
        sideOffset={8}
      >
        <div className="p-5">
          {/* Header */}
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
            <Icon 
              icon="mdi:chart-box-outline" 
              className="size-6 text-primary-500" 
            />
            <h3 className="text-lg font-bold text-gray-900">
              📊 Score Bands
            </h3>
          </div>

          {/* Score Bands */}
          <div className="space-y-4">
            {/* Intermediate */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <h4 className="text-sm font-semibold text-gray-900">
                  Intermediate (40.01 – 60)
                </h4>
              </div>
              <p className="text-xs text-gray-600 pl-3.5 leading-relaxed">
                Indicates foundational knowledge with growing hands-on skills.
              </p>
              <p className="text-xs text-gray-500 pl-3.5 italic">
                Suitable for junior roles, trainees, and early career positions.
              </p>
            </div>

            {/* Experienced */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <h4 className="text-sm font-semibold text-gray-900">
                  Experienced (60.01 – 75)
                </h4>
              </div>
              <p className="text-xs text-gray-600 pl-3.5 leading-relaxed">
                Indicates strong working knowledge and good practical exposure.
              </p>
              <p className="text-xs text-gray-500 pl-3.5 italic">
                Suitable for mid-level roles and independent contributors.
              </p>
            </div>

            {/* Expert */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <h4 className="text-sm font-semibold text-gray-900">
                  Expert (75.01 – 90)
                </h4>
              </div>
              <p className="text-xs text-gray-600 pl-3.5 leading-relaxed">
                Indicates deep technical expertise and strong problem-solving ability.
              </p>
              <p className="text-xs text-gray-500 pl-3.5 italic">
                Suitable for senior roles, lead engineers, and critical projects.
              </p>
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-4 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center">
              Scores are calculated based on assessment performance
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
