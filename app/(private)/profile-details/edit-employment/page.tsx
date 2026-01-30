import Breadcrumbs from "@/components/common/breadcrumbs";
import EditEmployment from "@/components/profile/candidate-profile/edit-employment";

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
          label: "Edit Current Employment Details",
        }}
      />
      <EditEmployment />
    </div>
  );
}
