import Breadcrumbs from "@/components/common/breadcrumbs";
import EditEmployment from "@/components/profile/candidate-profile/edit-employment";

export default function Page() {
  const routes = [{ label: "Profile Details", href: "/profile" }];

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
