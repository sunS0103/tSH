"use client";

import { updateBetweenJobsStatus } from "@/api/profile";
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
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const betweenJobsSchema = z.object({
  total_years_of_experience: z
    .string()
    .min(1, "Total experience is required")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
      message: "Please enter a valid number",
    }),
  duration_years: z
    .number()
    .min(0, "Duration years must be 0 or greater")
    .max(100, "Duration years must be less than 100")
    .nullable(),
  duration_months: z
    .number()
    .min(0, "Duration months must be between 0 and 11")
    .max(11, "Duration months must be between 0 and 11")
    .nullable(),
  last_drawn_ctc_amount: z
    .string()
    .min(1, "Last drawn CTC is required")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
      message: "Please enter a valid number",
    }),
  // duration_description: z.string().min(1, "Reason is required")
  reason: z.string(),
  // .min(1, "Reason is required"),
  upskilling_activities: z.string(),
  // .min(1, "Upskilling activities is required"),
  current_ctc_period_type: z
    .string()
    .min(1, "Current CTC period type is required"),
});

type BetweenJobsFormData = z.infer<typeof betweenJobsSchema>;

interface BetweenJobsFormProps {
  defaultValues?: Partial<BetweenJobsFormData>;
  onCancel: () => void;
}

export default function BetweenJobsForm({
  defaultValues,
  onCancel,
}: BetweenJobsFormProps) {
  const router = useRouter();

  const form = useForm<BetweenJobsFormData>({
    resolver: zodResolver(betweenJobsSchema),
    defaultValues: {
      total_years_of_experience:
        defaultValues?.total_years_of_experience?.toString() || "",
      duration_years: defaultValues?.duration_years || null,
      duration_months: defaultValues?.duration_months || null,
      last_drawn_ctc_amount:
        defaultValues?.last_drawn_ctc_amount?.toString() || "",
      // duration_description: defaultValues?.duration_description || "",
      reason: defaultValues?.reason || "",
      upskilling_activities: defaultValues?.upskilling_activities || "",
      current_ctc_period_type: "LPA",
    },
  });

  const handleSubmit = async (data: BetweenJobsFormData) => {
    try {
      const response = await updateBetweenJobsStatus({
        total_years_of_experience: parseFloat(data.total_years_of_experience),
        duration_years: data.duration_years,
        duration_months: data.duration_months,
        last_drawn_ctc_amount: parseFloat(data.last_drawn_ctc_amount),
        current_ctc_period_type: data.current_ctc_period_type,
        // duration_description: data.duration_description,
        reason: data.reason,
        upskilling_activities: data.upskilling_activities,
      });

      if (response.success) {
        toast.success(
          response.message || "Employment details updated successfully",
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
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <FormField
            control={form.control}
            name="total_years_of_experience"
            render={({ field }) => (
              <FormItem className="w-full md:w-1/2">
                <FormLabel required className="text-sm font-medium ">
                  Total Work Experience (in years)
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0.0"
                    className="h-8 border-gray-900"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full md:w-1/2">
            <FormField
              control={form.control}
              name="last_drawn_ctc_amount"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel
                    required
                    className="text-sm font-medium text-black"
                  >
                    Last Drawn CTC
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="0.0"
                      className="h-8 border-gray-900 "
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="w-full flex flex-col gap-2">
          <div className="w-full flex flex-col md:flex-row gap-4">
            <FormField
              control={form.control}
              name="duration_years"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-sm font-medium ">
                    Duration of Career Break (in years)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Years"
                      min={0}
                      max={100}
                      className="h-8 border-gray-900 w-full"
                      value={field.value || ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? parseFloat(e.target.value) : null,
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="duration_months"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-sm font-medium ">
                    Duration of Career Break (in months)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Months (0-11)"
                      className="h-8 border-gray-900 w-full"
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "") {
                          field.onChange(null);
                        } else {
                          const numValue = parseFloat(value);
                          if (!isNaN(numValue)) {
                            // Allow any number, including > 11; show error in FormMessage if over 11
                            if (numValue > 11) {
                              form.setError("duration_months", {
                                message: "Duration months must be less than 12",
                                type: "onChange",
                              });
                            }
                            field.onChange(numValue);
                          }
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full">
          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => {
              const charCount = field.value?.length || 0;
              return (
                <FormItem className="w-full">
                  <FormLabel className="text-sm font-medium ">
                    Reason for Career Break
                  </FormLabel>
                  <FormControl>
                    <div className="relative mb-2">
                      <Textarea
                        placeholder="Enter reason for career break"
                        className="border-gray-900 resize-none max-h-25 min-h-25"
                        rows={5}
                        maxLength={500}
                        {...field}
                      />
                      <span className="absolute -bottom-5 right-0 text-xs text-gray-600">
                        {charCount} / 500
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="upskilling_activities"
            render={({ field }) => {
              const charCount = field.value?.length || 0;
              return (
                <FormItem className="w-full">
                  <FormLabel className="text-sm font-medium ">
                    Upskilling During This Period
                  </FormLabel>
                  <FormControl>
                    <div className="relative mb-2">
                      <Textarea
                        placeholder="Describe upskilling activities"
                        className="border-gray-900 resize-none max-h-25 min-h-25"
                        rows={5}
                        maxLength={500}
                        {...field}
                      />
                      <span className="absolute -bottom-5 right-0 text-xs text-gray-600">
                        {charCount} / 500
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>
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
