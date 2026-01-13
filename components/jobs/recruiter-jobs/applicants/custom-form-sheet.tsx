"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Icon } from "@iconify/react";
import { XIcon } from "lucide-react";
import { CustomField } from "@/types/job";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { getRecruiterJobApplicantsCustomFields } from "@/api/jobs/recruiter";

export interface CustomFormSheetProps {
  open: boolean;
  jobId: string;
  userId: string;
  onOpenChange: (open: boolean) => void;
  applicantName?: string;
  applicantData?: {
    first_name?: string | null;
    last_name?: string | null;
    email?: string | null;
    country_code?: string | null;
    mobile_number?: string | null;
    location?: string;
    current_ctc?: string;
    experience?: string;
    current_company?: string;
    notice_period?: string;
    expected_ctc?: string;
    visa_status?: string;
    work_mode?: string;
    about_yourself?: string;
    total_score?: string;
    application_id?: string;
    application_status?: string;
  };
  customFields?: CustomField[];
  onThumbUp?: () => void;
  onHandshake?: () => void;
  onThumbDown?: () => void;
  showCloseIcon?: boolean;
  isCustomFieldsPending?: boolean | null;
}

export default function CustomFormSheet({
  jobId,
  userId,
  open,
  onOpenChange,
  applicantData,
  onThumbUp,
  onHandshake,
  onThumbDown,
  showCloseIcon = false,
}: CustomFormSheetProps) {
  const [customFields, setCustomFields] = useState<CustomField[]>([]);

  useEffect(() => {
    const fetchCustomFields = async () => {
      const response = await getRecruiterJobApplicantsCustomFields({
        jobId: jobId,
        userId: userId,
      });
      return response.data;
    };

    if (open) {
      fetchCustomFields().then((response) => {
        setCustomFields(response);
      });
    }
  }, [open, jobId, userId]);

  const staticFields = [
    {
      title: "Name",
      value: `${applicantData?.first_name} ${applicantData?.last_name}`,
      type: "text",
      showSkeleton: !applicantData?.first_name,
      lastName: applicantData?.last_name || null,
    },
    { title: "Total Score", value: applicantData?.total_score, type: "text" },
    {
      title: "Mobile Number",
      value: applicantData?.mobile_number,
      type: "text",
    },
    { title: "Email ID", value: applicantData?.email, type: "text" },
    { title: "Current CTC", value: applicantData?.current_ctc, type: "text" },
    {
      title: "Years of Experience",
      value: applicantData?.experience,
      type: "text",
    },
  ];

  const allFields: Array<{
    title: string;
    value: string | null | undefined;
    type: string;
    showSkeleton?: boolean;
    lastName?: string | null;
  }> = [
    ...staticFields,
    ...customFields.map((field) => ({
      title: field.title,
      value: field.value,
      type: field.type,
      showSkeleton: false,
    })),
  ];

  const formFields = allFields.map((field) => ({
    title: field.title,
    value: field.value,
    type: field.type,
    showSkeleton: field.showSkeleton,
    lastName: field?.lastName || null,
  }));

  const inputFields = formFields.filter((field) => field.type === "text");
  const textareaFields = formFields.filter(
    (field) => field.type === "textarea"
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="sm:max-w-2xl md:max-w-3xl overflow-y-auto bg-white rounded-tl-2xl rounded-bl-2xl p-6 flex flex-col gap-5"
      >
        {showCloseIcon && (
          <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
            <XIcon className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </SheetClose>
        )}
        <SheetHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-0">
          <SheetTitle className="text-2xl font-bold text-black">
            Custom form
          </SheetTitle>
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={onThumbUp}
              disabled={
                applicantData?.application_status === "THUMBS_UP" ||
                applicantData?.application_status === "HANDSHAKE"
              }
              className="h-8 px-4 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white rounded-lg"
            >
              <Icon
                icon="material-symbols:thumb-up-outline"
                className="w-4 h-4"
              />
              <span className="text-sm font-normal">Thumb Up</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onHandshake}
              disabled={applicantData?.application_status === "HANDSHAKE"}
              className={cn(
                "h-8 px-4 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white rounded-lg disabled:opacity-100 disabled:cursor-not-allowed",
                applicantData?.application_status === "HANDSHAKE" &&
                  "bg-success-500 text-white hover:bg-success-500 hover:text-white border-success-500"
              )}
            >
              <Icon
                icon="material-symbols:handshake-outline"
                className="w-4 h-4"
              />
              <span className="text-sm font-normal">Handshake</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onThumbDown}
              disabled={applicantData?.application_status === "HANDSHAKE"}
              className="h-8 px-4 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white rounded-lg"
            >
              <Icon
                icon="material-symbols:thumb-down-outline"
                className="w-4 h-4"
              />
              <span className="text-sm font-normal">Thumb Down</span>
            </Button>
          </div>
        </SheetHeader>

        <div className="flex flex-col gap-3">
          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {inputFields.map((field) => (
              <div key={field.title} className="flex flex-col gap-1">
                <p className="text-xs font-normal text-gray-900">
                  {field.title}
                </p>
                {field.showSkeleton ? (
                  <div className="flex items-center gap-2">
                    <span className="w-16 h-7 bg-gray-200 rounded" />
                    {field.title === "Name" && field.lastName && (
                      <p className="text-base font-medium text-black">
                        {field.lastName}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-base font-medium text-black">
                    {field.value || "-"}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-2">
            {textareaFields.map((field) => (
              <div key={field.title} className="flex flex-col">
                <p className="text-xs font-normal text-gray-900">
                  {field.title}
                </p>
                <p className="text-base font-medium text-black">
                  {field.value || "-"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
