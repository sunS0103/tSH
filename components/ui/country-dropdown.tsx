"use client";

import { getCountries, getCountryById } from "@/api/seeder";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";

interface Country {
  id: number;
  name: string;
}

interface CountryDropdownProps {
  value?: number;
  onValueChange: (countryId: number) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

export function CountryDropdown({
  value,
  onValueChange,
  disabled = false,
  className,
  placeholder = "Select Country",
}: CountryDropdownProps) {
  const [open, setOpen] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const loadedPagesRef = useRef<Set<number>>(new Set());
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedCountry = countries.find((c) => c.id === value);

  const loadCountries = async (pageNum: number, query?: string) => {
    if (pageNum === 1 && query !== searchQuery) {
      loadedPagesRef.current.clear();
    } else if (loading || loadedPagesRef.current.has(pageNum)) {
      return;
    }

    setLoading(true);
    try {
      const response = await getCountries(pageNum, query);
      const countriesData = Array.isArray(response)
        ? response
        : response?.data || response?.countries || [];

      if (pageNum === 1) {
        // Merge with preserved selected country if it exists
        setCountries((prev) => {
          const existingIds = new Set(prev.map((c) => c.id));
          const newCountries = countriesData.filter(
            (c: Country) => !existingIds.has(c.id)
          );
          return [...prev, ...newCountries];
        });
        setSearchQuery(query || "");
        loadedPagesRef.current.clear();
        loadedPagesRef.current.add(1);
      } else {
        setCountries((prev) => [...prev, ...countriesData]);
        loadedPagesRef.current.add(pageNum);
      }

      setPage(pageNum);

      if (response?.pagination) {
        setHasMore(
          response.pagination.currentPage < response.pagination.totalPages
        );
      } else {
        setHasMore(countriesData.length === 10);
      }
    } catch (error) {
      console.error("Error loading countries:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      loadedPagesRef.current.clear();
      setPage(1);
      setCountries([]);
      const query = value.trim() || undefined;
      loadCountries(1, query);
    }, 500);
  };

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container || loading || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    if (scrollTop + clientHeight >= scrollHeight * 0.8) {
      const nextPage = page + 1;

      if (!loadedPagesRef.current.has(nextPage) && !loading) {
        const query = searchQuery.trim() || undefined;
        loadCountries(nextPage, query);
      }
    }
  };

  const handleSelect = (countryId: number) => {
    onValueChange(countryId);
    setOpen(false);
    setSearchQuery("");
  };

  // Load default country if value is provided on mount or when value changes
  useEffect(() => {
    if (value && value > 0 && !loading) {
      // Check if the country is already in the list
      const countryExists = countries.some((c) => c.id === value);

      if (!countryExists) {
        // Fetch the specific country by ID to display it
        getCountryById(value.toString())
          .then((response) => {
            const countryData = response?.data || response;
            if (countryData && countryData.id) {
              setCountries((prev) => {
                // Avoid duplicates
                if (prev.some((c) => c.id === countryData.id)) {
                  return prev;
                }
                return [countryData, ...prev];
              });
            }
          })
          .catch((error) => {
            console.error("Error loading default country:", error);
          });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Always refresh countries when dropdown opens
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);
    }

    if (open && !loading) {
      loadedPagesRef.current.clear();
      setPage(1);
      setSearchQuery("");
      // Preserve the selected country if it exists
      setCountries((prev) => {
        const selectedCountry = value && prev.find((c) => c.id === value);
        return selectedCountry ? [selectedCountry] : [];
      });
      // Load fresh data (will merge with preserved country)
      loadCountries(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Cleanup timer
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (open && searchInputRef.current) {
      // Small delay to ensure the popover is fully rendered
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn("w-full justify-between h-9.5 border-black", className)}
          disabled={disabled || loading}
        >
          {selectedCountry ? (
            selectedCountry.name
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <Icon
            icon="material-symbols:keyboard-arrow-down-rounded"
            className="ml-2 h-4 w-4 shrink-0 opacity-50"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        {/* Search Input */}
        <div className="p-2 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              ref={searchInputRef}
              type="text"
              ref={searchInputRef}
              placeholder="Search country..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-8 h-9"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  const firstButton = scrollContainerRef.current?.querySelector(
                    "button"
                  ) as HTMLButtonElement;
                  if (firstButton) firstButton.focus();
                }
              }}
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
              onClick={() => handleSelect(country.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-100 transition-colors focus:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500",
                value === country.id && "bg-gray-100"
              )}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSelect(country.id);
                } else if (e.key === "ArrowDown") {
                  e.preventDefault();
                  const nextSibling = (e.target as HTMLElement)
                    .nextElementSibling as HTMLButtonElement;
                  if (nextSibling) nextSibling.focus();
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  const prevSibling = (e.target as HTMLElement)
                    .previousElementSibling as HTMLButtonElement;
                  if (prevSibling) {
                    prevSibling.focus();
                  } else {
                    searchInputRef.current?.focus();
                  }
                }
              }}
            >
              <span className="flex-1 text-sm font-medium">{country.name}</span>
            </button>
          ))}
          {countries.length === 0 && (
            <div className="px-4 py-2 text-xs text-gray-400 text-center">
              No countries found
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
