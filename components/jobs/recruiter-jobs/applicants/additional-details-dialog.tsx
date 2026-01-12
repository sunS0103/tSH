"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Icon } from "@iconify/react";
import { sendAdditionalDetails } from "@/api/jobs/recruiter";
import { toast } from "sonner";

export interface AdditionalDetailsField {
  id: string;
  title: string;
  type: "text" | "textarea";
  value: string;
}

export interface AdditionalDetailsDialogProps {
  jobId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSend?: (fields: AdditionalDetailsField[]) => void;
  userId: string;
}

export default function AdditionalDetailsDialog({
  jobId,
  open,
  onOpenChange,
  onSend,
  userId,
}: AdditionalDetailsDialogProps) {
  const [newFieldTitle, setNewFieldTitle] = useState("");
  const [newFieldType, setNewFieldType] = useState<"text" | "textarea">("text");
  const [fields, setFields] = useState<AdditionalDetailsField[]>([]);

  const handleAddField = () => {
    if (!newFieldTitle.trim()) {
      return;
    }

    const newField: AdditionalDetailsField = {
      id: Date.now().toString(),
      title: newFieldTitle,
      type: newFieldType,
      value: "",
    };

    setFields([...fields, newField]);
    setNewFieldTitle("");
    setNewFieldType("text");
  };

  const handleDeleteField = (id: string) => {
    setFields(fields.filter((field) => field.id !== id));
  };

  const handleFieldValueChange = (id: string, value: string) => {
    setFields(
      fields.map((field) => (field.id === id ? { ...field, value } : field))
    );
  };

  const handleSend = async () => {
    const payload = {
      additional_details: fields.map((field) => ({
        title: field.title,
        type: field.type,
      })),
      user_id: userId,
    };

    const response = await sendAdditionalDetails(jobId, payload);
    if (response.success) {
      toast.success("Additional details sent successfully");
      onSend?.(fields);
      onOpenChange(false);
      setFields([]);
      setNewFieldTitle("");
      setNewFieldType("text");
    } else {
      toast.error(response.message);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setFields([]);
    setNewFieldTitle("");
    setNewFieldType("text");
  };

  // Separate text and textarea fields
  const textFields = fields.filter((field) => field.type === "text");
  const textareaFields = fields.filter((field) => field.type === "textarea");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-2xl">
        {/* Header Section */}
        <DialogHeader className="bg-primary-50 px-6 py-4 rounded-t-2xl">
          <DialogTitle className="text-xl font-bold text-black">
            Additional Details Form
          </DialogTitle>
          <p className="text-sm font-medium text-gray-800 mt-1">
            Use this request to ask any last question needed to confirm fit.
          </p>
        </DialogHeader>

        {/* Content Section */}
        <div className="px-6 py-4 flex flex-col gap-20">
          {/* Add Field Section */}
          <div className="flex flex-col gap-3">
            <div className="flex gap-4 items-end">
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-sm font-medium text-black">
                  Field Title
                </label>
                <Input
                  placeholder="Enter Title"
                  value={newFieldTitle}
                  onChange={(e) => setNewFieldTitle(e.target.value)}
                  className="h-8"
                />
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-sm font-medium text-black">
                  Field Type
                </label>
                <Select
                  value={newFieldType}
                  onValueChange={(value: "text" | "textarea") =>
                    setNewFieldType(value)
                  }
                >
                  <SelectTrigger className="h-8 w-full">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="textarea">Textarea</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="button"
                onClick={handleAddField}
                className="h-8 px-3 bg-primary-500 hover:bg-primary-600"
              >
                Add Field
              </Button>
            </div>
          </div>

          {/* Existing Fields Section */}
          {fields.length > 0 && (
            <div className="flex flex-col gap-4">
              {/* Text Fields - 2 per row */}
              {textFields.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {textFields.map((field) => (
                    <div key={field.id} className="flex items-end gap-2">
                      <div className="flex-1 flex flex-col gap-2">
                        <label className="text-sm font-medium text-black">
                          {field.title}
                        </label>
                        <Input
                          placeholder={`Enter ${field.title}`}
                          value={field.value}
                          onChange={(e) =>
                            handleFieldValueChange(field.id, e.target.value)
                          }
                          disabled
                          className="h-8"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteField(field.id)}
                        className="h-8 w-8 shrink-0"
                        aria-label="Delete field"
                      >
                        <Icon
                          icon="material-symbols:delete-outline"
                          className="w-4 h-4 text-gray-600"
                        />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Textarea Fields - 1 per row */}
              {textareaFields.length > 0 && (
                <div className="flex flex-col gap-4">
                  {textareaFields.map((field) => (
                    <div key={field.id} className="flex items-start gap-2">
                      <div className="flex-1 flex flex-col gap-2">
                        <label className="text-sm font-medium text-black">
                          {field.title}
                        </label>
                        <Textarea
                          placeholder={`Enter ${field.title}`}
                          value={field.value}
                          onChange={(e) =>
                            handleFieldValueChange(field.id, e.target.value)
                          }
                          disabled
                          className="min-h-24"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteField(field.id)}
                        className="h-8 w-8 shrink-0 mt-7"
                        aria-label="Delete field"
                      >
                        <Icon
                          icon="material-symbols:delete-outline"
                          className="w-4 h-4 text-gray-600"
                        />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Section */}
        <DialogFooter className="px-6 py-3 border-t">
          <div className="flex gap-3 justify-end w-full">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="h-8 px-4 border-primary-500 text-primary-500"
            >
              Cancel
            </Button>
            <Button
              disabled={fields.length === 0}
              type="button"
              onClick={handleSend}
              className="h-8 px-5 bg-primary-500 hover:bg-primary-600"
            >
              Send
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
