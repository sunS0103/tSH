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
  requireApplyForm: boolean;
}

interface CustomField {
  id: string;
  title: string;
  type: string;
}

export default function ApplyFormAccordion({
  form,
  requireApplyForm,
}: ApplyFormAccordionProps) {
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
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
            {/* Default Fields */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-950">
                    Current Company
                  </Label>
                  <Input
                    placeholder="Enter Current Company"
                    disabled
                    className="h-8"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-950">
                    Notice Period
                  </Label>
                  <Select disabled>
                    <SelectTrigger className="h-8 w-full">
                      <SelectValue placeholder="Select Notice Period" />
                    </SelectTrigger>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-950">
                    Expected CTC
                  </Label>
                  <Input
                    placeholder="Enter Expected CTC"
                    disabled
                    className="h-8"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-950">
                    Visa status
                  </Label>
                  <Input
                    placeholder="Enter Visa status"
                    disabled
                    className="h-8"
                  />
                </div>
                <div className="space-y-2 col-span-1 sm:col-span-2">
                  <Label className="text-sm font-medium text-gray-950">
                    About yourself
                  </Label>
                  <Textarea
                    placeholder="Enter about yourself"
                    disabled
                    className="min-h-[99px]"
                  />
                </div>
              </div>
            </div>

            {/* Custom Fields */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-950">
                Would you like to add a custom field here?
              </h4>

              {/* Preview of Added Fields */}
              {customFields.length > 0 && (
                <div className="space-y-2 border-t pt-4">
                  <p className="text-xs font-medium text-gray-600 mb-2">
                    Added Fields:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" >
                  {customFields.map((field) => (
                      <div key={field.id} className={`flex items-end gap-2 ${field.type === "textarea" ? "col-span-1 sm:col-span-2" : ""}`}>
                        <div className="flex-1">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-950">
                              {field.title}
                            </Label>
                            {field.type === "textarea" ? (
                              <Textarea
                                placeholder={`Enter ${field.title.toLowerCase()}`}
                                disabled
                                className="min-h-[99px]"
                              />
                            ) : field.type === "select" ? (
                              <Select disabled>
                                <SelectTrigger className="h-8 w-full">
                                  <SelectValue
                                    placeholder={`Select ${field.title}`}
                                  />
                                </SelectTrigger>
                              </Select>
                            ) : (
                              <Input
                                type={field.type}
                                placeholder={`Enter ${field.title.toLowerCase()}`}
                                disabled
                                className="h-8"
                              />
                            )}
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCustomField(field.id)}
                          className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                        >
                          <Icon icon="mdi:delete" className="w-4 h-4" />
                        </Button>
                      </div>
                  ))}
                  </div>
                </div>
              )}

              {/* Add New Field Form */}
              <div className="space-y-3 border-t pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-950">
                      Field Title
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
                      className="h-8"
                    />
                    {fieldTitleError && (
                      <p className="text-destructive text-sm">
                        {fieldTitleError}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-950">
                      Field Type
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

