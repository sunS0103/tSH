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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { UseFormReturn } from "react-hook-form";
import { type JobFormData } from "@/validation/job";
import { useState, useEffect, useRef } from "react";
import { getAssessmentList } from "@/api/assessments";
import { Search } from "lucide-react";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import NoDataFound from "@/components/common/no-data-found";

interface AssessmentAccordionProps {
  form: UseFormReturn<JobFormData>;
}

interface Assessment {
  id: string;
  title: string;
  slug?: string;
}

export default function AssessmentAccordion({
  form,
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

  // Watch for mandate_assessment changes to load assessments if needed
  const mandateAssessment = form.watch("mandate_assessment");

  // Load assessments on mount or when mandate_assessment changes if there are selected assessments
  useEffect(() => {
    const assessmentIds = Array.isArray(mandateAssessment)
      ? mandateAssessment.map((item) =>
          typeof item === "string" ? String(item) : String(item.id)
        )
      : [];

    // If there are selected assessments and we haven't loaded yet, load assessments
    if (
      assessmentIds.length > 0 &&
      assessments.length === 0 &&
      !isLoadingAssessments &&
      !open
    ) {
      loadedPagesRef.current.clear();
      setPage(1);
      loadAssessments(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mandateAssessment]);

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
          <AccordionTrigger className="bg-primary-50 rounded-t-2xl px-4 sm:px-6 py-4 hover:no-underline cursor-pointer">
            <div className="flex flex-col items-start gap-1 flex-1">
              <p className="text-sm sm:text-base font-semibold text-gray-950">
                Do you want to mandate a Skill Assessment score for{" "}
                <br className="hidden sm:block" />
                candidates to apply the Job?
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="bg-white rounded-b-2xl px-4 sm:px-6 py-4">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="mandate_assessment"
                render={({ field }) => {
                  // Ensure field.value is an array of objects with id and title
                  const selectedAssessmentsArray = Array.isArray(field.value)
                    ? field.value
                    : [];

                  // Extract IDs for matching
                  const selectedIds = selectedAssessmentsArray.map((item) =>
                    typeof item === "string" ? item : item.id
                  );

                  // Get selected assessments from the loaded assessments list
                  const selectedAssessments = assessments.filter((assessment) =>
                    selectedIds.includes(String(assessment.id))
                  );

                  // Toggle assessment selection
                  const handleToggle = (assessmentId: string) => {
                    const currentValue = selectedAssessmentsArray || [];
                    const isSelected = selectedIds.includes(assessmentId);

                    if (isSelected) {
                      // Remove from selection
                      field.onChange(
                        currentValue.filter((item) => {
                          const id = typeof item === "string" ? item : item.id;
                          return id !== assessmentId;
                        })
                      );
                    } else {
                      // Find the assessment to add
                      const assessmentToAdd = assessments.find(
                        (a) => String(a.id) === assessmentId
                      );
                      if (assessmentToAdd) {
                        // Add as object with id and title
                        field.onChange([
                          ...currentValue,
                          {
                            id: assessmentToAdd.id,
                            title: assessmentToAdd.title,
                          },
                        ]);
                      }
                    }
                  };

                  // Get display label for selected assessments
                  const getSelectedLabel = () => {
                    if (selectedAssessments.length === 0) {
                      return "Select Exam";
                    }
                    return selectedAssessments
                      .map((assessment) => assessment.title)
                      .join(", ");
                  };

                  const hasValue = selectedAssessments.length > 0;

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
                                "min-h-8 h-fit w-2/4 justify-between bg-transparent text-left font-normal",
                                "border-input hover:bg-transparent",
                                "text-sm"
                              )}
                              disabled={isLoadingAssessments}
                            >
                              <span
                                className={cn(
                                  "flex-1 text-wrap wrap-break-word pr-2 text-sm ",
                                  hasValue
                                    ? "text-foreground"
                                    : "text-muted-foreground"
                                )}
                              >
                                {isLoadingAssessments
                                  ? "Loading..."
                                  : getSelectedLabel()}
                              </span>
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
                                  onChange={(e) =>
                                    setSearchQuery(e.target.value)
                                  }
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
                              {assessments.length === 0 &&
                              !isLoadingAssessments ? (
                                <div className="px-4 py-2 text-sm text-gray-500 text-center">
                                  {debouncedSearchQuery.trim() ? (
                                    <NoDataFound note="No assessments found matching your criteria." />
                                  ) : (
                                    <NoDataFound note="No assessments available." />
                                  )}
                                </div>
                              ) : (
                                <>
                                  {assessments.map((assessment, index) => {
                                    const isSelected = selectedIds.includes(
                                      String(assessment.id)
                                    );
                                    return (
                                      <div
                                        key={assessment.id}
                                        className={cn(
                                          "flex items-center gap-4 px-6 py-4 border-b border-gray-200 last:border-b-0 cursor-pointer hover:bg-gray-50",
                                          isSelected && "bg-gray-50",
                                          index === 0 &&
                                            assessments.length > 0 &&
                                            "rounded-t-2xl"
                                        )}
                                        onClick={() =>
                                          handleToggle(String(assessment.id))
                                        }
                                      >
                                        <Checkbox
                                          checked={isSelected}
                                          onCheckedChange={() =>
                                            handleToggle(String(assessment.id))
                                          }
                                          className="size-5"
                                          onClick={(e) => e.stopPropagation()}
                                        />
                                        <Label className="text-base font-normal text-black cursor-pointer flex-1">
                                          {assessment.title}
                                        </Label>
                                      </div>
                                    );
                                  })}
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
                  Not finding a relevant exam? Let&apos;s create one for your
                  needs –{" "}
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
