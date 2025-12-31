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

interface CityDropdownIndependentProps {
  value?: number;
  onValueChange: (cityId: number) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

export function CityDropdownIndependent({
  value,
  onValueChange,
  disabled = false,
  className,
  placeholder = "Select City",
}: CityDropdownIndependentProps) {
  const [open, setOpen] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const loadedPagesRef = useRef<Set<number>>(new Set());
  const defaultCityLoadedRef = useRef<boolean>(false);

  const selectedCity = cities.find((c) => c.id === value);

  const loadCities = async (pageNum: number, query?: string) => {
    if (pageNum === 1 && query !== searchQuery) {
      loadedPagesRef.current.clear();
    } else if (loading || loadedPagesRef.current.has(pageNum)) {
      return;
    }

    setLoading(true);
    try {
      // For independent city search, pass empty country name and use query parameter for search
      const response = await getCities("", pageNum, query);
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

  const handleSelect = (cityId: number) => {
    onValueChange(cityId);
    setOpen(false);
    setSearchQuery("");
  };

  // Load default city if value is provided on mount or when value changes
  useEffect(() => {
    // Reset ref if value changes to 0 or undefined
    if (!value || value === 0) {
      defaultCityLoadedRef.current = false;
      return;
    }

    if (value > 0) {
      // Check if the city is already in the list
      const cityExists = cities.some((c) => c.id === value);
      
      // Only load if city doesn't exist and we haven't already loaded it for this value
      const shouldLoad = !cityExists && 
                        !loading && 
                        (defaultCityLoadedRef.current !== value);
      
      if (shouldLoad) {
        defaultCityLoadedRef.current = value;
        // Fetch the specific city by ID to display it
        getCityById(value.toString())
          .then((response) => {
            // Handle different response formats - try multiple possible structures
            const cityData = response?.data || response?.city || response;
            if (cityData) {
              // Ensure we have both id and name
              const cityId = cityData.id || cityData.city_id || value;
              const cityName = cityData.name || cityData.city_name || cityData.city;
              
              if (cityId && cityName) {
                const city: City = {
                  id: cityId,
                  name: cityName,
                };
                setCities((prev) => {
                  // Avoid duplicates
                  if (prev.some((c) => c.id === city.id)) {
                    return prev;
                  }
                  return [city, ...prev];
                });
              } else {
                // Invalid city data, reset ref
                defaultCityLoadedRef.current = false;
              }
            } else {
              // No city data, reset ref
              defaultCityLoadedRef.current = false;
            }
          })
          .catch((error) => {
            console.error("Error loading default city:", error);
            console.error("Failed to load city with ID:", value);
            defaultCityLoadedRef.current = false; // Reset on error so we can retry
          });
      } else if (cityExists) {
        // City already exists, mark as loaded
        defaultCityLoadedRef.current = value;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Always refresh cities when dropdown opens
  useEffect(() => {
    if (open && !loading) {
      const refreshCities = () => {
        loadedPagesRef.current.clear();
        setPage(1);
        setSearchQuery("");
        
        // Preserve selected city if it exists in the list
        const selectedCity = value && value > 0 ? cities.find((c) => c.id === value) : null;
        setCities(selectedCity ? [selectedCity] : []);
        // Load fresh data (will merge with preserved city)
        loadCities(1);
      };

      // If we have a value but city not in list, fetch it first
      if (value && value > 0) {
        const selectedCity = cities.find((c) => c.id === value);
        if (!selectedCity) {
          // City not loaded yet, fetch it first then refresh
          setLoading(true);
          getCityById(value.toString())
            .then((response) => {
              const cityData = response?.data || response?.city || response;
              if (cityData) {
                const cityId = cityData.id || cityData.city_id || value;
                const cityName = cityData.name || cityData.city_name || cityData.city;
                if (cityId && cityName) {
                  const city: City = { id: cityId, name: cityName };
                  setCities([city]);
                  // Then refresh with fresh data
                  loadedPagesRef.current.clear();
                  setPage(1);
                  setSearchQuery("");
                  loadCities(1);
                } else {
                  refreshCities();
                }
              } else {
                refreshCities();
              }
            })
            .catch(() => {
              refreshCities();
            })
            .finally(() => {
              setLoading(false);
            });
          return; // Don't proceed, wait for city fetch
        }
      }
      
      // City exists or no value, proceed with normal refresh
      refreshCities();
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
          className={cn("w-full justify-between h-8", className)}
          disabled={disabled || loading}
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
