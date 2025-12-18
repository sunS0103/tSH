"use client";

import { useState, useMemo } from "react";
import AssessmentHeader from "@/components/assesments/assessment-header";
import AssessmentControls from "@/components/assesments/assessment-controls";
import AssessmentGrid from "@/components/assesments/assessment-grid";
import AssessmentPagination from "@/components/assesments/assessment-pagination";
import FilterSidebar from "@/components/assesments/filter-sidebar";

const ITEMS_PER_PAGE = 12;

import type { Assessment } from "@/lib/data/assessments";

interface AssessmentsPageWrapperProps {
  assessments: Assessment[];
}

export default function AssessmentsPageWrapper({
  assessments,
}: AssessmentsPageWrapperProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredAssessments = useMemo(() => {
    let filtered = [...assessments];

    if (selectedTab === "taken") {
      filtered = filtered.filter((assessment) => assessment.taken);
    }

    if (selectedFilters.length > 0) {
      filtered = filtered.filter((assessment) =>
        selectedFilters.some(
          (filter) =>
            assessment.category.toLowerCase().includes(filter.toLowerCase()) ||
            assessment.topics.some((topic) =>
              topic.toLowerCase().includes(filter.toLowerCase())
            )
        )
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (assessment) =>
          assessment.title.toLowerCase().includes(query) ||
          assessment.category.toLowerCase().includes(query) ||
          assessment.topics.some((topic) => topic.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [assessments, selectedTab, selectedFilters, searchQuery]);

  const totalPages = Math.ceil(filteredAssessments.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedAssessments = filteredAssessments.slice(startIndex, endIndex);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleTabChange = (value: string) => {
    setSelectedTab(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (filters: string[]) => {
    setSelectedFilters(filters);
    setCurrentPage(1);
  };

  const handleRefreshFilters = () => {
    setSelectedFilters([]);
    setSearchQuery("");
    setSelectedTab("all");
    setCurrentPage(1);
  };

  return (
    <div className="p-4 flex gap-6">
      <FilterSidebar
        selectedFilters={selectedFilters}
        onFilterChange={handleFilterChange}
        onRefresh={handleRefreshFilters}
      />
      <div className="flex-1">
        <AssessmentHeader />
        <AssessmentControls
          selectedTab={selectedTab}
          searchQuery={searchQuery}
          selectedFilters={selectedFilters}
          onTabChange={handleTabChange}
          onSearchChange={handleSearchChange}
          onFilterChange={handleFilterChange}
          onRefreshFilters={handleRefreshFilters}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 mt-1 md:mt-6">
          <AssessmentGrid assessments={paginatedAssessments} />
        </div>
        <AssessmentPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
