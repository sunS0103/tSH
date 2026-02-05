"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { getCandidateSettings, updateCandidateSettings } from "@/api/settings";

const candidateSettingsSchema = z.object({
  allow_email_contact: z.boolean(),
  allow_phone_contact: z.boolean(),
  receive_job_alerts: z.boolean(),
  receive_assessment_updates: z.boolean(),
});

type CandidateSettingsFormData = z.infer<typeof candidateSettingsSchema>;

export default function CandidateSettings() {
  const form = useForm<CandidateSettingsFormData>({
    resolver: zodResolver(candidateSettingsSchema),
    defaultValues: {
      allow_email_contact: false,
      allow_phone_contact: false,
      receive_job_alerts: false,
      receive_assessment_updates: false,
    },
  });

  useEffect(() => {
    const loadSettings = async () => {
      await getCandidateSettings()
        .then((res) => {
          if (res.success) {
            form.reset({
              allow_email_contact: res.data.allow_email_contact ?? false,
              allow_phone_contact: res.data.allow_phone_contact ?? false,
              receive_job_alerts: res.data.receive_job_alerts ?? false,
              receive_assessment_updates:
                res.data.receive_assessment_updates ?? false,
            });
          }
        })
        .catch((error) => {
          const errorMessage =
            (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Failed to load settings";
          toast.error(errorMessage);
        });
    };

    loadSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggle = async (
    field: keyof CandidateSettingsFormData,
    value: boolean
  ) => {
    form.setValue(field, value);

    try {
      const currentValues = form.getValues();
      const response = await updateCandidateSettings(currentValues);

      if (response?.success) {
        toast.success(response.message || "Settings updated successfully");
      }
    } catch (error) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to update settings";
      toast.error(errorMessage);
      // Revert the change on error
      form.setValue(field, !value);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-purple-50 px-6 py-4">
        <h2 className="text-xl font-bold text-black">Notification</h2>
      </div>

      {/* Settings List */}
      <Form {...form}>
        <form className="flex flex-col gap-4 px-6 py-6">
          {/* Allow Email Contact */}
          <FormField
            control={form.control}
            name="allow_email_contact"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between w-full">
                  <Label className="text-sm font-medium text-black cursor-pointer">
                    Allow recruiters to contact me via email
                  </Label>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(checked) =>
                        handleToggle("allow_email_contact", checked)
                      }
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />

          {/* Allow Phone Contact */}
          <FormField
            control={form.control}
            name="allow_phone_contact"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between w-full">
                  <Label className="text-sm font-medium text-black cursor-pointer">
                    Allow recruiters to contact me via phone/WhatsApp
                  </Label>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(checked) =>
                        handleToggle("allow_phone_contact", checked)
                      }
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />

          {/* Receive Job Alerts */}
          <FormField
            control={form.control}
            name="receive_job_alerts"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between w-full">
                  <Label className="text-sm font-medium text-black cursor-pointer">
                    Send me job alerts based on my skills
                  </Label>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(checked) =>
                        handleToggle("receive_job_alerts", checked)
                      }
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />

          {/* Receive Assessment Updates */}
          <FormField
            control={form.control}
            name="receive_assessment_updates"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between w-full">
                  <Label className="text-sm font-medium text-black cursor-pointer">
                    Send updates about new assessments
                  </Label>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(checked) =>
                        handleToggle("receive_assessment_updates", checked)
                      }
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
