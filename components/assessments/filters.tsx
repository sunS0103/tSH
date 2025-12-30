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

// Common item structure
interface OptionItem {
  id: string;
  value: string;
}

// Technology wrapper
interface TechnologyBlock {
  technology: OptionItem[];
}

// Skills wrapper
interface SkillsBlock {
  skills: OptionItem[];
}

// Final API response type
type TechnologySkillsResponse = Array<TechnologyBlock | SkillsBlock>;

interface FiltersProps {
  selectedFilters?: string[];
  onFilterChange?: (filters: string[]) => void;
  filterItem?: TechnologySkillsResponse;
}

type FilterItem = {
  id: string;
  value: string;
};

type FilterGroups = {
  title: string;
  items: FilterItem[];
};

export default function Filters({
  selectedFilters = [],
  onFilterChange,
  filterItem,
}: FiltersProps) {
  const handleCheckboxChange = (item: string, checked: boolean) => {
    if (!onFilterChange) return;

    if (checked) {
      onFilterChange([...selectedFilters, item]);
    } else {
      onFilterChange(selectedFilters.filter((filter) => filter !== item));
    }
  };

  const filterGroups: FilterGroups[] | undefined = filterItem?.map(
    (group): FilterGroups => {
      const [key, items] = Object.entries(group)[0];

      return {
        title: key,
        items,
      };
    }
  );

  return (
    <div className="bg-white w-60 border-gray-200">
      <Accordion
        type="multiple"
        className="w-full"
        defaultValue={["technology", "skills"]}
      >
        {filterGroups?.map((group) => (
          <AccordionItem
            key={group.title}
            value={group.title}
            className="border-gray-200"
          >
            <AccordionTrigger className="px-4 text-sm font-semibold uppercase text-gray-800 hover:no-underline">
              {group.title}
            </AccordionTrigger>

            <AccordionContent className="px-4 text-sm text-gray-600">
              <div className="flex flex-col gap-2">
                {group?.items.map((item: { id: string; value: string }) => (
                  <div key={item?.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={item?.id}
                      checked={selectedFilters.includes(item?.id)}
                      onChange={(e) =>
                        handleCheckboxChange(item?.id, e.target.checked)
                      }
                      className="cursor-pointer"
                    />
                    <label
                      htmlFor={item?.id}
                      className="cursor-pointer max-w-48"
                    >
                      {item?.value}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
