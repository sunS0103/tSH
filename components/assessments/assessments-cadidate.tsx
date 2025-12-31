"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const ITEMS_PER_PAGE = 12;

import FilterSidebar from "./filter-sidebar";
import AssessmentHeader from "./assessment-header";
import AssessmentControls from "./assessment-controls";
import AssessmentGrid from "./assessment-grid";
import AssessmentPagination from "./assessment-pagination";
import { getAssessmentList, getAssessmentsFilter } from "@/api/assessments";

// Common item structure
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

interface Topics {
  id: string;
  value: string;
}

export interface Assessment {
  id: string;
  title: string;
  slug: string;
  category: string;
  difficultyLevel: "Beginner" | "Intermediate" | "Advanced" | "Not Applicable";
  duration: number; // seconds
  totalQuestions: number;
  status: "PUBLISHED" | "SUBSCRIBED";
  job_role_id: string;
  job_role_name: string;
  topics: Topics[];
}

export default function AssessmentCandidate() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [filterItems, setFilterItems] = useState<TechnologySkillsResponse>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const getFilters = async () => {
      await getAssessmentsFilter().then((res) => {
        setFilterItems(res.data);
      });
    };

    getFilters();
  }, []);

  // Debounce search query
  useEffect(() => {
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500); // 500ms delay

    // Cleanup function
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery]);

  // Helper function to identify if a filter ID belongs to technology or skills
  const getFilterType = useCallback(
    (filterId: string): "technology" | "skills" | null => {
      for (const group of filterItems) {
        if ("technology" in group) {
          if (group.technology.some((item) => item.id === filterId)) {
            return "technology";
          }
        }
        if ("skills" in group) {
          if (group.skills.some((item) => item.id === filterId)) {
            return "skills";
          }
        }
      }
      return null;
    },
    [filterItems]
  );

  useEffect(() => {
    const getAssessments = async () => {
      setIsLoading(true);
      try {
        // Separate technology and skills filters
        const technologyFilters = selectedFilters.filter(
          (filterId) => getFilterType(filterId) === "technology"
        );
        const skillsFilters = selectedFilters.filter(
          (filterId) => getFilterType(filterId) === "skills"
        );

        // Technology should be a single value (take the first one if multiple)
        const technology =
          technologyFilters.length > 0 ? technologyFilters[0] : undefined;
        // Skills can be multiple values
        const skills = skillsFilters.length > 0 ? skillsFilters : undefined;

        const res = await getAssessmentList({
          page: currentPage,
          pageSize: ITEMS_PER_PAGE,
          sortBy: "created_at",
          sortDirection: "desc",
          query: debouncedSearchQuery.trim() || undefined,
          technology,
          skills,
        });

        const list = res?.data?.assessments;
        setAssessments(Array.isArray(list) ? list : []);

        // Get total pages from API response
        const total = res?.meta?.pagination?.totalPages;
        setTotalPages(total);
      } catch (error) {
        console.error("Error fetching assessments:", error);
        setAssessments([]);
        setTotalPages(1);
      } finally {
        setIsLoading(false);
      }
    };

    getAssessments();
  }, [currentPage, debouncedSearchQuery, selectedFilters, getFilterType]);

  // Client-side filtering and pagination removed - now handled by API

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
        filterItem={filterItems}
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
          filterItem={filterItems}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 mt-1 md:mt-6">
          {isLoading ? (
            <div className="col-span-full text-center py-8 text-gray-500">
              Loading...
            </div>
          ) : assessments.length > 0 ? (
            <AssessmentGrid assessments={assessments} />
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              No assessments found
            </div>
          )}
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
