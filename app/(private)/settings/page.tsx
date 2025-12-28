import Breadcrumbs from "@/components/common/breadcrumbs";
import Settings from "@/components/settings";

export default function Page() {
  const routes = [{ label: "Dashboard", href: "/dashboard" }];
  return (
    <div>
      <Breadcrumbs
        routes={routes}
        currentRoute={{
          label: "Settings",
        }}
      />
      <Settings />
    </div>
  );
}
