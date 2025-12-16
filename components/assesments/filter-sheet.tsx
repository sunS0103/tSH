"use client";

import { Icon } from "@iconify/react";
import Filters from "@/components/assesments/filters";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";

interface FilterSheetProps {
  selectedFilters: string[];
  onFilterChange: (filters: string[]) => void;
  onRefresh: () => void;
}

export default function FilterSheet({
  selectedFilters,
  onFilterChange,
  onRefresh,
}: FilterSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="Open filter menu"
          className="lg:hidden border-black border p-1.5 rounded-md"
        >
          <Icon icon="material-symbols:filter-alt-outline" />
        </button>
      </SheetTrigger>
      <SheetContent className="rounded-l-2xl max-w-64!">
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
              size="icon-sm"
            >
              <Icon
                icon="mdi:refresh"
                className="size-4 text-gray-500"
                aria-hidden="true"
              />
            </Button>
          </SheetTitle>
        </SheetHeader>
        <Filters
          selectedFilters={selectedFilters}
          onFilterChange={onFilterChange}
        />
      </SheetContent>
    </Sheet>
  );
}
