import { getLocationAndWorkPreferences } from "@/api/profile";
import Breadcrumbs from "@/components/common/breadcrumbs";
import EditLocationAndWorkPreference from "@/components/profile/candidate-profile/edit-location-and-work-preference";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function Page() {
  const routes = [
    {
      label: "Profile Details",
      href: "/profile-details/edit-account-and-identity",
    },
  ];

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const locationData = await getLocationAndWorkPreferences(token);

  return (
    <div>
      <Breadcrumbs
        routes={routes}
        currentRoute={{
          label: "Edit Location & Work Preferences",
        }}
      />
      <EditLocationAndWorkPreference locationData={locationData.data || null} />
    </div>
  );
}
