"use client";

import { Icon } from "@iconify/react";
import Filters from "./filters";

interface FilterSidebarProps {
  selectedFilters: string[];
  onFilterChange: (filters: string[]) => void;
  onRefresh: () => void;
}

export default function FilterSidebar({
  selectedFilters,
  onFilterChange,
  onRefresh,
}: FilterSidebarProps) {
  return (
    <div className="hidden lg:flex bg-white rounded-3xl shadow-sm sticky max-h-[calc(100vh-100px)] top-20 w-60 flex-col overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-2">
          <Icon
            icon="material-symbols-light:filter-alt-outline"
            className="text-primary-600 size-5"
          />
          <span className="text-base font-semibold text-gray-900">Filter</span>
        </div>
        <button
          onClick={onRefresh}
          aria-label="Refresh filters"
          className="cursor-pointer"
        >
          <Icon
            icon="mdi:refresh"
            className="text-gray-500 size-5 hover:text-gray-700 transition-colors"
          />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <Filters
          selectedFilters={selectedFilters}
          onFilterChange={onFilterChange}
        />
      </div>
    </div>
  );
}
