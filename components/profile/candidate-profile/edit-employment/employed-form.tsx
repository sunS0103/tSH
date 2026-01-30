"use client";

import { updateEmployedStatus } from "@/api/profile";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import z from "zod";
import { setCookie } from "cookies-next/client";

const noticePeriodOptions = [
  { label: "Immediate", value: "Immediate" },
  { label: "1 month", value: "1 month" },
  { label: "2 months", value: "2 months" },
  { label: "3 months", value: "3 months" },
  { label: ">3 months", value: ">3 months" },
];

// const ctcPeriodOptions = [
//   { label: "Per annum", value: "LPA" },
//   { label: "Per month", value: "LPM" },
// ];

const employedSchema = z
  .object({
    company_name: z.string().min(1, "Company name is required"),
    designation: z.string().min(1, "Designation is required"),
    total_years_of_experience: z
      .string()
      .min(1, "Total experience is required")
      .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
        message: "Please enter a valid number",
      }),
    current_ctc_amount: z
      .string()
      .min(1, "Current CTC is required")
      .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
        message: "Please enter a valid number",
      }),
    current_ctc_period_type: z.string().min(1, "Period type is required"),
    expected_ctc_amount: z
      .string()
      .min(1, "Expected CTC is required")
      .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
        message: "Please enter a valid number",
      }),
    expected_ctc_period: z.string().min(1, "Period type is required"),
    notice_period_type: z.string().min(1, "Notice period is required"),
    is_serving_notice: z.boolean(),
    last_working_day: z.number().nullable().optional(),
  })
  .refine(
    (data) => {
      if (data.is_serving_notice) {
        return data.last_working_day !== null;
      }
      return true;
    },
    {
      message: "Last working day is required when serving notice",
      path: ["last_working_day"],
    },
  );

type EmployedFormData = z.infer<typeof employedSchema>;

interface EmployedFormProps {
  defaultValues?: Partial<EmployedFormData & { is_serving_notice: boolean }>;
  onCancel: () => void;
}

export default function EmployedForm({
  defaultValues,
  onCancel,
}: EmployedFormProps) {
  const router = useRouter();

  const form = useForm<EmployedFormData>({
    resolver: zodResolver(employedSchema),
    defaultValues: {
      company_name: defaultValues?.company_name || "",
      designation: defaultValues?.designation || "",
      total_years_of_experience:
        defaultValues?.total_years_of_experience?.toString() || "",
      current_ctc_amount: defaultValues?.current_ctc_amount?.toString() || "",
      current_ctc_period_type: defaultValues?.current_ctc_period_type || "LPA",
      expected_ctc_amount: defaultValues?.expected_ctc_amount?.toString() || "",
      expected_ctc_period: defaultValues?.expected_ctc_period || "LPA",
      notice_period_type: defaultValues?.notice_period_type || "",
      is_serving_notice: defaultValues?.is_serving_notice || false,
      last_working_day: defaultValues?.last_working_day,
    },
  });

  const isServingNotice = form.watch("is_serving_notice");

  const handleSubmit = async (data: EmployedFormData) => {
    try {
      const payload = {
        company_name: data.company_name,
        designation: data.designation,
        total_years_of_experience: parseFloat(data.total_years_of_experience),
        current_ctc_amount: parseFloat(data.current_ctc_amount),
        current_ctc_currency: "INR",
        current_ctc_period_type: "LPA",
        // data.current_ctc_period_type,
        expected_ctc_amount: parseFloat(data.expected_ctc_amount),
        expected_ctc_currency: "INR",
        expected_ctc_period: "LPA",
        // data.expected_ctc_period,
        notice_period_type: data.notice_period_type,
        is_serving_notice: data.is_serving_notice,
        last_working_day: data.is_serving_notice
          ? (data.last_working_day ?? null)
          : null,
      };
      const response = await updateEmployedStatus(payload);

      if (response.success) {
        setCookie("current_employment_details_data", JSON.stringify(payload));
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
        {/* Company Name */}
        <div className="flex flex-col md:flex-row gap-4">
          <FormField
            control={form.control}
            name="company_name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel required className="text-sm font-medium text-black">
                  Current Company Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter company name"
                    className="h-8 border-gray-900 w-full md:w-1/2"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Designation and Total Experience */}
        <div className="flex flex-col md:flex-row gap-4">
          <FormField
            control={form.control}
            name="designation"
            render={({ field }) => (
              <FormItem className="w-full md:w-1/2">
                <FormLabel required className="text-sm font-medium text-black">
                  Current Designation
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter designation"
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
            name="total_years_of_experience"
            render={({ field }) => (
              <FormItem className="w-full md:w-1/2">
                <FormLabel required className="text-sm font-medium text-black">
                  Total Experience (Years)
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0.0"
                    className="h-8 border-gray-900"
                    {...field}
                    onChange={(e) => {
                      if (e.target.value.length > 3) {
                        e.target.value = e.target.value.slice(0, 3);
                      }
                      field.onChange(e);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Current CTC and Expected CTC */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/2">
            <FormField
              control={form.control}
              name="current_ctc_amount"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel
                    required
                    className="text-sm font-medium text-black mb-2"
                  >
                    Current CTC
                  </FormLabel>
                  <div className="flex border border-gray-900 rounded-lg overflow-hidden items-center">
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0.0"
                        className="h-8 border-0 rounded-none w-full"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="w-full md:w-1/2">
            <FormField
              control={form.control}
              name="expected_ctc_amount"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel
                    required
                    className="text-sm font-medium text-black mb-2"
                  >
                    Expected CTC
                  </FormLabel>
                  <div className="flex border border-gray-900 rounded-lg overflow-hidden items-center">
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0.0"
                        className="h-8 border-0 rounded-none w-full"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Notice Period */}
        <div className="flex flex-col md:flex-row gap-4">
          <FormField
            control={form.control}
            name="notice_period_type"
            render={({ field }) => (
              <FormItem className="w-full md:w-1/2">
                <FormLabel required className="text-sm font-medium text-black">
                  Notice Period
                </FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="h-8 border-gray-900 w-full">
                      <SelectValue placeholder="Select notice period" />
                    </SelectTrigger>
                    <SelectContent>
                      {noticePeriodOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
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
        </div>

        {/* Currently Serving Notice Toggle */}
        <div className="flex items-center justify-between w-full md:w-1/2">
          <Label className="text-sm font-medium text-black">
            Currently Serving Notice?
          </Label>
          <FormField
            control={form.control}
            name="is_serving_notice"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked);
                      // Clear calendar value when switch is turned off
                      if (!checked) {
                        form.setValue("last_working_day", null);
                      }
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Last Working Day - Conditional */}
        {isServingNotice && (
          <div className="flex flex-col md:flex-row gap-4">
            <FormField
              control={form.control}
              name="last_working_day"
              render={({ field }) => (
                <FormItem className="w-full md:w-1/2">
                  <FormLabel
                    required
                    className="text-sm font-medium text-black"
                  >
                    Last Working Day
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "h-8 w-full justify-start text-left font-normal border-gray-900",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(new Date(field.value), "MM-dd-yyyy")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        defaultMonth={
                          field.value ? new Date(field.value) : undefined
                        }
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={(date) =>
                          field.onChange(date ? date.getTime() : null)
                        }
                        disabled={(date) => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          return date < today;
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

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
