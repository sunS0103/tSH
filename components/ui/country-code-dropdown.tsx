"use client";

import { getCountries } from "@/api/seeder";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface Country {
  id: number;
  name: string;
  dial_code: string;
  flag: string;
}

interface CountryCodeDropdownProps {
  value?: string;
  onValueChange: (dialCode: string, country: Country) => void;
  className?: string;
}

export function CountryCodeDropdown({
  value,
  onValueChange,
  className,
}: CountryCodeDropdownProps) {
  const [open, setOpen] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const loadedPagesRef = useRef<Set<number>>(new Set());
  const isUserSelectionRef = useRef(false);
  const itemsPerPage = 10;

  const loadCountries = async (pageNum: number, query?: string) => {
    // For page 1 with different query, always reload
    if (pageNum === 1 && query !== searchQuery) {
      // Allow reload - clear loaded pages
      loadedPagesRef.current.clear();
    } else if (
      loading ||
      (loadedPagesRef.current.has(pageNum) && query === searchQuery)
    ) {
      // Already loading or same page and query already loaded, skip
      return;
    }

    setLoading(true);
    try {
      const response = await getCountries(pageNum, query);

      // Handle different response structures
      const countriesData = Array.isArray(response)
        ? response
        : response?.data || response?.countries || [];

      // If page 1, replace countries; otherwise append (merge with previous data)
      if (pageNum === 1) {
        setCountries(countriesData);
        setSearchQuery(query || "");
        loadedPagesRef.current.clear();
        loadedPagesRef.current.add(pageNum);
      } else {
        // For page 2, 3, etc., always append to previous data
        setCountries((prev) => [...prev, ...countriesData]);
        loadedPagesRef.current.add(pageNum);
      }

      setPage(pageNum);

      // Check if there are more items to load
      // If response has pagination info, use it; otherwise check length
      if (response?.pagination) {
        setHasMore(
          response.pagination.currentPage < response.pagination.totalPages
        );
      } else {
        // Backend sends 10 items per page, so if we get less than 10, there are no more items
        setHasMore(countriesData.length === itemsPerPage);
      }
    } catch (error) {
      console.error("Error loading countries:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container || loading || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    // Load more when user scrolls to 80% of the container
    if (scrollTop + clientHeight >= scrollHeight * 0.8) {
      // Use the current page state to calculate next page
      // If we're on page 1, next is page 2; if on page 2, next is page 3, etc.
      const nextPage = page + 1;

      // Only load if we haven't loaded this page yet and it's not currently loading
      if (!loadedPagesRef.current.has(nextPage) && !loading) {
        const query = searchQuery.trim() || undefined;
        loadCountries(nextPage, query);
      }
    }
  };

  // Debounced search function
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer for API call
    debounceTimerRef.current = setTimeout(() => {
      loadedPagesRef.current.clear();
      setPage(1);
      setCountries([]);
      const query = value.trim() || undefined;
      loadCountries(1, query);
    }, 500);
  };

  // Load initial countries when popover opens
  useEffect(() => {
    if (open && countries.length === 0 && !loading) {
      loadedPagesRef.current.clear();
      setPage(1);
      setSearchQuery("");
      loadCountries(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Reset search when popover closes
  useEffect(() => {
    if (!open) {
      setSearchQuery("");
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    }
  }, [open]);

  // Set selected country from value prop (only when value changes externally)
  // Use a ref to track the last value to prevent unnecessary updates
  const lastValueRef = useRef<string | undefined>(value);

  useEffect(() => {
    // Skip if this is from a user selection (will be handled by handleSelect)
    if (isUserSelectionRef.current) {
      isUserSelectionRef.current = false;
      lastValueRef.current = value;
      return;
    }

    // Only update if value actually changed (not just a re-render)
    if (value !== lastValueRef.current) {
      lastValueRef.current = value;

      if (value && countries.length > 0) {
        const country = countries.find((c) => c.dial_code === value);
        if (country) {
          setSelectedCountry(country);
        }
      } else if (!value) {
        // Reset if value is cleared
        setSelectedCountry(null);
      }
    }
  }, [value, countries]);

  const handleSelect = (country: Country) => {
    isUserSelectionRef.current = true;
    setSelectedCountry(country);
    onValueChange(country.dial_code, country);
    setOpen(false);
    setSearchQuery("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex gap-2 justify-center flex-row items-center text-left font-normal border-gray-900 bg-white hover:bg-white cursor-pointer w-fit px-3 overflow-hidden rounded-full",
            className
          )}
        >
          {selectedCountry ? (
            <Image
              width={16}
              height={16}
              src={selectedCountry.flag}
              alt={selectedCountry.name}
              className="rounded-full w-4 h-4"
            />
          ) : (
            <span className="text-muted-foreground text-xs">{value}</span>
          )}
          <Icon
            icon="material-symbols:keyboard-arrow-down-rounded"
            className="ml-auto h-4 w-4 shrink-0 opacity-50"
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-0"
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {/* Search Input */}
        <div className="p-2 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search country..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-8 h-9"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="max-h-[300px] overflow-y-auto scrollbar-hide"
        >
          {countries.map((country) => (
            <button
              key={country.id}
              type="button"
              onClick={() => handleSelect(country)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-100 transition-colors",
                selectedCountry?.id === country.id && "bg-gray-100"
              )}
            >
              <Image
                width={16}
                height={16}
                src={country.flag}
                alt={country.name}
                className="rounded-full w-4 h-4"
              />
              <span className="flex-1 text-sm font-medium">{country.name}</span>
              <span className="text-sm text-gray-600">{country.dial_code}</span>
            </button>
          ))}
          {loading && (
            <div className="px-4 py-2 text-sm text-gray-500 text-center">
              Loading...
            </div>
          )}
          {!hasMore && countries.length > 0 && (
            <div className="px-4 py-2 text-xs text-gray-400 text-center">
              No more countries
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
