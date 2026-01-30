// import Breadcrumbs from "@/components/common/breadcrumbs";
// import Settings from "@/components/settings";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function Page() {
  redirect("/dashboard");

  // const routes = [{ label: "Dashboard", href: "/dashboard" }];

  // return (
  //   <div>
  //     <Breadcrumbs
  //       routes={routes}
  //       currentRoute={{
  //         label: "Settings",
  //       }}
  //     />
  //     <Settings />
  //   </div>
  // );
}
