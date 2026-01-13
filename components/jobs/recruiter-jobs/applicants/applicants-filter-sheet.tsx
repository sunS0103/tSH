"use client";

import { Icon } from "@iconify/react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";

interface OptionItem {
  id: string;
  value: string;
  title?: string;
}

interface FilterGroup {
  title: string;
  items: OptionItem[];
}

interface ApplicantsFilterSheetProps {
  filterItems: FilterGroup[];
  selectedFilters: string[];
  onFilterChange: (filters: string[]) => void;
  onRefresh: () => void;
}

export default function ApplicantsFilterSheet({
  filterItems,
  selectedFilters,
  onFilterChange,
  onRefresh,
}: ApplicantsFilterSheetProps) {
  const handleCheckboxChange = (value: string, checked: boolean) => {
    if (checked) {
      onFilterChange([...selectedFilters, value]);
    } else {
      onFilterChange(selectedFilters.filter((f) => f !== value));
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="Open filter menu"
          className="lg:hidden border border-gray-200 p-1.5 rounded-md hover:bg-gray-50"
        >
          <Icon
            icon="material-symbols:filter-alt-outline"
            className="size-5 text-gray-700"
          />
        </button>
      </SheetTrigger>
      <SheetContent className="rounded-l-2xl max-w-64">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon
                icon="material-symbols-light:filter-alt-outline"
                className="text-primary-600 size-5"
              />
              <span className="text-base font-semibold text-gray-900">
                Filter
              </span>
            </div>
            <Button
              type="button"
              onClick={onRefresh}
              aria-label="Refresh filters"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
            >
              <Icon
                icon="mdi:refresh"
                className="size-4 text-gray-500"
                aria-hidden="true"
              />
            </Button>
          </SheetTitle>
        </SheetHeader>
        <div className="h-[calc(100dvh-80px)] overflow-auto">
          <Accordion
            type="multiple"
            className="w-full"
            defaultValue={["STATUS"]}
          >
            {filterItems.map((group) => (
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
                      <div key={item.value} className="flex items-center gap-2">
                        <Checkbox
                          id={`mobile-${item.value}`}
                          checked={selectedFilters.includes(item.value)}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange(item.value, checked as boolean)
                          }
                          className="cursor-pointer"
                        />
                        <label
                          htmlFor={`mobile-${item.value}`}
                          className="cursor-pointer max-w-48 text-sm font-normal"
                        >
                          {item.title || item.value}
                        </label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </SheetContent>
    </Sheet>
  );
}
