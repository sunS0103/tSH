"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useEffect, useRef, useState } from "react";
import { searchTalentPoolLocations, type FilterLocation } from "@/api/recruiter/talent-pool";

interface Location {
  id: string;
  value: string;
  title: string;
}

interface LocationMultiSelectProps {
  value: string[];
  onValueChange: (locationIds: string[]) => void;
  onLocationDataUpdate?: (locationMap: Map<string, string>) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

export function LocationMultiSelect({
  value = [],
  onValueChange,
  onLocationDataUpdate,
  disabled = false,
  className,
  placeholder = "Location",
}: LocationMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLocationsCache, setSelectedLocationsCache] = useState<Location[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

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

  // Fetch locations from API when search query changes
  useEffect(() => {
    const fetchLocations = async () => {
      if (!debouncedSearchQuery.trim()) {
        setLocations([]);
        return;
      }

      setLoading(true);
      try {
        const locationsData = await searchTalentPoolLocations(debouncedSearchQuery.trim());
        if (locationsData && locationsData.length > 0) {
          const mappedLocations: Location[] = locationsData.map((loc: FilterLocation) => ({
            id: loc.value.toString(),
            value: loc.value.toString(),
            title: loc.title,
          }));
          setLocations(mappedLocations);
        } else {
          setLocations([]);
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
        setLocations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, [debouncedSearchQuery]);

  // Keep track of selected locations even when not in search results
  useEffect(() => {
    // When locations are fetched, update cache with selected ones
    const selectedInResults = locations.filter((loc) => value.includes(loc.id));
    if (selectedInResults.length > 0) {
      setSelectedLocationsCache((prev) => {
        const newCache = [...prev];
        let hasNew = false;
        selectedInResults.forEach((loc) => {
          if (!newCache.find((c) => c.id === loc.id)) {
            newCache.push(loc);
            hasNew = true;
          }
        });
        return hasNew ? newCache : prev;
      });
    }
  }, [locations, value]);

  // Update parent with location ID -> title mapping (only when locations or cache changes)
  useEffect(() => {
    if (onLocationDataUpdate) {
      const locationMap = new Map<string, string>();
      // Add current locations
      locations.forEach((loc) => {
        locationMap.set(loc.id, loc.title);
      });
      // Also include cached locations
      selectedLocationsCache.forEach((loc) => {
        locationMap.set(loc.id, loc.title);
      });
      onLocationDataUpdate(locationMap);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locations, selectedLocationsCache]);

  // Combine search results with cached selected locations
  const allLocations = [
    ...selectedLocationsCache.filter((cached) => value.includes(cached.id)),
    ...locations.filter((loc) => !selectedLocationsCache.find((c) => c.id === loc.id)),
  ];

  const handleToggle = (locationId: string) => {
    if (value.includes(locationId)) {
      onValueChange(value.filter((id) => id !== locationId));
    } else {
      onValueChange([...value, locationId]);
    }
  };

  const getSelectedLabel = () => {
    if (value.length === 0) {
      return <span className="text-gray-500">{placeholder}</span>;
    }
    if (value.length === 1) {
      const selected = allLocations.find((loc) => loc.id === value[0]) || 
                       selectedLocationsCache.find((loc) => loc.id === value[0]);
      return selected?.title || placeholder;
    }
    return `${value.length} locations selected`;
  };

  // Focus search input when popover opens
  useEffect(() => {
    if (open && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  // Reset search when popover closes
  useEffect(() => {
    if (!open) {
      setSearchQuery("");
    }
  }, [open]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          className={cn(
            "w-full h-9 px-3 py-2 border border-gray-200 rounded-lg bg-white flex items-center justify-between cursor-pointer hover:border-gray-300 transition-colors",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
          onClick={() => !disabled && setOpen(true)}
        >
          <span className="flex-1 text-sm text-gray-600 font-normal font-sans text-left truncate">
            {getSelectedLabel()}
          </span>
          <Icon
            icon="material-symbols:keyboard-arrow-down-rounded"
            className="h-4 w-4 shrink-0 text-gray-400"
          />
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-[280px] p-0 bg-white border border-gray-200 rounded-lg shadow-lg"
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {/* Search Input */}
        <div className="p-2 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              ref={searchInputRef}
              placeholder="Search location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-9"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
        {/* Locations List */}
        <div className="max-h-[300px] overflow-y-auto">
          {loading ? (
            <div className="px-4 py-8 flex items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-primary-500" />
            </div>
          ) : allLocations.length > 0 ? (
            allLocations.map((location) => (
              <div
                key={location.id}
                className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handleToggle(location.id)}
              >
                <Checkbox
                  checked={value.includes(location.id)}
                  onCheckedChange={() => handleToggle(location.id)}
                  className="border-gray-300 data-[state=checked]:bg-primary-600 data-[state=checked]:border-primary-600"
                />
                <Label className="text-sm font-medium text-gray-700 leading-none cursor-pointer flex-1">
                  {location.title}
                </Label>
              </div>
            ))
          ) : searchQuery.trim() ? (
            <div className="px-4 py-8 text-sm text-gray-500 text-center">
              No locations found
            </div>
          ) : (
            <div className="px-4 py-8 text-sm text-gray-500 text-center">
              Type to search locations
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

