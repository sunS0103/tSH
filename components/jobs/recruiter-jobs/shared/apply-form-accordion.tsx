"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
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
import { type JobFormData } from "@/validation/job";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";

interface ApplyFormAccordionProps {
  form: UseFormReturn<JobFormData>;
}

interface CustomField {
  id: string;
  title: string;
  type: string;
}

export default function ApplyFormAccordion({ form }: ApplyFormAccordionProps) {
  const [customFields, setCustomFields] = useState<CustomField[]>(
    form.getValues("apply_form_fields") || [],
  );
  const [newFieldTitle, setNewFieldTitle] = useState("");
  const [newFieldType, setNewFieldType] = useState("text");
  const [fieldTitleError, setFieldTitleError] = useState("");

  const fieldTypes = [
    { label: "Text", value: "text" },
    { label: "Textarea", value: "textarea" },
  ];

  const addCustomField = () => {
    if (!newFieldTitle.trim()) {
      setFieldTitleError("Field title is required");
      return;
    }

    setFieldTitleError("");
    const newField: CustomField = {
      id: Date.now().toString(),
      title: newFieldTitle,
      type: newFieldType,
    };

    setCustomFields([...customFields, newField]);
    form.setValue("apply_form_fields", [
      ...(form.getValues("apply_form_fields") || []),
      newField,
    ]);
    setNewFieldTitle("");
    setNewFieldType("text");
  };

  const removeCustomField = (id: string) => {
    const updated = customFields.filter((field) => field.id !== id);
    setCustomFields(updated);
    form.setValue("apply_form_fields", updated);
  };

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="apply-form" className="border-none">
        <AccordionTrigger className="bg-primary-50 rounded-t-2xl px-4 sm:px-6 py-4 hover:no-underline cursor-pointer">
          <div className="flex flex-col items-start gap-1 flex-1">
            <p className="text-sm sm:text-base font-semibold text-gray-950">
              What details you want to know from Candidate in prior screening?
            </p>
            <p className="text-xs text-gray-600">
              The fields add here will be given to student to fill & submit to
              apply for this job role
            </p>
          </div>
        </AccordionTrigger>
        <AccordionContent className="bg-white rounded-b-2xl px-4 sm:px-6 py-4">
          <div className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-4">
                {/* Merged Fields Section */}
                <div>
                  <Label className="text-sm font-semibold text-gray-950 block mb-4">
                    Candidate Information
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {/* Default Fields - Read Only Cards */}
                    {[
                      "Current Company",
                      "Notice Period",
                      "Expected CTC",
                      "Visa status",
                      "About yourself",
                    ].map((label) => (
                      <div
                        key={label}
                        className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 flex items-center justify-between group"
                      >
                        <span className="text-sm font-medium text-gray-700">
                          {label}
                        </span>

                        <Icon
                          icon="mdi:lock-outline"
                          className="w-4 h-4 text-gray-400"
                        />
                      </div>
                    ))}

                    {/* Custom Fields - Read Only Cards with Delete */}
                    {customFields.map((field) => (
                      <div
                        key={field.title + field.id}
                        className="bg-white border border-primary-100 rounded-lg px-3 py-2.5 flex items-center justify-between group hover:border-primary-300 transition-colors shadow-sm"
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <Icon
                            icon={
                              field.type === "textarea"
                                ? "mdi:text-box-outline"
                                : "mdi:format-text"
                            }
                            className="w-4 h-4 text-primary-500 shrink-0"
                          />
                          <span className="text-sm font-medium text-gray-900 truncate">
                            {field.title}
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCustomField(field.id)}
                          className="h-6 w-6 p-0 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-full"
                        >
                          <Icon icon="mdi:close" className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add New Field Form */}
                <div className="space-y-3 pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-950">
                    Would you like to add a custom field here?
                  </h4>
                  <div className="flex gap-2 w-full">
                    <div className="space-y-2 w-full">
                      <Label className="text-sm font-medium text-gray-950">
                        Field Title{" "}
                        <span className="text-destructive ms-1">*</span>
                      </Label>
                      <Input
                        placeholder="Enter Title"
                        value={newFieldTitle}
                        onChange={(e) => {
                          setNewFieldTitle(e.target.value);
                          if (fieldTitleError) {
                            setFieldTitleError("");
                          }
                        }}
                        className="h-9"
                      />
                      {fieldTitleError && (
                        <p className="text-destructive text-sm">
                          {fieldTitleError}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 w-full">
                      <Label className="text-sm font-medium text-gray-950">
                        Field Type{" "}
                        <span className="text-destructive ms-1">*</span>
                      </Label>
                      <Select
                        value={newFieldType}
                        onValueChange={setNewFieldType}
                      >
                        <SelectTrigger className="h-8 w-full">
                          <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                          {fieldTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    type="button"
                    onClick={addCustomField}
                    className="h-8 px-3 bg-primary-600 hover:bg-primary-700"
                  >
                    Add Field
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
