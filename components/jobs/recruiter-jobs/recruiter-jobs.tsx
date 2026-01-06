"use client";

import { getRecruiterJobs } from "@/api/jobs/recruiter";
import { Input } from "@/components/ui/input";
import { Icon } from "@iconify/react";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import AssessmentPagination from "../../assessments/assessment-pagination";
import JobCard from "./job-card";
import JobFilterSheet from "./job-filter-sheet";
import JobFilterSidebar from "./job-filter-sidebar";
import NoJobFound from "./no-job-found";

interface Job {
  id: string;
  title: string;
  status: string;
  minExperience: number;
  maxExperience: number;
  companyName: string;
  skills: string[];
  location: string;
  applicants: number;
}

export default function RecruiterJobs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Helper function to parse experience range (e.g., "6-10 Years" -> { min: 6, max: 10 })
  const parseExperienceRange = (experienceRange: string | null | undefined): { min: number; max: number } => {
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

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const response = await getRecruiterJobs({
          page: currentPage,
          pageSize: 6,
          query: debouncedSearchQuery.trim() || undefined,
          sortBy: "created_at",
          sortDirection: "desc",
        });
        
        // Handle the API response structure: { success, message, data, meta }
        const data = response?.data || [];
        const meta = response?.meta || {};

        // Map API response to Job interface
        const mappedJobs: Job[] = data.map((job: any) => {
          const rawStatus = job.status || "";
          let normalizedStatus = rawStatus;

          // Normalize status values
          const lowerStatus = rawStatus.toLowerCase().replace(/[-_]/g, " ");
          if (lowerStatus.includes("review")) normalizedStatus = "In Review";
          else if (
            lowerStatus.includes("inactive") ||
            lowerStatus.includes("in active")
          )
            normalizedStatus = "In-Active";
          else if (lowerStatus === "active") normalizedStatus = "Active";
          else if (lowerStatus === "draft") normalizedStatus = "Draft";

          // Parse experience range
          const experience = parseExperienceRange(job.experience_range);

          return {
            id: job.id || job._id || job.slug || "",
            title: job.title || "",
            status: normalizedStatus,
            minExperience: experience.min,
            maxExperience: experience.max,
            companyName: job.company_name ?? job.companyName ?? "",
            skills: job.primary_skills || job.skills || [],
            location: job.location ?? "",
            applicants: job.applicants_count ?? job.applicants ?? 0,
          };
        });
        
        setJobs(mappedJobs);
        
        // Update pagination from meta
        if (meta.pagination) {
          setTotalPages(meta.pagination.totalPages || 1);
          setTotalItems(meta.pagination.totalItems || 0);
        }
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
        toast.error("Failed to fetch jobs");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [currentPage, debouncedSearchQuery]);

  // Filter Logic (client-side for selected filters only, search is server-side)
  const filteredJobs = jobs.filter((job) => {
    // Search is handled server-side, so we only need to filter by selectedFilters
    if (selectedFilters.length === 0) return true;

    // Simple ID matching for mock
    // In real app, we would distinct by category
    const matchesFilters = selectedFilters.some((filterId) => {
      const idLower = filterId.toLowerCase();
      // Status
      if (
        job.status.toLowerCase().replace(" ", "_").replace("-", "_") === idLower
      )
        return true;
      // Experience (Simple Logic)
      // Skills
      if (job.skills.some((s) => s.toLowerCase() === idLower)) return true;

      return false; // Add more mock logic if needed
    });

    return matchesFilters;
  });

  // Jobs are already paginated from API, just apply client-side filters
  const currentJobs = filteredJobs;

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
          groups={[]}
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
                groups={[]}
                selectedFilters={selectedFilters}
                onFilterChange={setSelectedFilters}
                onRefresh={handleRefreshFilters}
              />
            </div>
          </div>
        </div>

        {/* Job List */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Icon
              icon="mdi:loading"
              className="animate-spin text-primary-600 size-8"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
            {currentJobs.length > 0 ? (
              currentJobs.map((job) => <JobCard key={job.id} {...job} />)
            ) : (
              <NoJobFound />
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
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
