import { getCandidateSocial } from "@/api/profile";
import Breadcrumbs from "@/components/common/breadcrumbs";
import EditPersonalSocial from "@/components/profile/candidate-profile/edit-personal-social";
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
  const personalSocialData = await getCandidateSocial(token);

  return (
    <div>
      <Breadcrumbs
        routes={routes}
        currentRoute={{
          label: "Edit Personal & Social",
        }}
      />
      <EditPersonalSocial
        personalSocialData={personalSocialData?.data || null}
      />
    </div>
  );
}
