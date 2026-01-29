"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { UseFormReturn } from "react-hook-form";
import { type JobFormData } from "@/validation/job";
import { useState, useRef } from "react";
import { Search } from "lucide-react";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { Skill } from "@/types/job";

interface SkillsSelectProps {
  form: UseFormReturn<JobFormData>;
  skills: Skill[];
}

export default function SkillsSelect({ form, skills }: SkillsSelectProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter skills based on search query
  const filteredSkills = skills.filter((skill) =>
    skill.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <FormField
      control={form.control}
      name="skills"
      render={({ field }) => {
        // Ensure field.value is an array of strings
        const selectedSkills = Array.isArray(field.value) ? field.value : [];

        // Toggle skill selection
        const handleToggle = (skillLabel: string) => {
          const isSelected = selectedSkills.includes(skillLabel);

          if (isSelected) {
            // Remove from selection
            field.onChange(selectedSkills.filter((s) => s !== skillLabel));
          } else {
            // Add to selection
            field.onChange([...selectedSkills, skillLabel]);
          }
        };

        const getSelectedLabel = () => {
          if (selectedSkills.length === 0) return "Select primary skills";
          // selectedSkills already contains skill names/labels
          return selectedSkills.join(", ");
        };

        return (
          <FormItem>
            <FormLabel>Primary Skill Set</FormLabel>
            <FormControl>
              <Popover
                open={open}
                onOpenChange={(newOpen) => {
                  setOpen(newOpen);
                  if (!newOpen) {
                    setSearchQuery("");
                  }
                }}
              >
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "min-h-8 h-fit w-full justify-between bg-transparent text-left font-normal",
                      "border-black hover:bg-transparent",
                      "text-sm",
                      selectedSkills.length === 0 && "text-muted-foreground",
                    )}
                  >
                    <span className="flex-1 text-wrap wrap-break-word pr-2 text-sm ">
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
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search skills..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8 h-9"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                  {/* Skills List */}
                  <div className="max-h-[300px] overflow-y-auto scrollbar-hide">
                    {filteredSkills.length === 0 ? (
                      <div className="px-4 py-2 text-sm text-gray-500 text-center">
                        {searchQuery.trim()
                          ? "No skills found"
                          : "No skills available"}
                      </div>
                    ) : (
                      <>
                        {filteredSkills.map((skill, index) => {
                          // Match by skill label/name, not by value/ID
                          const isSelected = selectedSkills.includes(
                            skill.name,
                          );
                          return (
                            <div
                              key={skill.id}
                              className={cn(
                                "flex items-center gap-4 px-6 py-4 border-b border-gray-200 last:border-b-0 cursor-pointer hover:bg-gray-50",
                                isSelected && "bg-gray-50",
                                index === 0 && "rounded-t-2xl",
                              )}
                              onClick={() => handleToggle(skill.name)}
                            >
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={() => handleToggle(skill.name)}
                                className="size-5"
                              />
                              <Label className="text-base font-normal text-black cursor-pointer flex-1">
                                {skill.name}
                              </Label>
                            </div>
                          );
                        })}
                      </>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
