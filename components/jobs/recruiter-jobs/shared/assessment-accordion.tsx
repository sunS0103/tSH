"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { type JobFormData } from "@/validation/job";
import { useState, useEffect, useRef } from "react";
import { getAssessmentList } from "@/api/assessments";
import { Search } from "lucide-react";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

interface AssessmentAccordionProps {
  form: UseFormReturn<JobFormData>;
  requireAssessment: boolean;
}

interface Assessment {
  id: string;
  title: string;
  slug?: string;
}

export default function AssessmentAccordion({
  form,
  requireAssessment,
}: AssessmentAccordionProps) {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [isLoadingAssessments, setIsLoadingAssessments] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const loadedPagesRef = useRef<Set<number>>(new Set());

  // Debounce search query
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery]);

  const loadAssessments = async (pageNum: number, query?: string) => {
    if (pageNum === 1 && query !== debouncedSearchQuery) {
      loadedPagesRef.current.clear();
    } else if (isLoadingAssessments || loadedPagesRef.current.has(pageNum)) {
      return;
    }

    setIsLoadingAssessments(true);
    try {
      const response = await getAssessmentList({
        page: pageNum,
        pageSize: 10,

        sortBy: "created_at",
        sortDirection: "desc",
        query: query?.trim() || undefined,
      });

      // API response structure: response.data.assessments
      const list = response?.data?.assessments || [];
      const assessmentsData = Array.isArray(list) ? list : [];

      if (pageNum === 1) {
        setAssessments(assessmentsData);
        loadedPagesRef.current.clear();
        loadedPagesRef.current.add(1);
      } else {
        setAssessments((prev) => {
          // Avoid duplicates
          const existingIds = new Set(prev.map((a) => a.id));
          const newAssessments = assessmentsData.filter(
            (a: Assessment) => !existingIds.has(a.id)
          );
          return [...prev, ...newAssessments];
        });
        loadedPagesRef.current.add(pageNum);
      }

      setPage(pageNum);

      // Check if there are more pages
      if (response?.meta?.pagination) {
        setHasMore(
          response.meta.pagination.currentPage <
            response.meta.pagination.totalPages
        );
      } else {
        setHasMore(assessmentsData.length === 3);
      }
    } catch (error) {
      console.error("Error fetching assessments:", error);
      setHasMore(false);
    } finally {
      setIsLoadingAssessments(false);
    }
  };

  // Handle scroll for infinite loading
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container || isLoadingAssessments || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    // Load more when user scrolls to 80% of the container
    if (scrollTop + clientHeight >= scrollHeight * 0.8) {
      const nextPage = page + 1;

      if (!loadedPagesRef.current.has(nextPage) && !isLoadingAssessments) {
        const query = debouncedSearchQuery.trim() || undefined;
        loadAssessments(nextPage, query);
      }
    }
  };

  // Load assessments when popover opens
  useEffect(() => {
    if (open) {
      if (assessments.length === 0 && !isLoadingAssessments) {
        loadedPagesRef.current.clear();
        setPage(1);
        setSearchQuery("");
        setDebouncedSearchQuery("");
        loadAssessments(1);
      }
    } else {
      // Reset search when popover closes
      setSearchQuery("");
      setDebouncedSearchQuery("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Reload assessments when debounced search query changes
  useEffect(() => {
    if (open) {
      loadedPagesRef.current.clear();
      setPage(1);
      setAssessments([]);
      const query = debouncedSearchQuery.trim() || undefined;
      loadAssessments(1, query);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchQuery, open]);

  const handleRequestAssessment = () => {
    window.open("/jobs/request-assessment", "_blank");
  };

  // Focus search input when popover opens
  useEffect(() => {
    if (open && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  return (
    <>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="assessment" className="border-none">
          <AccordionTrigger className="bg-primary-50 rounded-t-2xl px-6 py-4 hover:no-underline cursor-pointer">
            <div className="flex flex-col items-start gap-1 flex-1">
              <p className="text-base font-semibold text-gray-950">
                Do you want to mandate a Skill Assessment score for{" "}
                <br />
                candidates to apply the Job?
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="bg-white rounded-b-2xl px-6 py-4">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="assessment_id"
                render={({ field }) => {
                  const selectedAssessment = assessments.find(
                    (assessment) => String(assessment.id) === field.value
                  );

                  const handleSelect = (assessmentId: string) => {
                    field.onChange(assessmentId);
                    form.setValue("require_assessment", true);
                    setOpen(false);
                    setSearchQuery("");
                  };

                  return (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-950">
                        Select Exam
                      </FormLabel>
                      <FormControl>
                        <Popover open={open} onOpenChange={setOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              className={cn(
                                "h-8 w-2/4 justify-between bg-transparent text-left font-normal",
                                "border-input hover:bg-transparent",
                                "text-sm",
                                !field.value && "text-muted-foreground"
                              )}
                              disabled={isLoadingAssessments}
                            >
                              {selectedAssessment ? (
                                selectedAssessment.title
                              ) : isLoadingAssessments ? (
                                <span className="text-muted-foreground">
                                  Loading...
                                </span>
                              ) : (
                                <span className="text-muted-foreground">
                                  Select Exam
                                </span>
                              )}
                              <Icon
                                icon="material-symbols:keyboard-arrow-down-rounded"
                                className="h-4 w-4 shrink-0 opacity-50"
                              />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-[254px] p-0 bg-white border border-gray-200 rounded-2xl shadow-[0px_0px_25px_0px_rgba(0,0,0,0.15)]"
                            align="start"
                          >
                            {/* Search Input */}
                            <div className="p-2 border-b">
                              <div className="relative">
                                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                  ref={searchInputRef}
                                  type="text"
                                  placeholder="Search assessments..."
                                  value={searchQuery}
                                  onChange={(e) => setSearchQuery(e.target.value)}
                                  className="pl-8 h-9"
                                  onClick={(e) => e.stopPropagation()}
                                  onKeyDown={(e) => {
                                    if (e.key === "ArrowDown") {
                                      e.preventDefault();
                                      const firstButton =
                                        scrollContainerRef.current?.querySelector(
                                          "button"
                                        ) as HTMLButtonElement;
                                      if (firstButton) firstButton.focus();
                                    }
                                  }}
                                />
                              </div>
                            </div>
                            {/* Assessments List */}
                            <div
                              ref={scrollContainerRef}
                              onScroll={handleScroll}
                              className="max-h-[300px] overflow-y-auto scrollbar-hide"
                            >
                              {assessments.length === 0 && !isLoadingAssessments ? (
                                <div className="px-4 py-2 text-sm text-gray-500 text-center">
                                  {debouncedSearchQuery.trim()
                                    ? "No assessments found"
                                    : "No assessments available"}
                                </div>
                              ) : (
                                <>
                                  {assessments.map((assessment, index) => (
                                    <button
                                      key={assessment.id}
                                      type="button"
                                      onClick={() =>
                                        handleSelect(String(assessment.id))
                                      }
                                      className={cn(
                                        "w-full flex items-center gap-3 px-6 py-4 text-left hover:bg-gray-50 transition-colors focus:bg-gray-50 focus:outline-none border-b border-gray-200 last:border-b-0",
                                        field.value === String(assessment.id) &&
                                          "bg-gray-50",
                                        index === 0 && assessments.length > 0 && "rounded-t-2xl"
                                      )}
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                          e.preventDefault();
                                          handleSelect(String(assessment.id));
                                        } else if (e.key === "ArrowDown") {
                                          e.preventDefault();
                                          const nextSibling = (
                                            e.target as HTMLElement
                                          ).nextElementSibling as HTMLButtonElement;
                                          if (nextSibling) nextSibling.focus();
                                        } else if (e.key === "ArrowUp") {
                                          e.preventDefault();
                                          const prevSibling = (
                                            e.target as HTMLElement
                                          ).previousElementSibling as HTMLButtonElement;
                                          if (prevSibling) {
                                            prevSibling.focus();
                                          } else {
                                            searchInputRef.current?.focus();
                                          }
                                        }
                                      }}
                                    >
                                      <span className="flex-1 text-base font-normal text-black">
                                        {assessment.title}
                                      </span>
                                    </button>
                                  ))}
                                  {isLoadingAssessments && (
                                    <div className="px-4 py-2 text-sm text-gray-500 text-center">
                                      Loading more...
                                    </div>
                                  )}
                                  {!hasMore && assessments.length > 0 && (
                                    <div className="px-4 py-2 text-xs text-gray-400 text-center border-t border-gray-200">
                                      No more assessments
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <div className="flex items-center gap-2 text-sm">
                <p className="text-gray-600">
                  Not finding a relevant exam? Let's create one for your needs
                  –{" "}
                </p>
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto text-primary-600 underline font-semibold"
                  onClick={handleRequestAssessment}
                >
                  Request Now
                </Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}

