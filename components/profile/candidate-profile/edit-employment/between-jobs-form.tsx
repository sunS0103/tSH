"use client";

import { updateBetweenJobsStatus } from "@/api/profile";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
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
  duration_months: z
    .number()
    .min(1, "Duration of career break is required")
    .nullable(),
  last_drawn_ctc_amount: z
    .string()
    .min(1, "Last drawn CTC is required")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
      message: "Please enter a valid number",
    }),
  duration_description: z.string().min(1, "Reason is required"),
  upskilling_activities: z.string().min(1, "Upskilling activities is required"),
  current_ctc_period_type: z
    .string()
    .min(1, "Current CTC period type is required"),
});

type BetweenJobsFormData = z.infer<typeof betweenJobsSchema>;

interface BetweenJobsFormProps {
  defaultValues?: Partial<BetweenJobsFormData>;
  onCancel: () => void;
}

const ctcPeriodOptions = [
  { label: "Per annum", value: "LPA" },
  { label: "Per month", value: "LPM" },
];

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
      duration_months: defaultValues?.duration_months || null,
      last_drawn_ctc_amount:
        defaultValues?.last_drawn_ctc_amount?.toString() || "",
      duration_description: defaultValues?.duration_description || "",
      upskilling_activities: defaultValues?.upskilling_activities || "",
      current_ctc_period_type: defaultValues?.current_ctc_period_type || "LPA",
    },
  });

  const handleSubmit = async (data: BetweenJobsFormData) => {
    try {
      const response = await updateBetweenJobsStatus({
        total_years_of_experience: parseFloat(data.total_years_of_experience),
        duration_months: data.duration_months,
        last_drawn_ctc_amount: parseFloat(data.last_drawn_ctc_amount),
        current_ctc_period_type: data.current_ctc_period_type,
        duration_description: data.duration_description,
        upskilling_activities: data.upskilling_activities,
      });

      if (response.success) {
        toast.success(
          response.message || "Employment details updated successfully"
        );
        router.push("/profile");
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
              <FormItem className="w-full">
                <Label className="text-sm font-medium ">
                  Total Work Experience (in years)
                </Label>
                <FormControl>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="0.0"
                    className="h-8 border-gray-900"
                    {...field}
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
                <Label className="text-sm font-medium ">
                  Duration of Career Break
                </Label>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter duration of career break"
                    className="h-8 border-gray-900 w-full"
                    value={field.value || ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? parseFloat(e.target.value) : null
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="w-full md:w-1/2">
          <Label className="text-sm font-medium text-black mb-2">
            Last Drawn CTC
          </Label>
          <div className="flex border border-gray-900 rounded-lg overflow-hidden">
            <FormField
              control={form.control}
              name="last_drawn_ctc_amount"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="0.0"
                      className="h-8 border-0 rounded-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center border-l border-gray-200 px-2 bg-white">
              <FormField
                control={form.control}
                name="current_ctc_period_type"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="h-8 border-0 w-fit min-w-[100px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ctcPeriodOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full">
          <FormField
            control={form.control}
            name="duration_description"
            render={({ field }) => {
              const charCount = field.value?.length || 0;
              return (
                <FormItem className="w-full">
                  <Label className="text-sm font-medium ">
                    Reason for Career Break
                  </Label>
                  <FormControl>
                    <div className="relative">
                      <Textarea
                        placeholder="Enter reason for career break"
                        className="border-gray-900 resize-none max-h-25 min-h-25"
                        rows={5}
                        maxLength={500}
                        {...field}
                      />
                      <span className="absolute bottom-2 right-2 text-xs">
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
                  <Label className="text-sm font-medium ">
                    Upskilling During This Period
                  </Label>
                  <FormControl>
                    <div className="relative">
                      <Textarea
                        placeholder="Describe upskilling activities"
                        className="border-gray-900 resize-none max-h-25 min-h-25"
                        rows={5}
                        maxLength={500}
                        {...field}
                      />
                      <span className={cn("absolute bottom-2 right-2 text-xs")}>
                        {charCount}/500
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
