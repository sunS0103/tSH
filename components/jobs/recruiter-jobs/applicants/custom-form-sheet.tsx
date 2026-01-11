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

export interface CustomFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  applicantName?: string;
  applicantData?: {
    first_name?: string | null;
    last_name?: string | null;
    email?: string | null;
    phone?: string | null;
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
  };
  customFields?: CustomField[];
  onThumbUp?: () => void;
  onHandshake?: () => void;
  onThumbDown?: () => void;
  showCloseIcon?: boolean;
}

export default function CustomFormSheet({
  open,
  onOpenChange,
  applicantName,
  applicantData,
  customFields = [],
  onThumbUp,
  onHandshake,
  onThumbDown,
  showCloseIcon = false,
}: CustomFormSheetProps) {
  // Get field value by title from customFields or applicantData
  const getFieldValue = (fieldTitle: string): string => {
    // First check customFields
    const customField = customFields.find(
      (field) => field.title.toLowerCase() === fieldTitle.toLowerCase()
    );
    if (customField?.value) {
      return customField.value;
    }

    // Then check applicantData
    const titleLower = fieldTitle.toLowerCase();
    if (titleLower === "name") {
      return (
        applicantName ||
        `${applicantData?.first_name || ""} ${
          applicantData?.last_name || ""
        }`.trim() ||
        "-"
      );
    }
    if (titleLower === "email id" || titleLower === "email") {
      return applicantData?.email || "-";
    }
    if (titleLower === "mobile number" || titleLower === "phone") {
      return applicantData?.phone || "-";
    }
    if (titleLower === "location") {
      return applicantData?.location || "-";
    }
    if (titleLower === "current ctc") {
      return applicantData?.current_ctc || "-";
    }
    if (titleLower === "years of experience" || titleLower === "experience") {
      return applicantData?.experience || "-";
    }
    if (titleLower === "current company") {
      return applicantData?.current_company || "-";
    }
    if (titleLower === "notice period") {
      return applicantData?.notice_period || "-";
    }
    if (titleLower === "expected ctc") {
      return applicantData?.expected_ctc || "-";
    }
    if (titleLower === "visa status") {
      return applicantData?.visa_status || "-";
    }
    if (titleLower === "work mode") {
      return applicantData?.work_mode || "-";
    }
    if (titleLower === "total score") {
      return applicantData?.total_score || "-";
    }
    if (titleLower === "about yourself" || titleLower === "about") {
      return applicantData?.about_yourself || "-";
    }

    return "-";
  };

  // All form fields in a single array
  const formFields: Array<{
    title: string;
    value: string | null;
    showSkeleton?: boolean;
    lastName?: string | null;
  }> = [
    {
      title: "Name",
      value: applicantData?.first_name
        ? `${applicantData.first_name}${
            applicantData?.last_name ? ` ${applicantData.last_name}` : ""
          }`.trim()
        : null,
      showSkeleton: !applicantData?.first_name,
      lastName: applicantData?.last_name || null,
    },
    { title: "Total Score", value: getFieldValue("Total Score") },
    {
      title: "Mobile Number",
      value: applicantData?.phone || null,
      showSkeleton: !applicantData?.phone,
    },
    {
      title: "Email ID",
      value: applicantData?.email || null,
      showSkeleton: !applicantData?.email,
    },
    { title: "Current CTC", value: getFieldValue("Current CTC") },
    {
      title: "Years of Experience",
      value: getFieldValue("Years of Experience"),
    },
    { title: "Notice Period", value: getFieldValue("Notice Period") },
    { title: "Location", value: getFieldValue("Location") },
    { title: "Current Company", value: getFieldValue("Current Company") },
    { title: "Expected CTC", value: getFieldValue("Expected CTC") },
    { title: "Visa status", value: getFieldValue("Visa status") },
    { title: "Work Mode", value: getFieldValue("Work Mode") },
  ];

  const aboutYourself = getFieldValue("About yourself");

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
              className="h-8 px-4 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white rounded-lg"
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
            {formFields.map((field) => (
              <div key={field.title} className="flex flex-col gap-1">
                <p className="text-xs font-normal text-gray-900">
                  {field.title}
                </p>
                {field.showSkeleton ? (
                  <div className="flex items-center gap-2">
                    <span className="w-20 h-7 bg-gray-200 rounded" />
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

          {/* About Yourself - Full Width */}
          <div className="flex flex-col gap-1 pt-2">
            <p className="text-xs font-normal text-gray-900">About yourself</p>
            <p className="text-base font-normal text-black leading-normal">
              {aboutYourself}
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
