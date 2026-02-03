import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { useEffect, useState, useRef } from "react";
import { getRecruiterJobs, inviteCandidatesToJob } from "@/api/recruiter/jobs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import {
  getAssessmentList,
  inviteCandidatesToAssessment,
} from "@/api/assessments";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type InviteMode = "job" | "assessment";

interface InviteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: InviteMode;
  candidateIds?: string[];
  onInviteSuccess?: () => void;
}

interface Item {
  id: string;
  slug: string;
  title: string;
  status?: string;
}

export default function InviteDialog({
  open,
  onOpenChange,
  mode,
  candidateIds = [],
  onInviteSuccess,
}: InviteDialogProps) {
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [inReviewCount, setInReviewCount] = useState(0); // Count of jobs in review
  const [selectedItem, setSelectedItem] = useState<string>(""); // For Job (Single Select)
  const [selectedItems, setSelectedItems] = useState<string[]>([]); // For Assessment (Multi Select)
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const loadedPagesRef = useRef<Set<number>>(new Set());

  const isJob = mode === "job";
  const title = isJob ? "Invite for Job" : "Request Assessment";
  const label = isJob ? "Job" : "Assessment";
  const selectPlaceholder = isJob ? "Select Active Job" : "Select Assessments";
  const noDataTitle = isJob ? "No Job Found" : "No Assessment Found";
  const noDataDesc = isJob
    ? "There are no Jobs at the moment. Please Create Job First."
    : "There are no Assessments at the moment. Please Create Assessment First.";
  const createButtonText = isJob ? "Create Job" : "Create Assessment";
  const createLink = isJob ? "/jobs/create" : "/assessments/create";

  useEffect(() => {
    if (open) {
      setSelectedItem("");
      setSelectedItems([]);
      setInReviewCount(0);
      loadedPagesRef.current.clear();
      setCurrentPage(1);
      setHasMore(true);
      setItems([]);
      fetchData(1, true);
    } else {
      setSelectedItem("");
      setSelectedItems([]);
      setInReviewCount(0);
      setItems([]);
      setCurrentPage(1);
      setHasMore(true);
      loadedPagesRef.current.clear();
    }
  }, [open, mode]);

  const fetchData = async (page: number = 1, isInitial: boolean = false) => {
    try {
      if (isInitial) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      let data: any;

      if (isJob) {
        // Fetch both active and in_review jobs
        data = await getRecruiterJobs({
          status: ["active", "in_review"],
        });
        const list = Array.isArray(data) ? data : data?.data || [];

        // Separate active jobs from in_review jobs
        const activeJobs = list.filter(
          (job: any) => job.status === "active",
        );
        const reviewJobs = list.filter(
          (job: any) => job.status === "in_review",
        );

        setItems(activeJobs);
        setInReviewCount(reviewJobs.length);
        setHasMore(false); // Jobs don't have pagination in this API
      } else {
        data = await getAssessmentList({
          page,
          pageSize: 10,
          sortBy: "created_at",
          sortDirection: "desc",
        });

        // Extract assessments from the response
        const assessments = data?.data?.assessments || [];
        const pagination = data?.meta?.pagination;

        // Map assessments to Item structure
        const mappedItems: Item[] = assessments.map((assessment: any) => ({
          id: assessment.id,
          slug: assessment.slug,
          title: assessment.title,
        }));

        if (isInitial) {
          setItems(mappedItems);
        } else {
          setItems((prev) => [...prev, ...mappedItems]);
        }

        // Check if there are more pages
        if (pagination) {
          setHasMore(page < pagination.totalPages);
        } else {
          setHasMore(assessments.length === 10); // If we got 10 items, might have more
        }

        loadedPagesRef.current.add(page);
      }
    } catch (error) {
      console.error(`Failed to fetch ${mode}s`, error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleSubmit = async () => {
    if (isJob && !selectedItem) {
      toast.error(`Please select a ${label}`);
      return;
    }

    if (!isJob && selectedItems.length === 0) {
      toast.error(`Please select at least one ${label}`);
      return;
    }

    if (!candidateIds || candidateIds.length === 0) {
      toast.error("No candidates selected");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isJob) {
        const response = await inviteCandidatesToJob(selectedItem, {
          user_ids: candidateIds,
        });
        if (response.success) {
          toast.success(response.message || "Candidates invited successfully");
          setSelectedItem("");
          onOpenChange(false);
          onInviteSuccess?.();
        } else {
          toast.error(response.message || "Failed to invite candidates");
        }
      } else {
        const response = await inviteCandidatesToAssessment({
          user_ids: candidateIds,
          assessment_slugs: selectedItems,
        });
        if (response.success) {
          toast.success("Assessment invite sent successfully");
          setSelectedItems([]);
          onOpenChange(false);
          onInviteSuccess?.();
        } else {
          toast.error(response.message || "Failed to send assessment invite");
        }
      }
    } catch (error: any) {
      console.error("Error submitting:", error);
      toast.error(
        error?.response?.data?.message || "An error occurred while submitting",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle toggle for multi-select
  const handleToggle = (slug: string) => {
    setSelectedItems((prev) => {
      if (prev.includes(slug)) {
        return prev.filter((s) => s !== slug);
      } else {
        return [...prev, slug];
      }
    });
  };

  const getSelectedLabel = () => {
    if (selectedItems.length === 0) return selectPlaceholder;
    if (selectedItems.length === 1) {
      const item = items.find((i) => (i.slug || i.id) === selectedItems[0]);
      return item?.title || selectedItems[0];
    }
    return `${selectedItems.length} Assessments Selected`;
  };

  // Handle scroll for infinite loading (only for assessments)
  useEffect(() => {
    if (isJob || !open) return;

    let cleanup: (() => void) | undefined;

    // Small delay to ensure the content is rendered
    const timeoutId = setTimeout(() => {
      // For assessments, we now use a custom scroll container in PopoverContent
      const scrollContainer = document.getElementById(
        "assessment-scroll-container",
      );

      if (!scrollContainer) return;

      const handleScroll = () => {
        if (loadingMore || !hasMore) return;

        const { scrollTop, scrollHeight, clientHeight } = scrollContainer;

        // Load more when user scrolls to 80% of the container
        if (scrollTop + clientHeight >= scrollHeight * 0.8) {
          const nextPage = currentPage + 1;

          if (!loadedPagesRef.current.has(nextPage) && !loadingMore) {
            setCurrentPage(nextPage);
            fetchData(nextPage, false);
          }
        }
      };

      scrollContainer.addEventListener("scroll", handleScroll);

      cleanup = () => {
        scrollContainer.removeEventListener("scroll", handleScroll);
      };
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (cleanup) cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, isJob, currentPage, loadingMore, hasMore, mode, items]);

  const hasItems = items.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white p-0 rounded-2xl overflow-hidden gap-0">
        <DialogHeader className="px-6 py-4 border-b border-gray-200 flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-semibold font-sans text-black">
            {title}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-10 gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
            <p className="text-gray-500 font-sans">
              Checking active {mode}s...
            </p>
          </div>
        ) : !hasItems && isJob && inReviewCount > 0 ? (
          // All Jobs in Review State
          <div className="px-10 py-6 flex flex-col items-center justify-center gap-4">
            <div className="w-30 h-30 relative overflow-hidden">
              <div className="w-full h-full flex items-center justify-center bg-amber-50 rounded-full">
                <Icon
                  icon="mdi:clock-outline"
                  className="text-amber-500 w-16 h-16"
                />
              </div>
            </div>

            <div className="w-full flex flex-col items-center gap-2">
              <h3 className="text-xl font-bold text-gray-900 font-sans text-center">
                {inReviewCount} Job{inReviewCount > 1 ? "s" : ""} in Review
              </h3>
              <p className="text-gray-600 text-sm font-medium font-sans text-center">
                You will be able to select{" "}
                {inReviewCount > 1 ? "them" : "it"} once approved by admin.
              </p>
            </div>

            <Button
              variant="outline"
              className="h-8 px-4 border-primary-500 text-primary-500 hover:bg-primary-50 rounded-lg text-sm font-normal font-sans mt-2"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          </div>
        ) : !hasItems ? (
          // No Data State
          <div className="px-16 py-6 flex flex-col items-center justify-center gap-4">
            <div className="w-30 h-30 relative overflow-hidden">
              <div className="w-full h-full flex items-center justify-center bg-blue-50/50 rounded-full">
                <Icon
                  icon="mdi:file-document-alert-outline"
                  className="text-primary-300 w-16 h-16"
                />
              </div>
            </div>

            <div className="w-full flex flex-col items-center gap-2">
              <h3 className="text-xl font-bold text-gray-900 font-sans text-center">
                {noDataTitle}
              </h3>
              <p className="text-gray-600 text-sm font-medium font-sans text-center">
                {noDataDesc}
              </p>
            </div>

            <Button
              asChild
              className="h-8 px-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg flex items-center gap-2 mt-2"
            >
              <Link href={createLink}>
                <span className="text-sm font-normal font-sans">
                  {createButtonText}
                </span>
                <Icon icon="mdi:plus" className="w-4.5 h-4.5 text-white" />
              </Link>
            </Button>
          </div>
        ) : (
          // Select State
          <>
            <div className="p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-black font-sans">
                  {label}
                </label>
                {isJob ? (
                  <>
                    <Select
                      value={selectedItem}
                      onValueChange={setSelectedItem}
                    >
                      <SelectTrigger className="w-full h-8 px-3 border-gray-200 rounded-lg text-gray-600 text-sm font-normal font-sans bg-white focus:ring-0 focus:ring-offset-0">
                        <SelectValue placeholder={selectPlaceholder} />
                      </SelectTrigger>
                      <SelectContent
                        className="max-h-[300px]"
                        data-slot="select-content"
                      >
                        {items.map((item) => (
                          <SelectItem
                            key={item.slug || item.id}
                            value={item.slug || item.id}
                          >
                            {item.title}
                          </SelectItem>
                        ))}
                        {loadingMore && (
                          <div className="flex items-center justify-center py-2">
                            <Loader2 className="h-4 w-4 animate-spin text-primary-500" />
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                    {inReviewCount > 0 && (
                      <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <Icon
                          icon="mdi:information-outline"
                          className="w-4 h-4 text-amber-600 mt-0.5 shrink-0"
                        />
                        <p className="text-xs text-amber-700 font-medium">
                          {inReviewCount} job{inReviewCount > 1 ? "s are" : " is"}{" "}
                          in review mode. You will be able to select{" "}
                          {inReviewCount > 1 ? "them" : "it"} once approved by
                          admin.
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-96 h-fit px-3 justify-between border-gray-200 rounded-lg text-gray-600 text-sm font-normal font-sans bg-white hover:bg-white"
                      >
                        <span className="whitespace-normal">
                          {getSelectedLabel()}
                        </span>
                        <Icon
                          icon="lucide:chevrons-up-down"
                          className="ml-2 h-4 w-4 shrink-0 opacity-50"
                        />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-(--radix-popover-trigger-width) p-0 bg-white"
                      align="start"
                    >
                      <div
                        id="assessment-scroll-container"
                        className="max-h-[300px] overflow-y-auto"
                      >
                        {items.map((item) => {
                          const value = item.slug || item.id;
                          const isSelected = selectedItems.includes(value);
                          return (
                            <div
                              key={value}
                              className={cn(
                                "flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0",
                                isSelected && "bg-primary-50/50",
                              )}
                              onClick={() => handleToggle(value)}
                            >
                              <Checkbox
                                checked={isSelected}
                                className="border-gray-300 pointer-events-none"
                              />
                              <Link
                                href={`/assessment/${item.slug}`}
                                className="text-sm text-gray-900 font-sans flex-1 underline"
                              >
                                {item.title}
                              </Link>
                            </div>
                          );
                        })}
                        {loadingMore && (
                          <div className="flex items-center justify-center py-2">
                            <Loader2 className="h-4 w-4 animate-spin text-primary-500" />
                          </div>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            </div>

            <div className="px-6 pb-6 flex justify-end items-center gap-3">
              <Button
                variant="outline"
                className="h-8 px-4 border-primary-500 text-primary-500 hover:bg-primary-50 rounded-lg text-sm font-normal font-sans"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                className="h-8 px-4 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm font-normal font-sans"
                onClick={handleSubmit}
                disabled={
                  isJob
                    ? !selectedItem || isSubmitting
                    : selectedItems.length === 0 || isSubmitting
                }
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
