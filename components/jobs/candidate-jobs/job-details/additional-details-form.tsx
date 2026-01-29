"use client";

import { Button } from "@/components/ui/button";
import { AdditionalDetails } from "./job-apply-form";
import { Icon } from "@iconify/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { sendCandidateJobAdditionalDetails } from "@/api/jobs/candidate";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AdditionalDetailsForm({
  additional_details,
  jobId,
  additionalDetailsStatus,
}: {
  additional_details: AdditionalDetails[];
  jobId: string;
  additionalDetailsStatus: "NOT_REQUESTED" | "REQUESTED" | "SUBMITTED";
}) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form data with existing values
  const getInitialFormData = () => {
    const initialData: Record<string, string> = {};
    additional_details.forEach((field) => {
      initialData[field.title] = field.value || "";
    });
    return initialData;
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      // Initialize form data when opening
      setFormData(getInitialFormData());
      setErrors({});
    }
  };

  const handleInputChange = (fieldTitle: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldTitle]: value,
    }));
    // Clear error when user starts typing
    if (errors[fieldTitle]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldTitle];
        return newErrors;
      });
    }
  };

  const handleCancel = () => {
    setOpen(false);
    setErrors({});
    // Reset to original values
    const initialData: Record<string, string> = {};
    additional_details.forEach((field) => {
      initialData[field.title] = field.value || "";
    });
    setFormData(initialData);
  };

  // Separate fields into inputs and textareas
  const separateFieldsByType = (fields: AdditionalDetails[]) => {
    const inputFields: AdditionalDetails[] = [];
    const textareaFields: AdditionalDetails[] = [];

    fields.forEach((field) => {
      if (field.type === "textarea") {
        textareaFields.push(field);
      } else {
        inputFields.push(field);
      }
    });

    return { inputFields, textareaFields };
  };

  // Group input fields into rows of 2 for layout
  const groupInputFieldsIntoRows = (fields: AdditionalDetails[]) => {
    const rows: AdditionalDetails[][] = [];
    for (let i = 0; i < fields.length; i += 2) {
      rows.push(fields.slice(i, i + 2));
    }
    return rows;
  };

  const { inputFields, textareaFields } =
    separateFieldsByType(additional_details);
  const inputFieldRows = groupInputFieldsIntoRows(inputFields);

  const router = useRouter();

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button
            className="flex items-center gap-2 text-sm font-semibold"
            onClick={() => handleOpenChange(true)}
            disabled={additionalDetailsStatus === "SUBMITTED"}
          >
            Additional Details
            <Icon icon="mdi:arrow-top-right" className="w-4.5 h-4.5" />
          </Button>
        </DialogTrigger>
        <DialogContent
          className="max-w-3xl! max-h-[90vh] overflow-y-auto p-0 shadow-[0px_0px_25px_0px_rgba(0,0,0,0.15)]"
          showCloseButton={false}
        >
          <DialogHeader className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-semibold text-gray-950">
                Fill Additional Details
              </DialogTitle>
              <DialogClose asChild>
                <button
                  className="rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none cursor-pointer"
                  onClick={handleCancel}
                >
                  <Icon
                    icon="mdi:close"
                    className="h-4.5 w-4.5 text-gray-950"
                  />
                  <span className="sr-only">Close</span>
                </button>
              </DialogClose>
            </div>
          </DialogHeader>

          <div className="flex flex-col gap-4 px-6 py-4">
            {/* Render Input Fields in 2-column layout */}
            {inputFieldRows.map((row, rowIndex) => (
              <div key={rowIndex} className="flex gap-4 w-full">
                {row.map((field) => {
                  const placeholder = `Enter ${field.title}`;
                  const hasError = !!errors[field.title];
                  const errorMessage = errors[field.title];

                  return (
                    <div
                      key={field.title}
                      className="flex-1 flex flex-col gap-2"
                    >
                      <Label className="text-sm font-medium text-gray-900">
                        {field.title}{" "}
                        <span className="text-destructive ms-1">*</span>
                      </Label>
                      <Input
                        type="text"
                        placeholder={placeholder}
                        value={formData[field.title] || ""}
                        onChange={(e) =>
                          handleInputChange(field.title, e.target.value)
                        }
                        className={`h-8 bg-white border-gray-200 ${
                          hasError
                            ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/50"
                            : ""
                        }`}
                      />
                      {hasError && (
                        <p className="text-sm text-red-500 mt-0.5">
                          {errorMessage}
                        </p>
                      )}
                    </div>
                  );
                })}
                {/* Fill empty space if odd number of fields in row */}
                {row.length === 1 && <div className="flex-1" />}
              </div>
            ))}

            {/* Render Textarea Fields in full width */}
            {textareaFields.map((field) => {
              const placeholder = `Enter ${field.title}`;
              const hasError = !!errors[field.title];
              const errorMessage = errors[field.title];
              const charCount = formData[field.title]?.length || 0;

              return (
                <div
                  key={field.title}
                  className="flex flex-col gap-2 w-full relative"
                >
                  <Label className="text-sm font-medium text-gray-900">
                    {field.title}{" "}
                    <span className="text-destructive ms-1">*</span>
                  </Label>
                  <Textarea
                    placeholder={placeholder}
                    value={formData[field.title] || ""}
                    onChange={(e) =>
                      handleInputChange(field.title, e.target.value)
                    }
                    maxLength={500}
                    className={`min-h-[99px] resize-none bg-white ${
                      hasError
                        ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/50"
                        : "border-gray-200"
                    }`}
                  />
                  <span className="absolute -bottom-5 right-0 text-xs text-gray-600">
                    {charCount} / 500
                  </span>
                  {hasError && (
                    <p className="text-sm text-red-500 mt-0.5">
                      {errorMessage}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex gap-3 justify-end px-6 py-4 border-t border-gray-200">
            <Button
              variant="secondary"
              onClick={handleCancel}
              className="h-8 px-3 text-sm font-normal"
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                try {
                  // Transform formData into the required payload format
                  // Payload format: { additional_details: [{ title: string, value: string }] }
                  const payload = additional_details.map((field) => ({
                    title: field.title,
                    value: formData[field.title] || "",
                  }));

                  await sendCandidateJobAdditionalDetails({
                    jobId: jobId,
                    additionalDetails: payload,
                  }).then((response) => {
                    if (response.success) {
                      toast.success(
                        response.message ||
                          "Additional details submitted successfully",
                      );
                      router.refresh();
                    } else {
                      toast.error(
                        response.message ||
                          "Error submitting additional details",
                      );
                    }
                  });
                  setOpen(false);
                } catch (error) {
                  toast.error("Error submitting additional details");
                  console.error("Error submitting additional details:", error);
                }
              }}
              className="h-8 px-3 text-sm font-normal"
            >
              Submit
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
