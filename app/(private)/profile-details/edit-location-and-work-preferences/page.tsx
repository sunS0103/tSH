import Breadcrumbs from "@/components/common/breadcrumbs";
import EditLocationAndWorkPreference from "@/components/profile/candidate-profile/edit-location-and-work-preference";

export default function Page() {
  const routes = [{ label: "Profile Details", href: "/profile" }];

  return (
    <div>
      <Breadcrumbs
        routes={routes}
        currentRoute={{
          label: "Edit Location & Work Preferences",
        }}
      />
      <EditLocationAndWorkPreference />
    </div>
  );
}
