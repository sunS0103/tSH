"use client";

import { getRecruiterJobApplicants } from "@/api/jobs/recruiter";
import { ApplicantCardProps } from "./applicant-card";
import ApplicantsList from "./applicants-list";
import { useEffect, useState, useRef, useCallback } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Icon } from "@iconify/react";
import ApplicantsFilterSidebar from "./applicants-filter-sidebar";
import ApplicantsFilterSheet from "./applicants-filter-sheet";
import ApplicantsPagination from "./applicants-pagination";
import NoDataFound from "@/components/common/no-data-found";

interface FilterGroup {
  title: string;
  items: { id: string; value: string; title?: string }[];
}

const ITEMS_PER_PAGE = 10;

// Filter items defined outside component to prevent infinite loops
const filterItems: FilterGroup[] = [
  {
    title: "STATUS",
    items: [
      { id: "shortlisted", value: "shortlisted", title: "Shortlisted" },
      { id: "handshaked", value: "handshaked", title: "Handshaked" },
    ],
  },
];

export default function ApplicantsWrapper({ jobId }: { jobId: string }) {
  const [applicants, setApplicants] = useState<ApplicantCardProps[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Debounce search query
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1); // Reset to first page on search
    }, 500);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery]);

  // Fetch applicants
  const fetchApplicants = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getRecruiterJobApplicants({
        jobId,
        page: currentPage,
        pageSize: ITEMS_PER_PAGE,
        query: debouncedSearchQuery || undefined,
        status: selectedFilters.length > 0 ? selectedFilters : undefined,
      });

      if (response.success && response.data) {
        setApplicants(response.data);
        const pagination = response.meta?.pagination || response.pagination;
        setTotalPages(
          pagination?.totalPages ||
            Math.ceil((pagination?.total || 0) / ITEMS_PER_PAGE) ||
            1
        );
      }
    } catch (error) {
      console.error("Error fetching applicants:", error);
    } finally {
      setIsLoading(false);
    }
  }, [jobId, currentPage, debouncedSearchQuery, selectedFilters]);

  useEffect(() => {
    fetchApplicants();
  }, [fetchApplicants]);

  const handleFilterChange = (filters: string[]) => {
    setSelectedFilters(filters);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleRefreshFilters = () => {
    setSelectedFilters([]);
    setSearchQuery("");
    setCurrentPage(1);
  };

  return (
    <div className="md:flex md:gap-4 mt-6">
      <ApplicantsFilterSidebar
        filterItems={filterItems}
        selectedFilters={selectedFilters}
        onFilterChange={handleFilterChange}
        onRefresh={handleRefreshFilters}
      />
      <div className="flex-1">
        <div className="flex flex-col md:flex-row gap-4 justify-between mb-4">
          <h1
            className="md:text-2xl text-xl font-bold font-sans"
            style={{
              background: "linear-gradient(180deg, #5245E5 0%, #9134EA 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Applicants List
          </h1>
          <div className="flex items-center gap-2">
            <div className="flex-1 md:flex-initial">
              <InputGroup className="h-8 w-full md:w-auto">
                <InputGroupInput
                  placeholder="Search Here..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search applicants"
                />
                <InputGroupAddon>
                  <Icon icon="material-symbols:search" aria-hidden="true" />
                </InputGroupAddon>
              </InputGroup>
            </div>
            <ApplicantsFilterSheet
              filterItems={filterItems}
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
              onRefresh={handleRefreshFilters}
            />
          </div>
        </div>
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : (
          applicants.length > 0 ? (
            <>
              <ApplicantsList applicants={applicants} jobId={jobId} />
              <ApplicantsPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          ) : (
            <NoDataFound title="No Applicants Found" note="There are no applicants for this job. Please come back later." />
          )
        )}
      </div>
    </div>
  );
}
