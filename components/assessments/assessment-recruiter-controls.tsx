"use client";

import { Icon } from "@iconify/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";

interface AssessmentRecruiterControlsProps {
  selectedTab: string;
  searchQuery: string;
  onTabChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onButtonClick?: () => void;
}

export default function AssessmentRecruiterControls({
  selectedTab,
  searchQuery,
  onTabChange,
  onSearchChange,
  onButtonClick,
}: AssessmentRecruiterControlsProps) {
  const isRequestedTab = selectedTab === "requested";

  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={onTabChange}>
        <TabsList className="rounded-full bg-white border border-gray-200">
          <TabsTrigger
            value="all"
            className="aria-selected:bg-primary-50 aria-selected:text-primary-500 rounded-full py-"
          >
            All Assessments
          </TabsTrigger>
          <TabsTrigger
            value="requested"
            className="aria-selected:bg-primary-50 aria-selected:text-primary-500 rounded-full py-"
          >
            Requested Assessments
          </TabsTrigger>
        </TabsList>
        {/* Tabs content for screen readers */}
        <TabsContent value="all" className="sr-only">
          <span>All assessments filter</span>
        </TabsContent>
        <TabsContent value="requested" className="sr-only">
          <span>Requested assessments filter</span>
        </TabsContent>
      </Tabs>

      {/* Search and Button */}
      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-2 w-full md:w-fit">
        <div className="flex-1">
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
        </div>

        {/* Button - only shown when Requested Assessments tab is selected */}
        {isRequestedTab && (
          <Button
            onClick={onButtonClick}
            variant="secondary"
            size="sm"
            className="h-8 w-full md:w-fit"
          >
            <Icon icon="mdi:plus" className="size-4" />
            Create Request
          </Button>
        )}
      </div>
    </div>
  );
}
