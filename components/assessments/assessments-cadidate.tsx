"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const ITEMS_PER_PAGE = 12;

import FilterSidebar from "./filter-sidebar";
import AssessmentOrJobHeader from "../candidates/assessment-or-job-header";
import AssessmentControls from "./assessment-controls";
import AssessmentGrid from "./assessment-grid";
import AssessmentPagination from "./assessment-pagination";
import {
  getAssessmentList,
  getAssessmentsFilter,
  getTakenAssessmentsList,
} from "@/api/assessments";
import NoDataFound from "../common/no-data-found";

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
  difficulty_level: "Beginner" | "Intermediate" | "Advanced" | "Not Applicable";
  duration: number; // seconds
  total_questions: number;
  status: "PUBLISHED" | "SUBSCRIBED";
  job_role_id: string;
  job_role_name: string;
  topics: Topics[];
  score: number;
  percentage: number;
}

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function AssessmentCandidate() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [filterItems, setFilterItems] = useState<TechnologySkillsResponse>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  const selectedTab = searchParams.get("tab") || "all";

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

        // Technology can be multiple values (same as skills)
        const technology =
          technologyFilters.length > 0 ? technologyFilters : undefined;
        // Skills can be multiple values
        const skills = skillsFilters.length > 0 ? skillsFilters : undefined;

        if (selectedTab === "all") {
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
        }
        if (selectedTab === "taken") {
          const res = await getTakenAssessmentsList({
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
        }
      } catch (error) {
        console.error("Error fetching assessments:", error);
        setAssessments([]);
        setTotalPages(1);
      } finally {
        setIsLoading(false);
      }
    };

    getAssessments();
  }, [
    currentPage,
    debouncedSearchQuery,
    selectedFilters,
    getFilterType,
    selectedTab,
  ]);

  // Client-side filtering and pagination removed - now handled by API

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleTabChange = (value: string) => {
    setCurrentPage(1);

    // Update URL
    const params = new URLSearchParams(searchParams);
    if (value === "all") {
      params.delete("tab");
    } else {
      params.set("tab", value);
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleFilterChange = (filters: string[]) => {
    setSelectedFilters(filters);
    setCurrentPage(1);
  };

  const handleRefreshFilters = () => {
    setSelectedFilters([]);
    setSearchQuery("");
    setCurrentPage(1);

    // Reset URL tab param
    const params = new URLSearchParams(searchParams);
    params.delete("tab");
    router.replace(`${pathname}?${params.toString()}`);
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
        <AssessmentOrJobHeader />
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
        <div
          className={cn(
            "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mt-1 md:mt-6",
            selectedTab === "taken" ? "xl:grid-cols-2" : "xl:grid-cols-3"
          )}
        >
          {isLoading ? (
            <div className="col-span-full text-center py-8 text-gray-500">
              Loading...
            </div>
          ) : assessments.length > 0 ? (
            <AssessmentGrid
              assessments={assessments}
              selectedTab={selectedTab}
            />
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              <NoDataFound note="No assessments found matching your criteria." />
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
