"use client";

import { updateLocationAndWorkPreferences } from "@/api/profile";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { getCookie } from "cookies-next/client";
import { CountryDropdown } from "@/components/ui/country-dropdown";
import { CityDropdownIndependent } from "@/components/ui/city-dropdown-independent";
import { CityMultiSelect } from "@/components/ui/city-multi-select";
import { WorkModeMultiSelect } from "@/components/ui/work-mode-multi-select";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { getWorkModes } from "@/api/seeder";

const locationAndWorkPreferenceSchema = z
  .object({
    city_id: z.number().min(1, "Current city is required"),
    country_id: z.number().min(1, "Current country is required"),
    preferred_cities: z
      .array(z.number())
      .min(1, "At least one preferred work location is required"),
    preferred_work_modes: z
      .array(z.number())
      .min(1, "At least one work mode is required"),
    is_citizen_of_work_country: z.boolean(),
    visa_type: z.string().optional(),
    willing_to_relocate: z.boolean().optional(),
    open_to_remote_only: z.boolean().optional(),
    open_to_contract_to_hire: z.boolean().optional(),
  })
  .refine(
    (data) => {
      // If NOT a citizen, visa_type is required
      if (data.is_citizen_of_work_country) {
        return data.visa_type !== undefined && data.visa_type !== "";
      }
      return true;
    },
    {
      message: "Visa type is required when you are not a citizen",
      path: ["visa_type"],
    }
  )
  .refine(
    (data) => {
      // If IS a citizen, these fields are required
      if (data.is_citizen_of_work_country) {
        return (
          data.willing_to_relocate !== undefined &&
          data.open_to_remote_only !== undefined &&
          data.open_to_contract_to_hire !== undefined
        );
      }
      return true;
    },
    {
      message: "All fields are required when you are a citizen",
      path: ["willing_to_relocate"],
    }
  );

type LocationAndWorkPreferenceFormData = z.infer<
  typeof locationAndWorkPreferenceSchema
>;

export default function EditLocationAndWorkPreference() {
  const router = useRouter();
  const cookieValue = getCookie("location_and_work_preferences_data");
  const locationData = cookieValue ? JSON.parse(cookieValue as string) : null;

  const [workModeOptions, setWorkModeOptions] = useState<
    { id: number; name: string }[]
  >([]);

  useEffect(() => {
    getWorkModes()
      .then((response) => {
        setWorkModeOptions(
          response?.modes
            ?.filter((item: { id: number; name: string }) => item.id != null)
            ?.map((item: { id: number; name: string }) => ({
              id: item.id,
              name: item.name,
            })) || []
        );
      })
      .catch((error) => {
        toast.error(
          (error as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || "Failed to fetch work modes"
        );
      });
  }, []);

  const form = useForm<LocationAndWorkPreferenceFormData>({
    resolver: zodResolver(locationAndWorkPreferenceSchema),
    defaultValues: {
      city_id: (() => {
        // Handle city_id - could be number or object
        if (locationData?.city_id) {
          return typeof locationData.city_id === "object"
            ? locationData.city_id?.id || 0
            : locationData.city_id;
        }
        // Handle current_city - could be number or object
        if (locationData?.current_city) {
          return typeof locationData.current_city === "object"
            ? locationData.current_city?.id || 0
            : locationData.current_city;
        }
        return 0;
      })(),
      country_id: (() => {
        // Handle country_id - could be number or object
        if (locationData?.country_id) {
          return typeof locationData.country_id === "object"
            ? locationData.country_id?.id || 0
            : locationData.country_id;
        }
        // Handle current_country - could be number or object
        if (locationData?.current_country) {
          return typeof locationData.current_country === "object"
            ? locationData.current_country?.id || 0
            : locationData.current_country;
        }
        return 0;
      })(),
      preferred_cities:
        locationData?.preferred_cities?.map((c: { id: number }) => c.id) ||
        (Array.isArray(locationData?.preferred_cities)
          ? locationData.preferred_cities
          : locationData?.preferred_cities
          ? [locationData.preferred_cities]
          : []),
      preferred_work_modes:
        locationData?.preferred_work_modes?.map(
          (mode: { id: number } | number) =>
            typeof mode === "object" ? mode.id : mode
        ) || [],
      is_citizen_of_work_country:
        locationData?.is_citizen_of_work_country ?? true,
      visa_type: locationData?.visa_type || "",
      willing_to_relocate: locationData?.willing_to_relocate ?? false,
      open_to_remote_only: locationData?.open_to_remote_only ?? false,
      open_to_contract_to_hire: locationData?.open_to_contract_to_hire ?? false,
    },
  });

  const isCitizen = form.watch("is_citizen_of_work_country");

  const handleSubmit = async (data: LocationAndWorkPreferenceFormData) => {
    try {
      const payload = {
        city_id: data.city_id,
        country_id: data.country_id,
        preferred_cities: data.preferred_cities,
        preferred_work_modes: data.preferred_work_modes,
        is_citizen_of_work_country: data.is_citizen_of_work_country,
        ...(data.is_citizen_of_work_country
          ? {
              // If citizen, send these fields
              willing_to_relocate: data.willing_to_relocate,
              open_to_remote_only: data.open_to_remote_only,
              open_to_contract_to_hire: data.open_to_contract_to_hire,
            }
          : {
              // If not citizen, send visa_type
              visa_type: data.visa_type,
            }),
      };

      const response = await updateLocationAndWorkPreferences(payload);

      if (response.success) {
        toast.success(
          response.message ||
            "Location and work preferences updated successfully"
        );
        router.push("/profile");
      }
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to update location and work preferences";
      toast.error(errorMessage);
    }
  };

  const handleCancel = () => {
    router.push("/profile");
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-3xl mx-auto mt-4 overflow-hidden">
      {/* Header */}
      <div className="bg-purple-50 px-6 py-4">
        <h2 className="text-xl font-bold text-black">
          Edit Location & Work Preferences
        </h2>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-4 p-6"
        >
          {/* Current City and Current Country */}
          <div className="flex flex-col md:flex-row gap-4">
            <FormField
              control={form.control}
              name="city_id"
              render={({ field }) => (
                <FormItem className="w-full md:w-1/2">
                  <Label className="text-sm font-medium text-black">
                    Current City
                  </Label>
                  <FormControl>
                    <CityDropdownIndependent
                      value={typeof field.value === "number" ? field.value : 0}
                      onValueChange={(cityId) => {
                        // Ensure we always pass a number
                        field.onChange(typeof cityId === "number" ? cityId : 0);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country_id"
              render={({ field }) => (
                <FormItem className="w-full md:w-1/2">
                  <Label className="text-sm font-medium text-black">
                    Current Country
                  </Label>
                  <FormControl>
                    <CountryDropdown
                      value={typeof field.value === "number" ? field.value : 0}
                      onValueChange={(countryId) => {
                        // Ensure we always pass a number
                        field.onChange(
                          typeof countryId === "number" ? countryId : 0
                        );
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Preferred Work Locations and Preferred Work Mode */}
          <div className="flex flex-col md:flex-row gap-4">
            <FormField
              control={form.control}
              name="preferred_cities"
              render={({ field }) => (
                <FormItem className="w-full md:w-1/2">
                  <Label className="text-sm font-medium text-black">
                    Preferred Work Locations
                  </Label>
                  <FormControl>
                    <CityMultiSelect
                      value={field.value}
                      onValueChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preferred_work_modes"
              render={({ field }) => (
                <FormItem className="w-full md:w-1/2">
                  <Label className="text-sm font-medium text-black">
                    Preferred Work Mode
                  </Label>
                  <FormControl>
                    <WorkModeMultiSelect
                      value={field.value}
                      onValueChange={field.onChange}
                      options={workModeOptions || []}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Are you a citizen? */}
          <div className="flex flex-col gap-2.5">
            <Label className="text-base font-medium text-black">
              Are you a citizen or permanent resident of the country where you
              prefer to work?
            </Label>
            <FormField
              control={form.control}
              name="is_citizen_of_work_country"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) =>
                        field.onChange(value === "true")
                      }
                      value={field.value ? "true" : "false"}
                      className="flex flex-col gap-2"
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="true" id="citizen-yes" />
                        <Label
                          htmlFor="citizen-yes"
                          className="text-sm font-normal text-gray-900 cursor-pointer"
                        >
                          Yes
                        </Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="false" id="citizen-no" />
                        <Label
                          htmlFor="citizen-no"
                          className="text-sm font-normal text-gray-900 cursor-pointer"
                        >
                          No
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Visa Type - Only shown when citizen = No */}
          {isCitizen && (
            <div className="flex flex-col md:flex-row gap-4">
              <FormField
                control={form.control}
                name="visa_type"
                render={({ field }) => (
                  <FormItem className="w-full md:w-1/2">
                    <Label className="text-sm font-medium text-black">
                      What type of visa do you currently hold?
                    </Label>
                    <FormControl>
                      <Input
                        placeholder="Enter visa type"
                        className="h-8 border-gray-900"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* Fields shown when citizen = Yes */}
          {isCitizen && (
            <>
              <div className="flex flex-col gap-2.5">
                <Label className="text-base font-medium text-black">
                  Willing to relocate within your authorized work country?
                </Label>
                <FormField
                  control={form.control}
                  name="willing_to_relocate"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) =>
                            field.onChange(value === "true")
                          }
                          value={field.value ? "true" : "false"}
                          className="flex flex-col gap-2"
                        >
                          <div className="flex items-center gap-3">
                            <RadioGroupItem value="true" id="relocate-yes" />
                            <Label
                              htmlFor="relocate-yes"
                              className="text-sm font-normal text-gray-900 cursor-pointer"
                            >
                              Yes
                            </Label>
                          </div>
                          <div className="flex items-center gap-3">
                            <RadioGroupItem value="false" id="relocate-no" />
                            <Label
                              htmlFor="relocate-no"
                              className="text-sm font-normal text-gray-900 cursor-pointer"
                            >
                              No
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Open to remote-only roles? */}
              <div className="flex flex-col gap-2.5">
                <Label className="text-base font-medium text-black">
                  Open to remote-only roles?
                </Label>
                <FormField
                  control={form.control}
                  name="open_to_remote_only"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) =>
                            field.onChange(value === "true")
                          }
                          value={field.value ? "true" : "false"}
                          className="flex flex-col gap-2"
                        >
                          <div className="flex items-center gap-3">
                            <RadioGroupItem value="true" id="remote-yes" />
                            <Label
                              htmlFor="remote-yes"
                              className="text-sm font-normal text-gray-900 cursor-pointer"
                            >
                              Yes
                            </Label>
                          </div>
                          <div className="flex items-center gap-3">
                            <RadioGroupItem value="false" id="remote-no" />
                            <Label
                              htmlFor="remote-no"
                              className="text-sm font-normal text-gray-900 cursor-pointer"
                            >
                              No
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Are you open to Contract to Hire positions? */}
              <div className="flex flex-col gap-2.5">
                <Label className="text-base font-medium text-black">
                  Are you open to Contract to Hire positions?
                </Label>
                <FormField
                  control={form.control}
                  name="open_to_contract_to_hire"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) =>
                            field.onChange(value === "true")
                          }
                          value={field.value ? "true" : "false"}
                          className="flex flex-col gap-2"
                        >
                          <div className="flex items-center gap-3">
                            <RadioGroupItem value="true" id="contract-yes" />
                            <Label
                              htmlFor="contract-yes"
                              className="text-sm font-normal text-gray-900 cursor-pointer"
                            >
                              Yes
                            </Label>
                          </div>
                          <div className="flex items-center gap-3">
                            <RadioGroupItem value="false" id="contract-no" />
                            <Label
                              htmlFor="contract-no"
                              className="text-sm font-normal text-gray-900 cursor-pointer"
                            >
                              No
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </>
          )}

          {/* Buttons */}
          <div className="flex gap-3 justify-end pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              className="h-8 px-4 "
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
  );
}
