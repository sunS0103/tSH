"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { toast } from "sonner";
import { Icon } from "@iconify/react";

interface RequestAssessmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function RequestAssessmentDialog({
  open,
  onOpenChange,
}: RequestAssessmentDialogProps) {
  const [formData, setFormData] = useState({
    assessment_title: "",
    name: "",
    company_email: "",
    skills_to_assess: "",
    phone_number: "",
    job_description: "",
    custom_instructions: "",
    creation_preference: "recruiter",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call
    toast.success("Assessment request submitted successfully");
    onOpenChange(false);
    // Reset form
    setFormData({
      assessment_title: "",
      name: "",
      company_email: "",
      skills_to_assess: "",
      phone_number: "",
      job_description: "",
      custom_instructions: "",
      creation_preference: "recruiter",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Request Assessment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Assessment Title</Label>
              <Input
                placeholder="Enter Title"
                value={formData.assessment_title}
                onChange={(e) =>
                  setFormData({ ...formData, assessment_title: e.target.value })
                }
              />
            </div>
            <div className="space-y-2 opacity-0 pointer-events-none">
              <Label>Company Email</Label>
              <Input placeholder="Enter Company Email" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                placeholder="Enter Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Company Email</Label>
              <Input
                placeholder="Company Email"
                type="email"
                value={formData.company_email}
                onChange={(e) =>
                  setFormData({ ...formData, company_email: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Skills to Assess</Label>
              <Input
                placeholder="Enter Skills"
                value={formData.skills_to_assess}
                onChange={(e) =>
                  setFormData({ ...formData, skills_to_assess: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <div className="flex">
                <div className="border-r pr-2 mr-2 flex items-center">
                  <span className="text-sm">🇮🇳</span>
                  <Icon icon="mdi:chevron-down" className="w-4 h-4 ml-1" />
                </div>
                <Input
                  placeholder="88888 8888"
                  value={formData.phone_number}
                  onChange={(e) =>
                    setFormData({ ...formData, phone_number: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Job Description</Label>
            <Textarea
              placeholder="Enter Job Description..."
              value={formData.job_description}
              onChange={(e) =>
                setFormData({ ...formData, job_description: e.target.value })
              }
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label>Assessment Creation Preference</Label>
            <RadioGroup
              value={formData.creation_preference}
              onValueChange={(value) =>
                setFormData({ ...formData, creation_preference: value })
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="recruiter" id="recruiter" />
                <Label htmlFor="recruiter">
                  Recruiter will create their own questions
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="collaborate" id="collaborate" />
                <Label htmlFor="collaborate">
                  Collaborate with TechSmartHire for creation
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Custom Instructions</Label>
            <Textarea
              placeholder="Please detail on your requirement"
              value={formData.custom_instructions}
              onChange={(e) =>
                setFormData({ ...formData, custom_instructions: e.target.value })
              }
              className="min-h-[100px]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

