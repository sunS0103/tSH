import Breadcrumbs from "@/components/common/breadcrumbs";
import EditSkills from "@/components/profile/candidate-profile/edit-skills";

export default function Page() {
  const routes = [{ label: "Profile Details", href: "/profile" }];
  return (
    <div>
      <Breadcrumbs
        routes={routes}
        currentRoute={{
          label: "Edit Skills & Domains",
        }}
      />
      <EditSkills />
    </div>
  );
}
