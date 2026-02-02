import { getCurrentEmploymentDetails } from "@/api/profile";
import Breadcrumbs from "@/components/common/breadcrumbs";
import EditEmployment from "@/components/profile/candidate-profile/edit-employment";
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
  const currentEmploymentData = await getCurrentEmploymentDetails(token);

  return (
    <div>
      <Breadcrumbs
        routes={routes}
        currentRoute={{
          label: "Edit Current Employment Details",
        }}
      />
      <EditEmployment
        currentEmploymentData={currentEmploymentData?.data || null}
      />
    </div>
  );
}
