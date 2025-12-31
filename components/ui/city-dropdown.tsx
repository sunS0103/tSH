"use client";

import { getCities, getCityById } from "@/api/seeder";
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

interface City {
  id: number;
  name: string;
}

interface CityDropdownProps {
  value?: number;
  onValueChange: (cityId: number) => void;
  countryName?: string;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

export function CityDropdown({
  value,
  onValueChange,
  countryName,
  // disabled = false,
  className,
  placeholder = "Select City",
}: CityDropdownProps) {
  const [open, setOpen] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const loadedPagesRef = useRef<Set<number>>(new Set());

  const selectedCity = cities.find((c) => c.id === value);
  // const isDisabled = disabled || !countryName || loading;

  const loadCities = async (pageNum: number, query?: string) => {
    if (!countryName) return;

    if (pageNum === 1 && query !== searchQuery) {
      loadedPagesRef.current.clear();
    } else if (loading || loadedPagesRef.current.has(pageNum)) {
      return;
    }

    setLoading(true);
    try {
      const response = await getCities(countryName, pageNum, query);
      const citiesData = Array.isArray(response)
        ? response
        : response?.data || response?.cities || [];

      if (pageNum === 1) {
        // Merge with preserved selected city if it exists
        setCities((prev) => {
          const existingIds = new Set(prev.map((c) => c.id));
          const newCities = citiesData.filter(
            (c: City) => !existingIds.has(c.id)
          );
          return [...prev, ...newCities];
        });
        setSearchQuery(query || "");
        loadedPagesRef.current.clear();
        loadedPagesRef.current.add(1);
      } else {
        setCities((prev) => [...prev, ...citiesData]);
        loadedPagesRef.current.add(pageNum);
      }

      setPage(pageNum);

      if (response?.pagination) {
        setHasMore(
          response.pagination.currentPage < response.pagination.totalPages
        );
      } else {
        setHasMore(citiesData.length === 10);
      }
    } catch (error) {
      console.error("Error loading cities:", error);
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
      setCities([]);
      const query = value.trim() || undefined;
      loadCities(1, query);
    }, 500);
  };

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container || loading || !hasMore || !countryName) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    if (scrollTop + clientHeight >= scrollHeight * 0.8) {
      const nextPage = page + 1;

      if (!loadedPagesRef.current.has(nextPage) && !loading) {
        const query = searchQuery.trim() || undefined;
        loadCities(nextPage, query);
      }
    }
  };

  const handleSelect = (cityId: number) => {
    onValueChange(cityId);
    setOpen(false);
    setSearchQuery("");
  };

  // Load default city if value is provided on mount or when value changes
  useEffect(() => {
    if (value && value > 0 && countryName && !loading) {
      // Check if the city is already in the list
      const cityExists = cities.some((c) => c.id === value);

      if (!cityExists) {
        // Fetch the specific city by ID to display it
        getCityById(value.toString())
          .then((response) => {
            const cityData = response?.data || response;
            if (cityData && cityData.id) {
              setCities((prev) => {
                // Avoid duplicates
                if (prev.some((c) => c.id === cityData.id)) {
                  return prev;
                }
                return [cityData, ...prev];
              });
            }
          })
          .catch((error) => {
            console.error("Error loading default city:", error);
          });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, countryName]);

  // Load cities when country changes
  useEffect(() => {
    if (countryName) {
      loadedPagesRef.current.clear();
      setPage(1);
      // Don't clear cities if we have a default value loaded
      if (!value || cities.length === 0) {
        setCities([]);
      }
      setSearchQuery("");
      setHasMore(true);
      loadCities(1);
    } else {
      setCities([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryName]);

  // Always refresh cities when dropdown opens
  useEffect(() => {
    if (open && countryName && !loading) {
      loadedPagesRef.current.clear();
      setPage(1);
      setSearchQuery("");
      // Preserve the selected city if it exists
      setCities((prev) => {
        const selectedCity = value && prev.find((c) => c.id === value);
        return selectedCity ? [selectedCity] : [];
      });
      // Load fresh data (will merge with preserved city)
      loadCities(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, countryName]);

  // Cleanup timer
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn("w-full justify-between h-8", className)}
          // disabled={isDisabled}
        >
          {selectedCity ? (
            selectedCity.name
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <Icon
            icon="material-symbols:keyboard-arrow-down-rounded"
            className="ml-2 h-4 w-4 shrink-0 opacity-50"
          />
        </Button>
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
              placeholder="Search city..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-8 h-9"
              onClick={(e) => e.stopPropagation()}
              // disabled={!countryName}
            />
          </div>
        </div>
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="max-h-[300px] overflow-y-auto scrollbar-hide"
        >
          {cities.map((city) => (
            <button
              key={city.id}
              type="button"
              onClick={() => handleSelect(city.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-100 transition-colors",
                value === city.id && "bg-gray-100"
              )}
            >
              <span className="flex-1 text-sm font-medium">{city.name}</span>
            </button>
          ))}
          {!hasMore && cities.length > 0 && (
            <div className="px-4 py-2 text-xs text-gray-400 text-center">
              No more cities
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
