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
import TalentFilters, { FilterGroup } from "./talent-filters";

interface TalentFilterSheetProps {
  groups: FilterGroup[];
  selectedFilters: string[];
  onFilterChange: (filters: string[]) => void;
  onRefresh: () => void;
  onLocationDataUpdate?: (locationMap: Map<string, string>) => void;
  locationIdToTitleMap?: Map<string, string>;
}

export default function TalentFilterSheet({
  groups,
  selectedFilters,
  onFilterChange,
  onRefresh,
  onLocationDataUpdate,
  locationIdToTitleMap,
}: TalentFilterSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="lg:hidden h-10 w-10 bg-white border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 shrink-0"
        >
          <Icon icon="material-symbols:filter-alt-outline" className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="rounded-l-2xl max-w-xs p-0 flex flex-col h-full bg-white"
      >
        <SheetHeader className="px-5 py-4 border-b border-gray-100 flex-none">
          <SheetTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Icon
                icon="material-symbols-light:filter-alt-outline"
                className="text-primary-600 size-5"
              />
              <span className="text-base font-bold text-gray-900 font-sans">
                Filter
              </span>
            </div>
            <Button
              type="button"
              onClick={onRefresh}
              aria-label="Refresh filters"
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-gray-100 rounded-full"
            >
              <Icon
                icon="mdi:refresh"
                className="size-4.5 text-gray-500 hover:text-gray-700"
                aria-hidden="true"
              />
            </Button>
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          <TalentFilters
            groups={groups}
            selectedFilters={selectedFilters}
            onFilterChange={onFilterChange}
            onLocationDataUpdate={onLocationDataUpdate}
            locationIdToTitleMap={locationIdToTitleMap}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
