import ProfileOnboardingWrapper from "@/components/profile/profile-onboarding-wrapper";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function ProfileDetailsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const role = cookieStore.get("user_role")?.value;

  if (role === "RECRUITER") {
    redirect("/profile");
  }
  return <ProfileOnboardingWrapper>{children}</ProfileOnboardingWrapper>;
}
