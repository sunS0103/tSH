"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { LocationMultiSelect } from "./location-multi-select";

export interface FilterItem {
  id: string;
  value: string;
}

export interface FilterGroup {
  title: string;
  items: FilterItem[];
}

interface TalentFiltersProps {
  groups: FilterGroup[];
  selectedFilters: string[];
  onFilterChange: (filters: string[]) => void;
  onLocationDataUpdate?: (locationMap: Map<string, string>) => void;
  locationIdToTitleMap?: Map<string, string>;
}

export default function TalentFilters({
  groups,
  selectedFilters,
  onFilterChange,
  onLocationDataUpdate,
  locationIdToTitleMap,
}: TalentFiltersProps) {
  const handleCheckboxChange = (id: string, checked: boolean) => {
    if (checked) {
      onFilterChange([...selectedFilters, id]);
    } else {
      onFilterChange(selectedFilters.filter((filter) => filter !== id));
    }
  };

  return (
    <div className="w-full">
      <Accordion
        type="multiple"
        className="w-full"
        defaultValue={groups.map((g) => g.title)}
      >
        {groups.map((group) => (
          <AccordionItem
            key={group.title}
            value={group.title}
            className="border-gray-100"
          >
            <AccordionTrigger className="px-4 py-3 text-sm font-semibold uppercase text-gray-900 hover:no-underline hover:bg-gray-50/50">
              {group.title}
            </AccordionTrigger>

            <AccordionContent className="px-4 pb-3 pt-0 text-sm text-gray-700">
              {group.title === "Location" ? (
                <div className="mt-2">
                  <LocationMultiSelect
                    value={selectedFilters.filter(
                      (filterId) =>
                        group.items.some((item) => item.id === filterId) ||
                        locationIdToTitleMap?.has(filterId),
                    )}
                    onValueChange={(locationIds) => {
                      // Remove all location filters first (both from group.items and dynamically searched)
                      const otherFilters = selectedFilters.filter(
                        (filterId) =>
                          !group.items.some((item) => item.id === filterId) &&
                          !locationIdToTitleMap?.has(filterId),
                      );
                      // Add selected location filters (deduplicate)
                      const uniqueLocationIds = Array.from(
                        new Set(locationIds),
                      );
                      onFilterChange([...otherFilters, ...uniqueLocationIds]);
                    }}
                    onLocationDataUpdate={onLocationDataUpdate}
                    placeholder="Location"
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-3 mt-2">
                  {group.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-2.5">
                      <Checkbox
                        id={item.id}
                        checked={selectedFilters.includes(item.id)}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange(item.id, checked as boolean)
                        }
                        className="border-gray-300 data-[state=checked]:bg-primary-600 data-[state=checked]:border-primary-600"
                      />
                      <Label
                        htmlFor={item.id}
                        className="text-sm font-medium text-slate-700 leading-none cursor-pointer"
                      >
                        {item.value}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
