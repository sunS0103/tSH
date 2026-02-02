import { Icon } from "@iconify/react";
import JobFilterSidebar from "../../recruiter-jobs/listing/job-filter-sidebar";
import { Input } from "@/components/ui/input";
import JobFilterSheet from "../../recruiter-jobs/listing/job-filter-sheet";
import { Loader } from "@/components/ui/loader";
import AssessmentPagination from "@/components/assessments/assessment-pagination";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  getCandidateJobs,
  getCandidateJobsFilters,
} from "@/api/jobs/candidate";
import { toast } from "sonner";
import { FilterResponse } from "../../recruiter-jobs/listing/recruiter-jobs";
import CandidateJobCard from "./candidate-job-card";
import NoDataFound from "@/components/common/no-data-found";
import { Job } from "../../recruiter-jobs/listing/types";
import AssessmentOrJobHeader from "@/components/candidates/assessment-or-job-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function CandidateJobs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const ITEMS_PER_PAGE = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  //   const [filterItems, setFilterItems] = useState<FilterResponse>([]);
  const [filterItems, setFilterItems] = useState<FilterResponse>([]);

  const selectedTab = searchParams.get("tab") || "all";

  useEffect(() => {
    const fetchFilters = async () => {
      setIsLoading(true);
      await getCandidateJobsFilters()
        .then((res) => {
          setFilterItems(res.data);
        })
        .catch((err) => {
          toast.error(err.response.data.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };
    fetchFilters();
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
      // Reset to page 1 when search changes
      setCurrentPage(1);
    }, 500); // 500ms delay

    // Cleanup function
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery]);

  const getFilterType = useCallback(
    (
      filterId: string
    ): "work_mode" | "assessments" | "primary_skills" | null => {
      for (const group of filterItems) {
        if ("work_mode" in group) {
          if (group.work_mode.some((item) => item.value === filterId)) {
            return "work_mode";
          }
        }
        if ("assessments" in group) {
          if (group.assessments.some((item) => item.value === filterId)) {
            return "assessments";
          }
        }
        if ("primary_skills" in group) {
          if (group.primary_skills.some((item) => item.value === filterId)) {
            return "primary_skills";
          }
        }
      }
      return null;
    },
    [filterItems]
  );

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const workModeFilters = selectedFilters.filter(
          (filterId) => getFilterType(filterId) === "work_mode"
        );
        const primarySkillsFilters = selectedFilters.filter(
          (filterId) => getFilterType(filterId) === "primary_skills"
        );
        const assessmentsFilters = selectedFilters.filter(
          (filterId) => getFilterType(filterId) === "assessments"
        );

        setIsLoading(true);

        let res;

        if (selectedTab === "all") {
          const response = await getCandidateJobs({
            page: currentPage,
            pageSize: ITEMS_PER_PAGE,
            query: debouncedSearchQuery.trim() || undefined,
            sortBy: "created_at",
            sortDirection: "desc",
            work_mode: workModeFilters,
            primary_skills: primarySkillsFilters,
            assessments: assessmentsFilters,
          });
          res = response;
        } else if (selectedTab === "applied") {
          const response = await getCandidateJobs({
            page: currentPage,
            pageSize: ITEMS_PER_PAGE,
            query: debouncedSearchQuery.trim() || undefined,
            sortBy: "created_at",
            sortDirection: "desc",
            applied_only: 1,
            work_mode: workModeFilters,
            primary_skills: primarySkillsFilters,
            assessments: assessmentsFilters,
          });

          res = response;
        }

        // Handle the API response structure: { success, message, data, meta }
        // const data = response?.data || [];
        const meta = res?.meta || {};

        // Map API response to Job interface
        // const mappedJobs: any[] = data.map((job: any) => {
        //   const rawStatus = job.status || "";
        //   let normalizedStatus = rawStatus;

        //   // Normalize status values
        //   const lowerStatus = rawStatus.toLowerCase().replace(/[-_]/g, " ");
        //   if (lowerStatus.includes("review")) normalizedStatus = "In Review";
        //   else if (
        //     lowerStatus.includes("inactive") ||
        //     lowerStatus.includes("in active")
        //   )
        //     normalizedStatus = "In-Active";
        //   else if (lowerStatus === "active") normalizedStatus = "Active";
        //   else if (lowerStatus === "draft") normalizedStatus = "Draft";

        //   // Parse experience range
        //   const experience = parseExperienceRange(job.experience_range);

        //   return {
        //     id: job.id || job.slug || "",
        //     title: job.title || "",
        //     status: normalizedStatus,
        //     minExperience: experience.min,
        //     maxExperience: experience.max,
        //     companyName: job.company_name ?? "",
        //     skills: job.primary_skills || [],
        //     location: job.city?.name + ", " + job.country?.name || "",
        //   };
        // });

        setJobs(res.data);

        // Update pagination from meta
        if (meta.pagination) {
          setTotalPages(meta.pagination.totalPages || 1);
        }
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
        toast.error("Failed to fetch jobs");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [
    currentPage,
    debouncedSearchQuery,
    filterItems,
    selectedFilters,
    getFilterType,
    selectedTab,
  ]);

  const handleRefreshFilters = () => {
    setSelectedFilters([]);
    setSearchQuery("");
    setCurrentPage(1);

    // Reset URL tab param (assuming we don't want to reset tab on refresh filter,
    // but usually refresh filters might mean "clear everything",
    // but usually it refers to sidebar filters.
    // However, if the user wants "persist selected tab on refresh",
    // we should probably NOT reset tab here unless it's desired behavior.
    // The previous implementation didn't reset tab on filter refresh, so I will stick to that.
    // Wait, check original code... "setSelectedTab" was NOT called in handleRefreshFilters.
    // So I will NOT modify handleRefreshFilters to reset tab.
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

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full bg-gray-50/50 mb-4">
      {/* Sidebar */}
      <div className="shrink-0 lg:w-72 hidden lg:block">
        <JobFilterSidebar
          filterItems={filterItems}
          selectedFilters={selectedFilters}
          onFilterChange={setSelectedFilters}
          onRefresh={handleRefreshFilters}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0 pb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div>
            <AssessmentOrJobHeader />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-80">
              <Icon
                icon="mdi:magnify"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5"
              />
              <Input
                type="text"
                placeholder="Search Here..."
                className="pl-10 h-10 bg-white border-gray-200 rounded-lg w-full focus-visible:ring-1 focus-visible:ring-primary-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Mobile Filter Sheet */}
            <div className="lg:hidden">
              <JobFilterSheet
                filterItems={filterItems}
                selectedFilters={selectedFilters}
                onFilterChange={setSelectedFilters}
                onRefresh={handleRefreshFilters}
              />
            </div>
          </div>
        </div>

        <Tabs
          value={selectedTab}
          onValueChange={handleTabChange}
          className="mb-3"
        >
          <TabsList className="rounded-full bg-white border border-gray-200">
            <TabsTrigger
              value="all"
              className="aria-selected:text-primary rounded-full"
            >
              All Jobs
            </TabsTrigger>
            <TabsTrigger
              value="applied"
              className="aria-selected:text-primary rounded-full"
            >
              Applied Jobs
            </TabsTrigger>
          </TabsList>
          {/* Tabs content for all and taken assessments for screen readers */}
          <TabsContent value="all" className="sr-only">
            <span>All jobs</span>
          </TabsContent>
          <TabsContent value="applied" className="sr-only">
            <span>Applied jobs</span>
          </TabsContent>
        </Tabs>

        {/* Job List */}
        {isLoading ? (
          <Loader show={isLoading} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
            {jobs.length > 0 ? (
              jobs.map((job) => {
                return (
                  <CandidateJobCard
                    key={job.id}
                    id={job.id}
                    title={job.title}
                    company_name={job.company_name}
                    experience_range={job.experience_range}
                    work_mode={job.work_mode}
                    relevant_assessments={job.relevant_assessments}
                    city={job.city}
                    country={job.country}
                    slug={job.slug}
                  />
                );
              })
            ) : (
              <div className="col-span-full text-center py-8">
                <NoDataFound note="There are no Jobs at the moment. Please come back later." />
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="mt-8">
            <AssessmentPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                setCurrentPage(page);
                // Scroll to top when page changes
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
