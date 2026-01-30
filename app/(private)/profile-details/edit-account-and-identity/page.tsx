import Breadcrumbs from "@/components/common/breadcrumbs";
import EditIdentityAndAccount from "@/components/profile/candidate-profile/edit-identity-and-account";

export const dynamic = "force-dynamic";

export default function Page() {
  const routes = [
    {
      label: "Profile Details",
      href: "/profile-details/edit-account-and-identity",
    },
  ];
  return (
    <div className="">
      <Breadcrumbs
        routes={routes}
        currentRoute={{
          label: "Edit Account and Identity",
        }}
      />
      <EditIdentityAndAccount />
    </div>
  );
}
