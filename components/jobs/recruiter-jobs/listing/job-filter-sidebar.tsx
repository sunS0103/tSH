import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface FilterGroup {
  id: string;
  label: string; // Maps to 'title' in user snippet
  options: FilterOption[]; // Maps to 'items' in user snippet
}

interface JobFilterSidebarProps {
  groups: FilterGroup[];
  selectedFilters: string[];
  onFilterChange: (filters: string[]) => void;
  onRefresh: () => void;
  className?: string;
}

export default function JobFilterSidebar({
  groups,
  selectedFilters,
  onFilterChange,
  onRefresh,
  className,
}: JobFilterSidebarProps) {
  const handleCheckboxChange = (id: string, checked: boolean) => {
    if (checked) {
      onFilterChange([...selectedFilters, id]);
    } else {
      onFilterChange(selectedFilters.filter((f) => f !== id));
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
            defaultValue={groups.map((g) => g.id)}
          >
            {groups.map((group) => (
              <AccordionItem
                key={group.id}
                value={group.id}
                className="border-gray-100"
              >
                <div className="py-0">
                  <AccordionTrigger className="px-4 py-3 text-sm font-semibold uppercase text-gray-900 hover:no-underline hover:bg-gray-50/50">
                    {group.label}
                  </AccordionTrigger>
                </div>
                <AccordionContent className="px-4 pb-3 pt-0 text-sm text-gray-700">
                  <div className="flex flex-col gap-3 mt-2">
                    {group.options.map((option) => {
                      const isSelected = selectedFilters.includes(option.id);
                      return (
                        <div
                          key={option.id}
                          className="flex items-center gap-2.5"
                        >
                          <Checkbox
                            id={`${group.id}-${option.id}`}
                            checked={isSelected}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange(
                                option.id,
                                checked as boolean
                              )
                            }
                            className="border-gray-300 data-[state=checked]:bg-primary-600 data-[state=checked]:border-primary-600"
                          />
                          <Label
                            htmlFor={`${group.id}-${option.id}`}
                            className="text-sm font-medium text-gray-700 leading-none cursor-pointer"
                          >
                            {option.label}
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
