import { getSkills } from "@/api/profile";
import Breadcrumbs from "@/components/common/breadcrumbs";
import EditSkills from "@/components/profile/candidate-profile/edit-skills";
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
  const skillsData = await getSkills(token);
  return (
    <div>
      <Breadcrumbs
        routes={routes}
        currentRoute={{
          label: "Edit Skills & Domains",
        }}
      />
      <EditSkills skillsData={skillsData?.data || null} />
    </div>
  );
}
