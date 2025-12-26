import Breadcrumbs from "@/components/common/breadcrumbs";
import EditIdentityAndAccount from "@/components/profile/candidate-profile/edit-identity-and-account";

export default function Page() {
  const routes = [{ label: "Profile Details", href: "/profile" }];
  return (
    <div className="mt-4">
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
