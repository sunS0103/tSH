"use client";

import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface ProfileField {
  label: string;
  value: string | number | null | undefined;
}

export interface ProfileSectionProps {
  title: string;
  icon: string;
  data: ProfileField[] | null | undefined;
  nullStateTitle: string;
  nullStateDescription: string;
  onEdit?: () => void;
  className?: string;
}

export default function ProfileSection({
  title,
  icon,
  data,
  nullStateTitle,
  nullStateDescription,
  onEdit,
  className,
}: ProfileSectionProps) {
  const hasData =
    data &&
    data.length > 0 &&
    data.some(
      (field) =>
        field.value !== null && field.value !== undefined && field.value !== ""
    );

  return (
    <div
      className={cn(
        "bg-white border border-gray-200 rounded-2xl flex flex-col gap-5 overflow-hidden",
        className
      )}
    >
      {/* Header Section */}
      <div className="bg-primary-50 flex items-center justify-between p-3 md:p-4 w-full">
        <div className="flex gap-2 items-center">
          <Icon icon={icon} className="size-6 text-primary-500" />
          <h3 className="font-bold text-lg md:text-xl text-black">{title}</h3>
        </div>
        {onEdit && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onEdit}
            className="size-5"
          >
            <Icon
              icon="material-symbols:edit-outline-rounded"
              className="size-5 text-black"
            />
          </Button>
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-col gap-3 items-start justify-center px-4 pb-4 w-full">
        {!hasData ? (
          // Null State
          <div className="flex flex-col gap-1 items-start w-full">
            <p className="font-medium text-base text-gray-900">
              {nullStateTitle}
            </p>
            <p className="font-normal text-xs text-gray-600">
              {nullStateDescription}
            </p>
          </div>
        ) : (
          // Data State
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start w-full">
            {data.map((field, index) => {
              return (
                <div
                  key={`${field.label}-${index}`}
                  className="flex gap-2 items-start w-full"
                >
                  {/* First field in pair */}
                  <div className="flex flex-col gap-1 items-start min-w-0">
                    <Label className="text-xs text-gray-900 font-normal">
                      {field.label}
                    </Label>
                    <p className="text-base font-medium text-black">
                      {typeof field.value === "string" &&
                      (field.value.startsWith("http://") ||
                        field.value.startsWith("https://")) ? (
                        <a
                          href={field.value}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-500 hover:underline break-all"
                        >
                          {field.value}
                        </a>
                      ) : (
                        field.value || "-"
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
