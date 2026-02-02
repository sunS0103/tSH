"use client";

import { updateCandidateSocial } from "@/api/profile";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Icon } from "@iconify/react";

const editPersonalSocialSchema = z.object({
  headline: z
    .string()
    .min(1, "Short headline is required")
    .max(30, "Short headline must not exceed 30 characters"),
  bio: z
    .string()
    .min(150, "Description must be at least 150 characters")
    .max(500, "Description must not exceed 500 characters"),
  linkedin_url: z
    .string()
    .refine(
      (val) => !val || z.string().url().safeParse(val).success,
      "Please enter a valid LinkedIn URL"
    ),
  github_url: z
    .string()
    .refine(
      (val) => !val || z.string().url().safeParse(val).success,
      "Please enter a valid GitHub/Portfolio URL"
    ),
});

type EditPersonalSocialFormData = z.infer<typeof editPersonalSocialSchema>;

export default function EditPersonalSocial({
  personalSocialData,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  personalSocialData: any;
}) {
  const router = useRouter();
  // const cookieValue = getCookie("candidate_social_data");
  // const socialData = cookieValue ? JSON.parse(cookieValue as string) : null;
  const socialData = personalSocialData;

  const form = useForm<EditPersonalSocialFormData>({
    resolver: zodResolver(editPersonalSocialSchema),
    defaultValues: {
      headline: socialData?.headline || "",
      bio: socialData?.bio || "",
      linkedin_url: socialData?.linkedin_url || "",
      github_url: socialData?.github_url || "",
    },
  });

  const handleSubmit = async (data: EditPersonalSocialFormData) => {
    try {
      const response = await updateCandidateSocial({
        headline: data.headline,
        bio: data.bio,
        linkedin_url: data.linkedin_url || "",
        github_url: data.github_url || "",
      });

      if (response.success) {
        toast.success(response.message || "Profile updated successfully");
        // Navigate to next section in onboarding flow
        router.push("/profile-details/edit-employment");
      }
    } catch (error: unknown) {
      const errorMessage =
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data &&
        typeof error.response.data.message === "string"
          ? error.response.data.message
          : "Failed to update profile";
      toast.error(errorMessage);
    }
  };

  const handleCancel = () => {
    // Check if user is in onboarding flow or editing from profile
    const isOnboarding = window.location.pathname.includes("/profile-details/");
    router.push(
      isOnboarding ? "/profile-details/edit-account-and-identity" : "/profile"
    );
  };

  return (
    <div className="mt-4">
      <div className="bg-white border border-gray-200 rounded-2xl w-full overflow-hidden">
        {/* Header */}
        <div className="bg-primary-50 py-4 px-6">
          <h1 className="text-xl font-bold text-black">
            Edit Personal & Social
          </h1>
        </div>

        {/* Form */}
        <div className="p-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex flex-col gap-4"
            >
              {/* First Row: Short Headline and Describe Yourself */}
              <div className="flex items-start flex-col md:flex-row gap-4">
                <FormField
                  control={form.control}
                  name="headline"
                  render={({ field }) => {
                    const charCount = field.value?.length || 0;
                    return (
                      <FormItem className="w-full md:w-1/2">
                        <FormLabel
                          required
                          className="text-sm font-medium text-black"
                        >
                          Short Headline
                        </FormLabel>
                        <FormControl>
                          <div className="relative mb-2">
                            <Textarea
                              placeholder="Enter your short headline"
                              className="border-gray-900 resize-none max-h-25 min-h-25"
                              rows={5}
                              maxLength={30}
                              {...field}
                            />
                            <span className="absolute -bottom-5 right-0 text-xs text-gray-600">
                              {charCount} / 30
                            </span>
                          </div>
                        </FormControl>
                        <div className="text-xs text-gray-600 leading-relaxed space-y-1">
                          <p className="font-medium ">
                            This Short headline is the first thing recruiters
                            see.
                          </p>
                          <p>Use a clear, role-based title</p>
                          <p>Avoid skill lists - assessments show that.</p>
                          <p className="font-medium mt-2">Examples:</p>
                          <ul className="list-disc list-inside pl-2 space-y-0.5">
                            <li>QA Automation Engineer</li>
                            <li>SDET – Automation</li>
                            <li>Test Engineer</li>
                          </ul>
                        </div>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => {
                    const charCount = field.value?.length || 0;
                    return (
                      <FormItem className="w-full md:w-1/2">
                        <FormLabel
                          required
                          className="text-sm font-medium text-black"
                        >
                          Describe Yourself in Few Words
                        </FormLabel>
                        <FormControl>
                          <div className="relative mb-2">
                            <Textarea
                              placeholder="Describe yourself"
                              className="border-gray-900 resize-none max-h-25 min-h-25"
                              rows={5}
                              maxLength={500}
                              {...field}
                            />
                            <span className="absolute -bottom-5 right-0 text-xs text-gray-600">
                              {charCount} / 500
                            </span>
                          </div>
                        </FormControl>
                        <div className="text-xs text-gray-600 leading-relaxed space-y-1">
                          <p>
                            Use this space to briefly describe who you are as a
                            professional — your experience level, core
                            strengths, and the types of roles you're interested
                            in.
                          </p>
                          <p className="font-medium mt-2">
                            This is the only free-text section recruiters will
                            see.
                          </p>
                          <p>
                            All other profile insights are driven by your
                            assessment scores.
                          </p>
                          <div className="flex items-start gap-1.5 mt-2 p-2 bg-amber-50 border border-amber-200 rounded">
                            <Icon
                              icon="mdi:alert-circle-outline"
                              className="size-3.5 text-amber-600 mt-0.5 shrink-0"
                            />
                            <p className="text-amber-800">
                              Please do not include contact details, email IDs,
                              phone numbers, or external links.
                            </p>
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>

              {/* Second Row: LinkedIn URL */}
              <div className="flex flex-col md:flex-row gap-4">
                <FormField
                  control={form.control}
                  name="linkedin_url"
                  render={({ field }) => (
                    <FormItem className="w-full md:w-1/2">
                      <FormLabel className="text-sm font-medium text-black">
                        LinkedIn Profile URL
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="url"
                            placeholder="https://www.linkedin.com/in/your-profile"
                            className="h-8 border-gray-900 pr-10"
                            {...field}
                          />
                          <Icon
                            icon="material-symbols:link"
                            className="absolute right-3 top-1/2 -translate-y-1/2 size-4.5 text-gray-900 pointer-events-none"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 justify-end pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCancel}
                  className="h-8 px-4"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="h-8 px-4"
                  disabled={form.formState.isSubmitting}
                >
                  Update
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
      <div className="text-gray-500 mt-4 px-2">
        <div className="font-semibold text-sm">Notes:</div>
        <ul className="list-disc list-inside text-xs">
          {/* <li>Short Headline should be 80-120 characters long.</li> */}
          <li>
            Describe Yourself in Few Words should be 150-500 characters long.
          </li>
        </ul>
      </div>
    </div>
  );
}
