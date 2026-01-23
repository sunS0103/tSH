"use client";

import { updateSkills } from "@/api/profile";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { getCookie } from "cookies-next/client";
import { useEffect, useState } from "react";
import { getSkills } from "@/api/seeder";

const skillCategoryOptions = [
  // { label: "Software Development", value: 1 },
  { label: "Software Testing", value: 2 },
  { label: "DevOps", value: 3 },
  { label: "GenAI & Agents", value: 4 },
  { label: "Programming Skills", value: 5 },
  { label: "Frontend", value: 6 },
  { label: "Backend", value: 7 },
  { label: "Databases", value: 8 },
];

const editSkillsSchema = z.object({
  primary_skill_category: z
    .number()
    .min(1, "Primary skill category is required"),
  primary_skills: z
    .array(z.number())
    .min(1, "At least one primary skill is required"),
  secondary_skills: z.array(z.number()).optional(),
  preferred_roles: z
    .array(z.number())
    .min(1, "At least one preferred role is required"),
  certifications: z.string().optional(),
});

type EditSkillsFormData = z.infer<typeof editSkillsSchema>;

interface SkillOption {
  id: number;
  name: string;
  category_name: string;
}

interface RoleOption {
  id: number;
  name: string;
}

// Primary skills data with IDs and category names
const primarySkillsData: SkillOption[] = [
  { id: 1, name: "Selenium Java", category_name: "Software Testing" },
  { id: 2, name: "Playwright JS/TS", category_name: "Software Testing" },
  { id: 3, name: "Appium", category_name: "Software Testing" },
  { id: 4, name: "Core Java", category_name: "Programming Skills" },
  { id: 5, name: "Python", category_name: "Programming Skills" },
  { id: 6, name: "React", category_name: "Frontend" },
  { id: 7, name: "Node.js", category_name: "Backend" },
  { id: 8, name: "AWS", category_name: "DevOps" },
  { id: 9, name: "LangChain", category_name: "GenAI & Agents" },
  { id: 10, name: "PostgreSQL", category_name: "Databases" },
  { id: 11, name: "MongoDB", category_name: "Databases" },
];

// Map category value to category name
const getCategoryName = (value: number): string => {
  const category = skillCategoryOptions.find((opt) => opt.value === value);
  return category?.label || "";
};

export default function EditSkills() {
  const [skills, setSkills] = useState<any>([]);
  const router = useRouter();

  const cookieValue = getCookie("skills_data");
  const skillsData = cookieValue ? JSON.parse(cookieValue as string) : null;

  // Helper function to validate and filter IDs
  const validateIds = (
    ids: number[] | undefined,
    validIds: number[]
  ): number[] => {
    if (!ids || !Array.isArray(ids)) return [];
    return ids.filter((id) => validIds.includes(id));
  };

  // Get valid IDs from cookie data
  const getValidPrimarySkillCategory = (): number => {
    const categoryId = skillsData?.primary_skill_category?.id;
    const validCategoryIds = skillCategoryOptions.map((opt) => opt.value);
    return validCategoryIds.includes(categoryId) ? categoryId : 0;
  };

  const getValidPrimarySkills = (categoryId: number): number[] => {
    const categoryName = getCategoryName(categoryId);
    const validSkillIds = primarySkillsData
      .filter((skill) => skill.category_name === categoryName)
      .map((skill) => skill.id);
    return validateIds(
      skillsData?.primary_skills.map((skill: { id: number }) => skill.id),
      validSkillIds
    );
  };

  const getValidSecondarySkills = (categoryId: number): number[] => {
    const categoryName = getCategoryName(categoryId);
    const validSkillIds = primarySkillsData
      .filter((skill) => skill.category_name === categoryName)
      .map((skill) => skill.id);
    return validateIds(
      skillsData?.secondary_skills?.map((skill: { id: number }) => skill.id),
      validSkillIds
    );
  };

  const getValidPreferredRoles = (): number[] => {
    const validCategoryIds = skillCategoryOptions.map((opt) => opt.value);
    return validateIds(
      skillsData?.preferred_roles?.map((role: { id: number }) => role.id),
      validCategoryIds
    );
  };

  // Initialize form with validated cookie data
  const initialPrimarySkillCategory = getValidPrimarySkillCategory();
  const initialPrimarySkills = getValidPrimarySkills(
    initialPrimarySkillCategory
  );

  const form = useForm<EditSkillsFormData>({
    resolver: zodResolver(editSkillsSchema),
    defaultValues: {
      primary_skill_category: initialPrimarySkillCategory || 0,
      primary_skills: initialPrimarySkills,
      secondary_skills: getValidSecondarySkills(initialPrimarySkillCategory),
      preferred_roles: getValidPreferredRoles(),
      certifications: skillsData?.certifications || "",
    },
  });

  const selectedCategory = form.watch("primary_skill_category");
  const primarySkills = form.watch("primary_skills");
  const [secondaryPopoverOpen, setSecondaryPopoverOpen] = useState(false);

  // Filter primary skills based on selected category
  const filteredPrimarySkills = primarySkillsData.filter(
    (skill) => skill.category_name === getCategoryName(selectedCategory)
  );

  useEffect(() => {
    const fetchSkills = async () => {
      const response = await getSkills();
      setSkills(response.data);
    };
    fetchSkills();
  }, []);

  // Update primary skills when category changes - filter existing selections
  useEffect(() => {
    const currentPrimarySkills = form.getValues("primary_skills");
    const categoryName = getCategoryName(selectedCategory);
    const validSkillIds = primarySkillsData
      .filter((skill) => skill.category_name === categoryName)
      .map((skill) => skill.id);

    // Filter out skills that don't belong to the new category
    const filteredSkills = currentPrimarySkills.filter((id) =>
      validSkillIds.includes(id)
    );

    if (filteredSkills.length !== currentPrimarySkills.length) {
      form.setValue("primary_skills", filteredSkills);
    }

    // Filter secondary skills to only include those from the current category
    const currentSecondarySkills = form.getValues("secondary_skills") || [];
    const filteredSecondarySkills = currentSecondarySkills.filter((id) =>
      validSkillIds.includes(id)
    );

    // Also remove any secondary skills that are now in primary skills
    const finalSecondarySkills = filteredSecondarySkills.filter(
      (id) => !filteredSkills.includes(id)
    );

    if (finalSecondarySkills.length !== currentSecondarySkills.length) {
      form.setValue("secondary_skills", finalSecondarySkills);
    }
  }, [selectedCategory, form]);

  // Remove secondary skills that are in primary skills when popover opens or primary skills change
  useEffect(() => {
    const currentPrimarySkills = primarySkills || [];
    const currentSecondarySkills = form.getValues("secondary_skills") || [];

    // Filter out any secondary skills that are now in primary skills
    const filteredSecondarySkills = currentSecondarySkills.filter(
      (id) => !currentPrimarySkills.includes(id)
    );

    if (filteredSecondarySkills.length !== currentSecondarySkills.length) {
      form.setValue("secondary_skills", filteredSecondarySkills);
    }
  }, [secondaryPopoverOpen, primarySkills, form]);

  const handleSubmit = async (data: EditSkillsFormData) => {
    try {
      const payload: {
        primary_skill_category: number;
        primary_skills: number[];
        secondary_skill: number[];
        preferred_role: number[];
        certifications: string | null;
      } = {
        primary_skill_category: data.primary_skill_category,
        primary_skills: data.primary_skills,
        secondary_skill:
          data.secondary_skills && data.secondary_skills.length > 0
            ? data.secondary_skills
            : [],
        preferred_role: data.preferred_roles,
        certifications:
          data.certifications && data.certifications.trim().length > 0
            ? data.certifications
            : null,
      };

      const response = await updateSkills(payload);

      if (response.success) {
        toast.success(response.message || "Skills updated successfully");
        router.push("/profile");
      }
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to update skills";
      toast.error(errorMessage);
    }
  };

  const handleCancel = () => {
    router.push("/profile");
  };

  const getSelectedSkillsLabel = (
    selectedIds: number[],
    options: SkillOption[] | RoleOption[] | typeof skillCategoryOptions
  ) => {
    if (selectedIds.length === 0) return "Select options";
    const selected = options.filter((opt) => {
      if ("value" in opt) {
        // For skillCategoryOptions format (has value and label)
        return selectedIds.includes(opt.value);
      } else {
        // For SkillOption or RoleOption format (has id and name)
        return selectedIds.includes(opt.id);
      }
    });
    return selected
      .map((opt) => ("label" in opt ? opt.label : opt.name))
      .join(", ");
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-3xl mx-auto mt-4 overflow-hidden">
      {/* Header */}
      <div className="bg-purple-50 px-6 py-4">
        <h2 className="text-xl font-bold text-black">Edit Skills & Domains</h2>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-4 p-6"
        >
          {/* Primary Skill Category and Primary Skills */}
          <div className="flex flex-col md:flex-row gap-4">
            <FormField
              control={form.control}
              name="primary_skill_category"
              render={({ field }) => (
                <FormItem className="w-full md:w-1/2">
                  <Label className="text-sm font-medium text-black">
                    Primary Skill Category
                  </Label>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(parseInt(value));
                        // Clear primary skills when category changes
                        form.setValue("primary_skills", []);
                        // Clear secondary skills when category changes
                        form.setValue("secondary_skills", []);
                      }}
                      value={
                        field.value && field.value > 0
                          ? field.value.toString()
                          : undefined
                      }
                    >
                      <SelectTrigger className="h-8 border-gray-900 w-full">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {skillCategoryOptions.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value.toString()}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="primary_skills"
              render={({ field }) => (
                <FormItem className="w-full md:w-1/2">
                  <Label className="text-sm font-medium text-black">
                    Primary Skills
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "min-h-8 h-auto w-full justify-between border-gray-900 bg-white text-left font-normal py-2",
                          "hover:bg-white"
                        )}
                      >
                        <span
                          className={cn(
                            "flex-1 text-wrap wrap-break-word pr-2",
                            (!field.value || field.value.length === 0) &&
                              "text-gray-500"
                          )}
                        >
                          {getSelectedSkillsLabel(
                            field.value || [],
                            filteredPrimarySkills
                          )}
                        </span>
                        <Icon
                          icon="material-symbols:keyboard-arrow-down-rounded"
                          className="h-4 w-4 shrink-0 opacity-50"
                        />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="p-0 bg-white border border-gray-200 rounded-2xl shadow-[0px_0px_25px_0px_rgba(0,0,0,0.15)]"
                      align="start"
                    >
                      <div className="flex flex-col h-1/2 overflow-y-auto">
                        {filteredPrimarySkills.length === 0 ? (
                          <div className="px-6 py-4 text-sm text-gray-500 text-center rounded-2xl w-full">
                            No skill available for this category
                          </div>
                        ) : (
                          filteredPrimarySkills.map((option, index) => (
                            <div
                              key={option.id}
                              className={cn(
                                "flex items-center gap-4 px-6 py-4 border-b border-gray-200 last:border-b-0 cursor-pointer hover:bg-gray-50",
                                index === 0 && "rounded-t-2xl",
                                index === filteredPrimarySkills.length - 1 &&
                                  "rounded-b-2xl"
                              )}
                              onClick={() => {
                                const currentValue = field.value || [];
                                const isSelected = currentValue.includes(
                                  option.id
                                );
                                if (isSelected) {
                                  field.onChange(
                                    currentValue.filter(
                                      (id) => id !== option.id
                                    )
                                  );
                                } else {
                                  field.onChange([...currentValue, option.id]);
                                }
                              }}
                            >
                              <Checkbox
                                checked={(field.value || []).includes(
                                  option.id
                                )}
                                onCheckedChange={(checked) => {
                                  const currentValue = field.value || [];
                                  if (checked) {
                                    field.onChange([
                                      ...currentValue,
                                      option.id,
                                    ]);
                                  } else {
                                    field.onChange(
                                      currentValue.filter(
                                        (id) => id !== option.id
                                      )
                                    );
                                  }
                                }}
                                className="size-5"
                              />
                              <Label className="text-base font-normal text-black cursor-pointer flex-1">
                                {option.name}
                              </Label>
                            </div>
                          ))
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Secondary Skills and Preferred Roles */}
          <div className="flex flex-col md:flex-row gap-4">
            <FormField
              control={form.control}
              name="secondary_skills"
              render={({ field }) => {
                // Remove already selected primary skills
                const selectedPrimarySkills =
                  form.getValues("primary_skills") || [];
                const availableSecondarySkills = filteredPrimarySkills.filter(
                  (skill) => !selectedPrimarySkills.includes(skill.id)
                );

                return (
                  <FormItem className="w-full md:w-1/2">
                    <Label className="text-sm font-medium text-black">
                      Secondary Skills
                    </Label>
                    <Popover
                      open={secondaryPopoverOpen}
                      onOpenChange={setSecondaryPopoverOpen}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "min-h-8 h-auto w-full justify-between border-gray-900 bg-white text-left font-normal py-2",
                            "hover:bg-white"
                          )}
                        >
                          <span
                            className={cn(
                              "flex-1 text-wrap wrap-break-word pr-2",
                              (!field.value || field.value.length === 0) &&
                                "text-gray-500"
                            )}
                          >
                            {getSelectedSkillsLabel(
                              field.value || [],
                              availableSecondarySkills
                            )}
                          </span>
                          <Icon
                            icon="material-symbols:keyboard-arrow-down-rounded"
                            className="h-4 w-4 shrink-0 opacity-50"
                          />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="p-0 bg-white border border-gray-200 rounded-2xl shadow-[0px_0px_25px_0px_rgba(0,0,0,0.15)]"
                        align="start"
                      >
                        <div className="flex flex-col">
                          {availableSecondarySkills.length === 0 ? (
                            <div className="px-6 py-4 text-sm text-gray-500 text-center rounded-2xl">
                              No skill available for this category
                            </div>
                          ) : (
                            availableSecondarySkills.map((option, index) => (
                              <div
                                key={option.id}
                                className={cn(
                                  "flex items-center gap-4 px-6 py-4 border-b border-gray-200 last:border-b-0 cursor-pointer hover:bg-gray-50",
                                  index === 0 && "rounded-t-2xl",
                                  index ===
                                    availableSecondarySkills.length - 1 &&
                                    "rounded-b-2xl"
                                )}
                                onClick={() => {
                                  const currentValue = field.value || [];
                                  const isSelected = currentValue.includes(
                                    option.id
                                  );
                                  if (isSelected) {
                                    field.onChange(
                                      currentValue.filter(
                                        (id) => id !== option.id
                                      )
                                    );
                                  } else {
                                    field.onChange([
                                      ...currentValue,
                                      option.id,
                                    ]);
                                  }
                                }}
                              >
                                <Checkbox
                                  checked={(field.value || []).includes(
                                    option.id
                                  )}
                                  onCheckedChange={(checked) => {
                                    const currentValue = field.value || [];
                                    if (checked) {
                                      field.onChange([
                                        ...currentValue,
                                        option.id,
                                      ]);
                                    } else {
                                      field.onChange(
                                        currentValue.filter(
                                          (id) => id !== option.id
                                        )
                                      );
                                    }
                                  }}
                                  className="size-5"
                                />
                                <Label className="text-base font-normal text-black cursor-pointer flex-1">
                                  {option.name}
                                </Label>
                              </div>
                            ))
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="preferred_roles"
              render={({ field }) => (
                <FormItem className="w-full md:w-1/2">
                  <Label className="text-sm font-medium text-black">
                    Preferred Roles
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "min-h-8 h-auto w-full justify-between border-gray-900 bg-white text-left font-normal py-2",
                          "hover:bg-white"
                        )}
                      >
                        <span
                          className={cn(
                            "flex-1 text-wrap wrap-break-word pr-2",
                            (!field.value || field.value.length === 0) &&
                              "text-gray-500"
                          )}
                        >
                          {getSelectedSkillsLabel(
                            field.value || [],
                            skillCategoryOptions
                          )}
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
                      <div className="flex flex-col h-[40vh] overflow-y-auto">
                        {skillCategoryOptions.map((option, index) => (
                          <div
                            key={option.value}
                            className={cn(
                              "flex items-center gap-4 px-6 py-4 border-b border-gray-200 last:border-b-0 cursor-pointer hover:bg-gray-50",
                              index === 0 && "rounded-t-2xl",
                              index === skillCategoryOptions.length - 1 &&
                                "rounded-b-2xl"
                            )}
                            onClick={() => {
                              const currentValue = field.value || [];
                              const isSelected = currentValue.includes(
                                option.value
                              );
                              if (isSelected) {
                                field.onChange(
                                  currentValue.filter(
                                    (id) => id !== option.value
                                  )
                                );
                              } else {
                                field.onChange([...currentValue, option.value]);
                              }
                            }}
                          >
                            <Checkbox
                              checked={(field.value || []).includes(
                                option.value
                              )}
                              onCheckedChange={(checked) => {
                                const currentValue = field.value || [];
                                if (checked) {
                                  field.onChange([
                                    ...currentValue,
                                    option.value,
                                  ]);
                                } else {
                                  field.onChange(
                                    currentValue.filter(
                                      (id) => id !== option.value
                                    )
                                  );
                                }
                              }}
                              className="size-5"
                            />
                            <Label className="text-base font-normal text-black cursor-pointer flex-1">
                              {option.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Certifications */}
          <div className="flex flex-col md:flex-row gap-4">
            <FormField
              control={form.control}
              name="certifications"
              render={({ field }) => (
                <FormItem className="w-full md:w-1/2">
                  <Label className="text-sm font-medium text-black">
                    Certifications
                  </Label>
                  <FormControl>
                    <Input
                      placeholder="e.g., AWS-3, React"
                      className="h-8 border-gray-900 placeholder:text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-end pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              className="h-8 px-4"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="h-8 px-4"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
