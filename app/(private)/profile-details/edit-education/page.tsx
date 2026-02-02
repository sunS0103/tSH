import { getEducation } from "@/api/profile";
import Breadcrumbs from "@/components/common/breadcrumbs";
import EditEducation from "@/components/profile/candidate-profile/edit-education";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function Page() {
  const routes = [
    {
      label: "Profile Details",
      href: "/profile-details/edit-account-and-identity",
    },
  ];

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const educationData = await getEducation(token);

  return (
    <div>
      <Breadcrumbs
        routes={routes}
        currentRoute={{
          label: "Edit Education",
        }}
      />
      <EditEducation educationData={educationData?.data || null} />
    </div>
  );
}
