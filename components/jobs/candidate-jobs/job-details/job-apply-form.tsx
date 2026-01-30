"use client";

import { Button } from "@/components/ui/button";
import { CustomField } from "@/types/job";
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
import { useEffect, useState } from "react";
import {
  applyToJob,
  getCandidateJobAdditionalDetails,
} from "@/api/jobs/candidate";
import { getCookie } from "cookies-next/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Field = {
  title: string;
  value: string;
};
export interface AdditionalDetails {
  title: string;
  type?: "text" | "textarea";
  value: string;
}

export default function JobApplyForm({
  isAssessmentNotCompleted,
  customFields,
  jobId,
  customFieldsStatus,
}: {
  isAssessmentNotCompleted: boolean;
  customFields: CustomField[] | null;
  jobId: string;
  customFieldsStatus: "NOT_REQUESTED" | "REQUESTED" | "SUBMITTED";
}) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Record<number, string>>({});
  const [errors, setErrors] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [customFieldsDetailsValue, setCustomFieldsDetailsValue] =
  //   useState<EmploymentDetails | null>(null);
  const router = useRouter();

  const handleInputChange = (fieldId: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    if (!customFields || customFields.length === 0) {
      return false;
    }

    const newErrors: Record<number, string> = {};
    let isValid = true;

    customFields.forEach((field) => {
      const fieldId =
        typeof field.id === "number" ? field.id : Number(field.id);
      const value = formData[fieldId] || "";

      if (!value) {
        newErrors[fieldId] = `Field is required`;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!customFields || customFields.length === 0) {
      toast.error("No custom fields to submit");
      return;
    }

    // Validate all fields are filled
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const token = getCookie("token") as string | undefined;
      if (!token) {
        toast.error("Authentication required");
        setIsSubmitting(false);
        return;
      }

      const profile_fields = customFields.slice(0, 5).map((field) => {
        const fieldId =
          typeof field.id === "number" ? field.id : Number(field.id);
        const val = formData[fieldId];
        return {
          title: field.title,
          value: val !== undefined ? String(val) : "",
        };
      });

      const custom_fields = customFields.slice(5).map((field) => {
        const fieldId =
          typeof field.id === "number" ? field.id : Number(field.id);
        const val = formData[fieldId];
        return {
          job_custom_field_id: fieldId,
          value: val !== undefined ? String(val) : "",
        };
      });

      // Send all profile fields to ensure data consistency
      const updated_fields = profile_fields;

      const payload = {
        profile_fields: updated_fields,
        custom_fields: custom_fields,
      };

      const response = await applyToJob({
        jobId,
        payload,
      });

      if (response.success) {
        toast.success("Application submitted successfully!");
        setOpen(false);
        setFormData({});
        // setCustomFieldsDetailsValue(null);
        router.refresh();
      } else {
        toast.error(response.message || "Failed to submit application");
      }
    } catch (error) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      toast.error(
        axiosError.response?.data?.message ||
          axiosError.message ||
          "Failed to submit application"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
    setFormData({});
    setErrors({});
    // setCustomFieldsDetailsValue(null);
  };

  // Separate fields into inputs and textareas
  const separateFieldsByType = (fields: CustomField[]) => {
    const inputFields: CustomField[] = [];
    const textareaFields: CustomField[] = [];

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
  const groupInputFieldsIntoRows = (fields: CustomField[]) => {
    const rows: CustomField[][] = [];
    for (let i = 0; i < fields.length; i += 2) {
      rows.push(fields.slice(i, i + 2));
    }
    return rows;
  };

  const { inputFields, textareaFields } = customFields
    ? separateFieldsByType(customFields)
    : { inputFields: [], textareaFields: [] };
  const inputFieldRows = groupInputFieldsIntoRows(inputFields);

  const isCustomFieldFilled =
    (customFields &&
      customFields?.length > 0 &&
      customFields.some((field) => field.value !== null)) ||
    false;

  useEffect(() => {
    const fetchAdditionalDetails = async () => {
      const details = await getCandidateJobAdditionalDetails({
        jobId,
      });
      return details;
    };
    if (isCustomFieldFilled) {
      fetchAdditionalDetails();
    }
  }, [isCustomFieldFilled, jobId]);

  useEffect(() => {
    if (!open || !customFields?.length) return;

    const initialData: Record<number, string> = {};

    customFields.forEach((field) => {
      const fieldId =
        typeof field.id === "number" ? field.id : Number(field.id);

      if (field.value !== null && field.value !== undefined) {
        initialData[fieldId] = String(field.value);
      }
    });

    setFormData(initialData);
  }, [open, customFields]);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            className="text-sm flex items-center gap-2"
            disabled={
              isAssessmentNotCompleted || customFieldsStatus === "SUBMITTED"
            }
            onClick={() => setOpen(true)}
          >
            Contact Recruiter
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
                Fill Details
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
                  const fieldId =
                    typeof field.id === "number" ? field.id : Number(field.id);
                  const placeholder = `Enter ${field.title}`;
                  const hasError = !!errors[fieldId];
                  const errorMessage = errors[fieldId];

                  return (
                    <div key={fieldId} className="flex-1 flex flex-col gap-2">
                      <Label className="text-sm font-medium text-gray-900">
                        {field.title}{" "}
                        <span className="text-destructive ms-1">*</span>
                      </Label>
                      <Input
                        type="text"
                        placeholder={placeholder}
                        value={formData[fieldId] || ""}
                        onChange={(e) =>
                          handleInputChange(fieldId, e.target.value)
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
              const fieldId =
                typeof field.id === "number" ? field.id : Number(field.id);
              const placeholder = `Enter ${field.title}`;
              const hasError = !!errors[fieldId];
              const errorMessage = errors[fieldId];
              const charCount = formData[fieldId]?.length || 0;

              return (
                <div
                  key={fieldId}
                  className="flex flex-col gap-2 w-full relative"
                >
                  <Label className="text-sm font-medium text-gray-900">
                    {field.title}{" "}
                    <span className="text-destructive ms-1">*</span>
                  </Label>
                  <Textarea
                    placeholder={placeholder}
                    value={formData[fieldId] || ""}
                    onChange={(e) => handleInputChange(fieldId, e.target.value)}
                    maxLength={500}
                    className={`min-h-[99px] resize-none ${
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

            {/* File Upload Section */}
            {/* <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium text-gray-900">
                Attach my Skill Report to help recruiters shortlist me.
              </Label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl w-20 h-20 flex items-center justify-center bg-white hover:border-primary-500 transition-colors cursor-pointer">
                <Icon icon="mdi:plus" className="w-8 h-8 text-gray-400" />
              </div>
            </div> */}
          </div>

          <div className="flex gap-3 justify-end px-6 py-4 border-t border-gray-200">
            <Button
              variant="secondary"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="h-8 px-3 text-sm font-normal"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="h-8 px-3 text-sm font-normal"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
