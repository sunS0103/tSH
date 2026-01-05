"use client";

import { Icon } from "@iconify/react";
import TalentFilters, { FilterGroup } from "./talent-filters";
import { Button } from "@/components/ui/button";

interface TalentFilterSidebarProps {
  groups: FilterGroup[];
  selectedFilters: string[];
  onFilterChange: (filters: string[]) => void;
  onRefresh: () => void;
}

export default function TalentFilterSidebar({
  groups,
  selectedFilters,
  onFilterChange,
  onRefresh,
}: TalentFilterSidebarProps) {
  return (
    <div className="hidden lg:flex bg-white rounded-3xl shadow-sm border border-gray-100 sticky top-22 h-[calc(100vh-100px)] min-w-64 max-w-72 flex-col overflow-hidden">
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
      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        <TalentFilters
          groups={groups}
          selectedFilters={selectedFilters}
          onFilterChange={onFilterChange}
        />
      </div>
    </div>
  );
}
