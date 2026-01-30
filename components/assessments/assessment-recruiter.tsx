"use client";

import { useState, useEffect, useRef } from "react";
import AssessmentRecruiterControls from "./assessment-recruiter-controls";
import AssessmentRecruiterGrid from "./assessment-recruiter-grid";
import AssessmentRecruiterRequestedGrid, {
  RequestedAssessment,
} from "./assessment-recruiter-requested-grid";
import AssessmentPagination from "./assessment-pagination";
import {
  getAssessmentList,
  getRequestedAssessmentsList,
} from "@/api/assessments";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import NoDataFound from "../common/no-data-found";
import { Loader } from "../ui/loader";

const ITEMS_PER_PAGE = 12;

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
  technology?: string;
}

export default function AssessmentRecruiter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [requestedAssessments, setRequestedAssessments] = useState<
    RequestedAssessment[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  const selectedTab = searchParams.get("tab") || "all";

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

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

  useEffect(() => {
    const getAssessments = async () => {
      setIsLoading(true);
      try {
        if (selectedTab === "all") {
          const res = await getAssessmentList({
            page: currentPage,
            pageSize: ITEMS_PER_PAGE,
            sortBy: "created_at",
            sortDirection: "desc",
            query: debouncedSearchQuery.trim() || undefined,
          });

          if (res) {
            const list = res?.data?.assessments;
            setAssessments(Array.isArray(list) ? list : []);

            // Get total pages from API response
            const total = res?.meta?.pagination?.totalPages;
            setTotalPages(total);
          }
        } else if (selectedTab === "requested") {
          const res = await getRequestedAssessmentsList({
            page: currentPage,
            pageSize: ITEMS_PER_PAGE,
            sortBy: "created_at",
            sortDirection: "desc",
            query: debouncedSearchQuery.trim() || undefined,
          });

          if (res) {
            // Requested assessments might have a different structure
            const list = res?.data?.requests || res?.data || [];
            setRequestedAssessments(Array.isArray(list) ? list : []);

            // Get total pages from API response
            const total = res?.meta?.pagination?.totalPages;
            setTotalPages(total);
          }
        }
      } catch (error) {
        console.error("Error fetching assessments:", error);
        if (selectedTab === "all") {
          setAssessments([]);
        } else {
          setRequestedAssessments([]);
        }
        setTotalPages(1);
      } finally {
        setIsLoading(false);
      }
    };

    getAssessments();
  }, [currentPage, debouncedSearchQuery, selectedTab]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleTabChange = (value: string) => {
    setCurrentPage(1);
    setSearchQuery("");

    // Update URL
    const params = new URLSearchParams(searchParams);
    if (value === "all") {
      params.delete("tab");
    } else {
      params.set("tab", value);
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleButtonClick = () => {
    router.push("/assessments/request-assessment");
  };

  return (
    <div className="p-6">
      {/* Controls: Tabs and Search */}
      <AssessmentRecruiterControls
        selectedTab={selectedTab}
        searchQuery={searchQuery}
        onTabChange={handleTabChange}
        onSearchChange={handleSearchChange}
        onButtonClick={handleButtonClick}
      />

      {/* Assessment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            <Loader show={true} />
          </div>
        ) : selectedTab === "all" ? (
          assessments.length > 0 ? (
            <AssessmentRecruiterGrid assessments={assessments} />
          ) : (
            <div className="col-span-full text-center py-8">
              <NoDataFound note="There are no assessments at the moment." />
            </div>
          )
        ) : requestedAssessments.length > 0 ? (
          <AssessmentRecruiterRequestedGrid
            assessments={requestedAssessments}
          />
        ) : (
          <div className="col-span-full text-center py-8 h-100">
            <NoDataFound note="There are no requested assessments at the moment." />
          </div>
        )}
      </div>

      {/* Pagination */}
      <AssessmentPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
