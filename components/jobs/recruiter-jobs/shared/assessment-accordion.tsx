"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { type JobFormData } from "@/validation/job";
import { useState } from "react";
import RequestAssessmentDialog from "./request-assessment-dialog";

interface AssessmentAccordionProps {
  form: UseFormReturn<JobFormData>;
  requireAssessment: boolean;
}

export default function AssessmentAccordion({
  form,
  requireAssessment,
}: AssessmentAccordionProps) {
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [assessments, setAssessments] = useState<any[]>([]); // TODO: Fetch from API

  return (
    <>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="assessment" className="border-none">
          <AccordionTrigger className="bg-primary-50 rounded-t-2xl px-6 py-4 hover:no-underline cursor-pointer">
            <div className="flex flex-col items-start gap-1 flex-1">
              <p className="text-base font-semibold text-gray-950">
                Do you want to mandate a Skill Assessment score for{" "}
                <br />
                candidates to apply the Job?
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="bg-white rounded-b-2xl px-6 py-4">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="assessment_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-950">
                      Select Exam
                    </FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.setValue("require_assessment", true);
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-8 w-2/4">
                          <SelectValue placeholder="Select Exam" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {assessments.length === 0 ? (
                          <SelectItem value="none" disabled>
                            No assessments available
                          </SelectItem>
                        ) : (
                          assessments.map((assessment) => (
                            <SelectItem
                              key={assessment.id}
                              value={assessment.id}
                            >
                              {assessment.title}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center gap-2 text-sm">
                <p className="text-gray-600">
                  Not finding a relevant exam? Let's create one for your needs
                  –{" "}
                </p>
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto text-primary-600 underline font-semibold"
                  onClick={() => setIsRequestDialogOpen(true)}
                >
                  Request Now
                </Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <RequestAssessmentDialog
        open={isRequestDialogOpen}
        onOpenChange={setIsRequestDialogOpen}
      />
    </>
  );
}

