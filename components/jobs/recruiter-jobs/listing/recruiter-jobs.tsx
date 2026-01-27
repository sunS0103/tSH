"use client";

import {
  getRecruiterJobs,
  getRecruiterJobsFilters,
} from "@/api/jobs/recruiter";
import { Input } from "@/components/ui/input";
import { Icon } from "@iconify/react";
import { useEffect, useState, useRef, useCallback } from "react";
import { toast } from "sonner";
import AssessmentPagination from "@/components/assessments/assessment-pagination";
import JobCard from "./job-card";
import JobFilterSheet from "./job-filter-sheet";
import JobFilterSidebar from "./job-filter-sidebar";
import NoDataFound from "@/components/common/no-data-found";
import { Loader } from "@/components/ui/loader";
import { RecruiterJob } from "@/types/job";

interface Job {
  company_name: string;
  id: string;
  slug: string;
  title: string;
  status: string;

  skills: string[];
  primary_skills: string[];
  location: string;
  applicants: number;
  experience_range?: string;
}

export interface OptionItem {
  id: string;
  title: string;
  value: string;
}

// Technology wrapper
export interface WorkModeBlock {
  work_mode: OptionItem[];
}

// Skills wrapper
export interface SkillsBlock {
  primary_skills: OptionItem[];
}

export interface StatusBlock {
  status: OptionItem[];
}

export interface YearsOfExperience {
  years_of_experience: OptionItem[];
}

export interface AssessmentsBlock {
  assessments: OptionItem[];
}

// Final API response type
export type FilterResponse = Array<
  | WorkModeBlock
  | SkillsBlock
  | StatusBlock
  | YearsOfExperience
  | AssessmentsBlock
>;

export default function RecruiterJobs() {
  const ITEMS_PER_PAGE = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [filterItems, setFilterItems] = useState<FilterResponse>([]);

  useEffect(() => {
    const fetchFilters = async () => {
      setIsLoading(true);
      await getRecruiterJobsFilters()
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

  // Helper function to parse experience range (e.g., "6-10 Years" -> { min: 6, max: 10 })
  const parseExperienceRange = (
    experienceRange: string | null | undefined,
  ): { min: number; max: number } => {
    if (!experienceRange) return { min: 0, max: 0 };

    const match = experienceRange.match(/(\d+)\s*-\s*(\d+)/);
    if (match) {
      return { min: parseInt(match[1], 10), max: parseInt(match[2], 10) };
    }

    // Handle single number or "X+ Years" format
    const singleMatch = experienceRange.match(/(\d+)/);
    if (singleMatch) {
      const num = parseInt(singleMatch[1], 10);
      return { min: num, max: num };
    }

    return { min: 0, max: 0 };
  };

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
      filterId: string,
    ):
      | "work_mode"
      | "status"
      | "primary_skills"
      | "years_of_experience"
      | null => {
      for (const group of filterItems) {
        if ("work_mode" in group) {
          if (group.work_mode.some((item) => item.value === filterId)) {
            return "work_mode";
          }
        }
        if ("primary_skills" in group) {
          if (group.primary_skills.some((item) => item.value === filterId)) {
            return "primary_skills";
          }
        }
        if ("status" in group) {
          if (group.status.some((item) => item.value === filterId)) {
            return "status";
          }
        }
        if ("years_of_experience" in group) {
          if (
            group.years_of_experience.some((item) => item.value === filterId)
          ) {
            return "years_of_experience";
          }
        }
      }
      return null;
    },
    [filterItems],
  );

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const workModeFilters = selectedFilters.filter(
          (filterId) => getFilterType(filterId) === "work_mode",
        );
        const primarySkillsFilters = selectedFilters.filter(
          (filterId) => getFilterType(filterId) === "primary_skills",
        );
        const statusFilters = selectedFilters.filter(
          (filterId) => getFilterType(filterId) === "status",
        );
        const yearsOfExperienceFilters = selectedFilters.filter(
          (filterId) => getFilterType(filterId) === "years_of_experience",
        );

        setIsLoading(true);
        const response = await getRecruiterJobs({
          page: currentPage,
          pageSize: ITEMS_PER_PAGE,
          query: debouncedSearchQuery.trim() || undefined,
          sortBy: "created_at",
          sortDirection: "desc",
          work_mode: workModeFilters,
          primary_skills: primarySkillsFilters,
          status: statusFilters,
          years_of_experience: yearsOfExperienceFilters,
        });

        // Handle the API response structure: { success, message, data, meta }
        const data = response?.data || [];
        const meta = response?.meta || {};

        // Map API response to Job interface
        // const mappedJobs: Job[] = data.map((job: RecruiterJob) => {
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
        //     slug: job.slug || "",
        //   };
        // });

        setJobs(data);

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
  ]);

  const handleRefreshFilters = () => {
    setSelectedFilters([]);
    setSearchQuery("");
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full bg-gray-50/50">
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
          <h1 className="text-2xl font-bold font-sans text-primary-600">
            Jobs
          </h1>

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

        {/* Job List */}
        {isLoading ? (
          <Loader show={isLoading} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
            {jobs.length > 0 ? (
              jobs.map((job, index) => {
                return (
                  <JobCard
                    key={index}
                    id={job.id}
                    title={job.title}
                    status={job.status}
                    companyName={job.company_name}
                    skills={job.skills || job.primary_skills}
                    location={job.location}
                    slug={job.slug}
                    applicants={job.applicants}
                    experience_range={job.experience_range}
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
