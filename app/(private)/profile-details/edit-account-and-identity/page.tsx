import { getCandidateProfile } from "@/api/profile";
import Breadcrumbs from "@/components/common/breadcrumbs";
import EditIdentityAndAccount from "@/components/profile/candidate-profile/edit-identity-and-account";
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
  const profileData = await getCandidateProfile(token);

  return (
    <div className="">
      <Breadcrumbs
        routes={routes}
        currentRoute={{
          label: "Edit Account and Identity",
        }}
      />
      <EditIdentityAndAccount profileData={profileData?.data || null} />
    </div>
  );
}
