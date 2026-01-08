"use client";

import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface SortOption {
  value: string;
  label: string;
}

export interface SortDropdownProps {
  value: string;
  onValueChange: (value: string) => void;
  options: SortOption[];
  triggerClassName?: string;
  contentClassName?: string;
  align?: "start" | "center" | "end";
  icon?: string;
}

export function SortDropdown({
  value,
  onValueChange,
  options,
  triggerClassName,
  contentClassName,
  align = "end",
  icon = "mdi:sort-alphabetical-variant",
}: SortDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={
            triggerClassName ||
            "h-10 w-10 bg-white border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 shrink-0"
          }
        >
          <Icon icon={icon} className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        className={contentClassName || "w-56"}
      >
        <DropdownMenuRadioGroup value={value} onValueChange={onValueChange}>
          {options.map((option) => (
            <DropdownMenuRadioItem
              key={option.value}
              value={option.value}
              className="cursor-pointer [&>span:first-child]:text-primary-500"
            >
              <span className="font-sans">{option.label}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

