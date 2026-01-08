import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { useEffect, useState, useRef } from "react";
import { getRecruiterJobs } from "@/api/jobs/recruiter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { getAssessmentList } from "@/api/assessments";

export type InviteMode = "job" | "assessment";

interface InviteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: InviteMode;
}

interface Item {
  id: string;
  slug: string;
  title: string;
}

export default function InviteDialog({
  open,
  onOpenChange,
  mode,
}: InviteDialogProps) {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const loadedPagesRef = useRef<Set<number>>(new Set());

  const isJob = mode === "job";
  const title = isJob ? "Invite for Job" : "Request Assessment";
  const label = isJob ? "Job" : "Assessment";
  const selectPlaceholder = isJob ? "Select Active Job" : "Select Assessment";
  const noDataTitle = isJob ? "No Job Found" : "No Assessment Found";
  const noDataDesc = isJob
    ? "There are no Jobs at the moment. Please Create Job First."
    : "There are no Assessments at the moment. Please Create Assessment First.";
  const createButtonText = isJob ? "Create Job" : "Create Assessment";
  const createLink = isJob ? "/jobs/create" : "/assessments/create";

  useEffect(() => {
    if (open) {
      setSelectedItem(""); // Reset selection when dialog opens or mode changes
      loadedPagesRef.current.clear();
      setCurrentPage(1);
      setHasMore(true);
      setItems([]);
      fetchData(1, true);
    } else {
      // Reset selection when dialog closes
      setSelectedItem("");
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
        data = await getRecruiterJobs({ status: ["active"] });
        const list = Array.isArray(data) ? data : data?.data || [];
        setItems(list);
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

  // Handle scroll for infinite loading (only for assessments)
  useEffect(() => {
    if (isJob || !open) return;

    let cleanup: (() => void) | undefined;

    // Small delay to ensure the SelectContent is rendered
    const timeoutId = setTimeout(() => {
      // Find the scrollable element - try SelectContent first, then viewport
      const selectContent = document.querySelector('[data-slot="select-content"]') as HTMLElement;
      if (!selectContent) return;
      
      // The SelectContent itself might be scrollable, or the viewport inside
      const viewport = selectContent.querySelector('div[class*="p-1"]') as HTMLElement || selectContent;

      const handleScroll = () => {
        if (loadingMore || !hasMore) return;

        const { scrollTop, scrollHeight, clientHeight } = viewport;

        // Load more when user scrolls to 80% of the container
        if (scrollTop + clientHeight >= scrollHeight * 0.8) {
          const nextPage = currentPage + 1;

          if (!loadedPagesRef.current.has(nextPage) && !loadingMore) {
            setCurrentPage(nextPage);
            fetchData(nextPage, false);
          }
        }
      };

      viewport.addEventListener('scroll', handleScroll);

      cleanup = () => {
        viewport.removeEventListener('scroll', handleScroll);
      };
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (cleanup) cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, isJob, currentPage, loadingMore, hasMore, mode]);

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
                <Select value={selectedItem} onValueChange={setSelectedItem}>
                  <SelectTrigger className="w-full h-8 px-3 border-gray-200 rounded-lg text-gray-600 text-sm font-normal font-sans bg-white focus:ring-0 focus:ring-offset-0">
                    <SelectValue placeholder={selectPlaceholder} />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {items.map((item) => (
                      <SelectItem key={item.slug || item.id} value={item.slug || item.id}>
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
              </div>
            </div>

            <div className="px-6 pb-6 flex justify-end items-center gap-3">
              <Button
                variant="outline"
                className="h-8 px-4 border-primary-500 text-primary-500 hover:bg-primary-50 rounded-lg text-sm font-normal font-sans"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                className="h-8 px-4 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm font-normal font-sans"
                onClick={() => {
                  console.log(`Submitting ${mode}:`, selectedItem);
                  onOpenChange(false);
                }}
                disabled={!selectedItem}
              >
                Submit
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
