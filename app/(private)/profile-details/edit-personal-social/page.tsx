import Breadcrumbs from "@/components/common/breadcrumbs";
import EditPersonalSocial from "@/components/profile/candidate-profile/edit-personal-social";

export const dynamic = "force-dynamic";

export default function Page() {
  const routes = [
    {
      label: "Profile Details",
      href: "/profile-details/edit-account-and-identity",
    },
  ];

  return (
    <div>
      <Breadcrumbs
        routes={routes}
        currentRoute={{
          label: "Edit Personal & Social",
        }}
      />
      <EditPersonalSocial />
    </div>
  );
}
