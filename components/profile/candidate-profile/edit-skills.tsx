"use client";

import { updateSkills } from "@/api/profile";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
import { useEffect, useState, useRef } from "react";
import { getSkillCategories, getSkills } from "@/api/seeder";

const editSkillsSchema = z.object({
  primary_skill_category: z
    .number()
    .min(1, "Primary skill category is required"),
  primary_skills: z
    .array(z.number())
    .min(1, "At least one primary skill is required"),
  secondary_skills: z.array(z.number()).optional(),
  // .min(1, "At least one secondary skill is required"),
  // preferred_roles: z
  //   .array(z.number())
  //   .min(1, "At least one preferred role is required"),
  certifications: z.string().optional(),
});

type EditSkillsFormData = z.infer<typeof editSkillsSchema>;

interface SkillOption {
  id: number;
  name: string;
  category_name?: string;
  category_id?: number;
  category?: {
    id: number;
    name: string;
  };
}

interface RoleOption {
  id: number;
  name: string;
}

interface CategoryOption {
  id: number;
  name: string;
}

export default function EditSkills() {
  const [skills, setSkills] = useState<SkillOption[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const router = useRouter();
  const isFormInitialized = useRef(false);

  const cookieValue = getCookie("skills_data");
  const skillsData = cookieValue ? JSON.parse(cookieValue as string) : null;

  // Helper function to validate and filter IDs
  const validateIds = (
    ids: number[] | undefined,
    validIds: number[],
  ): number[] => {
    if (!ids || !Array.isArray(ids)) return [];
    return ids.filter((id) => validIds.includes(id));
  };

  // Map category ID to category name
  const getCategoryName = (categoryId: number): string => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category?.name || "";
  };

  // Get category ID from skill (handles different API response structures)
  const getSkillCategoryId = (skill: SkillOption): number | null => {
    if (skill.category_id) return skill.category_id;
    if (skill.category?.id) return skill.category.id;
    // If only category_name is available, find matching category
    if (skill.category_name) {
      const category = categories.find(
        (cat) => cat.name === skill.category_name,
      );
      return category?.id || null;
    }
    return null;
  };

  // Get valid IDs from cookie data
  const getValidPrimarySkillCategory = (): number => {
    const categoryId = skillsData?.primary_skill_category?.id;
    const validCategoryIds = categories.map((cat) => cat.id);
    return validCategoryIds.includes(categoryId) ? categoryId : 0;
  };

  /*
  const getValidPreferredRoles = (): number[] => {
    const validCategoryIds = categories.map((cat) => cat.id);
    return validateIds(
      skillsData?.preferred_roles?.map((role: { id: number }) => role.id),
      validCategoryIds,
    );
  };
  */

  // Initialize form with validated cookie data
  const form = useForm<EditSkillsFormData>({
    resolver: zodResolver(editSkillsSchema),
    defaultValues: {
      primary_skill_category: 0,
      primary_skills: [],
      secondary_skills: [],
      // preferred_roles: [],
      certifications: skillsData?.certifications || "",
    },
  });

  const selectedCategory = form.watch("primary_skill_category");
  const primarySkills = form.watch("primary_skills");
  const [secondaryPopoverOpen, setSecondaryPopoverOpen] = useState(false);

  // Filter primary skills based on selected category
  const filteredPrimarySkills = skills.filter((skill) => {
    const skillCategoryId = getSkillCategoryId(skill);
    return skillCategoryId === selectedCategory;
  });

  const fetchSkills = async () => {
    try {
      const response = await getSkills();
      setSkills(response.data || []);
    } catch (error) {
      console.error("Error fetching skills:", error);
      setSkills([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getSkillCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchSkills();
    fetchCategories();
  }, []);

  // Initialize form values after categories and skills are loaded
  useEffect(() => {
    if (
      categories.length > 0 &&
      skills.length > 0 &&
      !isFormInitialized.current &&
      skillsData
    ) {
      const initialPrimarySkillCategory = getValidPrimarySkillCategory();

      // Get all valid skill IDs from cookie (not filtered by category yet)
      const allValidSkillIds = skills.map((skill) => skill.id);
      const cookiePrimarySkillIds =
        skillsData?.primary_skills?.map((skill: { id: number }) => skill.id) ||
        [];
      const cookieSecondarySkillIds =
        skillsData?.secondary_skills?.map(
          (skill: { id: number }) => skill.id,
        ) || [];

      const validPrimarySkills = validateIds(
        cookiePrimarySkillIds,
        allValidSkillIds,
      );
      const validSecondarySkills = validateIds(
        cookieSecondarySkillIds,
        allValidSkillIds,
      );

      form.reset({
        primary_skill_category: initialPrimarySkillCategory || 0,
        primary_skills: validPrimarySkills,
        secondary_skills: validSecondarySkills,
        // preferred_roles: getValidPreferredRoles(),
        certifications: skillsData?.certifications || "",
      });

      isFormInitialized.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories, skills, skillsData]);

  // Update primary skills when category changes - filter existing selections
  useEffect(() => {
    // Don't filter on initial load - wait for form to be initialized
    if (
      categories.length === 0 ||
      skills.length === 0 ||
      !isFormInitialized.current
    )
      return;

    // Only filter if category is actually selected (not 0)
    if (selectedCategory === 0) return;

    const currentPrimarySkills = form.getValues("primary_skills");
    const validSkillIds = skills
      .filter((skill) => {
        const skillCategoryId = getSkillCategoryId(skill);
        return skillCategoryId === selectedCategory;
      })
      .map((skill) => skill.id);

    // Filter out skills that don't belong to the new category
    const filteredSkills = currentPrimarySkills.filter((id) =>
      validSkillIds.includes(id),
    );

    if (filteredSkills.length !== currentPrimarySkills.length) {
      form.setValue("primary_skills", filteredSkills);
    }

    // Filter secondary skills to only include those from the current category
    const currentSecondarySkills = form.getValues("secondary_skills") || [];
    const filteredSecondarySkills = currentSecondarySkills.filter((id) =>
      validSkillIds.includes(id),
    );

    // Also remove any secondary skills that are now in primary skills
    const finalSecondarySkills = filteredSecondarySkills.filter(
      (id) => !filteredSkills.includes(id),
    );

    if (finalSecondarySkills.length !== currentSecondarySkills.length) {
      form.setValue("secondary_skills", finalSecondarySkills);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, form, categories, skills]);

  // Remove secondary skills that are in primary skills when popover opens or primary skills change
  useEffect(() => {
    const currentPrimarySkills = primarySkills || [];
    const currentSecondarySkills = form.getValues("secondary_skills") || [];

    // Filter out any secondary skills that are now in primary skills
    const filteredSecondarySkills = currentSecondarySkills.filter(
      (id) => !currentPrimarySkills.includes(id),
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
        // preferred_role: number[];
        certifications: string | null;
      } = {
        primary_skill_category: data.primary_skill_category,
        primary_skills: data.primary_skills,
        secondary_skill:
          data.secondary_skills && data.secondary_skills.length > 0
            ? data.secondary_skills
            : [],
        // preferred_role: data.preferred_roles,
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
    options: SkillOption[] | RoleOption[] | CategoryOption[],
  ) => {
    if (selectedIds.length === 0) return "Select options";
    const selected = options.filter((opt) => selectedIds.includes(opt.id));
    return selected.map((opt) => opt.name).join(", ");
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
                  <FormLabel
                    required
                    className="text-sm font-medium text-black"
                  >
                    Primary Skill Category
                  </FormLabel>
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
                        {categories.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={category.id.toString()}
                          >
                            {category.name}
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
                  <FormLabel
                    required
                    className="text-sm font-medium text-black"
                  >
                    Primary Skills
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "min-h-8 h-auto w-full justify-between border-gray-900 bg-white text-left font-normal py-2",
                          "hover:bg-white",
                        )}
                      >
                        <span
                          className={cn(
                            "flex-1 text-wrap wrap-break-word pr-2",
                            (!field.value || field.value.length === 0) &&
                              "text-gray-500",
                          )}
                        >
                          {getSelectedSkillsLabel(field.value || [], skills)}
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
                      <div className="flex flex-col max-h-60 overflow-y-auto">
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
                                  "rounded-b-2xl",
                              )}
                              onClick={() => {
                                const currentValue = field.value || [];
                                const isSelected = currentValue.includes(
                                  option.id,
                                );
                                if (isSelected) {
                                  field.onChange(
                                    currentValue.filter(
                                      (id) => id !== option.id,
                                    ),
                                  );
                                } else {
                                  field.onChange([...currentValue, option.id]);
                                }
                              }}
                            >
                              <Checkbox
                                checked={(field.value || []).includes(
                                  option.id,
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
                                        (id) => id !== option.id,
                                      ),
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
                  (skill) => !selectedPrimarySkills.includes(skill.id),
                );

                return (
                  <FormItem className="w-full md:w-1/2">
                    <FormLabel className="text-sm font-medium text-black">
                      Secondary Skills
                    </FormLabel>
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
                            "hover:bg-white",
                          )}
                        >
                          <span
                            className={cn(
                              "flex-1 text-wrap wrap-break-word pr-2",
                              (!field.value || field.value.length === 0) &&
                                "text-gray-500",
                            )}
                          >
                            {getSelectedSkillsLabel(field.value || [], skills)}
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
                        <div className="flex flex-col max-h-60 overflow-y-auto">
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
                                    "rounded-b-2xl",
                                )}
                                onClick={() => {
                                  const currentValue = field.value || [];
                                  const isSelected = currentValue.includes(
                                    option.id,
                                  );
                                  if (isSelected) {
                                    field.onChange(
                                      currentValue.filter(
                                        (id) => id !== option.id,
                                      ),
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
                                    option.id,
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
                                          (id) => id !== option.id,
                                        ),
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

            {/* <FormField
              control={form.control}
              name="preferred_roles"
              render={({ field }) => (
                <FormItem className="w-full md:w-1/2">
                  <FormLabel
                    required
                    className="text-sm font-medium text-black"
                  >
                    Preferred Roles
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "min-h-8 h-auto w-full justify-between border-gray-900 bg-white text-left font-normal py-2",
                          "hover:bg-white",
                        )}
                      >
                        <span
                          className={cn(
                            "flex-1 text-wrap wrap-break-word pr-2",
                            (!field.value || field.value.length === 0) &&
                              "text-gray-500",
                          )}
                        >
                          {getSelectedSkillsLabel(
                            field.value || [],
                            categories,
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
                      <div className="flex flex-col max-h-60 overflow-y-auto">
                        {categories.map((category, index) => (
                          <div
                            key={category.id}
                            className={cn(
                              "flex items-center gap-4 px-6 py-4 border-b border-gray-200 last:border-b-0 cursor-pointer hover:bg-gray-50",
                              index === 0 && "rounded-t-2xl",
                              index === categories.length - 1 &&
                                "rounded-b-2xl",
                            )}
                            onClick={() => {
                              const currentValue = field.value || [];
                              const isSelected = currentValue.includes(
                                category.id,
                              );
                              if (isSelected) {
                                field.onChange(
                                  currentValue.filter(
                                    (id) => id !== category.id,
                                  ),
                                );
                              } else {
                                field.onChange([...currentValue, category.id]);
                              }
                            }}
                          >
                            <Checkbox
                              checked={(field.value || []).includes(
                                category.id,
                              )}
                              onCheckedChange={(checked) => {
                                const currentValue = field.value || [];
                                if (checked) {
                                  field.onChange([
                                    ...currentValue,
                                    category.id,
                                  ]);
                                } else {
                                  field.onChange(
                                    currentValue.filter(
                                      (id) => id !== category.id,
                                    ),
                                  );
                                }
                              }}
                              className="size-5"
                            />
                            <Label className="text-base font-normal text-black cursor-pointer flex-1">
                              {category.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <FormField
              control={form.control}
              name="certifications"
              render={({ field }) => (
                <FormItem className="w-full md:w-1/2">
                  <FormLabel className="text-sm font-medium text-black">
                    Certifications
                  </FormLabel>
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
