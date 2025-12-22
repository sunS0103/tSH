"use client";

import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface AssessmentPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function AssessmentPagination({
  currentPage,
  totalPages,
  onPageChange,
}: AssessmentPaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage <= 3) {
        pages.push(2, 3, 4);
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push("ellipsis");
        pages.push(totalPages - 3, totalPages - 2, totalPages - 1);
        pages.push(totalPages);
      } else {
        pages.push("ellipsis");
        pages.push(currentPage - 1, currentPage, currentPage + 1);
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-8 md:px-6">
      <Pagination className="md:justify-end">
        <PaginationContent className="gap-2">
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onPageChange(Math.max(1, currentPage - 1));
              }}
              className={cn(
                "size-8 border-gray-200 rounded",
                currentPage === 1 ? "pointer-events-none opacity-50" : ""
              )}
            >
              <Icon
                icon="mdi:chevron-left"
                className="size-5 text-primary-500"
              />
            </PaginationPrevious>
          </PaginationItem>

          {pageNumbers.map((page, index) => {
            if (page === "ellipsis") {
              return (
                <PaginationItem key={`ellipsis-${index}`}>
                  <span className="size-8 border border-gray-200 rounded bg-white flex items-center justify-center text-xs text-black">
                    ...
                  </span>
                </PaginationItem>
              );
            }

            const pageNum = page as number;
            const isActive = pageNum === currentPage;

            return (
              <PaginationItem key={pageNum}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(pageNum);
                  }}
                  isActive={isActive}
                  size="icon"
                  className={cn(
                    "size-8 border rounded text-xs font-normal",
                    isActive
                      ? "bg-primary-50 border-primary-500 text-black"
                      : "border-gray-200 bg-white text-black"
                  )}
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onPageChange(Math.min(totalPages, currentPage + 1));
              }}
              className={cn(
                "size-8 border-gray-200 rounded",
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : ""
              )}
            >
              <Icon
                icon="mdi:chevron-right"
                className="size-5 text-primary-500"
              />
            </PaginationNext>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
