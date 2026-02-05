// import Breadcrumbs from "@/components/common/breadcrumbs";
// import Settings from "@/components/settings";
import Breadcrumbs from "@/components/common/breadcrumbs";
import Settings from "@/components/settings";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Page() {
  const cookieStore = await cookies();
  const role = cookieStore.get("user_role")?.value;
  const routes = [{ label: "Dashboard", href: "/dashboard" }];

  if (role === "CANDIDATE") {
    redirect("/dashboard");
  }
  if (role === "RECRUITER") {
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
  return null;
}
