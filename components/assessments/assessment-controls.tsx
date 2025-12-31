"use client";

import { Icon } from "@iconify/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import FilterSheet from "./filter-sheet";

interface OptionItem {
  id: string;
  value: string;
}

// Technology wrapper
interface TechnologyBlock {
  technology: OptionItem[];
}

// Skills wrapper
interface SkillsBlock {
  skills: OptionItem[];
}

// Final API response type
type TechnologySkillsResponse = Array<TechnologyBlock | SkillsBlock>;

interface AssessmentControlsProps {
  selectedTab: string;
  searchQuery: string;
  selectedFilters: string[];
  onTabChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onFilterChange: (filters: string[]) => void;
  onRefreshFilters: () => void;
  filterItem: TechnologySkillsResponse;
}

export default function AssessmentControls({
  selectedTab,
  searchQuery,
  selectedFilters,
  onTabChange,
  onSearchChange,
  onFilterChange,
  onRefreshFilters,
  filterItem,
}: AssessmentControlsProps) {
  return (
    <div className="md:flex md:justify-between md:items-center">
      <Tabs value={selectedTab} onValueChange={onTabChange}>
        <TabsList className="rounded-full bg-white border border-gray-200">
          <TabsTrigger
            value="all"
            className="aria-selected:text-primary rounded-full"
          >
            All Assessments
          </TabsTrigger>
          <TabsTrigger
            value="taken"
            className="aria-selected:text-primary rounded-full"
          >
            Assessments Taken
          </TabsTrigger>
        </TabsList>
        {/* Tabs content for all and taken assessments for screen readers */}
        <TabsContent value="all" className="sr-only">
          <span>All assessments filter</span>
        </TabsContent>
        <TabsContent value="taken" className="sr-only">
          <span>Taken assessments filter</span>
        </TabsContent>
      </Tabs>
      <div className="md:w-3xs my-3 md:my-0 flex justify-center md:justify-start gap-3">
        <InputGroup className="h-8">
          <InputGroupInput
            placeholder="Search Here..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search assessments"
          />
          <InputGroupAddon>
            <Icon icon="material-symbols:search" aria-hidden="true" />
          </InputGroupAddon>
        </InputGroup>

        <FilterSheet
          selectedFilters={selectedFilters}
          onFilterChange={onFilterChange}
          onRefresh={onRefreshFilters}
          filterItem={filterItem}
        />
      </div>
    </div>
  );
}
