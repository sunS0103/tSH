"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

interface OptionItem {
  id: string;
  value: string;
  title?: string;
}

interface FilterGroup {
  title: string;
  items: OptionItem[];
}

interface ApplicantsFilterSidebarProps {
  filterItems: FilterGroup[];
  selectedFilters: string[];
  onFilterChange: (filters: string[]) => void;
  onRefresh: () => void;
  className?: string;
}

export default function ApplicantsFilterSidebar({
  filterItems,
  selectedFilters,
  onFilterChange,
  onRefresh,
  className,
}: ApplicantsFilterSidebarProps) {
  const handleCheckboxChange = (value: string, checked: boolean) => {
    if (checked) {
      onFilterChange([...selectedFilters, value]);
    } else {
      onFilterChange(selectedFilters.filter((f) => f !== value));
    }
  };

  return (
    <div
      className={cn(
        "hidden lg:flex bg-white rounded-3xl shadow-sm border border-gray-100 sticky top-22 h-[calc(100vh-100px)] min-w-64 max-w-72 flex-col overflow-hidden",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0 bg-white z-10">
        <div className="flex items-center gap-2.5">
          <Icon
            icon="material-symbols-light:filter-alt-outline"
            className="text-primary-600 size-5"
          />
          <span className="text-base font-bold text-gray-900">Filter</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onRefresh}
          className="h-8 w-8 hover:bg-gray-100 rounded-full"
          title="Reset filters"
        >
          <Icon
            icon="mdi:refresh"
            className="text-gray-500 size-4.5 hover:text-gray-700 transition-colors"
          />
        </Button>
      </div>

      {/* Filter Groups */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        <div className="w-full">
          <Accordion
            type="multiple"
            className="w-full"
            defaultValue={["STATUS"]}
          >
            {filterItems.map((group) => {
              return (
                <AccordionItem
                  key={group.title}
                  value={group.title}
                  className="border-gray-100"
                >
                  <div className="py-0">
                    <AccordionTrigger className="px-4 py-3 text-sm font-semibold uppercase text-gray-900 hover:no-underline hover:bg-gray-50/50">
                      {group.title.replace(/_/g, " ")}
                    </AccordionTrigger>
                  </div>
                  <AccordionContent className="px-4 pb-3 pt-0 text-sm text-gray-700">
                    <div className="flex flex-col gap-3 mt-2">
                      {group.items.map((item) => (
                        <div
                          key={item.value}
                          className="flex items-center gap-2"
                        >
                          <Checkbox
                            id={item.value}
                            checked={selectedFilters.includes(item.value)}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange(
                                item.value,
                                checked as boolean
                              )
                            }
                            className="cursor-pointer"
                          />
                          <label
                            htmlFor={item.value}
                            className="cursor-pointer max-w-48 text-sm font-normal"
                          >
                            {item.title || item.value}
                          </label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
