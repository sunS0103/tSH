"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface WorkMode {
  id: number;
  name: string;
}

interface WorkModeMultiSelectProps {
  value?: number[];
  onValueChange: (modeIds: number[]) => void;
  options: WorkMode[];
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

export function WorkModeMultiSelect({
  value = [],
  onValueChange,
  options,
  disabled = false,
  className,
  placeholder = "Select work modes",
}: WorkModeMultiSelectProps) {
  const selectedModes = options.filter((mode) => value.includes(mode.id));

  const handleToggle = (modeId: number) => {
    const currentValue = value || [];
    const isSelected = currentValue.includes(modeId);
    if (isSelected) {
      onValueChange(currentValue.filter((id) => id !== modeId));
    } else {
      onValueChange([...currentValue, modeId]);
    }
  };

  const getSelectedLabel = () => {
    if (selectedModes.length === 0) return placeholder;
    return selectedModes.map((mode) => mode.name).join(", ");
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          className={cn(
            "min-h-8 h-auto w-full justify-between border-gray-900 bg-white text-left font-normal py-2",
            "hover:bg-white",
            className
          )}
          disabled={disabled}
        >
          <span className="flex-1 text-wrap wrap-break-word pr-2">
            {getSelectedLabel()}
          </span>
          <Icon
            icon="material-symbols:keyboard-arrow-down-rounded"
            className="h-4 w-4 shrink-0 opacity-50"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[254px] p-0 bg-white border border-gray-200 rounded-2xl shadow-[0px_0px_25px_0px_rgba(0,0,0,0.15)]"
        align="start"
      >
        <div className="max-h-[300px] overflow-y-auto scrollbar-hide">
          {options.map((mode, index) => (
            <div
              key={mode.id}
              className={cn(
                "flex items-center gap-4 px-6 py-4 border-b border-gray-200 last:border-b-0 cursor-pointer hover:bg-gray-50",
                index === 0 && "rounded-t-2xl",
                index === options.length - 1 && "rounded-b-2xl"
              )}
              onClick={() => handleToggle(mode.id)}
            >
              <Checkbox
                checked={value.includes(mode.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    handleToggle(mode.id);
                  } else {
                    handleToggle(mode.id);
                  }
                }}
                className="size-5"
              />
              <Label className="text-base font-normal text-black cursor-pointer flex-1">
                {mode.name}
              </Label>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}


