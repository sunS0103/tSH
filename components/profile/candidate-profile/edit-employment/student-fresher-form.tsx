"use client";

import { updateStudentFresherStatus } from "@/api/profile";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

const studentFresherSchema = z
  .object({
    employment_status: z.enum(["Student", "Fresher"]),
    looking_for_internship: z.boolean(),
    looking_for_full_time: z.boolean(),
    looking_for_part_time: z.boolean(),
    looking_for_remote: z.boolean(),
  })
  .refine(
    (data) =>
      data.looking_for_internship ||
      data.looking_for_full_time ||
      data.looking_for_part_time ||
      data.looking_for_remote,
    {
      message: "Please select at least one option",
      path: ["looking_for_internship"], // This will show the error message on the form
    }
  );

type StudentFresherFormData = z.infer<typeof studentFresherSchema>;

const lookingForOptions = [
  { key: "looking_for_internship" as const, label: "Internship" },
  { key: "looking_for_full_time" as const, label: "Full Time" },
  { key: "looking_for_part_time" as const, label: "Part Time" },
  { key: "looking_for_remote" as const, label: "Remote" },
];

interface StudentFresherFormProps {
  defaultValues?: Partial<StudentFresherFormData>;
  onCancel: () => void;
}

export default function StudentFresherForm({
  defaultValues,
  onCancel,
}: StudentFresherFormProps) {
  const router = useRouter();

  const form = useForm<StudentFresherFormData>({
    resolver: zodResolver(studentFresherSchema),
    defaultValues: {
      employment_status:
        (defaultValues?.employment_status as "Student" | "Fresher") ||
        "Student",
      looking_for_internship: defaultValues?.looking_for_internship || false,
      looking_for_full_time: defaultValues?.looking_for_full_time || false,
      looking_for_part_time: defaultValues?.looking_for_part_time || false,
      looking_for_remote: defaultValues?.looking_for_remote || false,
    },
  });

  const watchedValues = useWatch({
    control: form.control,
    name: [
      "looking_for_internship",
      "looking_for_full_time",
      "looking_for_part_time",
      "looking_for_remote",
    ],
  });

  const handleSubmit = async (data: StudentFresherFormData) => {
    try {
      const response = await updateStudentFresherStatus({
        employment_status: data.employment_status,
        looking_for_internship: data.looking_for_internship,
        looking_for_full_time: data.looking_for_full_time,
        looking_for_part_time: data.looking_for_part_time,
        looking_for_remote: data.looking_for_remote,
      });

      if (response.success) {
        toast.success(
          response.message || "Employment details updated successfully"
        );
        // Navigate to next section in onboarding flow
        router.push("/profile-details/edit-education");
      }
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        toast.error(error.issues[0]?.message || "Validation error");
      } else {
        const errorMessage =
          (error as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || "Failed to update employment details";
        toast.error(errorMessage);
      }
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="looking_for_internship"
          render={() => (
            <FormItem className="w-full">
              <Label className="text-sm font-medium text-black">
                Looking For
              </Label>
              <Popover>
                <PopoverTrigger asChild className="w-full md:w-1/2">
                  <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "h-8 w-full justify-between border-gray-900 bg-white text-left font-normal",
                      "hover:bg-white"
                    )}
                  >
                    <span className="truncate">
                      {(() => {
                        const [internship, fullTime, partTime, remote] =
                          watchedValues;
                        const selected = lookingForOptions.filter(
                          (option, index) => {
                            const values = [
                              internship,
                              fullTime,
                              partTime,
                              remote,
                            ];
                            return values[index];
                          }
                        );
                        return selected.length > 0
                          ? selected.map((opt) => opt.label).join(", ")
                          : "Select options";
                      })()}
                    </span>
                    <Icon
                      icon="material-symbols:keyboard-arrow-down-rounded"
                      className="ml-2 h-4 w-4 shrink-0 opacity-50"
                    />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[254px] p-0 bg-white border border-gray-200 rounded-2xl shadow-[0px_0px_25px_0px_rgba(0,0,0,0.15)]"
                  align="start"
                >
                  <div className="flex flex-col">
                    {lookingForOptions.map((option, index) => (
                      <FormField
                        key={option.key}
                        control={form.control}
                        name={option.key}
                        render={({ field }) => (
                          <div
                            className={cn(
                              "flex items-center gap-4 px-6 py-4 border-b border-gray-200 last:border-b-0 cursor-pointer hover:bg-gray-50",
                              index === 0 && "rounded-t-2xl",
                              index === lookingForOptions.length - 1 &&
                                "rounded-b-2xl"
                            )}
                            onClick={() => field.onChange(!field.value)}
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="size-5"
                              />
                            </FormControl>
                            <Label
                              htmlFor={option.key}
                              className="text-base font-normal text-black cursor-pointer flex-1"
                            >
                              {option.label}
                            </Label>
                          </div>
                        )}
                      />
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Buttons */}
        <div className="flex gap-3 justify-end pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            className="h-8 px-4"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="h-8 px-4"
            disabled={form.formState.isSubmitting}
          >
            Update
          </Button>
        </div>
      </form>
    </Form>
  );
}
