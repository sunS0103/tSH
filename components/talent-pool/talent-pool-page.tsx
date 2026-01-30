"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import TalentFilterSidebar from "./talent-filter-sidebar";
import TalentFilterSheet from "./talent-filter-sheet";
import TalentCard from "./talent-card";
import { Input } from "@/components/ui/input";
import { FilterGroup } from "./talent-filters";
import { Button } from "@/components/ui/button";
import AssessmentPagination from "../assessments/assessment-pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SortDropdown } from "@/components/ui/sort-dropdown";
import InviteDialog, { InviteMode } from "./invite-dialog";
import {
  getRecruiterTalentPool,
  getTalentPoolFilters,
  addFavoriteTalent,
  removeFavoriteTalent,
  type Candidate,
} from "@/api/recruiter/talent-pool";
import { toast } from "sonner";
import { Loader } from "@/components/ui/loader";
import { TalentCardProps } from "./talent-card";
import NoDataFound from "@/components/common/no-data-found";

// Helper function to map API candidate to TalentCardProps
const mapCandidateToTalentCard = (
  candidate: Candidate,
  isFavorite: boolean,
): Omit<TalentCardProps, "isSelected" | "onSelect" | "onToggleFavorite"> => {
  // Extract skill names from skills_assessed
  const skillsAssessed = candidate.skills_assessed.map(
    (skill) => skill.skill_name,
  );

  // Extract assessment titles and slugs
  const assessmentTaken = candidate.assessments_taken.map((assessment) => ({
    title: assessment.assessment_title || assessment.assessment_id,
    slug: assessment.assessment_slug || "#",
  }));

  // Generate location_code (using first 2 letters of city + last 4 digits of candidate_id)
  const locationCode = `${(candidate.city || "NA")
    .substring(0, 2)
    .toUpperCase()} ${candidate.user_id.slice(-4)}`;

  return {
    id: candidate.user_id,
    role: candidate.expertise || "",
    expertise: candidate.bio || "",
    location_code: locationCode,
    totalScore: candidate.score,
    skillsAssessed,
    experience: candidate.years_of_experience,
    company: candidate.company || "",
    availability: candidate.availability || candidate.notice_period || "",
    location: candidate.location || "",
    assessmentTaken,
    assessments: candidate.assessments_taken, // Pass full assessment details
    about: candidate.about || "",
    isFavorite,
  };
};

export default function TalentPoolPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<
    "score" | "experience" | "recently_assessed"
  >("score");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedTalents, setSelectedTalents] = useState<string[]>([]);
  const [favoriteTalents, setFavoriteTalents] = useState<string[]>([]);
  const [bulkInviteDialog, setBulkInviteDialog] = useState<{
    open: boolean;
    mode: InviteMode;
  }>({
    open: false,
    mode: "job",
  });
  const [talents, setTalents] = useState<
    Omit<TalentCardProps, "isSelected" | "onSelect" | "onToggleFavorite">[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filterGroups, setFilterGroups] = useState<FilterGroup[]>([]);
  const [locationIdToTitleMap, setLocationIdToTitleMap] = useState<
    Map<string, string>
  >(new Map());
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);

  const ITEMS_PER_PAGE = 10;

  // Memoize the location data update callback to prevent infinite loops
  const handleLocationDataUpdate = useCallback(
    (locationMap: Map<string, string>) => {
      setLocationIdToTitleMap((prev) => {
        // Only update if the map actually changed
        if (prev.size !== locationMap.size) {
          return locationMap;
        }
        for (const [key, value] of locationMap) {
          if (prev.get(key) !== value) {
            return locationMap;
          }
        }
        return prev; // No change, return previous map
      });
    },
    [],
  );

  // Fetch filter options from API
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await getTalentPoolFilters();
        if (response.success && response.data) {
          const groups: FilterGroup[] = [
            // Location filter
            {
              title: "Location",
              items: response.data.location.map((loc) => ({
                id: loc.value.toString(),
                value: loc.title,
              })),
            },
            // Favorite Talent filter (client-side only)
            {
              title: "Favorite Talent",
              items: [{ id: "favorites", value: "Show Favorites Only" }],
            },
            // Technology filter
            {
              title: "Technology",
              items: response.data.technology.map((tech) => ({
                id: tech.value,
                value: tech.title,
              })),
            },
            // Years of Experience filter (client-side only)
            {
              title: "Years of Experience",
              items: [
                { id: "0-1", value: "0-1 Years" },
                { id: "1-3", value: "1-3 Years" },
                { id: "4-5", value: "4-5 Years" },
                { id: "6-10", value: "6-10 Years" },
                { id: "10+", value: "10+ Years" },
              ],
            },
            // Skill Assessed filter
            {
              title: "Skill Assessed",
              items: response.data.skill_assessed.map((skill) => ({
                id: skill.value,
                value: skill.title,
              })),
            },
          ];
          setFilterGroups(groups);
        }
      } catch (error) {
        console.error("Failed to fetch filters:", error);
        // Fallback to empty filters on error
        setFilterGroups([]);
      }
    };

    fetchFilters();
  }, []);

  // Helper function to parse experience filter ID to min/max years
  const parseExperienceFilter = (
    filterId: string,
  ): { min?: number; max?: number } | null => {
    // Filter IDs are like "0-1", "1-3", "4-5", "6-10", "10+"
    if (filterId.includes("-")) {
      const [min, max] = filterId.split("-").map(Number);
      if (!isNaN(min) && !isNaN(max)) {
        return { min, max };
      }
    } else if (filterId.endsWith("+")) {
      const min = parseInt(filterId.replace("+", ""), 10);
      if (!isNaN(min)) {
        return { min, max: undefined }; // No upper limit
      }
    }
    return null;
  };

  // Extract API parameters from selected filters
  const getApiParamsFromFilters = () => {
    const params: {
      favorite_only?: boolean;
      years_of_experience_min?: number;
      years_of_experience_max?: number;
      location?: string | string[];
      technology?: string | string[];
    } = {};

    // Check for favorites filter
    if (selectedFilters.includes("favorites")) {
      params.favorite_only = true;
    }

    // Check for experience filters
    const experienceFilters = selectedFilters
      .map(parseExperienceFilter)
      .filter((f): f is { min?: number; max?: number } => f !== null);

    if (experienceFilters.length > 0) {
      // If multiple experience filters, use the widest range
      const allMins = experienceFilters
        .map((f) => f.min)
        .filter((m): m is number => m !== undefined);
      const allMaxs = experienceFilters
        .map((f) => f.max)
        .filter((m): m is number => m !== undefined);

      if (allMins.length > 0) {
        params.years_of_experience_min = Math.min(...allMins);
      }

      // If any filter has no max (like "10+"), don't set max
      const hasUnlimitedMax = experienceFilters.some(
        (f) => f.max === undefined,
      );
      if (!hasUnlimitedMax && allMaxs.length > 0) {
        params.years_of_experience_max = Math.max(...allMaxs);
      }
      // If hasUnlimitedMax is true, we don't set max (undefined means no upper limit)
    }

    // Extract location filters
    const locationGroup = filterGroups.find((g) => g.title === "Location");
    const locationFilterIds = selectedFilters.filter((filterId) => {
      // Check if it's a location ID (numeric string that could be a location)
      // or if it exists in the location group
      return (
        locationGroup?.items.some((item) => item.id === filterId) ||
        locationIdToTitleMap.has(filterId)
      );
    });

    if (locationFilterIds.length > 0) {
      // Get location titles from filter group or from the mapping
      const locationTitles = locationFilterIds
        .map((id) => {
          // First try to get from filter group
          const fromGroup = locationGroup?.items.find(
            (item) => item.id === id,
          )?.value;
          if (fromGroup) return fromGroup;
          // Otherwise get from mapping
          return locationIdToTitleMap.get(id);
        })
        .filter((title): title is string => !!title);

      if (locationTitles.length === 1) {
        params.location = locationTitles[0];
      } else if (locationTitles.length > 1) {
        params.location = locationTitles;
      }
    }

    // Extract technology filters
    const technologyGroup = filterGroups.find((g) => g.title === "Technology");
    if (technologyGroup) {
      const technologyFilterIds = selectedFilters.filter((filterId) =>
        technologyGroup.items.some((item) => item.id === filterId),
      );
      if (technologyFilterIds.length > 0) {
        // Get technology values (IDs) from filter group
        const technologyValues = technologyFilterIds
          .map((id) => technologyGroup.items.find((item) => item.id === id)?.id)
          .filter((value): value is string => !!value);

        if (technologyValues.length === 1) {
          params.technology = technologyValues[0];
        } else if (technologyValues.length > 1) {
          params.technology = technologyValues;
        }
      }
    }

    return params;
  };

  // Initialize state from URL params on mount
  useEffect(() => {
    const query = searchParams.get("query") || "";
    const page = searchParams.get("page");
    const filters = searchParams.get("filters");
    const sortByParam = searchParams.get("sortBy");
    const sortDirectionParam = searchParams.get("sortDirection");

    if (query) {
      setSearchQuery(query);
      // Set debounced query immediately on mount (no delay needed)
      setDebouncedSearchQuery(query);
    }
    if (page) {
      const pageNum = parseInt(page, 10);
      if (!isNaN(pageNum) && pageNum > 0) {
        setCurrentPage(pageNum);
      }
    }
    if (filters) {
      try {
        const parsedFilters = JSON.parse(decodeURIComponent(filters));
        if (Array.isArray(parsedFilters)) {
          setSelectedFilters(parsedFilters);
        }
      } catch {
        // Invalid filters in URL, ignore
      }
    }
    if (
      sortByParam &&
      ["score", "experience", "recently_assessed"].includes(sortByParam)
    ) {
      setSortBy(sortByParam as "score" | "experience" | "recently_assessed");
    }
    if (sortDirectionParam && ["asc", "desc"].includes(sortDirectionParam)) {
      setSortDirection(sortDirectionParam as "asc" | "desc");
    }
    // Mark as no longer initial mount after a brief delay to allow state to settle
    setTimeout(() => {
      isInitialMount.current = false;
    }, 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  // Update URL params when state changes (but not on initial mount)
  useEffect(() => {
    if (isInitialMount.current) return;

    const params = new URLSearchParams();

    if (debouncedSearchQuery) {
      params.set("query", debouncedSearchQuery);
    }
    if (currentPage > 1) {
      params.set("page", currentPage.toString());
    }
    if (selectedFilters.length > 0) {
      params.set(
        "filters",
        encodeURIComponent(JSON.stringify(selectedFilters)),
      );
    }
    if (sortBy !== "score" || sortDirection !== "desc") {
      params.set("sortBy", sortBy);
      params.set("sortDirection", sortDirection);
    }

    const newUrl = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;

    router.replace(newUrl, { scroll: false });
  }, [
    debouncedSearchQuery,
    currentPage,
    selectedFilters,
    sortBy,
    sortDirection,
    router,
  ]);

  // Debounce search query
  useEffect(() => {
    // Skip debounce on initial mount when loading from URL
    if (isInitialMount.current) {
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1); // Reset to first page on search
    }, 500);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery]);

  // Fetch talent pool data
  useEffect(() => {
    const fetchTalentPool = async () => {
      setIsLoading(true);
      try {
        // Get filter-based API parameters
        const filterParams = getApiParamsFromFilters();

        const response = await getRecruiterTalentPool({
          page: currentPage,
          pageSize: ITEMS_PER_PAGE,
          sortBy: sortBy === "recently_assessed" ? "recently_assessed" : sortBy,
          sortDirection: sortDirection,
          query: debouncedSearchQuery.trim() || undefined, // Only include query param if search query exists
          ...filterParams, // Include favorite_only and years_of_experience filters
        });

        if (response.success && response.data) {
          // Update favorite talents from API response (merge with existing favorites)
          const apiFavoriteIds = response.data
            .filter((c) => c.is_favorite)
            .map((c) => c.user_id);

          // Get current favorites and merge with API favorites
          setFavoriteTalents((prev) => {
            const combined = new Set([...prev, ...apiFavoriteIds]);
            const favoriteSet = Array.from(combined);

            // Map candidates with favorite status
            const mappedTalents = response.data.map((candidate) =>
              mapCandidateToTalentCard(
                candidate,
                favoriteSet.includes(candidate.user_id) ||
                  candidate.is_favorite,
              ),
            );

            setTalents(mappedTalents);
            return favoriteSet;
          });

          setTotalCount(response.meta.pagination.totalItems);

          // Calculate total pages
          const calculatedTotalPages = response.meta.pagination.totalPages;
          setTotalPages(calculatedTotalPages);
        }
      } catch (error) {
        console.error("Error fetching talent pool:", error);
        toast.error(
          (error as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || "Failed to fetch talent pool",
        );
        setTalents([]);
        setTotalPages(1);
        setTotalCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTalentPool();
  }, [
    currentPage,
    debouncedSearchQuery,
    selectedFilters,
    sortBy,
    sortDirection,
  ]);

  // Update talents when favoriteTalents changes (without re-fetching)
  useEffect(() => {
    setTalents((prevTalents) =>
      prevTalents.map((talent) => ({
        ...talent,
        isFavorite: favoriteTalents.includes(talent.id),
      })),
    );
  }, [favoriteTalents]);

  // Filter talents based on selected filters (client-side filtering for API-unsupported filters)
  // Note: favorite_only, years_of_experience, location, and technology are now handled by the API
  const filteredTalents = talents.filter((talent) => {
    // Get filters that are NOT handled by the API (skills, etc.)
    const locationGroup = filterGroups.find((g) => g.title === "Location");
    const technologyGroup = filterGroups.find((g) => g.title === "Technology");

    const clientSideFilters = selectedFilters.filter(
      (filterId) =>
        filterId !== "favorites" && // Handled by API (favorite_only)
        !filterId.match(/^\d+-\d+$|^\d+\+$/) && // Experience filters handled by API
        !locationGroup?.items.some((item) => item.id === filterId) && // Location handled by API (from filterGroups)
        !locationIdToTitleMap.has(filterId) && // Location handled by API (dynamically searched)
        !technologyGroup?.items.some((item) => item.id === filterId), // Technology handled by API
    );

    if (clientSideFilters.length === 0) return true;

    // Check other filters (skills, etc.)
    const matchesOtherFilters = clientSideFilters.some((filterId) => {
      const idLower = filterId.toLowerCase();

      // Skill check
      if (talent.skillsAssessed.some((s) => s.toLowerCase() === idLower))
        return true;

      return false;
    });

    return matchesOtherFilters;
  });

  console.log({ talents });

  const handleRefreshFilters = () => {
    setSelectedFilters([]);
    setSearchQuery("");
    setCurrentPage(1);
    // Clear URL params
    router.replace(window.location.pathname, { scroll: false });
  };

  const toggleTalentSelection = (id: string) => {
    if (selectedTalents.includes(id)) {
      setSelectedTalents(selectedTalents.filter((tId) => tId !== id));
    } else {
      setSelectedTalents([...selectedTalents, id]);
    }
  };

  const toggleFavorite = async (id: string) => {
    const isCurrentlyFavorite = favoriteTalents.includes(id);

    // Optimistic update - update UI immediately
    if (isCurrentlyFavorite) {
      setFavoriteTalents(favoriteTalents.filter((tid) => tid !== id));
    } else {
      setFavoriteTalents([...favoriteTalents, id]);
    }

    // Update talents list optimistically
    setTalents((prevTalents) =>
      prevTalents.map((talent) =>
        talent.id === id
          ? { ...talent, isFavorite: !isCurrentlyFavorite }
          : talent,
      ),
    );

    try {
      // Call appropriate API based on current favorite status
      const response = isCurrentlyFavorite
        ? await removeFavoriteTalent(id)
        : await addFavoriteTalent(id);

      if (!response.success) {
        // Revert optimistic update on failure
        if (isCurrentlyFavorite) {
          setFavoriteTalents([...favoriteTalents, id]);
        } else {
          setFavoriteTalents(favoriteTalents.filter((tid) => tid !== id));
        }

        // Revert talents list
        setTalents((prevTalents) =>
          prevTalents.map((talent) =>
            talent.id === id
              ? { ...talent, isFavorite: isCurrentlyFavorite }
              : talent,
          ),
        );

        toast.error(response.message || "Failed to update favorite status");
      } else {
        // Use the message from API response
        toast.success(
          response.message || "Favorite status updated successfully",
        );
      }
    } catch (error) {
      // Revert optimistic update on error
      if (isCurrentlyFavorite) {
        setFavoriteTalents([...favoriteTalents, id]);
      } else {
        setFavoriteTalents(favoriteTalents.filter((tid) => tid !== id));
      }

      // Revert talents list
      setTalents((prevTalents) =>
        prevTalents.map((talent) =>
          talent.id === id
            ? { ...talent, isFavorite: isCurrentlyFavorite }
            : talent,
        ),
      );

      toast.error(
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to update favorite status",
      );
    }
  };

  return (
    <>
      <Loader show={isLoading} />
      <div className="flex flex-col lg:flex-row gap-8 min-h-screen bg-gray-50/50 mb-4">
        {/* Sidebar */}
        <div className="shrink-0 lg:w-72">
          <TalentFilterSidebar
            groups={filterGroups}
            selectedFilters={selectedFilters}
            onFilterChange={setSelectedFilters}
            onRefresh={handleRefreshFilters}
            onLocationDataUpdate={handleLocationDataUpdate}
            locationIdToTitleMap={locationIdToTitleMap}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <h1 className="text-2xl font-bold font-sans text-transparent bg-clip-text bg-linear-to-b from-primary to-secondary">
              Talent Pool
            </h1>

            <div className="flex items-center gap-3 w-full md:w-auto">
              {selectedTalents.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-10 px-3 bg-white border-primary-500 text-primary-500 rounded-lg hover:bg-primary-50 flex items-center gap-2"
                    >
                      <span className="font-sans text-sm font-medium">
                        Bulk Action
                      </span>
                      <Icon icon="mdi:chevron-down" className="size-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() =>
                        setBulkInviteDialog({ open: true, mode: "job" })
                      }
                    >
                      <Icon
                        icon="majesticons:briefcase-line"
                        className="size-4 text-gray-600"
                      />
                      <span className="font-sans">Invite to Job</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() =>
                        setBulkInviteDialog({ open: true, mode: "assessment" })
                      }
                    >
                      <Icon
                        icon="mdi:help-box-multiple-outline"
                        className="size-4 text-gray-600"
                      />
                      <span className="font-sans">Request Assessment</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              <div className="relative w-full md:w-80">
                <Icon
                  icon="mdi:magnify"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5"
                />
                <Input
                  type="text"
                  placeholder="Search Here..."
                  className="pl-10 h-10 bg-white border-gray-200 rounded-lg w-full focus-visible:ring-1 focus-visible:ring-primary-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <TalentFilterSheet
                groups={filterGroups}
                selectedFilters={selectedFilters}
                onFilterChange={setSelectedFilters}
                onRefresh={handleRefreshFilters}
                onLocationDataUpdate={handleLocationDataUpdate}
                locationIdToTitleMap={locationIdToTitleMap}
              />

              <SortDropdown
                value={`${sortBy}-${sortDirection}`}
                onValueChange={(value) => {
                  const [newSortBy, newSortDirection] = value.split("-") as [
                    "score" | "experience" | "recently_assessed",
                    "asc" | "desc",
                  ];
                  setSortBy(newSortBy);
                  setSortDirection(newSortDirection);
                  setCurrentPage(1);
                }}
                options={[
                  { value: "score-desc", label: "Score (High to Low)" },
                  { value: "score-asc", label: "Score (Low to High)" },
                  {
                    value: "experience-desc",
                    label: "Experience (High to Low)",
                  },
                  {
                    value: "recently_assessed-desc",
                    label: "Recently Assessed",
                  },
                ]}
              />
            </div>
          </div>
          <div className="flex flex-col gap-5">
            {filteredTalents.map((talent) => (
              <TalentCard
                key={talent.id}
                id={talent.id}
                role={talent.role}
                expertise={talent.expertise}
                location_code={talent.location_code}
                totalScore={talent.totalScore}
                skillsAssessed={talent.skillsAssessed}
                experience={talent.experience}
                company={talent.company}
                availability={talent.availability}
                location={talent.location}
                assessmentTaken={talent.assessmentTaken}
                assessments={talent.assessments}
                about={talent.about}
                isSelected={selectedTalents.includes(talent.id)}
                onSelect={() => toggleTalentSelection(talent.id)}
                isFavorite={favoriteTalents.includes(talent.id)}
                onToggleFavorite={() => toggleFavorite(talent.id)}
              />
            ))}
            {!isLoading && filteredTalents.length === 0 && (
              <div className="w-full">
                <NoDataFound
                  title="No talents found"
                  note="Try adjusting your search or filters"
                />
                <div className="flex justify-center mt-4">
                  <Button
                    variant="link"
                    onClick={handleRefreshFilters}
                    className="text-primary-600"
                  >
                    Clear all filters
                  </Button>
                </div>
              </div>
            )}
          </div>
          {totalPages > 1 && (
            <div className="mt-8">
              <AssessmentPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>

        <InviteDialog
          open={bulkInviteDialog.open}
          onOpenChange={(open) =>
            setBulkInviteDialog((prev) => ({ ...prev, open }))
          }
          mode={bulkInviteDialog.mode}
          candidateIds={selectedTalents}
          onInviteSuccess={() => setSelectedTalents([])}
        />
      </div>
    </>
  );
}
