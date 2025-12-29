"use client";

import { getCities } from "@/api/seeder";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useEffect, useRef, useState } from "react";

interface City {
  id: number;
  name: string;
}

interface CityMultiSelectProps {
  value?: number[];
  onValueChange: (cityIds: number[]) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

export function CityMultiSelect({
  value = [],
  onValueChange,
  disabled = false,
  className,
  placeholder = "Select cities",
}: CityMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const loadedPagesRef = useRef<Set<number>>(new Set());

  const selectedCities = cities.filter((c) => value.includes(c.id));

  const loadCities = async (pageNum: number, query?: string) => {
    if (pageNum === 1 && query !== searchQuery) {
      loadedPagesRef.current.clear();
    } else if (loading || loadedPagesRef.current.has(pageNum)) {
      return;
    }

    setLoading(true);
    try {
      // For independent city search, pass empty country name and use query parameter for search
      // If no query, we'll search globally by passing empty string
      const response = await getCities("", pageNum, query);
      const citiesData = Array.isArray(response)
        ? response
        : response?.data || response?.cities || [];

      if (pageNum === 1) {
        setCities(citiesData);
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
    if (!container || loading || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    if (scrollTop + clientHeight >= scrollHeight * 0.8) {
      const nextPage = page + 1;

      if (!loadedPagesRef.current.has(nextPage) && !loading) {
        const query = searchQuery.trim() || undefined;
        loadCities(nextPage, query);
      }
    }
  };

  const handleToggle = (cityId: number) => {
    const currentValue = value || [];
    const isSelected = currentValue.includes(cityId);
    if (isSelected) {
      onValueChange(currentValue.filter((id) => id !== cityId));
    } else {
      onValueChange([...currentValue, cityId]);
    }
  };

  const getSelectedLabel = () => {
    if (selectedCities.length === 0) return placeholder;
    return selectedCities.map((city) => city.name).join(", ");
  };

  // Initialize cities when dropdown opens
  useEffect(() => {
    if (open && cities.length === 0 && !loading) {
      loadedPagesRef.current.clear();
      setPage(1);
      setSearchQuery("");
      loadCities(1);
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

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          className={cn(
            "min-h-8 h-auto w-full justify-between border-gray-900 bg-white text-left font-normal py-2",
            "hover:bg-white",
            className
          )}
          disabled={disabled || loading}
        >
          <span className="flex-1 text-wrap wrap-break-word pr-2">
            {getSelectedLabel()}
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
              type="text"
              placeholder="Search city..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
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
          {cities.map((city, index) => (
            <div
              key={city.id}
              className={cn(
                "flex items-center gap-4 px-6 py-4 border-b border-gray-200 last:border-b-0 cursor-pointer hover:bg-gray-50",
                index === 0 && "rounded-t-2xl",
                index === cities.length - 1 && "rounded-b-2xl"
              )}
              onClick={() => handleToggle(city.id)}
            >
              <Checkbox
                checked={value.includes(city.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    handleToggle(city.id);
                  } else {
                    handleToggle(city.id);
                  }
                }}
                className="size-5"
              />
              <Label className="text-base font-normal text-black cursor-pointer flex-1">
                {city.name}
              </Label>
            </div>
          ))}
          {loading && (
            <div className="px-4 py-2 text-sm text-gray-500 text-center">
              Loading...
            </div>
          )}
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

