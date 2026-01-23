import { Icon } from "@iconify/react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FilterResponse, OptionItem } from "./recruiter-jobs";

type FilterGroups = {
  title: string;
  items: OptionItem[];
};

interface JobFilterSheetProps {
  filterItems: FilterResponse;
  selectedFilters: string[];
  onFilterChange: (filters: string[]) => void;
  onRefresh: () => void;
}

export default function JobFilterSheet({
  filterItems,
  selectedFilters,
  onFilterChange,
  onRefresh,
}: JobFilterSheetProps) {
  const handleCheckboxChange = (id: string, checked: boolean) => {
    if (checked) {
      onFilterChange([...selectedFilters, id]);
    } else {
      onFilterChange(selectedFilters.filter((f) => f !== id));
    }
  };

  const filterGroups: FilterGroups[] | undefined = filterItems?.map(
    (group): FilterGroups => {
      const [key, items] = Object.entries(group)[0];

      return {
        title: key,
        items: Array.isArray(items) ? (items as OptionItem[]) : [],
      };
    }
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="lg:hidden h-10 w-10 bg-white border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 shrink-0"
        >
          <Icon icon="material-symbols:filter-alt-outline" className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="rounded-l-2xl max-w-xs p-0 flex flex-col h-full bg-white"
      >
        <SheetHeader className="px-5 py-4 border-b border-gray-100 flex-none">
          <SheetTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Icon
                icon="material-symbols-light:filter-alt-outline"
                className="text-primary-600 size-5"
              />
              <span className="text-base font-bold text-gray-900 font-sans">
                Filter
              </span>
            </div>
            <Button
              type="button"
              onClick={onRefresh}
              aria-label="Refresh filters"
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-gray-100 rounded-full"
            >
              <Icon
                icon="mdi:refresh"
                className="size-4.5 text-gray-500 hover:text-gray-700"
                aria-hidden="true"
              />
            </Button>
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          <div className="w-full">
            <Accordion type="multiple" className="w-full">
              {filterGroups.map((group) => (
                <AccordionItem
                  key={group.title}
                  value={group.title}
                  className="border-gray-100"
                >
                  <div className="py-0">
                    <AccordionTrigger className="px-4 py-3 text-sm font-semibold uppercase text-gray-900 hover:no-underline hover:bg-gray-50/50">
                      {group.title.replace(/_/g, " ")}
                    </AccordionTrigger>
                  </div>
                  <AccordionContent className="px-4 pb-3 pt-0 text-sm text-gray-700">
                    <div className="flex flex-col gap-3 mt-2">
                      {group.items.map((option) => {
                        const isSelected = selectedFilters.includes(
                          option.value
                        );
                        return (
                          <div
                            key={option.value}
                            className="flex items-center gap-2.5"
                          >
                            <Checkbox
                              id={option.value}
                              checked={isSelected}
                              onCheckedChange={(checked) =>
                                handleCheckboxChange(
                                  option.value,
                                  checked as boolean
                                )
                              }
                              className="border-gray-300 data-[state=checked]:bg-primary-600 data-[state=checked]:border-primary-600"
                            />
                            <Label
                              htmlFor={option.value}
                              className="text-sm font-medium text-gray-700 leading-none cursor-pointer"
                            >
                              {option.title}
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
