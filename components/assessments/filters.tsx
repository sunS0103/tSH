"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FILTER_ITEMS = [
  "Technology",
  "Software Testing",
  "Programming Skills",
  "Frontend",
  "Backend",
  "GenAI & Agents",
];

interface FiltersProps {
  selectedFilters?: string[];
  onFilterChange?: (filters: string[]) => void;
}

export default function Filters({
  selectedFilters = [],
  onFilterChange,
}: FiltersProps) {
  const handleCheckboxChange = (item: string, checked: boolean) => {
    if (!onFilterChange) return;

    if (checked) {
      onFilterChange([...selectedFilters, item]);
    } else {
      onFilterChange(selectedFilters.filter((filter) => filter !== item));
    }
  };

  return (
    <div className="bg-white w-60 border-gray-200">
      <Accordion type="multiple" className="w-full">
        {FILTER_ITEMS.map((item) => (
          <AccordionItem key={item} value={item} className="border-gray-200">
            <AccordionTrigger className="px-4 text-sm font-semibold uppercase text-gray-800 hover:no-underline">
              {item}
            </AccordionTrigger>
            <AccordionContent className="px-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={item}
                  checked={selectedFilters.includes(item)}
                  onChange={(e) => handleCheckboxChange(item, e.target.checked)}
                  className="cursor-pointer"
                />
                <label htmlFor={item} className="cursor-pointer">
                  {item}
                </label>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
