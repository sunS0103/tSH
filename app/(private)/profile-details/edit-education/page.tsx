import Breadcrumbs from "@/components/common/breadcrumbs";
import EditEducation from "@/components/profile/candidate-profile/edit-education";

export default function Page() {
  const routes = [{ label: "Profile Details", href: "/profile" }];

  return (
    <div>
      <Breadcrumbs
        routes={routes}
        currentRoute={{
          label: "Edit Education",
        }}
      />
      <EditEducation />
    </div>
  );
}
